"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Facebook,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const accCode = searchParams ? searchParams.get("acc") : null;

  const contacts = [
    {
      title: "Hotline Hỗ Trợ",
      desc: "0966 - 216 - 495 ⚡",
      sub: "Gọi trực tiếp hỗ trợ 24/7",
      icon: <Phone className="w-6 h-6" />,
      color: "from-emerald-500 to-teal-600",
      href: "tel:0966216495",
      buttonText: "Gọi Ngay",
    },
    {
      title: "Zalo Admin",
      desc: "0966 - 216 - 495",
      sub: "Bàn giao acc & hỗ trợ đổi pass",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://zalo.me/0966216495",
      color: "from-blue-500 to-indigo-600",
      buttonText: "Nhắn Zalo",
    },
    {
      title: "Facebook Fanpage",
      desc: "Inbox Tư Vấn 24/7",
      sub: "Hỗ trợ kiểm tra acc & tư vấn",
      icon: <Facebook className="w-6 h-6" />,
      href: "https://facebook.com/namdev1029",
      color: "from-sky-500 to-blue-700",
      buttonText: "Nhắn Facebook",
    },
  ];

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* BANNER THÔNG BÁO TÀI KHOẢN MUỐN THUÊ NẾU CÓ */}
        {accCode && (
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">
                Yêu cầu thuê tài khoản
              </span>
              <p className="text-sm sm:text-base font-black text-slate-900">
                Mã tài khoản đã chọn: <span className="text-red-600">{accCode}</span>
              </p>
              <p className="text-xs text-slate-600">
                Vui lòng liên hệ Zalo hoặc Hotline bên dưới để hoàn tất thủ tục bàn giao ngay trong 30 giây!
              </p>
            </div>
            <a
              href={`https://zalo.me/0966216495?text=${encodeURIComponent(`Chào admin, mình muốn thuê tài khoản mã: ${accCode}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Gửi Mã Qua Zalo</span>
            </a>
          </div>
        )}

        {/* HEADER */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-2xl mx-auto pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kênh Hỗ Trợ Khách Hàng 24/7</span>
          </div>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Trung Tâm Hỗ Trợ & Bàn Giao Tài Khoản
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-600">
            Hỗ trợ trải nghiệm tài khoản nhanh chóng trong 30 giây, an toàn và bảo mật 100%.
          </p>
        </div>

        {/* TRUST BADGES: ĐỒNG BỘ 3 KHỐI NHỎ */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs">
            <ShieldCheck className="mx-auto mb-1 w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Bảo Mật 100%</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Trắng thông tin, tự tạo pass</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs">
            <Zap className="mx-auto mb-1 w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Bàn Giao 30s</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Tự động, nhanh gọn</p>
          </div>
          <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs">
            <Clock className="mx-auto mb-1 w-5 h-5 text-blue-500" />
            <h4 className="font-bold text-xs sm:text-sm text-slate-800">Trực 24/7</h4>
            <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">Hỗ trợ tận tình mọi lúc</p>
          </div>
        </div>

        {/* CONTACT CHANNELS CARDS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
          {contacts.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="block group"
            >
              <Card className="h-full border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-300 rounded-xl sm:rounded-2xl overflow-hidden">
                <CardContent className="p-4 sm:p-6 space-y-4 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div
                      className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${item.color} shadow-xs text-white group-hover:scale-105 transition-transform`}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base font-extrabold text-red-600 mt-0.5">
                        {item.desc}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.sub}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-blue-600">
                    <span>{item.buttonText}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-sm text-slate-500">Đang tải trang liên hệ...</div>}>
      <ContactContent />
    </Suspense>
  );
}
