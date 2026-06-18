"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CATEGORY_INTROS } from "@/lib/catalog";

const CHAPTERS = [
  {
    category: "Organic Fertilizers",
    ordinal: "01",
    image: "/products/vermicompost/1.jpeg",
    alt: "Folia vermicompost on a wooden table among houseplants",
    count: "Five essentials",
  },
  {
    category: "Soil & Amendments",
    ordinal: "02",
    image: "/products/potting-mix/2.jpeg",
    alt: "A hand holding Folia potting mix against monstera leaves",
    count: "Two essentials",
  },
  {
    category: "Plant Boosters",
    ordinal: "03",
    image: "/products/flower-booster/1.jpeg",
    alt: "Folia flower booster surrounded by blooming flowers",
    count: "Two essentials",
  },
];

/**
 * The collection, told as three chapters — large photography,
 * quiet type, alternating compositions.
 */
export function CollectionChapters() {
  return (
    <section aria-label="The collection" className="bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-forest">The collection</p>
        </Reveal>
        <TextReveal
          as="h2"
          text={"Nine essentials.\nNothing you don't need."}
          className="font-display mt-6 max-w-3xl text-4xl font-light leading-[1.05] tracking-[-0.01em] text-ink sm:text-5xl lg:text-6xl"
        />

        <div className="mt-20 space-y-24 sm:mt-28 sm:space-y-32">
          {CHAPTERS.map((chapter, i) => {
            const intro = CATEGORY_INTROS[chapter.category];
            const reversed = i % 2 === 1;
            return (
              <div
                key={chapter.category}
                className={`flex flex-col gap-10 lg:items-center lg:gap-20 ${
                  reversed ? "lg:flex-row-reverse" : "lg:flex-row"
                }`}
              >
                {/* Photograph */}
                <Link
                  href={`/products?category=${encodeURIComponent(chapter.category)}`}
                  className="group block lg:w-[55%]"
                  aria-label={`Shop ${chapter.category}`}
                >
                  <div className="relative">
                    <ParallaxImage
                      src={chapter.image}
                      alt={chapter.alt}
                      speed={0.07}
                      sizes="(max-width: 1024px) 100vw, 55vw"
                      className="aspect-[4/5] w-full sm:aspect-[16/11]"
                      imgClassName="transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.03]"
                    />
                    <span className="font-display pointer-events-none absolute -top-7 left-0 text-[5.5rem] font-light leading-none text-ink/10 sm:-top-10 sm:text-[8rem]">
                      {chapter.ordinal}
                    </span>
                  </div>
                </Link>

                {/* Caption */}
                <div className={`lg:w-[45%] ${reversed ? "lg:pr-8" : "lg:pl-8"}`}>
                  <Reveal>
                    <p className="eyebrow text-ink/65">{chapter.count}</p>
                    <h3 className="font-display mt-5 text-3xl font-light leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]">
                      {chapter.category}
                    </h3>
                    <p className="prose-editorial mt-5 max-w-sm text-ink/65">
                      {intro?.line}
                    </p>
                    <Link
                      href={`/products?category=${encodeURIComponent(chapter.category)}`}
                      className="link-rule group mt-8 inline-flex text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink"
                    >
                      Shop {chapter.category.toLowerCase()}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
