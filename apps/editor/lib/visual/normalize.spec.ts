import {
  normalizeVisualDocument,
  VisualNormalizeError,
} from './normalize';
import type { NormalizeVisualDocumentInput } from './types';

function baseInput(
  overrides?: Partial<NormalizeVisualDocumentInput>
): NormalizeVisualDocumentInput {
  return {
    productRevisionId: 'rev-1',
    model: {
      id: 'model-1',
      assetId: 'asset-1',
      targets: [
        {
          id: 't-frame',
          key: 'frame',
          nodePath: 'Chair/Frame',
          materialSlot: 'frame',
        },
        {
          id: 't-body',
          key: 'body',
          nodePath: 'Chair/Seat',
          materialSlot: 'body',
        },
        {
          id: 't-back',
          key: 'backrest',
          nodePath: 'Chair/Backrest',
        },
      ],
    },
    choices: [
      {
        id: 'c-frame',
        key: 'frame',
        values: [
          { id: 'v-walnut', key: 'walnut' },
          { id: 'v-oak', key: 'oak' },
        ],
      },
      {
        id: 'c-color',
        key: 'color',
        values: [
          { id: 'v-black', key: 'black' },
          { id: 'v-white', key: 'white' },
        ],
      },
      {
        id: 'c-finish',
        key: 'finish',
        values: [{ id: 'v-premium', key: 'premium' }],
      },
    ],
    visualEffects: [
      {
        id: 'e1',
        choiceValueId: 'v-walnut',
        modelTargetId: 't-frame',
        operation: 'SET_MATERIAL',
        valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut' }),
      },
      {
        id: 'e2',
        choiceValueId: 'v-oak',
        modelTargetId: 't-frame',
        operation: 'SET_MATERIAL',
        valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak' }),
      },
      {
        id: 'e3',
        choiceValueId: 'v-black',
        modelTargetId: 't-body',
        operation: 'SET_MATERIAL',
        valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-black' }),
      },
      {
        id: 'e4',
        choiceValueId: 'v-walnut',
        modelTargetId: 't-back',
        operation: 'SET_VISIBILITY',
        valueJson: 'true',
      },
    ],
    ...overrides,
  };
}

describe('normalizeVisualDocument', () => {
  it('resolves choiceKey/valueKey/targetKey and typed bindings', () => {
    const doc = normalizeVisualDocument(baseInput());
    expect(doc.productRevisionId).toBe('rev-1');
    expect(doc.productModelId).toBe('model-1');
    expect(doc.assetId).toBe('asset-1');
    expect(doc.targets).toHaveLength(3);
    expect(doc.bindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          choiceKey: 'frame',
          valueKey: 'walnut',
          targetKey: 'frame',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'mat-walnut',
          materialSlot: 'frame',
        }),
        expect.objectContaining({
          choiceKey: 'frame',
          valueKey: 'walnut',
          targetKey: 'backrest',
          operation: 'SET_VISIBILITY',
          visible: true,
        }),
      ])
    );
    expect(doc.unsupported).toEqual([]);
  });

  it('reports unsupported SET_MODEL without executing it as a binding', () => {
    const doc = normalizeVisualDocument(
      baseInput({
        visualEffects: [
          {
            id: 'e-model',
            choiceValueId: 'v-walnut',
            modelTargetId: 't-frame',
            operation: 'SET_MODEL',
            valueJson: JSON.stringify({ modelAssetId: 'other' }),
          },
        ],
      })
    );
    expect(doc.bindings).toEqual([]);
    expect(doc.unsupported).toEqual([
      {
        effectId: 'e-model',
        operation: 'SET_MODEL',
        reason: 'SET_MODEL is unsupported in v1',
      },
    ]);
  });

  it('allows same address + different values of same Choice', () => {
    const doc = normalizeVisualDocument(baseInput());
    const frameMaterials = doc.bindings.filter(
      (b) => b.operation === 'SET_MATERIAL' && b.targetKey === 'frame'
    );
    expect(frameMaterials).toHaveLength(2);
  });

  it('rejects same address + same ChoiceValue duplicated', () => {
    expect(() =>
      normalizeVisualDocument(
        baseInput({
          visualEffects: [
            {
              id: 'e1',
              choiceValueId: 'v-walnut',
              modelTargetId: 't-frame',
              operation: 'SET_MATERIAL',
              valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-a' }),
            },
            {
              id: 'e2',
              choiceValueId: 'v-walnut',
              modelTargetId: 't-frame',
              operation: 'SET_MATERIAL',
              valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-b' }),
            },
          ],
        })
      )
    ).toThrow(VisualNormalizeError);
  });

  it('allows same address + different Choices (selection last-wins at derive time)', () => {
    const doc = normalizeVisualDocument(
      baseInput({
        visualEffects: [
          {
            id: 'e1',
            choiceValueId: 'v-walnut',
            modelTargetId: 't-frame',
            operation: 'SET_MATERIAL',
            valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-a' }),
          },
          {
            id: 'e2',
            choiceValueId: 'v-premium',
            modelTargetId: 't-frame',
            operation: 'SET_MATERIAL',
            valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-b' }),
          },
        ],
      })
    );
    const frameMaterials = doc.bindings.filter(
      (b) => b.operation === 'SET_MATERIAL' && b.targetKey === 'frame'
    );
    expect(frameMaterials).toHaveLength(2);
  });

  it('rejects targets missing nodePath', () => {
    expect(() =>
      normalizeVisualDocument(
        baseInput({
          model: {
            id: 'model-1',
            assetId: 'asset-1',
            targets: [{ id: 't-bad', key: 'bad', nodePath: null }],
          },
          visualEffects: [],
        })
      )
    ).toThrow(/nodePath/);
  });
});
