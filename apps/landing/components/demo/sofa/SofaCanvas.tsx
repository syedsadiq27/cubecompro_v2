'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResolvedMaterials } from './types';

const SofaScene = dynamic(
  () => import('./SofaScene').then((mod) => mod.SofaScene),
  { ssr: false }
);

type SofaCanvasProps = {
  materials: ResolvedMaterials;
  className?: string;
};

export function SofaCanvas({ materials, className = '' }: SofaCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [enableStudioEnv, setEnableStudioEnv] = useState(true);
  const recovering = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleContextLost = useCallback(() => {
    if (recovering.current) {
      return;
    }
    recovering.current = true;
    window.setTimeout(() => {
      setEnableStudioEnv(false);
      setResetKey((value) => value + 1);
      recovering.current = false;
    }, 200);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`flex h-full min-h-[48vh] w-full items-center justify-center bg-[var(--surface)] text-sm tracking-wide text-[var(--text-muted)] lg:min-h-full ${className}`}
      >
        Loading showroom…
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 h-full w-full ${className}`}>
      <SofaScene
        key={`${resetKey}-${enableStudioEnv ? 'env' : 'basic'}`}
        materials={materials}
        enableStudioEnv={enableStudioEnv}
        onContextLost={handleContextLost}
      />
    </div>
  );
}
