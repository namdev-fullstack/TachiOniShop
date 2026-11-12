"use client";

import Link from "next/link";
import { Headphones, ArrowRight } from "lucide-react";

// Icon bong bóng tin nhắn có các vạch chat chuẩn bản thiết kế
function ChatMessageIcon({ className = "w-5 h-5 text-[#5B4EF6]" }: { className?: string }) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M8 10h8" />
      <path d="M8 14h5" />
    </svg>
  );
}

interface ConsultationSectionProps {
  className?: string;
  accCode?: string;
}

export default function ConsultationSection({ className = "", accCode }: ConsultationSectionProps) {
  const contactHref = accCode
    ? `/contact?acc=${encodeURIComponent(accCode)}`
    : "/contact";

  return (
    <section className={`w-full py-4 select-none ${className}`}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 space-y-3.5">
        
        {/* 1. Khung card tư vấn: "Bạn cần tư vấn thêm?" */}
        <div className="bg-[#EEECFF] rounded-3xl p-4 sm:p-5 border border-[#5B4EF6]/15 shadow-xs">
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/70 text-[#5B4EF6] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Headphones className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                Bạn cần tư vấn thêm?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                Nhắn Zalo để được hỗ trợ chọn acc và tìm hiểu cách trải nghiệm.
              </p>

              {/* Dòng hotline / Zalo & Hỗ trợ 24/7 */}
              <div className="mt-3 pt-2.5 border-t border-[#5B4EF6]/15 flex items-center justify-between">
                <a
                  href="https://zalo.me/0966216495"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base font-black text-[#5B4EF6] hover:underline tracking-tight"
                >
                  0966 216 495
                </a>
                <span className="text-xs font-bold text-[#5B4EF6]/90">
                  Hỗ trợ 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Thanh Action Bar: Nút Chat + Nút Trải nghiệm ngay */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nút Chat Zalo */}
          <a
            href="https://zalo.me/0966216495"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Nhắn tin Zalo hỗ trợ"
            className="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-[#EEECFF] hover:bg-[#e2dfff] flex items-center justify-center shrink-0 transition-colors shadow-xs active:scale-95"
          >
            <ChatMessageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#5B4EF6]" />
          </a>

          {/* Nút Trải nghiệm ngay */}
          <Link
            href={contactHref}
            className="flex-1 h-11 sm:h-13 rounded-xl sm:rounded-2xl bg-[#5B4EF6] hover:bg-[#4d32b5] text-white flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs min-[360px]:text-sm sm:text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all px-3 sm:px-4 whitespace-nowrap"
          >
            <span className="whitespace-nowrap">Trải nghiệm ngay</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 stroke-[2.5] shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
}
