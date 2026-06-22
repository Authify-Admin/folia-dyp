"use client";

import Link from "next/link";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/**
 * The dark interlude — the brand speaks once, briefly,
 * over a photograph of hands in soil.
 */
export function StoryTeaser() {
  return (
    <section
      aria-label="Our story"
      className="grain-overlay relative overflow-hidden bg-forest-night"
    >
      {/* Backdrop photograph, deepened */}
      <div className="absolute inset-0">
        <ParallaxImage
          src="/products/organic-cow-manure/1.jpeg"
          alt=""
          speed={0.12}
          sizes="100vw"
          className="h-full w-full opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-night via-forest-night/40 to-forest-night" />
      </div>

      <div className="relative mx-auto flex min-h-[88svh] max-w-[1480px] flex-col items-center justify-center px-5 py-28 text-center sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-sage">Why Folia</p>
        </Reveal>

        <TextReveal
          as="h2"
          text={"Decades in the soil.\nOne promise: it works."}
          className="font-display mt-8 max-w-4xl text-4xl font-light leading-[1.08] tracking-[-0.01em] text-cream sm:text-6xl lg:text-7xl"
          stagger={0.07}
        />

        <Reveal delay={0.3}>
          <p className="prose-editorial mx-auto mt-9 max-w-xl text-cream/65">
            Folia is young. The expertise behind it is not. A brand of My Aangan
            Eco Pvt Ltd, built on the legacy of Amruth Organic Fertilizers —
            decades of organic growing, now simplified for your home.
          </p>
        </Reveal>

        <Reveal delay={0.45}>
          <Link href="/story" className="btn-ghost-cream mt-12">
            Read our story
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
