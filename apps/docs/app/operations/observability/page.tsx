import {
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Observability' };

export default function ObservabilityPage() {
  return (
    <>
      <PageHeader
        title="Observability"
        description="Health is GET /healthz. Request logs go to Cloud Logging when CLOUD_LOGGING_ONLY is set."
      />
      <Section title="Now">
        <Prose>
          <p>
            No first-party metrics or tracing product. Probe /healthz for
            liveness. GraphQL errors appear in API logs. Document parse
            failures are returned on the library mutation, not as a
            separate trace.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/operations/troubleshooting', label: 'Troubleshooting' },
            { href: '/developers/errors', label: 'Errors' },
          ]}
        />
      </Section>
    </>
  );
}
