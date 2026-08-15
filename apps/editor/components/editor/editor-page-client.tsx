'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { EDITOR_EMBED } from '@repo/product-graph';
import { type EditorIds, useEditorStore } from '@/lib/editor-store';
import { EditorShell } from './editor-shell';

type EditorPageClientProps = {
  ids?: EditorIds;
};

export function EditorPageClient({ ids }: EditorPageClientProps) {
  const searchParams = useSearchParams();
  const setIds = useEditorStore((state) => state.setIds);
  const setEmbed = useEditorStore((state) => state.setEmbed);
  const setGraphAuth = useEditorStore((state) => state.setGraphAuth);
  const setUserName = useEditorStore((state) => state.setUserName);
  const embedded = searchParams.get('embed') === '1';

  useEffect(() => {
    setIds({
      projectId:
        ids?.projectId ?? searchParams.get('projectId') ?? undefined,
      productId:
        ids?.productId ?? searchParams.get('productId') ?? undefined,
      modelId: ids?.modelId ?? searchParams.get('modelId') ?? undefined,
    });
    setEmbed({
      embedded,
      returnTo: searchParams.get('returnTo') ?? undefined,
    });
  }, [ids, searchParams, setIds, setEmbed, embedded]);

  useEffect(() => {
    if (!embedded) {
      setUserName('Demo Owner');
      return;
    }

    const onMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if ((data as { type?: string }).type !== EDITOR_EMBED.AUTH) return;
      const token = (data as { token?: string }).token;
      const apiUrl = (data as { apiUrl?: string }).apiUrl;
      const graphVersionId = (data as { graphVersionId?: string })
        .graphVersionId;
      const userName = (data as { userName?: string }).userName;
      if (!token || !apiUrl) return;
      setGraphAuth({
        token,
        apiUrl,
        graphVersionId: graphVersionId ?? '',
      });
      setUserName(userName?.trim() || 'Studio User');
    };

    window.addEventListener('message', onMessage);
    window.parent.postMessage({ type: EDITOR_EMBED.READY }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, [embedded, setGraphAuth, setUserName]);

  return <EditorShell />;
}
