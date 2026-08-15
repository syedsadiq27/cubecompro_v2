import { documentsMatchForSaveProof } from './persist';
import { serializeBindingValueJson } from './serialize';
import type { VisualDocument } from './types';

describe('documentsMatchForSaveProof', () => {
  const base: VisualDocument = {
    productRevisionId: 'rev-a',
    productModelId: 'model-a',
    assetId: 'asset-a',
    targets: [{ key: 'frame', nodePath: 'Frame' }],
    bindings: [
      {
        choiceKey: 'frame',
        valueKey: 'walnut',
        targetKey: 'frame',
        operation: 'SET_MATERIAL',
        materialAssetId: 'mat-walnut',
        effectId: 'e1',
      },
      {
        choiceKey: 'back',
        valueKey: 'off',
        targetKey: 'frame',
        operation: 'SET_VISIBILITY',
        visible: false,
        effectId: 'e2',
      },
    ],
    unsupported: [],
  };

  it('matches across revision/effect id remaps', () => {
    const reloaded: VisualDocument = {
      ...base,
      productRevisionId: 'rev-draft',
      bindings: base.bindings.map((binding, index) => ({
        ...binding,
        effectId: `draft-${index}`,
      })),
    };
    expect(documentsMatchForSaveProof(base, reloaded)).toBe(true);
  });

  it('fails when a material payload changes', () => {
    const material = base.bindings[0];
    if (!material || material.operation !== 'SET_MATERIAL') {
      throw new Error('expected material binding');
    }
    const visibility = base.bindings[1];
    if (!visibility) {
      throw new Error('expected visibility binding');
    }
    const changed: VisualDocument = {
      ...base,
      bindings: [{ ...material, materialAssetId: 'mat-oak' }, visibility],
    };
    expect(documentsMatchForSaveProof(base, changed)).toBe(false);
  });

  it('serializes visibility as JSON boolean', () => {
    const visibility = base.bindings[1];
    if (!visibility) {
      throw new Error('expected visibility binding');
    }
    expect(serializeBindingValueJson(visibility)).toBe('false');
  });
});
