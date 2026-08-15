'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, useToast } from '@repo/ui';
import { updateProductModelRevisionAction } from '@/actions/graph';
import type { ObjectAssetOption } from '@/lib/product-workspace';

const selectClass =
  'w-full rounded-lg border border-[var(--line)] bg-white px-2.5 py-1.5 text-[13px]';

export function ChangeProductModelForm({
  projectId,
  productId,
  productModelId,
  objectAssets,
  currentAssetId,
  onCancel,
}: {
  projectId: string;
  productId: string;
  productModelId: string;
  objectAssets: ObjectAssetOption[];
  currentAssetId?: string | null;
  onCancel?: () => void;
}) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [assetId, setAssetId] = useState(
    currentAssetId ?? objectAssets[0]?.id ?? ''
  );

  if (objectAssets.length === 0) {
    return (
      <p className="text-[13px] text-[var(--text-secondary)]">
        No library objects available. Upload one under Library first.
      </p>
    );
  }

  return (
    <form
      className="grid gap-2 sm:grid-cols-[1fr_auto_auto] items-end"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await updateProductModelRevisionAction(
            projectId,
            productId,
            formData
          );
          if (result.ok) {
            toast.success('Model updated');
            onCancel?.();
            router.refresh();
          } else {
            toast.error(result.error || 'Failed to change model');
          }
        });
      }}
    >
      <input type="hidden" name="productModelId" value={productModelId} />
      <label className="grid gap-1 min-w-0">
        <span className="text-[11px] font-medium text-[var(--text-secondary)]">
          Library object
        </span>
        <select
          name="assetId"
          required
          className={selectClass}
          value={assetId}
          onChange={(event) => setAssetId(event.target.value)}
        >
          {objectAssets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.name}
              {asset.status && asset.status !== 'READY'
                ? ` (${asset.status})`
                : ''}
            </option>
          ))}
        </select>
      </label>
      <Button type="submit" size="sm" disabled={pending || !assetId}>
        {pending ? 'Saving…' : 'Save model'}
      </Button>
      {onCancel ? (
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={onCancel}
        >
          Cancel
        </Button>
      ) : null}
    </form>
  );
}
