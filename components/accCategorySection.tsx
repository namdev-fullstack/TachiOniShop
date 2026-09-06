// components/AccStore.tsx
"use client"
import Image from "next/image"
import { Layers, Crown, Flame, Star, Zap, Trophy, Users, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "./ui/button"


const accounts = [
    {
        id: 1,
        name: "Liên Quân Mobile",
        category: "Thách Đấu",
        originalPrice: 2599000,
        salePrice: 1299000,
        discount: 50,
        sold: 98,
        total: 267,
        savings: 1300000,
        image: "./acc.jpg"
    },
    {
        id: 2,
        name: "Liên Minh Huyền Thoại",
        category: "Cao Thủ",
        originalPrice: 1499000,
        salePrice: 899000,
        discount: 40,
        sold: 89,
        total: 189,
        savings: 600000,
        image: "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg"
    },
    {
        id: 3,
        name: "Valorant",
        category: "Bất Tử",
        originalPrice: 3499000,
        salePrice: 2199000,
        discount: 37,
        sold: 18,
        total: 67,
        savings: 1300000,
        image: "https://images.pexels.com/photos/8721318/pexels-photo-8721318.jpeg"
    },
    {
        id: 4,
        name: "PUBG Mobile",
        category: "Ace Chính Phục",
        originalPrice: 999000,
        salePrice: 599000,
        discount: 40,
        sold: 124,
        total: 156,
        savings: 400000,
        image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg"
    }
];
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
};
export default function AccCategorySection({ title, description }: { title: string, description: string }) {
    return (
        <section className="py-16 my-10 bg-gradient-to-b from-white via-blue-50 to-red-50 relative overflow-hidden">

        <div className="container mx-auto px-3 md:px-6 relative">
                {/* Heading */}
                <div className="text-center mb-12">
                <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
  Nick Liên Quân{" "}
  <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent animate-text-shine">
    {title}
  </span>
</h2>

                    <p className="text-gray-600 text-sm md:text-lg">
                    {description}
                    </p>
                </div>

                {/* Grid list */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {accounts.map((item) => (
                        <Card
                            key={item.id}
                            className="group hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500 border-0 bg-white rounded-xl"
                        >

                            <CardContent className="p-0">
                                <div className="relative overflow-hidden rounded-t-lg">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        width={400}
                                        height={200}
                                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 group-hover:-rotate-1 transition-transform duration-700"
                                    />
                                    {/* Giảm giá % */}
                                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-[10px] border-0 shadow-md">
                                        -{item.discount}%
                                    </Badge>


                                    {/* Sale hot */}
                                    <Badge className="absolute top-2 right-2 flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg px-3 py-1 rounded-md">
                                        <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
                                        <span className="font-bold text-xs">Hot</span>
                                    </Badge>

                                    {/* Tag dưới ảnh */}
<div className="absolute bottom-0 left-0">
  <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded-tr-lg shadow-md">
    Acc Trắng TT
   
  </div>
</div>
                                </div>

                                <div className="p-3 sm:p-4">
                                    {/* Title */}
                                    <h3 className="text-sm sm:text-base font-bold mb-1 line-clamp-1">{item.name}</h3>

                                    {/* Rank */}
                                    <div className="flex items-center space-x-1 mb-3">
                                        <Trophy className="w-3 h-3 text-yellow-500" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                                            Rank: {item.category}
                                        </span>
                                    </div>

                                    {/* Extra info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                        <div className="flex items-center space-x-2 bg-blue-50 px-1.5 py-1 rounded-md shadow-sm">
                                            <Users className="w-3 h-3 text-blue-500 font-bold" />
                                            <span className="text-[11px]  text-gray-700 font-bold">276 Tướng</span>
                                        </div>
                                        <div className="flex items-center space-x-1 bg-pink-50 px-1.5 py-1 rounded-md shadow-sm">
                                            <Star className="w-3 h-3 text-pink-500" />
                                            <span className="text-[11px]  text-gray-700 font-bold">326 Skin</span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="mb-3">
                                        <div className="flex items-center space-x-1 mb-1">
                                            <span className="md:text-lg text-xs font-bold text-red-500">
                                                {formatPrice(item.salePrice)}
                                            </span>
                                            <span className="text-[11px] sm:text-xs text-gray-400 line-through truncate max-w-[60px] inline-block">
                                                {formatPrice(item.originalPrice)}
                                            </span>

                                        </div>
                                        <p className="text-[11px] sm:text-xs text-green-600 font-medium">
                                            Tiết kiệm {formatPrice(item.savings)}
                                        </p>
                                    </div>

                                    {/* Bottom row */}
                                    <div className="md:flex items-center justify-between hidden">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 hover:shadow-lg hover:scale-105 text-white text-[11px] px-2.5 py-1.5 h-auto transition-all duration-300">
                                            Mua
                                            <ChevronRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>

                        </Card>
                    ))}
                </div>
            </div>

            <div className="text-center mt-10">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-400 hover:to-blue-400 hover:shadow-2xl hover:scale-110 text-white shadow-lg transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              Xem tất cả tài khoản
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </section>



    )
}
