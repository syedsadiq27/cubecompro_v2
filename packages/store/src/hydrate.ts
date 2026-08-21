import type { GraphDetail, GraphSessionAuth } from '@repo/product-graph';
import type { SessionProfile } from './slices/session.js';
import type { WorkspaceIds } from './slices/workspace.js';

export type CubeHydrateInput = {
  session?: Partial<SessionProfile & { graphAuth: GraphSessionAuth | null }>;
  workspace?: WorkspaceIds;
  graphDetail?: GraphDetail | null;
};

export type CubeHydrateUnmount =
  | 'session'
  | 'workspace'
  | 'product'
  | 'organization';
