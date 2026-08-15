'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Typography } from '@repo/ui';
import { updateMaterialAction } from '@/actions/assets';
import type { MaterialDocument } from '@repo/product-graph';
import { MaterialSwatch } from './material-swatch';

export function EditMaterialDialog({
  projectId,
  materialId,
  name,
  code,
  document,
  open,
  onClose,
}: {
  projectId: string;
  materialId: string;
  name: string;
  code?: string | null;
  document: MaterialDocument | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [previewColor, setPreviewColor] = useState(
    document?.baseColor || '#8A6040'
  );
  const [previewRoughness, setPreviewRoughness] = useState(
    document?.roughness ?? 0.55
  );
  const [previewMetallic, setPreviewMetallic] = useState(
    document?.metallic ?? 0
  );

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    setPreviewColor(document?.baseColor || '#8A6040');
    setPreviewRoughness(document?.roughness ?? 0.55);
    setPreviewMetallic(document?.metallic ?? 0);
  }, [open, document]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
              Edit material
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Update library PBR values. Apply in 3D Studio on product targets.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-[var(--text-secondary)] hover:bg-black/[0.04]"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-[var(--line)]">
          <MaterialSwatch
            color={previewColor}
            roughness={previewRoughness}
            metalness={previewMetallic}
            className="aspect-[5/3] w-full"
          />
        </div>

        <form
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await updateMaterialAction(
                projectId,
                materialId,
                formData
              );
              if (result.ok) {
                onClose();
                router.refresh();
              } else {
                setMessage(result.error || 'Failed.');
              }
            });
          }}
        >
          <Field label="Name" htmlFor="edit-material-name">
            <Input
              id="edit-material-name"
              name="name"
              required
              defaultValue={name}
            />
          </Field>
          <Field label="Key" htmlFor="edit-material-code">
            <Input
              id="edit-material-code"
              name="code"
              defaultValue={code || ''}
              placeholder="WOOD-WALNUT"
            />
          </Field>
          <Field label="Base color" htmlFor="edit-material-color">
            <Input
              id="edit-material-color"
              name="baseColor"
              type="color"
              value={previewColor}
              onChange={(event) => setPreviewColor(event.target.value)}
              className="h-10"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Metalness" htmlFor="edit-material-metallic">
              <Input
                id="edit-material-metallic"
                name="metallic"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={previewMetallic}
                onChange={(event) =>
                  setPreviewMetallic(Number(event.target.value) || 0)
                }
              />
            </Field>
            <Field label="Roughness" htmlFor="edit-material-roughness">
              <Input
                id="edit-material-roughness"
                name="roughness"
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={previewRoughness}
                onChange={(event) =>
                  setPreviewRoughness(Number(event.target.value) || 0)
                }
              />
            </Field>
          </div>
          {message ? (
            <Typography variant="support" className="text-[var(--danger)]">
              {message}
            </Typography>
          ) : null}
          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
