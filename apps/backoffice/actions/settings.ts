'use server';

import { revalidatePath } from 'next/cache';
import {
  AddCmsConfigDocument,
  AddCommerceConfigDocument,
  DeleteCmsConfigDocument,
  DeleteCommerceConfigDocument,
  UpdateCmsConfigDocument,
  UpdateCommerceConfigDocument,
} from '@repo/graphql/generated';
import { createProjectClient } from '../lib/graphql';
import { getProjectSession } from '../lib/session-server';

type Result = { ok: boolean; error?: string };

async function clientFor(projectId: string) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) return null;
  return createProjectClient(projectId, project.projectToken);
}

export async function saveCmsConfigAction(
  projectId: string,
  formData: FormData
): Promise<Result> {
  const client = await clientFor(projectId);
  if (!client) return { ok: false, error: 'Session missing.' };

  const id = String(formData.get('id') ?? '');
  const name = String(formData.get('name') ?? '');
  const cmsconfigid = String(formData.get('cmsconfigid') ?? '');

  try {
    if (id) {
      await client.project(UpdateCmsConfigDocument, { id, name, cmsconfigid });
    } else {
      await client.project(AddCmsConfigDocument, {
        name,
        cmsconfigid,
        projectId: Number(projectId),
      });
    }
    revalidatePath(`/${projectId}/settings/cms`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Save failed.',
    };
  }
}

export async function deleteCmsConfigAction(
  projectId: string
): Promise<Result> {
  const client = await clientFor(projectId);
  if (!client) return { ok: false, error: 'Session missing.' };

  try {
    await client.project(DeleteCmsConfigDocument, { projectId });
    revalidatePath(`/${projectId}/settings/cms`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}

export async function saveCommerceConfigAction(
  projectId: string,
  formData: FormData
): Promise<Result> {
  const client = await clientFor(projectId);
  if (!client) return { ok: false, error: 'Session missing.' };

  const variables = {
    platform: String(formData.get('platform') ?? ''),
    apiurl: String(formData.get('apiurl') ?? ''),
    storeid: String(formData.get('storeid') ?? ''),
    clientid: String(formData.get('clientid') ?? ''),
    clientsecert: String(formData.get('clientsecert') ?? ''),
    redirecturl: String(formData.get('redirecturl') ?? ''),
    projectId: Number(projectId),
  };
  const id = String(formData.get('id') ?? '');

  try {
    if (id) {
      await client.project(UpdateCommerceConfigDocument, { id, ...variables });
    } else {
      await client.project(AddCommerceConfigDocument, variables);
    }
    revalidatePath(`/${projectId}/settings/commerce`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Save failed.',
    };
  }
}

export async function deleteCommerceConfigAction(
  projectId: string
): Promise<Result> {
  const client = await clientFor(projectId);
  if (!client) return { ok: false, error: 'Session missing.' };

  try {
    await client.project(DeleteCommerceConfigDocument, { projectId });
    revalidatePath(`/${projectId}/settings/commerce`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}
