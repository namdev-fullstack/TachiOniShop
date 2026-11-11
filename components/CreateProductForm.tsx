"use client";

import { useState, useMemo } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { generateCode } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RefreshCw,
  ShieldCheck,
  Flame,
  ZoomIn,
  TrendingUp,
  Store,
  DollarSign,
  AlertCircle,
  Sparkles,
  Tag,
} from "lucide-react";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";
import { useAdminAuth } from "@/components/AdminLogin";
import { calculateAccountPrice, formatVND } from "@/lib/priceUtils";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET!;

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

export default function CreateProductForm() {
  const { user, profile, isAdmin, isStaff } = useAdminAuth();

  const [form, setForm] = useState({
    code: generateCode(),
    title: "",
    rank: "Trong Ảnh",
    price: "", // Với nhân viên: đây là giá thật (real price). Với admin: đây là giá bán web.
    fake_price: "",
    is_white: false,
    is_sale: false,
    highlight: "",
    status: "unsold" as "sold" | "installment" | "unsold" | "hidden",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isOpen, images: lightboxImages, currentIndex, openLightbox, closeLightbox } = useImageLightbox();

  // Tính toán giá bán và preview theo quyền hạn
  const priceCalculation = useMemo(() => {
    return calculateAccountPrice(form.price, isStaff);
  }, [form.price, isStaff]);

  const handleRerollCode = () => {
    setForm((prev) => ({ ...prev, code: generateCode() }));
  };

  const handleSelectImages = (e: any) => {
    const selected = Array.from(e.target.files);
    setFiles(selected as File[]);
    const previewUrls = selected.map((file: any) => URL.createObjectURL(file));
    setPreview(previewUrls);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cleanCode = form.code.replace(/\D/g, "").slice(0, 5);
    if (cleanCode.length !== 5) {
      toast.error("Mã acc bắt buộc gồm đúng 5 chữ số ⚠️");
      return;
    }

    const inputPrice = Number(form.price);
    if (
      !form.title.trim() ||
      !form.rank ||
      inputPrice <= 0 ||
      files.length === 0
    ) {
      toast.error("Vui lòng điền đủ Tiêu đề, Giá và Chọn ảnh ⚠️");
      return;
    }

    // Giá fake mặc định nếu không điền thì nhân 1.5 lần giá bán web
    const finalSellingPrice = isStaff ? priceCalculation.sellingPrice : inputPrice;
    const finalOriginalPrice = inputPrice;
    const finalFakePrice = form.fake_price
      ? Number(form.fake_price)
      : Math.round(finalSellingPrice * 1.5);

    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        files.map((file) => uploadImage(file))
      );

      const sellerName =
        profile?.name ||
        user?.displayName ||
        user?.email?.split("@")[0] ||
        (isAdmin ? "Admin" : "Nhân viên");

      await addDoc(collection(db, "accounts"), {
        code: cleanCode,
        title: form.title.trim(),
        highlight: form.highlight.trim() || form.title.trim(),
        rank: form.rank,
        // Giá bán công khai ngoài web
        price: finalSellingPrice,
        // Giá thật người bán thu về
        original_price: finalOriginalPrice,
        // Phần trăm tăng thêm (chênh lệch)
        markup_percent: isStaff ? priceCalculation.markupPercent : 0,
        fake_price: finalFakePrice,
        is_white: form.is_white,
        is_sale: form.is_sale,
        status: form.status,
        images: imageUrls,
        category: form.is_white
          ? { id: "white", name: "Trắng Thông Tin" }
          : { id: "info", name: "Có Thông Tin" },
        category_id: form.is_white ? "white" : "info",
        quantity: 1,
        // Thông tin người đăng (phân chia role)
        seller_id: user?.uid || "unknown",
        seller_name: sellerName,
        seller_email: user?.email || "",
        seller_role: isAdmin ? "admin" : "staff",
        created_at: new Date(),
        is_active: true,
      });

      toast.success(
        isStaff
          ? `Đã đăng acc #${cleanCode}! Giá thật: ${formatVND(finalOriginalPrice)} -> Giá web (+${priceCalculation.markupPercent}%): ${formatVND(finalSellingPrice)} 🚀`
          : `Đã đăng acc #${cleanCode} thành công! (Giá bán: ${formatVND(finalSellingPrice)}) 🚀`
      );

      // Reset form
      setPreview([]);
      setFiles([]);
      setForm({
        code: generateCode(),
        title: "",
        rank: "Trong Ảnh",
        price: "",
        fake_price: "",
        is_white: false,
        is_sale: false,
        highlight: "",
        status: "unsold",
      });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tải ảnh hoặc lưu sản phẩm ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-5 sm:p-7 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-5"
    >
      <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-indigo-600" />
            Đăng bán tài khoản mới
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStaff
              ? "Chế độ Nhân viên: Nhập giá thật của bạn, hệ thống sẽ tự động tính giá bán ra web kèm % chênh lệch."
              : "Chế độ Quản trị viên (Admin): Đăng bán trực tiếp không qua % chênh lệch."}
          </p>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
            isAdmin
              ? "bg-purple-100 text-purple-700 border border-purple-200"
              : "bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isAdmin ? "Admin" : "Nhân viên"}
        </span>
      </div>

      {/* Row 1: Mã Acc (5 số) & Rank */}
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
                placeholder="10245"
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                  setForm((prev) => ({ ...prev, code: val }));
                }}
                className="pl-6 font-mono font-bold text-sm h-10 border-slate-200"
              />
            </div>
            <button
              type="button"
              onClick={handleRerollCode}
              title="Đổi mã 5 số ngẫu nhiên"
              className="px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 transition flex items-center justify-center shrink-0 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs font-bold text-slate-700">Rank tài khoản</Label>
          <select
            name="rank"
            value={form.rank}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rank: e.target.value }))
            }
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
        <Label className="text-xs font-bold text-slate-700">
          Title (Tiêu đề tài khoản)
        </Label>
        <Input
          value={form.title}
          placeholder="VD: Nak thứ nguyên, Flo tinh hệ, Flo hổ phách, Raz Muay Thái..."
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mt-1 text-sm h-10 border-slate-200"
        />
      </div>

      {/* Row 3: Giá thật & Giá fake */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-start">
        <div className="flex flex-col">
          <div className="min-h-[22px] flex items-center justify-between">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{isStaff ? "Giá thật (Giá nhân viên nhận về)" : "Giá bán tài khoản"}</span>
            </Label>
          </div>
          <MoneyInput
            value={form.price}
            onChange={(val) => setForm((prev) => ({ ...prev, price: val }))}
            placeholder={isStaff ? "Nhập giá thật muốn nhận..." : "Nhập giá bán..."}
          />
          <p className="text-[11px] text-slate-500 mt-1 min-h-[16px] leading-tight">
            {isStaff
              ? "< 1 triệu: +30% | ≥ 1 triệu: +25% lên web"
              : "Admin: Bán trực tiếp không tăng %"}
          </p>
        </div>

        <div className="flex flex-col">
          <div className="min-h-[22px] flex items-center">
            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Giá gạch (Giá niêm yết cũ / Giá fake)</span>
            </Label>
          </div>
          <MoneyInput
            value={form.fake_price}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, fake_price: val }))
            }
            placeholder="Tùy chọn (để trống tự tính)..."
          />
          <p className="text-[11px] text-slate-400 mt-1 min-h-[16px] leading-tight">
            Giá gạch hiển thị giảm giá trên web
          </p>
        </div>
      </div>

      {/* Preview giá thật lên Web dành riêng cho Nhân viên */}
      {isStaff && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/40 border border-indigo-200/80 rounded-xl p-4 transition-all">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>Xem trước (Preview) giá bán ra Web</span>
            </div>
            {priceCalculation.originalPrice > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-indigo-600 text-white shadow-xs">
                +{priceCalculation.markupPercent}% chênh lệch
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200/70">
              <span className="text-[11px] font-medium text-slate-500 block">
                Giá bạn nhận về (Giá thật):
              </span>
              <span className="text-sm font-bold text-slate-800">
                {priceCalculation.originalPrice > 0
                  ? formatVND(priceCalculation.originalPrice)
                  : "Chưa nhập"}
              </span>
            </div>

            <div className="bg-white/90 p-2.5 rounded-lg border border-slate-200/70">
              <span className="text-[11px] font-medium text-slate-500 block">
                Tiền chênh lệch shop hưởng:
              </span>
              <span className="text-sm font-bold text-purple-700">
                +{formatVND(priceCalculation.profit)}
              </span>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-lg shadow-sm">
              <span className="text-[11px] font-semibold text-indigo-100 block">
                🔥 Giá hiển thị bán trên Web:
              </span>
              <span className="text-base font-black tracking-tight">
                {priceCalculation.sellingPrice > 0
                  ? formatVND(priceCalculation.sellingPrice)
                  : "0 ₫"}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-indigo-800/80 mt-2.5 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Khách hàng trên web sẽ mua với giá{" "}
            <strong className="font-bold underline">
              {formatVND(priceCalculation.sellingPrice)}
            </strong>
            . Khi bán thành công, giá thật{" "}
            <strong>{formatVND(priceCalculation.originalPrice)}</strong> là của bạn.
          </p>
        </div>
      )}

      {/* Row 4: Highlight & Trạng thái */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label className="text-xs font-bold text-slate-700">
            Highlight (Mô tả ngắn gọn)
          </Label>
          <Input
            value={form.highlight}
            placeholder="VD: Gắn mỗi số, Full ngọc, Full tướng..."
            onChange={(e) =>
              setForm((prev) => ({ ...prev, highlight: e.target.value }))
            }
            className="mt-1 text-sm h-10 border-slate-200"
          />
        </div>

        <div>
          <Label className="text-xs font-bold text-slate-700">Trạng thái bán</Label>
          <select
            name="status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value as any }))
            }
            className="w-full border border-slate-200 p-2 rounded-lg mt-1 text-sm h-10 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="unsold">Chưa bán (Hiển thị mua ngay)</option>
            <option value="sold">Đã bán</option>
            <option value="installment">Đang trả góp</option>
            <option value="hidden">Tạm ẩn</option>
          </select>
        </div>
      </div>

      {/* Row 5: 2 Toggle Switches (Acc Trắng Thông Tin & Flash Sale) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Toggle Acc Trắng Thông Tin */}
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/70 px-3.5 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800">
              Acc Trắng thông tin
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, is_white: !prev.is_white }))
            }
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

        {/* Toggle Flash Sale */}
        <div className="flex items-center justify-between bg-red-50 border border-red-200/70 px-3.5 py-2.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-800">Flash Sale</span>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, is_sale: !prev.is_sale }))
            }
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

      {/* Row 6: Ảnh sản phẩm */}
      <div>
        <Label className="text-xs font-bold text-slate-700">Ảnh sản phẩm</Label>
        <Input
          type="file"
          multiple
          onChange={handleSelectImages}
          className="mt-1 text-xs border-slate-200"
        />
      </div>

      {/* Preview ảnh */}
      {preview.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Đã chọn {preview.length} ảnh (click để phóng to xem ảnh)
            </span>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            {preview.map((img, i) => (
              <div
                key={i}
                onClick={() => openLightbox(preview, i)}
                className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 overflow-hidden cursor-zoom-in bg-slate-50 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all select-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-slate-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-black/60 text-white px-1 py-0.5 rounded leading-none">
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox phóng to ảnh preview */}
      <ImageLightbox
        images={lightboxImages}
        open={isOpen}
        onClose={closeLightbox}
        initialIndex={currentIndex}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold text-sm shadow-md transition cursor-pointer disabled:opacity-50 mt-2 active:scale-[0.99]"
      >
        {loading ? "Đang upload & đăng sản phẩm..." : "Đăng sản phẩm ngay 🚀"}
      </button>
    </form>
  );
}
