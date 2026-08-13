import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Publishing' };

export default function PublishingPage() {
  return (
    <>
      <PageHeader
        title="Publishing"
        description="Storefront resolve uses the published graph version. Drafts are preview-only."
      />
      <Section title="Lifecycle">
        <Prose>
          <p>
            publishProductGraphVersion promotes a draft. Subsequent resolve
            calls with only productId use that version. Pass graphVersionId
            to preview a draft in Studio. Unpublished products resolve with
            valid false.
          </p>
        </Prose>
        <Callout>
          Publishing is a graph operation, not a product status toggle.
          Archive the product to hide it from catalogs.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/product-graph', label: 'Product graph' },
            { href: '/operations/environments', label: 'Environments' },
          ]}
        />
      </Section>
    </>
  );
}
