'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Typography } from '@repo/ui';
import {
  MATERIAL_FACTORS,
  textureFileAccept,
} from '@repo/product-graph';
import {
  createMaterialAction,
  createObjectAction,
  createTextureAction,
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
    if (initialType === 'texture' || initialType === 'image') {
      setType('texture');
    } else if (initialType === 'model') {
      setType('model');
    } else {
      setType('material');
    }
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
              ['texture', 'Texture'],
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
            {MATERIAL_FACTORS.filter((factor) => factor.type === 'color').map(
              (factor) => (
                <Field
                  key={factor.key}
                  label={factor.label}
                  htmlFor={`create-material-${factor.key}`}
                >
                  <Input
                    id={`create-material-${factor.key}`}
                    name={factor.key}
                    type="color"
                    defaultValue={String(factor.default)}
                    className="h-10"
                  />
                </Field>
              )
            )}
            <div className="grid grid-cols-2 gap-3">
              {MATERIAL_FACTORS.filter((factor) => factor.type === 'number').map(
                (factor) => (
                  <Field
                    key={factor.key}
                    label={factor.label}
                    htmlFor={`create-material-${factor.key}`}
                  >
                    <Input
                      id={`create-material-${factor.key}`}
                      name={factor.key}
                      type="number"
                      step={factor.step}
                      min={factor.min}
                      max={factor.max}
                      defaultValue={String(factor.default)}
                    />
                  </Field>
                )
              )}
            </div>
            {MATERIAL_FACTORS.filter((factor) => factor.type === 'boolean').map(
              (factor) => (
                <label
                  key={factor.key}
                  className="flex items-center gap-2 text-[13px] text-[var(--ink)]"
                >
                  <input type="checkbox" name={factor.key} />
                  {factor.label}
                </label>
              )
            )}
            <Typography variant="support">
              Pin texture maps (base color, normal, etc.) after create via Edit.
              Wrap modes are set on the material usage.
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
        ) : type === 'texture' ? (
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              startTransition(async () => {
                const result = await createTextureAction(projectId, formData);
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
            <Field label="Name" htmlFor="create-texture-name">
              <Input
                id="create-texture-name"
                name="name"
                required
                placeholder="Walnut Albedo"
              />
            </Field>
            <Field label="Key" htmlFor="create-texture-code">
              <Input
                id="create-texture-code"
                name="code"
                placeholder="TEX-WALNUT-ALBEDO"
              />
            </Field>
            <Field label="Image file" htmlFor="create-texture-file">
              <Input
                id="create-texture-file"
                name="file"
                type="file"
                accept={textureFileAccept()}
                required
                className="file:mr-2"
              />
            </Field>
            <Typography variant="support">
              Upload PNG, JPEG, WebP, or KTX2. Bind to material slots in Studio.
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
