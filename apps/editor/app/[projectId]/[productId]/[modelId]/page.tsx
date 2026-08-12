import { Suspense } from 'react';
import { EditorPageClient } from '@/components/editor/editor-page-client';

export default async function EditorIdsPage({
  params,
}: {
  params: Promise<{
    projectId: string;
    productId: string;
    modelId: string;
  }>;
}) {
  const { projectId, productId, modelId } = await params;

  return (
    <Suspense
      fallback={
        <div className="flex h-dvh items-center justify-center bg-[var(--canvas)] text-[13px] text-[var(--text-muted)]">
          Loading editor…
        </div>
      }
    >
      <EditorPageClient ids={{ projectId, productId, modelId }} />
    </Suspense>
  );
}
