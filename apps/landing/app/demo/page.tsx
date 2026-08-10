'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ConfiguratorShell,
  configurationFromShareId,
} from '../../components/demo/sofa';

function DemoPageInner() {
  const searchParams = useSearchParams();
  const share = searchParams.get('c') ?? undefined;
  const { state, restored } = useMemo(
    () => configurationFromShareId(share),
    [share]
  );

  return (
    <ConfiguratorShell
      initialState={state}
      notice={
        restored
          ? 'Configuration restored from share link.'
          : null
      }
    />
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--canvas)] text-sm text-[var(--text-muted)]">
          Loading demo…
        </div>
      }
    >
      <DemoPageInner />
    </Suspense>
  );
}
