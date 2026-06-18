"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

/** The wrong door — kept poetic, pointed home. */
export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center bg-parchment px-6 text-center">
      <Reveal y={16}>
        <p className="font-display text-[7rem] font-light leading-none text-ink/10 sm:text-[11rem]">
          404
        </p>
      </Reveal>
      <TextReveal
        as="h1"
        text={"This page went to seed."}
        className="font-display -mt-6 text-3xl font-light leading-tight text-ink sm:-mt-10 sm:text-5xl"
        delay={0.2}
      />
      <Reveal delay={0.5}>
        <p className="prose-editorial mx-auto mt-6 max-w-md text-ink/70">
          Whatever grew here has been repotted, renamed, or returned to the
          compost. The collection, however, is exactly where it should be.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/products" className="btn-clay">
            Browse the collection
          </Link>
          <Link href="/" className="btn-ghost-ink">
            Go home
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
