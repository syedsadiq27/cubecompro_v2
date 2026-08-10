'use client';

import { useEffect, useMemo } from 'react';
import { findConfigValue } from '../../../lib/configuration';
import {
  createInspectorContext,
  objectLabel,
} from '../../../lib/inspector/context';
import {
  getInspectorStep,
  groupSteps,
  stepsForContext,
} from '../../../lib/inspector/registry';
import { useEditorStore } from '../../../lib/editor-store';
import { ensureInspectorStepsRegistered } from './register-steps';
import { InspectorRail } from './inspector-rail';

ensureInspectorStepsRegistered();

export function InspectorPanel() {
  const selected = useEditorStore((state) => state.selected);
  const document = useEditorStore((state) => state.document);
  const configuration = useEditorStore((state) => state.configuration);
  const configSelection = useEditorStore((state) => state.configSelection);
  const selectionRevision = useEditorStore((state) => state.selectionRevision);
  const inspectorStepId = useEditorStore((state) => state.inspectorStepId);
  const setInspectorStepId = useEditorStore(
    (state) => state.setInspectorStepId
  );

  const ctx = useMemo(
    () =>
      createInspectorContext({
        selected,
        document,
        selectionRevision,
      }),
    [selected, document, selectionRevision]
  );

  const configContext = useMemo(
    () => findConfigValue(configuration ?? { properties: [] }, configSelection),
    [configuration, configSelection]
  );

  const available = useMemo(() => {
    return stepsForContext(ctx.kind);
  }, [ctx.kind]);

  const groups = useMemo(() => groupSteps(available), [available]);

  useEffect(() => {
    if (!inspectorStepId) return;
    if (!available.some((step) => step.id === inspectorStepId)) {
      setInspectorStepId(null);
    }
  }, [available, inspectorStepId, setInspectorStepId]);

  const activeStep = inspectorStepId
    ? getInspectorStep(inspectorStepId)
    : null;

  const title = activeStep
    ? activeStep.label
    : configContext
      ? `${configContext.property.name} / ${configContext.value.name}`
      : ctx.kind === 'model'
        ? document?.modelName || 'Model'
        : objectLabel(selected);

  const subtitle = activeStep
    ? null
    : configContext
      ? objectLabel(selected) ||
        configContext.value.objects[0]?.name ||
        'Object'
      : ctx.kind === 'model'
        ? document?.modelSku
        : selected?.type || 'Object';

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-l border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="border-b border-[var(--line)] px-3 py-3">
        <p className="type-nav-label">Inspector</p>
        <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
          {title}
        </p>
        {subtitle ? (
          <p className="type-meta mt-0.5 truncate">{subtitle}</p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {activeStep ? (
          <div className="space-y-4 px-1">
            <button
              type="button"
              onClick={() => setInspectorStepId(null)}
              className="text-[12px] text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              ← {ctx.kind === 'model' ? 'Configure' : 'Inspector'}
            </button>
            {activeStep.render(ctx)}
          </div>
        ) : (
          <>
            {configContext ? (
              <div className="mb-4 rounded-[8px] border border-[var(--line)] px-3 py-2.5">
                <p className="type-nav-label">Object</p>
                <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
                  {objectLabel(selected) ||
                    configContext.value.objects[0]?.name ||
                    '—'}
                </p>
              </div>
            ) : null}
            <InspectorRail
              groups={groups}
              activeId={null}
              onSelect={setInspectorStepId}
              resolveStatus={(step) => step.getStatus?.(ctx)}
              resolveSummary={(step) => step.getSummary?.(ctx)}
              numberedGroups={ctx.kind === 'model' ? ['configure'] : []}
            />
          </>
        )}
      </div>
    </aside>
  );
}
