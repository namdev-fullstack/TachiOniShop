"use client";

import Image from "next/image";

export default function HomeBanner() {
  return (
    <section className="w-full pt-1 sm:pt-2 pb-2 sm:pb-3">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="banner-3d group relative w-full aspect-[2.4/1] sm:aspect-[2.7/1] md:aspect-[3/1] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md">
          <Image
            src="/banner.jpg"
            alt="Banner TachiOni"
            width={1920}
            height={800}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="banner-img-responsive object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
}
