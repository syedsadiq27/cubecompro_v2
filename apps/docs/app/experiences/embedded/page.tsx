import {
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Embedded experience' };

export default function EmbeddedExperiencePage() {
  return (
    <>
      <PageHeader
        title="Embedded experience"
        description="CubeCom Pro on a host page: Studio for merchants, customizer for shoppers."
      />
      <Section title="Two hosts">
        <Prose>
          <p>
            Backoffice embeds Studio over postMessage (READY → AUTH → CLOSE).
            A storefront embeds the customizer with token + product id and
            drives resolve on every option change. Both hosts own chrome;
            CubeCom Pro owns the graph.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/embed', label: 'Embed the configurator' },
            { href: '/guides/custom-ui', label: 'Build custom UI' },
            { href: '/developers/authentication', label: 'Authentication' },
          ]}
        />
      </Section>
    </>
  );
}
