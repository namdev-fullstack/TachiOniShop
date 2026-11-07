"use client";

import { Flame, ShieldCheck, Zap, Sparkles, Trophy, Clock } from "lucide-react";

export default function GamingTicker() {
  const items = [
    { icon: Zap, text: "GIAO DỊCH TỰ ĐỘNG 24/7 - NHẬN TÀI KHOẢN TRONG 30 GIÂY", color: "text-amber-500" },
    { icon: ShieldCheck, text: "CAM KẾT 100% TRẮNG THÔNG TIN - ĐỔI MẬT KHẨU CHÍNH CHỦ", color: "text-emerald-500" },
    { icon: Trophy, text: "BẢO HÀNH TRỌN ĐỜI - HỖ TRỢ ĐỔI TRẢ 1-1 NẾU PHÁT SINH LỖI", color: "text-blue-500" },
    { icon: Sparkles, text: "CẬP NHẬT KHO ACC SKIN THỨ NGUYÊN VỆ THẦN & SSS TUYỆT SẮC MỖI NGÀY", color: "text-purple-500" },
    { icon: Flame, text: "FLASH SALE GIẢM TỚI 50% DUY NHẤT HÔM NAY - SỐ LƯỢNG CÓ HẠN", color: "text-red-500" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-y border-slate-200/70 py-2.5">
      <div className="flex select-none whitespace-nowrap animate-marquee">
        <div className="flex shrink-0 items-center gap-8 px-4 text-xs font-semibold tracking-wider text-slate-700">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <span key={`ticker-1-${index}`} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${item.color} animate-pulse`} />
                <span>{item.text}</span>
                <span className="text-slate-300 ml-4 font-normal">|</span>
              </span>
            );
          })}
        </div>
        <div className="flex shrink-0 items-center gap-8 px-4 text-xs font-semibold tracking-wider text-slate-700" aria-hidden="true">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <span key={`ticker-2-${index}`} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${item.color} animate-pulse`} />
                <span>{item.text}</span>
                <span className="text-slate-300 ml-4 font-normal">|</span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
