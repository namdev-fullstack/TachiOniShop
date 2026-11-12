"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { generateCode } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  ShieldCheck,
  Flame,
  ZoomIn,
  Sparkles,
  AlertCircle,
  DollarSign,
  Trash2,
  Tag,
} from "lucide-react";
import Link from "next/link";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";
import { useAdminAuth } from "@/components/AdminLogin";
import { calculateAccountPrice, formatVND } from "@/lib/priceUtils";
import { usePricingTiers } from "@/hooks/usePricingTiers";

const ranks = [
  "Trong Ảnh",
  "Đồng",
  "Vàng",
  "Kim Cương",
  "Cao Thủ",
  "Chiến Tướng",
  "Chiến Thần",
  "Reset",
];

function MoneyInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const handleChange = (e: any) => {
    const raw = e.target.value.replace(/\D/g, "");
    onChange(raw);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={formatVND(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-slate-200 h-10 px-3 pr-8 rounded-lg mt-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm font-semibold text-slate-800 bg-white"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
        ₫
      </span>
    </div>
  );
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { user, profile, isAdmin, isStaff } = useAdminAuth();

  const [form, setForm] = useState({
    code: "",
    title: "",
    rank: "Trong Ảnh",
    price: "", // Với nhân viên là giá thật. Với admin là giá bán.
    original_price: "",
    markup_percent: 0,
    fake_price: "",
    is_white: true,
    is_sale: false,
    highlight: "",
    status: "unsold" as "sold" | "installment" | "unsold" | "hidden",
    seller_id: "",
    seller_name: "",
    seller_role: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, images: lightboxImages, currentIndex, openLightbox, closeLightbox } = useImageLightbox();
  const { tiers } = usePricingTiers();

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "accounts", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          // Kiểm tra quyền: Nhân viên chỉ được sửa sản phẩm của mình
          if (
            isStaff &&
            user &&
            data.seller_id &&
            data.seller_id !== user.uid &&
            data.seller_email !== user.email
          ) {
            toast.error("Bạn không có quyền chỉnh sửa sản phẩm của người khác!");
            router.push("/admin/products");
            return;
          }

          const isWhite =
            data.is_white !== undefined
              ? data.is_white
              : data.category?.id === "white" ||
                data.category_id === "white" ||
                (data.category?.name || "").toLowerCase().includes("trắng");

          // Với nhân viên: lấy giá thật đã lưu (hoặc fallback về price)
          const origPrice = data.original_price !== undefined ? data.original_price : data.price;
          const displayPriceForStaff = origPrice ? origPrice.toString() : "";
          const displayPriceForAdmin = data.price ? data.price.toString() : "";

          setForm({
            code: data.code || generateCode(),
            title: data.title || data.highlight || "",
            rank: data.rank || "Trong Ảnh",
            price: isStaff ? displayPriceForStaff : displayPriceForAdmin,
            original_price: origPrice ? origPrice.toString() : "",
            markup_percent: data.markup_percent || 0,
            fake_price: data.fake_price?.toString() || "",
            is_white: Boolean(isWhite),
            is_sale: data.is_sale || false,
            highlight: data.highlight || "",
            status: data.status || "unsold",
            seller_id: data.seller_id || "",
            seller_name: data.seller_name || "",
            seller_role: data.seller_role || "",
          });
          setImages(data.images || []);
        } else {
          toast.error("Không tìm thấy sản phẩm");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProduct();
    }
  }, [productId, router, user, isStaff]);

  // Preview tính giá tự động (Admin bán trực tiếp, CTV tính theo mốc)
  const priceCalculation = useMemo(() => {
    return calculateAccountPrice(form.price, !isAdmin, tiers);
  }, [form.price, isAdmin, tiers]);

  // Submit cập nhật sản phẩm
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cleanCode = form.code.replace(/\D/g, "").slice(0, 5);
    if (cleanCode.length !== 5) {
      toast.error("Mã acc bắt buộc gồm đúng 5 chữ số ⚠️");
      return;
    }

    const inputPrice = Number(form.price);
    if (!form.title.trim() || !form.rank || inputPrice <= 0) {
      toast.error("Vui lòng nhập đủ Tiêu đề và Giá ⚠️");
      return;
    }

    const finalSellingPrice = priceCalculation.sellingPrice;
    const finalOriginalPrice = inputPrice;
    const finalFakePrice = form.fake_price
      ? Number(form.fake_price)
      : Math.round(finalSellingPrice * 1.5);

    try {
      setSaving(true);

      await updateDoc(doc(db, "accounts", productId), {
        code: cleanCode,
        title: form.title.trim(),
        highlight: form.highlight.trim() || form.title.trim(),
        rank: form.rank,
        price: finalSellingPrice,
        original_price: finalOriginalPrice,
        markup_percent: priceCalculation.markupPercent,
        fake_price: finalFakePrice,
        is_white: form.is_white,
        is_sale: form.is_sale,
        status: form.status,
        category: form.is_white
          ? { id: "white", name: "Trắng Thông Tin" }
          : { id: "info", name: "Có Thông Tin" },
        category_id: form.is_white ? "white" : "info",
        updated_at: new Date(),
      });

      toast.success(`Đã cập nhật sản phẩm #${cleanCode} thành công! 🚀`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Lỗi cập nhật sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async () => {
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "accounts", productId));
      toast.success(`Đã xóa sản phẩm #${form.code} thành công`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Lỗi xóa sản phẩm");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3" />
          <div className="text-slate-600 font-medium">Đang tải dữ liệu sản phẩm...</div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="mb-2 text-xs -ml-2 text-slate-600">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                  Quay lại danh sách
                </Button>
              </Link>
              <h1 className="text-2xl font-black text-slate-900">Chỉnh sửa tài khoản</h1>
              <p className="text-xs text-slate-500">
                Mã acc: <strong className="text-indigo-600 font-mono">#{form.code}</strong>
                {form.seller_name && ` • Đăng bởi: ${form.seller_name}`}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Xóa tài khoản
            </Button>
          </div>

          <Card className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 text-white p-5">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <span>Thông tin tài khoản</span>
                <span className="text-xs font-normal text-slate-400">
                  {isStaff ? "Quyền Cộng tác viên" : "Quyền Admin"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Code (5 số) & Rank */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Mã Acc (5 số)</Label>
                    <div className="flex gap-1.5 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          #
                        </span>
                        <Input
                          value={form.code}
                          maxLength={5}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                            setForm({ ...form, code: val });
                          }}
                          className="pl-6 font-mono font-bold text-sm h-10 border-slate-200"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, code: generateCode() })}
                        title="Đổi mã ngẫu nhiên"
                        className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Rank</Label>
                    <select
                      value={form.rank}
                      onChange={(e) => setForm({ ...form, rank: e.target.value })}
                      className="w-full border border-slate-200 p-2 rounded-lg mt-1 text-sm h-10 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {ranks.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Row 2: Title */}
                <div>
                  <Label className="text-xs font-bold text-slate-700">Title (Tiêu đề tài khoản)</Label>
                  <Input
                    value={form.title}
                    placeholder="VD: Nak thứ nguyên, Flo tinh hệ, Flo hổ phách, Raz Muay Thái..."
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 text-sm h-10 border-slate-200"
                  />
                </div>

                {/* Row 3: Giá thật & Giá fake */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
                  <div className="flex flex-col">
                    <div className="min-h-[22px] flex items-center justify-between">
                      <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isAdmin ? "Giá bán ra Web (VND) *" : "Giá thật (Giá bạn nhận về / Giá gốc)"}</span>
                      </Label>
                    </div>
                    <MoneyInput
                      value={form.price}
                      onChange={(val) => setForm({ ...form, price: val })}
                      placeholder={isAdmin ? "Nhập giá bán ra web..." : "Nhập giá gốc..."}
                    />
                  </div>

                  <div className="flex flex-col">
                    <div className="min-h-[22px] flex items-center">
                      <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Giá fake (Giá gạch)</span>
                      </Label>
                    </div>
                    <MoneyInput
                      value={form.fake_price}
                      onChange={(val) => setForm({ ...form, fake_price: val })}
                      placeholder="Nhập giá fake..."
                    />
                  </div>
                </div>

                {/* Preview giá thật lên Web — Chỉ hiển thị cho CTV, phía Admin thì ẩn đi */}
                {!isAdmin && (
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Xem trước giá bán ra Web</span>
                      </div>
                      {priceCalculation.originalPrice > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-600 text-white">
                          +{priceCalculation.markupPercent}%
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Giá bạn thu:</span>
                        <span className="text-xs font-bold text-slate-800">
                          {formatVND(priceCalculation.originalPrice)}
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Shop hưởng:</span>
                        <span className="text-xs font-bold text-purple-700">
                          +{formatVND(priceCalculation.profit)}
                        </span>
                      </div>
                      <div className="bg-indigo-600 text-white p-2 rounded-lg">
                        <span className="text-[10px] text-indigo-100 block">Giá Web:</span>
                        <span className="text-xs font-black">
                          {formatVND(priceCalculation.sellingPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 4: Highlight & Trạng thái */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Highlight</Label>
                    <Input
                      value={form.highlight}
                      placeholder="VD: Full ngọc, Full tướng..."
                      onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                      className="mt-1 text-sm h-10 border-slate-200"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Trạng thái</Label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full border border-slate-200 p-2 rounded-lg mt-1 text-sm h-10 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="unsold">Chưa bán</option>
                      <option value="sold">Đã bán</option>
                      <option value="installment">Đang trả góp</option>
                      <option value="hidden">Tạm ẩn</option>
                    </select>
                  </div>
                </div>

                {/* Row 5: Switches (Trắng TT & Flash Sale) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/70 px-3.5 py-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">Acc Trắng thông tin</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, is_white: !prev.is_white }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition cursor-pointer ${
                        form.is_white ? "bg-emerald-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                          form.is_white ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-red-50 border border-red-200/70 px-3.5 py-2.5 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-red-600" />
                      <span className="text-xs font-bold text-red-800">Flash Sale</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, is_sale: !prev.is_sale }))}
                      className={`w-10 h-5 flex items-center rounded-full p-0.5 transition cursor-pointer ${
                        form.is_sale ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                          form.is_sale ? "translate-x-5" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Ảnh sản phẩm hiện tại */}
                {images.length > 0 && (
                  <div>
                    <Label className="text-xs font-bold text-slate-700">
                      Ảnh sản phẩm ({images.length} ảnh)
                    </Label>
                    <div className="flex gap-2.5 flex-wrap mt-2">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => openLightbox(images, i)}
                          className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-200 overflow-hidden cursor-zoom-in bg-slate-50"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Product image ${i + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ZoomIn className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2 flex items-center gap-3">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Modal xác nhận xóa */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Xác nhận xóa tài khoản
              </DialogTitle>
              <DialogDescription className="text-slate-600 text-sm pt-2">
                Bạn có chắc chắn muốn xóa tài khoản mã{" "}
                <strong className="text-slate-900 font-bold">#{form.code}</strong> không?
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                disabled={isDeleting}
              >
                Hủy bỏ
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
              >
                {isDeleting ? "Đang xóa..." : "Xóa ngay"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lightbox */}
        <ImageLightbox
          images={lightboxImages}
          open={isOpen}
          onClose={closeLightbox}
          initialIndex={currentIndex}
        />
      </div>
    </AdminAuthWrapper>
  );
}
