'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Typography, useToast } from '@repo/ui';
import { createObjectRevisionAction } from '@/actions/assets';

export function UploadObjectRevisionDialog({
  projectId,
  objectAssetId,
  assetName,
  open,
  onClose,
}: {
  projectId: string;
  objectAssetId: string;
  assetName: string;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setMessage(null);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--line)] bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Upload new revision
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Adds an immutable version of{' '}
              <span className="font-medium text-[var(--ink)]">{assetName}</span>.
              Existing product pins stay on their current revision until you
              change them on a product draft.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-[var(--text-secondary)] hover:bg-black/[0.04]"
          >
            Esc
          </button>
        </div>

        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await createObjectRevisionAction(
                projectId,
                objectAssetId,
                formData
              );
              if (result.ok) {
                toast.success(
                  result.version != null
                    ? `Revision v${result.version} created`
                    : 'Revision created'
                );
                setMessage(null);
                onClose();
                router.refresh();
              } else {
                setMessage(result.error || 'Upload failed.');
              }
            });
          }}
        >
          <Field label="GLB / GLTF file" htmlFor="object-revision-file">
            <Input
              id="object-revision-file"
              name="file"
              type="file"
              accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
              required
              className="file:mr-2"
            />
          </Field>
          {message ? (
            <Typography variant="support" className="text-[var(--danger)]">
              {message}
            </Typography>
          ) : null}
          <div className="mt-1 flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Uploading…' : 'Upload revision'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
