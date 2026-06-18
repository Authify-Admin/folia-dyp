"use client";

import { useEffect, useState } from "react";

/**
 * Hydration-safe prefers-reduced-motion.
 *
 * framer-motion's useReducedMotion reads the media query on the first
 * client render, which differs from the server-rendered markup (always
 * "no preference") and triggers hydration errors for users with reduced
 * motion enabled. This hook returns false on the server AND on the first
 * client render, then settles to the real preference immediately after
 * mount — so server and client markup always match.
 */
export function useReducedMotionSafe(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
