"use client";

import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const PILLARS = [
  {
    ordinal: "I",
    title: "Wholly organic",
    body: "Chemical-free formulations that feed plants without ever burning roots — gentle enough for every season.",
  },
  {
    ordinal: "II",
    title: "Made in small batches",
    body: "Cured, tested and packed with the patience the material demands. Quality you can check, not just read about.",
  },
  {
    ordinal: "III",
    title: "Service that answers",
    body: "Free doorstep delivery across India, easy returns, and people who reply when something needs attention.",
  },
];

/** Three quiet commitments, set in a hairline grid. */
export function CraftStrip() {
  return (
    <section aria-label="Our commitments" className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Stagger
          className="grid grid-cols-1 divide-y divide-ink/12 border-y border-ink/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          stagger={0.15}
        >
          {PILLARS.map((pillar) => (
            <StaggerItem key={pillar.ordinal} className="px-2 py-12 sm:px-10 sm:py-16">
              <p className="font-display text-2xl font-light italic text-clay">
                {pillar.ordinal}
              </p>
              <h3 className="font-display mt-4 text-2xl font-medium text-ink">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-ink/70">
                {pillar.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
