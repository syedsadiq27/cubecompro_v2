import {
  PageHeader,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Troubleshooting' };

export default function TroubleshootingPage() {
  return (
    <>
      <PageHeader
        title="Troubleshooting"
        description="Failures we see on deploy and first resolve."
      />
      <Section title="Symptoms">
        <SpecTable
          rows={[
            {
              label: 'Cloud Run timeout',
              value: 'Process must listen on 0.0.0.0:$PORT (8080).',
            },
            {
              label: 'DATABASE_URL not found',
              value: 'Set on the service. Prisma generate can use a dummy URL.',
            },
            {
              label: 'public.User does not exist',
              value: 'Schema not applied. Restart API with DATABASE_URL (auto-migrate). Set SEED=true for the demo user, or yarn db:setup locally.',
            },
            {
              label: '401 on resolve',
              value: 'Expired JWT (7d) or missing Bearer.',
            },
            {
              label: 'valid false, unpublished',
              value: 'Publish the graph version.',
            },
            {
              label: 'valid true, empty commerce',
              value: 'Map the combination to a variant.',
            },
            {
              label: 'GLB 404',
              value: 'Document route needs the same token as GraphQL.',
            },
          ]}
        />
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/operations/deployment', label: 'Deployment' },
            { href: '/developers/errors', label: 'Errors' },
            { href: '/reference/errors', label: 'Error codes' },
          ]}
        />
      </Section>
    </>
  );
}
