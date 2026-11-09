"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { generateCode } from "@/lib/utils";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, ShieldCheck, Flame, ZoomIn } from "lucide-react";
import ImageLightbox, { useImageLightbox } from "@/components/ImageLightbox";

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

const formatVND = (value: string) => {
  if (!value) return "";
  return Number(value.replace(/\D/g, "")).toLocaleString("vi-VN");
};

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
        className="w-full border p-2.5 rounded-lg mt-1 pr-8 focus:ring-2 focus:ring-red-400 outline-none text-sm"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
        ₫
      </span>
    </div>
  );
}

export default function CreateProductForm() {
  const [form, setForm] = useState({
    code: generateCode(),
    title: "",
    rank: "Trong Ảnh",
    price: "",
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

    if (
      !form.title.trim() ||
      !form.rank ||
      Number(form.price) <= 0 ||
      Number(form.fake_price) <= 0 ||
      files.length === 0
    ) {
      toast.error("Vui lòng điền đủ Title, Giá và Chọn ảnh ⚠️");
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        files.map((file) => uploadImage(file))
      );

      await addDoc(collection(db, "accounts"), {
        code: cleanCode,
        title: form.title.trim(),
        highlight: form.highlight.trim() || form.title.trim(),
        rank: form.rank,
        price: Number(form.price),
        fake_price: Number(form.fake_price),
        is_white: form.is_white,
        is_sale: form.is_sale,
        status: form.status,
        images: imageUrls,
        category: form.is_white
          ? { id: "white", name: "Trắng Thông Tin" }
          : { id: "info", name: "Có Thông Tin" },
        category_id: form.is_white ? "white" : "info",
        quantity: 1,
        created_at: new Date(),
        is_active: true,
      });

      toast.success(`Đã thêm acc #${cleanCode} thành công! 🚀`);

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
      className="max-w-2xl mx-auto p-5 sm:p-6 bg-white rounded-2xl shadow-sm border border-slate-200 space-y-4"
    >
      <div className="border-b pb-3">
        <h2 className="text-xl font-bold text-slate-900">Đăng sản phẩm</h2>
      </div>

      {/* Row 1: Mã Acc (5 số) & Rank */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label className="text-xs font-semibold text-slate-700">
            Mã Acc (5 số)
          </Label>
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
                className="pl-6 font-mono font-bold text-sm h-10"
              />
            </div>
            <button
              type="button"
              onClick={handleRerollCode}
              title="Đổi mã 5 số ngẫu nhiên"
              className="px-3 bg-slate-100 hover:bg-slate-200 border rounded-lg text-slate-700 transition flex items-center justify-center shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <Label className="text-xs font-semibold text-slate-700">Rank</Label>
          <select
            name="rank"
            value={form.rank}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, rank: e.target.value }))
            }
            className="w-full border p-2 rounded-lg mt-1 text-sm h-10 bg-white outline-none"
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
        <Label className="text-xs font-semibold text-slate-700">
          Title (Tiêu đề sản phẩm)
        </Label>
        <Input
          value={form.title}
          placeholder="VD: Nakroth Thứ Nguyên Vệ Thần + Flo Tinh Hệ..."
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="mt-1 text-sm h-10"
        />
      </div>

      {/* Row 3: Giá thật & Giá fake */}
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <Label className="text-xs font-semibold text-slate-700">Giá thật</Label>
          <MoneyInput
            value={form.price}
            onChange={(val) => setForm((prev) => ({ ...prev, price: val }))}
            placeholder="Nhập giá..."
          />
        </div>

        <div>
          <Label className="text-xs font-semibold text-slate-700">Giá fake</Label>
          <MoneyInput
            value={form.fake_price}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, fake_price: val }))
            }
            placeholder="Nhập giá fake..."
          />
        </div>
      </div>

      {/* Row 4: Highlight & Trạng thái */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <Label className="text-xs font-semibold text-slate-700">
            Highlight (Mô tả ngắn gọn)
          </Label>
          <Input
            value={form.highlight}
            placeholder="VD: Gắn mỗi số, Full ngọc..."
            onChange={(e) =>
              setForm((prev) => ({ ...prev, highlight: e.target.value }))
            }
            className="mt-1 text-sm h-10"
          />
        </div>

        <div>
          <Label className="text-xs font-semibold text-slate-700">Trạng thái</Label>
          <select
            name="status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value as any }))
            }
            className="w-full border p-2 rounded-lg mt-1 text-sm h-10 bg-white outline-none"
          >
            <option value="unsold">Chưa bán</option>
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
        <Label className="text-xs font-semibold text-slate-700">Ảnh sản phẩm</Label>
        <Input
          type="file"
          multiple
          onChange={handleSelectImages}
          className="mt-1 text-xs"
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
                className="group relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl border border-slate-200 overflow-hidden cursor-zoom-in bg-slate-50 shadow-2xs hover:shadow-md hover:border-red-400 transition-all select-none"
              >
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
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition cursor-pointer disabled:opacity-50 mt-2"
      >
        {loading ? "Đang upload..." : "Đăng sản phẩm"}
      </button>
    </form>
  );
}
