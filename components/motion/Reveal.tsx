"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  /** Seconds to hold before entering. */
  delay?: number;
  /** Vertical travel in px. */
  y?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  /** Viewport margin for triggering, e.g. "-80px". */
  margin?: string;
}

/**
 * The house entrance: a weighted fade-rise, triggered in view.
 * One easing family across the whole site keeps motion feeling
 * like a single camera operator.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  duration = 1.1,
  once = true,
  className,
  margin = "-60px",
}: RevealProps) {
  const reduced = useReducedMotionSafe();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: margin as `${number}px` }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** Seconds between children. */
  stagger?: number;
  delay?: number;
  once?: boolean;
}

/** Parent that staggers any nested <StaggerItem>s. */
export function Stagger({
  children,
  className,
  stagger = 0.12,
  delay = 0,
  once = true,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduced = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 1.0, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
