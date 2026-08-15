'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Typography } from '@repo/ui';
import {
  createMaterialAction,
  createObjectAction,
} from '@/actions/assets';
import type { LibraryAssetType } from './types';

export function CreateAssetDialog({
  projectId,
  open,
  initialType = 'material',
  onClose,
}: {
  projectId: string;
  open: boolean;
  initialType?: LibraryAssetType;
  onClose: () => void;
}) {
  const router = useRouter();
  const [type, setType] = useState<LibraryAssetType>(initialType);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setType(initialType === 'texture' ? 'material' : initialType);
    setMessage(null);
  }, [open, initialType]);

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
              New asset
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Create a reusable library asset for this project.
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

        <div className="mb-4 flex gap-1 rounded-xl bg-[var(--canvas)] p-1">
          {(
            [
              ['material', 'Material'],
              ['model', 'Model'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setType(value);
                setMessage(null);
              }}
              className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium ${
                type === value
                  ? 'bg-white text-[var(--ink)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {type === 'material' ? (
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                const result = await createMaterialAction(projectId, formData);
                if (result.ok) {
                  setMessage(null);
                  onClose();
                  router.refresh();
                } else {
                  setMessage(result.error || 'Failed.');
                }
              });
            }}
          >
            <Field label="Name" htmlFor="create-material-name">
              <Input
                id="create-material-name"
                name="name"
                required
                placeholder="Walnut Wood"
              />
            </Field>
            <Field label="Key" htmlFor="create-material-code">
              <Input
                id="create-material-code"
                name="code"
                placeholder="WOOD-WALNUT"
              />
            </Field>
            <Field label="Base color" htmlFor="create-material-color">
              <Input
                id="create-material-color"
                name="baseColor"
                type="color"
                defaultValue="#8A6040"
                className="h-10"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Metalness" htmlFor="create-material-metallic">
                <Input
                  id="create-material-metallic"
                  name="metallic"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  defaultValue="0"
                />
              </Field>
              <Field label="Roughness" htmlFor="create-material-roughness">
                <Input
                  id="create-material-roughness"
                  name="roughness"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  defaultValue="0.55"
                />
              </Field>
            </div>
            <Typography variant="support">
              Texture maps can be linked later. Prefer authoring in 3D Studio
              when applying to a product.
            </Typography>
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
                {pending ? 'Creating…' : 'Create'}
              </Button>
            </div>
          </form>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                const result = await createObjectAction(projectId, formData);
                if (result.ok) {
                  setMessage(null);
                  onClose();
                  router.refresh();
                } else {
                  setMessage(result.error || 'Failed.');
                }
              });
            }}
          >
            <Field label="Name" htmlFor="create-model-name">
              <Input
                id="create-model-name"
                name="name"
                required
                placeholder="Studio Chair"
              />
            </Field>
            <Field label="Key" htmlFor="create-model-code">
              <Input
                id="create-model-code"
                name="code"
                placeholder="CHAIR-01"
              />
            </Field>
            <Field label="GLB / GLTF file" htmlFor="create-model-file">
              <Input
                id="create-model-file"
                name="file"
                type="file"
                accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                required
                className="file:mr-2"
              />
            </Field>
            <Typography variant="support">
              Hierarchy and material slots are parsed on upload for Studio
              targeting.
            </Typography>
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
                {pending ? 'Uploading…' : 'Upload'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
