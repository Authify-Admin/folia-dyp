"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCartUI } from "@/contexts/CartUIContext";
import { getLenis } from "@/lib/lenis";
import { blurFor } from "@/lib/blur-data";
import { useFocusTrap } from "@/lib/use-focus-trap";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The cart as a quiet side room: slides in from the right on parchment,
 * accessible from anywhere, never interrupts the browsing rhythm.
 */
export function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } =
    useCart();
  const { cartOpen, closeCart } = useCartUI();
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotionSafe();
  const trapRef = useFocusTrap<HTMLElement>(cartOpen, closeCart);

  // Halt page scroll (and Lenis) while the drawer is open.
  useEffect(() => {
    if (cartOpen) {
      getLenis()?.stop();
      document.body.style.overflow = "hidden";
    } else {
      getLenis()?.start();
      document.body.style.overflow = "";
    }
    return () => {
      getLenis()?.start();
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  // Close on route change and on Escape.
  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  const goToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Scrim */}
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.aside
            ref={trapRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-[80] flex h-[100dvh] w-full max-w-md flex-col bg-parchment shadow-2xl"
            initial={reduced ? { opacity: 0 } : { x: "100%" }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: "100%" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Header */}
            <div className="hairline-b flex items-center justify-between px-7 py-6">
              <p className="eyebrow text-ink/70">
                Your selection{" "}
                {getCartCount() > 0 && (
                  <span className="text-clay-deep">— {getCartCount()}</span>
                )}
              </p>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-1 text-ink/70 transition-colors duration-300 hover:text-ink"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            {cart.length === 0 ? (
              /* Empty room */
              <div className="flex flex-1 flex-col items-center justify-center px-10 text-center">
                <p className="font-display text-3xl font-light leading-snug text-ink">
                  Nothing here yet —<br />
                  <em className="text-forest">the garden can wait,</em>
                  <br />
                  but not forever.
                </p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="btn-ghost-ink mt-10"
                >
                  Browse the collection
                </Link>
              </div>
            ) : (
              <>
                {/* Items */}
                <div
                  data-lenis-prevent
                  className="flex-1 overflow-y-auto px-7 py-2"
                >
                  <ul className="divide-y divide-ink/10">
                    {cart.map((item) => (
                      <li
                        key={`${item.id}-${item.weight}`}
                        className="flex gap-5 py-6"
                      >
                        <Link
                          href={`/products/${item.id}`}
                          onClick={closeCart}
                          className="relative block h-24 w-20 shrink-0 overflow-hidden bg-parchment-deep"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="80px"
                              placeholder={blurFor(item.image) ? "blur" : "empty"}
                              blurDataURL={blurFor(item.image)}
                              className="object-cover"
                            />
                          )}
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${item.id}`}
                                onClick={closeCart}
                                className="font-display block truncate text-[1.0625rem] font-medium leading-tight text-ink"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink/65">
                                {item.weight}
                              </p>
                            </div>
                            <p className="shrink-0 text-[0.9375rem] font-semibold text-ink">
                              ₹{(item.price * item.cartQuantity).toFixed(0)}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-ink/20">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.cartQuantity - 1,
                                    item.weight
                                  )
                                }
                                aria-label={`Reduce quantity of ${item.name}`}
                                className="px-3 py-1.5 text-ink/70 transition-colors hover:text-ink"
                              >
                                <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-ink">
                                {item.cartQuantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.cartQuantity + 1,
                                    item.weight
                                  )
                                }
                                aria-label={`Increase quantity of ${item.name}`}
                                className="px-3 py-1.5 text-ink/70 transition-colors hover:text-ink disabled:opacity-30"
                                disabled={item.cartQuantity >= item.quantity}
                              >
                                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id, item.weight)}
                              className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/65 transition-colors duration-300 hover:text-clay"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer */}
                <div className="hairline-t px-7 pb-7 pt-5">
                  <div className="flex items-baseline justify-between">
                    <p className="eyebrow text-ink/70">Subtotal</p>
                    <p className="font-display text-2xl font-medium text-ink">
                      ₹{getCartTotal().toFixed(0)}
                    </p>
                  </div>
                  <p className="mt-1.5 text-xs text-ink/65">
                    Shipping is on us. Taxes included.
                  </p>
                  <button onClick={goToCheckout} className="btn-clay mt-5 w-full">
                    Proceed to checkout
                  </button>
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="link-rule mx-auto mt-4 block w-fit text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/70 hover:text-ink"
                  >
                    Review full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
