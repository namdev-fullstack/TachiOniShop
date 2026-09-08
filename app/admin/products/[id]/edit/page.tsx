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
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

const categoryMap = {
  vip: { id: "vip", name: "Acc VIP" },
  white: { id: "white", name: "Trắng Thông Tin" },
  info: { id: "info", name: "Có Thông Tin" },
};

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
        className="w-full border p-3 rounded mt-1 pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
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
    rank: "Trong Ảnh",
    price: "",
    fake_price: "",
    is_sale: false,
    highlight: "",
    category_id: "vip",
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
          setForm({
            code: data.code || generateCode(),
            rank: data.rank || "Trong Ảnh",
            price: data.price?.toString() || "",
            fake_price: data.fake_price?.toString() || "",
            is_sale: data.is_sale || false,
            highlight: data.highlight || "",
            category_id: data.category?.id || "vip",
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

    if (!form.rank || Number(form.price) <= 0 || Number(form.fake_price) <= 0) {
      toast.error("Thiếu thông tin", {
        description: "Nhập đầy đủ thông tin giúp bạn 😏",
      });
      return;
    }

    try {
      setSaving(true);

      await updateDoc(doc(db, "accounts", productId), {
        ...form,
        price: Number(form.price),
        fake_price: Number(form.fake_price),
        category: categoryMap[form.category_id as keyof typeof categoryMap],
        updated_at: new Date(),
      });

      toast.success("Cập nhật thành công 🚀", {
        description: "Sản phẩm đã được cập nhật",
      });

      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Lỗi cập nhật", {
        description: "Không thể cập nhật sản phẩm",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/admin/products">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-600 mt-1">Cập nhật thông tin sản phẩm {form.code}</p>
        </div>

        {/* Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-xl">
            <CardTitle className="text-xl font-bold">Thông tin sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Code */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Mã code</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  className="mt-1 font-mono"
                  placeholder="Mã sản phẩm"
                />
              </div>

              {/* Rank */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Rank</Label>
                <select
                  value={form.rank}
                  onChange={(e) => setForm({ ...form, rank: e.target.value })}
                  className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  {ranks.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Giá thật</Label>
                  <MoneyInput
                    value={form.price}
                    onChange={(val) => setForm({ ...form, price: val })}
                    placeholder="Nhập giá..."
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-700">Giá fake</Label>
                  <MoneyInput
                    value={form.fake_price}
                    onChange={(val) => setForm({ ...form, fake_price: val })}
                    placeholder="Nhập giá..."
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Loại acc</Label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="vip">Acc VIP</option>
                  <option value="white">Trắng Thông Tin</option>
                  <option value="info">Có Thông Tin</option>
                </select>
              </div>

              {/* Highlight */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Highlight</Label>
                <Input
                  value={form.highlight}
                  placeholder="VD: VIP, Full skin..."
                  onChange={(e) => setForm({ ...form, highlight: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Status */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Trạng thái</Label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                  className="w-full border p-3 rounded mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="sold">Đã bán</option>
                  <option value="installment">Đang trả góp</option>
                  <option value="unsold">Chưa bán</option>
                  <option value="hidden">Tạm ẩn</option>
                </select>
              </div>

              {/* Toggle - Flash Sale only */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center justify-between bg-red-50 px-4 py-2 rounded-xl w-full sm:w-auto">
                  <span className="text-sm font-medium text-red-600">🔥 Flash Sale</span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, is_sale: !form.is_sale })}
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
              </div>

              {/* Images Preview */}
              <div>
                <Label className="text-sm font-semibold text-gray-700">Ảnh sản phẩm</Label>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={img}
                        alt={`Product ${i}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                  {images.length === 0 && (
                    <div className="text-gray-500 text-sm py-4">Chưa có ảnh</div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  {saving ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
                <Link href="/admin/products" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
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
