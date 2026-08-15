import { SeoDemoEmbed } from '@/components/seo/seo-demo-embed';
import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';
import { SolutionCompare } from '@/components/solutions/solution-compare';

export function FurnitureIndustryPage() {
  return (
    <SeoMarketingPage
      path="/industries/furniture"
      visual={<SeoDemoEmbed product="sofa" />}
      intro={
        <SolutionCompare
          without={[
            'Every fabric × frame × leg combination becomes a photoshoot',
            'Invalid looks reach the PDP before ops can stop them',
            'Showroom quotes and web PDPs disagree on what is sellable',
          ]}
          withItems={[
            'Legal looks render from materials and models',
            'Constraints block incompatible combinations before cart',
            'Shareable state keeps showroom and web on one graph',
          ]}
          title="Furniture variation without catalog explosion."
        />
      }
    />
  );
}
