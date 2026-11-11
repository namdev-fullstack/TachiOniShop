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
} from "lucide-react";

// Icon tìm kiếm hiện đại phong cách tối giản (tương tự bản thiết kế: vòng tròn ống kính + điểm nối tròn nhỏ)
function ModernSearchIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <circle cx="17.5" cy="17.5" r="2.2" />
    </svg>
  );
}

const navItems = [
  { id: "products", label: "Kho Acc", href: "/products", icon: Flame },
  { id: "search", label: "Tìm kiếm", href: "/products?focus=1", icon: ModernSearchIcon },
  { id: "home", label: "Trang chủ", href: "/", icon: Home },
  { id: "contact", label: "Liên hệ", href: "/contact", icon: Phone },
  { id: "more", label: "Thêm", href: "#", icon: Menu },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const getIndexFromPath = (path: string, isMenuOpen: boolean) => {
    if (isMenuOpen) return 4;
    if (path === "/") return 2; // Trang chủ đặt ở chính giữa!
    if (path === "/contact") return 3;
    if (path.startsWith("/products")) {
      if (typeof window !== "undefined" && window.location.search.includes("focus=1")) {
        return 1; // Tìm kiếm
      }
      return 0; // Kho Acc
    }
    return 2;
  };

  const [activeIndex, setActiveIndex] = useState(() => getIndexFromPath(pathname, mobileMenuOpen));

  // Đồng bộ activeIndex khi URL hoặc trạng thái menu thay đổi
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("focus=1")) {
      setActiveIndex(1);
      return;
    }
    setActiveIndex(getIndexFromPath(pathname, mobileMenuOpen));
  }, [pathname, mobileMenuOpen]);

  // Lắng nghe sự kiện người dùng focus vào ô tìm kiếm
  useEffect(() => {
    const handleSearchFocus = () => setActiveIndex(1);
    window.addEventListener("focus-search-input", handleSearchFocus);
    window.addEventListener("search-input-focused", handleSearchFocus);
    return () => {
      window.removeEventListener("focus-search-input", handleSearchFocus);
      window.removeEventListener("search-input-focused", handleSearchFocus);
    };
  }, []);

  // Xử lý khi nhấn nút tìm kiếm: focus ngay vào ô tìm kiếm sản phẩm
  const handleSearchClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveIndex(1);

    if (pathname.startsWith("/products")) {
      // Đang ở trang sản phẩm -> phát event và focus trực tiếp
      window.dispatchEvent(new CustomEvent("focus-search-input"));
      const inputEl = document.getElementById("search-account-input") as HTMLInputElement;
      if (inputEl) {
        inputEl.focus();
        inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      // Đang ở trang khác -> chuyển sang trang /products và yêu cầu focus
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-[0_2px_4px_rgba(37,99,235,0.3),0_4px_10px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] border-b-2 border-b-blue-800 active:translate-y-0.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Hỗ Trợ Zalo</span>
              </Link>
            </div>

            {/* Mobile Top Right Quick Actions (gọn gàng, hiện đại) */}
            <div className="flex md:hidden items-center">
              <a
                href="https://zalo.me/0966216495"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Zalo CSKH</span>
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

      {/* Mobile Bottom Navigation Bar: Nổi bật & nẩy nhẹ nhàng cho item đang được chọn, thanh màu tím di chuyển mượt mà */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[24px] border-t border-slate-100 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] pb-[max(0.4rem,env(safe-area-inset-bottom))] select-none">
        <div className="relative max-w-md mx-auto h-[62px] flex items-center justify-around px-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeIndex === idx;

            const handleClick = (e: React.MouseEvent) => {
              if (item.id === "search") {
                setActiveIndex(1);
                handleSearchClick(e);
              } else if (item.id === "products") {
                setActiveIndex(0);
                setMobileMenuOpen(false);
              } else if (item.id === "more") {
                e.preventDefault();
                const nextOpen = !mobileMenuOpen;
                setMobileMenuOpen(nextOpen);
                setActiveIndex(nextOpen ? 4 : getIndexFromPath(pathname, false));
              } else {
                setActiveIndex(idx);
                setMobileMenuOpen(false);
              }
            };

            const content = (
              <div className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer select-none">
                {/* Nút tròn màu tím nổi lên nhẹ nhàng khi được chọn (chỉ nhô nhẹ 6px), có layoutId để lướt mượt qua các item */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bubble"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute -top-1.5 w-[44px] h-[44px] rounded-full bg-[#5b4df6] shadow-[0_4px_16px_rgba(91,77,246,0.38)] z-0 pointer-events-none"
                  />
                )}

                {/* Khối icon và nhãn: nâng nhẹ lên 6px và nhấp nhô nhẹ nhàng khi được chọn */}
                <div
                  className={`relative z-10 flex flex-col items-center justify-center transition-transform duration-200 ${
                    isActive ? "-translate-y-1.5" : "translate-y-0"
                  }`}
                >
                  <motion.div
                    animate={
                      isActive
                        ? { scale: [1, 1.05, 1.01, 1.03, 1] }
                        : { scale: 1 }
                    }
                    transition={{
                      duration: 1.4,
                      repeat: isActive ? Infinity : 0,
                      repeatDelay: 0.8,
                      ease: "easeInOut",
                    }}
                    className="w-[44px] h-[44px] flex items-center justify-center"
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive
                          ? "text-white stroke-[2.3]"
                          : "text-slate-800 stroke-[2]"
                      }`}
                    />
                  </motion.div>

                  <span
                    className={`text-[10px] font-semibold tracking-tight transition-all ${
                      isActive
                        ? "text-[#5b4df6] font-bold -mt-0.5"
                        : "text-slate-600 mt-0"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );

            if (item.id === "search" || item.id === "more") {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={handleClick}
                  className="w-1/5 h-full flex items-center justify-center cursor-pointer select-none focus:outline-hidden"
                  aria-label={item.label}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleClick}
                className="w-1/5 h-full flex items-center justify-center cursor-pointer select-none focus:outline-hidden"
                aria-label={item.label}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
