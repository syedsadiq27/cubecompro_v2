'use client';

import { useLayoutEffect } from 'react';
import type { CubeHydrateInput, CubeHydrateUnmount } from './hydrate.js';
import type { CubeStore } from './compose.js';
import type { WorkspaceIds } from './slices/workspace.js';

const WORKSPACE_KEYS: (keyof WorkspaceIds)[] = [
  'projectId',
  'projectName',
  'productId',
  'modelId',
  'organizationId',
  'organizationName',
];

export function useHydrateCubeStore(
  getStore: () => CubeStore,
  input: CubeHydrateInput,
  unmount?: CubeHydrateUnmount
) {
  const userName = input.session?.userName ?? null;
  const email = input.session?.email ?? null;
  const role = input.session?.role ?? null;
  const graphAuth = input.session?.graphAuth ?? null;
  const hasSession = input.session !== undefined;
  const workspace = input.workspace;
  const hasWorkspace = workspace !== undefined;
  const graphDetail = input.graphDetail;
  const hasGraphDetail = input.graphDetail !== undefined;
  const graphId = graphDetail?.id ?? null;
  const workspaceKey = hasWorkspace
    ? WORKSPACE_KEYS.map((key) => `${key}:${workspace?.[key] ?? ''}`).join('|')
    : '';

  useLayoutEffect(() => {
    const next: CubeHydrateInput = {};
    if (hasSession) {
      next.session = { userName, email, role };
      if (graphAuth) {
        next.session.graphAuth = graphAuth;
      }
    }
    if (hasWorkspace && workspace) {
      const nextWorkspace: WorkspaceIds = {};
      for (const key of WORKSPACE_KEYS) {
        if (key in workspace && workspace[key] !== undefined) {
          nextWorkspace[key] = workspace[key];
        }
      }
      next.workspace = nextWorkspace;
    }
    if (hasGraphDetail) {
      next.graphDetail = graphDetail ?? null;
    }
    getStore().hydrate(next);
    return () => {
      const store = getStore();
      if (unmount === 'session') {
        store.resetSession();
        return;
      }
      if (unmount === 'workspace') {
        store.resetWorkspace();
        return;
      }
      if (unmount === 'product') {
        store.setIds({ productId: undefined, modelId: undefined });
        store.setGraphDetail(null);
        return;
      }
      if (unmount === 'organization') {
        store.setIds({
          organizationId: undefined,
          organizationName: undefined,
        });
      }
    };
  }, [
    email,
    getStore,
    graphAuth,
    graphDetail,
    graphId,
    hasGraphDetail,
    hasSession,
    hasWorkspace,
    role,
    unmount,
    userName,
    workspaceKey,
  ]);
}
