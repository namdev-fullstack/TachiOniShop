"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Flame,
  Phone,
  HomeIcon,
  Menu,
  X,
  Search,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Khóa scroll khi mở menu trên mobile
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="Logo"
              width={436}
              height={182}
              className="h-9 sm:h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-105"
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
              <HomeIcon className="w-4 h-4" />
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
            <Link
              href="/products"
              className="btn-3d-light inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-700 text-xs font-bold"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Tìm Acc</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-[0_2px_4px_rgba(37,99,235,0.3),0_4px_10px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.4)] border-b-2 border-b-blue-800 active:translate-y-0.5 transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Hỗ Trợ Zalo</span>
            </Link>
          </div>

          {/* Mobile Right Controls: Nút Tìm Kiếm & Nút Menu */}
          <div className="flex md:hidden items-center gap-1.5">
            <Link
              href="/products"
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Tìm kiếm tài khoản"
            >
              <Search className="w-5 h-5" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer select-none"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-red-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-800" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Backdrop Overlay (Chạm ra ngoài để đóng menu) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-14 sm:top-16 bg-black/40 z-40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Dropdown Menu (Nằm chuẩn ngay dưới thanh Header, không bao giờ bị lệch vị trí) */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                pathname === "/"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HomeIcon className="w-4 h-4 text-blue-600" />
                <span>Trang Chủ</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                pathname.startsWith("/products")
                  ? "bg-red-50 text-red-600"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Danh Sách Tài Khoản</span>
              </div>
              <span className="text-[9px] bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-full uppercase">
                Hot
              </span>
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                pathname === "/contact"
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-slate-800 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>Liên Hệ CSKH & Bàn Giao</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Quick Contact Buttons trong Mobile Menu */}
            <div className="pt-2.5 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href="https://zalo.me/0966216495"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Zalo Admin</span>
              </a>

              <a
                href="tel:0966216495"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0966.216.495</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
