"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { generateCode } from "@/lib/utils";
import { toast } from "sonner";

// 👉 ENV
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET!;

// 👉 category map
const categoryMap = {
  vip: { id: "vip", name: "Acc VIP" },
  white: { id: "white", name: "Trắng Thông Tin" },
  info: { id: "info", name: "Có Thông Tin" },
};

const ranks = [
  "Đồng",
  "Vàng",
  "Kim Cương",
  "Cao Thủ",
  "Chiến Tướng",
  "Chiến Thần",
  "Reset",
];

// 👉 format tiền VNĐ
const formatVND = (value: string) => {
  if (!value) return "";
  return Number(value.replace(/\D/g, "")).toLocaleString("vi-VN");
};

// 👉 input tiền
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
        className="w-full border p-3 rounded mt-1 pr-10 focus:ring-2 focus:ring-red-400 outline-none"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
        ₫
      </span>
    </div>
  );
}

export default function CreateProductForm() {
  const [form, setForm] = useState({
    code: generateCode(),
    rank: "Đồng",
    price: "",
    fake_price: "",
    is_sale: false,
    is_active: true,
    highlight: "",
    category_id: "vip",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 👉 chọn ảnh
  const handleSelectImages = (e: any) => {
    const selected = Array.from(e.target.files);

    setFiles(selected as File[]);

    const previewUrls = selected.map((file: any) =>
      URL.createObjectURL(file)
    );

    setPreview(previewUrls);
  };

  // 👉 upload cloudinary
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

  // 👉 submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (
      !form.rank ||
      Number(form.price) <= 0 ||
      Number(form.fake_price) <= 0 ||
      !form.category_id ||
      files.length === 0
    ) {
      toast.error("Thiếu thông tin ⚠️", {
        description: "Nhập đầy đủ + chọn ảnh giúp t 😏",
      });
      return;
    }

    try {
      setLoading(true);

      const imageUrls = await Promise.all(
        files.map((file) => uploadImage(file))
      );

      await addDoc(collection(db, "accounts"), {
        ...form,
        price: Number(form.price),
        fake_price: Number(form.fake_price),
        images: imageUrls,
        category:
          categoryMap[
            form.category_id as keyof typeof categoryMap
          ],
        quantity: 1,
        created_at: new Date(),
      });

      toast.success("Đăng thành công 🚀", {
        description: "Acc đã lên kệ, chuẩn bị bán thôi 🔥",
      });

      // reset
      setPreview([]);
      setFiles([]);
      setForm({
        code: generateCode(),
        rank: "Đồng",
        price: "",
        fake_price: "",
        is_sale: false,
        is_active: true,
        highlight: "",
        category_id: "vip",
      });
    } catch (err) {
      console.log(err);

      toast.error("Lỗi upload ❌", {
        description: "Check lại mạng hoặc Cloudinary",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow space-y-5"
    >
      <h2 className="text-2xl font-bold">Đăng sản phẩm</h2>

      {/* RANK */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Rank
        </label>
        <select
          name="rank"
          value={form.rank}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, rank: e.target.value }))
          }
          className="w-full border p-3 rounded mt-1"
        >
          {ranks.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Giá thật
          </label>
          <MoneyInput
            value={form.price}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, price: val }))
            }
            placeholder="Nhập giá..."
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Giá fake
          </label>
          <MoneyInput
            value={form.fake_price}
            onChange={(val) =>
              setForm((prev) => ({
                ...prev,
                fake_price: val,
              }))
            }
            placeholder="Nhập giá..."
          />
        </div>
      </div>

      {/* CATEGORY */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Loại acc
        </label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              category_id: e.target.value,
            }))
          }
          className="w-full border p-3 rounded mt-1"
        >
          <option value="vip">Acc VIP</option>
          <option value="white">Trắng Thông Tin</option>
          <option value="info">Có Thông Tin</option>
        </select>
      </div>

      {/* HIGHLIGHT */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Highlight
        </label>
        <input
          value={form.highlight}
          placeholder="VD: VIP, Full skin..."
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              highlight: e.target.value,
            }))
          }
          className="w-full border p-3 rounded mt-1"
        />
      </div>

      {/* TOGGLE */}
      <div className="flex flex-wrap gap-4">
        {/* SALE */}
        <div className="flex items-center justify-between bg-red-50 px-4 py-2 rounded-xl w-full sm:w-auto">
          <span className="text-sm font-medium text-red-600">
            🔥 Flash Sale
          </span>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                is_sale: !prev.is_sale,
              }))
            }
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              form.is_sale ? "bg-red-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                form.is_sale ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* ACTIVE */}
        <div className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-xl w-full sm:w-auto">
          <span className="text-sm font-medium text-green-600">
            👁 Hiển thị
          </span>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                is_active: !prev.is_active,
              }))
            }
            className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
              form.is_active ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                form.is_active ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* IMAGE */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Ảnh sản phẩm
        </label>
        <input
          type="file"
          multiple
          onChange={handleSelectImages}
          className="mt-1"
        />
      </div>

      {/* PREVIEW */}
      <div className="flex gap-2 flex-wrap">
        {preview.map((img, i) => (
          <img
            key={i}
            src={img}
            className="w-20 h-20 object-cover rounded border"
          />
        ))}
      </div>

      {/* BUTTON */}
      <button
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded font-semibold transition"
      >
        {loading ? "Đang upload..." : "Đăng sản phẩm"}
      </button>
    </form>
  );
}