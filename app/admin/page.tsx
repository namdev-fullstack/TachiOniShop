import CreateProductForm from "../../components/CreateProductForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";


export default function AdminPage() {
  return (
    <AdminAuthWrapper>
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Trang Admin</h1>
          <Link href="/admin/products">
            <Button variant="outline">
              <List className="w-4 h-4 mr-2" />
              Danh sách sản phẩm
            </Button>
          </Link>
        </div>
        <CreateProductForm />
      </div>
    </AdminAuthWrapper>
  );
}