import { Hero } from "@/components/home/Hero";
import { CollectionChapters } from "@/components/home/CollectionChapters";
import { FeaturedShelf } from "@/components/home/FeaturedShelf";
import { StoryTeaser } from "@/components/home/StoryTeaser";
import { CraftStrip } from "@/components/home/CraftStrip";
import { FinalCta } from "@/components/home/FinalCta";

/**
 * The flagship floor plan:
 *  I.   The opening shot          — hero
 *  II.  The collection in chapters — categories as editorial spreads
 *  III. From the shelves          — live products, quick-addable
 *  IV.  The dark interlude        — the brand speaks
 *  V.   Three commitments         — craft strip
 *  VI.  The closing frame         — one door into the shop
 */
export default function Home() {
  return (
    <>
      <Hero />
      <CollectionChapters />
      <FeaturedShelf />
      <StoryTeaser />
      <CraftStrip />
      <FinalCta />
    </>
  );
}
