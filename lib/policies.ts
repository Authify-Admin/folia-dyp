/**
 * Folia — the single source of truth for every commerce / legal fact.
 *
 * Every policy page (shipping, returns, privacy, terms), the product page's
 * risk-free band, the homepage guarantees and the footer all read from here.
 * Change a fact once, and it stays consistent everywhere — which is exactly
 * what an ad reviewer (and a careful customer) checks for.
 */

export const POLICY_FACTS = {
  brand: "Folia",
  legalEntity: "My Aangan Eco Pvt Ltd",
  legacyBrand: "Amruth Organic Fertilizers",
  legacyDesc: "one of Karnataka's established organic fertilizer manufacturers",
  tagline: "Planting Simplified",
  country: "India",
  foundedYear: "2025",

  // — How to reach a human —
  email: "support@myfolia.in",
  emailHref: "mailto:support@myfolia.in",
  phone: "+91 90086 27070",
  phoneHref: "tel:+919008627070",
  instagram: "@my_folia",
  instagramHref: "https://www.instagram.com/my_folia/",
  supportHours: "Monday to Saturday, 10am – 6pm IST",
  replyWindow: "within 1–2 business days",

  // — Shipping —
  freeShipping: true,
  shipsTo: "everywhere in India",
  shipsInternationally: false,
  dispatchWindow: "1–2 business days",
  deliveryMetro: "3–5 business days",
  deliveryRest: "5–7 business days",
  deliveryOverall: "3–7 business days",

  // — Payment —
  codAvailable: true,
  paymentMethods:
    "UPI, credit & debit cards, net banking and popular wallets (securely via Razorpay), or Cash on Delivery",

  // — Returns & refunds —
  returnWindowDays: 14,
  freeReversePickup: true,
  refundWindow: "5–7 business days",
  refundDestination: "the original payment method",
  codRefundMethod: "UPI or bank transfer",

  // — Product —
  organic: "100% organic — no synthetic chemicals",
  shelfLife: "24 months from the date of packing",

  // — Housekeeping —
  lastUpdated: "19 June 2026",
} as const;

/**
 * The risk-free promises — shown as a band on product pages and a strip on
 * the homepage. Each `illustration` key resolves through the illustration
 * registry; each `href` deep-links to the policy that backs the claim up.
 */
export interface Guarantee {
  label: string;
  detail: string;
  illustration: string;
  href: string;
}

export const GUARANTEES: Guarantee[] = [
  {
    label: "Free Shipping, Nationwide",
    detail: "On every order, anywhere in India. No minimum, no surprises at checkout.",
    illustration: "watering-can",
    href: "/shipping",
  },
  {
    label: "Easy 14-Day Returns",
    detail: "Changed your mind or it arrived wrong? We send a courier to your door and refund you in full.",
    illustration: "helping-hand",
    href: "/returns",
  },
  {
    label: "100% Organic, Lab-Tested",
    detail: "Cured fully, tested honestly, exactly what the label says — nothing padded or rushed.",
    illustration: "sprout",
    href: "/learn/building-living-soil",
  },
  {
    label: "Secure Checkout & COD",
    detail: "Pay by UPI, card, net banking or wallet via Razorpay — or simply Cash on Delivery.",
    illustration: "soil-layers",
    href: "/terms",
  },
];

/** The compact assurances shown under the buy button. Kept specific. */
export const PRODUCT_ASSURANCES: { label: string; href: string }[] = [
  { label: "Free shipping", href: "/shipping" },
  { label: "Ships in 1–2 days", href: "/shipping" },
  { label: "Easy 14-day returns", href: "/returns" },
  { label: "Cash on delivery", href: "/terms" },
];

/* ------------------------------------------------------------------ */
/*  The four policy documents — detailed, plain-language, consistent. */
/* ------------------------------------------------------------------ */

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface PolicyQuickAnswer {
  q: string;
  a: string;
}

export interface PolicyDoc {
  slug: string;
  /** Eyebrow shown above the title. */
  kicker: string;
  title: string;
  dek: string;
  intro: string;
  /** The reader-friendly summary box at the top. */
  quickAnswers: PolicyQuickAnswer[];
  sections: PolicySection[];
}

const f = POLICY_FACTS;

export const POLICIES: Record<string, PolicyDoc> = {
  /* ─────────────────────────── SHIPPING ─────────────────────────── */
  shipping: {
    slug: "shipping",
    kicker: "Getting it to you",
    title: "Shipping Policy",
    dek: "Free delivery, everywhere in India — and exactly what to expect from order to doorstep.",
    intro:
      "We want the wait to be the only thing between you and your garden — so shipping is free on every order, and we keep you in the loop the whole way. Here is precisely how it works.",
    quickAnswers: [
      { q: "How much is shipping?", a: "Free, on every order, anywhere in India. No minimum." },
      { q: "When does it ship?", a: `We dispatch within ${f.dispatchWindow} of your order.` },
      { q: "How long to arrive?", a: `Usually ${f.deliveryOverall}, depending on your pincode.` },
      { q: "Can I track it?", a: "Yes — from the Track Order page with your order number and email." },
    ],
    sections: [
      {
        id: "cost",
        title: "What shipping costs",
        paragraphs: [
          "Shipping is completely free on every order, with no minimum cart value and no charge added at checkout. The price you see on the product page is the price you pay.",
          "We ship across India only — we do not currently deliver outside the country.",
        ],
      },
      {
        id: "dispatch",
        title: "When your order leaves us",
        paragraphs: [
          `Orders are packed and dispatched within ${f.dispatchWindow} (Monday to Saturday, excluding public holidays). We don't sit on orders — most leave the same or next working day.`,
          "If anything is going to take longer — a rare stock delay, a festival rush — we write to you rather than leave you wondering.",
        ],
      },
      {
        id: "timelines",
        title: "How long delivery takes",
        paragraphs: [
          "Delivery time depends on how far your pincode is from our facility. As a guide:",
        ],
        bullets: [
          `Metro cities: about ${f.deliveryMetro} after dispatch.`,
          `Rest of India: about ${f.deliveryRest} after dispatch.`,
          "Remote or hard-to-reach pincodes may take a little longer; your courier's tracking will always show the latest estimate.",
        ],
      },
      {
        id: "tracking",
        title: "Following your order",
        paragraphs: [
          "Once your order is confirmed you'll receive an order number by email. You can check its status any time from the Track Order page using that number and the email you ordered with — no account needed.",
          "When the parcel is handed to the courier, the tracking details travel with it.",
        ],
      },
      {
        id: "payment",
        title: "Paying for your order",
        paragraphs: [
          `You can pay online by ${f.paymentMethods}. Online payments are handled securely by Razorpay — your card and banking details go straight to them and are never stored by us.`,
          "Prefer to pay when it arrives? Cash on Delivery is available across most of India.",
        ],
      },
      {
        id: "problems",
        title: "If something goes wrong in transit",
        paragraphs: [
          `Parcels are well-packed for the journey, but couriers are couriers. If your order arrives damaged, opened, or doesn't turn up in the expected window, write to us at ${f.email} or call ${f.phone} — we'll chase the courier and make it right, including a free replacement or full refund where needed.`,
          "See our Returns & Refunds policy for exactly how that works.",
        ],
      },
    ],
  },

  /* ─────────────────────────── RETURNS ──────────────────────────── */
  returns: {
    slug: "returns",
    kicker: "A purchase you can't lose on",
    title: "Returns & Refunds",
    dek: "Easy 14-day returns, free reverse pickup, and a full refund — so trying Folia is genuinely risk-free.",
    intro:
      "Plant care should feel like a helping hand, never a gamble. If a product isn't right for you — for any reason — you have 14 days, we collect it from your door at no cost, and we refund you in full. Here's the whole arrangement, in plain words.",
    quickAnswers: [
      { q: "How long do I have?", a: `${f.returnWindowDays} days from the day your order is delivered.` },
      { q: "Who pays return shipping?", a: "We do. We arrange a free courier pickup from your address." },
      { q: "Will I get my money back?", a: `Yes — a full refund to ${f.refundDestination}, no restocking fee.` },
      { q: "How soon is the refund?", a: `Within ${f.refundWindow} of the return reaching us.` },
    ],
    sections: [
      {
        id: "window",
        title: "Your 14-day window",
        paragraphs: [
          `You can request a return within ${f.returnWindowDays} days of your order being delivered. That's a real, no-questions-for-the-headline window: changed your mind, the plant didn't need it, you ordered the wrong size — all fine.`,
          "We just ask that the product is in a reasonable, resalable state for change-of-mind returns: largely unused, with its packaging intact. For anything damaged, defective, or wrongly sent, condition doesn't matter at all — see below.",
        ],
      },
      {
        id: "how",
        title: "How to start a return",
        paragraphs: ["It takes a minute:"],
        bullets: [
          "Open your order from your Profile (or the Track Order page) and choose 'Request a return'.",
          "Tell us which item and why, and add a photo or two if it arrived damaged or wrong — it helps us fix it faster.",
          "We confirm by email and schedule a free courier pickup from your address. You don't pay for shipping either way.",
        ],
      },
      {
        id: "pickup",
        title: "Free reverse pickup",
        paragraphs: [
          "We arrange the return courier and we cover its cost — on every approved return, change-of-mind included. Just keep the item ready in its packaging; our courier partner collects it from your door.",
          "If a pickup isn't serviceable at your pincode, we'll arrange a simple prepaid alternative and reimburse any postage you front.",
        ],
      },
      {
        id: "refunds",
        title: "Refunds — how and when",
        paragraphs: [
          `Once your return reaches us and passes a quick check, we issue a full refund — the entire amount you paid, with no restocking fee. Refunds go back to ${f.refundDestination} within ${f.refundWindow}.`,
          `Paid by Cash on Delivery? We refund by ${f.codRefundMethod} — we'll collect those details when you raise the return.`,
          "Prefer a replacement or a different product instead of money back? Just say so, and we'll sort it.",
        ],
      },
      {
        id: "damaged",
        title: "Damaged, defective or wrong items",
        paragraphs: [
          "If your order arrives damaged, leaking, defective, or simply isn't what you ordered, that's on us. There's no condition requirement and no time spent arguing: send us a photo within the return window and we'll replace it free or refund you in full, including any shipping you paid.",
        ],
      },
      {
        id: "exceptions",
        title: "The few things we can't take back",
        paragraphs: [
          "To keep every other customer safe, we can't accept returns of a product that has been opened and largely used up, or one that has been contaminated, mixed with soil, or stored in a way that makes it unsafe to handle — unless it was faulty to begin with.",
          `If you're unsure whether your situation qualifies, just ask. Write to ${f.email} or call ${f.phone} — we lean towards saying yes.`,
        ],
      },
    ],
  },

  /* ─────────────────────────── PRIVACY ──────────────────────────── */
  privacy: {
    slug: "privacy",
    kicker: "The fine print, in plain words",
    title: "Privacy Policy",
    dek: "We collect little, we never sell it, and you can have it removed whenever you like.",
    intro:
      "A privacy policy is usually where brands hide things. Ours is where we tell you the truth: what we collect, why, who we share it with, and how to get it back or gone. If anything here is unclear, write to us — a person will answer.",
    quickAnswers: [
      { q: "Do you sell my data?", a: "Never. Not to advertisers, not to anyone." },
      { q: "What do you keep?", a: "Only what an order needs — name, contact, address, order history." },
      { q: "Who else sees it?", a: "Only the services that run the shop (payments, hosting), nobody else." },
      { q: "Can I be deleted?", a: `Yes — email ${f.email} and we'll remove your data.` },
    ],
    sections: [
      {
        id: "what",
        title: "What we collect",
        paragraphs: [
          "We only collect what's needed to take an order and look after you afterwards:",
        ],
        bullets: [
          "Your name, email, phone number and shipping address — to deliver your order and confirm it.",
          "Your order and return history — so you (and we) can track what you bought and help when something's off.",
          "Messages you send us through the contact form, email, or social — kept so we can carry on the conversation.",
          "If you raise a return, any photos you attach.",
          "Basic, anonymous usage information (which pages and products are popular) so we can improve the site. This isn't tied to your name.",
        ],
      },
      {
        id: "why",
        title: "Why we collect it",
        paragraphs: [
          "To deliver your orders, confirm them by email, answer your questions, process returns and refunds, and understand which products people actually find useful. That's the entire list. We don't build advertising profiles, and we don't try to.",
        ],
      },
      {
        id: "never",
        title: "What we never do",
        paragraphs: [
          "We don't sell your data. We don't share it with advertisers or data brokers. We don't send marketing you didn't ask for — our newsletter is strictly opt-in, every email has an unsubscribe link, and the moment you leave, you're gone from the list.",
        ],
      },
      {
        id: "who",
        title: "Who helps us run the shop",
        paragraphs: [
          "Running a store takes a few trusted services. We share only the minimum each one needs to do its job:",
        ],
        bullets: [
          "Razorpay processes online payments — your card and banking details go to them, not to us, and we never see or store them.",
          "Google Firebase stores orders and accounts securely.",
          "Google Forms collects our contact and newsletter submissions.",
          "Our courier partners receive your name, address and phone number purely to deliver your parcel.",
          "Each of these providers has its own privacy practices and security standards.",
        ],
      },
      {
        id: "cookies",
        title: "Cookies & your browser",
        paragraphs: [
          "We use a small number of cookies and similar storage to keep your cart and login working and to count anonymous visits. We don't use them to follow you around the internet. You can clear or block cookies in your browser settings; the shop will still work, though your cart may not remember you.",
        ],
      },
      {
        id: "security",
        title: "How we keep it safe",
        paragraphs: [
          "Your data is stored with established providers over encrypted connections, and access is limited to the people who genuinely need it to fulfil orders and help you. No system is perfect, but we treat your information the way we'd want ours treated.",
        ],
      },
      {
        id: "choices",
        title: "Your choices & rights",
        paragraphs: [
          `You can ask for a copy of what we hold, ask us to correct it, or ask us to delete your account and data altogether. Write to ${f.email} or use the Contact page and we'll take care of it — usually ${f.replyWindow}.`,
          "Children's note: Folia is a gardening shop meant for adults; we don't knowingly collect data from children.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        paragraphs: [
          `If we change how we handle data, we'll update this page and the date below. The current version was last updated on ${f.lastUpdated}.`,
        ],
      },
    ],
  },

  /* ──────────────────────────── TERMS ───────────────────────────── */
  terms: {
    slug: "terms",
    kicker: "The fine print, in plain words",
    title: "Terms of Service",
    dek: "The simple agreement between you and Folia — honest products, fair pricing, and a real human if anything's unclear.",
    intro:
      "These terms exist so both sides know where they stand. We've kept them short and in plain language, the same way we keep everything else. By placing an order with Folia, you're agreeing to what's below.",
    quickAnswers: [
      { q: "Who are you buying from?", a: `${f.brand}, a brand of ${f.legalEntity}, operating in ${f.country}.` },
      { q: "What's the price I pay?", a: "The price shown at the moment you order, in ₹, taxes included." },
      { q: "How can I pay?", a: "Online via Razorpay, or Cash on Delivery." },
      { q: "What if there's an issue?", a: `Email ${f.email} or call ${f.phone} — a person answers.` },
    ],
    sections: [
      {
        id: "agreement",
        title: "The agreement",
        paragraphs: [
          `By placing an order with ${f.brand} you agree to these terms. ${f.brand} is a brand of ${f.legalEntity}, backed by the legacy of ${f.legacyBrand} — ${f.legacyDesc} — and sells organic plant-care products within ${f.country}. We may update these terms from time to time; the version in force is the one published here when you order.`,
        ],
      },
      {
        id: "products",
        title: "Products & pricing",
        paragraphs: [
          "Every product is described as honestly as we know how, and priced in Indian Rupees with taxes included. Pack sizes and prices are shown on each product page, and the price at the moment you place your order is the price you pay.",
          "We photograph and describe our products carefully, but natural materials vary a little batch to batch — colour and texture may differ slightly from the images, which is normal for organic goods. Shipping within India is free.",
        ],
      },
      {
        id: "orders",
        title: "Orders & payment",
        paragraphs: [
          `Orders may be paid online (${f.paymentMethods}) or by Cash on Delivery. Online payments are processed securely by Razorpay; we never see or store your card details.`,
          "An order is confirmed once you receive your order number and confirmation email. Very occasionally we may need to decline or refund an order we can't fulfil — for instance if an item has just sold out or a pricing error slips through — in which case you're refunded in full, promptly.",
        ],
      },
      {
        id: "delivery",
        title: "Delivery",
        paragraphs: [
          `We dispatch within ${f.dispatchWindow} and deliver across ${f.country}, usually within ${f.deliveryOverall} depending on your pincode. You can follow any order from the Track Order page using your order number and email. Full details are in our Shipping Policy.`,
        ],
      },
      {
        id: "returns",
        title: "Returns & refunds",
        paragraphs: [
          `If something arrives damaged or simply isn't right, you have ${f.returnWindowDays} days from delivery to raise a return. We arrange a free pickup and refund you in full. The complete terms are set out in our Returns & Refunds policy, which forms part of these terms.`,
        ],
      },
      {
        id: "use",
        title: "Sensible use of our products",
        paragraphs: [
          "Our products are soil amendments and plant nutrition, intended for gardening use only. Neem cake is non-edible. Please use each product as described on its page, keep all products away from children and pets, and store them dry.",
          "Because we can't control how, where, or on what a product is ultimately used, our responsibility is limited to the product itself — we'll always replace or refund a faulty product, but we can't be liable for plant outcomes that depend on watering, light, climate and care beyond our reach.",
        ],
      },
      {
        id: "accounts",
        title: "Your account",
        paragraphs: [
          "If you create an account, keep your login details to yourself — you're responsible for activity under your account. Tell us straight away if you think someone else has access, and we'll help you secure it.",
        ],
      },
      {
        id: "ip",
        title: "Our words and pictures",
        paragraphs: [
          "The Folia name, logo, writing, photography and illustrations on this site are ours. You're welcome to share links and recommend us — please don't copy our content wholesale or pass it off as your own.",
        ],
      },
      {
        id: "law",
        title: "Governing law & questions",
        paragraphs: [
          `These terms are governed by the laws of ${f.country}. Anything unclear, or a dispute you'd like sorted — write to ${f.email} or call ${f.phone} before anything else. A person will answer, and we'll almost always find a fair fix together.`,
        ],
      },
    ],
  },
};

/** Cross-links shown at the foot of every policy page, in this order. */
export const POLICY_NAV: { slug: string; title: string }[] = [
  { slug: "shipping", title: "Shipping Policy" },
  { slug: "returns", title: "Returns & Refunds" },
  { slug: "privacy", title: "Privacy Policy" },
  { slug: "terms", title: "Terms of Service" },
];
