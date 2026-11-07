"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  Sword,
  Headphones,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const popularTags = ["Florentino", "Raz Muay Thái", "Nakroth Thứ Nguyên", "Tulen SSS", "Acc Trắng TT", "Giá Rẻ < 200k"];

export default function HeroBanner() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/products?search=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-blue-50/20 pt-8 pb-16 md:pt-14 md:pb-24 border-b border-slate-200/60 gaming-grid">
      {/* Ambient background glows - Clean White Gaming */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-200/40 via-cyan-100/30 to-purple-200/30 blur-3xl pointer-events-none -z-0 rounded-full" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Floating subtle gaming deco icons */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute hidden lg:block top-16 left-8 pointer-events-none opacity-80"
      >
        <Image src="/quanHuy.png" alt="Quân Huy" width={65} height={65} className="drop-shadow-lg" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute hidden lg:block bottom-12 left-16 pointer-events-none opacity-75"
      >
        <Image src="/vongQuay.png" alt="Vòng Quay" width={80} height={80} className="drop-shadow-xl" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Copy & Search */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            {/* Top Gaming Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-blue-200/80 shadow-sm text-xs font-semibold text-blue-700"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>HỆ THỐNG GIỚI THIỆU ACC LIÊN QUÂN UY TÍN #1</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
            >
              Chinh Phục Rank Với{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Kho Acc VIP
                </span>
                <span className="absolute bottom-1 left-0 w-full h-2.5 bg-blue-400/20 -z-10 rounded-sm" />
              </span>{" "}
              Đẳng Cấp Nhất
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              Cung cấp hàng ngàn tài khoản Liên Quân Mobile chính chủ, <span className="font-semibold text-slate-800">100% trắng thông tin</span>, 
              full tướng & skin SSS, Thứ Nguyên Vệ Thần. Giao dịch tự động, bảo hành đổi trả an toàn trọn đời.
            </motion.p>

            {/* Quick Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl mx-auto lg:mx-0"
            >
              <form onSubmit={handleSearch} className="relative flex items-center">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm acc theo tướng, skin (vd: Florentino, Raz, Nakroth, SSS...)"
                    className="w-full pl-12 pr-28 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md hover:shadow-blue-500/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Tìm Ngay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 justify-center lg:justify-start">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gợi ý:</span>
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/80 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 transition-colors shadow-2xs font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
            >
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Flame className="w-4 h-4 text-amber-300" />
                <span>Khám Phá Kho Acc</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold text-sm sm:text-base border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Headphones className="w-4 h-4 text-blue-600" />
                <span>Tư Vấn Zalo 24/7</span>
              </Link>
            </motion.div>

            {/* Trust points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0"
            >
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">100% Trắng TT</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Giao dịch 30s</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">Bảo hành 1-1</span>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3D Gaming Showcase Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-cyan-400/20 rounded-3xl blur-2xl transform scale-95" />

            {/* Featured Hero Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="relative w-full max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-blue-500/10 border border-slate-100 gaming-glow-card overflow-hidden"
            >
              {/* Corner Gaming Decors */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold border border-blue-100">
                    <Sword className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>ACC TIÊU BIỂU</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500 text-white font-extrabold uppercase animate-pulse">
                        HOT
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Mã: ACC-VIP88</div>
                  </div>
                </div>

                <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold border-0 text-xs px-2.5 py-1 shadow-sm flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-slate-900" />
                  <span>Thách Đấu 55★</span>
                </Badge>
              </div>

              {/* Image Preview with overlay badges */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 mb-4 group cursor-pointer">
                <Image
                  src="/bannerVip.jpeg"
                  alt="Acc Liên Quân VIP"
                  fill
                  quality={95}
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Tags on Image */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white text-[11px] font-bold backdrop-blur-sm">
                    Full Tướng
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[11px] font-bold backdrop-blur-sm">
                    Thứ Nguyên Vệ Thần
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                  <div>
                    <div className="text-[11px] text-slate-200">Trang phục cực hiếm</div>
                    <div className="text-sm font-bold text-white drop-shadow">Nakroth & Florentino SSS</div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Tướng</div>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800">118/118</div>
                </div>
                <div className="border-x border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Trang Phục</div>
                  <div className="text-sm sm:text-base font-extrabold text-blue-600">350+ Skin</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Ngọc 90</div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-600">Full 30 Bảng</div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-[11px] text-slate-400 line-through">1.800.000đ</div>
                  <div className="text-xl sm:text-2xl font-black text-red-600 tracking-tight">
                    899.000<span className="text-xs font-bold text-red-500 ml-0.5">đ</span>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-blue-500/25 transition-all flex items-center gap-1.5"
                >
                  <span>Xem Chi Tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Floating Mini Tech Badge 1 */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-3 -left-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xl flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Cam kết bảo mật</div>
                  <div className="text-xs font-bold text-slate-800">100% Trắng Sạch</div>
                </div>
              </motion.div>

              {/* Floating Mini Tech Badge 2 */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl px-3.5 py-2 shadow-xl hidden sm:flex items-center gap-2.5"
              >
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Tự động</div>
                  <div className="text-xs font-bold text-slate-800">Cọc nhận ngay 30s</div>
                </div>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
