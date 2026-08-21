'use client';

import { useMemo, useState } from 'react';
import {
  buildCoverageRows,
  isRevisionEditable,
  revisionStatusLabel,
} from '@/lib/authoring-focus';
import { useEditorStore } from '@/lib/editor-store';

export function ProductCoveragePanel() {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const loadError = useEditorStore((state) => state.loadError);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedChoices, setCollapsedChoices] = useState<Record<string, boolean>>({});

  const rows = useMemo(
    () => buildCoverageRows(graphDetail, visualDocument),
    [graphDetail, visualDocument]
  );

  const totalValues = useMemo(() => {
    return rows.reduce((acc, choice) => acc + choice.values.length, 0);
  }, [rows]);

  const boundValues = useMemo(() => {
    return rows.reduce(
      (acc, choice) =>
        acc + choice.values.filter((v) => v.effectCount > 0).length,
      0
    );
  }, [rows]);

  const coveragePercent =
    totalValues > 0 ? Math.round((boundValues / totalValues) * 100) : 100;

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const q = searchQuery.toLowerCase();
    return rows
      .map((choice) => ({
        ...choice,
        values: choice.values.filter(
          (v) =>
            v.valueName.toLowerCase().includes(q) ||
            v.valueKey.toLowerCase().includes(q) ||
            choice.choiceName.toLowerCase().includes(q)
        ),
      }))
      .filter((choice) => choice.values.length > 0);
  }, [rows, searchQuery]);

  const toggleChoiceCollapse = (key: string) => {
    setCollapsedChoices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!graphDetail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-[12px] text-white/50">
        <p>Load a product revision to author visual configuration.</p>
        {loadError ? (
          <p className="text-center font-mono text-[10px] text-red-400">
            {loadError}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col text-white select-none">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 text-[12px]">
        {/* Search & Filter Bar */}
        <div className="relative flex items-center gap-1.5">
          <div className="relative flex-1">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search choices or values…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-xl border border-white/10 bg-[#181920] pl-8 pr-2 text-[12px] text-white outline-none placeholder:text-white/30 focus:border-[#665CFF]/60"
            />
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#181920] text-white/50 hover:text-white transition-colors"
            title="Filter options"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* Choices Header */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Choices
          </span>
          <button
            type="button"
            onClick={() => setStatusMessage('Add choice to product revision')}
            className="text-[11px] font-medium text-[#9D95FF] hover:underline"
          >
            + Add choice
          </button>
        </div>

        {/* Choices List */}
        <div className="space-y-3">
          {filteredRows.length === 0 ? (
            <p className="px-1 text-[11px] text-white/40">No choices found.</p>
          ) : (
            filteredRows.map((choice) => {
              const isCollapsed = Boolean(collapsedChoices[choice.choiceKey]);
              return (
                <section key={choice.choiceKey} className="space-y-1">
                  {/* Choice Header */}
                  <div
                    onClick={() => toggleChoiceCollapse(choice.choiceKey)}
                    className="flex items-center justify-between px-1 py-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[10px] text-white/40 group-hover:text-white transition-colors">
                        {isCollapsed ? '▸' : '▾'}
                      </span>
                      <h3 className="truncate text-[12px] font-semibold text-white/90">
                        {choice.choiceName}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">
                      {choice.values.length} value{choice.values.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {/* Value Rows */}
                  {!isCollapsed ? (
                    <ul className="space-y-1 pl-1">
                      {choice.values.map((value) => {
                        const active =
                          authoringFocus?.choiceKey === choice.choiceKey &&
                          authoringFocus?.valueKey === value.valueKey;
                        const isBound = value.effectCount > 0;

                        return (
                          <li key={value.valueKey}>
                            <div
                              onClick={() => {
                                setAuthoringFocus({
                                  choiceKey: choice.choiceKey,
                                  valueKey: value.valueKey,
                                });
                                setStatusMessage(
                                  `Editing effects: ${choice.choiceName} → ${value.valueName}`
                                );
                              }}
                              className={`group flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-colors ${
                                active
                                  ? 'bg-[#232549] border border-[#665CFF] text-white shadow-xs'
                                  : 'border border-transparent text-white/80 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${
                                    isBound
                                      ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                                      : 'border border-dashed border-white/30 text-white/30'
                                  }`}
                                >
                                  {isBound ? '✓' : ''}
                                </span>
                                <span className="truncate text-[12px] font-medium">
                                  {value.valueName}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isBound ? (
                                  <span className="font-mono text-[10px] text-white/40">
                                    {value.effectCount} effect
                                    {value.effectCount === 1 ? '' : 's'}
                                  </span>
                                ) : (
                                  <span className="rounded border border-dashed border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] text-amber-400">
                                    Unbound
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStatusMessage(`Options for ${value.valueName}`);
                                  }}
                                  className="p-0.5 text-white/30 hover:text-white transition-colors"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <circle cx="12" cy="5" r="2" />
                                    <circle cx="12" cy="12" r="2" />
                                    <circle cx="12" cy="19" r="2" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </section>
              );
            })
          )}
        </div>

        {/* Configuration Coverage Section */}
        <section className="border-t border-white/10 pt-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              Configuration Coverage ⓘ
            </span>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between font-mono text-[10px] text-white/50">
              <span>
                {boundValues} / {totalValues} values bound
              </span>
              <span className="font-bold text-white/80">{coveragePercent}%</span>
            </div>
          </div>

          {/* Validation card */}
          <div className="rounded-xl border border-white/10 bg-[#181920] p-2.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 text-[12px]">🛡️</span>
                <span className="text-[11px] font-medium text-white/80">Validation</span>
              </div>
              <span className="rounded bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 font-mono text-[9px] font-semibold text-emerald-400">
                ✓ Valid
              </span>
            </div>

            <p className="text-[10px] text-white/50 leading-relaxed">
              All required choice values have visual effects.
            </p>

            <button
              type="button"
              onClick={() => setStatusMessage('Running configuration validation…')}
              className="w-full rounded-lg border border-white/10 bg-white/5 py-1 text-[11px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              Run validation
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
