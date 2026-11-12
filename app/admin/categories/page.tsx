"use client";

import { useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Layers, PlusCircle, ShieldAlert, ArrowLeft } from "lucide-react";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";
import { useAdminAuth } from "@/components/AdminLogin";
import Link from "next/link";
import { toast } from "sonner";

// convert slug
function generateSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function CategoryPage() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!isAdmin) {
      toast.error("Chỉ Admin mới có quyền tạo danh mục!");
      return;
    }
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    setLoading(true);
    try {
      const slug = generateSlug(name.trim());

      await addDoc(collection(db, "categories"), {
        name: name.trim(),
        slug,
        created_at: serverTimestamp(),
      });

      toast.success("Thêm danh mục thành công 🎉");
      setSuccess("Thêm category thành công 🎉");
      setName("");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm danh mục");
    } finally {
      setLoading(false);
    }
  };

  // Chặn cộng tác viên không được truy cập trang Danh mục
  if (!isAdmin && !authLoading) {
    return (
      <AdminAuthWrapper>
        <div className="max-w-md mx-auto py-16 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Không có quyền truy cập</h2>
          <p className="text-xs text-slate-600 mb-6">
            Bạn đang đăng nhập bằng tài khoản <strong>Cộng tác viên</strong>. Trang Quản lý danh mục chỉ dành riêng cho <strong>Quản trị viên (Admin)</strong>.
          </p>
          <Link href="/admin/products">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Quay lại Sản phẩm của tôi
            </Button>
          </Link>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className="p-4 sm:p-6">
        <div className="max-w-xl mx-auto py-6 sm:py-10 px-2 sm:px-4">
          <Card className="shadow-lg border border-slate-200 rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {/* Title */}
              <div className="flex items-center gap-2 text-xl font-black text-slate-900 border-b border-slate-100 pb-4">
                <Layers className="w-6 h-6 text-indigo-600" />
                Thêm danh mục tài khoản
              </div>

              {/* Input */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">Tên thể loại</Label>
                <Input
                  placeholder="VD: Acc VIP, Trắng Thông Tin..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-sm border-slate-200"
                />
              </div>

              {/* Preview slug */}
              {name && (
                <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  Slug URL:{" "}
                  <span className="font-mono font-bold text-indigo-600">
                    {generateSlug(name)}
                  </span>
                </div>
              )}

              {/* Button */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 shadow-sm"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                {loading ? "Đang thêm..." : "Thêm danh mục"}
              </Button>

              {/* Success */}
              {success && (
                <p className="text-emerald-600 text-xs text-center font-bold">{success}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
