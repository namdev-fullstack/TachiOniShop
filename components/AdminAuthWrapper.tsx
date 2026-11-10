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
  const { user, profile, isAdmin, loading, logout, isAuthenticated } = useAdminAuth();
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
    {
      href: "/admin/categories",
      label: "Danh mục",
      icon: Layers,
      active: pathname.startsWith("/admin/categories"),
    },
    ...(isAdmin
      ? [
          {
            href: "/admin/users",
            label: "Quản lý nhân viên",
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/admin" className="flex items-center gap-2 font-black text-base sm:text-lg text-slate-900">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-sm">
                TO
              </span>
              <span className="truncate max-w-[120px] sm:max-w-none">TachiOni Panel</span>
            </Link>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wide ${
                isAdmin
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              {isAdmin ? (
                <>
                  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600" />
                  <span className="hidden xs:inline">Quản trị viên (Admin)</span>
                  <span className="xs:hidden">Admin</span>
                </>
              ) : (
                <>
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                  <span className="hidden xs:inline">Nhân viên (Staff)</span>
                  <span className="xs:hidden">Staff</span>
                </>
              )}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs h-9 font-semibold ${
                      item.active
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-1.5" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User info, External web link & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              title="Xem website khách"
              className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Xem Web Khách</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Link>

            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 truncate max-w-[140px]">{displayName}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                {user?.email}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hidden md:flex text-xs h-8 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng xuất</span>
            </Button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Mở menu quản trị"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
            {/* User card in mobile menu */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-sm font-bold text-slate-900">{displayName}</div>
                <div className="text-xs text-slate-500 font-mono">{user?.email}</div>
              </div>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isAdmin
                    ? "bg-purple-100 text-purple-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {isAdmin ? "Admin" : "Nhân viên"}
              </span>
            </div>

            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      item.active
                        ? "bg-indigo-600 text-white"
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
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
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
                className="w-full text-xs h-9 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất tài khoản</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content with bottom padding on mobile so bottom bar does not overlap */}
      <main className="max-w-7xl mx-auto w-full flex-1 pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar for quick access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
        <Link
          href="/admin"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            pathname === "/admin" || pathname === "/quanly"
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <PlusCircle className="w-5 h-5 mb-0.5" />
          <span>Đăng acc</span>
        </Link>

        <Link
          href="/admin/products"
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            pathname.startsWith("/admin/products")
              ? "text-indigo-600"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <List className="w-5 h-5 mb-0.5" />
          <span>Sản phẩm</span>
        </Link>

        {isAdmin && (
          <Link
            href="/admin/users"
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
              pathname.startsWith("/admin/users")
                ? "text-indigo-600"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>Nhân viên</span>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
            mobileMenuOpen ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Thêm</span>
        </button>
      </div>
    </div>
  );
}
