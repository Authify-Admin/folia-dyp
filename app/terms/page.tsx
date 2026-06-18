import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

const SECTIONS = [
  {
    title: "The agreement",
    body: "By placing an order with Folia you agree to these terms. They exist so both sides know where they stand — we have kept them short and in plain language.",
  },
  {
    title: "Products & pricing",
    body: "All products are described honestly and priced in Indian Rupees, taxes included. Pack sizes and prices are shown on each product page; the price at the moment you place your order is the price you pay. Shipping within India is free.",
  },
  {
    title: "Orders & payment",
    body: "Orders may be paid online (card, UPI, net banking and wallets via Razorpay) or by cash on delivery. An order is confirmed once you receive your order number and confirmation email. We reserve the right to decline or refund an order we cannot fulfil — for example when stock has run out.",
  },
  {
    title: "Delivery",
    body: "We dispatch from our facility and deliver across India. Delivery times vary by pincode. You can follow any order from the Track Order page using your order number and email address.",
  },
  {
    title: "Returns",
    body: "If something arrives damaged or isn't right, raise a return request from your profile with photos within a reasonable time of delivery. Approved returns are refunded or replaced — whichever you prefer.",
  },
  {
    title: "Sensible use",
    body: "Our products are soil amendments and plant nutrition, intended for gardening use. Neem cake is non-edible. Keep all products away from children and pets, and store them dry.",
  },
  {
    title: "Questions",
    body: "Anything unclear, write to us through the Contact page — a person will answer.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-parchment">
      <div className="mx-auto max-w-3xl px-5 pb-28 pt-32 sm:px-8 sm:pt-40">
        <p className="eyebrow text-forest">The fine print</p>
        <h1 className="font-display mt-6 text-4xl font-light leading-[1.05] text-ink sm:text-5xl">
          Terms of service
        </h1>
        <p className="mt-4 text-sm text-ink/65">
          Plain language, as it should be.
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
