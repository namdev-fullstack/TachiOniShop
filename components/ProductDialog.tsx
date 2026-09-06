"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { addPrice, formatPrice, getDeposit } from "@/lib/utils";
import Link from "next/link";

export default function ProductDialog({
  selectedProduct,
  setSelectedProduct,
}: {
  selectedProduct: any;
  setSelectedProduct: (product: any) => void;
}) {
  const [showHint, setShowHint] = useState(true);

  // 👉 reset hint khi mở lại dialog
  useEffect(() => {
    if (selectedProduct) {
      setShowHint(true);
    }
  }, [selectedProduct]);

  // 👉 bắt scroll trong modal
  const handleScroll = (e: any) => {
    if (e.target.scrollTop > 20) {
      setShowHint(false);
    }
  };

  return (
    <Dialog
      open={!!selectedProduct}
      onOpenChange={() => setSelectedProduct(null)}
    >
      <DialogContent
        onScroll={handleScroll}
        className="max-w-5xl w-[80%] p-0 max-h-[90vh] overflow-y-auto"
      >
        {selectedProduct && (
          <div>
            {/* IMAGE */}
            <div className="relative bg-black">
              <Image
                src={selectedProduct.images?.[0] || "/acc.jpg"}
                alt={selectedProduct.code}
                width={1200}
                height={1600}
                quality={100}
                priority
                className="w-full h-auto object-contain"
              />

              {/* SCROLL HINT */}
              {showHint && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 animate-bounce">
                  <div className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs text-gray-700 shadow">
                    ↓ Kéo xuống
                  </div>
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="p-4 space-y-3">
              {/* TOP */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-bold">
                  Mã: {selectedProduct.code}
                </h2>

                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  {selectedProduct.rank}
                </span>
              </div>

              {/* INFO LINE */}
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg">
                  Tướng: {selectedProduct.heroes_count || "Trong ảnh"}
                </span>

                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-lg">
                  Skin: {selectedProduct.skins_count || "Trong ảnh"}
                </span>

                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg">
                  {selectedProduct.is_sale ? "🔥 Đang sale" : "Còn acc"}
                </span>

                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg">
                  Cọc:{" "}
                  {formatPrice(
                    getDeposit(Number(selectedProduct.price))
                  )}
                </span>
              </div>

              {/* PRICE + CTA */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xl font-bold text-red-500">
                  {formatPrice(
                    Number(selectedProduct.price) +
                      addPrice(Number(selectedProduct.price))
                  )}
                </p>

                <Link
                  href="/contact"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}