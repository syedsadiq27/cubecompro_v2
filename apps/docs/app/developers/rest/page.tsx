import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'REST API' };

export default function RestApiPage() {
  return (
    <>
      <PageHeader
        title="REST API"
        description="Document and health routes only. Product authoring and resolve are GraphQL."
      />
      <Section title="Routes">
        <SpecTable
          rows={[
            { label: 'GET /healthz', value: '{ ok: true } — no auth' },
            {
              label: 'GET /documents/objects/:id',
              value: 'GLB bytes. Bearer required. Org-scoped.',
            },
            {
              label: 'GET /documents/materials/:id',
              value: 'Material document JSON. Bearer required.',
            },
          ]}
        />
        <Prose>
          <p>
            Viewers use these URLs from resolve (documentUrl). Do not list,
            upload, or delete assets over REST — that is GraphQL + Backoffice.
          </p>
        </Prose>
        <Callout>
          There is no REST product catalog, cart, or webhook inbox.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/api', label: 'API overview' },
            { href: '/platform/assets', label: 'Assets' },
            { href: '/developers/authentication', label: 'Authentication' },
          ]}
        />
      </Section>
    </>
  );
}
