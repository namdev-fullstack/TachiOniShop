"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 35,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="inline-flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-red-200/80 shadow-lg shadow-red-500/5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider pr-2 border-r border-slate-200">
        <Clock className="w-4 h-4 text-red-500 animate-spin-slow" />
        <span>Kết thúc sau</span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 text-white font-mono font-black text-base sm:text-lg flex items-center justify-center shadow-md border border-slate-700">
            {String(timeLeft.hours).padStart(2, "0")}
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Giờ</span>
        </div>

        <span className="text-red-500 font-black text-lg -mt-3.5 animate-pulse">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 text-white font-mono font-black text-base sm:text-lg flex items-center justify-center shadow-md border border-slate-700">
            {String(timeLeft.minutes).padStart(2, "0")}
          </div>
          <span className="text-[9px] uppercase font-bold text-slate-400 mt-1">Phút</span>
        </div>

        <span className="text-red-500 font-black text-lg -mt-3.5 animate-pulse">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-red-600 to-red-700 text-white font-mono font-black text-base sm:text-lg flex items-center justify-center shadow-md shadow-red-500/20 border border-red-500">
            {String(timeLeft.seconds).padStart(2, "0")}
          </div>
          <span className="text-[9px] uppercase font-bold text-red-500 mt-1">Giây</span>
        </div>
      </div>
    </div>
  );
}
