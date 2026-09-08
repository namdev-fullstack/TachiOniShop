"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open?: boolean;
  onClose?: () => void;
}

export function useImageLightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (imageUrls: string[], index = 0) => {
    setImages(imageUrls);
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    images,
    currentIndex,
    openLightbox,
    closeLightbox,
    setCurrentIndex,
  };
}

export default function ImageLightbox({
  images,
  initialIndex = 0,
  open = false,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const slides = images.map((src) => ({
    src,
    alt: "Ảnh sản phẩm",
  }));

  return (
    <Lightbox
      open={open}
      close={onClose || (() => {})}
      slides={slides}
      index={currentIndex}
      on={{
        view: ({ index }) => setCurrentIndex(index),
      }}
      plugins={[Zoom]}
      zoom={{
        maxZoomPixelRatio: 2,
        scrollToZoom: true,
        zoomInMultiplier: 1.5,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
      animation={{
        fade: 350,
        swipe: 400,
      }}
      render={{
        buttonPrev: slides.length > 1 ? undefined : () => null,
        buttonNext: slides.length > 1 ? undefined : () => null,
      }}
    />
  );
}
