import * as THREE from 'three';
import {
  buildAuthoringNodePath,
  pathsReferToSameNode,
  resolveSelectionIdentity,
} from './selection-identity';

describe('selection-identity', () => {
  it('builds authoring nodePath without loaded-model wrapper', () => {
    const productRoot = new THREE.Group();
    productRoot.name = 'ProductRoot';
    const loaded = new THREE.Group();
    loaded.name = 'loaded-model';
    const chair = new THREE.Group();
    chair.name = 'Chair';
    const frame = new THREE.Mesh();
    frame.name = 'Frame';
    chair.add(frame);
    loaded.add(chair);
    productRoot.add(loaded);

    expect(buildAuthoringNodePath(frame, productRoot)).toBe('Chair/Frame');
  });

  it('matches ModelTarget and lists bindings', () => {
    const productRoot = new THREE.Group();
    const chair = new THREE.Group();
    chair.name = 'Chair';
    const frame = new THREE.Mesh();
    frame.name = 'Frame';
    chair.add(frame);
    productRoot.add(chair);

    const identity = resolveSelectionIdentity({
      object: frame,
      productRoot,
      document: {
        productRevisionId: 'rev',
        productModelId: 'model',
        assetId: 'asset',
        rootObjectAssetRevisionId: 'oar',
        linkedAssets: [],
        targets: [{ key: 'frame', nodePath: 'Chair/Frame', materialSlot: '0' }],
        setups: [],
        bindings: [
          {
            choiceKey: 'finish',
            valueKey: 'walnut',
            targetKey: 'frame',
            operation: 'SET_MATERIAL',
            materialAssetRevisionId: 'mar_1',
          },
        ],
        unsupported: [],
      },
    });

    expect(identity?.nodePath).toBe('Chair/Frame');
    expect(identity?.target?.key).toBe('frame');
    expect(identity?.bindings).toHaveLength(1);
    expect(pathsReferToSameNode('Chair/Frame', 'loaded-model/Chair/Frame')).toBe(
      true
    );
  });
});
