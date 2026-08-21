import * as THREE from 'three';
import { captureVisualBaseline } from './baseline';
import {
  projectBaselineRuntimeVisualState,
  projectRuntimeVisualState,
} from './desired-state';
import { normalizeVisualDocument } from './normalize';
import { ObjectRuntimeRegistry } from './object-runtime';
import { reconcileScene } from './reconcile';
import { resolveTargetObject } from './resolve-target';
import type { VisualDocument, VisualState } from './types';

function mesh(name: string, hex: string): THREE.Mesh {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    name: `baseline-${name}`,
  });
  const object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  object.name = name;
  return object;
}

function buildLoadedChairGraph() {
  const productRoot = new THREE.Group();
  const loaded = new THREE.Group();
  loaded.name = 'loaded-model';
  const chair = new THREE.Group();
  chair.name = 'Chair';
  const frame = mesh('Frame', '#777777');
  const seat = mesh('Seat', '#444444');
  const legs = mesh('Legs', '#555555');
  chair.add(frame, seat, legs);
  loaded.add(chair);
  productRoot.add(loaded);
  return { productRoot, frame, seat, legs };
}

function materialName(object: THREE.Object3D): string {
  const meshObj = object as THREE.Mesh;
  return (meshObj.material as THREE.Material).name;
}

function apply(
  root: THREE.Object3D,
  document: VisualDocument,
  state: VisualState,
  baseline: ReturnType<typeof captureVisualBaseline>,
  materials: Record<string, THREE.Material>
) {
  reconcileScene({
    root,
    document,
    state,
    surfaceBaseline: baseline,
    structuralBaselines: new Map(),
    materials,
    objectRegistry: new ObjectRuntimeRegistry(),
    mountedInstances: new Map(),
  });
}

describe('2B.5 visual projection proof', () => {
  const walnut = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8A6040'),
    name: 'mat-walnut',
  });
  const oak = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C29B62'),
    name: 'mat-oak',
  });
  const black = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#111111'),
    name: 'mat-black',
  });
  const materials = {
    'mat-walnut': walnut,
    'mat-oak': oak,
    'mat-black': black,
  };

  it('resolves API-shaped effects onto real THREE.Mesh under loaded-model', () => {
    const { productRoot, frame, seat, legs } = buildLoadedChairGraph();

    const document = normalizeVisualDocument({
      productRevisionId: 'rev-1',
      model: {
        id: 'model-1',
        assetId: 'asset-1',
        objectAssetRevisionId: 'oar_root',
        linkedAssets: [
          { role: 'OBJECT', key: 'root', assetRevisionId: 'oar_root' },
        ],
        targets: [
          {
            id: 't-frame',
            key: 'frame',
            nodePath: 'Chair/Frame',
            materialSlot: 'frame',
          },
          {
            id: 't-legs',
            key: 'legs',
            nodePath: 'Chair/Legs',
            materialSlot: 'legs',
          },
          {
            id: 't-seat',
            key: 'seat',
            nodePath: 'Chair/Seat',
            materialSlot: 'seat',
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
          id: 'c-size',
          key: 'size',
          values: [
            { id: 'v-l', key: 'l' },
            { id: 'v-xl', key: 'xl' },
          ],
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
          choiceValueId: 'v-walnut',
          modelTargetId: 't-legs',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-walnut' }),
        },
        {
          id: 'e4',
          choiceValueId: 'v-oak',
          modelTargetId: 't-legs',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-oak' }),
        },
        {
          id: 'e5',
          choiceValueId: 'v-black',
          modelTargetId: 't-seat',
          operation: 'SET_MATERIAL',
          valueJson: JSON.stringify({ materialAssetRevisionId: 'mat-black' }),
        },
      ],
    });

    const baseline = captureVisualBaseline(productRoot, document);
    const baselineFrame = materialName(frame);
    const baselineSeat = materialName(seat);
    const baselineLegs = materialName(legs);

    expect(resolveTargetObject(productRoot, document.targets[0]!).name).toBe(
      'Frame'
    );

    const stateWalnut = projectRuntimeVisualState(baseline, document, {
      frame: 'walnut',
      color: 'black',
      size: 'xl',
    });
    apply(productRoot, document, stateWalnut, baseline, materials);
    expect(materialName(frame)).toBe('mat-walnut');
    expect(materialName(legs)).toBe('mat-walnut');
    expect(materialName(seat)).toBe('mat-black');

    const stateOak = projectRuntimeVisualState(baseline, document, {
      frame: 'oak',
      color: 'black',
      size: 'xl',
    });
    apply(productRoot, document, stateOak, baseline, materials);
    expect(materialName(frame)).toBe('mat-oak');
    expect(materialName(legs)).toBe('mat-oak');
    expect(materialName(seat)).toBe('mat-black');

    apply(productRoot, document, stateWalnut, baseline, materials);
    expect(materialName(frame)).toBe('mat-walnut');
    expect(materialName(legs)).toBe('mat-walnut');

    const restored = projectBaselineRuntimeVisualState(baseline, document);
    apply(productRoot, document, restored, baseline, materials);
    expect(materialName(frame)).toBe(baselineFrame);
    expect(materialName(seat)).toBe(baselineSeat);
    expect(materialName(legs)).toBe(baselineLegs);

    const sizeOnly = projectRuntimeVisualState(baseline, document, {
      size: 'xl',
    });
    apply(productRoot, document, sizeOnly, baseline, materials);
    expect(materialName(frame)).toBe(baselineFrame);
    expect(materialName(seat)).toBe(baselineSeat);
  });
});
