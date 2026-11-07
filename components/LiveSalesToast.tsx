"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, X } from "lucide-react";

const mockSales = [
  { name: "Minh ***92", code: "ACC-FL01", rank: "Thách Đấu", time: "2 phút trước" },
  { name: "Tuấn ***14", code: "ACC-RAZ02", rank: "Cao Thủ 45★", time: "5 phút trước" },
  { name: "Hải ***88", code: "ACC-NAK03", rank: "Cao Thủ 20★", time: "8 phút trước" },
  { name: "Đức ***56", code: "ACC-TL04", rank: "Tinh Anh I", time: "12 phút trước" },
  { name: "Khánh ***37", code: "ACC-VIP101", rank: "Thách Đấu 52★", time: "15 phút trước" },
];

export default function LiveSalesToast() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Loop interval
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockSales.length);
        setIsVisible(true);
      }, 1500);
    }, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = mockSales[currentIndex];

  return (
    <div className="fixed bottom-5 left-5 z-40 pointer-events-auto">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            <div className="text-xs pr-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>{current.name}</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                  vừa chốt
                </span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Mã: <strong className="text-blue-600">{current.code}</strong> ({current.rank}) • {current.time}
              </div>
            </div>

            <button
              onClick={() => setIsDismissed(true)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
              aria-label="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
