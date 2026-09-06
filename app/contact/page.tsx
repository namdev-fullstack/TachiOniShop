"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MessageCircle,
  Facebook,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function ContactPage() {
  const contacts = [
    {
      title: "Gọi ngay",
      desc: "0966 - 216 - 495 ⚡",
      icon: <Phone className="w-6 h-6" />,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Zalo",
      desc: "0966 - 216 - 495",
      icon: <MessageCircle className="w-6 h-6" />,
      href: "https://zalo.me/0966216495",
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Facebook",
      desc: "Inbox 24/7 💬",
      icon: <Facebook className="w-6 h-6" />,
      href: "https://facebook.com/namdev1029",
      color: "from-indigo-400 to-indigo-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-red-50 text-gray-800 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full shadow-lg animate-pulse text-white">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold">
            Bạn Cần Hỗ Trợ - Mua Acc Liên Quân 🔥
          </h1>

          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">
            Acc đẹp - giá thơm - giao ngay trong 30s 🚀 <br />
            Không ưng hoàn tiền 💯
          </p>
        </div>

        {/* TRUST */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs md:text-sm">
          <div className="bg-white p-3 rounded-xl shadow-sm border">
            <ShieldCheck className="mx-auto mb-1 text-green-500" />
            Uy tín
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border">
            <Zap className="mx-auto mb-1 text-yellow-500" />
            Nhanh
          </div>
          <div className="bg-white p-3 rounded-xl shadow-sm border">
            <Sparkles className="mx-auto mb-1 text-pink-500" />
            Acc xịn
          </div>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {contacts.map((item, i) => (
            <a key={i} href={item.href} target="_blank">
              <Card className="group border bg-white hover:bg-gradient-to-br hover:from-white hover:to-orange-50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20 rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">

                  {/* ICON */}
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r ${item.color} shadow-md text-white group-hover:scale-110 transition`}
                  >
                    {item.icon}
                  </div>

                  {/* TEXT */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.desc}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="text-sm text-red-500 font-semibold group-hover:translate-x-1 transition">
                    Liên hệ ngay →
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* QUOTE */}
        <div className="text-center bg-gradient-to-r from-orange-100 to-red-100 p-5 rounded-2xl border">
          <p className="text-sm md:text-base text-gray-700">
            💬 "Acc xịn không chờ đợi – chậm là người khác lấy mất!" <br />
            👉 Inbox ngay để giữ acc 🔥
          </p>
        </div>

      </div>
    </div>
  );
}