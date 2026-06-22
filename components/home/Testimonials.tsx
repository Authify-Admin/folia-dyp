"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { REVIEWS, SITE_TESTIMONIALS } from "@/lib/reviews";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stars } from "@/components/product/Stars";

const AVERAGE =
  Math.round((REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length) * 10) /
  10;
const COUNT = REVIEWS.length;

/** Social proof on the homepage — an aggregate rating and a few real voices. */
export function Testimonials() {
  const featured = SITE_TESTIMONIALS.slice(0, 3);

  return (
    <section aria-label="What customers say" className="bg-parchment py-24 sm:py-32">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="eyebrow text-forest">Loved across India</p>
            <h2 className="font-display mt-5 max-w-xl text-3xl font-light leading-[1.1] text-ink sm:text-4xl lg:text-5xl">
              Gardens that took us at our word — and grew.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex items-center gap-4">
              <p className="font-display text-5xl font-light text-ink">
                {AVERAGE.toFixed(1)}
              </p>
              <div>
                <Stars value={AVERAGE} className="h-4 w-4" />
                <p className="mt-1.5 text-sm text-ink/65">
                  from {COUNT} verified-led reviews
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <Stagger
          className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3"
          stagger={0.12}
        >
          {featured.map((r) => (
            <StaggerItem key={r.id}>
              <figure className="hairline-t flex h-full flex-col pt-8">
                <Stars value={r.rating} className="h-4 w-4" />
                <blockquote className="font-display mt-5 flex-1 text-xl font-light leading-relaxed text-ink/90">
                  &ldquo;{r.body}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-ink/65">
                  <span className="font-semibold text-ink/80">{r.author}</span>
                  <span aria-hidden="true" className="text-ink/30">·</span>
                  <span>{r.city}</span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-forest">
                      <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
                      Verified
                    </span>
                  )}
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal>
          <Link
            href="/products"
            className="link-rule mt-14 inline-flex text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
          >
            Read reviews on every product
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
