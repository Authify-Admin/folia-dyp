"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/contexts/CartContext";
import { useCartUI } from "@/contexts/CartUIContext";
import { blurFor } from "@/lib/blur-data";
import {
  firstAvailableVariant,
  priceFrom,
  productForCart,
  trackAddToCart,
} from "@/lib/cart-helpers";

interface ProductCardProps {
  product: Product;
  /** Hide the category line (e.g. when the section already states it). */
  hideCategory?: boolean;
  /** Tailwind aspect class for the plate. Defaults to aspect-[4/5]. */
  aspect?: string;
}

/**
 * A catalogue plate: photograph first, name and price in quiet confidence,
 * quick add without breaking the browsing rhythm.
 */
export function ProductCard({
  product,
  hideCategory = false,
  aspect = "aspect-[4/5]",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { openCart } = useCartUI();
  const [adding, setAdding] = useState(false);

  const primary = product.images?.[0] ?? product.image;
  const secondary = product.images?.[1];
  const variant = firstAvailableVariant(product);
  const soldOut = variant === null;
  const from = priceFrom(product);
  const hasRange =
    product.hasVariants && product.variants && product.variants.length > 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || adding) return;
    setAdding(true);
    addToCart(productForCart(product, variant), 1);
    trackAddToCart(product.id);
    // Let the press register, then present the drawer.
    setTimeout(() => {
      openCart();
      setAdding(false);
    }, 220);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block focus-visible:outline-offset-8"
    >
      {/* Plate */}
      <div className={`relative ${aspect} overflow-hidden bg-parchment-deep`}>
        {primary && (
          <Image
            src={primary}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={blurFor(primary) ? "blur" : "empty"}
            blurDataURL={blurFor(primary)}
            className={`object-cover transition-all duration-[1.2s] ease-out-expo group-hover:scale-[1.04] ${
              secondary ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {secondary && (
          <Image
            src={secondary}
            alt={`${product.name} — alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={blurFor(secondary) ? "blur" : "empty"}
            blurDataURL={blurFor(secondary)}
            className="object-cover opacity-0 transition-all duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-hover:opacity-100"
          />
        )}

        {soldOut ? (
          <span className="absolute bottom-4 left-4 bg-ink/80 px-4 py-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-parchment">
            Sold out
          </span>
        ) : (
          <button
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} (${variant.size}) to cart`}
            className={`absolute bottom-4 right-4 flex items-center gap-2 bg-parchment/95 px-4 py-2.5
              text-[0.625rem] font-bold uppercase tracking-[0.2em] text-ink shadow-md backdrop-blur-sm
              transition-all duration-500 ease-out-expo hover:bg-ink hover:text-parchment
              sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100
              ${adding ? "!bg-forest !text-parchment" : ""}`}
          >
            <Plus className="h-3 w-3" strokeWidth={2} />
            {adding ? "Added" : `Add · ${variant.size}`}
          </button>
        )}
      </div>

      {/* Caption */}
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display truncate text-[1.1875rem] font-medium leading-snug text-ink">
            {product.name}
          </h3>
          {!hideCategory && (
            <p className="eyebrow mt-1.5 !text-[0.5625rem] text-ink/65">
              {product.category}
            </p>
          )}
        </div>
        <p className="shrink-0 text-[0.9375rem] font-semibold text-ink">
          {hasRange && <span className="font-normal text-ink/65">from </span>}₹
          {from.toFixed(0)}
        </p>
      </div>
    </Link>
  );
}
