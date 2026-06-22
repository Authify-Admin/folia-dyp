"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Leaf } from "lucide-react";
import { guideBySlug, type Guide, type GuideSection } from "@/lib/guides";
import { productOperations } from "@/lib/firestore";
import { slugForProduct } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { Illustration } from "@/components/illustrations/Illustration";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/** Display names so product chips render instantly, before Firestore resolves. */
const PRODUCT_NAMES: Record<string, string> = {
  vermicompost: "Vermicompost",
  "neem-cake": "Neem Cake",
  "bio-npk-granules": "Bio NPK Granules",
  "organic-cow-manure": "Organic Cow Manure",
  "rock-phosphate": "Rock Phosphate",
  "potting-mix": "Potting Mix",
  perlite: "Perlite",
  "epsom-salt": "Epsom Salt",
  "flower-booster": "Flower Booster",
};

/**
 * One Field Guide, rendered as a long, generous read. Product mentions
 * ("what you'll need") resolve to live Firestore products so they deep-link
 * to the real product page.
 */
export function GuideArticle({ slug }: { slug: string }) {
  const guide = guideBySlug(slug);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    productOperations
      .getAll()
      .then((all) => {
        if (!cancelled) setProducts(all);
      })
      .catch((error) => console.error("Error loading products:", error));
    return () => {
      cancelled = true;
    };
  }, []);

  const productMap = useMemo(() => {
    const m = new Map<string, Product>();
    for (const p of products) m.set(slugForProduct(p), p);
    return m;
  }, [products]);

  if (!guide) return null;

  const related = guide.relatedSlugs
    .map((s) => guideBySlug(s))
    .filter((g): g is Guide => Boolean(g));

  return (
    <article className="bg-parchment">
      {/* ——— Masthead ——— */}
      <header className="relative overflow-hidden hairline-b">
        <Illustration
          name={guide.heroIllustration}
          className="pointer-events-none absolute -right-8 top-16 h-64 w-64 text-forest/[0.07] sm:h-80 sm:w-80"
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
          <Link
            href="/learn"
            className="link-rule group inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/65 hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
            The Field Guide
          </Link>
          <p className="eyebrow mt-9 text-forest">
            {guide.category} · {guide.readMinutes} min read
          </p>
          <TextReveal
            as="h1"
            text={guide.title}
            className="font-display mt-5 text-4xl font-light leading-[1.08] tracking-[-0.01em] text-ink sm:text-5xl"
            stagger={0.045}
          />
          <Reveal delay={0.25}>
            <p className="font-display mt-5 text-xl font-light italic text-forest">
              {guide.dek}
            </p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        {/* ——— Intro ——— */}
        <Reveal>
          <p className="prose-editorial mt-14 text-[1.1875rem] leading-[1.8] text-ink/80 sm:text-xl">
            {guide.intro}
          </p>
        </Reveal>

        {/* ——— Sections ——— */}
        <div className="mt-16 space-y-16">
          {guide.sections.map((section, i) => (
            <SectionBlock
              key={section.heading}
              section={section}
              index={i}
              productMap={productMap}
            />
          ))}
        </div>

        {/* ——— Related ——— */}
        {related.length > 0 && (
          <nav aria-label="Related guides" className="hairline-t mt-20 pt-12">
            <p className="eyebrow text-forest">Keep reading</p>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
              {related.map((g) => (
                <Link key={g.slug} href={`/learn/${g.slug}`} className="group flex gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-parchment-deep">
                    <Illustration
                      name={g.heroIllustration}
                      className="h-11 w-11 text-forest/70 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <p className="eyebrow text-ink/55">{g.category}</p>
                    <h3 className="font-display mt-1.5 text-xl font-light leading-snug text-ink transition-colors group-hover:text-forest">
                      {g.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* ——— Closing CTA ——— */}
        <Reveal>
          <div className="mt-20 grain-overlay bg-forest-night px-7 py-12 text-center text-cream sm:px-12">
            <p className="eyebrow text-sage">Put it into practice</p>
            <p className="font-display mt-4 text-2xl font-light leading-snug text-cream sm:text-3xl">
              Everything in this guide, ready on the shelf.
            </p>
            <Link href="/products" className="btn-ghost-cream mt-8">
              Shop the collection
            </Link>
          </div>
        </Reveal>
      </div>
    </article>
  );
}

function SectionBlock({
  section,
  index,
  productMap,
}: {
  section: GuideSection;
  index: number;
  productMap: Map<string, Product>;
}) {
  const paragraphs = section.body.split("\n\n");
  return (
    <section className="scroll-mt-24">
      <Reveal>
        {section.illustration && (
          <Illustration
            name={section.illustration}
            className="h-14 w-14 text-forest"
          />
        )}
        <h2 className="font-display mt-5 text-2xl font-light leading-tight text-ink sm:text-3xl">
          <span className="mr-3 text-base italic text-clay">
            {String(index + 1).padStart(2, "0")}
          </span>
          {section.heading}
        </h2>
        {paragraphs.map((p, j) => (
          <p key={j} className="prose-editorial mt-4 text-ink/75">
            {p}
          </p>
        ))}
      </Reveal>

      {/* Steps */}
      {section.steps && section.steps.length > 0 && (
        <ol className="mt-9 space-y-7 border-l border-ink/12 pl-7">
          {section.steps.map((step, j) => (
            <Reveal key={step.title} delay={j * 0.05}>
              <li className="relative">
                <span className="font-display absolute -left-[2.35rem] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-forest text-xs font-semibold text-parchment">
                  {j + 1}
                </span>
                <h3 className="font-display text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="prose-editorial mt-1.5 !text-base text-ink/70">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      )}

      {/* Callout */}
      {section.callout && (
        <Reveal>
          <aside className="mt-9 border-l-2 border-clay bg-clay/[0.05] py-5 pl-6 pr-5">
            <p className="eyebrow text-clay-deep">{section.callout.label}</p>
            <p className="prose-editorial mt-2.5 !text-base text-ink/75">
              {section.callout.body}
            </p>
          </aside>
        </Reveal>
      )}

      {/* What you'll need */}
      {section.productSlugs && section.productSlugs.length > 0 && (
        <Reveal>
          <div className="mt-9">
            <p className="eyebrow text-forest">What you&rsquo;ll need</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {section.productSlugs.map((s) => {
                const product = productMap.get(s);
                const name = PRODUCT_NAMES[s] ?? s;
                const className =
                  "group inline-flex items-center gap-2 border border-ink/20 px-4 py-2.5 text-sm font-medium text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-parchment";
                return product ? (
                  <Link key={s} href={`/products/${product.id}`} className={className}>
                    <Leaf className="h-3.5 w-3.5 text-forest group-hover:text-sage" strokeWidth={1.75} />
                    {name}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                  </Link>
                ) : (
                  <Link key={s} href="/products" className={className}>
                    <Leaf className="h-3.5 w-3.5 text-forest group-hover:text-sage" strokeWidth={1.75} />
                    {name}
                  </Link>
                );
              })}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}
