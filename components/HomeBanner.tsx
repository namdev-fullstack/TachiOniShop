"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomeBanner() {
  return (
    <section className="w-full pt-1 sm:pt-2 pb-2 sm:pb-3">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="banner-3d group block relative w-full aspect-[2.4/1] sm:aspect-[2.7/1] md:aspect-[3/1] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-xl transition-all"
        >
          <Image
            src="/banner.jpg"
            alt="Banner TachiOni"
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
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>
      </div>
    </section>
  );
}
