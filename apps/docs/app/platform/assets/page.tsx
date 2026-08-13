import {
  Callout,
  PageHeader,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Assets' };

export default function AssetsPage() {
  return (
    <>
      <PageHeader
        title="Assets"
        description="Library objects (GLB) and materials. Fetched over REST documents, referenced from the graph by id."
      />
      <Section title="Types">
        <SpecTable
          rows={[
            { label: 'Objects', value: 'GLB + parse metadata' },
            { label: 'Materials', value: 'PBR document JSON + optional textures' },
            { label: 'Textures', value: 'Image bytes used by materials' },
          ]}
        />
        <Callout>
          GET /documents/objects/:id and /documents/materials/:id require a
          bearer token. GraphQL never returns raw bytes.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/rest', label: 'REST API' },
            { href: '/integrations/dam', label: 'DAM' },
            { href: '/platform/models', label: 'Models' },
          ]}
        />
      </Section>
    </>
  );
}
