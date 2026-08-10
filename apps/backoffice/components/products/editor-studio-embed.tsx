'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getEditorEmbedSrc } from '../../lib/editor-embed';

const CLOSE_MESSAGE = 'cubecom:editor-close';

export function EditorStudioEmbed({
  projectId,
  productId,
  modelId,
  returnTo,
}: {
  projectId: string;
  productId: string;
  modelId: string;
  returnTo: string;
}) {
  const router = useRouter();
  const src = useMemo(
    () => getEditorEmbedSrc(projectId, productId, modelId, returnTo),
    [projectId, productId, modelId, returnTo]
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if ((data as { type?: string }).type !== CLOSE_MESSAGE) return;
      const next =
        typeof (data as { returnTo?: string }).returnTo === 'string'
          ? (data as { returnTo: string }).returnTo
          : returnTo;
      router.push(next);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [router, returnTo]);

  return (
    <iframe
      title="3D Editor"
      src={src}
      className="h-dvh w-full border-0"
      allow="clipboard-write; fullscreen"
    />
  );
}
