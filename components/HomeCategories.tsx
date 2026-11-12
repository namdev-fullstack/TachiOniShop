"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type CategoryItem = {
  id: "white" | "lq_under1m" | "lq_1m_3m" | "lq_over3m";
  name: string;
  soldCount: number;
  image: string;
};

export const HOME_CATEGORIES: CategoryItem[] = [
  {
    id: "white",
    name: "Acc Reg Trắng TT",
    soldCount: 1240,
    image: "/poster-reg.jpg",
  },
  {
    id: "lq_under1m",
    name: "Acc LQ Dưới 1M",
    soldCount: 876,
    image: "/poster-1m.jpg",
  },
  {
    id: "lq_1m_3m",
    name: "Acc LQ 1M – 3M",
    soldCount: 432,
    image: "/poster-1m-3m.jpg",
  },
  {
    id: "lq_over3m",
    name: "Acc LQ Từ 3M+",
    soldCount: 198,
    image: "/poster-3m.jpg",
  },
];

interface HomeCategoriesProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export default function HomeCategories({
  selectedCategory,
  onSelectCategory,
}: HomeCategoriesProps) {
  return (
    <section className="w-full py-4 sm:py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-slate-200/80 mb-4 sm:mb-6">
          <div className="border-l-4 border-red-600 pl-2.5 sm:pl-3">
            <h2 className="text-3d-heading text-base sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Phân Loại Thể Loại Acc
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-600 transition-colors group shrink-0"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Categories Grid: Chuyển trang trực tiếp sang /products, không scroll neo xuống dưới */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 md:gap-4">
          {HOME_CATEGORIES.map((cat) => {
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="card-3d group rounded-xl sm:rounded-2xl text-left cursor-pointer flex flex-col focus:outline-none overflow-hidden"
              >
                {/* Thumbnail 3D */}
                <div className="img-frame-3d relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-slate-100 shine-glow">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-2 sm:p-3 flex flex-col justify-center flex-grow">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 drop-shadow-xs">
                    {cat.name}
                  </h3>
                  {/* Đã bán */}
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">Đã bán:</span>
                    <span className="badge-3d text-[10px] sm:text-[11px] bg-red-50 text-red-600 font-extrabold px-1.5 py-0.2 rounded border border-red-200">
                      {cat.soldCount.toLocaleString("vi-VN")}+
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
