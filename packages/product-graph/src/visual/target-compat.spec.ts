import {
  assertNoStructuralSurfaceConflicts,
  findStructuralSurfaceConflicts,
  isNodePathUnder,
} from './target-compat.js';

describe('visual-target-compat', () => {
  it('detects surface targets under a replaceable structural subtree', () => {
    const conflicts = findStructuralSurfaceConflicts({
      targets: [
        { key: 'legs', nodePath: 'Table/Legs' },
        { key: 'leg-finish', nodePath: 'Table/Legs/LegMesh' },
        { key: 'table-top', nodePath: 'Table/Top/TopMesh' },
      ],
      effects: [
        { operation: 'REPLACE_COMPONENT', targetKey: 'legs' },
        { operation: 'SET_MATERIAL', targetKey: 'leg-finish' },
        { operation: 'SET_MATERIAL', targetKey: 'table-top' },
      ],
    });

    expect(conflicts).toEqual([
      {
        surfaceTargetKey: 'leg-finish',
        surfaceNodePath: 'Table/Legs/LegMesh',
        structuralTargetKey: 'legs',
        structuralNodePath: 'Table/Legs',
      },
    ]);
  });

  it('allows root surface targets outside structural subtrees', () => {
    expect(() =>
      assertNoStructuralSurfaceConflicts({
        targets: [
          { key: 'legs', nodePath: 'Table/Legs' },
          { key: 'table-top', nodePath: 'Table/Top/TopMesh' },
        ],
        effects: [
          { operation: 'REPLACE_COMPONENT', targetKey: 'legs' },
          { operation: 'SET_MATERIAL', targetKey: 'table-top' },
        ],
      })
    ).not.toThrow();
  });

  it('rejects SET_MATERIAL on the same target used for REPLACE_COMPONENT', () => {
    expect(() =>
      assertNoStructuralSurfaceConflicts({
        targets: [{ key: 'legs', nodePath: 'Table/Legs' }],
        effects: [
          { operation: 'REPLACE_COMPONENT', targetKey: 'legs' },
          { operation: 'SET_MATERIAL', targetKey: 'legs' },
        ],
      })
    ).toThrow(/lives inside replaceable structural target/);
  });

  it('isNodePathUnder matches descendants only', () => {
    expect(isNodePathUnder('Table/Legs', 'Table/Legs/LegMesh')).toBe(true);
    expect(isNodePathUnder('Table/Legs', 'Table/Legs')).toBe(true);
    expect(isNodePathUnder('Table/Legs', 'Table/Top')).toBe(false);
    expect(isNodePathUnder('Table/Legs', 'Table/LegsExtra')).toBe(false);
  });
});
