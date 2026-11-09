"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { generateCode } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Upload, RefreshCw, ShieldCheck, Flame } from "lucide-react";
import Link from "next/link";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

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
        className="w-full border p-2.5 rounded-lg mt-1 pr-8 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
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

  const [form, setForm] = useState({
    code: "",
    title: "",
    rank: "Trong Ảnh",
    price: "",
    fake_price: "",
    is_white: true,
    is_sale: false,
    highlight: "",
    status: "unsold" as "sold" | "installment" | "unsold" | "hidden",
  });

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "accounts", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const isWhite =
            data.is_white !== undefined
              ? data.is_white
              : data.category?.id === "white" ||
                data.category_id === "white" ||
                (data.category?.name || "").toLowerCase().includes("trắng");

          setForm({
            code: data.code || generateCode(),
            title: data.title || data.highlight || "",
            rank: data.rank || "Trong Ảnh",
            price: data.price?.toString() || "",
            fake_price: data.fake_price?.toString() || "",
            is_white: Boolean(isWhite),
            is_sale: data.is_sale || false,
            highlight: data.highlight || "",
            status: data.status || "unsold",
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

    fetchProduct();
  }, [productId, router]);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const cleanCode = form.code.replace(/\D/g, "").slice(0, 5);
    if (cleanCode.length !== 5) {
      toast.error("Mã acc bắt buộc gồm đúng 5 chữ số ⚠️");
      return;
    }

    if (!form.title.trim() || !form.rank || Number(form.price) <= 0 || Number(form.fake_price) <= 0) {
      toast.error("Vui lòng nhập đủ Title và Giá ⚠️");
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "accounts", productId), {
        code: cleanCode,
        title: form.title.trim(),
        highlight: form.highlight.trim() || form.title.trim(),
        rank: form.rank,
        price: Number(form.price),
        fake_price: Number(form.fake_price),
        is_white: form.is_white,
        is_sale: form.is_sale,
        status: form.status,
        category: form.is_white
          ? { id: "white", name: "Trắng Thông Tin" }
          : { id: "info", name: "Có Thông Tin" },
        category_id: form.is_white ? "white" : "info",
        updated_at: new Date(),
      });

      toast.success(`Đã cập nhật sản phẩm #${cleanCode}! 🚀`);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Lỗi cập nhật sản phẩm");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm font-semibold text-slate-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="sm" className="mb-2 text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
            <p className="text-xs text-gray-500">Mã acc: #{form.code}</p>
          </div>

          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-900 text-white rounded-t-xl py-3 px-5">
              <CardTitle className="text-base font-bold">Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Code (5 số) & Rank */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Mã Acc (5 số)</Label>
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
                          className="pl-6 font-mono font-bold text-sm h-10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, code: generateCode() })}
                        title="Đổi mã ngẫu nhiên"
                        className="px-3 bg-slate-100 hover:bg-slate-200 border rounded-lg text-slate-700 transition flex items-center justify-center shrink-0"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Rank</Label>
                    <select
                      value={form.rank}
                      onChange={(e) => setForm({ ...form, rank: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="mt-1 text-sm h-10"
                  />
                </div>

                {/* Row 3: Giá thật & Giá fake */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Giá thật</Label>
                    <MoneyInput
                      value={form.price}
                      onChange={(val) => setForm({ ...form, price: val })}
                      placeholder="Nhập giá..."
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Giá fake</Label>
                    <MoneyInput
                      value={form.fake_price}
                      onChange={(val) => setForm({ ...form, fake_price: val })}
                      placeholder="Nhập giá fake..."
                    />
                  </div>
                </div>

                {/* Row 4: Highlight & Trạng thái */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Highlight</Label>
                    <Input
                      value={form.highlight}
                      placeholder="VD: Gắn mỗi số, Full ngọc..."
                      onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                      className="mt-1 text-sm h-10"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Trạng thái</Label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
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
                      onClick={() => setForm({ ...form, is_white: !form.is_white })}
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
                      onClick={() => setForm({ ...form, is_sale: !form.is_sale })}
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

                {/* Images Preview */}
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Ảnh hiện tại</Label>
                  <div className="mt-1 flex gap-2 flex-wrap">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Ảnh ${i + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                    ))}
                    {images.length === 0 && (
                      <div className="text-gray-400 text-xs py-2">Chưa có ảnh</div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-10"
                  >
                    {saving ? (
                      <>
                        <Upload className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 mr-1.5" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                  <Link href="/admin/products" className="flex-1">
                    <Button type="button" variant="outline" className="w-full text-xs h-10">
                      Hủy
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
