import { SeoCta } from '@/components/seo/seo-cta';
import { SeoFaq } from '@/components/seo/seo-faq';
import { SeoJsonLd } from '@/components/seo/seo-json-ld';
import { getSeoBody } from '@/lib/seo-bodies';
import { getSeoPage } from '@/lib/seo-pages';
import { PcCompare } from './pc-compare';
import { PcExample } from './pc-example';
import { PcHero } from './pc-hero';
import { PcInfrastructure } from './pc-infrastructure';
import { PcStatement } from './pc-statement';
import { PcVariantExplosion } from './pc-variant-explosion';

const PATH = '/product-configurator';

export function ProductConfiguratorPage() {
  const page = getSeoPage(PATH);
  const body = getSeoBody(PATH);

  return (
    <>
      <SeoJsonLd page={page} faqs={body.faqs} />
      <PcHero />
      <PcVariantExplosion />
      <PcStatement />
      <PcExample />
      <PcInfrastructure />
      <PcCompare />
      <SeoFaq
        items={body.faqs}
        title={body.faqTitle}
        description={body.faqDescription}
        compact
      />
      <SeoCta {...body.cta} />
    </>
  );
}
