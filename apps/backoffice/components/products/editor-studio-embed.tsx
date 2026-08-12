'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { EDITOR_EMBED } from '@repo/product-graph';
import { getEditorEmbedSrc } from '@/lib/editor-embed';

export function EditorStudioEmbed({
  projectId,
  productId,
  modelId,
  returnTo,
  accessToken,
  apiUrl,
  graphVersionId,
}: {
  projectId: string;
  productId: string;
  modelId: string;
  returnTo: string;
  accessToken: string;
  apiUrl: string;
  graphVersionId?: string;
}) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = useMemo(
    () => getEditorEmbedSrc(projectId, productId, modelId, returnTo),
    [projectId, productId, modelId, returnTo]
  );

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      const type = (data as { type?: string }).type;

      if (type === EDITOR_EMBED.READY) {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: EDITOR_EMBED.AUTH,
            token: accessToken,
            apiUrl,
            graphVersionId: graphVersionId ?? '',
          },
          '*'
        );
        return;
      }

      if (type !== EDITOR_EMBED.CLOSE) return;
      const next =
        typeof (data as { returnTo?: string }).returnTo === 'string'
          ? (data as { returnTo: string }).returnTo
          : returnTo;
      router.push(next);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [accessToken, apiUrl, graphVersionId, returnTo, router]);

  return (
    <iframe
      ref={iframeRef}
      title="3D Editor"
      src={src}
      className="h-dvh w-full border-0"
      allow="clipboard-write; fullscreen"
    />
  );
}
