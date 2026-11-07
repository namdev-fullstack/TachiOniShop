"use client";

import { useState } from "react";
import FlashSale from "@/components/FlashSale";
import HomeCategories from "@/components/HomeCategories";
import HomeProductList from "@/components/HomeProductList";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-red-100 selection:text-red-900 overflow-x-hidden">
      
      {/* 1. Flash Sale chuẩn phong cách shopacclq.shop - Giờ vàng giá sốc + Countdown */}
      <FlashSale />

      {/* 2. Thể loại rút gọn: Acc Reg Trắng TT, Acc LQ <1M, 1M-3M, 3M+ */}
      <HomeCategories
        selectedCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      {/* 3. Danh sách tài khoản: Item tối giản, click ảnh xem full chiều cao, nút Thuê ngay -> /contact */}
      <HomeProductList
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

    </main>
  );
}
