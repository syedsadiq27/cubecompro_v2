import type { Selection } from '@repo/product-graph';
import type { CubeSet } from '../types.js';

export type SelectionSlice = {
  selection: Selection;
  setChoiceValue: (choiceKey: string, valueKey: string) => void;
  setSelection: (selection: Selection) => void;
  clearSelection: () => void;
};

export const createSelectionSlice = <T extends SelectionSlice>(
  set: CubeSet<T>
): SelectionSlice => ({
  selection: {},
  setChoiceValue: (choiceKey, valueKey) =>
    set(
      (state) =>
        ({
          selection: {
            ...state.selection,
            [choiceKey]: valueKey,
          },
        }) as Partial<T>
    ),
  setSelection: (selection) => set({ selection } as Partial<T>),
  clearSelection: () => set({ selection: {} } as Partial<T>),
});
