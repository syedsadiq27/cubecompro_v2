'use client';

import { useTransition } from 'react';
import {
  deleteObjectAction,
  deleteTextureAction,
} from '../../actions/assets';

export function AssetDeleteButton({
  kind,
  projectId,
  assetId,
}: {
  kind: 'texture' | 'object';
  projectId: string;
  assetId: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete this ${kind}?`)) return;
        startTransition(async () => {
          if (kind === 'texture') {
            await deleteTextureAction(projectId, assetId);
          } else {
            await deleteObjectAction(projectId, assetId);
          }
        });
      }}
      className="text-sm text-[var(--bo-danger)] hover:underline disabled:opacity-60"
    >
      {pending ? 'Deleting…' : `Delete ${kind}`}
    </button>
  );
}
