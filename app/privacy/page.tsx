import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
};

const SECTIONS = [
  {
    title: "What we collect",
    body: "Your name, email, phone number and shipping address when you order or create an account; your order history; and messages you send us. If you raise a return, any photos you attach. That's the list.",
  },
  {
    title: "Why we collect it",
    body: "To deliver your orders, confirm them by email, answer your questions, process returns, and understand which products people actually find useful. Nothing else.",
  },
  {
    title: "What we never do",
    body: "We don't sell your data. We don't share it with advertisers. We don't send marketing you didn't ask for — the newsletter is opt-in and leaves when you do.",
  },
  {
    title: "Who helps us",
    body: "Payments are processed by Razorpay — your card and banking details go to them, not to us. Orders and accounts are stored with Google Firebase. Contact and newsletter forms are collected via Google Forms. Each of these providers has its own privacy practices.",
  },
  {
    title: "Your choices",
    body: "Want your account or data removed, or a copy of what we hold? Write to us through the Contact page and we'll take care of it.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
        <p className="eyebrow text-forest">The fine print</p>
        <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
          Privacy
        </h1>
        <p className="mt-4 text-sm text-ink/65">
          Short, because we keep little.
        </p>

        <div className="mt-14 space-y-10">
          {SECTIONS.map((section, i) => (
            <section key={section.title} className="hairline-t pt-8">
              <h2 className="font-display flex items-baseline gap-4 text-2xl font-medium text-ink">
                <span className="text-sm font-light italic text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <p className="prose-editorial mt-4 text-ink/70">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
