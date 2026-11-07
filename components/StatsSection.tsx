"use client";

import { ShoppingBag, Wallet, Users, Star, MessageSquareQuote, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    id: 1,
    label: "Tài Khoản Đã Bán",
    value: "15.800+",
    desc: "Giao dịch thành công & an toàn",
    icon: ShoppingBag,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    id: 2,
    label: "Tỷ Lệ Hài Lòng",
    value: "99.8%",
    desc: "Đánh giá 5 sao từ game thủ",
    icon: Heart,
    color: "from-rose-500 to-red-500",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    id: 3,
    label: "Cộng Tác Viên & Đại Lý",
    value: "80+",
    desc: "Mạng lưới phân phối toàn quốc",
    icon: Users,
    color: "from-purple-500 to-indigo-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    id: 4,
    label: "Hỗ Trợ Khách Hàng",
    value: "24/7",
    desc: "Phản hồi Zalo trong 60 giây",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
];

const reviews = [
  {
    name: "Tuấn Anh (Hà Nội)",
    role: "Game thủ Cao Thủ 35★",
    avatar: "TA",
    comment: "Mua con acc Florentino Tinh Hệ bên shop, thông tin trắng sạch 100% đổi mật khẩu cái một. Admin tư vấn siêu nhiệt tình lúc nửa đêm!",
    stars: 5,
    tag: "Mua Acc VIP SSS",
  },
  {
    name: "Minh Quang (Đà Nẵng)",
    role: "Chuyên đi Rừng - Top Raz",
    avatar: "MQ",
    comment: "Cọc 100k test thử mà nhận acc đúng 30 giây sau khi chuyển khoản. Acc full ngọc 90 leo rank mượt đét, sẽ ủng hộ shop dài dài.",
    stars: 5,
    tag: "Giao dịch tự động",
  },
  {
    name: "Hoàng Long (TP.HCM)",
    role: "Sinh viên ĐH Bách Khoa",
    avatar: "HL",
    comment: "Acc giá sinh viên 150k mà nhiều tướng skin ngon quá trời. Đổi pass không dính số điện thoại cũ gì cả, uy tín số 1 luôn.",
    stars: 5,
    tag: "Acc Học Sinh Giá Rẻ",
  },
];

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/80 to-white relative overflow-hidden">
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.text} flex items-center justify-center mb-3.5 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {stat.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {stat.desc}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Customer Testimonials Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Phản Hồi Thực Tế</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Cộng Đồng Game Thủ <span className="text-blue-600">Nói Gì Về Chúng Tôi?</span>
          </h3>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {rev.tag}
                  </span>
                </div>

                <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {rev.avatar}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {rev.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {rev.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
