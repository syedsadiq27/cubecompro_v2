import {
  bindingSummary,
  hierarchyBreadcrumb,
  materialSlotLabel,
  usedByLabel,
} from './authoring-labels';

describe('authoring-labels', () => {
  it('formats hierarchy breadcrumb', () => {
    expect(hierarchyBreadcrumb('Panels/LatestPanel_1')).toBe(
      'Panels › LatestPanel_1'
    );
  });

  it('formats material slots', () => {
    expect(materialSlotLabel(undefined)).toBe('Slot 0');
    expect(materialSlotLabel('2')).toBe('Slot 2');
    expect(materialSlotLabel('base')).toBe('base');
  });

  it('summarizes bindings', () => {
    expect(
      bindingSummary(
        {
          choiceKey: 'top_material',
          valueKey: 'walnut',
          targetKey: 'table-top',
          operation: 'SET_MATERIAL',
          materialAssetRevisionId: 'rev_1',
        },
        {
          choiceName: 'Top Material',
          valueName: 'Walnut',
          materialName: 'American Walnut',
        }
      )
    ).toEqual({
      title: 'Top Material → Walnut',
      detail: 'SET_MATERIAL · American Walnut',
    });
  });

  it('describes used-by for root revision', () => {
    expect(
      usedByLabel({
        document: {
          productRevisionId: 'pr',
          productModelId: 'pm',
          assetId: 'a',
          rootObjectAssetRevisionId: 'root_rev',
          linkedAssets: [],
          targets: [],
          setups: [],
          bindings: [],
          unsupported: [],
        },
        objectAssetRevisionId: 'root_rev',
        compositionSlotKey: null,
      })
    ).toBe('Root object');
  });
});
