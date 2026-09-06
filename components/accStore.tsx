// components/AccStore.tsx
"use client"
import Image from "next/image"
import { Layers, Crown, Flame, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const accounts = [
  {
    id: 1,
    title: "Nick Liên Quân Đang Giảm Giá",
    img: "./bannerSale.jpeg",
    count: 4387,
    tag: { text: "Sale", icon: Layers, color: "from-blue-500 to-cyan-500" },
  },
  {
    id: 2,
    title: "Nick Liên Quân Trắng Thông Tin",
    img: "./bannerReg.jpeg",
    count: 8534,
    tag: { text: "Trắng TT", icon: Star, color: "from-purple-500 to-pink-500" },
  },
  {
    id: 3,
    title: "Nick Tự Chọn",
    img: "./bannerTuChon.jpeg",
    count: 16966,
    tag: { text: "Tự chọn", icon: Crown, color: "from-yellow-500 to-orange-500" },
  },
  {
    id: 4,
    title: "Acc Liên Quân VIP",
    img: "./bannerVip.jpeg",
    count: 1390,
    tag: { text: "VIP", icon: Flame, color: "from-red-500 to-pink-500" },
  },
]

export default function AccStore() {
  return (
    <section className="py-6 md:py-8 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      <div className="container mx-auto px-3 md:px-6 relative">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
            Thể Loại <span className="text-blue-600">Acc Liên Quân</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
          Đa dạng thể loại acc Liên Quân – trắng thông tin, giá rẻ, uy tín – đáp ứng mọi nhu cầu game thủ.

          </p>
        </div>

        {/* Grid list */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {accounts.map((acc) => (
            <Link href='/products'>
            <Card
              key={acc.id}
              className="group hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-500 border-0 bg-white rounded-xl"
            >
              <CardContent className="p-0">
                {/* Ảnh + badge */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <Image
                    src={acc.img}
                    alt={acc.title}
                    width={400}
                    height={200}
                    className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Tag loại acc */}
                  <Badge
                    className={`absolute top-2 left-2 flex items-center gap-1 bg-gradient-to-r ${acc.tag.color} text-white text-[11px] font-bold border-0 px-2 py-1 rounded-md shadow-md`}
                  >
                    <acc.tag.icon className="w-3 h-3" />
                    {acc.tag.text}
                  </Badge>
                </div>

                {/* Nội dung */}
                <div className="p-3 sm:p-4 text-center">
                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold mb-2 line-clamp-2 min-h-[40px]">
  {acc.title}
</h3>


                  {/* Số lượng nick */}
                  <div className="inline-flex items-center gap-1 
  bg-gradient-to-r from-blue-500 to-indigo-500 
  text-white 
  px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
  rounded-full 
  text-xs sm:text-sm md:text-base 
  font-semibold 
  shadow-md"
>
  <Layers className="w-3 h-3 sm:w-4 sm:h-4" />
  {acc.count.toLocaleString("vi-VN")} Nick
</div>

                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>



  )
}
