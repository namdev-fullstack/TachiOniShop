"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Heart, Zap, ShieldCheck } from "lucide-react";
import { FavoriteItem, isItemFavorite, toggleFavoriteItem } from "@/lib/favorites";
import { formatPrice } from "@/lib/utils";

export type ImagePreviewTarget = {
  imageUrl: string;
  item?: FavoriteItem | null;
} | string | null;

interface ImagePreviewModalProps {
  imageUrl?: string | null;
  item?: FavoriteItem | null;
  data?: ImagePreviewTarget;
  onClose: () => void;
}

export default function ImagePreviewModal({
  imageUrl: propImageUrl,
  item: propItem,
  data,
  onClose,
}: ImagePreviewModalProps) {
  const router = useRouter();

  // Chuẩn hóa props
  const activeImageUrl =
    typeof data === "string"
      ? data
      : data?.imageUrl || propImageUrl || null;

  const activeItem =
    typeof data === "object" && data !== null
      ? data.item || propItem || null
      : propItem || null;

  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (activeItem) {
      setIsFavorited(isItemFavorite(activeItem.id || activeItem.code));
    }
  }, [activeItem]);

  // Lắng nghe thay đổi favorite từ bên ngoài
  useEffect(() => {
    const handleUpdate = () => {
      if (activeItem) {
        setIsFavorited(isItemFavorite(activeItem.id || activeItem.code));
      }
    };
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, [activeItem]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (activeImageUrl) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [activeImageUrl, onClose]);

  if (!activeImageUrl) return null;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeItem) {
      const added = toggleFavoriteItem(activeItem);
      setIsFavorited(added);
    } else {
      // Nếu không có item chi tiết thì tạo tạm từ imageUrl
      const fallbackItem: FavoriteItem = {
        id: activeImageUrl,
        code: "VIP",
        title: "Tài khoản game",
        price: 0,
        images: [activeImageUrl],
      };
      const added = toggleFavoriteItem(fallbackItem);
      setIsFavorited(added);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in duration-150 cursor-pointer select-none"
    >
      {/* Top Bar: Thông tin acc & Nút đóng */}
      <div
        className="w-full max-w-4xl flex items-center justify-between gap-3 pt-2 px-2 z-50"
      >
        {activeItem ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 overflow-hidden text-white cursor-default bg-black/60 px-3 py-1.5 rounded-full"
          >
            <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-red-600 text-white shrink-0">
              #{activeItem.code}
            </span>
            <span className="text-xs sm:text-sm font-bold truncate">
              {activeItem.title || `Acc #${activeItem.code}`}
            </span>
            {activeItem.price > 0 && (
              <span className="text-xs sm:text-sm font-black text-amber-400 shrink-0">
                {formatPrice(activeItem.price)}
              </span>
            )}
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          aria-label="Đóng ảnh"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Frame: Click vào vùng xung quanh ảnh sẽ đóng modal ngay lập tức */}
      <div
        className="relative flex-1 w-full flex items-center justify-center my-auto p-2 cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeImageUrl}
          alt={activeItem?.title || "Ảnh tài khoản phóng to"}
          onClick={(e) => e.stopPropagation()}
          className="max-h-[78vh] max-w-[95vw] w-auto h-auto object-contain rounded-xl shadow-2xl select-none cursor-default"
        />
      </div>

      {/* Bottom Bar: Nút Heart "Thêm vào yêu thích" & Nút "Trải nghiệm ngay" */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md pb-2 sm:pb-4 px-2 z-50 flex items-center justify-center gap-2.5 sm:gap-3 cursor-default"
      >
        {/* Nút Yêu thích nổi bật theo đúng yêu cầu */}
        <button
          type="button"
          onClick={handleToggleFavorite}
          className={`flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg border ${
            isFavorited
              ? "bg-red-500 hover:bg-red-600 text-white border-red-400/50"
              : "bg-white hover:bg-slate-100 text-slate-800 border-white/40"
          }`}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform active:scale-125 ${
              isFavorited ? "fill-white text-white" : "text-red-500"
            }`}
          />
          <span>{isFavorited ? "Đã lưu yêu thích" : "Thêm vào yêu thích"}</span>
        </button>

        {/* Nút Trải nghiệm ngay */}
        {activeItem && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
              router.push(`/contact?acc=${encodeURIComponent(activeItem.code || "")}`);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white bg-[#5B4EF6] hover:bg-[#4d32b5] transition-all cursor-pointer shadow-lg"
          >
            <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Trải nghiệm ngay</span>
          </button>
        )}
      </div>
    </div>
  );
}
