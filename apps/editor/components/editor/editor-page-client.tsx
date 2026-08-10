'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type EditorIds, useEditorStore } from '../../lib/editor-store';
import { EditorShell } from './editor-shell';

type EditorPageClientProps = {
  ids?: EditorIds;
};

export function EditorPageClient({ ids }: EditorPageClientProps) {
  const searchParams = useSearchParams();
  const setIds = useEditorStore((state) => state.setIds);
  const setEmbed = useEditorStore((state) => state.setEmbed);

  useEffect(() => {
    setIds({
      projectId:
        ids?.projectId ?? searchParams.get('projectId') ?? undefined,
      productId:
        ids?.productId ?? searchParams.get('productId') ?? undefined,
      modelId: ids?.modelId ?? searchParams.get('modelId') ?? undefined,
    });
    setEmbed({
      embedded: searchParams.get('embed') === '1',
      returnTo: searchParams.get('returnTo') ?? undefined,
    });
  }, [ids, searchParams, setIds, setEmbed]);

  return <EditorShell />;
}
