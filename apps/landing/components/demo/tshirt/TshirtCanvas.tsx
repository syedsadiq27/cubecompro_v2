'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResolvedMaterials } from './types';

const TshirtScene = dynamic(
  () => import('./TshirtScene').then((mod) => mod.TshirtScene),
  { ssr: false }
);

type TshirtCanvasProps = {
  materials: ResolvedMaterials;
  fitScale: number;
  viewKey?: number;
};

export function TshirtCanvas({
  materials,
  fitScale,
  viewKey = 0,
}: TshirtCanvasProps) {
  const [mounted, setMounted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
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
      setResetKey((value) => value + 1);
      recovering.current = false;
    }, 200);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full min-h-[48vh] w-full items-center justify-center bg-[var(--surface)] text-sm tracking-wide text-[var(--text-muted)] lg:min-h-full">
        Loading showroom…
      </div>
    );
  }

  return (
    <div className="absolute inset-0 h-full w-full">
      <TshirtScene
        key={`${viewKey}-${resetKey}`}
        materials={materials}
        fitScale={fitScale}
        onContextLost={handleContextLost}
      />
    </div>
  );
}
