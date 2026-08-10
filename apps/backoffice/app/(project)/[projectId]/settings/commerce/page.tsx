import { GetCommerceConfigDocument } from '@repo/graphql/generated';
import {
  deleteCommerceConfigAction,
  saveCommerceConfigAction,
} from '../../../../../actions/settings';
import { SettingsForm } from '../../../../../components/settings/settings-form';
import { SettingsNav } from '../../../../../components/settings/settings-nav';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../components/ui';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';

export default async function CommerceSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let config: {
    id?: string | number | null;
    platform?: string | null;
    apiurl?: string | null;
    storeid?: string | null;
    clientid?: string | null;
    clientsecert?: string | null;
    redirecturl?: string | null;
  } | null = null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetCommerceConfigDocument, { projectId });
    config = data.getcommerceconfigByPID?.[0] ?? null;
  } catch (err) {
    error =
      err instanceof Error ? err.message : 'Failed to load commerce config.';
  }

  return (
    <div>
      <PageHeader
        title="Project settings"
        description="CMS, commerce, microservice, and API configuration."
      />
      <SettingsNav projectId={projectId} active="commerce" />
      {error ? <ErrorState message={error} /> : null}
      <Panel>
        <h3 className="mb-4 font-semibold">Commerce configuration</h3>
        <SettingsForm
          fields={[
            {
              name: 'id',
              label: 'ID',
              type: 'hidden',
              value: config?.id ? String(config.id) : '',
            },
            { name: 'platform', label: 'Platform', value: config?.platform ?? '' },
            { name: 'apiurl', label: 'API URL', value: config?.apiurl ?? '' },
            { name: 'storeid', label: 'Store ID', value: config?.storeid ?? '' },
            { name: 'clientid', label: 'Client ID', value: config?.clientid ?? '' },
            {
              name: 'clientsecert',
              label: 'Client secret',
              value: config?.clientsecert ?? '',
            },
            {
              name: 'redirecturl',
              label: 'Redirect URL',
              value: config?.redirecturl ?? '',
            },
          ]}
          onSave={saveCommerceConfigAction.bind(null, projectId)}
          onDelete={
            config
              ? deleteCommerceConfigAction.bind(null, projectId)
              : undefined
          }
        />
      </Panel>
    </div>
  );
}
