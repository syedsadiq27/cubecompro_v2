import { Suspense } from 'react';
import { EditorPageClient } from '../components/editor/editor-page-client';

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[var(--canvas)] text-[13px] text-[var(--text-muted)]">
          Loading editor…
        </div>
      }
    >
      <EditorPageClient />
    </Suspense>
  );
}
