"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  ZoomIn, 
  ChevronRight, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Sword,
  SlidersHorizontal,
  Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { addPrice, formatPrice, getDeposit } from "@/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import ProductDialog from "./ProductDialog";
import ImageLightbox, { useImageLightbox } from "./ImageLightbox";

type AccItem = {
  id: string;
  code: string;
  rank: string;
  heroes_count: number;
  skins_count: number;
  price: number;
  fake_price: number;
  highlight: string;
  is_sale: boolean;
  images: string[];
  category: { id: string; name: string };
  tabType: "all" | "rank_high" | "skin_vip" | "white_tt" | "cheap";
};

const initialAccList: AccItem[] = [
  {
    id: "f-1",
    code: "ACC-VIP101",
    rank: "Thách Đấu 52★",
    heroes_count: 118,
    skins_count: 340,
    price: 950000,
    fake_price: 1800000,
    highlight: "Raz Muay Thái + Nak Thứ Nguyên Vệ Thần",
    is_sale: true,
    images: ["/acc.jpg"],
    category: { id: "vip", name: "Acc VIP" },
    tabType: "rank_high",
  },
  {
    id: "f-2",
    code: "ACC-FL102",
    rank: "Cao Thủ 30★",
    heroes_count: 112,
    skins_count: 280,
    price: 520000,
    fake_price: 950000,
    highlight: "Florentino Tinh Hệ + Giám Sát Tinh Hệ",
    is_sale: true,
    images: ["/acc1.jpg"],
    category: { id: "vip", name: "Skin VIP" },
    tabType: "skin_vip",
  },
  {
    id: "f-3",
    code: "ACC-TT103",
    rank: "Cao Thủ 15★",
    heroes_count: 95,
    skins_count: 180,
    price: 350000,
    fake_price: 600000,
    highlight: "Full Ngọc 90 - 100% Trắng Thông Tin",
    is_sale: false,
    images: ["/acc.jpg"],
    category: { id: "white", name: "Trắng TT" },
    tabType: "white_tt",
  },
  {
    id: "f-4",
    code: "ACC-HS104",
    rank: "Tinh Anh II",
    heroes_count: 75,
    skins_count: 110,
    price: 150000,
    fake_price: 300000,
    highlight: "Murad Đồ Thần Đao + Ngộ Không Siêu Việt",
    is_sale: true,
    images: ["/acc1.jpg"],
    category: { id: "cheap", name: "Giá Rẻ" },
    tabType: "cheap",
  },
  {
    id: "f-5",
    code: "ACC-TD105",
    rank: "Thách Đấu 28★",
    heroes_count: 118,
    skins_count: 295,
    price: 780000,
    fake_price: 1400000,
    highlight: "Lauriel Thứ Nguyên Vệ Thần + Tulen Thần Sứ",
    is_sale: true,
    images: ["/acc.jpg"],
    category: { id: "vip", name: "Acc VIP" },
    tabType: "rank_high",
  },
  {
    id: "f-6",
    code: "ACC-TL106",
    rank: "Cao Thủ 25★",
    heroes_count: 104,
    skins_count: 220,
    price: 420000,
    fake_price: 750000,
    highlight: "Tulen Chí Tôn Kiếm Tiên + Điêu Thuyền Hoa Khôi",
    is_sale: false,
    images: ["/acc1.jpg"],
    category: { id: "vip", name: "Skin VIP" },
    tabType: "skin_vip",
  },
  {
    id: "f-7",
    code: "ACC-TT107",
    rank: "Kim Cương I",
    heroes_count: 80,
    skins_count: 130,
    price: 220000,
    fake_price: 400000,
    highlight: "Acc Học Sinh - Trắng TT Đổi Ngay Pass",
    is_sale: true,
    images: ["/acc.jpg"],
    category: { id: "cheap", name: "Giá Rẻ" },
    tabType: "cheap",
  },
  {
    id: "f-8",
    code: "ACC-TT108",
    rank: "Cao Thủ 10★",
    heroes_count: 90,
    skins_count: 165,
    price: 290000,
    fake_price: 550000,
    highlight: "Trắng Sạch 100% Chưa Liên Kết",
    is_sale: false,
    images: ["/acc1.jpg"],
    category: { id: "white", name: "Trắng TT" },
    tabType: "white_tt",
  },
];

const tabs = [
  { id: "all", label: "Tất Cả Acc Hot", icon: Sparkles },
  { id: "rank_high", label: "Cao Thủ - Thách Đấu", icon: Trophy },
  { id: "skin_vip", label: "Skin SSS / Vệ Thần", icon: Star },
  { id: "white_tt", label: "100% Trắng Thông Tin", icon: ShieldCheck },
  { id: "cheap", label: "Học Sinh (< 250k)", icon: Flame },
];

export default function FeaturedRankShowcase() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [accounts, setAccounts] = useState<AccItem[]>(initialAccList);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const { isOpen, images, currentIndex, openLightbox, closeLightbox } = useImageLightbox();

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const snap = await getDocs(collection(db, "accounts"));
        if (!snap.empty) {
          const list: AccItem[] = snap.docs.map((doc, idx) => {
            const d = doc.data();
            const price = Number(d.price) || 200000;
            const rank = d.rank || "Cao Thủ";
            
            let tabType: AccItem["tabType"] = "all";
            if (rank.includes("Thách Đấu") || rank.includes("Cao Thủ")) tabType = "rank_high";
            else if (price < 250000) tabType = "cheap";
            else if (d.category?.id === "white") tabType = "white_tt";
            else tabType = "skin_vip";

            return {
              id: doc.id,
              code: d.code || `ACC-${100 + idx}`,
              rank: rank,
              heroes_count: d.heroes_count || 90,
              skins_count: d.skins_count || 150,
              price: price,
              fake_price: Number(d.fake_price) || price * 1.8,
              highlight: d.highlight || `Acc Liên Quân ${rank}`,
              is_sale: d.is_sale ?? true,
              images: d.images?.length > 0 ? d.images : ["/acc.jpg"],
              category: d.category || { id: "vip", name: "VIP" },
              tabType: tabType,
            };
          });
          setAccounts(list);
        }
      } catch (err) {
        console.warn("Using sample featured accounts");
      }
    };
    fetchDb();
  }, []);

  const filteredAccounts =
    activeTab === "all"
      ? accounts
      : accounts.filter((item) => {
          if (activeTab === "rank_high") return item.rank.includes("Cao Thủ") || item.rank.includes("Thách Đấu");
          if (activeTab === "skin_vip") return item.price >= 400000 || item.skins_count >= 200;
          if (activeTab === "white_tt") return item.tabType === "white_tt" || item.category?.name?.includes("Trắng");
          if (activeTab === "cheap") return item.price <= 250000;
          return true;
        });

  return (
    <section className="py-14 md:py-20 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sword className="w-3.5 h-3.5" />
              <span>Kho Tài Khoản Tuyển Chọn</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Tài Khoản <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Mới Cập Nhật</span> Hôm Nay
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 group self-start md:self-auto"
          >
            <span>Xem toàn bộ {accounts.length > 8 ? accounts.length : 200}+ acc</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Interactive Gaming Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                    : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400" : "text-slate-500"}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute -bottom-1 left-3 right-3 h-0.5 bg-blue-500 rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid of Accounts with Smooth Motion */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredAccounts.slice(0, 8).map((acc) => {
              const finalPrice = Number(acc.price) + addPrice(Number(acc.price));
              const depositPrice = getDeposit(finalPrice);

              return (
                <motion.div
                  key={acc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    onClick={() => setSelectedProduct(acc)}
                    className="group cursor-pointer bg-white rounded-2xl border border-slate-200 hover:border-blue-400 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full"
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <Image
                          src={acc.images?.[0] || "/acc.jpg"}
                          alt={acc.code}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          quality={90}
                          className="object-cover object-top group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/15" />

                        {/* Rank Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-sm text-white text-[11px] font-bold border border-slate-700/60">
                          <Trophy className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-300">{acc.rank}</span>
                        </div>

                        {/* Zoom Lightbox */}
                        <button
                          type="button"
                          aria-label="Xem ảnh"
                          onClick={(e) => {
                            e.stopPropagation();
                            const imgs = acc.images?.length > 0 ? acc.images : ["/acc.jpg"];
                            openLightbox(imgs, 0);
                          }}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>

                        {/* Bottom Tag */}
                        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                          <span className="font-mono font-bold bg-black/60 px-2 py-0.5 rounded text-[11px]">
                            {acc.code}
                          </span>
                          <span className="text-[10px] bg-emerald-500/90 font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                            Trắng TT 100%
                          </span>
                        </div>
                      </div>

                      {/* Info Body */}
                      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {acc.highlight || `Acc Liên Quân ${acc.code}`}
                          </h3>

                          <div className="flex items-center gap-1.5 mt-2 text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                              {acc.heroes_count} Tướng
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                              {acc.skins_count} Skin
                            </span>
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                              Ngọc 90
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-black text-red-600">
                              {formatPrice(finalPrice)}
                            </span>
                            {acc.fake_price > finalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                {formatPrice(Number(acc.fake_price))}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                            <span>Cọc chỉ từ: <strong>{formatPrice(depositPrice)}</strong></span>
                            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                              Chi tiết <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA to All Products */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Mở Bộ Lọc Nâng Cao Kho Acc</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* Lightbox & Dialog */}
      <ProductDialog selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <ImageLightbox images={images} open={isOpen} onClose={closeLightbox} initialIndex={currentIndex} />
    </section>
  );
}
