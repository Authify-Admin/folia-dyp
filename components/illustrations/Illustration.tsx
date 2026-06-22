import type { ReactNode } from "react";

/**
 * The Folia line-mark library — a single visual language of hand-drawn
 * editorial illustrations that carry the "more visuals" weight across the
 * site without needing photography we don't have.
 *
 * Every glyph is authored in a 120×120 box, stroked in `currentColor`, with
 * soft `currentColor` fills. That means one illustration tints to whatever
 * text colour its container sets — `text-forest` on parchment, `text-sage`
 * on forest-night — and always stays in palette.
 *
 *   <Illustration name="sprout" className="h-16 w-16 text-forest" />
 */

const A = 0.14; // soft accent-fill opacity

const GLYPHS: Record<string, ReactNode> = {
  /* — a seedling breaking ground — */
  sprout: (
    <>
      <path d="M38 98h44" />
      <path d="M60 98V56" />
      <path d="M60 72C49 72 36 66 31 51c16-2 29 5 29 21Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 64c11 0 24-6 29-21-16-2-29 5-29 21Z" fill="currentColor" fillOpacity={A} />
    </>
  ),

  /* — soil in cross-section, a shoot above — */
  "soil-layers": (
    <>
      <path d="M60 52V40" />
      <path d="M60 47c-8 0-15-5-16-13 9-1 16 4 16 13Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 44c8 0 15-5 16-13-9-1-16 4-16 13Z" fill="currentColor" fillOpacity={A} />
      <rect x="26" y="52" width="68" height="42" rx="5" fill="currentColor" fillOpacity={A * 0.6} />
      <path d="M26 66c11-7 22-7 34 0s23 7 34 0" />
      <path d="M26 80c11 7 22 7 34 0s23-7 34 0" />
    </>
  ),

  /* — earthworm working the soil — */
  worm: (
    <>
      <path d="M22 88h76" />
      <path d="M30 82c0-15 16-17 18-4s16 13 18 0 16-11 22-3" />
      <circle cx="90" cy="73" r="2.6" fill="currentColor" />
      <path d="M44 70v6M58 74v6M72 70v6" opacity={0.5} />
    </>
  ),

  /* — a neem leaf with veins — */
  "neem-leaf": (
    <>
      <path d="M60 22c-17 14-23 46 0 76 23-30 17-62 0-76Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 30v64" />
      <path d="M60 46c-6 1-10 5-13 11M60 46c6 1 10 5 13 11" />
      <path d="M60 62c-6 1-11 6-14 12M60 62c6 1 11 6 14 12" />
    </>
  ),

  /* — living microbes in the soil — */
  microbes: (
    <>
      <ellipse cx="47" cy="54" rx="15" ry="12" fill="currentColor" fillOpacity={A} />
      <circle cx="44" cy="52" r="2.6" fill="currentColor" />
      <path d="M47 66c3 6-1 11-6 14" />
      <ellipse cx="76" cy="70" rx="12" ry="9" fill="currentColor" fillOpacity={A} />
      <circle cx="77" cy="69" r="2.2" fill="currentColor" />
      <path d="M87 65c6-1 10 3 12 8" />
      <circle cx="68" cy="38" r="7" />
      <circle cx="68" cy="38" r="1.8" fill="currentColor" />
    </>
  ),

  /* — a bloom on its stem — */
  flower: (
    <>
      {[0, 72, 144, 216, 288].map((d) => (
        <ellipse key={d} cx="60" cy="34" rx="6.5" ry="12" transform={`rotate(${d} 60 48)`} fill="currentColor" fillOpacity={A} />
      ))}
      <circle cx="60" cy="48" r="7" fill="currentColor" fillOpacity={A * 2} />
      <path d="M60 55v39" />
      <path d="M60 76c10 0 17-5 19-14-10-1-19 4-19 14Z" fill="currentColor" fillOpacity={A} />
    </>
  ),

  /* — the watering can — */
  "watering-can": (
    <>
      <path d="M42 62h26l-3 24a4 4 0 0 1-4 3.5H49a4 4 0 0 1-4-3.5Z" fill="currentColor" fillOpacity={A} />
      <path d="M46 62c1-8 20-8 21 0" />
      <path d="M68 67l18-8" />
      <path d="M83 55l9-4" />
      <path d="M88 60c2 4 5 4 7 0" />
      <path d="M84 70v6M91 72v6" opacity={0.55} />
    </>
  ),

  /* — an open hand cradling a shoot (the helping-hand motif) — */
  "helping-hand": (
    <>
      <path d="M58 60V44" />
      <path d="M58 54c-8 0-14-5-15-13 9-1 15 4 15 13Z" fill="currentColor" fillOpacity={A} />
      <path d="M58 51c8 0 14-4 15-12-9-1-15 4-15 12Z" fill="currentColor" fillOpacity={A} />
      <path d="M28 66v8c0 13 11 21 25 21h6c12 0 21-8 22-19" fill="currentColor" fillOpacity={A * 0.5} />
      <path d="M40 66v-7M52 64v-9M64 64v-9M76 66v-6" />
      <path d="M28 66c-5-2-7 3-4 7" />
    </>
  ),

  /* — a seasonal calendar — */
  calendar: (
    <>
      <rect x="30" y="34" width="60" height="56" rx="5" fill="currentColor" fillOpacity={A * 0.6} />
      <path d="M30 50h60" />
      <path d="M44 28v12M76 28v12" />
      <circle cx="44" cy="62" r="2" fill="currentColor" />
      <circle cx="56" cy="62" r="2" fill="currentColor" />
      <circle cx="44" cy="74" r="2" fill="currentColor" />
      <path d="M68 58c-6 4-7 12-1 18 7-4 8-13 1-18Z" fill="currentColor" fillOpacity={A} />
    </>
  ),

  /* — diagnose a leaf under the loupe — */
  "leaf-diagnosis": (
    <>
      <path d="M50 28c-15 13-20 42 0 68 20-26 15-55 0-68Z" fill="currentColor" fillOpacity={A} />
      <path d="M50 34v56" />
      <path d="M50 50c-5 1-9 5-11 10M50 64c-5 1-9 5-11 10" />
      <circle cx="78" cy="70" r="14" />
      <path d="M88 80l11 11" />
    </>
  ),

  /* — N · P · K, rising — */
  "npk-meter": (
    <>
      <path d="M30 88h60" />
      <rect x="37" y="64" width="13" height="24" rx="3.5" fill="currentColor" fillOpacity={A} />
      <rect x="57" y="52" width="13" height="36" rx="3.5" fill="currentColor" fillOpacity={A} />
      <rect x="77" y="40" width="13" height="48" rx="3.5" fill="currentColor" fillOpacity={A} />
      <path d="M83 40c0-6-3-9-3-9s-3 3-3 9Z" fill="currentColor" fillOpacity={A * 2} />
    </>
  ),

  /* — roots reaching below the line — */
  roots: (
    <>
      <path d="M24 60h72" />
      <path d="M60 60V42" />
      <path d="M60 50c-7 0-12-5-13-11 8-1 13 4 13 11Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 48c7 0 12-4 13-10-8-1-13 4-13 10Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 60v32M60 70c-6 4-9 10-10 18M60 74c6 5 10 9 12 16M60 84c-4 2-6 5-7 9M60 86c5 2 8 5 9 8" />
    </>
  ),

  /* — the sun — */
  sun: (
    <>
      <circle cx="60" cy="58" r="17" fill="currentColor" fillOpacity={A} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <path key={d} d="M60 30V20" transform={`rotate(${d} 60 58)`} />
      ))}
    </>
  ),

  /* — the compost cycle — */
  cycle: (
    <>
      <path d="M86 50a28 28 0 1 0 5 20" />
      <path d="M86 50l1-12M86 50l-12 2" />
      <path d="M60 50c-7 0-12-5-13-11 8-1 13 4 13 11Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 48c7 0 12-4 13-10-8-1-13 4-13 10Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 50v22" />
    </>
  ),

  /* — mineral rock / mountain — */
  mountain: (
    <>
      <path d="M22 90l26-44 16 26 8-13 26 31Z" fill="currentColor" fillOpacity={A} />
      <path d="M22 90h76" />
      <path d="M48 46l-9 16M48 46l8 13" opacity={0.55} />
    </>
  ),

  /* — a magnesium crystal — */
  crystal: (
    <>
      <path d="M60 28l18 16-18 48-18-48Z" fill="currentColor" fillOpacity={A} />
      <path d="M42 44h36" />
      <path d="M60 28v64" />
      <path d="M86 34v9M81 38h10" opacity={0.6} />
    </>
  ),

  /* — a planted pot — */
  pot: (
    <>
      <path d="M60 64V48" />
      <path d="M60 56c-9 0-15-6-16-14 9-1 16 5 16 14Z" fill="currentColor" fillOpacity={A} />
      <path d="M60 52c9 0 15-6 16-14-9-1-16 5-16 14Z" fill="currentColor" fillOpacity={A} />
      <path d="M44 64l4 26a4 4 0 0 0 4 3.5h16a4 4 0 0 0 4-3.5l4-26Z" fill="currentColor" fillOpacity={A * 0.7} />
      <path d="M40 64h40M42 71h36" />
    </>
  ),
};

/** Which line-mark fronts each product, used on the product page. */
export const ILLUSTRATION_FOR_SLUG: Record<string, string> = {
  vermicompost: "worm",
  "neem-cake": "neem-leaf",
  "bio-npk-granules": "microbes",
  "organic-cow-manure": "cycle",
  "rock-phosphate": "mountain",
  "potting-mix": "pot",
  perlite: "soil-layers",
  "epsom-salt": "crystal",
  "flower-booster": "flower",
};

/** Glyphs cycled through the four ritual steps on a product page. */
export const RITUAL_GLYPHS = ["helping-hand", "sprout", "watering-can", "cycle"];

export interface IllustrationProps {
  name: string;
  className?: string;
  /** Accessible label. Omit to keep the mark decorative (aria-hidden). */
  title?: string;
  strokeWidth?: number;
}

export function Illustration({
  name,
  className,
  title,
  strokeWidth = 2,
}: IllustrationProps) {
  const glyph = GLYPHS[name] ?? GLYPHS.sprout;
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {glyph}
    </svg>
  );
}
