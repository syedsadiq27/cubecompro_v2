import { GetCmsConfigDocument } from '@repo/graphql/generated';
import {
  deleteCmsConfigAction,
  saveCmsConfigAction,
} from '../../../../../actions/settings';
import { SettingsNav } from '../../../../../components/settings/settings-nav';
import { SettingsForm } from '../../../../../components/settings/settings-form';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../components/ui';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';

export default async function CmsSettingsPage({
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
    name?: string | null;
    cmsconfigid?: string | null;
  } | null = null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetCmsConfigDocument, { projectId });
    config = data.getcmsconfigByprojectID?.[0] ?? null;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load CMS config.';
  }

  return (
    <div>
      <PageHeader
        title="Project settings"
        description="CMS, commerce, microservice, and API configuration."
      />
      <SettingsNav projectId={projectId} active="cms" />
      {error ? <ErrorState message={error} /> : null}
      <Panel>
        <h3 className="mb-4 font-semibold">CMS configuration</h3>
        <SettingsForm
          fields={[
            { name: 'id', label: 'ID', type: 'hidden', value: config?.id ? String(config.id) : '' },
            { name: 'name', label: 'Name', value: config?.name ?? '' },
            {
              name: 'cmsconfigid',
              label: 'CMS config ID',
              value: config?.cmsconfigid ?? '',
            },
          ]}
          onSave={saveCmsConfigAction.bind(null, projectId)}
          onDelete={
            config ? deleteCmsConfigAction.bind(null, projectId) : undefined
          }
        />
      </Panel>
    </div>
  );
}
