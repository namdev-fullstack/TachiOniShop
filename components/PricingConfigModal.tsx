"use client";

import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Calculator,
  Save,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  PricingTier,
  DEFAULT_PRICING_TIERS,
  calculateAccountPrice,
  formatVND,
} from "@/lib/priceUtils";

interface PricingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess?: () => void;
  isAdmin: boolean;
}

export default function PricingConfigModal({
  isOpen,
  onClose,
  onUpdateSuccess,
  isAdmin,
}: PricingConfigModalProps) {
  const [tiers, setTiers] = useState<PricingTier[]>(DEFAULT_PRICING_TIERS);
  const [loading, setLoading] = useState(false);
  const [savingTiers, setSavingTiers] = useState(false);
  const [applyingBatch, setApplyingBatch] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetScope, setTargetScope] = useState<"all" | "staff_only">("all");

  // State test thử giá nhanh
  const [testPriceInput, setTestPriceInput] = useState<string>("850000");

  // State preview tài khoản bị ảnh hưởng
  const [previewAccounts, setPreviewAccounts] = useState<any[]>([]);
  const [totalAccountsCount, setTotalAccountsCount] = useState(0);

  // Load config từ Firestore
  useEffect(() => {
    if (!isOpen) return;

    const loadConfig = async () => {
      try {
        setLoading(true);
        const configDoc = await getDoc(doc(db, "settings", "pricing_tiers"));
        if (configDoc.exists() && Array.isArray(configDoc.data()?.tiers)) {
          setTiers(configDoc.data().tiers);
        } else {
          setTiers(DEFAULT_PRICING_TIERS);
        }
      } catch (err) {
        console.error("Lỗi tải cấu hình % mốc:", err);
        setTiers(DEFAULT_PRICING_TIERS);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [isOpen]);

  // Cập nhật % của 1 tier
  const handlePercentChange = (tierId: string, val: string) => {
    const num = Math.max(0, Math.min(500, Number(val.replace(/\D/g, "")) || 0));
    setTiers((prev) =>
      prev.map((t) => (t.id === tierId ? { ...t, markupPercent: num } : t))
    );
  };

  // Reset về mặc định
  const handleResetDefault = () => {
    setTiers(DEFAULT_PRICING_TIERS);
    toast.info("Đã đặt lại các mốc % về mặc định ban đầu");
  };

  // Lưu cấu hình % vào Firestore
  const handleSaveTiers = async () => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền thay đổi cấu hình mốc %!");
      return;
    }

    try {
      setSavingTiers(true);
      await setDoc(doc(db, "settings", "pricing_tiers"), {
        tiers,
        updated_at: new Date(),
      });
      toast.success("Đã lưu cấu hình mốc % thành công! 🚀");
    } catch (err) {
      console.error("Lỗi lưu cấu hình %:", err);
      toast.error("Lỗi khi lưu cấu hình %");
    } finally {
      setSavingTiers(false);
    }
  };

  // Tính thử cho input test
  const testCalculation = useMemo(() => {
    return calculateAccountPrice(testPriceInput, true, tiers);
  }, [testPriceInput, tiers]);

  // Chuẩn bị mở modal xác nhận áp dụng cho acc trước đó
  const handleOpenConfirmApply = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "accounts"));
      const allDocs = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTotalAccountsCount(allDocs.length);

      // Tạo preview cho 5 acc đầu tiên
      const previews = allDocs.slice(0, 5).map((acc: any) => {
        const orig = Number(acc.original_price || acc.price || 0);
        const res = calculateAccountPrice(orig, true, tiers);
        return {
          id: acc.id,
          code: acc.code,
          seller_name: acc.seller_name || (acc.seller_role === "admin" ? "Admin" : "Cộng tác viên"),
          original_price: orig,
          old_selling_price: Number(acc.price || 0),
          old_markup: acc.markup_percent || 0,
          new_selling_price: res.sellingPrice,
          new_markup: res.markupPercent,
          new_profit: res.profit,
        };
      });

      setPreviewAccounts(previews);
      setConfirmOpen(true);
    } catch (err) {
      console.error("Lỗi khi chuẩn bị danh sách cập nhật:", err);
      toast.error("Không thể lấy danh sách sản phẩm để áp dụng");
    } finally {
      setLoading(false);
    }
  };

  // Thực hiện cập nhật hàng loạt cho toàn bộ acc trước đó
  const handleConfirmBatchUpdate = async () => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền cập nhật toàn bộ tài khoản!");
      return;
    }

    try {
      setApplyingBatch(true);

      // Lưu trước cài đặt mốc % hiện tại
      await setDoc(doc(db, "settings", "pricing_tiers"), {
        tiers,
        updated_at: new Date(),
      });

      const querySnapshot = await getDocs(collection(db, "accounts"));
      let updatedCount = 0;

      // Chia nhỏ thành các batch 400 docs (giới hạn Firestore là 500)
      const docs = querySnapshot.docs;
      const CHUNK_SIZE = 400;

      for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
        const chunk = docs.slice(i, i + CHUNK_SIZE);
        const batch = writeBatch(db);

        chunk.forEach((d) => {
          const data = d.data();

          // Lọc theo scope nếu chọn
          if (targetScope === "staff_only" && data.seller_role === "admin") {
            return;
          }

          const originalPrice = Number(data.original_price !== undefined ? data.original_price : data.price || 0);
          if (originalPrice <= 0) return;

          const calc = calculateAccountPrice(originalPrice, true, tiers);

          // Cập nhật fake_price nếu nó thấp hơn giá bán mới
          let newFakePrice = Number(data.fake_price || 0);
          if (newFakePrice <= calc.sellingPrice) {
            newFakePrice = Math.round(calc.sellingPrice * 1.5);
          }

          batch.update(doc(db, "accounts", d.id), {
            original_price: originalPrice,
            price: calc.sellingPrice,
            markup_percent: calc.markupPercent,
            fake_price: newFakePrice,
            updated_at: new Date(),
          });

          updatedCount++;
        });

        await batch.commit();
      }

      toast.success(
        `Đã cập nhật thành công ${updatedCount} tài khoản theo bảng % mới! 🚀`
      );
      setConfirmOpen(false);
      onClose();
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật tài khoản hàng loạt:", err);
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật tài khoản");
    } finally {
      setApplyingBatch(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 bg-white rounded-2xl">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-lg sm:text-xl font-black text-slate-900">
                    Cấu hình mốc tăng % giá & lợi nhuận tài khoản
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    Tùy chỉnh tỉ lệ tăng giá theo giá gốc nhập vào và làm tròn số tự động
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Quy tắc làm tròn số */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200/80 rounded-xl p-3.5 text-xs text-indigo-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-indigo-800">
              <Info className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Quy tắc làm tròn số tự động:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700 ml-1">
              <li>
                Acc giá gốc <strong>&lt; 300.000đ</strong>: Làm tròn lên mốc{" "}
                <strong className="text-indigo-700">5.000đ</strong> gần nhất (ví dụ: 144k → 145k).
              </li>
              <li>
                Acc giá gốc <strong>≥ 300.000đ</strong>: Làm tròn lên mốc{" "}
                <strong className="text-indigo-700">10.000đ</strong> gần nhất (ví dụ: 1.105k → 1.110k).
              </li>
            </ul>
          </div>

          {/* Bảng các mốc % */}
          <div className="space-y-2 mt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Bảng 6 mốc tăng giá phần trăm (%)
              </h3>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Khôi phục mặc định
                </button>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">Mốc giá gốc (Nhập vào)</th>
                    <th className="py-2.5 px-3 text-center w-28">Tăng thêm (%)</th>
                    <th className="py-2.5 px-3">Ví dụ minh họa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tiers.map((tier) => (
                    <tr key={tier.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        {tier.label}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="inline-flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-2 py-1 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                          <span className="text-xs font-bold text-indigo-600">+</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            disabled={!isAdmin}
                            value={tier.markupPercent}
                            onChange={(e) => handlePercentChange(tier.id, e.target.value)}
                            className="w-10 text-center font-black text-xs outline-none bg-transparent text-slate-900 disabled:opacity-75"
                          />
                          <span className="text-xs font-bold text-slate-500">%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-slate-600">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {tier.exampleText}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Công cụ test tính giá trực tiếp */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5 mt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                Công cụ thử nghiệm tính giá nhanh:
              </span>
              <span className="text-[11px] text-slate-500">Nhập thử giá gốc bất kỳ để xem kết quả</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-center">
              <div>
                <Label className="text-[10px] font-bold text-slate-500">Giá gốc (nhập vào):</Label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={formatVND(testPriceInput)}
                    onChange={(e) => setTestPriceInput(e.target.value.replace(/\D/g, ""))}
                    className="w-full bg-white border border-slate-200 h-9 px-2.5 pr-6 rounded-lg text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                    ₫
                  </span>
                </div>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Mức % áp dụng:</span>
                <span className="text-xs font-black text-indigo-600">
                  +{testCalculation.markupPercent}%
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Lợi nhuận shop:</span>
                <span className="text-xs font-bold text-emerald-600">
                  +{formatVND(testCalculation.profit)}
                </span>
              </div>

              <div className="bg-indigo-600 text-white p-2 rounded-lg text-center shadow-xs">
                <span className="text-[10px] text-indigo-100 block">Giá bán ra Web:</span>
                <span className="text-xs font-black">
                  {formatVND(testCalculation.sellingPrice)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-xs font-medium"
              >
                Đóng
              </Button>
              {isAdmin && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveTiers}
                  disabled={savingTiers}
                  className="text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {savingTiers ? "Đang lưu..." : "Lưu mốc %"}
                </Button>
              )}
            </div>

            {isAdmin && (
              <Button
                type="button"
                onClick={handleOpenConfirmApply}
                disabled={loading || applyingBatch}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Áp dụng cho toàn bộ acc trước đó
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal xác nhận áp dụng hàng loạt */}
      <Dialog open={confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(false)}>
        <DialogContent className="max-w-xl p-5 sm:p-6 bg-white rounded-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <DialogTitle className="text-lg font-black text-slate-900">
                Xác nhận áp dụng lại giá & lợi nhuận hàng loạt
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-600">
              Thao tác này sẽ quét toàn bộ <strong>{totalAccountsCount} tài khoản</strong> trong hệ
              thống, tính toán lại giá bán trên Web, % chênh lệch và tiền lợi nhuận dựa trên bảng
              mốc mới và quy tắc làm tròn (5k/10k).
            </DialogDescription>
          </DialogHeader>

          {/* Lựa chọn phạm vi */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-bold text-slate-700">Phạm vi áp dụng:</Label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                  targetScope === "all"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === "all"}
                  onChange={() => setTargetScope("all")}
                  className="sr-only"
                />
                <CheckCircle2
                  className={`w-4 h-4 ${
                    targetScope === "all" ? "text-indigo-600" : "text-slate-300"
                  }`}
                />
                Tất cả tài khoản ({totalAccountsCount})
              </label>

              <label
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                  targetScope === "staff_only"
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name="scope"
                  checked={targetScope === "staff_only"}
                  onChange={() => setTargetScope("staff_only")}
                  className="sr-only"
                />
                <CheckCircle2
                  className={`w-4 h-4 ${
                    targetScope === "staff_only" ? "text-indigo-600" : "text-slate-300"
                  }`}
                />
                Chỉ tài khoản Cộng tác viên
              </label>
            </div>
          </div>

          {/* Xem trước mẫu thay đổi */}
          {previewAccounts.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Xem trước một số acc thay đổi:
              </Label>
              <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-[11px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2 text-left">Mã acc</th>
                      <th className="p-2 text-left">Giá gốc</th>
                      <th className="p-2 text-left">Giá bán cũ</th>
                      <th className="p-2 text-left">Giá bán mới</th>
                      <th className="p-2 text-right">Lợi nhuận mới</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewAccounts.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-indigo-600">
                          #{item.code}
                        </td>
                        <td className="p-2 text-slate-700">{formatVND(item.original_price)}</td>
                        <td className="p-2 text-slate-400 line-through">
                          {formatVND(item.old_selling_price)}
                        </td>
                        <td className="p-2 font-bold text-indigo-700">
                          {formatVND(item.new_selling_price)}
                          <span className="text-[9px] text-indigo-600 block">
                            (+{item.new_markup}%)
                          </span>
                        </td>
                        <td className="p-2 font-bold text-emerald-600 text-right">
                          +{formatVND(item.new_profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={applyingBatch}
              className="text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="button"
              onClick={handleConfirmBatchUpdate}
              disabled={applyingBatch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              {applyingBatch ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5" />
                  Đang cập nhật...
                </>
              ) : (
                "Xác nhận cập nhật ngay"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
