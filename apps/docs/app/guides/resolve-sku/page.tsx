import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Resolve configuration → SKU' };

export default function ResolveSkuPage() {
  return (
    <>
      <PageHeader
        title="Resolve configuration → SKU"
        description="The only legal path from shopper choices to a sellable identity."
      />
      <Section title="Call">
        <CodeBlock>{`query {
  resolveConfiguration(input: {
    productId: "…"
    selectionsJson: "{\\"color\\":\\"black\\",\\"size\\":\\"xl\\"}"
  }) {
    valid
    violations
    commerce { sku variantReference cartPayloadJson }
  }
}`}</CodeBlock>
        <Prose>
          <p>
            If valid is false, stop. If valid is true but sku and
            variantReference are both empty, the combination is legal to
            preview and illegal to sell — map it on the graph.
          </p>
        </Prose>
        <Callout>
          Never hash selectionsJson into a SKU on the client. The graph is
          the dictionary.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/resolved-selection', label: 'Resolved selection' },
            { href: '/concepts/commerce', label: 'Commerce references' },
            { href: '/guides/add-to-cart', label: 'Add-to-cart' },
          ]}
        />
      </Section>
    </>
  );
}
