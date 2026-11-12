"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Flame,
  Phone,
  Home,
  Menu,
  X,
  Search,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  Headphones,
  Sparkles,
  LayoutGrid,
  Heart,
  Bell,
} from "lucide-react";

import { getFavorites } from "@/lib/favorites";

// Danh sách các tab chuẩn thiết kế Figma mobile
const navItems = [
  { id: "home", label: "Trang chủ", href: "/", icon: Home },
  { id: "products", label: "Kho acc", href: "/products", icon: LayoutGrid },
  { id: "favorites", label: "Yêu thích", href: "/favorites", icon: Heart },
  { id: "support", label: "Hỗ trợ", href: "/contact", icon: MessageCircle },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const getIndexFromPath = (path: string) => {
    if (path === "/") return 0; // Trang chủ
    if (path.startsWith("/favorites") || path.includes("favorite")) return 2; // Yêu thích
    if (path === "/contact") return 3; // Hỗ trợ
    if (path.startsWith("/products")) return 1; // Kho acc
    return 0;
  };

  const [activeIndex, setActiveIndex] = useState(() => getIndexFromPath(pathname));

  // Đồng bộ activeIndex khi URL thay đổi
  useEffect(() => {
    setActiveIndex(getIndexFromPath(pathname));
  }, [pathname]);

  // Cập nhật số lượng tài khoản yêu thích
  useEffect(() => {
    const updateCount = () => {
      setFavoriteCount(getFavorites().length);
    };
    updateCount();
    window.addEventListener("favorites-updated", updateCount);
    return () => window.removeEventListener("favorites-updated", updateCount);
  }, []);

  // Xử lý khi nhấn nút tìm kiếm: focus ngay vào ô tìm kiếm sản phẩm
  const handleSearchClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveIndex(1);

    if (pathname.startsWith("/products")) {
      window.dispatchEvent(new CustomEvent("focus-search-input"));
      const inputEl = document.getElementById("search-account-input") as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      router.push("/products?focus=1");
    }
  };

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Khóa scroll khi mở menu mở rộng trên mobile
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="Logo"
                width={436}
                height={182}
                className="h-[3.25rem] w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === "/"
                    ? "bg-blue-50 text-blue-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Trang Chủ</span>
              </Link>

              <Link
                href="/products"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  pathname.startsWith("/products")
                    ? "bg-red-50 text-red-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span>Danh Sách Acc</span>
                <span className="text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.2 rounded-full uppercase animate-pulse">
                  Hot
                </span>
              </Link>

              <Link
                href="/contact"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  pathname === "/contact"
                    ? "bg-emerald-50 text-emerald-600 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>Liên Hệ</span>
              </Link>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2.5">
              <button
                type="button"
                onClick={handleSearchClick}
                className="btn-3d-light inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-700 text-xs font-bold cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Tìm Acc</span>
              </button>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#5D3FD3] hover:bg-[#4d32b5] text-white text-xs font-extrabold shadow-sm active:translate-y-0.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Liên Hệ Hỗ Trợ</span>
              </Link>
            </div>

            {/* Mobile Top Right: Nút Zalo cá nhân (mở app Zalo) */}
            <div className="flex md:hidden items-center">
              <a
                href="https://zalo.me/0966216495"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0068FF] hover:bg-[#0055d4] active:scale-95 text-white font-black text-xs shadow-xs transition-all cursor-pointer"
                aria-label="Nhắn Zalo"
                title="Mở Zalo cá nhân: 0966 216 495"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.02l-.86 3.14a.75.75 0 0 0 .95.91l3.7-1.42c.74.23 1.53.35 2.35.35 5.52 0 10-4.03 10-9s-4.48-9-10-9zm.5 13.5h-5a.75.75 0 0 1 0-1.5h3.14l-3.8-4.56a.75.75 0 0 1 .58-1.24h4.75a.75.75 0 0 1 0 1.5h-2.94l3.8 4.56a.75.75 0 0 1-.53 1.24z" />
                </svg>
                <span>Zalo</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop Overlay khi mở drawer "Thêm" */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Bottom Sheet Drawer (Menu mở rộng từ dưới lên tương tự app di động) */}
      {mobileMenuOpen && (
        <div className="fixed bottom-[78px] left-0 right-0 z-40 md:hidden bg-white rounded-t-3xl border-t border-slate-200/90 shadow-2xl p-4 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
          {/* Thanh kéo trang trí */}
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-3" />

          {/* Tiêu đề & nút đóng */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={80}
                className="h-8 w-auto object-contain"
              />
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <ShieldCheck className="w-3 h-3" />
                <span>Uy Tín 100%</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Khung liên hệ nhanh 24/7 */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <a
              href="https://zalo.me/0966216495"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-blue-800 transition-colors hover:bg-blue-100/70"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">Zalo Admin</div>
                <div className="text-[10px] text-blue-600 font-semibold truncate">0966.216.495</div>
              </div>
            </a>

            <a
              href="tel:0966216495"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 transition-colors hover:bg-emerald-100/70"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold truncate">Hotline 24/7</div>
                <div className="text-[10px] text-emerald-600 font-semibold truncate">Gọi ngay</div>
              </div>
            </a>
          </div>

          {/* Danh mục & Liên kết chức năng */}
          <div className="mt-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-blue-600" />
                <span>Trang Chủ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname.startsWith("/products")
                  ? "bg-red-50 text-red-600 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Danh Sách Toàn Bộ Acc</span>
              </div>
              <span className="text-[10px] bg-red-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
                Hot
              </span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === "/contact"
                  ? "bg-emerald-50 text-emerald-600 font-bold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Headphones className="w-4 h-4 text-emerald-600" />
                <span>Liên Hệ Hỗ Trợ & Bàn Giao</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </Link>
          </div>

          {/* Cam kết uy tín */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Bảo hành trọn đời
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Bàn giao siêu tốc
            </span>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar: Chuẩn thiết kế Figma (Trang chủ, Kho acc, Yêu thích, Hỗ trợ) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200/90 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] pb-[max(0.4rem,env(safe-area-inset-bottom))] select-none">
        <div className="max-w-md mx-auto h-[60px] flex items-center justify-around px-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;

            const handleClick = (e: React.MouseEvent) => {
              if (item.id === "support") {
                setActiveIndex(3);
                if (pathname === "/contact") {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              } else {
                setActiveIndex(idx);
                setMobileMenuOpen(false);
              }
            };

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleClick}
                className="relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer select-none group"
                aria-label={item.label}
              >
                {/* Thanh chỉ báo active ở mép trên tab */}
                {isActive && (
                  <motion.div
                    layoutId="active-mobile-tab-indicator"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="absolute top-0 w-8 h-[2.5px] rounded-full bg-[#5D3FD3]"
                  />
                )}

                <div
                  className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
                    isActive ? "scale-105" : "scale-100 group-hover:scale-105"
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-[#5D3FD3] stroke-[2.4]"
                          : "text-slate-500 stroke-[1.8] group-hover:text-slate-800"
                      }`}
                    />
                    {item.id === "favorites" && favoriteCount > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-3.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
                        {favoriteCount > 9 ? "9+" : favoriteCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold tracking-tight mt-1 transition-colors ${
                      isActive
                        ? "text-[#5D3FD3] font-bold"
                        : "text-slate-500 group-hover:text-slate-800"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
