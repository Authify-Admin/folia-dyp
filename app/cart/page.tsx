"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { blurFor } from "@/lib/blur-data";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Guarantees } from "@/components/Guarantees";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The full cart room — a considered review table for those who
 * prefer it to the drawer. Same state, same contracts.
 */
export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[88svh] flex-col items-center justify-center bg-parchment px-6 text-center">
        <Reveal>
          <p className="eyebrow text-forest">Your selection</p>
        </Reveal>
        <TextReveal
          as="h1"
          text={"Nothing here yet —\nthe garden can wait, but not forever."}
          className="font-display mt-7 max-w-2xl text-3xl font-light leading-[1.2] text-ink sm:text-5xl"
        />
        <Reveal delay={0.3}>
          <Link href="/products" className="btn-clay mt-12">
            Browse the collection
          </Link>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 pb-28 pt-32 sm:px-8 sm:pt-40 lg:px-12">
        <Reveal y={20}>
          <p className="eyebrow text-forest">Your selection</p>
        </Reveal>
        <TextReveal
          as="h1"
          text={`${getCartCount()} ${getCartCount() === 1 ? "thing" : "things"}, chosen well.`}
          className="font-display mt-6 text-4xl font-light leading-[1.05] tracking-[-0.015em] text-ink sm:text-6xl"
        />

        <div className="mt-16 flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* ——— The table ——— */}
          <div className="lg:w-[62%]">
            <div className="hairline-b hidden pb-3 sm:flex">
              <p className="eyebrow flex-1 text-ink/65">Item</p>
              <p className="eyebrow w-32 text-center text-ink/65">Quantity</p>
              <p className="eyebrow w-24 text-right text-ink/65">Total</p>
            </div>

            <AnimatePresence initial={false}>
              <ul>
                {cart.map((item) => (
                  <motion.li
                    key={`${item.id}-${item.weight}`}
                    layout
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="hairline-b flex flex-wrap items-center gap-5 py-7 sm:flex-nowrap"
                  >
                    <Link
                      href={`/products/${item.id}`}
                      className="relative block h-28 w-24 shrink-0 overflow-hidden bg-parchment-deep"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="96px"
                          placeholder={blurFor(item.image) ? "blur" : "empty"}
                          blurDataURL={blurFor(item.image)}
                          className="object-cover"
                        />
                      )}
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.id}`}
                        className="font-display block text-xl font-medium leading-snug text-ink"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/65">
                        {item.weight} · ₹{item.price.toFixed(0)} each
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id, item.weight)}
                        className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/65 transition-colors duration-300 hover:text-clay"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex w-32 items-center justify-center">
                      <div className="flex items-center border border-ink/20">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity - 1, item.weight)
                          }
                          aria-label={`Reduce quantity of ${item.name}`}
                          className="px-3 py-2 text-ink/70 transition-colors hover:text-ink"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold text-ink">
                          {item.cartQuantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.cartQuantity + 1, item.weight)
                          }
                          aria-label={`Increase quantity of ${item.name}`}
                          disabled={item.cartQuantity >= item.quantity}
                          className="px-3 py-2 text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>

                    <p className="w-24 text-right text-[1.0625rem] font-semibold text-ink">
                      ₹{(item.price * item.cartQuantity).toFixed(0)}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </AnimatePresence>

            <Link
              href="/products"
              className="link-rule group mt-10 inline-flex text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink/70 hover:text-ink"
            >
              Continue browsing
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>

          {/* ——— The reckoning ——— */}
          <div className="lg:w-[38%]">
            <div className="border border-ink/15 p-8 lg:sticky lg:top-28">
              <p className="eyebrow text-ink/65">Summary</p>
              <dl className="mt-6 space-y-4">
                <div className="flex justify-between text-[0.9375rem]">
                  <dt className="text-ink/70">Subtotal</dt>
                  <dd className="font-semibold text-ink">
                    ₹{getCartTotal().toFixed(0)}
                  </dd>
                </div>
                <div className="flex justify-between text-[0.9375rem]">
                  <dt className="text-ink/70">Shipping</dt>
                  <dd className="text-forest">On us</dd>
                </div>
                <div className="hairline-t flex justify-between pt-4">
                  <dt className="font-display text-xl text-ink">Total</dt>
                  <dd className="font-display text-2xl font-medium text-ink">
                    ₹{getCartTotal().toFixed(0)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-ink/65">
                Coupons can be applied at checkout. Taxes included.
              </p>
              <Link href="/checkout" className="btn-clay mt-7 w-full">
                Proceed to checkout
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="pb-24 sm:pb-28">
        <Guarantees heading="Risk-free, every order" />
      </div>
    </div>
  );
}
