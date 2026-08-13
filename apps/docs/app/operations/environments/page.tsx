import {
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Environments' };

export default function EnvironmentsPage() {
  return (
    <>
      <PageHeader
        title="Environments"
        description="Separate API + database per environment. Graphs do not promote themselves."
      />
      <Section title="Typical split">
        <SpecTable
          rows={[
            { label: 'Local', value: 'API :3005, Backoffice, Editor, Docs' },
            { label: 'Staging', value: 'Cloud Run API + Netlify apps + staging DB' },
            { label: 'Production', value: 'Same topology, separate secrets and DB' },
          ]}
        />
        <Prose>
          <p>
            Publish is inside one environment. To copy a product to
            production, recreate or import it — there is no cross-env
            promote API yet.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/operations/deployment', label: 'Deployment' },
            { href: '/platform/publishing', label: 'Publishing' },
          ]}
        />
      </Section>
    </>
  );
}
