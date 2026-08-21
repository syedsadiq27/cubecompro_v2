import {
  buildCoverageRows,
  effectCountForChoiceValue,
  isRevisionEditable,
  validateEffectTarget,
} from './authoring-focus';
import type { VisualDocument } from './visual/types';

describe('authoring-focus', () => {
  const document: VisualDocument = {
    productRevisionId: 'rev',
    productModelId: 'pm',
    assetId: 'a',
    rootObjectAssetRevisionId: 'root',
    linkedAssets: [],
    targets: [
      { key: 'table-top', nodePath: 'Table/Top' },
      { key: 'legs', nodePath: 'Table/Legs' },
    ],
    setups: [],
    bindings: [
      {
        choiceKey: 'top_material',
        valueKey: 'walnut',
        targetKey: 'table-top',
        operation: 'SET_MATERIAL',
        materialAssetRevisionId: 'mat_1',
      },
      {
        choiceKey: 'top_material',
        valueKey: 'walnut',
        targetKey: 'legs',
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey: 'wood_legs',
        expectedRole: 'OBJECT',
      },
    ],
    unsupported: [],
  };

  it('counts effects per choice value', () => {
    expect(effectCountForChoiceValue(document, 'top_material', 'walnut')).toBe(
      2
    );
    expect(effectCountForChoiceValue(document, 'top_material', 'oak')).toBe(0);
  });

  it('builds coverage from graph choices', () => {
    const rows = buildCoverageRows(
      {
        id: 'rev',
        version: 1,
        status: 'DRAFT',
        choices: [
          {
            id: 'c1',
            key: 'top_material',
            name: 'Top Material',
            type: 'MATERIAL',
            required: true,
            sortOrder: 0,
            values: [
              { id: 'v1', key: 'walnut', name: 'Walnut', sortOrder: 0 },
              { id: 'v2', key: 'oak', name: 'Oak', sortOrder: 1 },
            ],
          },
        ],
        rules: [],
        constraints: [],
        models: [],
        visualEffects: [],
        variants: [],
      },
      document
    );
    expect(rows[0]?.values[0]).toMatchObject({
      valueName: 'Walnut',
      effectCount: 2,
      unbound: false,
    });
    expect(rows[0]?.values[1]?.unbound).toBe(true);
  });

  it('treats only DRAFT as editable', () => {
    expect(isRevisionEditable('DRAFT')).toBe(true);
    expect(isRevisionEditable('PUBLISHED')).toBe(false);
  });

  it('rejects SET_MATERIAL under replaceable subtree', () => {
    const withNestedSurface: VisualDocument = {
      ...document,
      targets: [
        ...document.targets,
        { key: 'leg-cap', nodePath: 'Table/Legs/Cap' },
      ],
    };
    const result = validateEffectTarget({
      document: withNestedSurface,
      operation: 'SET_MATERIAL',
      targetKey: 'leg-cap',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/replaceable component/);
    }
  });
});
