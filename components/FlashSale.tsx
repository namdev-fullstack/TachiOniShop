"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { formatPrice } from "@/lib/utils";
import {
  Zap,
  Flame,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  ZoomIn,
  ShieldCheck,
} from "lucide-react";
import ImagePreviewModal from "./ImagePreviewModal";

export type FlashSaleItem = {
  id: string;
  code: string;
  title: string;
  price: number;
  fake_price: number;
  discount: number;
  images: string[];
  soldCount: number;
  totalStock: number;
  slotTime?: string;
  is_white?: boolean;
};

// Dữ liệu mẫu phong phú theo đúng phong cách shopacclq.shop
const fallbackFlashSales: FlashSaleItem[] = [
  {
    id: "fs-1",
    code: "LQ-FS01",
    title: "ACC LIÊN QUÂN 1M-3M · FLORENTINO SSS",
    price: 1150000,
    fake_price: 1650000,
    discount: 30,
    images: ["/acc.jpg"],
    soldCount: 7,
    totalStock: 10,
    slotTime: "12:00",
  },
  {
    id: "fs-2",
    code: "LQ-FS02",
    title: "ACC LIÊN QUÂN DƯỚI 1M · RAZ MUAY THÁI",
    price: 680000,
    fake_price: 990000,
    discount: 31,
    images: ["/acc1.jpg"],
    soldCount: 9,
    totalStock: 10,
    slotTime: "12:00",
  },
  {
    id: "fs-3",
    code: "LQ-FS03",
    title: "ACC REG TRẮNG TT · FULL NGỌC 90",
    price: 85000,
    fake_price: 150000,
    discount: 43,
    images: ["/bannerReg.jpeg"],
    soldCount: 14,
    totalStock: 15,
    slotTime: "12:00",
    is_white: true,
  },
  {
    id: "fs-4",
    code: "LQ-FS04",
    title: "ACC LIÊN QUÂN TỪ 3M+ · TULEN CHÍ TÔN",
    price: 3200000,
    fake_price: 4500000,
    discount: 29,
    images: ["/acc.jpg"],
    soldCount: 3,
    totalStock: 5,
    slotTime: "12:00",
  },
  {
    id: "fs-5",
    code: "LQ-FS05",
    title: "ACC LIÊN QUÂN 1M-3M · NAKROTH VỆ THẦN",
    price: 1890000,
    fake_price: 2600000,
    discount: 27,
    images: ["/acc1.jpg"],
    soldCount: 6,
    totalStock: 8,
    slotTime: "12:00",
  },
  {
    id: "fs-6",
    code: "LQ-FS06",
    title: "ACC LIÊN QUÂN DƯỚI 1M · AYA MC + FULL TƯỚNG",
    price: 490000,
    fake_price: 750000,
    discount: 35,
    images: ["/acc.jpg"],
    soldCount: 8,
    totalStock: 10,
    slotTime: "12:00",
  },
];

export default function FlashSale() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<FlashSaleItem[]>(fallbackFlashSales);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Fetch Firestore
  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const snap = await getDocs(collection(db, "accounts"));
        if (!snap.empty) {
          const list: FlashSaleItem[] = [];
          snap.docs.forEach((doc, idx) => {
            const d = doc.data();
            if (d.status === "sold" || d.is_active === false) return;

            const price = Number(d.price) || 100000;
            const fakePrice = Number(d.fake_price) || Math.round(price * 1.45);
            const discount =
              fakePrice > price
                ? Math.round(((fakePrice - price) / fakePrice) * 100)
                : 25;

            const soldCount = 3 + ((idx * 3) % 8);
            const totalStock = soldCount + 2 + ((idx * 2) % 4);
            const isWhite = Boolean(
              d.is_white !== undefined
                ? d.is_white
                : (d.category_id || "").toLowerCase().includes("white") ||
                  (d.category?.name || "").toLowerCase().includes("trắng")
            );

            list.push({
              id: doc.id,
              code: d.code || `LQ-${100 + idx}`,
              title: d.highlight || `Acc Liên Quân #${d.code || 100 + idx}`,
              price,
              fake_price: fakePrice,
              discount,
              images: d.images && d.images.length > 0 ? d.images : ["/acc.jpg"],
              soldCount,
              totalStock,
              slotTime: "12:00",
              is_white: isWhite,
            });
          });

          if (list.length > 0) {
            setItems(list);
          }
        }
      } catch (err) {
        console.warn("Using sample flash sale accounts");
      }
    };

    fetchFlashSales();
  }, []);

  // Điều khiển cuộn ngang nhảy từng 1 item mượt mà
  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const first = container.children[0] as HTMLElement | undefined;
    const second = container.children[1] as HTMLElement | undefined;
    if (!first) return;

    const itemStep = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth + 12;
    const delta = direction === "left" ? -itemStep : itemStep;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  // Tự động scroll nhảy từng item 1, mượt mà nhẹ nhàng
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || items.length === 0) return;

    let isPaused = false;

    const pause = () => {
      isPaused = true;
    };
    const resume = () => {
      isPaused = false;
    };

    const handleTouchEnd = () => {
      // Đợi 2.5s sau khi thả tay vuốt thì mới tiếp tục tự động cuộn
      setTimeout(() => {
        isPaused = false;
      }, 2500);
    };

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", resume);
    container.addEventListener("touchstart", pause, { passive: true });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    const interval = setInterval(() => {
      if (isPaused || !scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const first = el.children[0] as HTMLElement | undefined;
      const second = el.children[1] as HTMLElement | undefined;
      if (!first) return;

      const itemStep = second ? second.offsetLeft - first.offsetLeft : first.offsetWidth + 12;
      const maxScrollLeft = el.scrollWidth - el.clientWidth;

      // Nếu đã cuộn gần hết (trong khoảng nửa card), cuộn quay lại đầu mượt mà
      if (el.scrollLeft >= maxScrollLeft - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: itemStep, behavior: "smooth" });
      }
    }, 3200); // Khoảng thời gian 3.2 giây nhảy 1 item êm ái

    return () => {
      clearInterval(interval);
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", resume);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [items]);

  return (
    <section className="w-full py-2 sm:py-3 md:py-4">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">

        {/* CONTAINER FLASH SALE DẠNG STRIP SANG TRỌNG VỚI NỀN CHUYỂN ĐỘNG NHẸ NHÀNG (ĐÃ BỎ BÓNG NGOÀI BORDER) */}
        <div className="rounded-2xl sm:rounded-3xl border border-red-200/90 bg-animated-flashsale overflow-hidden p-3 sm:p-5 md:p-6 shadow-none">
          
          {/* HEADER: Tiêu đề + Countdown + Mũi tên Scroll */}
          <div className="flex items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-rose-200/70">
            
            {/* Vế trái: Logo Flash Sale + Hôm Nay */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Badge Flash Sale */}
              <div className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-bounce shrink-0 drop-shadow-xs" />
                <span>FLASH SALE</span>
              </div>

              {/* Tag Hôm Nay */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-rose-100 text-red-700 font-extrabold text-[11px] sm:text-sm border border-rose-200">
                <Sparkles className="w-3 h-3 text-red-600 animate-pulse shrink-0" />
                <span>Hôm Nay</span>
              </span>
            </div>

            {/* Vế phải: Nút cuộn trái/phải */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs text-slate-600 font-semibold hidden sm:inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-500" />
                Ưu đãi giá tốt trong ngày
              </span>

              {/* Nút lùi/tiến desktop & tablet */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Xem sản phẩm trước"
                  onClick={() => scroll("left")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Xem sản phẩm kế tiếp"
                  onClick={() => scroll("right")}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* CAROUSEL / HORIZONTAL SCROLL CARDS: Tối ưu cuộn mượt không bị khựng scroll trang trên mobile */}
          <div
            ref={scrollContainerRef}
            className="flex gap-2 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pt-2.5 sm:pt-3.5 pb-1 -mx-2.5 px-2.5 sm:mx-0 sm:px-0 overscroll-x-contain snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {items.map((acc) => {
              const imgSrc =
                acc.images && acc.images.length > 0 ? acc.images[0] : "/acc.jpg";

              return (
                <div
                  key={acc.id}
                  className="w-[calc(50%-4px)] sm:w-[215px] md:w-[235px] shrink-0 snap-start rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white hover:border-red-300 transition-colors duration-200 flex flex-col justify-between overflow-hidden group shadow-none"
                >
                  <div>
                    {/* Thumbnail + Badges */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(imgSrc);
                      }}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 cursor-zoom-in shine-glow"
                    >
                      <Image
                        src={imgSrc}
                        alt={acc.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 235px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badge Flash Sale góc trái */}
                      <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-600 shadow-xs z-10">
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        <span>Flash Sale</span>
                      </span>

                      {/* Badge Trắng TT góc dưới trái ảnh - Sáng sủa, sắc nét */}
                      {acc.is_white && (
                        <span className="absolute bottom-1.5 left-1.5 z-10 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-emerald-400 text-emerald-700 text-[9px] sm:text-[10px] font-black select-none">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Trắng TT</span>
                        </span>
                      )}

                      {/* Badge Giảm % góc phải */}
                      <span className="absolute top-1.5 right-1.5 text-[9px] sm:text-[10px] font-black text-white px-1.5 py-0.5 rounded-md bg-gradient-to-b from-amber-400 to-amber-500 shadow-xs">
                        -{acc.discount}%
                      </span>

                      {/* Nút xem ảnh */}
                      <button
                        type="button"
                        aria-label="Phóng to ảnh"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(imgSrc);
                        }}
                        className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-slate-900/75 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Nội dung chi tiết */}
                    <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5">
                      {/* Tiêu đề acc */}
                      <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors drop-shadow-xs">
                        {acc.title}
                      </h3>

                      {/* Giá sale & giá fake */}
                      <div className="space-y-0.5 pt-0.5 pb-0.5">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-3d-price text-xs sm:text-base font-black text-red-600">
                            {formatPrice(acc.price)}
                          </span>
                        </div>
                        {acc.fake_price > acc.price && (
                          <div className="text-[10px] sm:text-xs text-slate-400 line-through">
                            {formatPrice(acc.fake_price)}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* Nút hành động Trải Nghiệm Ngay */}
                  <div className="p-2 sm:p-3 pt-0">
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/contact?acc=${encodeURIComponent(acc.code)}`)
                      }
                      className="w-full py-1.5 sm:py-2 rounded-xl text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs hover:shadow transition-all cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-amber-300 text-amber-300 drop-shadow-xs" />
                      <span>Trải Nghiệm Ngay</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      {/* Modal xem ảnh chi tiết */}
      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </section>
  );
}
