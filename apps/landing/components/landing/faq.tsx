import { SeoFaq } from '@/components/seo/seo-faq';
import { faqs } from '@/lib/content';

export function Faq() {
  return (
    <SeoFaq
      id="faq"
      items={faqs}
      title="Questions teams ask before adopting CubeCom"
      description="Still mapping your catalog, rules, or commerce path? Bring one product and we’ll show where CubeCom should sit."
    />
  );
}
