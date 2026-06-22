"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Illustration } from "@/components/illustrations/Illustration";
import { Reveal } from "@/components/motion/Reveal";

export const PLANT_DOCTOR_POINTS = [
  "Share a photo of the trouble",
  "Get a clear problem diagnosis",
  "Receive simple care recommendations",
  "Learn the practice that prevents it",
];

/**
 * The Folia Plant Doctor — a free gardening consultation. The helping hand
 * made literal: send a photo, a real gardener tells you what to do. No
 * purchase needed.
 */
export function PlantDoctor() {
  return (
    <section
      aria-label="Folia Plant Doctor"
      className="grain-overlay relative overflow-hidden bg-forest-night py-20 text-cream sm:py-24"
    >
      <Illustration
        name="leaf-diagnosis"
        className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 text-sage/[0.08] sm:h-96 sm:w-96"
      />
      <div className="relative mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow text-sage">Folia Plant Doctor</p>
            <h2 className="font-display mt-5 max-w-lg text-3xl font-light leading-[1.1] text-cream sm:text-4xl lg:text-5xl">
              Still stuck? Let a gardener take a look.
            </h2>
            <p className="prose-editorial mt-7 max-w-md text-cream/65">
              Send a photo of the trouble and a real gardener will diagnose it and
              tell you exactly what to do — free, with no purchase needed. It is
              the helping hand behind the brand.
            </p>
            <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-sage/40 bg-sage/5 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-sage">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
              </span>
              Free · A reply within 24 hours
            </div>
            <Link
              href="/contact"
              className="link-rule group mt-8 flex text-[0.75rem] font-bold uppercase tracking-[0.2em] text-cream hover:text-sage"
            >
              Ask the Plant Doctor
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </Reveal>

          <Reveal delay={0.15} className="lg:self-center">
            <ul className="space-y-5 border-t border-cream/15 pt-8">
              {PLANT_DOCTOR_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sage/40 text-sage">
                    <Check className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="font-display text-lg font-light text-cream/90">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
