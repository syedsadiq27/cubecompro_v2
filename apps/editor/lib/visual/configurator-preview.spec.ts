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
    expect(withLeather.layers.validity).toBe('VALID');
    expect(withLeather.layers.completeness).toBe('COMPLETE');
    expect(withLeather.layers.commerce).toBe('UNMAPPED');
    expect(withLeather.layers.purchase).toBe('UNAVAILABLE');
    expect(withLeather.layers.visual).toBe('NO MODEL');
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

  it('disables oak when size is xl (xl+oak forbid)', () => {
    const detail = detailFixture();
    detail.constraints.push({
      id: 'forbid-xl-oak',
      productRevisionId: 'rev-1',
      terms: [
        {
          constraintId: 'forbid-xl-oak',
          choiceValueId: 'v-xl',
          choiceKey: 'size',
          choiceValueKey: 'xl',
        },
        {
          constraintId: 'forbid-xl-oak',
          choiceValueId: 'v-oak',
          choiceKey: 'frame',
          choiceValueKey: 'oak',
        },
      ],
    });
    detail.choices.find((c) => c.key === 'frame');
    const withSize = {
      ...detail,
      choices: [
        ...detail.choices.filter((c) => c.key !== 'size'),
        {
          id: 'c-size',
          key: 'size',
          name: 'Size',
          type: 'SELECT',
          required: false,
          sortOrder: 3,
          values: [
            { id: 'v-l', key: 'l', name: 'L', sortOrder: 0 },
            { id: 'v-xl', key: 'xl', name: 'XL', sortOrder: 1 },
          ],
        },
      ],
    };
    const state = evaluateConfiguratorPreview(withSize, {
      size: 'xl',
      frame: 'walnut',
      color: 'black',
    });
    expect(isChoiceValueAvailable(state.availability, 'frame', 'oak')).toBe(
      false
    );
    expect(isChoiceValueAvailable(state.availability, 'frame', 'walnut')).toBe(
      true
    );
  });
});
