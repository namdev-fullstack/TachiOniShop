import { Suspense } from "react";
import ProductClient from "./[id]/productClient";

export default function Products() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-500">Đang tải danh sách tài khoản...</div>}>
      <ProductClient />
    </Suspense>
  );
}
