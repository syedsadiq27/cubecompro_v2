import type { CubeSet } from '../types.js';

export type StatusSlice = {
  loading: boolean;
  loadError: string | null;
  statusMessage: string | null;
  dirty: boolean;
  setLoading: (loading: boolean) => void;
  setLoadError: (loadError: string | null) => void;
  setStatusMessage: (statusMessage: string | null) => void;
  markDirty: () => void;
  markClean: () => void;
};

export const createStatusSlice = <T extends StatusSlice>(
  set: CubeSet<T>
): StatusSlice => ({
  loading: false,
  loadError: null,
  statusMessage: null,
  dirty: false,
  setLoading: (loading) => set({ loading } as Partial<T>),
  setLoadError: (loadError) => set({ loadError } as Partial<T>),
  setStatusMessage: (statusMessage) => set({ statusMessage } as Partial<T>),
  markDirty: () => set({ dirty: true } as Partial<T>),
  markClean: () => set({ dirty: false } as Partial<T>),
});
