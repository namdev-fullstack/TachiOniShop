"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ImagePreviewModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export default function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (imageUrl) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [imageUrl, onClose]);

  if (!imageUrl) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
    >
      {/* Nút Đóng */}
      <button
        type="button"
        aria-label="Đóng ảnh"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-3 right-3 sm:top-5 sm:right-5 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Wrapper Ảnh - max-h 88vh, max-w 95vw, object-contain, không co giãn */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex items-center justify-center max-w-[95vw] max-h-[88vh]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Ảnh tài khoản phóng to"
          className="max-h-[88vh] max-w-[95vw] w-auto h-auto object-contain rounded-lg shadow-2xl select-none"
        />
      </div>
    </div>
  );
}
