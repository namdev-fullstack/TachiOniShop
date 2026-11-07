"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Crown, 
  Flame, 
  Star, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Layers,
  Sword,
  Compass,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    id: "vip",
    title: "Acc VIP Skin SSS & Vệ Thần",
    desc: "Tài khoản sở hữu skin bậc SSS, Thứ Nguyên Vệ Thần, Tuyệt Sắc đỉnh chóp.",
    img: "/bannerVip.jpeg",
    count: "1.420+",
    tag: { text: "VIP Đỉnh Cao", icon: Crown, color: "from-amber-500 to-orange-500" },
    filterUrl: "/products?category=vip",
  },
  {
    id: "white",
    title: "Acc Trắng Thông Tin 100%",
    desc: "Không liên kết bất kỳ số điện thoại hay email nào, đổi pass chính chủ 100%.",
    img: "/bannerReg.jpeg",
    count: "8.530+",
    tag: { text: "Trắng 100%", icon: ShieldCheck, color: "from-emerald-500 to-teal-500" },
    filterUrl: "/products?category=white",
  },
  {
    id: "tuchon",
    title: "Acc Tự Chọn Tướng & Skin",
    desc: "Lọc theo tướng tủ Florentino, Raz Muay Thái, Nakroth, Tulen theo ý muốn.",
    img: "/bannerTuChon.jpeg",
    count: "16.900+",
    tag: { text: "Tự Chọn", icon: Sparkles, color: "from-blue-500 to-indigo-500" },
    filterUrl: "/products?category=tuchon",
  },
  {
    id: "sale",
    title: "Acc Đang Flash Sale Giảm Giá",
    desc: "Tài khoản giảm kịch sàn 30% - 50% chỉ hôm nay, cam kết giá rẻ nhất thị trường.",
    img: "/bannerSale.jpeg",
    count: "4.380+",
    tag: { text: "Giảm Đến 50%", icon: Flame, color: "from-red-500 to-rose-500" },
    filterUrl: "/products?category=sale",
  },
  {
    id: "cheap",
    title: "Acc Giá Rẻ Học Sinh Sinh Viên",
    desc: "Tài khoản giá từ 50k - 200k, ngọc chuẩn 90, phù hợp leo rank cùng bạn bè.",
    img: "/bannerSieuRe.jpeg",
    count: "12.100+",
    tag: { text: "Siêu Rẻ", icon: Star, color: "from-purple-500 to-pink-500" },
    filterUrl: "/products?category=cheap",
  },
  {
    id: "server",
    title: "Acc Rank Cao Thủ - Thách Đấu",
    desc: "Acc cày sẵn rank cao, điểm uy tín 100, full tướng, bảng ngọc chuẩn thi đấu.",
    img: "/bannerCoThongTin.jpg",
    count: "3.250+",
    tag: { text: "Rank Cao", icon: Sword, color: "from-cyan-500 to-blue-600" },
    filterUrl: "/products?category=rank",
  },
];

export default function AccStore() {
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
      {/* Subtle gaming backdrop */}
      <div className="absolute inset-0 gaming-dots opacity-40 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Phân Loại Tài Khoản</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Thể Loại <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Acc Liên Quân</span> Đa Dạng
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Hàng ngàn tài khoản sẵn sàng phục vụ mọi nhu cầu: từ cày thuê leo rank, sưu tầm skin hiếm đến mua acc giá rẻ trải nghiệm.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.tag.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href={cat.filterUrl} className="block group h-full">
                  <Card className="h-full bg-white rounded-2xl border border-slate-200/90 group-hover:border-blue-400/80 shadow-xs hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col justify-between">
                    <CardContent className="p-0 flex flex-col h-full">
                      
                      {/* Image Thumbnail */}
                      <div className="relative overflow-hidden aspect-[16/9] bg-slate-100">
                        <Image
                          src={cat.img}
                          alt={cat.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          quality={90}
                          className="object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent" />

                        {/* Category Tag */}
                        <Badge
                          className={`absolute top-3 left-3 flex items-center gap-1.5 bg-gradient-to-r ${cat.tag.color} text-white text-[11px] font-black border-0 px-2.5 py-1 rounded-lg shadow-md`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.tag.text}</span>
                        </Badge>

                        {/* Count Pill */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-sm">
                          <Layers className="w-3 h-3 text-blue-600" />
                          <span>{cat.count} acc</span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {cat.title}
                            </h3>
                            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                          </div>
                          
                          <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {cat.desc}
                          </p>
                        </div>

                        {/* Footer Action */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                            Xem danh sách ngay
                          </span>
                          <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
