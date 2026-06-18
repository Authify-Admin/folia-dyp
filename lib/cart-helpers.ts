import type { Product, ProductVariant } from "@/lib/types";

/**
 * Resolve the variant a quick-add should use: the first in-stock size.
 * Returns null when the product is fully out of stock.
 */
export function firstAvailableVariant(product: Product): ProductVariant | null {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    return product.variants.find((v) => v.quantity > 0) ?? null;
  }
  return product.quantity > 0
    ? { size: product.weight, price: product.price, quantity: product.quantity }
    : null;
}

/**
 * Build the cart payload for a chosen variant, preserving the load-bearing
 * contract: ProductVariant.size → Product.weight → OrderItem.size.
 * (CartContext keys line items by id + weight.)
 */
export function productForCart(
  product: Product,
  variant: ProductVariant
): Product {
  return {
    ...product,
    price: variant.price,
    weight: variant.size,
    quantity: variant.quantity,
  };
}

/** Lowest live price, for "From ₹—" labels. */
export function priceFrom(product: Product): number {
  if (product.hasVariants && product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return product.price;
}

/** Fire-and-forget add-to-cart analytics (existing API contract). */
export function trackAddToCart(productId: string) {
  fetch("/api/analytics/track-add-to-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  }).catch((error) => console.error("Error tracking add to cart:", error));
}
