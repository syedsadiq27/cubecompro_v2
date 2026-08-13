import {
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Release notes' };

export default function ReleaseNotesPage() {
  return (
    <>
      <PageHeader
        title="Release notes"
        description="What this platform cut actually ships."
      />
      <Section title="2026.8 — platform cut">
        <Prose>
          <p>
            Product graph, draft/publish, options, rules, library GLB +
            materials, Studio visual bindings, generic commerce variants,
            resolveConfiguration, JWT auth, document REST, Backoffice +
            Editor + Docs.
          </p>
          <p>
            Not in this cut: webhooks, first-party SDKs, Shopify /
            commercetools clients, PIM/DAM connectors, hosted cart, price
            or inventory sync, 2D/AI experiences, API version path, rate
            limits.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/architecture', label: 'Architecture' },
            { href: '/developers/versioning', label: 'API versioning' },
          ]}
        />
      </Section>
    </>
  );
}
