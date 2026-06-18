"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { productOperations } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { CATEGORY_INTROS } from "@/lib/catalog";

const EASE = [0.16, 1, 0.3, 1] as const;
const ALL = "All";
const CATEGORY_ORDER = [
  "Organic Fertilizers",
  "Soil & Amendments",
  "Plant Boosters",
];

const COUNT_WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve",
];

/**
 * The collection floor: a curated gallery, not a grid of cards.
 * Two staggered columns, alternating plate proportions, quick add
 * available without breaking the walk.
 */
export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(ALL);
  const reduced = useReducedMotionSafe();

  // Read ?category= the way the rest of the app expects (no Suspense needed),
  // and re-read it on back/forward so the filter never desyncs from the URL.
  useEffect(() => {
    const syncFromUrl = () => {
      const fromUrl = new URLSearchParams(window.location.search).get("category");
      setCategory(fromUrl || ALL);
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    let cancelled = false;
    productOperations
      .getAll()
      .then((all) => {
        if (!cancelled) setProducts(all);
      })
      .catch((error) => console.error("Error loading products:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const present = new Set(products.map((p) => p.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    const extras = Array.from(present).filter(
      (c) => !CATEGORY_ORDER.includes(c)
    );
    return [ALL, ...ordered, ...extras];
  }, [products]);

  const filtered = useMemo(
    () =>
      category === ALL
        ? products
        : products.filter((p) => p.category === category),
    [products, category]
  );

  const selectCategory = (next: string) => {
    setCategory(next);
    router.replace(
      next === ALL
        ? "/products"
        : `/products?category=${encodeURIComponent(next)}`,
      { scroll: false }
    );
  };

  const countWord = COUNT_WORDS[filtered.length] ?? String(filtered.length);
  const intro = category !== ALL ? CATEGORY_INTROS[category]?.line : undefined;

  return (
    <div className="bg-parchment">
      {/* ——— Gallery entrance ——— */}
      <header className="mx-auto max-w-[1480px] px-5 pb-4 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <Reveal y={20}>
          <p className="eyebrow text-forest">The collection</p>
        </Reveal>
        <TextReveal
          as="h1"
          text={"Everything the soil asks for."}
          className="font-display mt-6 max-w-3xl text-4xl font-light leading-[1.04] tracking-[-0.015em] text-ink sm:text-6xl"
          stagger={0.05}
        />
        <Reveal delay={0.3}>
          <p className="prose-editorial mt-6 max-w-md text-ink/70">
            {intro ??
              "Nine organic essentials — grown, cured and blended the slow way. Every one of them earns its place."}
          </p>
        </Reveal>

        {/* Category tabs — quiet chrome, the catalogue warrants no more */}
        <Reveal delay={0.4}>
          <nav
            aria-label="Filter by category"
            className="hairline-b mt-12 flex flex-wrap gap-x-8 gap-y-3 pb-4"
          >
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => selectCategory(c)}
                aria-pressed={category === c}
                className={`relative pb-1 text-[0.75rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                  category === c ? "text-ink" : "text-ink/65 hover:text-ink/70"
                }`}
              >
                {c}
                {category === c && (
                  <motion.span
                    layoutId="category-underline"
                    className="absolute -bottom-[17px] left-0 h-px w-full bg-ink"
                    transition={{ duration: 0.5, ease: EASE }}
                  />
                )}
              </button>
            ))}
          </nav>
        </Reveal>
      </header>

      {/* ——— The floor ——— */}
      <div className="mx-auto max-w-[1480px] px-5 pb-28 sm:px-8 lg:px-12">
        {loading ? (
          <div className="grid grid-cols-1 gap-x-12 gap-y-20 pt-14 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} aria-hidden="true" className={i % 2 === 1 ? "sm:mt-24" : ""}>
                <div className="aspect-[4/5] animate-pulse bg-ink/5" />
                <div className="mt-5 h-4 w-2/3 animate-pulse bg-ink/5" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-display text-3xl font-light text-ink">
              The shelves are bare here — <em className="text-forest">for now.</em>
            </p>
            <button onClick={() => selectCategory(ALL)} className="btn-ghost-ink mt-8">
              View the whole collection
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow pt-8 text-ink/65" aria-live="polite">
              {countWord} {filtered.length === 1 ? "essential" : "essentials"}
              {category !== ALL ? ` — ${category}` : ""}
            </p>

            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 gap-x-12 gap-y-16 pt-8 sm:grid-cols-2 sm:gap-y-24">
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.9,
                      delay: (i % 2) * 0.08,
                      ease: EASE,
                    }}
                    className={i % 2 === 1 ? "sm:mt-28" : ""}
                  >
                    <ProductCard
                      product={product}
                      hideCategory={category !== ALL}
                      aspect={
                        i % 4 === 1 || i % 4 === 2
                          ? "aspect-[3/4]"
                          : "aspect-[4/5]"
                      }
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
