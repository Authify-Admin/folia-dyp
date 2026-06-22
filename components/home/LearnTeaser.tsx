"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES } from "@/lib/guides";
import { Illustration } from "@/components/illustrations/Illustration";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const PICKS = ["building-living-soil", "reading-your-plant", "year-in-the-garden"];

/**
 * The helping-hand promise made visible: a teaser into the Field Guide.
 * We teach first — the brand earns trust by being genuinely useful.
 */
export function LearnTeaser() {
  const guides = PICKS.map((s) => GUIDES.find((g) => g.slug === s)).filter(
    (g): g is (typeof GUIDES)[number] => Boolean(g)
  );

  return (
    <section
      aria-label="The Field Guide"
      className="grain-overlay relative overflow-hidden bg-forest-night py-24 text-cream sm:py-32"
    >
      <Illustration
        name="helping-hand"
        className="pointer-events-none absolute -left-12 top-10 h-72 w-72 text-sage/[0.08] sm:h-96 sm:w-96"
      />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <p className="eyebrow text-sage">A helping-hand brand</p>
            <h2 className="font-display mt-5 max-w-2xl text-3xl font-light leading-[1.1] text-cream sm:text-5xl">
              We&rsquo;d rather teach you to garden than just sell you a bag.
            </h2>
            <p className="prose-editorial mt-7 max-w-xl text-cream/65">
              The Field Guide is everything we&rsquo;ve learned over decades in the
              soil — building living soil, decoding NPK, reading a struggling leaf,
              gardening through the Indian year. Given freely, whether you buy from
              us or not.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              href="/learn"
              className="link-rule group inline-flex shrink-0 text-[0.75rem] font-bold uppercase tracking-[0.2em] text-cream hover:text-sage"
            >
              Visit the Field Guide
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </Reveal>
        </div>

        <Stagger
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden border border-cream/12 bg-cream/12 sm:grid-cols-3"
          stagger={0.12}
        >
          {guides.map((g) => (
            <StaggerItem key={g.slug} className="bg-forest-night">
              <Link
                href={`/learn/${g.slug}`}
                className="group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-forest-deep sm:p-10"
              >
                <Illustration
                  name={g.heroIllustration}
                  className="h-12 w-12 text-sage transition-transform duration-500 group-hover:-translate-y-1"
                />
                <p className="eyebrow mt-7 text-cream/55">
                  {g.category} · {g.readMinutes} min
                </p>
                <h3 className="font-display mt-3 text-xl font-light leading-snug text-cream sm:text-2xl">
                  {g.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-cream/60">
                  {g.dek}
                </p>
                <span className="link-rule mt-6 inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-sage">
                  Read
                  <ArrowRight className="h-3 w-3 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={2} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
