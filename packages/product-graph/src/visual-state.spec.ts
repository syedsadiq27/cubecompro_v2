import {
  deriveVisualState,
  PRODUCT_MODEL_ROOT_ASSET_KEY,
} from './visual-state.js';

describe('deriveVisualState', () => {
  it('requires a root object revision', () => {
    expect(() =>
      deriveVisualState({
        rootObjectAssetRevisionId: '',
        linkedAssets: [],
      })
    ).toThrow(/rootObjectAssetRevisionId/);
  });

  it('exposes assetUniverse and activates only the root without bindings', () => {
    const state = deriveVisualState({
      rootObjectAssetRevisionId: 'oar_root',
      linkedAssets: [
        {
          role: 'OBJECT',
          key: PRODUCT_MODEL_ROOT_ASSET_KEY,
          assetRevisionId: 'oar_root',
        },
        {
          role: 'OBJECT',
          key: 'pedestal-base',
          assetRevisionId: 'oar_pedestal',
        },
        {
          role: 'MATERIAL',
          key: 'walnut',
          assetRevisionId: 'mat_walnut',
        },
      ],
    });

    expect(state.rootObjectAssetRevisionId).toBe('oar_root');
    expect(state.assetUniverse.objects).toHaveLength(2);
    expect(state.assetUniverse.materials).toHaveLength(1);
    expect(state.activeAssets.objectAssetRevisionIds).toEqual(['oar_root']);
    expect(state.activeAssets.objectReplacements).toEqual([]);
    expect(state.activeAssets.materialAssetRevisionIds).toEqual([]);
  });

  it('rejects a broken OBJECT/root mirror', () => {
    expect(() =>
      deriveVisualState({
        rootObjectAssetRevisionId: 'oar_root',
        linkedAssets: [
          {
            role: 'OBJECT',
            key: PRODUCT_MODEL_ROOT_ASSET_KEY,
            assetRevisionId: 'oar_other',
          },
        ],
      })
    ).toThrow(/mechanical mirror|must equal/i);
  });

  it('activates REPLACE_COMPONENT only via explicit binding + selection', () => {
    const state = deriveVisualState({
      rootObjectAssetRevisionId: 'oar_root',
      linkedAssets: [
        {
          role: 'OBJECT',
          key: PRODUCT_MODEL_ROOT_ASSET_KEY,
          assetRevisionId: 'oar_root',
        },
        {
          role: 'OBJECT',
          key: 'wood-legs',
          assetRevisionId: 'oar_wood',
        },
        {
          role: 'OBJECT',
          key: 'metal-legs',
          assetRevisionId: 'oar_metal',
        },
      ],
      selection: { legStyle: 'wood' },
      bindings: [
        {
          choiceKey: 'legStyle',
          choiceValueKey: 'wood',
          targetKey: 'legs',
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: 'wood-legs',
          expectedRole: 'OBJECT',
        },
        {
          choiceKey: 'legStyle',
          choiceValueKey: 'metal',
          targetKey: 'legs',
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: 'metal-legs',
          expectedRole: 'OBJECT',
        },
      ],
    });

    expect(state.activeAssets.objectReplacements).toEqual([
      {
        targetKey: 'legs',
        linkedAssetKey: 'wood-legs',
        objectAssetRevisionId: 'oar_wood',
      },
    ]);
    expect(state.activeAssets.objectAssetRevisionIds).toEqual([
      'oar_root',
      'oar_wood',
    ]);
  });

  it('does not activate by key coincidence with the selected value', () => {
    const state = deriveVisualState({
      rootObjectAssetRevisionId: 'oar_root',
      linkedAssets: [
        {
          role: 'OBJECT',
          key: PRODUCT_MODEL_ROOT_ASSET_KEY,
          assetRevisionId: 'oar_root',
        },
        {
          role: 'OBJECT',
          key: 'wood',
          assetRevisionId: 'oar_wood',
        },
      ],
      selection: { legStyle: 'wood' },
      bindings: [],
    });

    expect(state.activeAssets.objectAssetRevisionIds).toEqual(['oar_root']);
    expect(state.activeAssets.objectReplacements).toEqual([]);
  });

  it('never activates MATERIAL links even when selected', () => {
    const state = deriveVisualState({
      rootObjectAssetRevisionId: 'oar_root',
      linkedAssets: [
        {
          role: 'OBJECT',
          key: PRODUCT_MODEL_ROOT_ASSET_KEY,
          assetRevisionId: 'oar_root',
        },
        {
          role: 'MATERIAL',
          key: 'walnut',
          assetRevisionId: 'mat_walnut',
        },
      ],
      selection: { finish: 'walnut' },
      bindings: [],
    });

    expect(state.activeAssets.materialAssetRevisionIds).toEqual([]);
  });
});
