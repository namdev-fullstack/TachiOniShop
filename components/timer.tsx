'use client'

import { useEffect, useState } from "react";

export default function Timer() {
    
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 36,
        seconds: 3
      });
    
    
    
      // Countdown timer
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft(prev => {
            if (prev.seconds > 0) {
              return { ...prev, seconds: prev.seconds - 1 };
            } else if (prev.minutes > 0) {
              return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
            } else if (prev.hours > 0) {
              return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
            }
            return prev;
          });
        }, 1000);
        return () => clearInterval(timer);
      }, []);
    return (
        <div className="flex items-center justify-center space-x-2 mb-8">
              <span className="text-gray-600">Kết thúc sau:</span>
              <div className="flex space-x-1">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white 
                  px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 
                  rounded-lg font-bold 
                  text-sm sm:text-base lg:text-xl 
                  shadow-lg animate-pulse">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>

                <span className="text-red-500 font-bold 
                   text-lg sm:text-xl lg:text-2xl 
                   animate-pulse">:</span>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white 
                  px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 
                  rounded-lg font-bold 
                  text-sm sm:text-base lg:text-xl 
                  shadow-lg animate-pulse">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>

                <span className="text-red-500 font-bold 
                   text-lg sm:text-xl lg:text-2xl 
                   animate-pulse">:</span>

                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white 
                  px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-3 
                  rounded-lg font-bold 
                  text-sm sm:text-base lg:text-xl 
                  shadow-lg animate-pulse">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>

            </div>
    )
}