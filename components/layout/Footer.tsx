"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const SHOP_LINKS = [
  { name: "All products", href: "/products" },
  { name: "Organic Fertilizers", href: "/products?category=Organic%20Fertilizers" },
  { name: "Soil & Amendments", href: "/products?category=Soil%20%26%20Amendments" },
  { name: "Plant Boosters", href: "/products?category=Plant%20Boosters" },
];

const COMPANY_LINKS = [
  { name: "Our story", href: "/story" },
  { name: "Contact", href: "/contact" },
  { name: "Track order", href: "/track-order" },
];

const CARE_LINKS = [
  { name: "Terms of service", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const GOOGLE_FORM_URL =
        "https://docs.google.com/forms/d/e/1FAIpQLScCtlPaMlEMses0kf49suxIUGgzdoCdYEwgzNQBOeNXjUjD-w/formResponse";

      const googleFormData = new FormData();
      googleFormData.append("entry.1069349515", email);

      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        body: googleFormData,
        mode: "no-cors",
      });
    } catch (error) {
      console.error("Newsletter submission error:", error);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <footer className="grain-overlay relative bg-forest-night text-cream">
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        {/* Newsletter — the closing invitation */}
        <div className="flex flex-col gap-10 border-b border-cream/12 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-sage">Letters from the garden</p>
            <h2 className="font-display mt-5 text-3xl font-light leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
              Seasonal growing notes,
              <br />
              <em>nothing you&rsquo;ll want to unsubscribe from.</em>
            </h2>
          </div>

          <div className="w-full max-w-md">
            {submitted ? (
              <p className="border border-sage/40 px-6 py-5 text-sm text-sage">
                Welcome in. Your first letter arrives with the season.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex border-b border-cream/30 focus-within:border-cream">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent py-4 text-[0.9375rem] text-cream placeholder:text-cream/55 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Subscribe"
                  className="group flex items-center gap-2 pl-4 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-cream/70 transition-colors duration-300 hover:text-sage disabled:opacity-40"
                >
                  {isSubmitting ? "Sending" : "Subscribe"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4 sm:py-16">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" aria-label="Folia — home">
              <Image
                src="/logo.png"
                alt="Folia"
                width={110}
                height={38}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-5 max-w-[16rem] text-sm leading-relaxed text-cream/65">
              Organic plant care from people who have spent decades with their
              hands in the soil.
            </p>
          </div>

          {[
            { title: "Shop", links: SHOP_LINKS },
            { title: "Company", links: COMPANY_LINKS },
            { title: "Fine print", links: CARE_LINKS },
          ].map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow text-cream/60">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/65 transition-colors duration-300 hover:text-sage"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-cream/12 py-7 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Folia. All rights reserved.</p>
          <p className="eyebrow !text-[0.625rem] text-cream/55">
            Planting Simplified — Grown in India
          </p>
        </div>
      </div>
    </footer>
  );
}
