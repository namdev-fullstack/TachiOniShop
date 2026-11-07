"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Zap, 
  RotateCcw, 
  Headphones, 
  CheckCircle, 
  CreditCard, 
  KeyRound, 
  Search,
  Sparkles
} from "lucide-react";

const commitments = [
  {
    icon: ShieldCheck,
    title: "100% Trắng Thông Tin",
    desc: "Tài khoản hoàn toàn không liên kết CMND/CCCD, Facebook hay Email. Bạn toàn quyền thêm thông tin và bảo mật cá nhân.",
    badge: "An Toàn Tuyệt Đối",
    color: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50/50",
    borderLight: "border-emerald-200/60",
    iconColor: "text-emerald-600",
  },
  {
    icon: Zap,
    title: "Giao Dịch Siêu Tốc 30s",
    desc: "Hệ thống tự động hóa chuyển giao mật khẩu và mã đăng nhập ngay sau khi bạn đặt cọc hoặc thanh toán thành công.",
    badge: "Tự Động 24/7",
    color: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50/50",
    borderLight: "border-amber-200/60",
    iconColor: "text-amber-600",
  },
  {
    icon: RotateCcw,
    title: "Bảo Hành Đổi Trả 1-1",
    desc: "Cam kết hoàn tiền 100% hoặc đổi tài khoản tương đương nếu phát sinh tranh chấp hoặc lỗi trong quá trình sử dụng.",
    badge: "Bảo Vệ Người Dùng",
    color: "from-blue-500 to-indigo-500",
    bgLight: "bg-blue-50/50",
    borderLight: "border-blue-200/60",
    iconColor: "text-blue-600",
  },
  {
    icon: Headphones,
    title: "Hỗ Trợ Game Thủ 24/7",
    desc: "Đội ngũ CSKH chuyên nghiệp trực Zalo, Messenger hỗ trợ tận tình từ khâu chọn acc, đổi mật khẩu đến leo rank.",
    badge: "Nhiệt Tình Chu Đáo",
    color: "from-purple-500 to-pink-500",
    bgLight: "bg-purple-50/50",
    borderLight: "border-purple-200/60",
    iconColor: "text-purple-600",
  },
];

const steps = [
  {
    step: "01",
    title: "Chọn Acc Ưng Ý",
    desc: "Lọc theo rank, skin, tướng tủ hoặc mức giá phù hợp trên website.",
    icon: Search,
  },
  {
    step: "02",
    title: "Xem Ảnh Chi Tiết",
    desc: "Bấm vào ảnh để zoom HD xem kho tướng, skin, ngọc 90, thông số acc.",
    icon: CheckCircle,
  },
  {
    step: "03",
    title: "Đặt Cọc Hoặc Mua Đứt",
    desc: "Hỗ trợ nhiều hình thức thanh toán nhanh gọn: ATM, Ví Momo, Thẻ cào.",
    icon: CreditCard,
  },
  {
    step: "04",
    title: "Nhận Acc & Đổi Pass",
    desc: "Nhận tài khoản, đổi ngay mật khẩu và gắn thông tin bảo mật của bạn.",
    icon: KeyRound,
  },
];

export default function GamingFeatures() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white relative overflow-hidden border-t border-slate-200/70">
      
      {/* Background Decors */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Uy Tín Làm Nên Thương Hiệu</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Vì Sao Game Thủ Tin Tưởng <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Shop Chúng Tôi?</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Chúng tôi hiểu việc mua tài khoản cần nhất là sự an toàn, bảo mật và nguồn gốc trong sạch. Mỗi tài khoản bán ra đều được kiểm duyệt kỹ càng.
          </p>
        </div>

        {/* 4 Core Commitments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {commitments.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${item.bgLight} border ${item.borderLight} flex items-center justify-center mb-5`}>
                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>

                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    {item.badge}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span>Đảm bảo 100%</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 4-Step How It Works */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Quy Trình Mua Acc <span className="text-blue-600">Đơn Giản Trong 4 Bước</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Dễ dàng sở hữu tài khoản mơ ước chỉ trong vài phút với các bước minh bạch
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col items-center text-center p-4">
                  <div className="relative mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center shadow-md">
                      {step.step}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
