"use client"
import { Users, Wallet, ShoppingBag, Star, Music, BadgeCent } from "lucide-react"

const stats = [
  {
    id: 1,
    label: "Acc Đã Bán",
    value: "12.500+",
    icon: ShoppingBag,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    label: "Doanh Thu",
    value: "2.3 Tỷ+",
    icon: Wallet,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    label: "Cộng Tác Viên",
    value: "50+",
    icon: Users,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 4,
    label: "Đánh Giá 5★",
    value: "9.8/10",
    icon: Star,
    color: "from-yellow-400 to-orange-500",
  }
  
]

export default function StatsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-white via-slate-50 to-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-3">
            Vì Sao Chọn <span className="text-blue-600">Shop Chúng Tôi?</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-lg">
            Những con số & thương hiệu uy tín khẳng định chất lượng dịch vụ
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 flex flex-col items-center text-center group"
              >
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
