import type { GraphDetail } from '@repo/product-graph';
import type { CubeHydrateInput } from './hydrate.js';
import {
  createCameraSlice,
  createProductSlice,
  createSelectionSlice,
  createSessionSlice,
  createStatusSlice,
  createWorkspaceSlice,
  type CameraSlice,
  type ProductSlice,
  type SelectionSlice,
  type SessionSlice,
  type StatusSlice,
  type WorkspaceSlice,
} from './slices/index.js';
import { EMPTY_WORKSPACE } from './slices/workspace.js';
import type { CubeGet, CubeSet } from './types.js';

export type CubeLifecycle = {
  hydrate: (input: CubeHydrateInput) => void;
  resetSession: () => void;
  resetWorkspace: () => void;
};

export type CubeStore = SessionSlice &
  WorkspaceSlice &
  ProductSlice &
  SelectionSlice &
  StatusSlice &
  CameraSlice &
  CubeLifecycle;

export function composeCubeSlices<T extends CubeStore>(
  set: CubeSet<T>,
  get: CubeGet<T>
): CubeStore {
  const product = createProductSlice(set);
  const selection = createSelectionSlice(set);

  return {
    ...createSessionSlice(set),
    ...createWorkspaceSlice(set),
    ...product,
    ...selection,
    ...createStatusSlice(set),
    ...createCameraSlice(set, get),
    setGraphDetail: (graphDetail: GraphDetail | null) => {
      product.setGraphDetail(graphDetail);
      selection.clearSelection();
    },
    hydrate: (input) => {
      const patch: Record<string, unknown> = {};
      if (input.session) {
        for (const [key, value] of Object.entries(input.session)) {
          if (value !== undefined) {
            patch[key] = value;
          }
        }
      }
      if (input.workspace) {
        for (const [key, value] of Object.entries(input.workspace)) {
          if (value !== undefined) {
            patch[key] = value;
          }
        }
      }
      if (input.graphDetail !== undefined) {
        patch.graphDetail = input.graphDetail;
        patch.selection = {};
      }
      set(patch as Partial<T>);
    },
    resetSession: () =>
      set({
        graphAuth: null,
        userName: null,
        email: null,
        role: null,
      } as Partial<T>),
    resetWorkspace: () => set(EMPTY_WORKSPACE as Partial<T>),
  };
}
