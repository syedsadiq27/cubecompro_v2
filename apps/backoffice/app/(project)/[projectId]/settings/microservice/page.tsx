import { SettingsNav } from '../../../../../components/settings/settings-nav';
import { PageHeader, Panel } from '../../../../../components/ui';

export default async function MicroserviceSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div>
      <PageHeader
        title="Project settings"
        description="CMS, commerce, microservice, and API configuration."
      />
      <SettingsNav projectId={projectId} active="microservice" />
      <Panel>
        <h3 className="mb-2 font-semibold">Microservice configuration</h3>
        <p className="text-sm text-[var(--bo-muted)]">
          Microservice endpoints from the reference app were project-specific
          and lightly used. This surface is reserved for the same settings once
          the GraphQL contract for them is confirmed against production.
        </p>
      </Panel>
    </div>
  );
}
