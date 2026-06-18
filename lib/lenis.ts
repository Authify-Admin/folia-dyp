/**
 * Shared handle to the active Lenis smooth-scroll instance.
 * The CartDrawer (and any future overlay) uses this to halt page scroll
 * while it is open, without reaching through window globals.
 */
import type Lenis from "@studio-freight/lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis(): Lenis | null {
  return instance;
}
