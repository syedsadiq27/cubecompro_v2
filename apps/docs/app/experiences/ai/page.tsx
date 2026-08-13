import { Planned } from '@/components/planned';

export const metadata = { title: 'AI' };

export default function ExperienceAiPage() {
  return (
    <Planned
      title="AI"
      description="Assist authoring and shopper search. Not a second source of truth for configuration."
      ships={false}
      contract="Any AI path must call resolveConfiguration with a concrete selectionsJson before preview or cart. Generated option copy, material suggestions, or natural-language search are inputs to the graph, not replacements for it. No model output may invent a SKU."
      related={[
        { href: '/concepts/product-graph', label: 'Product graph' },
        { href: '/guides/resolve-sku', label: 'Resolve configuration → SKU' },
      ]}
    />
  );
}
