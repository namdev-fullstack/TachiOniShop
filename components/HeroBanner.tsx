"use client"

import Image from "next/image"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <section className="relative h-[600px] md:h-[650px] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/banner.jpeg" // 👉 ảnh nền bạn thay bằng ảnh thật (ví dụ trong /public)
          alt="Liên Quân Background"
          fill
          
          quality={100}
          className="object-cover object-center"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black/30 to-indigo-900/40" />

      </div>

      {/* Floating gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-32 w-40 h-40 bg-gradient-to-r from-blue-300 to-indigo-400 rounded-full opacity-20 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-52 h-52 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-20 blur-2xl animate-bounce-slow"></div>
      </div>

      {/* Floating small images */}
      <Image
        src="/vongQuay.png"
        alt="Vòng quay"
        width={100}
        height={100}
        className="absolute md:top-24 md:left-16 top-6 left-2 animate-float-slow drop-shadow-2xl"
      />

      <Image
        src="/lineRight.png"
        alt="Decor line"
        width={100}
        height={100}
        className="absolute bottom-28 right-24 animate-bounce-slow drop-shadow-xl"
      />

      <Image
        src="/quanHuy.png"
        alt="Quân huy"
        width={70}
        height={70}
        className="absolute top-1/2 left-1/4 animate-float drop-shadow-xl"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center text-center">
        {/* Logo */}
     

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight [text-shadow:_0_0_10px_rgb(37_99_235_/_0.8),_0_0_20px_rgb(59_130_246_/_0.6)]">
  Shop Bán Acc <span className="text-blue-400">Liên Quân Mobile</span> Uy Tín
</h1>


        {/* Description */}
        <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
  Mua bán tài khoản Liên Quân giá rẻ – Nhiều skin hiếm, full tướng, nạp uy tín và giao dịch an toàn 100%.
</p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-5">
          <Link
            href="/products"
            className="px-6 py-3 sm:px-8 sm:py-3 rounded-xl 
              bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white font-semibold shadow-lg 
              hover:shadow-blue-500/50 hover:scale-105 transition text-sm sm:text-base"
          >
            Danh Sách Acc
          </Link>

          <Link
            href="/contact"
           
            className="px-6 py-3 sm:px-8 sm:py-3 rounded-xl 
              border border-blue-400 text-blue-200 font-semibold 
              hover:bg-blue-600/20 hover:border-blue-300 transition text-sm sm:text-base flex items-center justify-center gap-2"
          >
            Liên Hệ
          </Link>
        </div>
      </div>
    </section>
  )
}
