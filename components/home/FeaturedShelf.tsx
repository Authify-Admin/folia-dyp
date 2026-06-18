"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { productOperations } from "@/lib/firestore";
import type { Product } from "@/lib/types";
import { FEATURED_SLUGS, slugForProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * "From the shelves" — a short curated row of live products,
 * quick-addable without leaving the page.
 */
export function FeaturedShelf() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    productOperations
      .getAll()
      .then((all) => {
        if (cancelled) return;
        const bySlug = new Map(all.map((p) => [slugForProduct(p), p]));
        const curated = FEATURED_SLUGS.map((slug) => bySlug.get(slug)).filter(
          (p): p is Product => Boolean(p)
        );
        setProducts(curated.length > 0 ? curated : all.slice(0, 3));
      })
      .catch((error) => {
        console.error("Error loading featured products:", error);
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (products !== null && products.length === 0) return null;

  return (
    <section
      aria-label="Featured products"
      className="bg-parchment-deep py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-forest">From the shelves</p>
              <h2 className="font-display mt-5 text-3xl font-light leading-tight text-ink sm:text-4xl">
                Where most gardens begin
              </h2>
            </div>
            <Link
              href="/products"
              className="link-rule group text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
            >
              View all nine
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </Reveal>

        {products === null ? (
          /* Loading: quiet placeholder frames */
          <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} aria-hidden="true">
                <div className="aspect-[4/5] animate-pulse bg-ink/5" />
                <div className="mt-5 h-4 w-2/3 animate-pulse bg-ink/5" />
                <div className="mt-2 h-3 w-1/3 animate-pulse bg-ink/5" />
              </div>
            ))}
          </div>
        ) : (
          <Stagger className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3" stagger={0.14}>
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
