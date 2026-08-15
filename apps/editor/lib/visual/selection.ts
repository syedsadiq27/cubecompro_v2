import type { GraphDetail } from '@repo/product-graph';
import type { VisualSelection } from './types';

export function defaultVisualSelection(
  detail: GraphDetail | null
): VisualSelection {
  if (!detail) return {};
  const selection: VisualSelection = {};
  for (const choice of detail.choices) {
    const first = choice.values[0];
    if (first) selection[choice.key] = first.key;
  }
  return selection;
}
