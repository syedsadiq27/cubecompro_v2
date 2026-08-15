import { formatVisualAddress } from './address';
import type {
  VisualBaseline,
  VisualDocument,
  VisualSelection,
  VisualState,
} from './types';

function emptyTargetState(): {
  materialAssetId?: string;
  visible?: boolean;
} {
  return {};
}

export function deriveVisualState(
  baseline: VisualBaseline,
  document: VisualDocument,
  selection: VisualSelection,
  options?: { productRevisionId?: string }
): VisualState {
  const expectedRevision =
    options?.productRevisionId ?? document.productRevisionId;
  if (expectedRevision !== document.productRevisionId) {
    throw new Error(
      `VisualDocument revision mismatch: document=${document.productRevisionId} selectionRevision=${expectedRevision}`
    );
  }

  const targets: VisualState['targets'] = {};

  for (const target of document.targets) {
    const current = emptyTargetState();
    const visibilityAddress = formatVisualAddress({
      targetKey: target.key,
      property: 'visibility',
    });
    const visibility = baseline[visibilityAddress]?.visible;
    if (visibility !== undefined) {
      current.visible = visibility;
    }
    targets[target.key] = current;
  }

  for (const binding of document.bindings) {
    if (selection[binding.choiceKey] !== binding.valueKey) continue;
    const current = targets[binding.targetKey] ?? emptyTargetState();
    if (binding.operation === 'SET_VISIBILITY') {
      current.visible = binding.visible;
    } else {
      current.materialAssetId = binding.materialAssetId;
    }
    targets[binding.targetKey] = current;
  }

  return { targets };
}

export function deriveBaselineVisualState(
  baseline: VisualBaseline,
  document: VisualDocument
): VisualState {
  return deriveVisualState(baseline, document, {});
}
