import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Create a project' };

export default function StartProjectPage() {
  return (
    <>
      <PageHeader
        title="Create a project"
        description="All products and assets are project-scoped. A token without project membership cannot load a graph."
      />
      <Section title="Backoffice">
        <Prose>
          <p>
            Sign in, then create or select a project from the project switcher.
            The URL becomes <code>/{'{projectId}'}/…</code>.
          </p>
        </Prose>
      </Section>
      <Section title="API">
        <CodeBlock>{`mutation {
  createProject(input: {
    organizationId: "ORG_ID"
    name: "North America"
    key: "na"
  }) { id name key }
}`}</CodeBlock>
        <Callout>
          <code>myProjects</code> lists projects the current user can access.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/product', label: 'Add a product' },
            { href: '/architecture', label: 'Tenancy' },
          ]}
        />
      </Section>
    </>
  );
}
