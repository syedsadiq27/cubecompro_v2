import {
  deriveVisualState,
  PRODUCT_MODEL_ROOT_ASSET_KEY,
} from './state.js';

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
          assetRevisionId: 'mar_walnut',
        },
      ],
    });

    expect(state.rootObjectAssetRevisionId).toBe('oar_root');
    expect(state.assetUniverse.objects).toHaveLength(2);
    expect(state.assetUniverse.materials).toHaveLength(1);
    expect(state.activeAssets.objectAssetRevisionIds).toEqual(['oar_root']);
    expect(state.activeAssets.objectReplacements).toEqual([]);
    expect(state.structure).toEqual({});
    expect(state.activeAssets.materialAssetRevisionIds).toEqual([]);
    expect(state.activeAssets.materialAssignments).toEqual([]);
    expect(state.rootSurfaces).toEqual({});
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
    expect(state.structure).toEqual({ legs: 'oar_wood' });
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

  it('does not activate MATERIAL registry membership alone', () => {
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
          assetRevisionId: 'mar_walnut',
        },
      ],
      selection: { finish: 'walnut' },
      bindings: [],
    });

    expect(state.activeAssets.materialAssetRevisionIds).toEqual([]);
  });

  it('activates SET_MATERIAL via explicit binding + selection', () => {
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
          assetRevisionId: 'mar_walnut_4',
        },
        {
          role: 'MATERIAL',
          key: 'marble',
          assetRevisionId: 'mar_marble_2',
        },
      ],
      selection: { finish: 'walnut' },
      bindings: [
        {
          choiceKey: 'finish',
          choiceValueKey: 'walnut',
          targetKey: 'seat',
          materialSlot: '0',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mar_walnut_4',
        },
        {
          choiceKey: 'finish',
          choiceValueKey: 'marble',
          targetKey: 'seat',
          materialSlot: '0',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mar_marble_2',
        },
      ],
      textureRevisionsByMaterialRevisionId: {
        mar_walnut_4: ['tar_base_8', 'tar_normal_3'],
      },
    });

    expect(state.activeAssets.materialAssignments).toEqual([
      {
        targetKey: 'seat',
        materialSlot: '0',
        materialAssetRevisionId: 'mar_walnut_4',
      },
    ]);
    expect(state.rootSurfaces).toEqual({
      seat: {
        materialSlot: '0',
        materialAssetRevisionId: 'mar_walnut_4',
      },
    });
    expect(state.activeAssets.materialAssetRevisionIds).toEqual([
      'mar_walnut_4',
    ]);
    expect(state.activeAssets.textureAssetRevisionIds).toEqual([
      'tar_base_8',
      'tar_normal_3',
    ]);
  });

  it('rejects SET_MATERIAL outside MATERIAL registry when registry is non-empty', () => {
    expect(() =>
      deriveVisualState({
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
            assetRevisionId: 'mar_walnut_4',
          },
        ],
        selection: { finish: 'walnut' },
        bindings: [
          {
            choiceKey: 'finish',
            choiceValueKey: 'walnut',
            targetKey: 'seat',
            operation: 'SET_MATERIAL',
            materialAssetRevisionId: 'mar_foreign',
          },
        ],
      })
    ).toThrow(/outside this ProductModel MATERIAL registry/);
  });

  it('applies staticSetup with empty selection (ProductModel default)', () => {
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
          assetRevisionId: 'mar_walnut',
        },
      ],
      selection: {},
      staticSetup: [
        {
          targetKey: 'top',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mar_walnut',
        },
      ],
    });
    expect(state.rootSurfaces.top?.materialAssetRevisionId).toBe('mar_walnut');
    expect(state.activeAssets.materialAssetRevisionIds).toEqual(['mar_walnut']);
  });

  it('lets selection bindings override staticSetup on the same target', () => {
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
          assetRevisionId: 'mar_walnut',
        },
        {
          role: 'MATERIAL',
          key: 'oak',
          assetRevisionId: 'mar_oak',
        },
      ],
      staticSetup: [
        {
          targetKey: 'top',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mar_walnut',
        },
      ],
      selection: { finish: 'oak' },
      bindings: [
        {
          choiceKey: 'finish',
          choiceValueKey: 'oak',
          targetKey: 'top',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mar_oak',
        },
      ],
    });
    expect(state.rootSurfaces.top?.materialAssetRevisionId).toBe('mar_oak');
  });
});
