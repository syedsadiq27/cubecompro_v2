import {
  evaluateConfiguratorPreview,
  isChoiceValueAvailable,
  toKernelConstraints,
} from './configurator-preview';
import type { GraphDetail } from '@repo/product-graph';

function detailFixture(): GraphDetail {
  return {
    id: 'rev-1',
    version: 1,
    status: 'PUBLISHED',
    choices: [
      {
        id: 'c-material',
        key: 'material',
        name: 'Material',
        type: 'SELECT',
        required: false,
        sortOrder: 0,
        values: [
          { id: 'v-leather', key: 'leather', name: 'Leather', sortOrder: 0 },
          { id: 'v-fabric', key: 'fabric', name: 'Fabric', sortOrder: 1 },
        ],
      },
      {
        id: 'c-color',
        key: 'color',
        name: 'Color',
        type: 'SELECT',
        required: true,
        sortOrder: 1,
        values: [
          { id: 'v-black', key: 'black', name: 'Black', sortOrder: 0 },
          { id: 'v-white', key: 'white', name: 'White', sortOrder: 1 },
        ],
      },
      {
        id: 'c-frame',
        key: 'frame',
        name: 'Frame',
        type: 'SELECT',
        required: true,
        sortOrder: 2,
        values: [
          { id: 'v-walnut', key: 'walnut', name: 'Walnut', sortOrder: 0 },
          { id: 'v-oak', key: 'oak', name: 'Oak', sortOrder: 1 },
        ],
      },
    ],
    rules: [],
    constraints: [
      {
        id: 'forbid-leather-white',
        productRevisionId: 'rev-1',
        terms: [
          {
            constraintId: 'forbid-leather-white',
            choiceValueId: 'v-leather',
            choiceKey: 'material',
            choiceValueKey: 'leather',
          },
          {
            constraintId: 'forbid-leather-white',
            choiceValueId: 'v-white',
            choiceKey: 'color',
            choiceValueKey: 'white',
          },
        ],
      },
    ],
    models: [],
    visualEffects: [],
    variants: [],
  };
}

describe('configurator-preview kernel composition', () => {
  it('maps graph constraints to kernel terms', () => {
    const constraints = toKernelConstraints(detailFixture().constraints);
    expect(constraints).toEqual([
      {
        id: 'forbid-leather-white',
        terms: [
          { choiceKey: 'material', choiceValueKey: 'leather' },
          { choiceKey: 'color', choiceValueKey: 'white' },
        ],
      },
    ]);
  });

  it('marks leather+white as unavailable and invalid when both selected', () => {
    const detail = detailFixture();
    const withLeather = evaluateConfiguratorPreview(detail, {
      material: 'leather',
      color: 'black',
      frame: 'walnut',
    });
    expect(withLeather.validation.valid).toBe(true);
    expect(
      isChoiceValueAvailable(withLeather.availability, 'color', 'white')
    ).toBe(false);
    expect(
      isChoiceValueAvailable(withLeather.availability, 'color', 'black')
    ).toBe(true);

    const illegal = evaluateConfiguratorPreview(detail, {
      material: 'leather',
      color: 'white',
      frame: 'walnut',
    });
    expect(illegal.validation.valid).toBe(false);
    expect(illegal.issueLabels.some((l) => l.includes('violated_constraint'))).toBe(
      true
    );
  });

  it('keeps unbound choices in selection evaluation', () => {
    const state = evaluateConfiguratorPreview(detailFixture(), {
      frame: 'oak',
    });
    expect(state.availability.frame?.oak).toBe(true);
    expect(state.availability.material?.leather).toBeDefined();
  });
});
