"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminLogin, { useAdminAuth } from "./AdminLogin";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  PlusCircle,
  List,
  Shield,
  User,
  Users,
  Menu,
  X,
  Layers,
  ExternalLink,
  Store,
} from "lucide-react";
import Link from "next/link";

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

export default function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  const { user, profile, isAdmin, isStaff, loading, logout, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      if (typeof window !== "undefined" && !window.location.pathname.includes("/admin/login")) {
        router.push("/admin/login");
      }
    }
  }, [loading, isAuthenticated, router]);

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md animate-pulse">
            TO
          </div>
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs font-semibold text-slate-500 tracking-wide">Đang tải TachiOni Panel...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const displayName =
    profile?.name || user?.displayName || user?.email?.split("@")[0] || "Người dùng";

  // Phân quyền Navigation Menu:
  // - Nhân viên: CHỈ hiển thị "Đăng sản phẩm" và "Sản phẩm của tôi"
  // - Admin: hiển thị đầy đủ Đăng sản phẩm, Tất cả sản phẩm, Danh mục, Quản lý nhân viên
  const navItems = [
    {
      href: "/admin",
      label: "Đăng sản phẩm",
      icon: PlusCircle,
      active: pathname === "/admin" || pathname === "/quanly",
    },
    {
      href: "/admin/products",
      label: isAdmin ? "Tất cả sản phẩm" : "Sản phẩm của tôi",
      icon: List,
      active: pathname.startsWith("/admin/products"),
    },
    ...(isAdmin
      ? [
          {
            href: "/admin/categories",
            label: "Danh mục",
            icon: Layers,
            active: pathname.startsWith("/admin/categories"),
          },
          {
            href: "/admin/users",
            label: "Quản lý cộng tác viên",
            icon: Users,
            active: pathname.startsWith("/admin/users"),
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/admin" className="flex items-center gap-2 font-black text-sm sm:text-base text-slate-900 hover:opacity-90 transition-opacity">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm">
                TO
              </span>
              <span className="hidden sm:inline font-black tracking-tight">TachiOni Panel</span>
            </Link>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide shrink-0 ${
                isAdmin
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3 h-3 text-purple-600 shrink-0" />
                  <span>Admin</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Cộng tác viên</span>
                </>
              )}
            </span>
          </div>

          {/* Desktop Navigation Links (Hiển thị khi lg trở lên để không bao giờ bị chèn ép) */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs h-8 px-3 font-semibold whitespace-nowrap transition-all ${
                      item.active
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User info, External web link & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              title="Xem website khách"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shrink-0"
            >
              <Store className="w-3.5 h-3.5 text-indigo-600" />
              <span>Web Khách</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <div className="text-right hidden md:block max-w-[150px]">
              <div className="text-xs font-bold text-slate-800 truncate">{displayName}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                {user?.email}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden lg:flex text-xs h-8 px-2.5 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </Button>

            {/* Mobile / Tablet Hamburger Button (khi < lg) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              aria-label="Mở menu quản trị"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* User card in mobile menu */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-sm font-bold text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500 font-mono">{user?.email}</div>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {isAdmin ? "Admin" : "Cộng tác viên"}
              </span>
            </div>

            {/* Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      item.active
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <Link
                href="/"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4" />
                  <span>Xem Website Khách</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>
            </div>

            {/* Logout button */}
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="destructive"
                size="sm"
                onClick={logout}
                className="w-full text-xs font-semibold h-9 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">{children}</main>
    </div>
  );
}
