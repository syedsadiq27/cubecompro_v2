'use client';

import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import {
  ACESFilmicToneMapping,
  BackSide,
  SRGBColorSpace,
} from 'three';
import { SofaMesh } from './SofaMesh';
import { getSoftShadowTexture } from './softShadowTexture';
import {
  getStudioFloorTexture,
  getStudioWallTexture,
} from './studioTextures';
import type { ResolvedMaterials } from './types';

type SofaSceneProps = {
  materials: ResolvedMaterials;
  viewIndex?: number;
  enableStudioEnv?: boolean;
  onContextLost?: () => void;
};

function RendererTuning({ onContextLost }: { onContextLost?: () => void }) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.02;
    gl.outputColorSpace = SRGBColorSpace;
    invalidate();

    const canvas = gl.domElement;
    const onLost = (event: Event) => {
      event.preventDefault();
      onContextLost?.();
    };

    canvas.addEventListener('webglcontextlost', onLost, false);
    return () => {
      canvas.removeEventListener('webglcontextlost', onLost, false);
    };
  }, [gl, invalidate, onContextLost]);

  return null;
}

function SoftShadow() {
  const texture = useMemo(() => getSoftShadowTexture(), []);

  if (!texture) {
    return null;
  }

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0.04]}
        scale={[2.8, 1.65, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.011, 0.08]}
        scale={[3.8, 2.2, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function StudioSet() {
  const floorMap = useMemo(() => getStudioFloorTexture(), []);
  const wallMap = useMemo(() => getStudioWallTexture(), []);

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={false}
      >
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          map={floorMap ?? undefined}
          color={floorMap ? '#ffffff' : '#ECE9E2'}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 2.2, -0.35]}>
        <cylinderGeometry
          args={[6.4, 6.4, 4.8, 48, 1, true, Math.PI * 0.18, Math.PI * 0.64]}
        />
        <meshStandardMaterial
          side={BackSide}
          map={wallMap ?? undefined}
          color={wallMap ? '#ffffff' : '#F5F3EE'}
          roughness={0.96}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 4.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.6, 48]} />
        <meshStandardMaterial
          side={BackSide}
          color="#F5F3EE"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

function StageEnv() {
  return (
    <Environment resolution={64} frames={1} environmentIntensity={0.58}>
      <Lightformer
        form="rect"
        intensity={2.8}
        color="#fff8ee"
        position={[2.6, 4.6, 2.4]}
        scale={[7, 3.6, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.7}
        color="#E8E6FF"
        position={[-3.8, 3.0, -0.8]}
        scale={[4.8, 3.2, 1]}
      />
      <Lightformer
        form="ring"
        intensity={0.85}
        color="#ffffff"
        position={[0, 4.6, 0.4]}
        scale={6}
      />
      <Lightformer
        form="rect"
        intensity={0.55}
        color="#ffffff"
        position={[0, 1.2, 4.5]}
        scale={[5, 2, 1]}
      />
    </Environment>
  );
}

function InvalidateOnChange({ materials }: { materials: ResolvedMaterials }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [materials, invalidate]);

  return null;
}

function SceneContent({
  materials,
  enableStudioEnv,
  onContextLost,
}: SofaSceneProps) {
  return (
    <>
      <RendererTuning onContextLost={onContextLost} />
      <InvalidateOnChange materials={materials} />
      <color attach="background" args={['#F5F3EE']} />
      <fog attach="fog" args={['#F5F3EE', 9, 20]} />

      <hemisphereLight args={['#fffdf9', '#D8D5CE', 0.55]} />
      <directionalLight
        position={[3.4, 6.8, 3.0]}
        intensity={1.15}
        color="#fff9f2"
      />
      <directionalLight
        position={[-3.8, 3.2, -1.4]}
        intensity={0.28}
        color="#E8E6FF"
      />
      <directionalLight
        position={[0.2, 2.6, 4.6]}
        intensity={0.32}
        color="#ffffff"
      />

      {enableStudioEnv ? <StageEnv /> : null}

      <group>
        <StudioSet />
        <SoftShadow />
        <SofaMesh materials={materials} />
      </group>

      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 2.75}
        maxPolarAngle={Math.PI / 2.12}
        minDistance={2.55}
        maxDistance={4.8}
        target={[0, 0.48, 0]}
      />
    </>
  );
}

export function SofaScene({
  materials,
  viewIndex = 0,
  enableStudioEnv = true,
  onContextLost,
}: SofaSceneProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      if (!cancelled) {
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--canvas)] text-sm tracking-wide text-[var(--text-muted)]">
        Loading showroom…
      </div>
    );
  }

  const cameraPositions: [number, number, number][] = [
    [2.35, 1.35, 2.65],
    [-2.45, 1.15, 1.9],
    [0.1, 1.2, 2.55],
    [2.6, 0.78, 1.65],
  ];
  const cameraPosition = cameraPositions[viewIndex] ?? cameraPositions[0]!;

  return (
    <Canvas
      camera={{
        position: cameraPosition,
        fov: 28,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 2]}
      frameloop="demand"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
        preserveDrawingBuffer: false,
        failIfMajorPerformanceCaveat: false,
      }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <SceneContent
        materials={materials}
        enableStudioEnv={enableStudioEnv}
        onContextLost={onContextLost}
      />
    </Canvas>
  );
}
