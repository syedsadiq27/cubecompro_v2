import { GetClientApiDocument } from '@repo/graphql/generated';
import { SettingsNav } from '../../../../../components/settings/settings-nav';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../components/ui';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';

export default async function ApiSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let api: {
    id?: string | number | null;
    client_key?: string | null;
    client_secret_key?: string | null;
    projectid?: string | number | null;
  } | null = null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetClientApiDocument, { id: projectId });
    api = data.getclientapiByID ?? null;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load API settings.';
  }

  return (
    <div>
      <PageHeader
        title="Project settings"
        description="CMS, commerce, microservice, and API configuration."
      />
      <SettingsNav projectId={projectId} active="api" />
      {error ? <ErrorState message={error} /> : null}
      <Panel className="space-y-3">
        <h3 className="font-semibold">API client</h3>
        {!api && !error ? (
          <p className="text-sm text-[var(--bo-muted)]">
            No API client credentials returned for this project.
          </p>
        ) : null}
        {api ? (
          <>
            <p className="text-sm">
              <span className="text-[var(--bo-muted)]">Client key:</span>{' '}
              <code>{api.client_key || '—'}</code>
            </p>
            <p className="text-sm">
              <span className="text-[var(--bo-muted)]">Client secret:</span>{' '}
              <code>{api.client_secret_key || '—'}</code>
            </p>
          </>
        ) : null}
      </Panel>
    </div>
  );
}
