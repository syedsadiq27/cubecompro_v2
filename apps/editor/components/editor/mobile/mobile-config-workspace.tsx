'use client';

import { useMemo } from 'react';
import {
  buildCoverageRows,
  effectsForChoiceValue,
} from '@/lib/authoring-focus';
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
}: {
  onRequestExpand?: () => void;
}) {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const setVisualSelection = useEditorStore((state) => state.setVisualSelection);
  const beginEffectComposer = useEditorStore(
    (state) => state.beginEffectComposer
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const loadError = useEditorStore((state) => state.loadError);

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

          <button
            type="button"
            onClick={() => {
              setVisualSelection(
                authoringFocus.choiceKey,
                authoringFocus.valueKey
              );
              setStatusMessage(
                `Previewing ${focusedMeta.value.valueName}`
              );
            }}
            className="flex h-9 w-full items-center justify-center rounded-xl bg-[#665CFF] text-[12px] font-medium text-white"
          >
            Preview in Scene
          </button>
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
              <button
                key={value.valueKey}
                type="button"
                onClick={() => {
                  setAuthoringFocus({
                    choiceKey: choice.choiceKey,
                    valueKey: value.valueKey,
                  });
                  onRequestExpand?.();
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2 text-left"
              >
                <span className="truncate text-[12px] font-medium text-white">
                  {value.valueName}
                </span>
                <span
                  className={`shrink-0 text-[10px] ${
                    value.unbound ? 'text-white/40' : 'text-emerald-400'
                  }`}
                >
                  {value.unbound
                    ? 'Unbound'
                    : `${value.effectCount} effect${value.effectCount === 1 ? '' : 's'}`}
                </span>
              </button>
            ))}
          </div>
        </MobileAccordion>
      ))}
    </div>
  );
}
