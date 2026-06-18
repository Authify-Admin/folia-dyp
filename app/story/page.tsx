"use client";

import Link from "next/link";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";

const PROMISES = [
  {
    numeral: "I",
    title: "Trust",
    body: "Every bag is exactly what its label says — cured fully, tested honestly, never padded or rushed. We built Folia to be the brand we ourselves would buy from without checking twice.",
  },
  {
    numeral: "II",
    title: "Service",
    body: "Free delivery to your door, easy returns when something isn't right, and people — not scripts — who answer when you write to us. A garden is patient with you; so are we.",
  },
  {
    numeral: "III",
    title: "Quality",
    body: "Small batches, slow processes, organic inputs. Quality in plant care isn't a finish — it's what's left when you refuse every shortcut between the soil and the bag.",
  },
];

/**
 * The manifesto: Folia's story told in chapters with cinematic pacing —
 * large type moments, atmospheric imagery, light and dark rooms.
 */
export default function StoryPage() {
  return (
    <div className="bg-parchment">
      {/* ═══ Opening title card ═══ */}
      <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-cream/70 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal y={16}>
            <p className="eyebrow text-forest">Our story</p>
          </Reveal>
          <TextReveal
            as="h1"
            text={"We were gardeners\nlong before\nwe were a brand."}
            className="font-display mt-8 text-[13vw] font-light leading-[1.0] tracking-[-0.02em] text-ink sm:text-[9vw] lg:text-[6.5vw]"
            stagger={0.06}
          />
          <Reveal delay={0.7}>
            <p className="prose-editorial mt-10 max-w-md text-ink/65">
              Folia exists because plant care became complicated,
              and soil never was. This is the long version of that sentence.
            </p>
          </Reveal>
        </div>

        <div
          className="absolute bottom-7 left-5 hidden items-center gap-3 sm:left-8 sm:flex lg:left-12"
          aria-hidden="true"
        >
          <span className="block h-10 w-px bg-ink/30">
            <span className="block h-4 w-px animate-cue-drop bg-ink" />
          </span>
          <span className="eyebrow text-ink/65">Begin</span>
        </div>
      </section>

      {/* ═══ Chapter I — The hands (dark room) ═══ */}
      <section aria-label="Chapter one" className="grain-overlay bg-forest-night">
        <div className="mx-auto max-w-[1480px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <div className="flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-24">
            <div className="lg:w-[45%]">
              <ParallaxImage
                src="/products/bio-npk-granules/2.jpeg"
                alt="A hand holding a Folia pouch amid dense green foliage"
                speed={0.09}
                zoom
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="aspect-[3/4] w-full"
              />
            </div>
            <div className="lg:w-[55%]">
              <Reveal>
                <p className="eyebrow text-sage">Chapter I — The hands</p>
              </Reveal>
              <TextReveal
                as="h2"
                text={"Decades with our\nhands in the soil."}
                className="font-display mt-7 text-4xl font-light leading-[1.08] text-cream sm:text-5xl lg:text-6xl"
                stagger={0.06}
              />
              <Reveal delay={0.25}>
                <div className="prose-editorial mt-8 max-w-xl space-y-6 text-cream/65">
                  <p>
                    Before there was a label, there were years of them —
                    seasons of composting, growing, failing, and learning what
                    soil actually wants. The people behind Folia have spent
                    multiple decades in this craft: in nurseries and kitchen
                    gardens, in fields and on balconies.
                  </p>
                  <p>
                    That much time teaches you one stubborn lesson:{" "}
                    <em className="text-cream">
                      there are no shortcuts underground.
                    </em>{" "}
                    Nutrition that arrives slowly stays. Structure that builds
                    naturally lasts. Everything we sell follows from that.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Chapter II — The brand (light room) ═══ */}
      <section aria-label="Chapter two" className="bg-parchment">
        <div className="mx-auto max-w-[1480px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <div className="lg:flex lg:gap-24">
            <div className="lg:w-1/2">
              <Reveal>
                <p className="eyebrow text-forest">Chapter II — The brand</p>
              </Reveal>
              <TextReveal
                as="h2"
                text={"Folia, founded 2025.\nYoung label, old wisdom."}
                className="font-display mt-7 text-4xl font-light leading-[1.08] text-ink sm:text-5xl"
                stagger={0.05}
              />
            </div>
            <div className="mt-10 lg:mt-2 lg:w-1/2">
              <Reveal delay={0.2}>
                <div className="prose-editorial max-w-xl space-y-6 text-ink/70">
                  <p>
                    Folia grew out of the Aanagan family — a name built on
                    the same ground we stand on. In 2025 we gave our plant-care
                    work its own roof: a brand dedicated to helping greens
                    thrive, naturally.
                  </p>
                  <p>
                    The promise on every pouch is two words long:{" "}
                    <em className="text-forest">Planting Simplified.</em>{" "}
                    Not simplified by cutting corners — simplified the way
                    decades of practice simplify anything: by knowing exactly
                    what matters, and leaving out the rest.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* The shelf, in numbers — set in hairlines */}
          <Stagger
            className="mt-24 grid grid-cols-1 divide-y divide-ink/12 border-y border-ink/12 sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            stagger={0.14}
          >
            {[
              ["Nine", "essentials in the collection — no filler products"],
              ["Three", "families: fertilizers, soil & amendments, boosters"],
              ["One", "standard: would we feed this to our own garden?"],
            ].map(([numeral, caption]) => (
              <StaggerItem key={numeral} className="px-2 py-10 sm:px-10 sm:py-14">
                <p className="font-display text-5xl font-light text-clay">{numeral}</p>
                <p className="mt-3 max-w-[16rem] text-[0.9375rem] leading-relaxed text-ink/70">
                  {caption}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ Chapter III — The craft (photograph interlude) ═══ */}
      <section aria-label="Chapter three" className="relative">
        <ParallaxImage
          src="/products/epsom-salt/1.jpeg"
          alt="A Folia pouch on a garden table among bougainvillea"
          speed={0.12}
          sizes="100vw"
          className="h-[70svh] w-full sm:h-[85svh]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1480px] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
            <Reveal>
              <p className="eyebrow text-cream/70">Chapter III — The craft</p>
              <p className="font-display mt-5 max-w-3xl text-3xl font-light leading-[1.2] text-parchment sm:text-5xl">
                Small batches. Full curing.{" "}
                <em>Nothing leaves before it&rsquo;s ready.</em>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ Chapter IV — The promise ═══ */}
      <section aria-label="Chapter four" className="bg-parchment-deep">
        <div className="mx-auto max-w-[1480px] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
          <Reveal>
            <p className="eyebrow text-forest">Chapter IV — The promise</p>
            <h2 className="font-display mt-7 max-w-3xl text-4xl font-light leading-[1.08] text-ink sm:text-5xl">
              What we stand on, in three words.
            </h2>
          </Reveal>

          <Stagger className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-3" stagger={0.15}>
            {PROMISES.map((promise) => (
              <StaggerItem key={promise.title}>
                <p className="font-display text-2xl font-light italic text-clay">
                  {promise.numeral}
                </p>
                <h3 className="font-display mt-4 text-3xl font-medium text-ink">
                  {promise.title}
                </h3>
                <p className="prose-editorial mt-4 max-w-sm text-ink/65">
                  {promise.body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══ Closing ═══ */}
      <section aria-label="Shop" className="bg-parchment py-28 text-center sm:py-36">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <TextReveal
            as="h2"
            text={"Now — let's grow something."}
            className="font-display text-4xl font-light leading-[1.05] tracking-[-0.015em] text-ink sm:text-6xl"
          />
          <Reveal delay={0.25}>
            <Link href="/products" className="btn-clay mt-12">
              Shop the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
