'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button, useToast } from '@repo/ui';
import {
  CheckIcon,
  ExternalLinkIcon,
  IncompleteConfigBanner,
  SelectInput,
} from '@/components/bo';
import {
  createVisualEffectAction,
  deleteVisualEffectAction,
  updateVisualEffectAction,
} from '@/actions/graph';
import {
  getStudioChoiceHref,
  getStudioChoiceValueHref,
} from '@/lib/editor-embed';
import {
  formatAssetRevisionLabel,
  type MaterialAssetOption,
  type VisualMappingChoice,
  type VisualMappingEffectGroup,
  type VisualMappingOperation,
  type VisualMappingResourceOption,
  type VisualMappingTarget,
  type VisualMappingValue,
} from '@/lib/product-workspace';

const OPERATIONS: VisualMappingOperation[] = [
  'SET_MATERIAL',
  'SET_VISIBILITY',
  'REPLACE_COMPONENT',
];

export function OptionMappingCard({
  projectId,
  productId,
  modelId,
  choice,
  materialTargets,
  visibilityTargets,
  objectTargets,
  materialAssets,
  objectResources,
  editable,
}: {
  projectId: string;
  productId: string;
  modelId?: string | null;
  choice: VisualMappingChoice;
  materialTargets: VisualMappingTarget[];
  visibilityTargets: VisualMappingTarget[];
  objectTargets: VisualMappingTarget[];
  materialAssets: MaterialAssetOption[];
  objectResources: VisualMappingResourceOption[];
  editable: boolean;
}) {
  const matrixValues = useMemo(
    () => choice.values.filter((value) => value.simpleBind.eligible),
    [choice]
  );
  const complexValues = useMemo(
    () => choice.values.filter((value) => !value.simpleBind.eligible),
    [choice]
  );
  const inferredOperation =
    matrixValues
      .map((value) => value.simpleBind.operation)
      .find((operation): operation is VisualMappingOperation =>
        Boolean(operation)
      ) ?? 'SET_MATERIAL';
  const inferredTargetId =
    matrixValues.find((value) => value.simpleBind.targetId)?.simpleBind
      .targetId ?? '';

  const [editing, setEditing] = useState(choice.unboundCount > 0);
  const [operation, setOperation] =
    useState<VisualMappingOperation>(inferredOperation);
  const [targetId, setTargetId] = useState(inferredTargetId);
  const [resources, setResources] = useState<Record<string, string>>(() =>
    resourceState(matrixValues)
  );

  const snapshot = matrixValues
    .map(
      (value) =>
        `${value.id}:${value.simpleBind.operation ?? ''}:${value.simpleBind.targetId ?? ''}:${value.simpleBind.resourceId ?? ''}`
    )
    .join('|');

  useEffect(() => {
    setOperation(inferredOperation);
    setTargetId(inferredTargetId);
    setResources(resourceState(matrixValues));
    setEditing(choice.unboundCount > 0);
  }, [snapshot, inferredOperation, inferredTargetId, choice.unboundCount, matrixValues]);

  const targets =
    operation === 'SET_VISIBILITY'
      ? visibilityTargets
      : operation === 'REPLACE_COMPONENT'
        ? objectTargets
        : materialTargets;
  const studioHref = getStudioChoiceHref({
    projectId,
    productId,
    modelId,
    choiceKey: choice.key,
  });

  if (targets.length === 0 && matrixValues.length > 0) {
    return (
      <div className="space-y-3">
        <IncompleteConfigBanner
          title="No surface targets exist yet"
          issues={[
            'Create the first target in Studio, then mappings can be managed here.',
          ]}
        />
        <StudioLink href={studioHref} label="Create target in Studio" />
        {complexValues.map((value) => (
          <ComplexValueSummary
            key={value.id}
            projectId={projectId}
            productId={productId}
            modelId={modelId}
            choiceKey={choice.key}
            value={value}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matrixValues.length > 0 ? (
        <BatchMapping
          projectId={projectId}
          productId={productId}
          choice={choice}
          matrixValues={matrixValues}
          operation={operation}
          targetId={targetId}
          targets={targets}
          resources={resources}
          materialAssets={materialAssets}
          objectResources={objectResources}
          editing={editing}
          editable={editable}
          studioHref={studioHref}
          onOperationChange={(next) => {
            setOperation(next);
            const nextTargets =
              next === 'SET_VISIBILITY'
                ? visibilityTargets
                : next === 'REPLACE_COMPONENT'
                  ? objectTargets
                  : materialTargets;
            if (!nextTargets.some((target) => target.id === targetId)) {
              setTargetId('');
            }
            setResources(
              Object.fromEntries(matrixValues.map((value) => [value.id, '']))
            );
          }}
          onTargetChange={setTargetId}
          onResourceChange={(valueId, resourceId) =>
            setResources((current) => ({ ...current, [valueId]: resourceId }))
          }
          onEdit={() => setEditing(true)}
          onCancel={() => {
            setOperation(inferredOperation);
            setTargetId(inferredTargetId);
            setResources(resourceState(matrixValues));
            setEditing(false);
          }}
          onSaved={() => setEditing(false)}
        />
      ) : null}

      {complexValues.map((value) => (
        <ComplexValueSummary
          key={value.id}
          projectId={projectId}
          productId={productId}
          modelId={modelId}
          choiceKey={choice.key}
          value={value}
        />
      ))}
    </div>
  );
}

function BatchMapping({
  projectId,
  productId,
  choice,
  matrixValues,
  operation,
  targetId,
  targets,
  resources,
  materialAssets,
  objectResources,
  editing,
  editable,
  studioHref,
  onOperationChange,
  onTargetChange,
  onResourceChange,
  onEdit,
  onCancel,
  onSaved,
}: {
  projectId: string;
  productId: string;
  choice: VisualMappingChoice;
  matrixValues: VisualMappingValue[];
  operation: VisualMappingOperation;
  targetId: string;
  targets: VisualMappingTarget[];
  resources: Record<string, string>;
  materialAssets: MaterialAssetOption[];
  objectResources: VisualMappingResourceOption[];
  editing: boolean;
  editable: boolean;
  studioHref: string;
  onOperationChange: (operation: VisualMappingOperation) => void;
  onTargetChange: (targetId: string) => void;
  onResourceChange: (valueId: string, resourceId: string) => void;
  onEdit: () => void;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const toast = useToast();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const resourceOptions = useMemo(
    () =>
      optionsForOperation({
        operation,
        matrixValues,
        materialAssets,
        objectResources,
      }),
    [operation, matrixValues, materialAssets, objectResources]
  );
  const targetName =
    targets.find((target) => target.id === targetId)?.name ?? '';
  const dirty = matrixValues.some((value) => {
    const next = resources[value.id] ?? '';
    const previous = value.simpleBind.resourceId ?? '';
    const previousTarget = value.simpleBind.targetId ?? '';
    const previousOp = value.simpleBind.operation;
    return (
      next !== previous ||
      (Boolean(next) && previousTarget !== targetId) ||
      (Boolean(next) && previousOp !== operation) ||
      (Boolean(previous) && !next)
    );
  });
  const canSave =
    editable &&
    !pending &&
    dirty &&
    (matrixValues.every((value) => !resources[value.id]) || Boolean(targetId));

  const save = () => {
    if (
      matrixValues.some((value) => resources[value.id]) &&
      !targetId
    ) {
      toast.error('Select a target');
      return;
    }

    startTransition(async () => {
      for (const value of matrixValues) {
        const next = resources[value.id] ?? '';
        const previous = value.simpleBind.resourceId ?? '';
        const effectId = value.simpleBind.effectId;
        const previousTarget = value.simpleBind.targetId ?? '';

        if (!next) {
          if (effectId) {
            const form = new FormData();
            form.set('id', effectId);
            const removed = await deleteVisualEffectAction(
              projectId,
              productId,
              form
            );
            if (!removed.ok) {
              toast.error(removed.error || 'Failed to clear mapping');
              router.refresh();
              return;
            }
          }
          continue;
        }

        const unchanged =
          effectId &&
          next === previous &&
          previousTarget === targetId &&
          value.simpleBind.operation === operation;
        if (unchanged) continue;

        if (effectId && previousTarget === targetId) {
          const form = encodeResourceForm(operation, next);
          form.set('id', effectId);
          const result = await updateVisualEffectAction(
            projectId,
            productId,
            form
          );
          if (!result.ok) {
            toast.error(result.error || 'Failed to save mappings');
            return;
          }
          continue;
        }

        const createForm = encodeResourceForm(operation, next);
        createForm.set('choiceValueId', value.id);
        createForm.set('modelTargetId', targetId);
        const created = await createVisualEffectAction(
          projectId,
          productId,
          createForm
        );
        if (!created.ok) {
          toast.error(created.error || 'Failed to save mappings');
          return;
        }
        if (effectId) {
          const deleteForm = new FormData();
          deleteForm.set('id', effectId);
          const removed = await deleteVisualEffectAction(
            projectId,
            productId,
            deleteForm
          );
          if (!removed.ok) {
            toast.error(
              removed.error || 'Saved, but a previous mapping remains'
            );
            router.refresh();
            return;
          }
        }
      }

      toast.success('Mappings saved');
      onSaved();
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          {editing ? (
            <div className="grid gap-2 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[var(--text-muted)]">
                  Effect
                </p>
                <SelectInput
                  aria-label={`${choice.name} operation`}
                  disabled={!editable || pending}
                  value={operation}
                  onChange={(event) =>
                    onOperationChange(
                      event.target.value as VisualMappingOperation
                    )
                  }
                >
                  {OPERATIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectInput>
              </div>
              <div>
                <p className="mb-1 text-[11px] font-semibold text-[var(--text-muted)]">
                  Target
                </p>
                <SelectInput
                  aria-label={`${choice.name} target`}
                  disabled={!editable || pending}
                  value={targetId}
                  onChange={(event) => onTargetChange(event.target.value)}
                >
                  <option value="">Select target</option>
                  {targets.map((target) => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </SelectInput>
              </div>
            </div>
          ) : (
            <p className="text-[12px] text-[var(--ink)]">
              <span className="font-mono text-[11px] font-semibold tracking-wide">
                {operation}
              </span>
              {targetName ? (
                <>
                  <span className="text-[var(--text-muted)]"> → </span>
                  <span>{targetName}</span>
                </>
              ) : null}
            </p>
          )}
        </div>
        <StudioLink href={studioHref} label="Studio" />
      </div>

      {editing ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-[var(--line)] text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                <th className="py-1.5 pr-3 font-semibold">Value</th>
                <th className="py-1.5 pr-3 font-semibold">
                  {resourceColumnLabel(operation)}
                </th>
                <th className="py-1.5 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {matrixValues.map((value) => (
                <tr
                  key={value.id}
                  className="border-b border-[var(--line)]/70 last:border-0"
                >
                  <td className="py-2 pr-3 text-[13px] font-medium text-[var(--ink)]">
                    {value.name}
                  </td>
                  <td className="py-2 pr-3">
                    <SelectInput
                      aria-label={`${value.name} ${resourceColumnLabel(operation)}`}
                      disabled={!editable || pending}
                      value={resources[value.id] ?? ''}
                      onChange={(event) =>
                        onResourceChange(value.id, event.target.value)
                      }
                    >
                      <option value="">
                        Select {resourceColumnLabel(operation).toLowerCase()}
                      </option>
                      {resourceOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.label}
                        </option>
                      ))}
                    </SelectInput>
                  </td>
                  <td className="py-2 text-right">
                    <MappingStatus unbound={value.unbound} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-1">
          {matrixValues.map((value) => (
            <div
              key={value.id}
              className="flex items-center justify-between gap-3 py-1"
            >
              <p className="min-w-0 text-[13px] font-medium text-[var(--ink)]">
                {value.name}
              </p>
              <div className="flex min-w-0 items-center gap-2">
                <p className="truncate text-[12px] text-[var(--text-secondary)]">
                  {resourceDisplay(value)}
                </p>
                <MappingStatus unbound={value.unbound} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {editing ? (
          <>
            {choice.mappedCount > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={onCancel}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={!canSave}
              onClick={save}
            >
              {pending ? 'Saving…' : 'Save mappings'}
            </Button>
          </>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={!editable}
            onClick={onEdit}
          >
            Edit mapping
          </Button>
        )}
      </div>
    </div>
  );
}

function ComplexValueSummary({
  projectId,
  productId,
  modelId,
  choiceKey,
  value,
}: {
  projectId: string;
  productId: string;
  modelId?: string | null;
  choiceKey: string;
  value: VisualMappingValue;
}) {
  const studioHref = getStudioChoiceValueHref({
    projectId,
    productId,
    modelId,
    choiceKey,
    valueKey: value.key,
  });

  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold text-[var(--ink)]">
            {value.name}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
            {value.effectCount} {value.effectCount === 1 ? 'effect' : 'effects'}
          </p>
        </div>
        <StudioLink href={studioHref} label="Studio" />
      </div>
      <div className="mt-2 space-y-2">
        {value.groups.map((group) => (
          <EffectLines
            key={`${group.operation}:${group.resourceId ?? group.resourceLabel}:${group.resultLabel}`}
            group={group}
          />
        ))}
      </div>
    </div>
  );
}

function EffectLines({ group }: { group: VisualMappingEffectGroup }) {
  const resource = group.resourceLabel ?? group.resultLabel;
  return (
    <div className="border-l border-[var(--line)] pl-3">
      <p className="font-mono text-[11px] font-semibold tracking-wide text-[var(--ink)]">
        {group.operation}
      </p>
      {resource ? (
        <p className="mt-0.5 text-[12px] text-[var(--ink)]">→ {resource}</p>
      ) : null}
      {group.targets.length === 1 && group.targets[0] ? (
        <p className="text-[12px] text-[var(--text-secondary)]">
          → {group.targets[0].name}
        </p>
      ) : group.targets.length > 1 ? (
        <p className="text-[12px] text-[var(--text-secondary)]">
          → {group.targets.map((target) => target.name).join(' · ')}
        </p>
      ) : null}
    </div>
  );
}

function MappingStatus({ unbound }: { unbound: boolean }) {
  if (unbound) {
    return (
      <span className="text-[11px] text-[var(--text-muted)]">Unbound</span>
    );
  }
  return <CheckIcon size={13} className="inline text-emerald-600" />;
}

function StudioLink({ href, label }: { href: string; label: string }) {
  return (
    <Button
      as={Link}
      href={href}
      size="sm"
      variant="ghost"
      className="ui:h-auto ui:shrink-0 ui:gap-1 ui:px-0 ui:text-[11px] ui:font-medium ui:text-[var(--text-secondary)] ui:hover:bg-transparent ui:hover:text-[var(--ink)] ui:hover:underline"
    >
      {label}
      <ExternalLinkIcon size={11} />
    </Button>
  );
}

function resourceColumnLabel(operation: VisualMappingOperation): string {
  if (operation === 'SET_VISIBILITY') return 'Visibility';
  if (operation === 'REPLACE_COMPONENT') return 'Object';
  return 'Material';
}

function resourceDisplay(value: VisualMappingValue): string {
  const group = value.groups[0];
  if (!group) return '';
  return group.resourceLabel ?? group.resultLabel ?? '';
}

function resourceState(values: VisualMappingValue[]): Record<string, string> {
  return Object.fromEntries(
    values.map((value) => [value.id, value.simpleBind.resourceId ?? ''])
  );
}

function encodeResourceForm(
  operation: VisualMappingOperation,
  resourceId: string
): FormData {
  const form = new FormData();
  form.set('operation', operation);
  if (operation === 'SET_MATERIAL') {
    form.set('materialAssetRevisionId', resourceId);
  } else if (operation === 'REPLACE_COMPONENT') {
    form.set('linkedAssetKey', resourceId);
  } else {
    form.set('value', resourceId);
  }
  return form;
}

function optionsForOperation({
  operation,
  matrixValues,
  materialAssets,
  objectResources,
}: {
  operation: VisualMappingOperation;
  matrixValues: VisualMappingValue[];
  materialAssets: MaterialAssetOption[];
  objectResources: VisualMappingResourceOption[];
}): VisualMappingResourceOption[] {
  if (operation === 'SET_VISIBILITY') {
    return [
      { id: 'true', label: 'Visible' },
      { id: 'false', label: 'Hidden' },
    ];
  }
  if (operation === 'REPLACE_COMPONENT') {
    const rows = [...objectResources];
    for (const value of matrixValues) {
      const bound = value.simpleBind.resourceId;
      if (bound && !rows.some((row) => row.id === bound)) {
        rows.unshift({
          id: bound,
          label: value.groups[0]?.resourceLabel ?? bound,
        });
      }
    }
    return rows;
  }

  const rows: VisualMappingResourceOption[] = materialAssets
    .filter((material) => Boolean(material.currentRevisionId))
    .map((material) => ({
      id: material.currentRevisionId as string,
      label: formatAssetRevisionLabel({ name: material.name }),
    }));
  for (const value of matrixValues) {
    const bound = value.simpleBind.resourceId;
    if (bound && !rows.some((row) => row.id === bound)) {
      rows.unshift({
        id: bound,
        label: value.groups[0]?.resourceLabel ?? 'Selected revision',
      });
    }
  }
  return rows;
}
