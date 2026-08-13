import {
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Configuration' };

export default function ConfigurationPage() {
  return (
    <>
      <PageHeader
        title="Configuration"
        description="Options and values on a graph version. Shopper input is a map of those keys."
      />
      <Section title="Authoring">
        <Prose>
          <p>
            Attributes are SELECT options. Values are the legal answers.
            Defaults are the first value unless you set otherwise. Keys are
            immutable once published; rename the label, not the key.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/configuration', label: 'Configuration state' },
            { href: '/start/options', label: 'Define options & values' },
            { href: '/platform/rules', label: 'Rules' },
          ]}
        />
      </Section>
    </>
  );
}
