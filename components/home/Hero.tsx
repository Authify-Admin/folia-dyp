"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { ArrowRight } from "lucide-react";
import { blurFor } from "@/lib/blur-data";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening shot. Layered parchment scene: monumental serif statement,
 * two overlapping photographs drifting at different depths, a single
 * path forward into the collection.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotionSafe();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Layers leave the frame at different speeds — the camera pulls up.
  const yType = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-18%"]);
  const yImageA = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "14%"]);
  const yImageB = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "30%"]);
  const fade = useTransform(scrollYProgress, [0.5, 1], [1, 0]);

  const line = (delay: number) => ({
    initial: reduced ? { y: "0%" } : { y: "112%" },
    animate: { y: "0%" },
    transition: { duration: 1.3, delay, ease: EASE },
  });

  return (
    <section
      ref={ref}
      aria-label="Folia — organic plant care"
      className="relative min-h-[100svh] overflow-hidden bg-parchment"
    >
      {/* Atmosphere: soft cream glow + faint vertical rules */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-48 h-[34rem] w-[34rem] rounded-full bg-cream/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-ink/5 lg:block"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1480px] flex-col px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:flex-row lg:items-center lg:px-12 lg:pb-0 lg:pt-0">
        {/* ——— The statement ——— */}
        <motion.div
          style={{ y: yType, opacity: fade }}
          className="relative z-10 lg:w-[58%]"
        >
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="eyebrow text-forest"
          >
            Folia — 100% organic plant care
          </motion.p>

          <h1 className="font-display mt-7 text-[17vw] font-light leading-[0.95] tracking-[-0.02em] text-ink sm:text-[11vw] lg:text-[7.2vw]">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span className="block" {...line(0.35)}>
                Soil first.
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <motion.span className="block" {...line(0.5)}>
                <em className="text-forest">The rest</em> follows.
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.95, ease: EASE }}
            className="prose-editorial mt-8 max-w-md text-ink/70"
          >
            Vermicompost, living fertilizers, potting mixes and boosters —
            made the slow way by people who have spent decades growing
            things, for the pots and balconies of modern India.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 1.15, ease: EASE }}
            className="mt-10"
          >
            <Link
              href="/products"
              className="link-rule group text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-ink"
            >
              Explore the collection
              <ArrowRight
                className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5"
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* ——— The photographs ——— */}
        <div className="relative mt-14 h-[68vw] sm:h-[58vw] lg:mt-0 lg:h-[100svh] lg:w-[42%]">
          {/* Primary: the pour — the LCP element. No opacity tween here:
              gating its paint behind a fade would defer LCP for nothing. */}
          <motion.div
            style={{ y: yImageA, opacity: fade }}
            initial={reduced ? false : { scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, delay: 0.55, ease: EASE }}
            className="absolute right-0 top-0 h-[88%] w-[72%] overflow-hidden lg:top-[8%] lg:h-[76%]"
          >
            <Image
              src="/products/potting-mix/1.jpeg"
              alt="Folia potting mix being poured into a ceramic pot"
              fill
              priority
              sizes="(max-width: 1024px) 72vw, 32vw"
              placeholder="blur"
              blurDataURL={blurFor("/products/potting-mix/1.jpeg")}
              className={reduced ? "object-cover" : "animate-slow-drift object-cover"}
            />
          </motion.div>

          {/* Secondary: the still life, overlapping at depth */}
          <motion.div
            style={{ y: yImageB, opacity: fade }}
            initial={reduced ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.8, ease: EASE }}
            className="absolute bottom-0 left-0 h-[52%] w-[44%] overflow-hidden border-[6px] border-parchment shadow-2xl lg:bottom-[6%] lg:h-[38%] lg:w-[40%]"
          >
            <Image
              src="/products/perlite/2.jpeg"
              alt="Folia perlite beside a bare-rooted palm and trowel"
              fill
              priority
              sizes="(max-width: 1024px) 44vw, 18vw"
              placeholder="blur"
              blurDataURL={blurFor("/products/perlite/2.jpeg")}
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.6 }}
        style={{ opacity: fade }}
        className="absolute bottom-7 left-5 hidden items-center gap-3 sm:left-8 sm:flex lg:left-12"
        aria-hidden="true"
      >
        <span className="block h-10 w-px bg-ink/30">
          <span className="block h-4 w-px animate-cue-drop bg-ink" />
        </span>
        <span className="eyebrow text-ink/65">Scroll</span>
      </motion.div>
    </section>
  );
}
