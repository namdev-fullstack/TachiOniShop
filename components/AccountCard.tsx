"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, Zap, ZoomIn } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

export type AccountCardData = {
  id: string;
  code: string;
  title?: string;
  highlight?: string;
  price: number;
  fake_price?: number;
  images: string[];
  viewers?: number;
  soldCount?: number;
};

interface AccountCardProps {
  item: AccountCardData;
  onPreviewImage: (url: string) => void;
}

// Hàm tính số người đang xem ổn định theo mã tài khoản
function getViewersCount(codeOrId: string, initialViewers?: number): number {
  if (initialViewers && initialViewers > 0) return initialViewers;
  let hash = 0;
  for (let i = 0; i < codeOrId.length; i++) {
    hash = (hash << 5) - hash + codeOrId.charCodeAt(i);
    hash |= 0;
  }
  return 8 + (Math.abs(hash) % 21);
}

export default function AccountCard({ item, onPreviewImage }: AccountCardProps) {
  const router = useRouter();
  const imgSrc = item.images && item.images.length > 0 ? item.images[0] : "/acc.jpg";
  const displayTitle = item.title || item.highlight || `Acc #${item.code}`;
  const realPrice = Number(item.price) || 100000;
  const fakePrice = Number(item.fake_price) || Math.round(realPrice * 1.7);
  const viewers = getViewersCount(item.code || item.id, item.viewers);

  // Số đã bán: dùng soldCount nếu có, ngược lại tính từ hash của code để ổn định
  const soldCount = (() => {
    if (item.soldCount && item.soldCount > 0) return item.soldCount;
    let hash = 0;
    const key = item.code || item.id;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
      hash |= 0;
    }
    return 10 + (Math.abs(hash) % 90);
  })();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ y: -4, boxShadow: "0 12px 32px 0 rgba(0,0,0,0.10)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors duration-300 h-full"
    >
      <div>
        {/* Ảnh tài khoản: Click vào mở modal xem ảnh gần full chiều cao, không co giãn */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPreviewImage(imgSrc);
          }}
          className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-zoom-in select-none shine-glow"
        >
          <Image
            src={imgSrc}
            alt={displayTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Lớp phủ & Nút zoom góc ảnh */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors" />
          <button
            type="button"
            aria-label="Xem ảnh phóng to"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewImage(imgSrc);
            }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thông tin rút gọn: Tiêu đề, Người đang xem, Giá thật & Giá fake */}
        <div className="p-2.5 sm:p-3.5 space-y-1.5 sm:space-y-2">
          {/* Tên / Mã tài khoản */}
          <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {displayTitle}
          </h3>

          {/* Người đang xem */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-600 font-medium">
            <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-pulse shrink-0" />
            <span>{viewers} người đang xem</span>
          </div>

          {/* Giá tiền & Giá fake */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
            <span className="text-sm sm:text-base font-extrabold text-red-600">
              {formatPrice(realPrice)}
            </span>
            {fakePrice > realPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatPrice(fakePrice)}
              </span>
            )}
          </div>

          {/* Đã bán */}
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
            Đã bán:{" "}
            <span className="text-slate-600 font-semibold">{soldCount}</span>
          </p>
        </div>
      </div>

      {/* Nút Thuê Ngay -> Nhảy qua trang liên hệ */}
      <div className="p-2.5 sm:p-3.5 pt-0 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/contact?acc=${encodeURIComponent(item.code || "")}`);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-all bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 shadow-xs cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Thuê Ngay</span>
        </button>
      </div>
    </motion.article>
  );
}
