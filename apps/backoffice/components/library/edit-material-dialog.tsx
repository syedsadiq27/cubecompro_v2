'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, Typography } from '@repo/ui';
import {
  MATERIAL_FACTORS,
  TEXTURE_SEMANTIC_SLOT_LABELS,
  TEXTURE_SEMANTIC_SLOTS,
  TEXTURE_WRAP_MODES,
  materialDefinitionFromValues,
  materialFactorValuesFromDocument,
  type MaterialDocument,
  type MaterialTextureUsage,
  type TextureSemanticSlot,
  type TextureWrapMode,
} from '@repo/product-graph';
import {
  listTexturesForPinningAction,
  publishMaterialAction,
  updateMaterialAction,
} from '@/actions/assets';
import { MaterialSwatch } from './material-swatch';

type TextureOption = {
  id: string;
  name: string;
  code?: string | null;
  currentRevisionId?: string | null;
  fileUrl?: string | null;
};

type SlotDraft = {
  textureAssetRevisionId: string;
  wrapS: TextureWrapMode | '';
  wrapT: TextureWrapMode | '';
};

function emptySlots(): Record<TextureSemanticSlot, SlotDraft> {
  return Object.fromEntries(
    TEXTURE_SEMANTIC_SLOTS.map((slot) => [
      slot,
      { textureAssetRevisionId: '', wrapS: '', wrapT: '' },
    ])
  ) as Record<TextureSemanticSlot, SlotDraft>;
}

function slotsFromDocument(
  document: MaterialDocument | null
): Record<TextureSemanticSlot, SlotDraft> {
  const next = emptySlots();
  for (const usage of document?.textureUsages || []) {
    if (!TEXTURE_SEMANTIC_SLOTS.includes(usage.slot)) continue;
    next[usage.slot] = {
      textureAssetRevisionId: usage.textureAssetRevisionId,
      wrapS: (usage.sampler?.wrapS as TextureWrapMode | undefined) || '',
      wrapT: (usage.sampler?.wrapT as TextureWrapMode | undefined) || '',
    };
  }
  return next;
}

export function EditMaterialDialog({
  projectId,
  materialId,
  name,
  code,
  document,
  open,
  onClose,
  onSaved,
}: {
  projectId: string;
  materialId: string;
  name: string;
  code?: string | null;
  document: MaterialDocument | null;
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [textures, setTextures] = useState<TextureOption[]>([]);
  const [factors, setFactors] = useState(() =>
    materialFactorValuesFromDocument(document)
  );
  const [slots, setSlots] = useState(() => slotsFromDocument(document));

  useEffect(() => {
    if (!open) return;
    setMessage(null);
    setFactors(materialFactorValuesFromDocument(document));
    setSlots(slotsFromDocument(document));
  }, [open, document]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    startTransition(async () => {
      const result = await listTexturesForPinningAction(projectId);
      if (cancelled) return;
      if (result.ok) setTextures(result.textures);
    });
    return () => {
      cancelled = true;
    };
  }, [open, projectId]);

  const textureUsages = useMemo(() => {
    const usages: MaterialTextureUsage[] = [];
    for (const slot of TEXTURE_SEMANTIC_SLOTS) {
      const draft = slots[slot];
      if (!draft.textureAssetRevisionId) continue;
      const sampler =
        draft.wrapS || draft.wrapT
          ? {
              ...(draft.wrapS ? { wrapS: draft.wrapS } : {}),
              ...(draft.wrapT ? { wrapT: draft.wrapT } : {}),
            }
          : undefined;
      usages.push({
        slot,
        textureAssetRevisionId: draft.textureAssetRevisionId,
        ...(sampler ? { sampler } : {}),
      });
    }
    return usages;
  }, [slots]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--line)] bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--ink)]">
              Edit material
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Save overwrites the draft tip. Publish freezes an immutable
              revision for product pins. Wrap modes live on material usage.
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
            color={String(factors.baseColor)}
            roughness={Number(factors.roughness)}
            metalness={Number(factors.metallic)}
            className="aspect-[5/3] w-full"
          />
        </div>

        <form
          id="edit-material-form"
          className="grid gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const documentJson = JSON.stringify({
              ...materialDefinitionFromValues(factors),
              textureUsages,
            });
            formData.set('documentJson', documentJson);
            startTransition(async () => {
              const result = await updateMaterialAction(
                projectId,
                materialId,
                formData
              );
              if (result.ok) {
                onSaved?.();
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

          <div className="grid grid-cols-2 gap-3">
            {MATERIAL_FACTORS.filter((factor) => factor.type === 'color').map(
              (factor) => (
                <Field
                  key={factor.key}
                  label={factor.label}
                  htmlFor={`edit-material-${factor.key}`}
                >
                  <Input
                    id={`edit-material-${factor.key}`}
                    name={factor.key}
                    type="color"
                    value={String(factors[factor.key])}
                    onChange={(event) =>
                      setFactors((current) => ({
                        ...current,
                        [factor.key]: event.target.value,
                      }))
                    }
                    className="h-10"
                  />
                </Field>
              )
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {MATERIAL_FACTORS.filter((factor) => factor.type === 'number').map(
              (factor) => (
                <Field
                  key={factor.key}
                  label={factor.label}
                  htmlFor={`edit-material-${factor.key}`}
                >
                  <Input
                    id={`edit-material-${factor.key}`}
                    name={factor.key}
                    type="number"
                    step={factor.step}
                    min={factor.min}
                    max={factor.max}
                    value={Number(factors[factor.key])}
                    onChange={(event) =>
                      setFactors((current) => ({
                        ...current,
                        [factor.key]: Number(event.target.value) || 0,
                      }))
                    }
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
                <input
                  type="checkbox"
                  name={factor.key}
                  checked={Boolean(factors[factor.key])}
                  onChange={(event) =>
                    setFactors((current) => ({
                      ...current,
                      [factor.key]: event.target.checked,
                    }))
                  }
                />
                {factor.label}
              </label>
            )
          )}

          <div className="mt-2 space-y-2 border-t border-[var(--line)] pt-3">
            <div>
              <h3 className="text-[12px] font-semibold text-[var(--ink)]">
                Texture maps
              </h3>
              <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                Pin library textures to semantic slots. wrapS / wrapT are
                material usage properties.
              </p>
            </div>
            {textures.length === 0 ? (
              <p className="text-[12px] text-[var(--text-muted)]">
                No textures in this project yet. Upload one under Assets →
                Texture first.
              </p>
            ) : (
              <div className="space-y-3">
                {TEXTURE_SEMANTIC_SLOTS.map((slot) => {
                  const draft = slots[slot];
                  return (
                    <div
                      key={slot}
                      className="rounded-xl border border-[var(--line)] bg-[var(--canvas)]/40 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[12px] font-semibold text-[var(--ink)]">
                          {TEXTURE_SEMANTIC_SLOT_LABELS[slot]}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--text-muted)]">
                          {slot}
                        </span>
                      </div>
                      <div className="grid gap-2">
                        <select
                          className="h-9 rounded-lg border border-[var(--line)] bg-white px-2 text-[12px]"
                          value={draft.textureAssetRevisionId}
                          onChange={(event) =>
                            setSlots((prev) => ({
                              ...prev,
                              [slot]: {
                                ...prev[slot],
                                textureAssetRevisionId: event.target.value,
                              },
                            }))
                          }
                        >
                          <option value="">None</option>
                          {draft.textureAssetRevisionId &&
                          !textures.some(
                            (texture) =>
                              texture.currentRevisionId ===
                              draft.textureAssetRevisionId
                          ) ? (
                            <option value={draft.textureAssetRevisionId}>
                              Pinned revision (not tip)
                            </option>
                          ) : null}
                          {textures.map((texture) => (
                            <option
                              key={texture.id}
                              value={texture.currentRevisionId || ''}
                            >
                              {texture.name}
                              {texture.code ? ` (${texture.code})` : ''}
                            </option>
                          ))}
                        </select>
                        {draft.textureAssetRevisionId ? (
                          <div className="grid grid-cols-2 gap-2">
                            <label className="grid gap-1 text-[11px] text-[var(--text-secondary)]">
                              wrapS
                              <select
                                className="h-8 rounded-lg border border-[var(--line)] bg-white px-2 text-[12px]"
                                value={draft.wrapS}
                                onChange={(event) =>
                                  setSlots((prev) => ({
                                    ...prev,
                                    [slot]: {
                                      ...prev[slot],
                                      wrapS: event.target
                                        .value as TextureWrapMode | '',
                                    },
                                  }))
                                }
                              >
                                <option value="">Default</option>
                                {TEXTURE_WRAP_MODES.map((mode) => (
                                  <option key={mode} value={mode}>
                                    {mode}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label className="grid gap-1 text-[11px] text-[var(--text-secondary)]">
                              wrapT
                              <select
                                className="h-8 rounded-lg border border-[var(--line)] bg-white px-2 text-[12px]"
                                value={draft.wrapT}
                                onChange={(event) =>
                                  setSlots((prev) => ({
                                    ...prev,
                                    [slot]: {
                                      ...prev[slot],
                                      wrapT: event.target
                                        .value as TextureWrapMode | '',
                                    },
                                  }))
                                }
                              >
                                <option value="">Default</option>
                                {TEXTURE_WRAP_MODES.map((mode) => (
                                  <option key={mode} value={mode}>
                                    {mode}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {message ? (
            <Typography variant="support" className="text-[var(--danger)]">
              {message}
            </Typography>
          ) : null}
          <div className="mt-1 flex flex-wrap justify-end gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="secondary" disabled={pending}>
              {pending ? 'Saving…' : 'Save draft'}
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              onClick={() => {
                const formEl = window.document.getElementById(
                  'edit-material-form'
                ) as HTMLFormElement | null;
                const formData = formEl
                  ? new FormData(formEl)
                  : new FormData();
                if (!formData.get('name')) formData.set('name', name);
                if (!formData.get('code')) formData.set('code', code || '');
                formData.set(
                  'documentJson',
                  JSON.stringify({
                    ...materialDefinitionFromValues(factors),
                    textureUsages,
                  })
                );
                startTransition(async () => {
                  const saved = await updateMaterialAction(
                    projectId,
                    materialId,
                    formData
                  );
                  if (!saved.ok) {
                    setMessage(saved.error || 'Save failed.');
                    return;
                  }
                  const published = await publishMaterialAction(
                    projectId,
                    materialId
                  );
                  if (!published.ok) {
                    setMessage(published.error || 'Publish failed.');
                    return;
                  }
                  onSaved?.();
                  onClose();
                  router.refresh();
                });
              }}
            >
              {pending ? 'Publishing…' : 'Publish'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
