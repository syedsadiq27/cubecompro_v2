import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Deployment' };

export default function DeploymentPage() {
  return (
    <>
      <PageHeader
        title="Deployment"
        description="API on Cloud Run. Backoffice and Editor on Netlify. Docs as a Next app."
      />
      <Section title="Services">
        <SpecTable
          rows={[
            { label: 'API', value: 'Docker → Cloud Run, PORT 8080, cloudbuild.yaml' },
            { label: 'Backoffice', value: 'yarn build:backoffice, publish apps/backoffice/.next' },
            { label: 'Editor', value: 'yarn build:editor, same Netlify pattern' },
          ]}
        />
        <Prose>
          <p>
            Required API env: DATABASE_URL, JWT_SECRET, API_PUBLIC_URL.
            DOCUMENT_STORE_PATH for object bytes. SEED=true loads the demo
            user on boot if missing; SEED=force reruns seed. Prisma generate
            runs at image build. migrate deploy always runs on boot.
          </p>
        </Prose>
        <Callout>
          The API is Nest, not a Netlify site. Do not point a Netlify
          project at apps/api.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/operations/environments', label: 'Environments' },
            { href: '/operations/troubleshooting', label: 'Troubleshooting' },
          ]}
        />
      </Section>
    </>
  );
}
