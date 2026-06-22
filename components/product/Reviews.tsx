"use client";

import { useState } from "react";
import Image from "next/image";
import { BadgeCheck, Camera } from "lucide-react";
import { reviewsForSlug, ratingSummary, type Review } from "@/lib/reviews";
import { blurFor } from "@/lib/blur-data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stars } from "@/components/product/Stars";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Deterministic "12 May 2026" — no locale/timezone drift across hydration. */
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const INITIAL = 6;

/**
 * The trust floor: an aggregate rating, the spread of scores, a strip of
 * customer photos, and the reviews themselves with verified-purchase marks.
 * Seeded data today (lib/reviews.ts), real submissions later — same shape.
 */
export function Reviews({ slug }: { slug: string }) {
  const all = reviewsForSlug(slug);
  const summary = ratingSummary(slug);
  const [expanded, setExpanded] = useState(false);

  if (all.length === 0) return null;

  const photos = all.filter((r) => r.photo);
  const shown = expanded ? all : all.slice(0, INITIAL);
  const verifiedCount = all.filter((r) => r.verified).length;

  return (
    <section
      id="reviews"
      aria-label="Customer reviews"
      className="scroll-mt-24 bg-parchment-deep py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-forest">Loved by gardeners</p>
          <h2 className="font-display mt-5 text-3xl font-light text-ink sm:text-4xl">
            What the community says
          </h2>
        </Reveal>

        {/* ——— Summary + distribution ——— */}
        <div className="mt-12 grid grid-cols-1 gap-12 border-y border-ink/12 py-12 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal className="flex flex-col items-start">
            <div className="flex items-end gap-4">
              <p className="font-display text-7xl font-light leading-none text-ink">
                {summary.average.toFixed(1)}
              </p>
              <div className="pb-1.5">
                <Stars value={summary.average} className="h-5 w-5" />
                <p className="mt-2 text-sm text-ink/65">
                  {summary.count} review{summary.count === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <p className="mt-5 inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-forest">
              <BadgeCheck className="h-4 w-4" strokeWidth={1.75} />
              {verifiedCount} verified purchase{verifiedCount === 1 ? "" : "s"}
            </p>
          </Reveal>

          <Reveal className="max-w-md self-center" delay={0.1}>
            <ul className="space-y-2.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const n = summary.distribution[star] ?? 0;
                const pct = summary.count ? (n / summary.count) * 100 : 0;
                return (
                  <li key={star} className="flex items-center gap-3 text-sm">
                    <span className="w-3 text-ink/65">{star}</span>
                    <Stars value={star} className="h-3 w-3" />
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <span
                        className="block h-full rounded-full bg-clay/70"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <span className="w-6 text-right text-ink/55">{n}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>

        {/* ——— Customer photos ——— */}
        {photos.length > 0 && (
          <Reveal>
            <div className="mt-14">
              <p className="eyebrow inline-flex items-center gap-2 text-ink/65">
                <Camera className="h-3.5 w-3.5" strokeWidth={1.75} />
                From the community
              </p>
              <div className="mt-5 flex flex-wrap gap-3 sm:gap-4">
                {photos.slice(0, 6).map((r) => (
                  <figure
                    key={r.id}
                    className="group relative h-24 w-24 overflow-hidden bg-ink/5 sm:h-28 sm:w-28"
                  >
                    <Image
                      src={r.photo!}
                      alt={`Photo from ${r.author}`}
                      fill
                      sizes="112px"
                      placeholder={blurFor(r.photo!) ? "blur" : "empty"}
                      blurDataURL={blurFor(r.photo!)}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-2 pb-1.5 pt-5 text-[0.625rem] font-semibold uppercase tracking-wide text-parchment">
                      {r.author.split(" ")[0]}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* ——— The reviews ——— */}
        <Stagger
          className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2"
          stagger={0.08}
        >
          {shown.map((r) => (
            <StaggerItem key={r.id}>
              <ReviewCard review={r} />
            </StaggerItem>
          ))}
        </Stagger>

        {all.length > INITIAL && !expanded && (
          <div className="mt-12 text-center">
            <button onClick={() => setExpanded(true)} className="btn-ghost-ink">
              Read all {all.length} reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review: r }: { review: Review }) {
  return (
    <article className="hairline-t pt-7">
      <div className="flex items-center justify-between gap-4">
        <Stars value={r.rating} className="h-4 w-4" />
        <time className="text-xs text-ink/50" dateTime={r.date}>
          {formatDate(r.date)}
        </time>
      </div>
      <h3 className="font-display mt-4 text-xl font-medium leading-snug text-ink">
        {r.title}
      </h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink/75">{r.body}</p>
      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-ink/65">
        <span className="font-semibold text-ink/80">{r.author}</span>
        <span aria-hidden="true" className="text-ink/30">·</span>
        <span>{r.city}</span>
        {r.verified && (
          <span className="inline-flex items-center gap-1 text-forest">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
            Verified
          </span>
        )}
      </div>
    </article>
  );
}
