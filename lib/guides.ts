// Folia Field Guide — educational content for the learning hub.
// "Planting Simplified." Helping-hand-first: teach the gardener, then (maybe) sell.
// Pure data. No imports. A rendering page consumes these exports.

export interface GuideStep {
  title: string;
  body: string;
}

export interface GuideCallout {
  label: string; // short kicker, e.g. "Gardener's note" or "Avoid this"
  body: string;
}

export interface GuideSection {
  heading: string;
  body: string; // 1-3 short paragraphs separated by "\n\n"
  illustration?: string; // optional, must be an allowed illustration key
  steps?: GuideStep[]; // optional ordered steps
  callout?: GuideCallout; // optional aside
  productSlugs?: string[]; // optional "what you'll need"
}

export interface Guide {
  slug: string; // kebab-case url slug
  category: string; // "Foundations" | "How-To" | "Diagnosis" | "Seasons"
  title: string;
  dek: string; // one-sentence subtitle
  readMinutes: number; // realistic 4-9
  heroIllustration: string; // allowed illustration key
  intro: string; // 2-3 sentence warm lede
  sections: GuideSection[]; // 4-6 per guide
  relatedSlugs: string[]; // 2-3 other guide slugs
  productSlugs?: string[]; // products featured across the guide
}

export const GUIDES: Guide[] = [
  {
    slug: "building-living-soil",
    category: "Foundations",
    title: "Start Here: Building Living Soil",
    dek: "Healthy plants are not grown — they are hosted. It all begins in the soil.",
    readMinutes: 8,
    heroIllustration: "soil-layers",
    intro:
      "Before you buy a single plant or fret over a single yellow leaf, spend five minutes here. Almost every garden problem — weak growth, sulking roots, blooms that never come — traces back to the soil, and almost every garden joy starts there too. This is the one guide we would hand to every new gardener first.",
    sections: [
      {
        heading: "What 'living soil' actually means",
        body:
          "Reach into a healthy garden bed and squeeze a handful. It should feel like a moist chocolate cake — dark, crumbly, holding together but breaking apart easily, and faintly sweet-smelling like rain on dry earth. That smell is the giveaway. It means the soil is alive.\n\nLiving soil is not just ground-up rock. It is a crowded, busy city of earthworms, fungi and billions of bacteria, all quietly turning fallen leaves and old roots into food your plants can drink up. When we say Folia is an organic brand, this is what we mean: we feed that underground city, and the city feeds your plant. You are never really feeding the plant directly — you are feeding the soil that feeds the plant.",
        illustration: "microbes",
        callout: {
          label: "Gardener's note",
          body:
            "Chemical fertilisers can give a quick green flush, but used alone they slowly starve that underground city, leaving you with tired, lifeless dirt that needs more and more to do less and less. Organic feeding builds the opposite: soil that gets richer every year.",
        },
      },
      {
        heading: "Two jobs your soil must do",
        body:
          "Good soil has to do two very different things at once, and beginners often fix one while forgetting the other.\n\nThe first job is structure — how the soil holds air and water. Roots breathe; they need pockets of air as much as they need moisture. Soil that is too dense drowns roots; soil that is too loose dries out in an afternoon. The second job is nutrition — the actual food. You can have perfectly fluffy soil that is starving, or rich soil packed so tight nothing can root into it. A real living mix gets both right.",
        illustration: "roots",
      },
      {
        heading: "Your three workhorse ingredients",
        body:
          "You do not need a shelf of products to start. Three organic staples cover most of what a home garden needs, and they each pull a different weight.\n\nVermicompost is our gentle, odourless all-rounder — pure earthworm castings that feed lightly and dramatically improve how soil holds together and holds water. Organic cow manure, fully cured and weed-free, is your bulk base feed: the rich, all-round foundation you build a bed or a big pot on. And a ready potting mix gives container gardeners that light, airy, well-draining body straight from the bag, so balcony and terrace pots do not pack down into brick.",
        illustration: "soil-layers",
        productSlugs: ["vermicompost", "organic-cow-manure", "potting-mix"],
      },
      {
        heading: "Build your base: a simple 5-step sequence",
        body:
          "Whether you are filling a terrace pot or mending a tired bed, the order is the same. Take it slow — this is the foundation everything else stands on.",
        illustration: "helping-hand",
        steps: [
          {
            title: "Start with a living base",
            body:
              "For a container, begin with a ready potting mix so you have a light, draining body. For a garden bed, loosen the top hand-span of existing soil with a fork so air and water can move through it again.",
          },
          {
            title: "Fold in cured manure",
            body:
              "Mix in fully cured organic cow manure as your bulk feed — roughly one part manure to four parts soil or mix. Because it is properly cured and weed-free, it will not burn roots or sprout weeds the way fresh manure does.",
          },
          {
            title: "Enrich with vermicompost",
            body:
              "Work a generous handful or two of vermicompost through the top portion. This is the gentle, microbe-rich layer roots will explore first, and it quietly improves water retention so you water less often.",
          },
          {
            title: "Check the texture",
            body:
              "Wet a handful and squeeze. It should clump, then crumble apart at a touch. If it stays in a tight muddy ball, it is too dense — open it up (see the note below). If it falls apart bone-dry, it needs more organic matter.",
          },
          {
            title: "Rest, then plant",
            body:
              "Water it in well and let the mix settle and 'wake up' for a few days if you can. The microbes need a moment to get to work. Then plant — into soil that is already alive and waiting.",
          },
        ],
        callout: {
          label: "Avoid this",
          body:
            "If your mix feels heavy and dense, do not just add more compost — that holds even more water. Open it up with a drainage aid like perlite instead. Structure and nutrition are two different fixes.",
        },
        productSlugs: ["potting-mix", "organic-cow-manure", "vermicompost", "perlite"],
      },
      {
        heading: "What to expect (and how to keep it going)",
        body:
          "Living soil rewards patience, not panic. In the first few weeks you are growing the soil as much as the plant; strong top growth often comes a little later, once roots have spread into all that good structure. That is normal and it is a good sign.\n\nThe lovely part is that this compounds. Top up with a little vermicompost or manure each season rather than starting over, and your soil gets better every single year instead of running down. From here, two guides take you further: learn what the nutrients actually do, and learn the calm, fear-free way to feed.",
        illustration: "cycle",
      },
    ],
    relatedSlugs: ["npk-decoded", "feeding-without-fear"],
    productSlugs: ["vermicompost", "organic-cow-manure", "potting-mix", "perlite"],
  },

  {
    slug: "npk-decoded",
    category: "Foundations",
    title: "NPK, Decoded",
    dek: "Three letters explain almost everything on a fertiliser bag. Here is what they really mean.",
    readMinutes: 6,
    heroIllustration: "npk-meter",
    intro:
      "Every fertiliser label shouts three numbers at you — like 5-3-4 — and most people nod politely and have no idea what they mean. By the end of this short guide you will read any bag with confidence and know exactly which Folia product to reach for, and why.",
    sections: [
      {
        heading: "The three letters, in plain words",
        body:
          "N, P and K are the three nutrients plants need in the largest amounts. The numbers on a bag are simply how much of each it contains, always in that order: N first, P second, K third.\n\nThe easiest way to remember what they do is 'up, down, and all around'. N (Nitrogen) is for what is up — leaves and green, leafy growth. P (Phosphorus) is for what is down — roots, and the energy to set buds. K (Potassium) is the all-around tonic that helps flowers, fruit and overall toughness. Get a feel for those three and the whole bag suddenly makes sense.",
        illustration: "npk-meter",
      },
      {
        heading: "N is for leaves",
        body:
          "Nitrogen builds lush, green, leafy growth. If you are growing a leafy money plant, a monstera, curry leaf or any salad green, nitrogen is the engine of that fresh foliage.\n\nThe sign of too little is a plant that looks pale, thin and leggy, with the oldest, lowest leaves yellowing first as the plant robs them to feed new growth. The sign of too much is all leaf and no flower — a big bushy plant that simply refuses to bloom. Gentle, steady organic sources like vermicompost give nitrogen without that overdose risk.",
        illustration: "leaf-diagnosis",
        productSlugs: ["vermicompost"],
      },
      {
        heading: "P is for roots and buds",
        body:
          "Phosphorus works underground and out of sight. It builds strong root systems and gives the plant the energy to form flower buds and set fruit. A young plant putting down roots, or a hibiscus or tomato about to flower, is leaning hard on phosphorus.\n\nFor a slow, natural source, rock phosphate is a quiet hero: a natural mineral that releases phosphorus and calcium gently over a long time, building strong roots first and then feeding blooms and fruit. It is the opposite of a quick fix — and that is exactly the point.",
        illustration: "roots",
        productSlugs: ["rock-phosphate"],
        callout: {
          label: "Gardener's note",
          body:
            "Phosphorus moves slowly through soil, so mixing rock phosphate down near the root zone at planting time is far more effective than sprinkling it on top later.",
        },
      },
      {
        heading: "K is for flowers, fruit and resilience",
        body:
          "Potassium is the all-rounder. It is involved in nearly everything the plant does — moving water and sugars, standing up to heat and stress, and crucially, producing more and better flowers and fruit.\n\nWhen you want a rose, hibiscus or adenium to truly perform, potassium is the lever you pull. Our flower booster is a high-potassium bloom formula built for exactly that moment: more buds, and bigger, longer-lasting blooms. Reach for it when a plant is healthy and ready to flower, not as a cure for a struggling one.",
        illustration: "flower",
        productSlugs: ["flower-booster"],
      },
      {
        heading: "How to read a label like a gardener",
        body:
          "Now put it together. A high first number (lots of N) is a leaf-grower — good early, or for foliage plants. A high middle or last number leans toward roots, blooms and fruit — good as a plant matures and you want flowers.\n\nHere is the organic advantage. Synthetic feeds often carry big, punchy numbers because they dump everything at once, which can force soft growth and burn roots if you misjudge it. Our live bio NPK granules take a smarter route: they carry nitrogen-fixing and phosphate-solubilising bacteria that release food slowly, as the plant needs it, for steadier flowering and fruiting. Lower numbers on the bag, but working with the soil instead of shocking it.",
        illustration: "npk-meter",
        productSlugs: ["bio-npk-granules"],
        callout: {
          label: "Avoid this",
          body:
            "Do not chase the biggest numbers on the shelf. With organics, 'gentle and slow' out-performs 'strong and fast' over a season — you almost never need a forceful feed, and you can rarely overdo a slow-release one.",
        },
      },
    ],
    relatedSlugs: ["building-living-soil", "feeding-without-fear", "reading-your-plant"],
    productSlugs: ["vermicompost", "rock-phosphate", "flower-booster", "bio-npk-granules"],
  },

  {
    slug: "feeding-without-fear",
    category: "How-To",
    title: "From Bag to Bloom: Feeding Without Fear",
    dek: "How to actually apply your amendments — calmly, correctly, and without the worry.",
    readMinutes: 7,
    heroIllustration: "watering-can",
    intro:
      "You have the right products on the shelf and absolutely no idea how much to use or when. This is where most beginners freeze. Good news: organic feeding is forgiving by design, and once you learn four simple ways to apply it, the worry disappears for good.",
    sections: [
      {
        heading: "First, a deep breath: you can't easily overdo organics",
        body:
          "The biggest fear new gardeners carry is 'burning' their plant with too much fertiliser. With harsh chemical feeds that fear is fair. With gentle organic amendments, it is almost never an issue.\n\nVermicompost, cured manure and slow-release granules feed gradually and hold their nutrients in forms the soil releases only as plants ask for them. A little extra vermicompost will not scorch your roots. This single fact should change how you garden: you can stop measuring in fear and start feeding in rhythm.",
        illustration: "helping-hand",
        callout: {
          label: "Gardener's note",
          body:
            "More is not better, though — it is just wasteful. Generous and regular beats heavy and rare. Think of small, steady meals rather than one giant feast.",
        },
      },
      {
        heading: "The four ways to feed",
        body:
          "Almost everything you will ever do comes down to four simple techniques. Learn these and you can apply any amendment correctly.",
        illustration: "watering-can",
        steps: [
          {
            title: "Top-dress",
            body:
              "Sprinkle the feed onto the soil surface around the plant, then gently scratch it into the top inch and water. This is the everyday way to add vermicompost, neem cake or granules to an established plant without disturbing roots.",
          },
          {
            title: "Mix-in",
            body:
              "Blend the amendment through the soil before planting or at repotting time. This is how you add manure, rock phosphate or neem cake deep where roots will grow, so the food is waiting for them.",
          },
          {
            title: "Drench",
            body:
              "Dissolve or steep a feed in water and pour it at the base, soaking the root zone. A drench reaches roots fast and evenly — useful for a quick, gentle pick-me-up.",
          },
          {
            title: "Foliar spray",
            body:
              "Mist a dilute solution directly onto the leaves, which absorb certain nutrients quickly. Best in the cool of early morning or evening, never in harsh midday sun. This is the fastest fix for issues like magnesium-starved yellow leaves.",
          },
        ],
      },
      {
        heading: "How much, and how often",
        body:
          "Rules of thumb beat fussy measuring for a home garden. For a regular feed, a small handful of vermicompost top-dressed around a pot every three to four weeks through the growing season keeps most plants happy. Cured manure goes in as a bulk base when you build or refresh soil, not as a frequent sprinkle.\n\nSlow-release feeds like bio NPK granules and neem cake do the opposite of nagging — apply them and they keep working for weeks, so once every month or two is plenty. The whole point of organic feeding is that you do less, less often, while the soil does the steady work in between.",
        illustration: "calendar",
        productSlugs: ["vermicompost", "bio-npk-granules", "neem-cake"],
      },
      {
        heading: "Always water it in",
        body:
          "This is the small step beginners skip, and it matters. After you top-dress or mix in any dry feed, water the pot or bed well. Water is what carries nutrients down to the roots and activates the soil microbes that unlock organic food.\n\nDry feed sitting on dry soil does almost nothing — and worse, light granules can blow or wash away. A good soak after feeding tucks everything in where it belongs.",
        illustration: "watering-can",
        callout: {
          label: "Avoid this",
          body:
            "Do not feed a bone-dry, stressed plant. Water it first, let it recover for a few hours, then feed. Feeding into parched soil concentrates everything in one dry spot rather than spreading it gently.",
        },
      },
      {
        heading: "Finding your feeding rhythm",
        body:
          "Once it clicks, feeding stops being a chore and becomes a quiet rhythm you barely think about: a handful of vermicompost when you remember, granules at the start of a season, a bloom booster when a plant is gearing up to flower, a foliar spray the moment leaves tell you something is off.\n\nYour plants will tell you how you are doing — and learning to read those signals is the next skill worth having. When you want to tilt a plant toward flowering, reach for the high-potassium flower booster; the rest of the time, let your living soil carry the load.",
        illustration: "cycle",
        productSlugs: ["vermicompost", "flower-booster"],
      },
    ],
    relatedSlugs: ["building-living-soil", "npk-decoded", "reading-your-plant"],
    productSlugs: ["vermicompost", "bio-npk-granules", "neem-cake", "flower-booster"],
  },

  {
    slug: "reading-your-plant",
    category: "Diagnosis",
    title: "Reading Your Plant: A Leaf-by-Leaf Guide",
    dek: "Your plant can't talk, but its leaves are telling you everything. Here's how to listen.",
    readMinutes: 8,
    heroIllustration: "leaf-diagnosis",
    intro:
      "A drooping or discoloured plant feels like an emergency, but it is really just a message. Once you learn to read a few common signals, you stop guessing and panic-buying, and start fixing the actual problem. Keep this guide handy — it is the one you will come back to.",
    sections: [
      {
        heading: "How to read a leaf before you act",
        body:
          "Before reaching for anything, look closely and ask three questions. Which leaves are affected — the old lower ones or the fresh new growth? What exactly is the pattern — yellow between the veins, all-over pale, brown crispy edges? And what changed recently — more water, less light, a cold snap?\n\nThe answers narrow it down fast, because plants are wonderfully consistent. Yellowing that starts on old leaves usually means a nutrient the plant can move around internally; trouble on new growth points to a different cause entirely. Read first, then act.",
        illustration: "leaf-diagnosis",
        callout: {
          label: "Gardener's note",
          body:
            "Resist the urge to fix everything at once. Change one thing, then wait a week or two and watch. New leaves emerging healthy is your signal that the fix worked — old damaged leaves rarely recover, and that is normal.",
        },
      },
      {
        heading: "Yellowing between the veins (veins stay green)",
        body:
          "This is one of the most common and most misread symptoms. The leaf turns yellow but the veins themselves stay distinctly green, leaving a net-like or skeleton pattern. People assume the plant is hungry for everything and overfeed — but this is usually a single, specific shortfall.",
        illustration: "leaf-diagnosis",
        steps: [
          {
            title: "Likely cause",
            body:
              "A magnesium shortfall. Magnesium sits at the heart of the green pigment in leaves, so when it runs low the green fades but the veins, last to lose it, stay green.",
          },
          {
            title: "The fix",
            body:
              "Epsom salt is magnesium sulphate — the exact nutrient missing. As a foliar spray it works fast: dissolve a little in water and mist the leaves in the cool of morning. As a soil drench it works steadily. Within a week or two, new leaves should emerge a deeper, fuller green.",
          },
        ],
        productSlugs: ["epsom-salt"],
      },
      {
        heading: "Pale, thin, leggy growth (new leaves small and washed-out)",
        body:
          "Here the whole plant looks weak and stretched — long gaps between leaves, smaller leaves than it should have, and an overall pale, washed-out green. It is reaching and underfed rather than spotted or patterned.",
        illustration: "sprout",
        steps: [
          {
            title: "Likely cause",
            body:
              "A nitrogen shortfall, often paired with too little light. Nitrogen drives leafy green growth, so when it is short the plant pales and stretches, sacrificing its oldest leaves first.",
          },
          {
            title: "The fix",
            body:
              "Move the plant somewhere brighter if it is too dim, then feed gently. A top-dressing of vermicompost gives steady nitrogen without any risk of burning. For a longer, hands-off feed, bio NPK granules supply nitrogen slowly over weeks as the plant takes it up.",
          },
        ],
        productSlugs: ["vermicompost", "bio-npk-granules"],
      },
      {
        heading: "Few or weak blooms (lots of leaf, little flower)",
        body:
          "The plant looks healthy and green but simply will not flower, or throws a few small, short-lived blooms. A leafy, well-fed hibiscus, rose or adenium that refuses to perform almost always has the same story.",
        illustration: "flower",
        steps: [
          {
            title: "Likely cause",
            body:
              "Too much nitrogen and not enough phosphorus and potassium. Heavy nitrogen pushes the plant to keep making leaves instead of switching to flowers — it is too comfortable to bother blooming.",
          },
          {
            title: "The fix",
            body:
              "Ease off rich nitrogen feeds and shift toward bloom nutrients. Rock phosphate worked into the root zone builds the phosphorus base for bud formation, while a high-potassium flower booster is the direct nudge toward more and bigger blooms once the plant is healthy and ready.",
          },
        ],
        productSlugs: ["rock-phosphate", "flower-booster"],
      },
      {
        heading: "Tiny flies and soil pests",
        body:
          "Little flies drifting up when you water, or small grubs and pests in the soil, are common in damp pots — especially on a humid balcony or during the monsoon. They thrive in constantly wet, rich soil.",
        illustration: "neem-leaf",
        steps: [
          {
            title: "Likely cause",
            body:
              "Fungus gnats and soil-dwelling pests breeding in soil that stays too wet. Their larvae live in the top layer and feed on roots and organic matter.",
          },
          {
            title: "The fix",
            body:
              "Let the top of the soil dry out more between waterings to break their cycle, and work in neem cake. De-oiled neem feeds the soil while naturally deterring soil pests, nematodes and grubs — a tidy two-in-one. (Neem cake is for the garden only, not for eating.)",
          },
        ],
        productSlugs: ["neem-cake"],
        callout: {
          label: "Avoid this",
          body:
            "Don't respond to gnats by watering more or feeding harder — that feeds the problem. Drier topsoil and neem cake address the real cause.",
        },
      },
      {
        heading: "Wilting in wet soil, soft stems, root rot",
        body:
          "This one fools people because the plant looks thirsty — drooping and sad — yet the soil is wet. Watering more makes it worse. Lower leaves may yellow and drop, stems feel soft, and the soil may smell sour.\n\nThe cause is not lack of water but lack of air: soil so dense and soggy that roots are drowning and beginning to rot. The fix is drainage. Mix perlite — expanded volcanic glass — into the soil to create permanent air pockets that prevent root rot and let roots breathe. In a badly waterlogged pot, lift the plant, refresh into an airier mix with perlite, and ease off watering. This is also the moment our repotting guide will save you.",
        illustration: "roots",
        productSlugs: ["perlite"],
        callout: {
          label: "Gardener's note",
          body:
            "When in doubt about watering, push a finger an inch into the soil. If it comes out damp, wait. Far more houseplants are killed by kindness — over-watering — than by drought.",
        },
      },
    ],
    relatedSlugs: ["feeding-without-fear", "npk-decoded", "repotting-without-fear"],
    productSlugs: ["epsom-salt", "vermicompost", "bio-npk-granules", "rock-phosphate", "flower-booster", "neem-cake", "perlite"],
  },

  {
    slug: "repotting-without-fear",
    category: "How-To",
    title: "Repotting, Without the Fear",
    dek: "Moving a plant to a new home is a gift, not a trauma — when you do it right.",
    readMinutes: 7,
    heroIllustration: "pot",
    intro:
      "Repotting makes beginners nervous — it feels like surgery on something you love. It isn't. Done gently and at the right moment, it is one of the kindest things you can do for a plant, giving roots fresh, airy soil to stretch into. Here is the calm, step-by-step way.",
    sections: [
      {
        heading: "When does a plant actually need repotting?",
        body:
          "Plants do not need a new pot on a schedule — they ask for one with clear signs. Roots creeping out of the drainage holes or circling tightly on the surface, water that rushes straight through without soaking in, soil that has shrunk and packed down hard, or a plant that has simply stalled despite good care: these all say 'I've outgrown this home.'\n\nThe best time to repot is when a plant is gearing up to grow — for most plants in India that is the warm, active stretch before and after the monsoon, not the dead of a cold winter. A plant in active growth shrugs off the move and races into its new space.",
        illustration: "pot",
        callout: {
          label: "Gardener's note",
          body:
            "Don't repot a flowering plant mid-bloom if you can wait — it may drop its buds from the disturbance. Let it finish, then move it.",
        },
      },
      {
        heading: "Choosing the right pot",
        body:
          "The instinct is to give a plant a huge pot so you never have to do this again. Resist it. A pot only one size up — roughly two to four centimetres wider — is ideal.\n\nIn an oversized pot, soil around the small root ball stays wet for too long because there are no roots to drink it, and that soggy, airless mass is exactly what causes root rot. And whatever you choose, it must have drainage holes. A pretty pot with no holes is a slow trap for water; if you love it, plant in a holed pot that sits inside it.",
        illustration: "pot",
        callout: {
          label: "Avoid this",
          body:
            "Skipping drainage holes is the single most common pot mistake. No hole, no escape for excess water, and roots that sit and rot. Drainage is non-negotiable.",
        },
      },
      {
        heading: "Getting the mix right",
        body:
          "Fresh soil is half the gift of repotting, so make it a good one. Start with a light, airy potting mix as the body — it drains well and won't pack down. For most plants, stir in some vermicompost for gentle nutrition and, importantly, a good handful of perlite for drainage and air.\n\nThat perlite is the quiet hero of repotting. It keeps the new soil open and breathing so roots get oxygen and never sit waterlogged — especially valuable for succulents, adenium, snake plant and anything prone to root rot, and a lifesaver through a damp monsoon.",
        illustration: "roots",
        productSlugs: ["potting-mix", "vermicompost", "perlite"],
      },
      {
        heading: "The repotting sequence",
        body:
          "Work calmly and you cannot really go wrong. Lay everything out, water the plant lightly an hour before, and follow these steps in order.",
        illustration: "helping-hand",
        steps: [
          {
            title: "Prepare the new pot",
            body:
              "Check it has drainage holes. Add a base layer of your fresh, airy mix — potting mix with perlite folded through — so the plant will sit at the right height, its soil line just below the rim.",
          },
          {
            title: "Ease the plant out",
            body:
              "Tip the old pot sideways, support the base of the stem between your fingers, and gently slide the plant out. Squeeze or tap the pot to loosen it rather than yanking the stem.",
          },
          {
            title: "Free the roots",
            body:
              "If roots are circling in a tight knot, gently tease the outer ones loose with your fingers so they will grow outward into new soil instead of strangling themselves. Snip away any roots that are dark, mushy or smell off.",
          },
          {
            title: "Settle it in",
            body:
              "Centre the plant in the new pot and fill around it with fresh mix, firming gently with your fingers to remove big air gaps — but don't pack it down hard. Keep that same soil line; don't bury the stem deeper than before.",
          },
          {
            title: "Water and let it rest",
            body:
              "Water thoroughly until it runs from the drainage holes, settling the soil around the roots. Top up any mix that sinks. Then place the plant in gentle, bright shade — not harsh sun — and leave it be.",
          },
        ],
        productSlugs: ["potting-mix", "perlite"],
      },
      {
        heading: "Aftercare: the easy part",
        body:
          "For the first week or two, go easy. Keep your freshly repotted plant out of fierce direct sun, water only when the top of the soil feels dry, and — this surprises people — do not feed yet. Disturbed roots need a little time to settle, and your fresh mix with vermicompost already holds gentle nutrition.\n\nA few droopy leaves in the first days are normal transplant sulk, not failure; the plant is redirecting energy to its roots. Within a couple of weeks you will see fresh new growth — the sure sign your plant has happily moved in. If you ever repotted because of soggy, rotting soil, the leaf-by-leaf diagnosis guide is worth a read to make sure watering habits change too.",
        illustration: "sprout",
      },
    ],
    relatedSlugs: ["reading-your-plant", "building-living-soil"],
    productSlugs: ["potting-mix", "perlite", "vermicompost"],
  },

  {
    slug: "year-in-the-garden",
    category: "Seasons",
    title: "A Year in the Indian Garden",
    dek: "The monsoon changes everything. Here's how to garden with the Indian seasons, not against them.",
    readMinutes: 9,
    heroIllustration: "calendar",
    intro:
      "The Indian gardening year is ruled by one great event — the monsoon — and everything orbits around it. Learn to read the seasons and you stop fighting your garden and start flowing with it: prepping before the rains, protecting during them, feeding after, and coaxing blooms through winter and survival through summer. Here is the whole year, balcony pots and terrace gardens included.",
    sections: [
      {
        heading: "Spring & pre-monsoon prep (roughly Feb–May)",
        body:
          "As the weather warms before the rains, plants wake hungry and ready to grow — this is your big setup window. Refresh tired soil, repot anything pot-bound, and build the rich, living base that will carry plants through the heavy months ahead.\n\nThis is the season to mix in cured cow manure and vermicompost, and to fold in plenty of perlite for drainage before the rains test it. A little neem cake worked in now feeds the soil and gets ahead of the pests that the coming humidity will encourage. Set the foundation right here and the monsoon becomes a blessing rather than a battle.",
        illustration: "sprout",
        productSlugs: ["organic-cow-manure", "vermicompost", "perlite", "neem-cake"],
        callout: {
          label: "Gardener's note",
          body:
            "Pre-monsoon is the ideal repotting window for most plants — they are entering active growth and recover quickly, well before the wettest weeks arrive.",
        },
      },
      {
        heading: "Monsoon: protect, don't push (roughly Jun–Sep)",
        body:
          "The rains bring lush, fast green growth for free — and the season's biggest risks. With soil constantly wet, the great danger is waterlogging and root rot, and the great temptation is to overfeed plants that are already surging.\n\nSo the monsoon rule is restraint. Ease off heavy feeding; the rain is doing plenty and excess nutrients just wash away. Make sure every pot drains freely — this is where perlite-rich soil earns its keep — and lift pots onto feet or bricks so they never sit in puddles. Keep neem cake in play, because warm damp soil is exactly when fungus gnats and soil pests breed.",
        illustration: "watering-can",
        productSlugs: ["perlite", "neem-cake"],
        callout: {
          label: "Avoid this",
          body:
            "Don't fertilise heavily during peak monsoon. Roots are already coping with sodden soil, and most of what you add simply drains away with the rain. Protect drainage first; feed later.",
        },
      },
      {
        heading: "Post-monsoon: the great feeding window (roughly Oct–Nov)",
        body:
          "When the rains ease and the air turns mild, your garden is primed and grateful — and this is the loveliest feeding window of the whole year. Plants have grown vigorously, the soil has been flushed, and now is the moment to replenish what the rains carried off and to set up the winter flowering season.\n\nTop-dress with vermicompost to restore gentle nutrition, work in bio NPK granules for a steady slow-release feed, and add rock phosphate around plants you want to flower — it builds the root and bud strength that winter blooms are made of. Feed generously now and your garden rewards you for months.",
        illustration: "cycle",
        productSlugs: ["vermicompost", "bio-npk-granules", "rock-phosphate"],
      },
      {
        heading: "Winter: the season of blooms (roughly Dec–Feb)",
        body:
          "For much of India, winter is the showpiece flowering season — cool, bright days that roses, hibiscus and countless garden favourites adore. Your job now is to support all that blooming.\n\nThis is flower booster season. With your post-monsoon feeding behind them and plants healthy, a high-potassium bloom formula nudges them toward more buds and bigger, longer-lasting flowers. Keep plants in the good winter sun, water a little less as growth slows in the cooler weather, and enjoy the display. Tender, tropical plants may need a sheltered corner where winters turn genuinely cold.",
        illustration: "flower",
        productSlugs: ["flower-booster"],
        callout: {
          label: "Gardener's note",
          body:
            "Save the flower booster for healthy plants that are actively budding. It encourages a plant to flower — it is not a tonic for one that is struggling, which needs its underlying problem fixed first.",
        },
      },
      {
        heading: "Summer survival (roughly Mar–May, into the heat)",
        body:
          "The pre-monsoon heat can be brutal, especially on a sun-baked terrace or balcony where pots heat up fast and dry out by afternoon. Here the goal shifts from pushing growth to helping plants endure.\n\nWater deeply in the cool of early morning or evening, never in the midday blaze. Vermicompost-rich soil holds moisture longer and is a real ally now, as is mulch over the surface to keep roots cool. Ease off heavy feeding in extreme heat — a stressed plant cannot use it — and give afternoon shade to anything wilting. Tough, heat-loving plants like adenium, curry leaf and chilli will sail through; leafy and tender ones will thank you for the shelter.",
        illustration: "sun",
        productSlugs: ["vermicompost"],
        callout: {
          label: "Avoid this",
          body:
            "Don't fertilise a heat-stressed plant in peak summer. It can't take up the food and you risk doing harm. Focus on water and shade until the worst heat passes.",
        },
      },
      {
        heading: "The rhythm of the year",
        body:
          "Step back and the pattern is simple and kind: build and prep before the monsoon, protect and restrain during it, feed generously after, bloom through winter, and survive the summer. Each season asks for one main thing, and the same handful of Folia staples carries you through all of them.\n\nYou do not need to memorise dates — your local weather and your plants will tell you when each season truly arrives. Garden with the seasons rather than against them and the whole thing gets easier every year. When you are ready to go deeper on any single season's tasks, the feeding and diagnosis guides are right beside this one.",
        illustration: "calendar",
      },
    ],
    relatedSlugs: ["feeding-without-fear", "reading-your-plant", "building-living-soil"],
    productSlugs: ["organic-cow-manure", "vermicompost", "perlite", "neem-cake", "bio-npk-granules", "rock-phosphate", "flower-booster"],
  },
];

export function guideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

export const GUIDE_CATEGORIES = ["Foundations", "How-To", "Diagnosis", "Seasons"] as const;
