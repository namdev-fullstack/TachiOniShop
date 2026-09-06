"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ChevronRight,
  ChevronLeft,
  Star,
  Users,
  Trophy,
  WalletMinimal,
} from "lucide-react";

import { addPrice, formatPrice, getDeposit } from "@/lib/utils";
import ProductDialog from "./ProductDialog";

type Account = {
  id: string;
  code: string;
  rank: string;
  heroes_count: number;
  skins_count: number;
  price: number;
  fake_price: number;
  highlight: string;
  is_sale: boolean;
  is_active: boolean;
  images: string[];
  category: { id: string; name: string };
};

export default function FlashSale() {
  const [data, setData] = useState<Account[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Account | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "accounts"));

      const list = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          code: d.code,
          rank: d.rank,
          heroes_count: d.heroes_count || 0,
          skins_count: d.skins_count || 0,
          price: d.price || 0,
          fake_price: d.fake_price || 0,
          highlight: d.highlight || "",
          is_sale: d.is_sale || false,
          is_active: d.is_active ?? true,
          images: d.images || [],
          category: d.category || null,
        };
      });

      setData(list);
    };

    fetchData();
  }, []);

  const filtered = data.filter((acc) => acc.is_sale && acc.is_active);

  return (
    <div className="relative">
      {/* Nút trái */}
     {/* Nút trái */}
<button
  className="
    flash-prev 
    absolute left-2 md:-left-6 
    top-1/2 -translate-y-1/2 z-10 
    bg-white/90 backdrop-blur shadow-md 
    p-2 md:p-3 rounded-full 
    hover:scale-110 active:scale-95 transition
  "
>
  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
</button>

{/* Nút phải */}
<button
  className="
    flash-next 
    absolute right-2 md:-right-6 
    top-1/2 -translate-y-1/2 z-10 
    bg-white/90 backdrop-blur shadow-md 
    p-2 md:p-3 rounded-full 
    hover:scale-110 active:scale-95 transition
  "
>
  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
</button>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          prevEl: ".flash-prev",
          nextEl: ".flash-next",
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={filtered.length > 4}
        spaceBetween={12}
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="px-6"
      >
        {filtered.map((acc) => (
          <SwiperSlide key={acc.id}>
            <Card
              onClick={() => setSelectedProduct(acc)}
              className="group cursor-pointer hover:shadow-xl hover:shadow-red-500/20 hover:scale-[1.02] transition-all duration-500 border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-red-50"
            >
              <CardContent className="p-0">
                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-t-lg">
                 <Image
                                     src={acc.images?.[0] || "/acc.jpg"}
                                     alt={acc.code}
                                     width={400}
                                     height={400}
                                     quality={100}
                                     className="w-full h-32 sm:h-56 object-cover object-top 
                   group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-700"
                                   />

                  <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] border-0 animate-pulse shadow-md">
                    Sale
                  </Badge>

                  <div className="absolute bottom-0 left-0">
                    <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-[10px] px-2 py-0.5 rounded-tr-lg shadow-md">
                      {acc.category?.name}
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold mb-1 line-clamp-1">
                    Mã:{acc.code}
                  </h3>

                  <div className="flex items-center space-x-1 mb-3">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                      Rank: {acc.rank}
                    </span>
                  </div>

                  
                  <div className="mb-3">
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="md:text-lg text-xs font-bold text-red-500">
                        {formatPrice(
                          Number(acc.price) +
                            addPrice(Number(acc.price))
                        )}
                      </span>
                      <span className="md:text-lg text-xs line-through text-gray-400">
                        {formatPrice(
                          Number(acc.fake_price)
                        )}
                      </span>
                    </div>

                    <p className="text-[11px] text-green-600 font-medium">
                      Tiết kiệm{" "}
                      {formatPrice(
                        Number(acc.fake_price) -
                          (Number(acc.price) +
                            addPrice(Number(acc.price)))
                      )}
                    </p>

                    <div className="flex items-center gap-2 text-red-600 font-semibold text-xs bg-red-50 px-2 py-1 rounded-md w-fit mt-2">
                      <WalletMinimal className="w-3 h-3" />
                      Cọc:{" "}
                      {formatPrice(getDeposit(Number(acc.price)))}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-between">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] px-2 py-1">
                      Mua <ChevronRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* DIALOG GIỮ NGUYÊN */}
            <ProductDialog selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      
    </div>
  );
}