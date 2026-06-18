/**
 * Server-side order pricing — the single source of truth for what an
 * order costs. Used by /api/razorpay (so the charged amount can never be
 * tampered with client-side) and /api/coupons/validate (same discount math).
 */
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { couponOperations } from './firestore';
import type { Coupon } from './types';

export interface PriceableItem {
  productId: string;
  /** Variant size (travels as Product.weight in the cart). */
  size?: string;
  quantity: number;
}

export class PricingError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

/** Identical discount math to the original coupon validation route. */
export function computeDiscount(coupon: Coupon, orderTotal: number): number {
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (orderTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }
  if (discountAmount > orderTotal) {
    discountAmount = orderTotal;
  }
  return parseFloat(discountAmount.toFixed(2));
}

/** Re-price the cart from live Firestore data; throws PricingError on bad input. */
export async function priceItems(items: PriceableItem[]): Promise<number> {
  if (!Array.isArray(items) || items.length === 0) {
    throw new PricingError('No items to price');
  }

  let subtotal = 0;
  for (const item of items) {
    if (!item.productId || !Number.isFinite(item.quantity) || item.quantity < 1) {
      throw new PricingError('Invalid order item');
    }

    const snap = await getDoc(doc(db, 'products', item.productId));
    if (!snap.exists()) {
      throw new PricingError('A product in your cart is no longer available');
    }
    const product = snap.data();

    let unitPrice: number;
    let available: number;
    if (product.hasVariants && Array.isArray(product.variants) && item.size) {
      const variant = product.variants.find((v: any) => v.size === item.size);
      if (!variant) {
        throw new PricingError(
          `Size ${item.size} is no longer available for ${product.name}`
        );
      }
      unitPrice = variant.price;
      available = variant.quantity;
    } else {
      unitPrice = product.price;
      available = product.quantity;
    }

    if (available < item.quantity) {
      throw new PricingError(
        `Only ${available} of ${product.name}${item.size ? ` (${item.size})` : ''} left in stock`
      );
    }

    subtotal += unitPrice * item.quantity;
  }

  return subtotal;
}

export interface PricedOrder {
  subtotal: number;
  discount: number;
  total: number;
  couponId?: string;
}

/** Full server-side order pricing: live prices + validated coupon. */
export async function priceOrder(
  items: PriceableItem[],
  couponCode?: string,
  customerEmail?: string
): Promise<PricedOrder> {
  const subtotal = await priceItems(items);

  let discount = 0;
  let couponId: string | undefined;
  if (couponCode) {
    // Authoritative coupon check at pay time — customerEmail is always known
    // here, so first-time-only coupons are properly enforced.
    const validation = await couponOperations.validate(couponCode, subtotal, customerEmail);
    if (!validation.valid || !validation.coupon) {
      throw new PricingError(validation.message || 'Invalid coupon code');
    }
    discount = computeDiscount(validation.coupon, subtotal);
    couponId = validation.coupon.id;
  }

  return {
    subtotal,
    discount,
    total: Math.max(0, subtotal - discount),
    couponId,
  };
}
