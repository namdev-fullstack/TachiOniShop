import CreateProductForm from "@/components/CreateProductForm";
import AdminAuthWrapper from "@/components/AdminAuthWrapper";

export default function AdminPage() {
  return (
    <AdminAuthWrapper>
      <div className="p-4 sm:p-6">
        <CreateProductForm />
      </div>
    </AdminAuthWrapper>
  );
}
