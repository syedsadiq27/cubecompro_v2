import {
  buildVisualMappingCatalog,
  buildVisualMappingChoices,
  formatAssetRevisionLabel,
  humanizeVisualKey,
} from './mappings.js';
import type { GraphDetail } from '../graph/types.js';

function detail(overrides: Partial<GraphDetail> = {}): GraphDetail {
  return {
    id: 'rev-1',
    version: 1,
    status: 'DRAFT',
    choices: [],
    rules: [],
    constraints: [],
    models: [],
    visualEffects: [],
    variants: [],
    ...overrides,
  };
}

describe('visual-mappings', () => {
  it('humanizes semantic keys without exposing paths', () => {
    expect(humanizeVisualKey('table_top')).toBe('Table Top');
    expect(humanizeVisualKey('left-panel')).toBe('Left Panel');
    expect(formatAssetRevisionLabel({ name: 'American Walnut', version: 4 })).toBe(
      'American Walnut · v4'
    );
  });

  it('groups Choice → ChoiceValue → VisualEffects with coverage', () => {
    const graph = detail({
      choices: [
        {
          id: 'c-top',
          key: 'top_material',
          name: 'Top Material',
          type: 'SELECT',
          required: true,
          sortOrder: 0,
          values: [
            { id: 'v-walnut', key: 'walnut', name: 'Walnut', sortOrder: 0 },
            { id: 'v-oak', key: 'oak', name: 'Oak', sortOrder: 1 },
            { id: 'v-marble', key: 'marble', name: 'Marble', sortOrder: 2 },
          ],
        },
      ],
      models: [
        {
          id: 'm1',
          key: 'primary',
          name: 'Table',
          assetId: 'obj-1',
          objectAssetRevisionId: 'obj-rev-1',
          linkedAssets: [],
          targets: [
            { id: 't-top', key: 'table_top', targetType: 'MATERIAL' },
            { id: 't-left', key: 'left_panel', targetType: 'MATERIAL' },
            { id: 't-right', key: 'right_panel', targetType: 'MATERIAL' },
            { id: 't-badge', key: 'wood_badge', targetType: 'VISIBILITY' },
          ],
          visualSetups: [
            {
              id: 'setup-1',
              productModelId: 'm1',
              modelTargetId: 't-top',
              operation: 'SET_MATERIAL',
              valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-static' }),
            },
          ],
        },
      ],
      visualEffects: [
        {
          id: 'e1',
          choiceValueId: 'v-walnut',
          modelTargetId: 't-top',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut-4' }),
        },
        {
          id: 'e2',
          choiceValueId: 'v-walnut',
          modelTargetId: 't-left',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut-4' }),
        },
        {
          id: 'e3',
          choiceValueId: 'v-walnut',
          modelTargetId: 't-right',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut-4' }),
        },
        {
          id: 'e4',
          choiceValueId: 'v-walnut',
          modelTargetId: 't-badge',
          operation: 'SET_VISIBILITY',
          valueJson: 'true',
        },
        {
          id: 'e5',
          choiceValueId: 'v-oak',
          modelTargetId: 't-top',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak-2' }),
        },
        {
          id: 'e6',
          choiceValueId: 'v-oak',
          modelTargetId: 't-left',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak-2' }),
        },
        {
          id: 'e7',
          choiceValueId: 'v-oak',
          modelTargetId: 't-right',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak-2' }),
        },
      ],
    });

    const catalog = buildVisualMappingCatalog({
      materialAssets: [
        {
          id: 'mat-walnut',
          name: 'American Walnut',
          currentRevisionId: 'mat-walnut-4',
          version: 4,
        },
        {
          id: 'mat-oak',
          name: 'Natural Oak',
          currentRevisionId: 'mat-oak-2',
          version: 2,
        },
      ],
    });

    const [choice] = buildVisualMappingChoices(graph, catalog);
    expect(choice.name).toBe('Top Material');
    expect(choice.coverageLabel).toBe('3 values · 2 mapped · 1 unbound');

    const [walnut, oak, marble] = choice.values;
    expect(walnut.effectCount).toBe(2);
    expect(walnut.groups).toHaveLength(2);
    expect(walnut.groups[0]).toMatchObject({
      operation: 'SET_MATERIAL',
      resourceLabel: 'American Walnut · v4',
    });
    expect(walnut.groups[0].targets.map((target) => target.name)).toEqual([
      'Table Top',
      'Left Panel',
      'Right Panel',
    ]);
    expect(walnut.groups[1]).toMatchObject({
      operation: 'SET_VISIBILITY',
      resultLabel: 'Visible',
    });
    expect(walnut.groups[1].targets.map((target) => target.name)).toEqual([
      'Wood Badge',
    ]);

    expect(oak.groups).toHaveLength(1);
    expect(oak.groups[0].resourceLabel).toBe('Natural Oak · v2');
    expect(oak.groups[0].targets).toHaveLength(3);

    expect(marble.unbound).toBe(true);
    expect(marble.compactSummary).toBe('UNBOUND');
    expect(marble.groups).toHaveLength(0);
    expect(choice.simpleMaterial.eligible).toBe(false);
    expect(walnut.simpleMaterial.eligible).toBe(false);
    expect(choice.batch.eligible).toBe(false);
    expect(walnut.simpleBind.eligible).toBe(false);
  });

  it('marks single-target SET_MATERIAL choices as inline-eligible', () => {
    const graph = detail({
      choices: [
        {
          id: 'c-top',
          key: 'top_material',
          name: 'Top Material',
          type: 'SELECT',
          required: true,
          sortOrder: 0,
          values: [
            { id: 'v-walnut', key: 'walnut', name: 'Walnut', sortOrder: 0 },
            { id: 'v-oak', key: 'oak', name: 'Oak', sortOrder: 1 },
            { id: 'v-marble', key: 'marble', name: 'Marble', sortOrder: 2 },
          ],
        },
      ],
      models: [
        {
          id: 'm1',
          key: 'primary',
          name: 'Table',
          assetId: 'obj-1',
          objectAssetRevisionId: 'obj-rev-1',
          linkedAssets: [],
          targets: [
            { id: 't-top', key: 'table_top', targetType: 'MATERIAL' },
          ],
        },
      ],
      visualEffects: [
        {
          id: 'e1',
          choiceValueId: 'v-walnut',
          modelTargetId: 't-top',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut-4' }),
        },
        {
          id: 'e2',
          choiceValueId: 'v-oak',
          modelTargetId: 't-top',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak-2' }),
        },
      ],
    });
    const catalog = buildVisualMappingCatalog({
      materialAssets: [
        {
          id: 'mat-walnut',
          name: 'American Walnut',
          currentRevisionId: 'mat-walnut-4',
          version: 4,
        },
        {
          id: 'mat-oak',
          name: 'Natural Oak',
          currentRevisionId: 'mat-oak-2',
          version: 2,
        },
      ],
    });
    const [choice] = buildVisualMappingChoices(graph, catalog);
    expect(choice.simpleMaterial).toEqual({
      eligible: true,
      sharedTargetId: 't-top',
    });
    expect(choice.batch).toEqual({
      eligible: true,
      operation: 'SET_MATERIAL',
      sharedTargetId: 't-top',
    });
    expect(choice.values[0].simpleBind).toMatchObject({
      eligible: true,
      operation: 'SET_MATERIAL',
      targetId: 't-top',
      resourceId: 'mat-walnut-4',
    });
    expect(choice.values[0].simpleMaterial).toMatchObject({
      eligible: true,
      targetId: 't-top',
      effectId: 'e1',
      materialAssetRevisionId: 'mat-walnut-4',
    });
    expect(choice.values[2].simpleMaterial.eligible).toBe(true);
    expect(choice.values[2].unbound).toBe(true);
  });

  it('resolves REPLACE_COMPONENT from linked object revisions, not names', () => {
    const graph = detail({
      choices: [
        {
          id: 'c-base',
          key: 'base_style',
          name: 'Base Style',
          type: 'SELECT',
          required: true,
          sortOrder: 0,
          values: [
            { id: 'v-pedestal', key: 'pedestal', name: 'Pedestal', sortOrder: 0 },
            { id: 'v-four', key: 'four_leg', name: 'Four Leg', sortOrder: 1 },
          ],
        },
      ],
      models: [
        {
          id: 'm1',
          key: 'primary',
          name: 'Table',
          assetId: 'obj-root',
          objectAssetRevisionId: 'obj-root-1',
          linkedAssets: [
            {
              id: 'link-1',
              role: 'OBJECT',
              key: 'pedestal_base',
              assetRevisionId: 'obj-pedestal-3',
            },
            {
              id: 'link-2',
              role: 'OBJECT',
              key: 'four_leg_base',
              assetRevisionId: 'obj-four-4',
            },
          ],
          targets: [
            { id: 't-slot', key: 'base_slot', targetType: 'OBJECT' },
          ],
        },
      ],
      visualEffects: [
        {
          id: 'e1',
          choiceValueId: 'v-pedestal',
          modelTargetId: 't-slot',
          operation: 'REPLACE_COMPONENT',
          valueJson: JSON.stringify({
            linkedAssetKey: 'pedestal_base',
            role: 'OBJECT',
          }),
        },
        {
          id: 'e2',
          choiceValueId: 'v-four',
          modelTargetId: 't-slot',
          operation: 'REPLACE_COMPONENT',
          valueJson: JSON.stringify({
            linkedAssetKey: 'four_leg_base',
            role: 'OBJECT',
          }),
        },
      ],
    });

    const catalog = buildVisualMappingCatalog({
      objectAssets: [
        {
          id: 'obj-pedestal',
          name: 'Pedestal Base',
          currentRevisionId: 'obj-pedestal-3',
          version: 3,
        },
        {
          id: 'obj-four',
          name: 'Four Leg Base',
          currentRevisionId: 'obj-four-4',
          version: 4,
        },
      ],
    });

    const [choice] = buildVisualMappingChoices(graph, catalog);
    expect(choice.simpleMaterial.eligible).toBe(false);
    expect(choice.batch).toEqual({
      eligible: true,
      operation: 'REPLACE_COMPONENT',
      sharedTargetId: 't-slot',
    });
    expect(choice.coverageLabel).toBe('2 values · 2 mapped');
    expect(choice.values[0].groups[0]).toMatchObject({
      operation: 'REPLACE_COMPONENT',
      resourceLabel: 'Pedestal Base · v3',
    });
    expect(choice.values[0].groups[0].targets[0].name).toBe('Base Slot');
    expect(choice.values[1].groups[0].resourceLabel).toBe('Four Leg Base · v4');
  });

  it('does not invent operations or use static visual setup as mappings', () => {
    const graph = detail({
      choices: [
        {
          id: 'c-finish',
          key: 'finish',
          name: 'Finish',
          type: 'SELECT',
          required: false,
          sortOrder: 0,
          values: [{ id: 'v-matte', key: 'matte', name: 'Matte', sortOrder: 0 }],
        },
      ],
      models: [
        {
          id: 'm1',
          key: 'primary',
          name: 'Table',
          assetId: 'obj-1',
          objectAssetRevisionId: 'obj-rev-1',
          linkedAssets: [],
          targets: [{ id: 't-top', key: 'table_top', targetType: 'MATERIAL' }],
          visualSetups: [
            {
              id: 'setup-1',
              productModelId: 'm1',
              modelTargetId: 't-top',
              operation: 'SET_MATERIAL',
              valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-default' }),
            },
          ],
        },
      ],
      visualEffects: [],
    });

    const [choice] = buildVisualMappingChoices(graph);
    expect(choice.values[0].unbound).toBe(true);
    expect(choice.values[0].groups.some((group) => group.operation === 'SET_TEXTURE')).toBe(
      false
    );
  });
});
