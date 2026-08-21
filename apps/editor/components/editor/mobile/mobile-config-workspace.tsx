'use client';

import { useMemo } from 'react';
import {
  buildCoverageRows,
  effectsForChoiceValue,
  isRevisionEditable,
} from '@/lib/authoring-focus';
import { ValueOptionsMenu } from '@/components/editor/value-options-menu';
import { useEditorStore } from '@/lib/editor-store';
import {
  MobileAccordion,
  MobileDrillHeader,
  MobileField,
  MobileSheetAction,
  useExclusiveAccordion,
} from './mobile-accordion';

export function MobileConfigWorkspace({
  onRequestExpand,
  onRequestPeek,
}: {
  onRequestExpand?: () => void;
  onRequestPeek?: () => void;
}) {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const previewChoiceValue = useEditorStore(
    (state) => state.previewChoiceValue
  );
  const setChoiceDefault = useEditorStore((state) => state.setChoiceDefault);
  const beginEffectComposer = useEditorStore(
    (state) => state.beginEffectComposer
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const loadError = useEditorStore((state) => state.loadError);

  const editable = isRevisionEditable(graphDetail?.status);

  const rows = useMemo(
    () => buildCoverageRows(graphDetail, visualDocument),
    [graphDetail, visualDocument]
  );

  const { isOpen, toggle } = useExclusiveAccordion();

  const focusedEffects = useMemo(() => {
    if (!authoringFocus) return [];
    return effectsForChoiceValue(
      visualDocument,
      authoringFocus.choiceKey,
      authoringFocus.valueKey
    );
  }, [authoringFocus, visualDocument]);

  const focusedMeta = useMemo(() => {
    if (!authoringFocus) return null;
    const choice = rows.find((row) => row.choiceKey === authoringFocus.choiceKey);
    const value = choice?.values.find(
      (item) => item.valueKey === authoringFocus.valueKey
    );
    if (!choice || !value) return null;
    return { choice, value };
  }, [authoringFocus, rows]);

  if (authoringFocus && focusedMeta) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <MobileDrillHeader
          title={focusedMeta.value.valueName}
          onBack={() => setAuthoringFocus(null)}
        />
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <MobileField label="Choice">
            <div className="rounded-xl border border-white/10 bg-[#16171E] px-3 py-2 text-[12px] text-white">
              {focusedMeta.choice.choiceName}
            </div>
          </MobileField>
          <MobileField label="Value">
            <div className="rounded-xl border border-white/10 bg-[#16171E] px-3 py-2 text-[12px] text-white">
              {focusedMeta.value.valueName}
              <span className="mt-0.5 block font-mono text-[9px] text-white/40">
                {focusedMeta.value.valueKey}
              </span>
            </div>
          </MobileField>

          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/80">
                Effects ({focusedEffects.length})
              </span>
              <MobileSheetAction
                tone="accent"
                onClick={() => {
                  beginEffectComposer();
                  setStatusMessage('Compose a visual effect for this value');
                }}
              >
                + Effect
              </MobileSheetAction>
            </div>
            {focusedEffects.length === 0 ? (
              <p className="text-[11px] text-white/40">
                Unbound — no visual effects yet.
              </p>
            ) : (
              focusedEffects.map((effect) => (
                <div
                  key={`${effect.targetKey}:${effect.operation}`}
                  className="rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2"
                >
                  <p className="text-[12px] font-medium text-white">
                    {effect.operation}
                  </p>
                  <p className="font-mono text-[10px] text-white/40">
                    → {effect.targetKey}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={!editable}
              onClick={() => {
                void setChoiceDefault(
                  focusedMeta.choice.choiceId,
                  focusedMeta.value.isDefault
                    ? null
                    : focusedMeta.value.valueId
                ).catch(() => undefined);
              }}
              className="flex h-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-[12px] font-medium text-white disabled:opacity-40"
            >
              {focusedMeta.value.isDefault ? 'Clear default' : 'Make default'}
            </button>
            <button
              type="button"
              onClick={() => {
                previewChoiceValue(
                  authoringFocus.choiceKey,
                  authoringFocus.valueKey
                );
                setStatusMessage(
                  `Previewing ${focusedMeta.value.valueName} in scene`
                );
                onRequestPeek?.();
              }}
              className="flex h-9 items-center justify-center rounded-xl bg-[#665CFF] text-[12px] font-medium text-white"
            >
              Show Scene
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!graphDetail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-[12px] text-white/50">
        <p>Load a product revision to author configuration.</p>
        {loadError ? (
          <p className="text-center font-mono text-[10px] text-red-400">
            {loadError}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      {rows.map((choice) => (
        <MobileAccordion
          key={choice.choiceKey}
          title={choice.choiceName}
          open={isOpen(choice.choiceKey)}
          onToggle={() => toggle(choice.choiceKey)}
          count={choice.values.length}
        >
          <div className="space-y-1">
            {choice.values.map((value) => (
              <div
                key={value.valueKey}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2"
              >
                <button
                  type="button"
                  onClick={() => {
                    previewChoiceValue(choice.choiceKey, value.valueKey);
                    onRequestExpand?.();
                  }}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-center gap-1.5 truncate text-[12px] font-medium text-white">
                    {value.valueName}
                    {value.isDefault ? (
                      <span className="rounded border border-[#665CFF]/40 bg-[#665CFF]/15 px-1 py-0.5 font-mono text-[9px] text-[#9D95FF]">
                        Default
                      </span>
                    ) : null}
                  </span>
                  <span
                    className={`mt-0.5 block text-[10px] ${
                      value.unbound ? 'text-white/40' : 'text-emerald-400'
                    }`}
                  >
                    {value.unbound
                      ? 'Unbound'
                      : `${value.effectCount} effect${value.effectCount === 1 ? '' : 's'}`}
                  </span>
                </button>
                <ValueOptionsMenu
                  actions={[
                    {
                      id: 'preview',
                      label: 'Preview in scene',
                      onSelect: () => {
                        previewChoiceValue(choice.choiceKey, value.valueKey);
                        onRequestPeek?.();
                      },
                    },
                    {
                      id: 'default',
                      label: value.isDefault
                        ? 'Clear default'
                        : 'Make default',
                      tone: 'accent',
                      disabled: !editable,
                      onSelect: () => {
                        void setChoiceDefault(
                          choice.choiceId,
                          value.isDefault ? null : value.valueId
                        ).catch(() => undefined);
                      },
                    },
                    {
                      id: 'effect',
                      label: value.unbound
                        ? 'Add effect'
                        : 'Add another effect',
                      disabled: !editable,
                      onSelect: () => {
                        setAuthoringFocus({
                          choiceKey: choice.choiceKey,
                          valueKey: value.valueKey,
                        });
                        beginEffectComposer();
                        onRequestExpand?.();
                      },
                    },
                  ]}
                />
              </div>
            ))}
          </div>
        </MobileAccordion>
      ))}
    </div>
  );
}
