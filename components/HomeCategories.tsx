"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

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
    image: "/bannerReg.jpeg",
  },
  {
    id: "lq_under1m",
    name: "Acc LQ Dưới 1M",
    soldCount: 876,
    image: "/banner.jpeg",
  },
  {
    id: "lq_1m_3m",
    name: "Acc LQ 1M – 3M",
    soldCount: 432,
    image: "/bannerVip.jpeg",
  },
  {
    id: "lq_over3m",
    name: "Acc LQ Từ 3M+",
    soldCount: 198,
    image: "/bannerVip.jpeg",
  },
];

interface HomeCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export default function HomeCategories({
  selectedCategory,
  onSelectCategory,
}: HomeCategoriesProps) {
  const router = useRouter();

  const handleCategoryClick = (id: string) => {
    onSelectCategory(id);
    router.push(`/products?category=${id}`);
  };

  return (
    <section className="w-full py-4 sm:py-7">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Phân Loại Thể Loại Acc
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
              Chọn nhanh theo mức giá – hàng ngàn tài khoản chờ bạn
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group shrink-0"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 4 Categories Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {HOME_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                }}
                whileHover={{ y: -4, boxShadow: "0 10px 28px 0 rgba(0,0,0,0.09)" }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={`group rounded-xl sm:rounded-2xl border text-left cursor-pointer bg-white flex flex-col focus:outline-none transition-colors duration-200 ${
                  isSelected
                    ? "border-blue-600 ring-2 ring-blue-500/20 shadow-md"
                    : "border-slate-200/90 hover:border-blue-300"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] sm:aspect-[16/9] w-full overflow-hidden rounded-t-xl sm:rounded-t-2xl bg-slate-100 shine-glow">
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
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  {/* Đã bán */}
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-medium">
                    Đã bán:{" "}
                    <span className="text-red-500 font-bold">
                      {cat.soldCount.toLocaleString("vi-VN")}+
                    </span>
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
