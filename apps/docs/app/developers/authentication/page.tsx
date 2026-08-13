import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Authentication' };

export default function AuthenticationPage() {
  return (
    <>
      <PageHeader
        title="Authentication"
        description="CubeCom Pro uses bearer JWTs. Login is a GraphQL mutation. Every other operation, including document bytes, requires the header."
      />

      <Section title="Login">
        <CodeBlock>{`mutation Login($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    token
    user { id email organizationId role }
  }
}`}</CodeBlock>
        <SpecTable
          rows={[
            { label: 'Algorithm', value: 'HS256 (JWT_SECRET)' },
            { label: 'Expiry', value: '7 days' },
            {
              label: 'Claims',
              value: 'sub, email, organizationId, roleId, roleName',
            },
          ]}
        />
      </Section>

      <Section title="Calling the API">
        <CodeBlock>{`Authorization: Bearer <token>
Content-Type: application/json

POST {API_URL}/graphql`}</CodeBlock>
        <Prose>
          <p>
            <code>me</code> and <code>myProjects</code> are the session
            queries. Missing or invalid tokens return 401 on REST document
            routes and GraphQL unauthorized errors on guarded fields.
          </p>
        </Prose>
        <Callout>
          There is no API version header yet. Treat the current schema as
          v0: additive fields are safe; removed fields will be announced as
          a versioned GraphQL schema when versioning ships.
        </Callout>
      </Section>

      <Section title="Studio">
        <Prose>
          <p>
            The Backoffice host posts the same bearer token into the Studio
            iframe after <code>EDITOR_EMBED.READY</code>. Studio does not
            perform login itself.
          </p>
        </Prose>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/developers/graphql', label: 'GraphQL API' },
            { href: '/developers/errors', label: 'Errors' },
            { href: '/start/project', label: 'Create a project' },
          ]}
        />
      </Section>
    </>
  );
}
