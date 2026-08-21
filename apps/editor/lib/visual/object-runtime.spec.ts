import * as THREE from 'three';
import {
  captureStructuralBaselines,
  captureVisualBaseline,
  restoreStructuralSlot,
} from './baseline';
import { projectRuntimeVisualState } from './desired-state';
import { ObjectRuntimeRegistry } from './object-runtime';
import { reconcileScene } from './reconcile';
import type { VisualDocument } from './types';

function mesh(name: string, color: string): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    name: `mat-${name}`,
  });
  const object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
  object.name = name;
  return object;
}

describe('4E object runtime + structural baseline', () => {
  it('same ObjectAssetRevision in two slots yields independent instances', () => {
    const template = new THREE.Group();
    template.name = 'LegsTemplate';
    template.add(mesh('LegMesh', '#888'));

    const registry = new ObjectRuntimeRegistry();
    registry.registerSource('oar_legs', template);

    const a = registry.instantiate('oar_legs', 'slot-a');
    const b = registry.instantiate('oar_legs', 'slot-b');

    expect(a.object3D).not.toBe(b.object3D);
    expect(a.object3D).not.toBe(template);
    expect(b.object3D).not.toBe(template);
    expect(a.runtimeInstanceId).not.toBe(b.runtimeInstanceId);

    a.object3D.position.x = 10;
    expect(b.object3D.position.x).toBe(0);
    expect(template.position.x).toBe(0);
  });

  it('removing REPLACE_COMPONENT restores exact original structural subtree', () => {
    const root = new THREE.Group();
    root.name = 'Table';
    const top = mesh('Top', '#aaa');
    const legs = new THREE.Group();
    legs.name = 'Legs';
    const originalLeg = mesh('OriginalLeg', '#5C3A21');
    legs.add(originalLeg);
    root.add(top, legs);

    const document: VisualDocument = {
      productRevisionId: 'rev-1',
      productModelId: 'model-1',
      assetId: 'asset-1',
      rootObjectAssetRevisionId: 'oar_root',
      linkedAssets: [
        { role: 'OBJECT', key: 'root', assetRevisionId: 'oar_root' },
        { role: 'OBJECT', key: 'four-leg', assetRevisionId: 'oar_four' },
      ],
      targets: [
        { id: 't-legs', key: 'legs', nodePath: 'Table/Legs' },
        { id: 't-top', key: 'table-top', nodePath: 'Table/Top' },
      ],
      setups: [],
      bindings: [
        {
          choiceKey: 'base',
          valueKey: 'four',
          targetKey: 'legs',
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: 'four-leg',
          expectedRole: 'OBJECT',
        },
      ],
      unsupported: [],
    };

    const surfaceBaseline = captureVisualBaseline(root, document);
    const structuralBaselines = captureStructuralBaselines(root, document);
    const registry = new ObjectRuntimeRegistry();
    const fourLeg = new THREE.Group();
    fourLeg.name = 'FourLeg';
    fourLeg.add(mesh('FourLegMesh', '#111'));
    registry.registerSource('oar_four', fourLeg);
    const mountedInstances = new Map();

    const withReplace = projectRuntimeVisualState(surfaceBaseline, document, {
      base: 'four',
    });
    reconcileScene({
      root,
      document,
      state: withReplace,
      surfaceBaseline,
      structuralBaselines,
      objectRegistry: registry,
      mountedInstances,
    });

    const afterReplace = root.children.find((child) => child.name === 'FourLeg');
    expect(afterReplace).toBeTruthy();
    expect(root.children.some((child) => child.name === 'Legs')).toBe(false);
    expect(mountedInstances.has('legs')).toBe(true);

    const withoutReplace = projectRuntimeVisualState(
      surfaceBaseline,
      document,
      {}
    );
    reconcileScene({
      root,
      document,
      state: withoutReplace,
      surfaceBaseline,
      structuralBaselines,
      objectRegistry: registry,
      mountedInstances,
    });

    const restored = root.children.find((child) => child.name === 'Legs');
    expect(restored).toBeTruthy();
    expect(restored!.children[0]?.name).toBe('OriginalLeg');
    expect(mountedInstances.has('legs')).toBe(false);
  });

  it('restoreStructuralSlot remounts template without consuming it', () => {
    const parent = new THREE.Group();
    const original = mesh('Original', '#fff');
    parent.add(original);
    const baseline = {
      compositionSlotKey: 'legs',
      parent,
      childIndex: 0,
      template: original.clone(true),
    };
    parent.remove(original);
    parent.add(mesh('Replacement', '#000'));

    restoreStructuralSlot(baseline);
    expect(parent.children[0]?.name).toBe('Original');
    expect(baseline.template.name).toBe('Original');
    expect(baseline.template.parent).toBeNull();
  });
});
