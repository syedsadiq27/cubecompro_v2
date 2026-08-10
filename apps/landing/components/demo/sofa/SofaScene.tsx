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
  enableStudioEnv?: boolean;
  onContextLost?: () => void;
};

function RendererTuning({ onContextLost }: { onContextLost?: () => void }) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
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
        position={[0, 0.014, 0.06]}
        scale={[3.1, 1.85, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} transparent depthWrite={false} />
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.013, 0.1]}
        scale={[4.4, 2.6, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.45}
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
          color={floorMap ? '#ffffff' : '#d8d4cc'}
          roughness={0.78}
          metalness={0.04}
        />
      </mesh>

      <mesh position={[0, 2.4, -0.2]}>
        <cylinderGeometry
          args={[7.2, 7.2, 5.2, 48, 1, true, Math.PI * 0.15, Math.PI * 0.7]}
        />
        <meshStandardMaterial
          side={BackSide}
          map={wallMap ?? undefined}
          color={wallMap ? '#ffffff' : '#f2f1ed'}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      <mesh position={[0, 5.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.4, 48]} />
        <meshStandardMaterial
          side={BackSide}
          color="#f7f6f3"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

function StageEnv() {
  return (
    <Environment resolution={32} frames={1} environmentIntensity={0.55}>
      <Lightformer
        form="rect"
        intensity={2.8}
        color="#fff4e4"
        position={[3.5, 4.8, 2.5]}
        scale={[7, 3.5, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.1}
        color="#a69fff"
        position={[-4.5, 3.2, -1.5]}
        scale={[5, 3, 1]}
      />
      <Lightformer
        form="ring"
        intensity={0.7}
        color="#ffffff"
        position={[0, 4.8, 0]}
        scale={6}
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
      <color attach="background" args={['#f2f1ed']} />
      <fog attach="fog" args={['#f2f1ed', 10, 22]} />

      <hemisphereLight args={['#ffffff', '#b8b5ad', 0.4]} />
      <directionalLight
        position={[4.2, 7.2, 3.4]}
        intensity={1.2}
        color="#ffffff"
      />
      <directionalLight
        position={[-5, 3.5, -2]}
        intensity={0.4}
        color="#a69fff"
      />
      <directionalLight
        position={[0.2, 2.8, 5]}
        intensity={0.24}
        color="#ffffff"
      />

      {enableStudioEnv ? <StageEnv /> : null}

      <StudioSet />
      <SoftShadow />
      <SofaMesh materials={materials} />

      <OrbitControls
        makeDefault
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={3.2}
        maxDistance={7}
        target={[0, 0.45, 0]}
      />
    </>
  );
}

export function SofaScene({
  materials,
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
      <div className="flex h-full w-full items-center justify-center bg-[var(--surface)] text-sm tracking-wide text-[var(--text-muted)]">
        Loading showroom…
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [3.35, 2.05, 3.75], fov: 34, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      frameloop="demand"
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'low-power',
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
