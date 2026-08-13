import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Errors & limits' };

export default function ErrorsPage() {
  return (
    <>
      <PageHeader
        title="Errors & limits"
        description="Two layers: transport/auth failures, and domain violations on a successful resolve. Mixing them is how storefronts accidentally sell illegal configurations."
      />

      <Section title="Transport">
        <SpecTable
          rows={[
            { label: '401', value: 'Missing or invalid Bearer token' },
            { label: '400', value: 'selectionsJson is not valid JSON' },
            { label: '404', value: 'Product, version, or document not in org' },
            {
              label: 'GraphQL errors[]',
              value: 'Schema/validation/resolver exceptions — no data payload',
            },
          ]}
        />
      </Section>

      <Section title="Domain">
        <Prose>
          <p>
            <code>resolveConfiguration</code> returns HTTP 200 with
            <code>valid: false</code> and <code>violations: string[]</code>
            when the selection fails attributes or rules, or when the active
            version is not published.
          </p>
        </Prose>
        <Callout>
          A 200 with valid false is not a successful sale. Cart adapters must
          branch on valid, not on HTTP status.
        </Callout>
      </Section>

      <Section title="Idempotency">
        <Prose>
          <p>
            Resolve is a pure read of a graph version plus selections. Repeat
            calls with the same input return the same projection. Authoring
            mutations are not idempotent unless you key on existing ids.
          </p>
        </Prose>
      </Section>

      <Section title="Limits (current)">
        <SpecTable
          rows={[
            {
              label: 'Rate limits',
              value: 'Not enforced. Do not assume they will stay absent.',
            },
            {
              label: 'Token TTL',
              value: '7 days. Refresh by logging in again.',
            },
            {
              label: 'API versioning',
              value: 'Unversioned GraphQL schema. Additive changes only until v1.',
            },
            {
              label: 'Payload',
              value: 'selectionsJson and document uploads should stay small; GLB parse is synchronous on upload.',
            },
          ]}
        />
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/developers/authentication', label: 'Authentication' },
            { href: '/developers/graphql', label: 'GraphQL API' },
            { href: '/concepts/rules', label: 'Rules & constraints' },
          ]}
        />
      </Section>
    </>
  );
}
