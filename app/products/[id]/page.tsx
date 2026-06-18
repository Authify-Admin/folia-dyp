"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import type { Product, ProductVariant } from "@/lib/types";
import { productOperations } from "@/lib/firestore";
import { useCart } from "@/contexts/CartContext";
import { useCartUI } from "@/contexts/CartUIContext";
import {
  narrativeFor,
  parseDescription,
  slugForProduct,
} from "@/lib/catalog";
import { productForCart, trackAddToCart } from "@/lib/cart-helpers";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ProductCard } from "@/components/product/ProductCard";

const EASE = [0.16, 1, 0.3, 1] as const;

const GENERIC_RITUAL = [
  { title: "Loosen the soil", body: "Gently work the topsoil around the base of your plant." },
  { title: "Apply & mix", body: "Add the recommended quantity and mix it lightly into the soil." },
  { title: "Water well", body: "Water thoroughly so nutrients reach the root zone." },
  { title: "Repeat", body: "Re-apply every 2–4 weeks through the growing season." },
];

/**
 * One product, told as a short film:
 *   Act I    Arrival — photograph + the purchase moment
 *   Act II   The line — a dark beat of large type
 *   Act III  The story — origin & craft chapters on scroll
 *   Act IV   The ritual — how it is used
 *   Act V    The fine print — benefits & specifications
 *   Act VI   Pairings — what belongs beside it
 */
export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const { openCart } = useCartUI();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [added, setAdded] = useState(false);
  // Count a product view exactly once (StrictMode-safe).
  const trackedClickRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    productOperations
      .getAll()
      .then((products) => {
        if (cancelled) return;
        setAllProducts(products);
        const found = products.find((p) => p.id === params.id) ?? null;
        setProduct(found);

        if (found && trackedClickRef.current !== found.id) {
          trackedClickRef.current = found.id;
          fetch("/api/analytics/track-click", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: found.id }),
          }).catch((error) => console.error("Error tracking click:", error));
        }

        if (found?.hasVariants && found.variants && found.variants.length > 0) {
          setSelectedVariant(
            found.variants.find((v) => v.quantity > 0) ?? found.variants[0]
          );
        } else {
          setSelectedVariant(null);
        }
        setQuantity(1);
      })
      .catch((error) => console.error("Error loading product:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const narrative = product ? narrativeFor(product) : undefined;
  const parsed = useMemo(
    () =>
      product
        ? parseDescription(product.description)
        : { tagline: "", body: "", benefits: [] as string[] },
    [product]
  );

  const price = product?.hasVariants && selectedVariant ? selectedVariant.price : product?.price ?? 0;
  const stock = product?.hasVariants && selectedVariant ? selectedVariant.quantity : product?.quantity ?? 0;
  const size = product?.hasVariants && selectedVariant ? selectedVariant.size : product?.weight ?? "";

  const pairings = useMemo(() => {
    if (!product) return [];
    const bySlug = new Map(allProducts.map((p) => [slugForProduct(p), p]));
    const fromNarrative = (narrative?.pairings ?? [])
      .map((slug) => bySlug.get(slug))
      .filter((p): p is Product => Boolean(p) && p!.id !== product.id);
    if (fromNarrative.length > 0) return fromNarrative.slice(0, 2);
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 2);
  }, [allProducts, product, narrative]);

  const handleAddToCart = () => {
    if (!product || stock <= 0) return;
    // Load-bearing contract: variant.size travels as Product.weight.
    addToCart(
      productForCart(product, { size, price, quantity: stock }),
      quantity
    );
    trackAddToCart(product.id);
    setAdded(true);
    setTimeout(() => {
      openCart();
      setAdded(false);
    }, 350);
  };

  /* ——— Loading room ——— */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-parchment">
        <motion.p
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.9 }}
          className="font-display text-2xl font-light italic text-ink/65"
        >
          Fetching from the shelves…
        </motion.p>
      </div>
    );
  }

  /* ——— Wrong door ——— */
  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-parchment px-6 text-center">
        <p className="eyebrow text-clay-deep">Not found</p>
        <h1 className="font-display mt-6 max-w-lg text-4xl font-light leading-tight text-ink">
          This shelf is empty — the product may have moved on.
        </h1>
        <Link href="/products" className="btn-ghost-ink mt-10">
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to the collection
        </Link>
      </div>
    );
  }

  const heroImage = product.images?.[0] ?? product.image;
  const altImage = product.images?.[1];
  const soldOut = stock <= 0;

  return (
    <div className="bg-parchment">
      {/* ═══ Act I — Arrival ═══ */}
      <section className="mx-auto max-w-[1480px] px-5 pt-24 sm:px-8 sm:pt-28 lg:px-12">
        <nav aria-label="Breadcrumb" className="py-5">
          <Link
            href="/products"
            className="link-rule group inline-flex text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-ink/65 hover:text-ink"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
            The collection
          </Link>
        </nav>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          {/* The photographs — an editorial column */}
          <div className="space-y-6 lg:w-[55%]">
            <motion.div
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="relative"
            >
              <ParallaxImage
                src={heroImage}
                alt={product.name}
                priority
                speed={0.05}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="aspect-[4/5] w-full sm:aspect-[5/6]"
              />
              {soldOut && (
                <span className="absolute left-6 top-6 bg-ink/85 px-5 py-2.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-parchment">
                  Sold out
                </span>
              )}
              {narrative && (
                <span className="font-display pointer-events-none absolute -top-4 right-4 text-[6rem] font-light leading-none text-parchment mix-blend-soft-light sm:text-[8rem]">
                  {narrative.ordinal.replace("No. ", "")}
                </span>
              )}
            </motion.div>
          </div>

          {/* The purchase moment — sticky, unhurried */}
          <div className="lg:w-[45%]">
            <div className="lg:sticky lg:top-28">
              <Reveal y={20}>
                <p className="eyebrow text-forest">
                  {narrative ? `${narrative.ordinal} — ` : ""}
                  {product.category}
                </p>
              </Reveal>

              <TextReveal
                as="h1"
                text={product.name}
                className="font-display mt-5 text-4xl font-light leading-[1.04] tracking-[-0.01em] text-ink sm:text-5xl lg:text-[3.4rem]"
                stagger={0.05}
              />

              {parsed.tagline && (
                <Reveal delay={0.2}>
                  <p className="font-display mt-4 text-xl font-light italic text-forest">
                    {parsed.tagline}
                  </p>
                </Reveal>
              )}

              <Reveal delay={0.3}>
                <div className="mt-8 flex items-baseline gap-3">
                  <p className="font-display text-4xl font-medium text-ink">
                    ₹{price.toFixed(0)}
                  </p>
                  <p className="text-sm uppercase tracking-[0.14em] text-ink/65">
                    / {size}
                  </p>
                </div>

                {/* Variants — quiet hairline chips */}
                {product.hasVariants && product.variants && product.variants.length > 0 && (
                  <fieldset className="mt-8">
                    <legend className="field-label">Size</legend>
                    <div className="flex flex-wrap gap-3">
                      {product.variants.map((variant) => {
                        const isSelected = selectedVariant?.size === variant.size;
                        const isOut = variant.quantity === 0;
                        return (
                          <button
                            key={variant.size}
                            onClick={() => {
                              setSelectedVariant(variant);
                              setQuantity(1);
                            }}
                            disabled={isOut}
                            aria-pressed={isSelected}
                            className={`min-w-[5.5rem] border px-5 py-3.5 text-center transition-all duration-400 ${
                              isSelected
                                ? "border-ink bg-ink text-parchment"
                                : isOut
                                ? "cursor-not-allowed border-ink/10 text-ink/30 line-through"
                                : "border-ink/25 text-ink hover:border-ink"
                            }`}
                          >
                            <span className="block text-sm font-bold tracking-wide">
                              {variant.size}
                            </span>
                            <span
                              className={`mt-0.5 block text-xs ${
                                isSelected ? "text-parchment/70" : "text-ink/65"
                              }`}
                            >
                              ₹{variant.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {/* Quantity + the act of purchase */}
                {!soldOut ? (
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <div className="flex items-center justify-between border border-ink/25 sm:justify-start">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                        className="px-5 py-4 text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
                      >
                        <Minus className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                      <span className="w-10 text-center font-semibold text-ink">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                        disabled={quantity >= stock}
                        aria-label="Increase quantity"
                        className="px-5 py-4 text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
                      >
                        <Plus className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className={`btn-clay flex-1 ${added ? "!bg-forest" : ""}`}
                    >
                      {added ? (
                        <>
                          <Check className="h-4 w-4" strokeWidth={2} />
                          Added to cart
                        </>
                      ) : (
                        <>Add to cart — ₹{(price * quantity).toFixed(0)}</>
                      )}
                    </button>
                  </div>
                ) : (
                  <button disabled className="btn-ghost-ink mt-8 w-full opacity-50">
                    Out of stock
                  </button>
                )}

                {stock > 0 && stock < 10 && (
                  <p className="mt-4 text-[0.8125rem] text-clay-deep">
                    Only {stock} left in this size.
                  </p>
                )}

                {/* The quiet assurances */}
                <dl className="hairline-t mt-10 grid grid-cols-2 gap-x-6 gap-y-4 pt-7 sm:grid-cols-4">
                  {["Free shipping", "100% organic", "Lab-tested", "Easy returns"].map(
                    (label) => (
                      <div key={label} className="text-center sm:text-left">
                        <dt className="sr-only">{label}</dt>
                        <dd className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink/70">
                          {label}
                        </dd>
                      </div>
                    )
                  )}
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Act II — The line ═══ */}
      {narrative && (
        <section
          aria-hidden="true"
          className="grain-overlay mt-24 bg-forest-night py-28 sm:py-36"
        >
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <TextReveal
              as="p"
              text={narrative.poeticLine}
              className="font-display mx-auto max-w-4xl text-center text-3xl font-light italic leading-[1.25] text-cream sm:text-5xl"
              stagger={0.04}
            />
          </div>
        </section>
      )}

      {/* ═══ Act III — The story ═══ */}
      <section
        aria-label="The story"
        className={`${narrative ? "bg-forest-night pb-28 sm:pb-36" : "mt-24 bg-parchment"}`}
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-14 lg:flex-row lg:gap-24">
            {altImage && (
              <div className="lg:w-[42%]">
                <ParallaxImage
                  src={altImage}
                  alt={`${product.name} — in use`}
                  speed={0.08}
                  zoom
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="aspect-[3/4] w-full"
                />
              </div>
            )}
            <div className={`space-y-14 ${altImage ? "lg:w-[58%]" : "lg:max-w-3xl"} lg:pt-10`}>
              {(narrative?.story ?? [
                { title: "About this product", body: parsed.body },
              ]).map((chapter, i) => (
                <Reveal key={chapter.title} delay={i * 0.1}>
                  <p className={`eyebrow ${narrative ? "text-sage" : "text-forest"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h2
                    className={`font-display mt-4 text-3xl font-light leading-tight sm:text-4xl ${
                      narrative ? "text-cream" : "text-ink"
                    }`}
                  >
                    {chapter.title}
                  </h2>
                  <p
                    className={`prose-editorial mt-5 max-w-xl ${
                      narrative ? "text-cream/65" : "text-ink/65"
                    }`}
                  >
                    {chapter.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Act IV — The ritual ═══ */}
      <section aria-label="How to use" className="bg-parchment-deep py-24 sm:py-32">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="eyebrow text-forest">The ritual</p>
            <h2 className="font-display mt-5 text-3xl font-light text-ink sm:text-4xl">
              How it&rsquo;s done
            </h2>
          </Reveal>
          <Stagger
            className="mt-14 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.12}
          >
            {(narrative?.ritual ?? GENERIC_RITUAL).map((step, i) => (
              <StaggerItem key={step.title}>
                <p className="font-display text-5xl font-light text-clay/45">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-4 text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink/70">
                  {step.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ Act V — The fine print ═══ */}
      <section aria-label="Details" className="bg-parchment py-24 sm:py-32">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            {parsed.benefits.length > 0 && (
              <div>
                <Reveal>
                  <p className="eyebrow text-forest">Why it earns its place</p>
                </Reveal>
                <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                  {parsed.benefits.map((benefit, i) => (
                    <Reveal key={benefit} delay={i * 0.06}>
                      <li className="flex items-baseline gap-5 py-5">
                        <span className="font-display shrink-0 text-sm italic text-clay">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[1.0625rem] leading-relaxed text-ink/80">
                          {benefit}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <Reveal>
                <p className="eyebrow text-forest">Specifications</p>
              </Reveal>
              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                {[
                  ["Category", product.category],
                  [
                    "Available sizes",
                    product.variants?.map((v) => v.size).join("  ·  ") ||
                      product.weight,
                  ],
                  ...(narrative?.specs ?? []),
                  ["Composition", "100% organic — no synthetic chemicals"],
                  ["Shelf life", "24 months from date of packing"],
                ].map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline"
                  >
                    <dt className="w-44 shrink-0 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/65">
                      {key}
                    </dt>
                    <dd className="text-[1.0625rem] text-ink/85">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Act VI — Pairings ═══ */}
      {pairings.length > 0 && (
        <section aria-label="Pairs well with" className="bg-parchment pb-28">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <Reveal>
              <div className="hairline-t flex flex-wrap items-end justify-between gap-6 pt-14">
                <h2 className="font-display text-3xl font-light text-ink sm:text-4xl">
                  Pairs well with
                </h2>
                <Link
                  href="/products"
                  className="link-rule text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
                >
                  The whole collection
                </Link>
              </div>
            </Reveal>
            <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:w-2/3">
              {pairings.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
