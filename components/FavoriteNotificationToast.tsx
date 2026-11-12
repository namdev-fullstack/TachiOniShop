"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ChevronRight, CheckCircle2 } from "lucide-react";
import { FavoriteItem } from "@/lib/favorites";
import { formatPrice } from "@/lib/utils";

export default function FavoriteNotificationToast() {
  const [toastData, setToastData] = useState<{
    item: FavoriteItem;
    isAdded: boolean;
  } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleFavoriteUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{
        item: FavoriteItem;
        isAdded: boolean;
        count: number;
      }>;

      if (customEvent.detail) {
        setToastData({
          item: customEvent.detail.item,
          isAdded: customEvent.detail.isAdded,
        });

        clearTimeout(timer);
        timer = setTimeout(() => {
          setToastData(null);
        }, 3600);
      }
    };

    window.addEventListener("favorites-updated", handleFavoriteUpdate);
    return () => {
      window.removeEventListener("favorites-updated", handleFavoriteUpdate);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed top-20 right-3 sm:right-6 z-[9999] pointer-events-none select-none max-w-[360px] w-full">
      <AnimatePresence>
        {toastData && (
          <motion.div
            initial={{ x: 140, opacity: 0, scale: 0.92 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 140, opacity: 0, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] p-3 sm:p-3.5"
          >
            {/* Header Toast */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                {toastData.isAdded ? (
                  <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-bounce" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                )}
                <span className="text-xs font-bold text-slate-900">
                  {toastData.isAdded
                    ? "Đã thêm vào yêu thích!"
                    : "Đã bỏ khỏi yêu thích"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setToastData(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Item: Ảnh, mã số, title, giá */}
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                <Image
                  src={
                    toastData.item.images && toastData.item.images.length > 0
                      ? toastData.item.images[0]
                      : "/acc.jpg"
                  }
                  alt={toastData.item.title || `#${toastData.item.code}`}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black font-mono px-1.5 py-0.2 rounded bg-red-50 text-red-600 border border-red-200/80">
                    #{toastData.item.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {toastData.item.title || `Acc #${toastData.item.code}`}
                  </h4>
                </div>

                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs font-black text-[#5B4EF6]">
                    {formatPrice(toastData.item.price)}
                  </span>

                  {toastData.isAdded && (
                    <Link
                      href="/favorites"
                      onClick={() => setToastData(null)}
                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#5B4EF6] hover:underline"
                    >
                      <span>Xem DS</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
