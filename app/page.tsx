"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Headphones, ArrowRight, Sparkles } from "lucide-react";
import HomeBanner from "@/components/HomeBanner";
import FlashSale from "@/components/FlashSale";
import HomeCategories from "@/components/HomeCategories";
import HomeProductList from "@/components/HomeProductList";
import ConsultationSection from "@/components/ConsultationSection";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/products?focus=1");
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8FC] text-slate-900 selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden pb-20 md:pb-12">
      
      {/* 1. Phần Lời chào & Thanh tìm kiếm chuẩn thiết kế Figma */}
      <section className="w-full pt-3 sm:pt-5 pb-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          
          {/* Eyebrow Title */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5D3FD3]" />
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#5D3FD3] uppercase">
              CHÀO MỪNG ĐẾN TACHIONI
            </span>
          </div>

          {/* Search Box chuẩn Figma (Input bo tròn viền nhẹ + nút tím kính lúp bên trái) */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center w-full shadow-xs rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 focus-within:border-[#5D3FD3] focus-within:ring-2 focus-within:ring-[#5D3FD3]/20 transition-all overflow-hidden"
          >
            {/* Nút icon tìm kiếm màu tím */}
            <button
              type="submit"
              className="ml-1.5 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#5D3FD3] hover:bg-[#4d32b5] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer shadow-xs"
              aria-label="Tìm kiếm ngay"
            >
              <Search className="w-4 h-4 stroke-[2.4]" />
            </button>

            {/* Input nhập từ khóa */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm acc, tướng, trang phục..."
              className="w-full h-12 sm:h-13 pl-3 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />

            {/* Nút xóa nhanh nếu có text */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mr-3 text-slate-400 hover:text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            )}
          </form>
        </div>
      </section>

      {/* 2. Hero Campaign Banner: Gojo Satoru - TachiOni */}
      <HomeBanner />

      {/* 3. Menu Nav / Thanh Cam kết & Hỗ trợ chuẩn Figma */}
      <section className="w-full py-2">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            {/* Cam kết An toàn, uy tín */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#5D3FD3] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                An toàn, uy tín
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            {/* Hỗ trợ 24/7 */}
            <a
              href="https://zalo.me/0966216495"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 group"
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Headphones className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                Hỗ trợ 24/7
              </span>
            </a>

            <div className="h-4 w-px bg-slate-200" />

            {/* Nút Khám phá */}
            <Link
              href="/products"
              className="flex items-center gap-1 text-xs sm:text-sm font-extrabold text-[#5D3FD3] hover:text-[#4d32b5] transition-colors group"
            >
              <span>Khám phá</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Flash Sale (Giữ nguyên component và logic) */}
      <FlashSale />

      {/* 5. Phân loại thể loại / Tab (Giữ nguyên) */}
      <HomeCategories
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 6. Danh sách tài khoản / Item (Giữ nguyên) */}
      <HomeProductList
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 7. Khung tư vấn thêm & Action bar chuẩn thiết kế Figma */}
      <ConsultationSection className="mt-2" />

    </main>
  );
}
