"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <section className="w-full pt-3 sm:pt-6 md:pt-8 pb-3 sm:pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="banner-3d group block relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.4/1] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900"
        >
          <Image
            src="/banner.jpg"
            alt="Banner Gojo Satoru - Shop Liên Quân"
            width={1920}
            height={800}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            style={{
              position: "absolute",
              height: "126%",
              width: "100%",
              inset: "0px",
            }}
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        </Link>
      </div>
    </section>
  );
}
