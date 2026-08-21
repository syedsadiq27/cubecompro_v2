import type { CubeSet } from '../types.js';

export type WorkspaceIds = {
  projectId?: string;
  projectName?: string;
  productId?: string;
  modelId?: string;
  organizationId?: string;
  organizationName?: string;
};

export type WorkspaceSlice = WorkspaceIds & {
  setIds: (ids: WorkspaceIds) => void;
};

export const EMPTY_WORKSPACE: WorkspaceIds = {
  projectId: undefined,
  projectName: undefined,
  productId: undefined,
  modelId: undefined,
  organizationId: undefined,
  organizationName: undefined,
};

export const createWorkspaceSlice = <T extends WorkspaceSlice>(
  set: CubeSet<T>
): WorkspaceSlice => ({
  ...EMPTY_WORKSPACE,
  setIds: (ids) => set(ids as Partial<T>),
});
