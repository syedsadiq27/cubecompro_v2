import { SeoDemoEmbed } from '@/components/seo/seo-demo-embed';
import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { SolutionCompare } from '@/components/solutions/solution-compare';

export function ApparelIndustryPage() {
  return (
    <SeoMarketingPage
      path="/industries/apparel"
      visual={<SeoDemoEmbed product="tshirt" />}
      intro={
        <SolutionCompare
          without={[
            'Colorways treated as visual presets with no commerce identity',
            'Fit and size rules live in tribal knowledge',
            'Decoration changes what you sell — but not what cart knows',
          ]}
          withItems={[
            'Color + fit + size resolve to SKU, price, and inventory',
            'Constraints rewrite illegal combinations before cart',
            'Decoration attaches to the same sellable state',
          ]}
          title="Apparel options that stay stockable and sellable."
        />
      }
    />
  );
}
