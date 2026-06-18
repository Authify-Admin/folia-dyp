"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { useCart } from "@/contexts/CartContext";
import { useCartUI } from "@/contexts/CartUIContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";
import { useFocusTrap } from "@/lib/use-focus-trap";

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { name: "Shop", href: "/products" },
  { name: "Story", href: "/story" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { getCartCount } = useCart();
  const { openCart } = useCartUI();
  const { user, loading: authLoading, logout } = useAuth();
  const pathname = usePathname();
  const accountRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();
  const cartCount = getCartCount();
  const menuTrapRef = useFocusTrap<HTMLDivElement>(menuOpen, () =>
    setMenuOpen(false)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Lock scroll behind the full-screen menu.
  useEffect(() => {
    if (menuOpen) {
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
  }, [menuOpen]);

  // Close account dropdown on outside click.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-700",
          scrolled && !menuOpen
            ? "border-b border-ink/10 bg-parchment/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <nav
          aria-label="Main"
          className="relative mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 sm:h-[4.5rem] sm:px-8 lg:px-12"
        >
          {/* Left — desktop links / mobile menu button */}
          <div className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              className={cn(
                "group relative z-[90] -ml-1 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden",
                menuOpen ? "text-cream" : "text-ink"
              )}
            >
              <span
                className={cn(
                  "h-px w-5 bg-current transition-all duration-500",
                  menuOpen && "translate-y-[3px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "h-px w-5 bg-current transition-all duration-500",
                  menuOpen && "-translate-y-[3px] -rotate-45"
                )}
              />
            </button>

            <div className="hidden items-center gap-9 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "link-rule text-[0.75rem] font-bold uppercase tracking-[0.22em] transition-colors duration-300",
                    pathname === link.href ? "text-ink" : "text-ink/70 hover:text-ink"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center — wordmark */}
          <Link
            href="/"
            aria-label="Folia — home"
            className={cn(
              "absolute left-1/2 z-[90] -translate-x-1/2 transition-all duration-500",
              menuOpen && "brightness-0 invert"
            )}
          >
            <Image
              src="/logo.png"
              alt="Folia"
              width={104}
              height={36}
              priority
              className="h-7 w-auto sm:h-8"
            />
          </Link>

          {/* Right — account + cart */}
          <div className="flex flex-1 items-center justify-end gap-7">
            {/* Account (desktop) */}
            <div className="relative hidden lg:block" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="link-rule text-[0.75rem] font-bold uppercase tracking-[0.22em] text-ink/70 transition-colors duration-300 hover:text-ink"
              >
                {authLoading ? "·····" : user ? user.name.split(" ")[0] : "Account"}
              </button>

              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute right-0 top-full mt-4 w-56 border border-ink/12 bg-parchment shadow-xl"
                  >
                    <div className="flex flex-col divide-y divide-ink/8 py-1">
                      {user ? (
                        <>
                          <div className="px-5 py-3">
                            <p className="text-sm font-semibold text-ink">{user.name}</p>
                            <p className="truncate text-xs text-ink/65">{user.email}</p>
                          </div>
                          {[
                            { name: "My profile", href: "/profile" },
                            { name: "My orders", href: "/profile#orders" },
                            { name: "Track order", href: "/track-order" },
                          ].map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setAccountOpen(false)}
                              className="px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:bg-parchment-deep hover:text-ink"
                            >
                              {item.name}
                            </Link>
                          ))}
                          <button
                            onClick={() => {
                              logout();
                              setAccountOpen(false);
                            }}
                            className="px-5 py-3 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-clay-deep transition-colors hover:bg-parchment-deep"
                          >
                            Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/auth"
                            onClick={() => setAccountOpen(false)}
                            className="px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:bg-parchment-deep hover:text-ink"
                          >
                            Sign in / Register
                          </Link>
                          <Link
                            href="/track-order"
                            onClick={() => setAccountOpen(false)}
                            className="px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:bg-parchment-deep hover:text-ink"
                          >
                            Track order
                          </Link>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart — opens the drawer */}
            <button
              onClick={openCart}
              aria-label={`Open cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              className={cn(
                "link-rule relative z-[90] text-[0.75rem] font-bold uppercase tracking-[0.22em] transition-colors duration-500",
                menuOpen ? "text-cream" : "text-ink/70 hover:text-ink"
              )}
            >
              Cart
              <span
                className={cn(
                  "transition-colors duration-500",
                  menuOpen ? "text-sage" : "text-clay-deep"
                )}
              >
                ({cartCount})
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu — a dark interlude of its own */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuTrapRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="grain-overlay fixed inset-0 z-[60] flex flex-col bg-forest-night lg:hidden"
          >
            <div className="flex flex-1 flex-col justify-center px-8 pb-10 pt-24">
              <p className="eyebrow mb-8 text-cream/60">Menu</p>
              <nav aria-label="Mobile" className="flex flex-col gap-2">
                {[...NAV_LINKS, { name: "Track order", href: "/track-order" }, user ? { name: "My profile", href: "/profile" } : { name: "Sign in", href: "/auth" }].map(
                  (link, i) => (
                    <motion.div
                      key={link.name}
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.15 + i * 0.07, ease: EASE }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="font-display block py-2 text-[2.75rem] font-light leading-tight text-cream transition-colors duration-300 hover:text-sage"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  )
                )}
              </nav>

              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-12 border-t border-cream/15 pt-6"
              >
                <p className="eyebrow text-cream/60">Folia — Planting Simplified</p>
                {user && (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-sage"
                  >
                    Sign out
                  </button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
