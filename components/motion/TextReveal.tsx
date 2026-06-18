"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { Fragment, useMemo, type ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

interface TextRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  duration?: number;
  once?: boolean;
}

/**
 * Cinematic display-type entrance: each word rises out of its own
 * clipping mask, like a line of type being set. Use "\n" in `text`
 * to force line breaks.
 *
 * The viewport observer lives on the heading itself (the words start
 * fully clipped, so observing them directly would never fire); the
 * words inherit the trigger through variant propagation.
 */
export function TextReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.05,
  duration = 1.1,
  once = true,
}: TextRevealProps) {
  const reduced = useReducedMotionSafe();
  const lines = text.split("\n");

  // motion.create() is NOT cached by framer-motion — memoize per tag or the
  // heading remounts (and re-animates) on every parent re-render.
  const MotionTag = useMemo(() => motion.create(Tag as any), [Tag]);

  if (reduced) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <Fragment key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      aria-label={text.replace(/\n/g, " ")}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {lines.map((line, lineIdx) => {
        const words = line.split(" ");
        return (
          <Fragment key={lineIdx}>
            {words.map((word, i) => (
              <span
                key={`${lineIdx}-${i}`}
                className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
                aria-hidden="true"
              >
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "115%" },
                    show: {
                      y: "0%",
                      transition: { duration, ease: EASE },
                    },
                  }}
                >
                  {word}
                </motion.span>
                {i < words.length - 1 && <span>&nbsp;</span>}
              </span>
            ))}
            {lineIdx < lines.length - 1 && <br aria-hidden="true" />}
          </Fragment>
        );
      })}
    </MotionTag>
  );
}
