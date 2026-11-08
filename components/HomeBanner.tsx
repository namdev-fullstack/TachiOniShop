"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <section className="w-full pt-3 sm:pt-6 md:pt-8 pb-3 sm:pb-6 md:pb-8">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="group block relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.4/1] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xs bg-slate-900 transition-all duration-300 hover:shadow-md"
        >
          <Image
            src="/banner-gojo.jpg"
            alt="Banner Gojo Satoru - Shop Liên Quân"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        </Link>
      </div>
    </section>
  );
}
