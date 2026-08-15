'use client';

import { RoundedBox } from '@react-three/drei';
import type { ResolvedMaterials } from './types';

type SofaMeshProps = {
  materials: ResolvedMaterials;
};

export function SofaMesh({ materials }: SofaMeshProps) {
  const isLeather = materials.fabric.roughness < 0.55;
  const isMetalLegs = materials.legs.metalness > 0.5;
  const fabricRoughness = Math.min(
    1,
    materials.fabric.roughness + (isLeather ? 0.02 : 0.04)
  );
  const frameRoughness = Math.min(1, materials.frame.roughness + 0.02);
  const fabricSheen = isLeather ? 0.15 : 0.7;
  const fabricClearcoat = isLeather ? 0.55 : 0.08;
  const fabricClearcoatRoughness = isLeather ? 0.28 : 0.72;

  return (
    <group position={[0, 0.15, 0]}>
      <RoundedBox
        args={[2.45, 0.26, 1.08]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.2, 0]}
      >
        <meshPhysicalMaterial
          color={materials.frame.color}
          roughness={frameRoughness}
          metalness={materials.frame.metalness}
          clearcoat={0.35}
          clearcoatRoughness={0.45}
        />
      </RoundedBox>

      <RoundedBox
        args={[2.45, 0.68, 0.22]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.54, -0.42]}
      >
        <meshPhysicalMaterial
          color={materials.frame.color}
          roughness={frameRoughness}
          metalness={materials.frame.metalness}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.2, 0.42, 0.92]}
        radius={0.035}
        smoothness={3}
        position={[-1.1, 0.46, 0.04]}
      >
        <meshPhysicalMaterial
          color={materials.frame.color}
          roughness={frameRoughness}
          metalness={materials.frame.metalness}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.2, 0.42, 0.92]}
        radius={0.035}
        smoothness={3}
        position={[1.1, 0.46, 0.04]}
      >
        <meshPhysicalMaterial
          color={materials.frame.color}
          roughness={frameRoughness}
          metalness={materials.frame.metalness}
          clearcoat={0.3}
          clearcoatRoughness={0.5}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.98, 0.2, 0.88]}
        radius={0.06}
        smoothness={3}
        position={[-0.52, 0.4, 0.08]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={fabricSheen}
          sheenRoughness={0.7}
          sheenColor={materials.fabric.color}
          clearcoat={fabricClearcoat}
          clearcoatRoughness={fabricClearcoatRoughness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.98, 0.2, 0.88]}
        radius={0.06}
        smoothness={3}
        position={[0.52, 0.4, 0.08]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={fabricSheen}
          sheenRoughness={0.7}
          sheenColor={materials.fabric.color}
          clearcoat={fabricClearcoat}
          clearcoatRoughness={fabricClearcoatRoughness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.94, 0.42, 0.18]}
        radius={0.06}
        smoothness={3}
        position={[-0.52, 0.7, -0.28]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={fabricSheen}
          sheenRoughness={0.7}
          sheenColor={materials.fabric.color}
          clearcoat={fabricClearcoat}
          clearcoatRoughness={fabricClearcoatRoughness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.94, 0.42, 0.18]}
        radius={0.06}
        smoothness={3}
        position={[0.52, 0.7, -0.28]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={fabricSheen}
          sheenRoughness={0.7}
          sheenColor={materials.fabric.color}
          clearcoat={fabricClearcoat}
          clearcoatRoughness={fabricClearcoatRoughness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.15, 0.32, 0.55]}
        radius={0.04}
        smoothness={3}
        position={[-1.06, 0.52, 0.05]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={isLeather ? 0.1 : 0.55}
          sheenRoughness={0.78}
          sheenColor={materials.fabric.color}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.15, 0.32, 0.55]}
        radius={0.04}
        smoothness={3}
        position={[1.06, 0.52, 0.05]}
      >
        <meshPhysicalMaterial
          color={materials.fabric.color}
          roughness={fabricRoughness}
          metalness={materials.fabric.metalness}
          sheen={isLeather ? 0.1 : 0.55}
          sheenRoughness={0.78}
          sheenColor={materials.fabric.color}
        />
      </RoundedBox>

      {(
        [
          [-1.05, -0.2, 0.4],
          [1.05, -0.2, 0.4],
          [-1.05, -0.2, -0.4],
          [1.05, -0.2, -0.4],
        ] as const
      ).map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.045, 0.055, 0.34, 20]} />
          <meshPhysicalMaterial
            color={materials.legs.color}
            roughness={materials.legs.roughness}
            metalness={materials.legs.metalness}
            clearcoat={isMetalLegs ? 0.65 : 0.2}
            clearcoatRoughness={isMetalLegs ? 0.2 : 0.55}
            reflectivity={isMetalLegs ? 0.9 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}
