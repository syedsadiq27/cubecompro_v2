'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useState } from 'react';
import {
  ACESFilmicToneMapping,
  BackSide,
  SRGBColorSpace,
  Vector3,
} from 'three';
import { getSoftShadowTexture } from '../sofa/softShadowTexture';
import {
  getStudioFloorTexture,
  getStudioWallTexture,
} from '../sofa/studioTextures';
import { TshirtMesh } from './TshirtMesh';
import type { ResolvedMaterials } from './types';

const CAMERA_POSITION = new Vector3(4.162, 2.456, 1.765);
const CAMERA_TARGET = new Vector3(-1.646, 1.759, 1.916);
const CAMERA_DISTANCE = CAMERA_POSITION.distanceTo(CAMERA_TARGET);
const MIN_DISTANCE = CAMERA_DISTANCE * 0.82;
const MAX_DISTANCE = CAMERA_DISTANCE * 1.25;

type TshirtSceneProps = {
  materials: ResolvedMaterials;
  fitScale: number;
  onContextLost?: () => void;
};

function RendererTuning({ onContextLost }: { onContextLost?: () => void }) {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.12;
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
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.014, 0]}
      scale={[1.5, 1.1, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.65}
        depthWrite={false}
      />
    </mesh>
  );
}

function StudioSet() {
  const floorMap = useMemo(() => getStudioFloorTexture(), []);
  const wallMap = useMemo(() => getStudioWallTexture(), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          map={floorMap ?? undefined}
          color={floorMap ? '#ffffff' : '#d2c8b8'}
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
          color={wallMap ? '#ffffff' : '#ebe4d8'}
          roughness={0.92}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, 5.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[7.4, 48]} />
        <meshStandardMaterial
          side={BackSide}
          color="#f2ebe1"
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

function SceneContent({
  materials,
  fitScale,
  onContextLost,
}: TshirtSceneProps) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [materials, fitScale, invalidate]);

  return (
    <>
      <RendererTuning onContextLost={onContextLost} />
      <color attach="background" args={['#e4ddd2']} />
      <fog attach="fog" args={['#e4ddd2', 10, 20]} />

      <hemisphereLight args={['#fff8ef', '#9c9488', 1.05]} />
      <directionalLight
        position={[4.5, 8, 2.5]}
        intensity={0.85}
        color="#fff6ea"
      />
      <directionalLight
        position={[-3.5, 4, -2.5]}
        intensity={0.4}
        color="#dde5f0"
      />
      <directionalLight
        position={[0, 3, 5]}
        intensity={0.25}
        color="#ffffff"
      />

      <StudioSet />
      <SoftShadow />
      <Suspense
        fallback={
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[0.5, 0.7, 0.3]} />
            <meshBasicMaterial color="#b0a698" wireframe />
          </mesh>
        }
      >
        <TshirtMesh materials={materials} fitScale={fitScale} />
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={MIN_DISTANCE}
        maxDistance={MAX_DISTANCE}
        target={[CAMERA_TARGET.x, CAMERA_TARGET.y, CAMERA_TARGET.z]}
      />
    </>
  );
}

export function TshirtScene({
  materials,
  fitScale,
  onContextLost,
}: TshirtSceneProps) {
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
      camera={{
        position: [CAMERA_POSITION.x, CAMERA_POSITION.y, CAMERA_POSITION.z],
        fov: 30,
        near: 0.1,
        far: 100,
      }}
      dpr={1}
      frameloop="always"
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
        fitScale={fitScale}
        onContextLost={onContextLost}
      />
    </Canvas>
  );
}
