"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Flame, Zap, ZoomIn, ShieldCheck } from "lucide-react";
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
  is_white?: boolean;
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
            onPreviewImage(imgSrc);
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
            <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-emerald-400 text-emerald-700 text-[10px] sm:text-[11px] font-black select-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Trắng TT</span>
            </div>
          )}

          <button
            type="button"
            aria-label="Xem ảnh phóng to"
            onClick={(e) => {
              e.stopPropagation();
              onPreviewImage(imgSrc);
            }}
            className="badge-3d absolute top-2 right-2 w-7 h-7 rounded-full bg-slate-900/75 hover:bg-black text-white flex items-center justify-center opacity-85 group-hover:opacity-100 transition-all z-10 cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thông tin: Mã #id, Title, Người đang xem, Giá thật & Giá fake */}
        <div className="p-2.5 sm:p-3.5 space-y-1.5 sm:space-y-2">
          {/* Row #id của acc & Số người đang xem */}
          <div className="flex items-center justify-between gap-1 flex-wrap">
            <span className="inline-flex items-center text-[11px] sm:text-xs font-black font-mono text-red-600 bg-red-50 border border-red-200/80 px-1.5 py-0.5 rounded shadow-2xs">
              #{item.code}
            </span>
            <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs text-amber-700 bg-amber-50/90 border border-amber-200/80 px-1.5 py-0.5 rounded-md font-semibold shadow-2xs">
              <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-pulse shrink-0" />
              <span>{viewers} người xem</span>
            </div>
          </div>

          {/* Title của acc */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-red-600 transition-colors drop-shadow-xs leading-snug">
            {displayTitle}
          </h3>

          {/* Giá tiền 3D nổi bật & Giá fake */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
            <span className="text-3d-price text-sm sm:text-base md:text-lg font-black text-red-600">
              {formatPrice(realPrice)}
            </span>
            {fakePrice > realPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatPrice(fakePrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nút Trải Nghiệm Ngay */}
      <div className="p-2 sm:p-3 pt-0 mt-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/contact?acc=${encodeURIComponent(item.code || "")}`);
          }}
          className="w-full inline-flex items-center justify-center gap-1 rounded-xl px-2.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <Zap className="w-3 h-3 fill-amber-300 text-amber-300 drop-shadow-xs" />
          <span>Trải Nghiệm Ngay</span>
        </button>
      </div>
    </motion.article>
  );
}
