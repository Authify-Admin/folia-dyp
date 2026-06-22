import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { GUARANTEES } from "@/lib/policies";
import { Illustration } from "@/components/illustrations/Illustration";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * The risk-free band — four specific, illustrated promises, each deep-linking
 * to the policy that stands behind it. Specificity is the point: "Easy 14-Day
 * Returns", not "easy returns".
 */
export function Guarantees({ heading }: { heading?: string }) {
  return (
    <section aria-label="Why it's risk-free" className="bg-parchment">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        {heading && (
          <p className="eyebrow mb-10 text-forest">{heading}</p>
        )}
        <Stagger
          className="grid grid-cols-1 divide-y divide-ink/12 border-y border-ink/12 sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0"
          stagger={0.1}
        >
          {GUARANTEES.map((g, i) => (
            <StaggerItem key={g.label}>
              <Link
                href={g.href}
                className="group flex h-full flex-col px-2 py-10 sm:px-8 sm:py-12"
              >
                <Illustration
                  name={g.illustration}
                  className="h-12 w-12 text-forest transition-transform duration-500 group-hover:-translate-y-0.5"
                />
                <h3 className="font-display mt-6 flex items-start gap-1.5 text-xl font-medium leading-snug text-ink">
                  {g.label}
                  <ArrowUpRight
                    className="mt-1 h-3.5 w-3.5 shrink-0 text-ink/30 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-forest"
                    strokeWidth={2}
                  />
                </h3>
                <p className="mt-2.5 max-w-xs text-[0.9375rem] leading-relaxed text-ink/70">
                  {g.detail}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
