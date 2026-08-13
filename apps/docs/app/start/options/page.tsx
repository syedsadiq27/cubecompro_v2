import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Define options & values' };

export default function StartOptionsPage() {
  return (
    <>
      <PageHeader
        title="Define options & values"
        description="Options are what shoppers choose. Keys go in selectionsJson. Names go on screen."
      />
      <Section title="In Backoffice">
        <Prose>
          <p>
            Product → Options → Add option (e.g. Color / color). Open the row
            to add values (Black / black). First value is the default.
          </p>
        </Prose>
        <Callout>
          3D, commerce, and rules all bind to these values. Define options
          before mappings.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/platform/configuration', label: 'Configuration' },
            { href: '/start/rules', label: 'Add configuration rules' },
            { href: '/concepts/configuration', label: 'Configuration state' },
          ]}
        />
      </Section>
    </>
  );
}
