"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { blurFor } from "@/lib/blur-data";

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** Tailwind classes for the frame (must establish size/aspect). */
  className?: string;
  /** Parallax travel as a fraction of frame height (0 disables). */
  speed?: number;
  /** Also scale image from `zoomFrom` → 1 while entering. */
  zoom?: boolean;
  zoomFrom?: number;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
}

/**
 * A photograph in a fixed frame; the print drifts slowly as you scroll
 * past — the depth of a camera move, never a slide carousel.
 * Image is oversized slightly so the drift never reveals edges.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.08,
  zoom = false,
  zoomFrom = 1.24,
  sizes = "100vw",
  priority = false,
  imgClassName,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const travel = reduced ? 0 : speed * 100;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${travel}%`, `${travel}%`]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5],
    [reduced || !zoom ? 1 + Math.abs(travel) / 100 + 0.02 : zoomFrom, 1 + Math.abs(travel) / 100 + 0.02]
  );

  const blur = blurFor(src);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y, scale }} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder={blur ? "blur" : "empty"}
          blurDataURL={blur}
          className={`object-cover ${imgClassName ?? ""}`}
        />
      </motion.div>
    </div>
  );
}
