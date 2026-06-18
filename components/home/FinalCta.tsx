"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/** The closing frame: one line, one door. */
export function FinalCta() {
  return (
    <section aria-label="Shop the collection" className="bg-parchment py-28 sm:py-36">
      <div className="mx-auto max-w-[1480px] px-5 text-center sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-forest">Begin</p>
        </Reveal>
        <TextReveal
          as="h2"
          text={"Your garden is waiting."}
          className="font-display mt-7 text-5xl font-light leading-[1.02] tracking-[-0.015em] text-ink sm:text-7xl"
        />
        <Reveal delay={0.25}>
          <Link href="/products" className="btn-clay mt-12">
            Shop the collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
