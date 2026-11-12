"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, Zap, ZoomIn, ShieldCheck, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { isItemFavorite, toggleFavoriteItem } from "@/lib/favorites";

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
  is_white?: boolean;
};

interface AccountCardProps {
  item: AccountCardData;
  onPreviewImage: (url: string, item?: AccountCardData) => void;
  onRemoveFavorite?: (item: AccountCardData) => void;
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

export default function AccountCard({
  item,
  onPreviewImage,
  onRemoveFavorite,
}: AccountCardProps) {
  const router = useRouter();
  const imgSrc = item.images && item.images.length > 0 ? item.images[0] : "/acc.jpg";
  const displayTitle = item.title || item.highlight || `Acc #${item.code}`;
  const realPrice = Number(item.price) || 100000;
  const fakePrice = Number(item.fake_price) || Math.round(realPrice * 1.7);
  const viewers = getViewersCount(item.code || item.id, item.viewers);

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    setIsFavorited(isItemFavorite(item.id || item.code));
  }, [item]);

  useEffect(() => {
    const handleUpdate = () => {
      setIsFavorited(isItemFavorite(item.id || item.code));
    };
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [item]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited && onRemoveFavorite) {
      onRemoveFavorite(item);
      return;
    }
    const added = toggleFavoriteItem({
      id: item.id,
      code: item.code,
      title: displayTitle,
      price: realPrice,
      fake_price: fakePrice,
      images: item.images && item.images.length > 0 ? item.images : [imgSrc],
      is_white: item.is_white,
    });
    setIsFavorited(added);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="card-3d group relative flex flex-col justify-between overflow-hidden rounded-xl sm:rounded-2xl h-full"
    >
      <div>
        {/* Ảnh tài khoản: Click vào mở modal xem ảnh */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPreviewImage(imgSrc, item);
          }}
          className="img-frame-3d relative aspect-square w-full overflow-hidden bg-slate-100 cursor-zoom-in select-none shine-glow"
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

          {/* Nhãn dán Trắng TT trong ảnh - Sáng sủa, sắc nét, phẳng */}
          {item.is_white && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-white border border-emerald-400 text-emerald-700 text-[9px] min-[360px]:text-[10px] sm:text-[11px] font-black select-none">
              <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
              <span>Trắng TT</span>
            </div>
          )}

          {/* Nút Yêu thích & Phóng to ảnh góc phải */}
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 flex items-center gap-1 sm:gap-1.5">
            <button
              type="button"
              aria-label={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              onClick={handleToggleFavorite}
              className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-red-500 shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <Heart
                className={`w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5 transition-transform active:scale-125 ${
                  isFavorited ? "text-red-500 fill-red-500" : "text-slate-600"
                }`}
              />
            </button>

            <button
              type="button"
              aria-label="Xem ảnh phóng to"
              onClick={(e) => {
                e.stopPropagation();
                onPreviewImage(imgSrc, item);
              }}
              className="w-6 h-6 min-[360px]:w-7 min-[360px]:h-7 rounded-full bg-slate-900/75 hover:bg-black text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
            >
              <ZoomIn className="w-3 h-3 min-[360px]:w-3.5 min-[360px]:h-3.5" />
            </button>
          </div>
        </div>

        {/* Thông tin: Mã #id, Title, Người đang xem, Giá thật & Giá fake */}
        <div className="p-2 min-[360px]:p-2.5 sm:p-3.5 space-y-1 sm:space-y-1.5">
          {/* Row #id của acc & Số người đang xem */}
          <div className="flex items-center justify-between gap-1">
            <span className="inline-flex items-center text-[10px] min-[360px]:text-[11px] sm:text-xs font-black font-mono text-red-600 bg-red-50 border border-red-200/80 px-1 sm:px-1.5 py-0.5 rounded shadow-2xs shrink-0">
              #{item.code}
            </span>
            <div className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] min-[360px]:text-[10px] sm:text-xs text-amber-700 bg-amber-50/90 border border-amber-200/80 px-1 sm:px-1.5 py-0.5 rounded-md font-semibold shadow-2xs shrink-0">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 fill-red-500 animate-pulse shrink-0" />
              <span className="whitespace-nowrap">{viewers} xem</span>
            </div>
          </div>

          {/* Title của acc */}
          <h3 className="text-[11px] min-[360px]:text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors drop-shadow-xs leading-snug">
            {displayTitle}
          </h3>

          {/* Giá tiền 3D nổi bật & Giá fake */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap pt-0.5">
            <span className="text-3d-price text-xs min-[360px]:text-sm sm:text-base md:text-lg font-black text-red-600 whitespace-nowrap">
              {formatPrice(realPrice)}
            </span>
            {fakePrice > realPrice && (
              <span className="text-[9.5px] min-[360px]:text-[10.5px] sm:text-xs text-slate-400 line-through whitespace-nowrap">
                {formatPrice(fakePrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nút Trải Nghiệm Ngay - Co giãn linh hoạt, không vỡ dòng trên màn hình <= 390px */}
      <div className="p-1.5 min-[360px]:p-2 sm:p-3 pt-0 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/contact?acc=${encodeURIComponent(item.code || "")}`);
          }}
          className="w-full inline-flex items-center justify-center gap-1 rounded-xl px-1 min-[360px]:px-2 py-1.5 sm:py-2 text-[10px] min-[360px]:text-[11px] sm:text-xs font-bold text-white uppercase tracking-tight sm:tracking-wider bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap"
        >
          <Zap className="w-3 h-3 fill-amber-300 text-amber-300 drop-shadow-xs shrink-0" />
          <span className="whitespace-nowrap">Trải Nghiệm Ngay</span>
        </button>
      </div>
    </motion.article>
  );
}
