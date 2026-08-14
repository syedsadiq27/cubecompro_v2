'use client';

import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useLayoutEffect, useMemo } from 'react';
import {
  Box3,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector2,
  Vector3,
  type Object3D,
} from 'three';
import { Primitive } from '../shared/Primitive';
import { useFabricTextures } from '../shared/useFabricTextures';
import type { ResolvedMaterials } from './types';

const TSHIRT_URL = '/demo/tshirt.glb';

const BODY_PARTS = ['Material1718', 'Material1722', 'Material1724'] as const;

type TshirtMeshProps = {
  materials: ResolvedMaterials;
  fitScale: number;
};

function clonePart(source: Object3D) {
  const part = source.clone(true);
  source.updateWorldMatrix(true, true);
  part.matrix.copy(source.matrixWorld);
  part.matrix.decompose(part.position, part.quaternion, part.scale);
  part.matrixAutoUpdate = true;

  part.traverse((obj) => {
    if (!(obj instanceof Mesh)) {
      return;
    }
    obj.castShadow = false;
    obj.receiveShadow = false;
    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map((mat) => mat.clone());
    } else if (obj.material) {
      obj.material = obj.material.clone();
    }
  });

  return part;
}

function fitGroup(group: Group, targetSize = 2.15) {
  group.position.set(0, 0, 0);
  group.scale.set(1, 1, 1);
  group.updateMatrixWorld(true);

  const box = new Box3().setFromObject(group);
  const size = box.getSize(new Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  group.scale.setScalar(targetSize / maxDim);
  group.updateMatrixWorld(true);

  const fitted = new Box3().setFromObject(group);
  const center = fitted.getCenter(new Vector3());
  group.position.set(-center.x, -fitted.min.y + 0.35, -center.z);
}

function buildShirt(scene: Object3D) {
  const group = new Group();
  group.name = 'Tshirt';
  scene.updateMatrixWorld(true);

  for (const name of BODY_PARTS) {
    const source = scene.getObjectByName(name);
    if (!source) {
      continue;
    }
    const part = clonePart(source);
    part.name = name;
    group.add(part);
  }

  fitGroup(group, 2.35);
  return group;
}

export function TshirtMesh({ materials, fitScale }: TshirtMeshProps) {
  const { scene } = useGLTF(TSHIRT_URL);
  const textures = useFabricTextures(2.4);
  const invalidate = useThree((state) => state.invalidate);
  const model = useMemo(() => buildShirt(scene), [scene]);

  useLayoutEffect(() => {
    model.traverse((child) => {
      if (!(child instanceof Mesh)) {
        return;
      }

      child.material = new MeshStandardMaterial({
        color: new Color(materials.body.color),
        map: textures.albedo,
        normalMap: textures.normal,
        normalScale: new Vector2(1.35, 1.35),
        roughnessMap: textures.roughness,
        roughness: materials.body.roughness,
        metalness: 0,
        envMapIntensity: 0,
        side: DoubleSide,
      });
    });

    invalidate();
  }, [model, materials, textures, invalidate]);

  return (
    <group scale={[fitScale, 1, fitScale]}>
      <Primitive object={model} rotation={[0.04, 0.28, 0]} />
    </group>
  );
}

useGLTF.preload(TSHIRT_URL);
