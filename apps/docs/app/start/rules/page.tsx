import {
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Add configuration rules' };

export default function StartRulesPage() {
  return (
    <>
      <PageHeader
        title="Add configuration rules"
        description="IF / THEN on the draft graph. Evaluated at resolve, not in the option picker."
      />
      <Section title="Author">
        <Prose>
          <p>
            Product → Rules → Add rule. Example: IF Material = Leather THEN
            Color ≠ White. Publish before storefronts see it.
          </p>
        </Prose>
        <CodeBlock>{`condition: { attr: "material", eq: "leather" }
effect:    { forbid: { attr: "color", eq: "white" } }`}</CodeBlock>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/rules', label: 'Rules & constraints' },
            { href: '/guides/dependent-options', label: 'Dependent options' },
            { href: '/platform/rules', label: 'Platform: Rules' },
          ]}
        />
      </Section>
    </>
  );
}
