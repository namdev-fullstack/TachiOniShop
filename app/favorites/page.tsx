"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Trash2, Sparkles, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AccountCard, { AccountCardData } from "@/components/AccountCard";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import ConsultationSection from "@/components/ConsultationSection";
import { getFavorites, FavoriteItem } from "@/lib/favorites";
import { formatPrice } from "@/lib/utils";

type ConfirmModalState = {
  isOpen: boolean;
  type: "single" | "all";
  item?: FavoriteItem | null;
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [previewTarget, setPreviewTarget] = useState<{
    imageUrl: string;
    item?: AccountCardData | null;
  } | null>(null);

  const [confirmState, setConfirmState] = useState<ConfirmModalState>({
    isOpen: false,
    type: "all",
    item: null,
  });

  const loadFavorites = () => {
    setFavorites(getFavorites());
  };

  useEffect(() => {
    loadFavorites();
    const handleUpdate = () => loadFavorites();
    window.addEventListener("favorites-updated", handleUpdate);
    return () => window.removeEventListener("favorites-updated", handleUpdate);
  }, []);

  const handleConfirmDelete = () => {
    if (confirmState.type === "all") {
      localStorage.removeItem("tachioni_favorites");
      setFavorites([]);
      window.dispatchEvent(
        new CustomEvent("favorites-updated", {
          detail: { item: null, isAdded: false, count: 0 },
        })
      );
    } else if (confirmState.item) {
      const targetId = confirmState.item.id || confirmState.item.code;
      const updated = favorites.filter((f) => (f.id || f.code) !== targetId);
      localStorage.setItem("tachioni_favorites", JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(
        new CustomEvent("favorites-updated", {
          detail: { item: confirmState.item, isAdded: false, count: updated.length },
        })
      );
    }
    setConfirmState({ isOpen: false, type: "all", item: null });
  };

  return (
    <main className="min-h-screen bg-[#F8F8FC] text-slate-900 pb-24 md:pb-16">
      {/* Top Breadcrumb & Title */}
      <section className="w-full pt-4 pb-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-[#5B4EF6] transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800">Yêu thích</span>
          </div>

          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                </div>
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tài Khoản Yêu Thích
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {favorites.length > 0
                  ? `Bạn đang lưu ${favorites.length} tài khoản trong danh sách yêu thích`
                  : "Chưa có tài khoản nào được lưu"}
              </p>
            </div>

            {favorites.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setConfirmState({
                    isOpen: true,
                    type: "all",
                    item: null,
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50/70 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Danh sách acc yêu thích */}
      <section className="w-full py-2">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
              {favorites.map((item) => (
                <AccountCard
                  key={item.id || item.code}
                  item={{
                    id: item.id,
                    code: item.code,
                    title: item.title,
                    price: item.price,
                    fake_price: item.fake_price,
                    images: item.images,
                    is_white: item.is_white,
                  }}
                  onPreviewImage={(url, it) =>
                    setPreviewTarget({ imageUrl: url, item: it })
                  }
                  onRemoveFavorite={(it) =>
                    setConfirmState({
                      isOpen: true,
                      type: "single",
                      item: {
                        id: it.id,
                        code: it.code,
                        title: it.title || `Acc #${it.code}`,
                        price: it.price,
                        fake_price: it.fake_price,
                        images: it.images,
                        is_white: it.is_white,
                      },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-12 px-4 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs max-w-lg mx-auto my-6">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#5B4EF6] flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#5B4EF6]" />
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Chưa có tài khoản yêu thích nào
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Hãy bấm vào biểu tượng trái tim trên các tài khoản bạn thích để lưu lại và xem lại bất cứ lúc nào!
              </p>

              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#5B4EF6] hover:bg-[#4d32b5] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Khám phá tài khoản ngay</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Khung tư vấn thêm & Action bar chuẩn thiết kế Figma */}
      <ConsultationSection className="mt-4" />

      {/* Modal xem ảnh */}
      <ImagePreviewModal
        data={previewTarget}
        onClose={() => setPreviewTarget(null)}
      />

      {/* Modal xác nhận xóa sang trọng & trực quan */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() =>
                setConfirmState({ isOpen: false, type: "all", item: null })
              }
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl text-center border border-slate-100 z-10 overflow-hidden"
            >
              {/* Nút X góc modal */}
              <button
                type="button"
                onClick={() =>
                  setConfirmState({ isOpen: false, type: "all", item: null })
                }
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon rác cảnh báo với vòng tỏa màu hồng */}
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4 ring-8 ring-rose-50/60">
                <Trash2 className="w-7 h-7 stroke-[2.2]" />
              </div>

              {/* Tiêu đề & mô tả */}
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {confirmState.type === "all"
                  ? "Xóa toàn bộ yêu thích?"
                  : `Bỏ lưu tài khoản #${confirmState.item?.code}?`}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                {confirmState.type === "all"
                  ? `Bạn có chắc muốn xóa toàn bộ ${favorites.length} tài khoản khỏi danh sách yêu thích? Thao tác này không thể hoàn tác.`
                  : "Tài khoản này sẽ được gỡ khỏi danh sách yêu thích trên thiết bị của bạn."}
              </p>

              {/* Xem trước acc nếu xóa 1 acc */}
              {confirmState.type === "single" && confirmState.item && (
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3 text-left">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                    <Image
                      src={
                        confirmState.item.images?.[0] || "/acc.jpg"
                      }
                      alt={confirmState.item.title || "Acc"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-bold text-rose-600">
                      #{confirmState.item.code}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 truncate">
                      {confirmState.item.title}
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-0.5">
                      {formatPrice(Number(confirmState.item.price) || 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Hàng nút bấm */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  type="button"
                  onClick={() =>
                    setConfirmState({ isOpen: false, type: "all", item: null })
                  }
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
