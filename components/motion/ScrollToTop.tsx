"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis } from "@/lib/lenis";

/**
 * Reset scroll to the top on every route change.
 *
 * Next resets the native scroll on navigation, but Lenis keeps its own
 * virtual `targetScroll` from the previous page — so once the new (taller)
 * page finishes laying out, Lenis animates back down to the old offset
 * (e.g. clicking a product low on the collection page lands you low on the
 * product page). Forcing Lenis to 0 — and the window as a fallback when
 * Lenis is disabled (reduced motion) — keeps every page opening at the top.
 *
 * Only the pathname is watched, not search params, so the products
 * category filter (which uses router.replace with scroll:false) is untouched.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = getLenis();
    if (lenis) {
      // `force` overrides a stopped instance (e.g. if a drawer paused it);
      // `immediate` jumps without animating.
      lenis.scrollTo(0, { immediate: true, force: true });
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
