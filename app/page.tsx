
import { ChevronRight, Star, Users, Zap, Flame, Trophy, WalletMinimal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import AccStore from '@/components/accStore';
import StatsSection from '@/components/StatsSection';
import Link from 'next/link';
import Timer from '@/components/timer';

import { addPrice, formatPrice, getDeposit } from '@/lib/utils';
import HeroBanner from '@/components/HeroBanner';
import FlashSale from '@/components/FlashSale';



export default async function Home() {
  // const supabase = await createClient();
  // const { data, error } = await supabase
  //   .from("accounts")
  //   .select(`
  //  id,
  //   code,
  //   rank,
  //   heroes_count,
  //   skins_count,
  //   price,
  //   fake_price,
  //   highlight,
  //   is_sale,
  //   images,
  //   created_at,
  //   category_id,
  //   categories (
  //     id,
  //     name
  //   )
  // `);

const data = [
  {
    id: "1",
    code: "ACC001",
    rank: "Cao Thủ",
    heroes_count: 85,
    skins_count: 42,
    price: 500000,
    fake_price: 900000,
    highlight: "Hot",
    is_sale: true,
    images: ["/acc.jpg"],
    created_at: new Date().toISOString(),
    category_id: "vip",
    categories: [
      {
        id: "vip",
        name: "Acc VIP",
      },
    ],
  },
  {
    id: "2",
    code: "ACC002",
    rank: "Kim Cương",
    heroes_count: 60,
    skins_count: 25,
    price: 300000,
    fake_price: 600000,
    highlight: "Best",
    is_sale: true,
    images: ["/acc.jpg"],
    created_at: new Date().toISOString(),
    category_id: "reg",
    categories: [
      {
        id: "reg",
        name: "Acc Reg",
      },
    ],
  },
  {
    id: "3",
    code: "ACC003",
    rank: "Tinh Anh",
    heroes_count: 40,
    skins_count: 15,
    price: 150000,
    fake_price: 300000,
    highlight: null,
    is_sale: true,
    images: ["/acc.jpg"],
    created_at: new Date().toISOString(),
    category_id: "white",
    categories: [
      {
        id: "white",
        name: "Trắng Thông Tin",
      },
    ],
  },
  {
    id: "4",
    code: "ACC004",
    rank: "Thách Đấu",
    heroes_count: 100,
    skins_count: 60,
    price: 1000000,
    fake_price: 1800000,
    highlight: "VIP",
    is_sale: true,
    images: ["/acc.jpg"],
    created_at: new Date().toISOString(),
    category_id: "vip",
    categories: [
      {
        id: "vip",
        name: "Acc VIP",
      },
    ],
  },
  {
    id: "5",
    code: "ACC005",
    rank: "Bạch Kim",
    heroes_count: 30,
    skins_count: 10,
    price: 100000,
    fake_price: 200000,
    highlight: null,
    is_sale: false, // cái này để test filter
    images: ["/acc.jpg"],
    created_at: new Date().toISOString(),
    category_id: "cheap",
    categories: [
      {
        id: "cheap",
        name: "Giá Rẻ",
      },
    ],
  },
];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">


      {/* Hero Banner Slider */}
     <HeroBanner />

      {/* Flash Sale Section */}
      <section className="md:py-12 py-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        <div className="container mx-auto md:px-4 px-[2px]">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-6 py-3 text-lg animate-pulse shadow-xl">
              <Zap className="w-5 h-5 mr-2 animate-bounce" /> FLASH SALE
            </Badge>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              Giá Sốc <span className="text-red-500">Chỉ Hôm Nay</span>
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">
              Giảm đến 50% các tài khoản VIP - Số lượng có hạn!
            </p>

            <Timer />
          </div>

           <FlashSale />
          
        </div>
      </section>

      <AccStore />
     





      <StatsSection />
      {/* Footer */}

    </div>
  );
}