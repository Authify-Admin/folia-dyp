"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

/**
 * Site-wide Plant Doctor banner — the brand's strongest differentiator, kept
 * in front of every visitor and funnelling into /contact. Sits above the
 * (fixed) navbar; it publishes its height to the `--ann-h` CSS variable so the
 * navbar can offset itself beneath it. Dismissible for the session.
 */
const BAR_HEIGHT = "2.25rem"; // matches h-9

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("pd-bar-dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--ann-h",
      dismissed ? "0px" : BAR_HEIGHT
    );
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[55] flex h-9 items-center justify-center bg-forest text-cream">
      <Link
        href="/contact"
        className="group inline-flex items-center gap-2 px-10 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em]"
      >
        <span className="hidden text-sage sm:inline">Free Plant Doctor —</span>
        Send a photo, expert reply within 24 hrs
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          strokeWidth={1.5}
        />
      </Link>
      <button
        type="button"
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("pd-bar-dismissed", "1");
        }}
        aria-label="Dismiss announcement"
        className="absolute right-3 flex h-6 w-6 items-center justify-center text-cream/60 transition-colors hover:text-cream"
      >
        <X className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}
