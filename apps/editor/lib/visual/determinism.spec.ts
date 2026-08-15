import * as THREE from 'three';
import { captureVisualBaseline } from './baseline';
import {
  deriveBaselineVisualState,
  deriveVisualState,
} from './derive';
import { reconcileScene } from './reconcile';
import { resolveTargetObject } from './resolve-target';
import type { VisualDocument } from './types';

function mesh(name: string, color: string, visible = true): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
  });
  material.name = `baseline-${name}-${color}`;
  const object = new THREE.Mesh(geometry, material);
  object.name = name;
  object.visible = visible;
  return object;
}

function buildChairScene() {
  const root = new THREE.Group();
  root.name = 'Chair';
  const frame = mesh('Frame', '#5C3A21');
  const seat = mesh('Seat', '#111111');
  const backrest = mesh('Backrest', '#333333', true);
  root.add(frame, seat, backrest);
  return { root, frame, seat, backrest };
}

function documentFixture(): VisualDocument {
  return {
    productRevisionId: 'rev-1',
    productModelId: 'model-1',
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
    bindings: [
      {
        choiceKey: 'frame',
        valueKey: 'walnut',
        targetKey: 'frame',
        materialSlot: 'frame',
        operation: 'SET_MATERIAL',
        materialAssetId: 'mat-walnut',
      },
      {
        choiceKey: 'frame',
        valueKey: 'oak',
        targetKey: 'frame',
        materialSlot: 'frame',
        operation: 'SET_MATERIAL',
        materialAssetId: 'mat-oak',
      },
      {
        choiceKey: 'color',
        valueKey: 'black',
        targetKey: 'body',
        materialSlot: 'body',
        operation: 'SET_MATERIAL',
        materialAssetId: 'mat-black',
      },
      {
        choiceKey: 'back',
        valueKey: 'off',
        targetKey: 'backrest',
        operation: 'SET_VISIBILITY',
        visible: false,
      },
      {
        choiceKey: 'back',
        valueKey: 'on',
        targetKey: 'backrest',
        operation: 'SET_VISIBILITY',
        visible: true,
      },
    ],
    unsupported: [],
  };
}

function material(name: string, color: string): THREE.MeshBasicMaterial {
  const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
  mat.name = name;
  return mat;
}

function materialName(object: THREE.Object3D): string {
  const meshObj = object as THREE.Mesh;
  const mat = meshObj.material as THREE.Material;
  return mat.name;
}

describe('visual determinism', () => {
  it('fresh(A) == A → B → A for materials and visibility', () => {
    const { root, frame, backrest } = buildChairScene();
    const document = documentFixture();
    const baseline = captureVisualBaseline(root, document);
    const materials = {
      'mat-walnut': material('Walnut', '#5C3A21'),
      'mat-oak': material('Oak', '#C29B62'),
      'mat-black': material('Black', '#000000'),
    };

    const stateA = deriveVisualState(baseline, document, {
      frame: 'walnut',
      color: 'black',
      back: 'on',
    });
    reconcileScene(root, document, stateA, baseline, materials);
    const snapA = {
      frame: materialName(frame),
      backVisible: backrest.visible,
    };

    const stateB = deriveVisualState(baseline, document, {
      frame: 'oak',
      color: 'black',
      back: 'off',
    });
    reconcileScene(root, document, stateB, baseline, materials);
    expect(materialName(frame)).toBe('Oak');
    expect(backrest.visible).toBe(false);

    reconcileScene(root, document, stateA, baseline, materials);
    expect(materialName(frame)).toBe(snapA.frame);
    expect(backrest.visible).toBe(snapA.backVisible);
  });

  it('reconcile({}) restores managed properties to baseline', () => {
    const { root, frame, backrest } = buildChairScene();
    const document = documentFixture();
    const baseline = captureVisualBaseline(root, document);
    const baselineFrameName = materialName(frame);
    const materials = {
      'mat-oak': material('Oak', '#C29B62'),
      'mat-walnut': material('Walnut', '#5C3A21'),
      'mat-black': material('Black', '#000000'),
    };

    const altered = deriveVisualState(baseline, document, {
      frame: 'oak',
      back: 'off',
    });
    reconcileScene(root, document, altered, baseline, materials);
    expect(materialName(frame)).toBe('Oak');
    expect(backrest.visible).toBe(false);

    const restored = deriveBaselineVisualState(baseline, document);
    reconcileScene(root, document, restored, baseline, materials);
    expect(materialName(frame)).toBe(baselineFrameName);
    expect(backrest.visible).toBe(true);
  });

  it('missing target fails', () => {
    const root = new THREE.Group();
    root.name = 'Chair';
    const document = documentFixture();
    expect(() =>
      resolveTargetObject(root, document.targets[0]!)
    ).toThrow(/matched 0 objects/);
  });

  it('ambiguous target fails', () => {
    const root = new THREE.Group();
    root.name = 'Wrapper';
    const a = new THREE.Group();
    a.name = 'BranchA';
    a.add(mesh('Frame', '#111'));
    const b = new THREE.Group();
    b.name = 'BranchB';
    b.add(mesh('Frame', '#222'));
    root.add(a, b);

    expect(() =>
      resolveTargetObject(root, {
        key: 'frame',
        nodePath: 'Frame',
      })
    ).toThrow(/matched 2 objects/);
  });

  it('resolves path under a loaded-model wrapper', () => {
    const productRoot = new THREE.Group();
    const loaded = new THREE.Group();
    loaded.name = 'loaded-model';
    const chair = new THREE.Group();
    chair.name = 'Chair';
    chair.add(mesh('Frame', '#5C3A21'));
    loaded.add(chair);
    productRoot.add(loaded);

    const object = resolveTargetObject(productRoot, {
      key: 'frame',
      nodePath: 'Chair/Frame',
    });
    expect(object.name).toBe('Frame');
  });

  it('revision mismatch fails explicitly', () => {
    const { root } = buildChairScene();
    const document = documentFixture();
    const baseline = captureVisualBaseline(root, document);
    expect(() =>
      deriveVisualState(
        baseline,
        document,
        { frame: 'walnut' },
        { productRevisionId: 'rev-other' }
      )
    ).toThrow(/revision mismatch/);
  });
});
