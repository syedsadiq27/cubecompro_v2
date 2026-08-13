import {
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Rules' };

export default function PlatformRulesPage() {
  return (
    <>
      <PageHeader
        title="Rules"
        description="IF / THEN constraints stored on the graph. Evaluated only at resolve."
      />
      <Section title="Behavior">
        <Prose>
          <p>
            A rule that fires appends a violation and sets valid false. It
            does not rewrite the shopper selection. Dependent-option UIs
            should hide illegal values by calling resolve, not by copying
            rule JSON into the client.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/rules', label: 'Rules & constraints' },
            { href: '/start/rules', label: 'Add configuration rules' },
            { href: '/guides/dependent-options', label: 'Dependent options' },
          ]}
        />
      </Section>
    </>
  );
}
