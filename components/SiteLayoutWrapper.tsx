"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from "sonner";

interface SiteLayoutWrapperProps {
  children: React.ReactNode;
}

export default function SiteLayoutWrapper({ children }: SiteLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname?.startsWith("/quanly");

  // Nếu là trang quản trị (/admin hoặc /quanly), không hiển thị Header/Footer/ScrollToTop của khách
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
        <Toaster richColors position="bottom-right" />
      </div>
    );
  }

  // Giao diện khách hàng (Trang chủ, sản phẩm, liên hệ...)
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster richColors position="bottom-right" />
    </>
  );
}
