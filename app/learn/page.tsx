import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GUIDES, GUIDE_CATEGORIES, type Guide } from "@/lib/guides";
import { Illustration } from "@/components/illustrations/Illustration";
import { PlantDoctor } from "@/components/PlantDoctor";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

export const metadata: Metadata = {
  title: "The Field Guide",
  description:
    "Folia's helping-hand-first learning hub — plain, generous guides to building living soil, decoding NPK, diagnosing your plant and gardening through the Indian year.",
};

const featured = GUIDES.find((g) => g.slug === "building-living-soil") ?? GUIDES[0];

export default function LearnPage() {
  return (
    <div className="bg-parchment">
      {/* ——— Masthead ——— */}
      <section className="relative overflow-hidden">
        <Illustration
          name="helping-hand"
          className="pointer-events-none absolute -right-10 top-20 h-72 w-72 text-forest/[0.07] sm:h-96 sm:w-96"
        />
        <div className="relative mx-auto max-w-[1480px] px-5 pb-16 pt-32 sm:px-8 sm:pt-40 lg:px-12">
          <Reveal y={16}>
            <p className="eyebrow text-forest">The Folia Field Guide</p>
          </Reveal>
          <TextReveal
            as="h1"
            text={"Learn the garden first.\nThe shopping can wait."}
            className="font-display mt-7 max-w-4xl text-4xl font-light leading-[1.05] tracking-[-0.015em] text-ink sm:text-6xl lg:text-[4.25rem]"
            stagger={0.05}
          />
          <Reveal delay={0.3}>
            <p className="prose-editorial mt-8 max-w-xl text-ink/70">
              We are a helping-hand brand before we are a shop. So here is the
              knowledge we have gathered over decades in the soil — given freely,
              in plain words, whether you buy a thing from us or not. Read on, and
              grow with a steadier hand.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ——— Start here (featured) ——— */}
      <section className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <Link
            href={`/learn/${featured.slug}`}
            className="group grid grid-cols-1 overflow-hidden border border-ink/12 bg-parchment-deep lg:grid-cols-[1fr_1.2fr]"
          >
            <div className="flex items-center justify-center bg-forest-night p-12 sm:p-16">
              <Illustration
                name={featured.heroIllustration}
                className="h-40 w-40 text-sage transition-transform duration-700 group-hover:scale-105 sm:h-52 sm:w-52"
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="eyebrow text-forest">Start here · {featured.readMinutes} min read</p>
              <h2 className="font-display mt-5 text-3xl font-light leading-tight text-ink sm:text-4xl">
                {featured.title}
              </h2>
              <p className="prose-editorial mt-4 max-w-md text-ink/70">{featured.dek}</p>
              <span className="link-rule mt-8 inline-flex text-[0.75rem] font-bold uppercase tracking-[0.2em] text-ink">
                Read the guide
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1.5"
                  strokeWidth={1.5}
                />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ——— The shelves of the library ——— */}
      <div className="mx-auto max-w-[1480px] px-5 pb-20 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        {GUIDE_CATEGORIES.map((category) => {
          const guides = GUIDES.filter(
            (g) => g.category === category && g.slug !== featured.slug
          );
          if (guides.length === 0) return null;
          return (
            <section key={category} aria-label={category} className="mt-16 first:mt-0">
              <Reveal>
                <h2 className="hairline-b font-display pb-5 text-2xl font-light text-ink">
                  {category}
                </h2>
              </Reveal>
              <Stagger
                className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                stagger={0.1}
              >
                {guides.map((g) => (
                  <StaggerItem key={g.slug}>
                    <GuideCard guide={g} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          );
        })}
      </div>

      {/* ——— The Plant Doctor ——— */}
      <PlantDoctor />

      {/* ——— Closing ——— */}
      <section className="bg-parchment py-24 text-center sm:py-28">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <p className="font-display text-3xl font-light leading-snug text-ink sm:text-4xl">
              Knowledge in hand?{" "}
              <em className="text-forest">Now let&rsquo;s get growing.</em>
            </p>
            <Link href="/products" className="btn-clay mt-9">
              Shop the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function GuideCard({ guide: g }: { guide: Guide }) {
  return (
    <Link href={`/learn/${g.slug}`} className="group block">
      <div className="flex aspect-[5/3] items-center justify-center overflow-hidden bg-parchment-deep">
        <Illustration
          name={g.heroIllustration}
          className="h-24 w-24 text-forest/70 transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <p className="eyebrow mt-5 text-ink/55">
        {g.category} · {g.readMinutes} min read
      </p>
      <h3 className="font-display mt-2.5 text-2xl font-light leading-snug text-ink transition-colors duration-300 group-hover:text-forest">
        {g.title}
      </h3>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink/65">{g.dek}</p>
    </Link>
  );
}
