'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--bo-line)] bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--bo-ink)]">
              New asset
            </h2>
            <p className="mt-1 text-sm text-[var(--bo-muted)]">
              Create a reusable library asset for this project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04]"
          >
            Esc
          </button>
        </div>

        <div className="mb-4 flex gap-1 rounded-xl bg-[var(--bo-surface,#f5f3ef)] p-1">
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
                  ? 'bg-white text-[var(--bo-ink)] shadow-sm'
                  : 'text-[var(--bo-muted)]'
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
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">Name</span>
              <input
                name="name"
                required
                placeholder="Walnut Wood"
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">Key</span>
              <input
                name="code"
                placeholder="WOOD-WALNUT"
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">Base color</span>
              <input
                name="baseColor"
                type="color"
                defaultValue="#8A6040"
                className="h-10 w-full rounded-lg border border-[var(--bo-line)] bg-white"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-1 text-sm">
                <span className="text-[var(--bo-muted)]">Metalness</span>
                <input
                  name="metallic"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  defaultValue="0"
                  className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
                />
              </label>
              <label className="grid gap-1 text-sm">
                <span className="text-[var(--bo-muted)]">Roughness</span>
                <input
                  name="roughness"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  defaultValue="0.55"
                  className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
                />
              </label>
            </div>
            <p className="text-xs text-[var(--bo-muted)]">
              Texture maps can be linked later. Prefer authoring in 3D Studio
              when applying to a product.
            </p>
            {message ? (
              <p className="text-sm text-[var(--bo-danger)]">{message}</p>
            ) : null}
            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="bo-btn-primary rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60"
              >
                {pending ? 'Creating…' : 'Create'}
              </button>
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
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">Name</span>
              <input
                name="name"
                required
                placeholder="Studio Chair"
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">Key</span>
              <input
                name="code"
                placeholder="CHAIR-01"
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span className="text-[var(--bo-muted)]">GLB / GLTF file</span>
              <input
                name="file"
                type="file"
                accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
                required
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2 text-sm file:mr-2"
              />
            </label>
            <p className="text-xs text-[var(--bo-muted)]">
              Hierarchy and material slots are parsed on upload for Studio
              targeting.
            </p>
            {message ? (
              <p className="text-sm text-[var(--bo-danger)]">{message}</p>
            ) : null}
            <div className="mt-1 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="bo-btn-primary rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60"
              >
                {pending ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
