import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Rate limits' };

export default function RateLimitsPage() {
  return (
    <>
      <PageHeader
        title="Rate limits"
        description="Not enforced on the current API. Treat that as temporary."
      />
      <Section title="Current">
        <SpecTable
          rows={[
            { label: 'HTTP 429', value: 'Not issued' },
            { label: 'Quota headers', value: 'Not present' },
            { label: 'GLB parse', value: 'Synchronous on upload — keep files reasonable' },
          ]}
        />
        <Prose>
          <p>
            Resolve is cheap relative to document parse. Bursting resolve from
            a PDP is fine. Uploading large GLBs in a tight loop is not.
          </p>
        </Prose>
        <Callout>
          Future limits will be announced in release notes and returned as
          429 with a Retry-After. Design clients to tolerate that now.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/errors', label: 'Errors' },
            { href: '/reference/limits', label: 'Limits' },
          ]}
        />
      </Section>
    </>
  );
}
