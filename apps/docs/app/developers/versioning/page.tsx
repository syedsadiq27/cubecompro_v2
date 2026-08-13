import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'API versioning' };

export default function VersioningPage() {
  return (
    <>
      <PageHeader
        title="API versioning"
        description="The GraphQL schema is unversioned. Until v1, changes are additive."
      />
      <Section title="Policy">
        <Prose>
          <p>
            Fields may be added. Fields will not be removed or change meaning
            without a release-notes entry and a deprecation window. There is
            no /v1/graphql path and no schema version header.
          </p>
        </Prose>
        <Callout>
          Product graph versions are a domain concept (draft vs published),
          not an API version. Do not confuse them.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/graphql', label: 'GraphQL API' },
            { href: '/release-notes', label: 'Release notes' },
          ]}
        />
      </Section>
    </>
  );
}
