import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Illustration } from "@/components/illustrations/Illustration";
import {
  POLICY_FACTS as f,
  POLICY_NAV,
  type PolicyDoc,
} from "@/lib/policies";

const HERO_GLYPH: Record<string, string> = {
  shipping: "watering-can",
  returns: "helping-hand",
  privacy: "soil-layers",
  terms: "cycle",
};

/**
 * One editorial scaffold for every legal / policy page. Feeds entirely from
 * lib/policies.ts, so shipping, returns, privacy and terms stay consistent
 * with each other and with the rest of the storefront.
 */
export function PolicyPage({ doc }: { doc: PolicyDoc }) {
  const others = POLICY_NAV.filter((p) => p.slug !== doc.slug);

  return (
    <div className="bg-parchment">
      {/* ——— Masthead ——— */}
      <header className="hairline-b">
        <div className="mx-auto max-w-3xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
          <div className="flex items-start justify-between gap-8">
            <div>
              <Reveal y={16}>
                <p className="eyebrow text-forest">{doc.kicker}</p>
              </Reveal>
              <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
                {doc.title}
              </h1>
            </div>
            <Illustration
              name={HERO_GLYPH[doc.slug] ?? "sprout"}
              className="hidden h-24 w-24 shrink-0 text-forest/35 sm:block"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="prose-editorial mt-6 max-w-xl text-ink/70">{doc.dek}</p>
          </Reveal>
          <p className="eyebrow mt-8 !tracking-[0.2em] text-ink/50">
            Last updated {f.lastUpdated}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pb-28 sm:px-8">
        {/* ——— The lede ——— */}
        <Reveal>
          <p className="prose-editorial mt-14 text-ink/80">{doc.intro}</p>
        </Reveal>

        {/* ——— At a glance ——— */}
        <Reveal>
          <div className="mt-12 border border-forest/20 bg-forest/[0.04] p-7 sm:p-9">
            <p className="eyebrow text-forest">At a glance</p>
            <dl className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {doc.quickAnswers.map((qa) => (
                <div key={qa.q}>
                  <dt className="text-[0.9375rem] font-semibold text-ink">{qa.q}</dt>
                  <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink/70">
                    {qa.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        {/* ——— Contents ——— */}
        <nav aria-label="On this page" className="mt-14">
          <p className="eyebrow text-ink/50">On this page</p>
          <ol className="mt-5 grid grid-cols-1 gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="link-rule group inline-flex gap-3 text-[0.9375rem] text-ink/70 hover:text-ink"
                >
                  <span className="font-display text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ——— Sections ——— */}
        <div className="mt-12 space-y-12">
          {doc.sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="hairline-t scroll-mt-28 pt-10"
            >
              <Reveal>
                <h2 className="font-display flex items-baseline gap-4 text-2xl font-medium leading-snug text-ink">
                  <span className="text-sm font-light italic text-clay">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>
                {section.paragraphs?.map((p, j) => (
                  <p key={j} className="prose-editorial mt-4 text-ink/75">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="flex gap-3.5 text-[1.0625rem] leading-relaxed text-ink/75"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/60"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </section>
          ))}
        </div>

        {/* ——— Help block ——— */}
        <Reveal>
          <div className="mt-16 grain-overlay bg-forest-night px-7 py-10 text-cream sm:px-10">
            <p className="eyebrow text-sage">Still have a question?</p>
            <p className="font-display mt-4 text-2xl font-light leading-snug text-cream sm:text-3xl">
              A real gardener answers — usually {f.replyWindow}.
            </p>
            <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem]">
              <a href={f.emailHref} className="link-rule text-cream hover:text-sage">
                {f.email}
              </a>
              <a href={f.phoneHref} className="link-rule text-cream hover:text-sage">
                {f.phone}
              </a>
              <a
                href={f.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="link-rule text-cream hover:text-sage"
              >
                {f.instagram}
              </a>
            </div>
          </div>
        </Reveal>

        {/* ——— Cross-links ——— */}
        <nav aria-label="Other policies" className="hairline-t mt-14 pt-10">
          <p className="eyebrow text-ink/50">The rest of the fine print</p>
          <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/${p.slug}`}
                  className="group flex items-center justify-between gap-4 py-5"
                >
                  <span className="font-display text-xl font-light text-ink transition-colors group-hover:text-forest">
                    {p.title}
                  </span>
                  <ArrowRight
                    className="h-4 w-4 text-ink/40 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-forest"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
