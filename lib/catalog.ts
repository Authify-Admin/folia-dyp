/**
 * The Folia atelier catalogue — narrative art direction for each product.
 *
 * Firestore remains the single source of truth for price, stock, variants
 * and the seeded marketing copy. This module layers the *cinematic* content
 * on top: poetic openings, story chapters, usage rituals and per-page accents,
 * keyed by the product's image-folder slug.
 *
 * All claims are drawn from the seeded product copy (scripts/seed-products.ts)
 * — nothing here invents new product facts.
 */
import type { Product } from "@/lib/types";

export interface RitualStep {
  title: string;
  body: string;
}

export interface StoryChapter {
  title: string;
  body: string;
}

export interface ProductNarrative {
  slug: string;
  /** Display ordinal within the collection, e.g. "No. 01" */
  ordinal: string;
  /** One cinematic sentence that opens the product page. */
  poeticLine: string;
  /** Editorial chapters revealed on scroll. */
  story: StoryChapter[];
  /** The usage ritual — replaces the generic how-to-use. */
  ritual: RitualStep[];
  /** Extra spec rows appended to the details list. */
  specs: [string, string][];
  /** Companion product slugs ("Pairs with"). */
  pairings: string[];
}

export const NARRATIVES: Record<string, ProductNarrative> = {
  vermicompost: {
    slug: "vermicompost",
    ordinal: "No. 01",
    poeticLine: "The patient work of earthworms, finished by time.",
    story: [
      {
        title: "Grown, not manufactured",
        body: "Vermicompost is not made so much as it is tended. Earthworms work through organic matter slowly, leaving behind castings dense with plant-available nutrition and alive with beneficial microbes. We let the process take the time it takes — the result is odourless, clean to handle, and gentle enough to use every season.",
      },
      {
        title: "Soil that drinks deeper",
        body: "Tired, compacted soil loses its ability to hold water and breathe. Worked into a pot or bed, vermicompost rebuilds that structure from the inside out — improving water retention, waking the microbial web, and feeding roots slowly and steadily without ever burning them. It is the safest all-purpose start we know.",
      },
    ],
    ritual: [
      { title: "Loosen", body: "Gently open the topsoil around the base of the plant with your fingers or a hand fork." },
      { title: "Top-dress", body: "Spread a thin, even layer over the root zone — a little goes further than you think." },
      { title: "Water in", body: "Water slowly and thoroughly so the castings settle into the soil and reach the roots." },
      { title: "Repeat each season", body: "Gentle enough for every season — re-apply as part of your regular care rhythm." },
    ],
    specs: [
      ["Form", "Fine, odourless castings"],
      ["Best for", "Indoor foliage, vegetables, herbs & flowering plants"],
    ],
    pairings: ["potting-mix", "neem-cake"],
  },

  "neem-cake": {
    slug: "neem-cake",
    ordinal: "No. 02",
    poeticLine: "One amendment, two duties: feed the soil, stand guard over it.",
    story: [
      {
        title: "The tree that protects",
        body: "Neem has been the Indian garden's quiet guardian for generations. After the oil is pressed from the seed, what remains — the de-oiled cake — carries both nourishment and the tree's natural defensive compounds. We grind it fine so it works into soil evenly and breaks down at the right pace.",
      },
      {
        title: "Defence below the surface",
        body: "As it decomposes, neem cake releases slow nitrogen, NPK and micronutrients for steady growth — while its natural compounds deter nematodes, grubs and soil-borne pests around the roots. It even improves the efficiency of the other fertilizers you use. A staple for pots, lawns, raised beds and kitchen gardens.",
      },
    ],
    ritual: [
      { title: "Measure", body: "Use a small handful per pot, more for beds — neem works in modest, regular doses." },
      { title: "Work it in", body: "Mix lightly into the top few centimetres of soil, where roots and pests meet." },
      { title: "Water well", body: "Moisture begins the slow breakdown that releases nutrition and protection together." },
      { title: "Renew monthly", body: "Re-apply every 3–4 weeks through the growing season to keep the guard up." },
    ],
    specs: [
      ["Form", "De-oiled neem seed cake, powdered"],
      ["Note", "Non-edible · for garden use"],
    ],
    pairings: ["vermicompost", "bio-npk-granules"],
  },

  "bio-npk-granules": {
    slug: "bio-npk-granules",
    ordinal: "No. 03",
    poeticLine: "Fertility you don't force — you cultivate.",
    story: [
      {
        title: "Living nutrition",
        body: "Most fertilizers deliver chemistry. Bio NPK Granules deliver biology: live nitrogen-fixing and phosphate-solubilising bacteria, carried in a balanced organic granule. Instead of force-feeding plants, the colony settles in and rebuilds the soil's own capacity to feed them.",
      },
      {
        title: "Steady hands, better blooms",
        body: "The granules release slowly, the bacteria unlock nutrients that were already in your soil, and the plant receives steady, plant-available nutrition week after week. Flowering improves. Fruiting improves. And the garden's whole ecosystem stays safe — easy to broadcast, impossible to overdo.",
      },
    ],
    ritual: [
      { title: "Broadcast", body: "Scatter granules evenly over the soil surface, out to the edge of the foliage." },
      { title: "Rake lightly", body: "Work them just under the surface so the bacteria reach the root zone." },
      { title: "Water in", body: "A thorough watering settles the granules and wakes the living culture." },
      { title: "Feed fortnightly", body: "Repeat every 2–4 weeks through active growth for steady vigour." },
    ],
    specs: [
      ["Form", "Bio-organic slow-release granules"],
      ["Contains", "Live N-fixing & P-solubilising bacteria"],
    ],
    pairings: ["rock-phosphate", "vermicompost"],
  },

  "organic-cow-manure": {
    slug: "organic-cow-manure",
    ordinal: "No. 04",
    poeticLine: "The oldest amendment in the book — cured until it's ready.",
    story: [
      {
        title: "Time-tested, properly finished",
        body: "Every gardener's first fertilizer, done right. Our cow manure is fully decomposed and sun-dried before it ever reaches a bag — weed-free, lightly scented, completely cured. All of the goodness, none of the mess.",
      },
      {
        title: "The base of living soil",
        body: "Rich in organic matter and humus, it loosens heavy soil, feeds the microbial web and provides gentle, all-round nutrition for vegetables, flowers and foliage alike. If a garden is built on anything, it is built on this.",
      },
    ],
    ritual: [
      { title: "Blend", body: "Mix one part manure into three to four parts soil when potting or preparing beds." },
      { title: "Top-dress", body: "For established plants, spread a layer over the root zone and work in gently." },
      { title: "Water deeply", body: "Moisture carries the humus down into the soil profile where roots feed." },
      { title: "Refresh each season", body: "Renew at the start of every growing season as the foundation feed." },
    ],
    specs: [
      ["Form", "Fully decomposed, sun-dried & weed-free"],
      ["Best for", "Vegetables, flowers & foliage — all-purpose"],
    ],
    pairings: ["potting-mix", "bio-npk-granules"],
  },

  "rock-phosphate": {
    slug: "rock-phosphate",
    ordinal: "No. 05",
    poeticLine: "Strength is built underground first.",
    story: [
      {
        title: "Mineral patience",
        body: "Rock phosphate is exactly what it sounds like — a natural mineral, ground for the garden, releasing phosphorus and calcium at geology's own unhurried pace. Mixed in at planting time, it keeps feeding for months, exactly when developing roots need it.",
      },
      {
        title: "Roots, then blooms",
        body: "Phosphorus drives the parts of the plant you don't see: strong root systems, sturdy early growth. What follows above ground is the part you do — abundant flowering and better fruit set, the foundation of a productive garden.",
      },
    ],
    ritual: [
      { title: "Mix at planting", body: "Blend into potting soil or the planting hole before the plant goes in." },
      { title: "Place near roots", body: "Phosphorus barely moves through soil — put it where roots will grow." },
      { title: "Water normally", body: "No drenching needed; the mineral releases steadily on its own." },
      { title: "Let it work", body: "One application keeps releasing for months — patience does the rest." },
    ],
    specs: [
      ["Form", "Natural mineral powder"],
      ["Releases", "Slow phosphorus & calcium, over months"],
    ],
    pairings: ["flower-booster", "organic-cow-manure"],
  },

  "potting-mix": {
    slug: "potting-mix",
    ordinal: "No. 06",
    poeticLine: "Fill the pot. Plant the plant. We did the rest already.",
    story: [
      {
        title: "A recipe, perfected",
        body: "A growing medium is a balance: air for the roots, water held just long enough, nutrition already in place. Our all-purpose mix blends cocopeat, compost and aeration boosters so that balance is right the moment you open the bag — no mixing, no guesswork.",
      },
      {
        title: "Light, airy, alive",
        body: "It drains freely yet holds the right amount of moisture, giving roots the open structure they love. Fill a container, plant, water — and watch it thrive. Perfect for indoor plants, container gardens and every repotting day.",
      },
    ],
    ritual: [
      { title: "Fill", body: "Fill your pot straight from the bag — the mix is ready as it is." },
      { title: "Plant", body: "Settle the plant at the same depth it grew before; firm the mix gently." },
      { title: "Water through", body: "Water until it runs from the drainage hole — the mix holds what's needed." },
      { title: "Top up", body: "Refresh the top layer at repotting time or once a season." },
    ],
    specs: [
      ["Blend", "Cocopeat, compost & aeration boosters"],
      ["Best for", "Indoor plants, containers & repotting"],
    ],
    pairings: ["perlite", "vermicompost"],
  },

  perlite: {
    slug: "perlite",
    ordinal: "No. 07",
    poeticLine: "Born in volcanoes. Employed in flowerpots.",
    story: [
      {
        title: "A mineral that breathes",
        body: "Perlite is volcanic glass, expanded by heat until it weighs almost nothing. Folded into a soil mix, those countless white pores do one job perfectly: they keep the structure open, so air and water both move the way roots need them to.",
      },
      {
        title: "Insurance against heavy soil",
        body: "Compaction and root rot end more houseplants than neglect does. Perlite prevents both — keeping mixes fluffy, drainage sharp and roots healthy. Essential for succulents, cacti, seed-starting and hydroponics, and a little goes a very long way.",
      },
    ],
    ritual: [
      { title: "Blend", body: "Mix one part perlite into three to four parts of any potting medium." },
      { title: "Adjust for succulents", body: "Go richer — up to one part in two — for cacti and succulents that demand sharp drainage." },
      { title: "Seed-starting", body: "Use a fine layer in seedling trays for an airy, damp-but-never-soggy bed." },
      { title: "Reuse", body: "Perlite doesn't break down — rinse and fold it into the next season's mix." },
    ],
    specs: [
      ["Form", "Expanded volcanic mineral, lightweight"],
      ["Best for", "Succulents, seed-starting & hydroponics"],
    ],
    pairings: ["potting-mix", "epsom-salt"],
  },

  "epsom-salt": {
    slug: "epsom-salt",
    ordinal: "No. 08",
    poeticLine: "When the green starts fading, this is the answer.",
    story: [
      {
        title: "Chemistry, kept simple",
        body: "Epsom salt is pure magnesium sulphate — and magnesium sits at the centre of every chlorophyll molecule. When leaves yellow between their veins, this is usually the missing piece. It dissolves instantly, so the correction starts with the very next watering.",
      },
      {
        title: "Deeper green, fuller growth",
        body: "Used as a foliar spray or soil drench, it deepens leaf colour, boosts chlorophyll and improves nutrient uptake. A long-time favourite for tomatoes, roses, peppers and houseplants showing tired, yellowing leaves — fast-acting and easy to use.",
      },
    ],
    ritual: [
      { title: "Dissolve", body: "Stir a teaspoon into a litre of water — it disappears completely in seconds." },
      { title: "Spray or drench", body: "Mist the foliage for fast uptake, or water into the soil for a slower feed." },
      { title: "Watch the leaves", body: "New growth comes in deeper green as magnesium reaches the chlorophyll." },
      { title: "Repeat monthly", body: "A monthly dose through the growing season keeps colour rich." },
    ],
    specs: [
      ["Form", "Pure magnesium sulphate crystals"],
      ["Use as", "Foliar spray or soil drench — dissolves instantly"],
    ],
    pairings: ["flower-booster", "perlite"],
  },

  "flower-booster": {
    slug: "flower-booster",
    ordinal: "No. 09",
    poeticLine: "For the weeks when the garden is meant to show off.",
    story: [
      {
        title: "Engineered for bloom",
        body: "When a plant turns from growing to flowering, its appetite changes — potassium becomes the currency. Flower Booster is a high-potassium formula built for exactly that turn: more buds set, bigger blooms opened, colour that holds on longer.",
      },
      {
        title: "Strong stems, long seasons",
        body: "It strengthens stems and flowering shoots so the show doesn't collapse under its own weight. Feed fortnightly through the blooming season — roses, hibiscus, adenium and seasonal flowers all answer it — and watch the garden burst into colour.",
      },
    ],
    ritual: [
      { title: "Time it", body: "Begin as buds first form — this is fuel for flowering, not foliage." },
      { title: "Feed the root zone", body: "Apply around the base and work lightly into the topsoil." },
      { title: "Water in", body: "A good watering carries potassium to the flowering shoots." },
      { title: "Every fortnight", body: "Repeat through the blooming season for colour that keeps coming." },
    ],
    specs: [
      ["Form", "High-potassium bloom formula"],
      ["Best for", "Roses, hibiscus, adenium & seasonal flowers"],
    ],
    pairings: ["rock-phosphate", "epsom-salt"],
  },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Split a stored product description into tagline / body / key benefits.
 * Convention (also used by admin-entered copy): first line is the tagline,
 * lines starting with "•" under a "Key benefits:" header are benefits.
 */
export function parseDescription(raw: string) {
  const lines = (raw || "").split("\n").map((l) => l.trim());
  const benefits = lines
    .filter((l) => l.startsWith("•"))
    .map((l) => l.replace(/^•\s*/, ""));
  const nonBenefit = lines.filter(
    (l) => l && !l.startsWith("•") && !/^key benefits:?$/i.test(l)
  );
  const tagline = nonBenefit[0] || "";
  const body = nonBenefit.slice(1).join("\n\n");
  return { tagline, body: body || tagline, benefits };
}

/** Derive the catalogue slug from a product's image path, falling back to a name slug. */
export function slugForProduct(product: Pick<Product, "name" | "image">): string {
  const match = product.image?.match(/^\/products\/([^/]+)\//);
  if (match) return match[1];
  return product.name
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function narrativeFor(
  product: Pick<Product, "name" | "image">
): ProductNarrative | undefined {
  return NARRATIVES[slugForProduct(product)];
}

/** Editorial framing for the three collection categories. */
export const CATEGORY_INTROS: Record<string, { line: string; slug: string }> = {
  "Organic Fertilizers": {
    line: "Nutrition the way soil understands it — slow, living, complete.",
    slug: "organic-fertilizers",
  },
  "Soil & Amendments": {
    line: "The ground everything else is built on.",
    slug: "soil-amendments",
  },
  "Plant Boosters": {
    line: "Precise answers for the moments that matter.",
    slug: "plant-boosters",
  },
};

/** Curated order for the homepage featured row. */
export const FEATURED_SLUGS = ["vermicompost", "potting-mix", "flower-booster"];
