import type { GraphDetail } from '@repo/product-graph';
import type { CubeSet } from '../types.js';

export type ProductSlice = {
  graphDetail: GraphDetail | null;
  setGraphDetail: (graphDetail: GraphDetail | null) => void;
};

export const createProductSlice = <T extends ProductSlice>(
  set: CubeSet<T>
): ProductSlice => ({
  graphDetail: null,
  setGraphDetail: (graphDetail) => set({ graphDetail } as Partial<T>),
});
