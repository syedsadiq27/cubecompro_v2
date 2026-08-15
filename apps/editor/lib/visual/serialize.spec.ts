import {
  bindingSemanticKey,
  bindingsEqualForPersist,
  diffVisualBindings,
  serializeBindingValueJson,
} from './serialize';
import type { VisualBinding } from './types';

describe('visual serialize / diff', () => {
  const walnut: VisualBinding = {
    choiceKey: 'frame',
    valueKey: 'walnut',
    targetKey: 'frame',
    operation: 'SET_MATERIAL',
    materialAssetId: 'mat-a',
    effectId: 'e1',
  };
  const oak: VisualBinding = {
    choiceKey: 'frame',
    valueKey: 'oak',
    targetKey: 'frame',
    operation: 'SET_MATERIAL',
    materialAssetId: 'mat-b',
    effectId: 'e2',
  };

  it('serializes material and visibility payloads', () => {
    expect(serializeBindingValueJson(walnut)).toBe(
      JSON.stringify({ materialAssetId: 'mat-a' })
    );
    expect(
      serializeBindingValueJson({
        choiceKey: 'back',
        valueKey: 'off',
        targetKey: 'backrest',
        operation: 'SET_VISIBILITY',
        visible: false,
      })
    ).toBe('false');
  });

  it('diffs create update delete by semantic key', () => {
    const desired: VisualBinding[] = [
      { ...walnut, materialAssetId: 'mat-a2' },
      {
        choiceKey: 'color',
        valueKey: 'black',
        targetKey: 'seat',
        operation: 'SET_MATERIAL',
        materialAssetId: 'mat-black',
      },
    ];
    const current: VisualBinding[] = [walnut, oak];
    const ops = diffVisualBindings({ desired, current });
    expect(ops).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'update', effectId: 'e1' }),
        expect.objectContaining({ type: 'create' }),
        expect.objectContaining({ type: 'delete', effectId: 'e2' }),
      ])
    );
    expect(ops).toHaveLength(3);
  });

  it('treats equal material bindings as no-op', () => {
    expect(bindingsEqualForPersist(walnut, { ...walnut })).toBe(true);
    expect(
      bindingsEqualForPersist(walnut, { ...walnut, materialAssetId: 'x' })
    ).toBe(false);
    expect(bindingSemanticKey(walnut)).toContain('frame');
  });
});
