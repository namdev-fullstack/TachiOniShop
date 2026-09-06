"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ShieldCheck, Star, Tag, Users, WalletMinimal } from "lucide-react";
import { addPrice, formatPrice, getDeposit } from "@/lib/utils";
import Payment from "./payment";

export default function DetailPage({ data }: { data: any }) {
  const [selected, setSelected] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      {/* Ảnh chính */}
      <div className="flex flex-col gap-4">
        <motion.div
          key={selected}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl overflow-hidden shadow-lg border-[2px] border-gray-200"
        >
          <Image
            src={data.images?.[selected] || "/acc.jpg"}
            alt={`Ảnh ${data.code}`}
            width={600}
            height={400}
            quality={100}
            onClick={() => setIsOpen(true)}
            className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </motion.div>

        {/* Thumbnails */}
        <div className="flex gap-3">
          {data.images?.map((img: string, i: number) => (
            <div
              key={i}
              onClick={() => setSelected(i)}
              className={`rounded-xl overflow-hidden cursor-pointer border-2 transition 
                ${selected === i ? "border-pink-500" : "border-transparent"}`}
            >
              <Image
                src={img}
                alt={`Ảnh ${i}`}
                width={100}
                height={80}
                className="object-cover w-24 h-20 hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal phóng to ảnh */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={data.images?.[selected] || "/acc.jpg"}
                alt="Ảnh phóng to"
                width={1200}
                height={800}
                className="w-full h-auto rounded-xl object-contain"
              />
              <button
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thông tin acc */}
      <div className="flex flex-col gap-3">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold">
          {data.categories?.name}
        </h1>
        <p>
          Mã: <span className="font-semibold">#{data.code}</span>
        </p>
        <p className="text-gray-500 flex items-center gap-2">
          Rank: <span className="font-semibold">{data.rank}</span>{" "}
          {data.highlight && (
            <span className="text-pink-500">| {data.highlight}</span>
          )}
        </p>

        {/* Highlight + Sale */}
        <div className="flex items-center gap-4">
          {data.highlight && (
            <span className="flex items-center gap-1 text-red-500 font-semibold ">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              {data.highlight}
            </span>
          )}
          {data.is_sale && data.fake_price && (

            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="md:text-lg text-base font-bold text-blue-500">
                ATM/MOMO/CARD(Thẻ Cào)
              </span>

              <div
                className="flex items-center gap-1 text-white font-semibold text-xs sm:text-sm
              bg-gradient-to-r from-red-500 to-pink-500
              px-2 py-1 rounded-md shadow-md border border-red-600"
              >
                <Tag className="w-4 h-4 text-white" />
                -
                {Math.round(
                  ((Number(data.fake_price) - Number(data.price)) /
                    Number(data.fake_price)) *
                  100
                )}
                %
              </div>
            </div>
          )}
        </div>

        {/* Giá */}
        <div className="mb-3">

          <div className="flex items-center gap-x-4 mb-1 flex-wrap">

            <span className="md:text-lg text-lg font-bold text-red-500">
              {formatPrice(Number(data.price) + addPrice(Number(data.price)))}

            </span>

            {data.fake_price && (
              <span
                className="md:text-lg text-lg text-gray-400 
                line-through inline-block 
                max-w-[60px] sm:max-w-[100px] md:max-w-none"
              >
                {formatPrice(
      Number(data.fake_price) + (addPrice(Number(data.price)) - Number(data.price))
    )}
              </span>
            )}
            {data.fake_price && (
              <p className="text-[11px] sm:text-xs text-green-600 font-medium">
                Tiết kiệm{" "}
                {formatPrice(
                  Number(data.fake_price) - (Number(data.price) + addPrice(Number(data.price)))
                )}
              </p>
            )}
          </div>
          {getDeposit(Number(data.price)) > 0 && (

            <div className="flex items-center gap-2 text-red-600 font-semibold text-base md:text-lg bg-red-50 px-3 py-1 rounded-lg shadow-sm w-fit">
              <WalletMinimal className="w-4 h-4 animate-heartbeat text-red-500" />
              <span>Cọc: {formatPrice(getDeposit(Number(data.price)))}</span>
            </div>


          )}

        </div>

        {/* Extra info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div className="flex items-center space-x-2 bg-blue-50 px-1.5 py-1 rounded-md shadow-sm">
            <Users className="w-3 h-3 text-blue-500 font-bold" />
            <span className="text-base md:text-lg text-gray-700 font-bold">
              {!data.heroes_count ? "Tướng: Xem chi tiết trong ảnh" : data.heroes_count + " Tướng"}
            </span>
          </div>
          <div className="flex items-center space-x-1 bg-pink-50 px-1.5 py-1 rounded-md shadow-sm">
            <Star className="w-3 h-3 text-pink-500" />
            <span className="text-base md:text-lg text-gray-700 font-bold">
              {!data.skins_count ? "Skin: Xem chi tiết trong ảnh" : data.skins_count + " Skin"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 rounded-lg  text-indigo-500">
          <ShieldCheck className="w-5 h-5 animate-pulse" />
          <span className="font-medium">
            Giao Dịch Tự Động - Nhanh Chóng
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Payment data={data} />

        </div>
      </div>
    </div>
  );
}
