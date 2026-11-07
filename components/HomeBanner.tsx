"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, ShieldCheck, Zap } from "lucide-react";

export default function HomeBanner() {
  return (
    <section className="w-full pt-3 sm:pt-5 pb-2">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
        
        {/* Banner Ảnh Gọn Gàng Phong Cách reg68 (Không chữ chạy) */}
        <div className="relative w-full aspect-[16/7] sm:aspect-[21/9] md:aspect-[24/9] rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs bg-slate-100">
          <Image
            src="/banner.jpeg"
            alt="Dịch Vụ Tài Khoản Game Uy Tín"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/35 to-transparent flex flex-col justify-center px-4 sm:px-8 md:px-12 text-white">
            <span className="inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full bg-red-600/90 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1 sm:mb-2 backdrop-blur-xs">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              Hỗ Trợ Bàn Giao Nhanh 24/7
            </span>
            <h1 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-sm">
              Dịch Vụ Cho Thuê & Trải Nghiệm Acc
            </h1>
            <p className="mt-1 text-xs sm:text-sm md:text-base text-slate-200 line-clamp-1 sm:line-clamp-2 max-w-xl">
              Hỗ trợ trải nghiệm acc VIP skin đỉnh, acc Reg trắng thông tin 100%, bảo mật uy tín.
            </p>
          </div>
        </div>

        {/* Box Thông Báo Gọn Gàng Kiểu reg68 */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-base">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Trung Tâm Hỗ Trợ Dịch Vụ & Thuê Acc Trực Tiếp</span>
              </div>
              <p className="text-slate-600 text-[11px] sm:text-xs">
                Toàn bộ tài khoản cung cấp đều được kiểm định an toàn, hỗ trợ đổi mật khẩu và bảo mật chu đáo.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <a
                href="https://zalo.me/0966216495"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Zalo Hỗ Trợ</span>
              </a>

              <a
                href="tel:0966216495"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs border border-emerald-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>0966.216.495</span>
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Liên Hệ Thuê Ngay</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
