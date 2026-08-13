import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Resolved selection' };

export default function ResolvedSelectionPage() {
  return (
    <>
      <PageHeader
        title="Resolved selection"
        description="The output of resolve: a normalized, rule-checked selection plus two projections. This is the object storefronts and Studio previews consume."
      />
      <Section title="Shape">
        <CodeBlock>{`ResolvedSelection
  valid: boolean
  violations: string[]
  selections: { [attributeKey]: valueKey }
  threeD  → scene state
  commerce → commerce references`}</CodeBlock>
        <Prose>
          <p>
            Scene state and commerce state are siblings of the same selection.
            If <code>valid</code> is false, neither projection may be used to
            mutate a cart.
          </p>
        </Prose>
        <Callout>
          A ConfigurationState is input. A ResolvedSelection is output. Never
          persist a SKU as if it were the configuration.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/configuration', label: 'Configuration state' },
            { href: '/concepts/scene-state', label: 'Scene state' },
            { href: '/concepts/commerce', label: 'Commerce references' },
          ]}
        />
      </Section>
    </>
  );
}
