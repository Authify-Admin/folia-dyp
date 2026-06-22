import { Hero } from "@/components/home/Hero";
import { CollectionChapters } from "@/components/home/CollectionChapters";
import { PlantDoctor } from "@/components/PlantDoctor";
import { Guarantees } from "@/components/Guarantees";
import { FeaturedShelf } from "@/components/home/FeaturedShelf";
import { LearnTeaser } from "@/components/home/LearnTeaser";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { Testimonials } from "@/components/home/Testimonials";
import { CraftStrip } from "@/components/home/CraftStrip";
import { FinalCta } from "@/components/home/FinalCta";

/**
 * The flagship floor plan:
 *  I.    The opening shot          — hero
 *  II.   The collection in chapters — categories as editorial spreads
 *  III.  The free consultation      — Plant Doctor, the headline service
 *  IV.   Risk-free, in specifics    — the guarantee band
 *  IV.   From the shelves           — live products, quick-addable
 *  V.    A helping-hand brand       — the Field Guide teaser
 *  VI.   The dark interlude         — the brand speaks
 *  VII.  Loved across India         — customer testimonials
 *  VIII. Three commitments          — craft strip
 *  IX.   The closing frame          — one door into the shop
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CollectionChapters />
      <PlantDoctor />
      <div className="bg-parchment pb-8 sm:pb-12">
        <Guarantees heading="Risk-free, every order" />
      </div>
      <FeaturedShelf />
      <LearnTeaser />
      <StoryTeaser />
      <Testimonials />
      <CraftStrip />
      <FinalCta />
    </>
  );
}
