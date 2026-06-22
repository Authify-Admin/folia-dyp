import { Star } from "lucide-react";

/**
 * A fractional star rating. Renders five hairline stars with a clipped
 * clay-filled overlay sized to `value`/5, so 4.7 shows as four-and-most-of-one.
 */
export function Stars({
  value,
  className = "h-4 w-4",
}: {
  value: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <span className="relative inline-flex shrink-0" aria-hidden="true">
      <span className="flex text-ink/20">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={className} strokeWidth={1.5} />
        ))}
      </span>
      <span
        className="absolute inset-0 flex overflow-hidden text-clay"
        style={{ width: `${pct}%` }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`${className} shrink-0`}
            strokeWidth={1.5}
            fill="currentColor"
          />
        ))}
      </span>
    </span>
  );
}
