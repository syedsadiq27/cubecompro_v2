'use client';

import { useMemo, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { effectsForChoiceValue } from '@/lib/authoring-focus';

export function ConfigCoverageActionWindow() {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const authoringFocus = useEditorStore((state) => state.authoringFocus);
  const setAuthoringFocus = useEditorStore((state) => state.setAuthoringFocus);
  const [filter, setFilter] = useState<'all' | 'bound' | 'unbound'>('all');

  const rows = useMemo(() => {
    if (!graphDetail) return [];
    const list: Array<{
      choiceKey: string;
      choiceName: string;
      valueKey: string;
      valueName: string;
      effectCount: number;
      effectsSummary: string;
      isBound: boolean;
    }> = [];

    graphDetail.choices.forEach((choice) => {
      choice.values.forEach((value) => {
        const effects = effectsForChoiceValue(
          visualDocument,
          choice.key,
          value.key
        );
        const isBound = effects.length > 0;
        const effectsSummary = isBound
          ? effects.map((e) => e.operation).join(', ')
          : 'Unbound';

        list.push({
          choiceKey: choice.key,
          choiceName: choice.name?.trim() || choice.key,
          valueKey: value.key,
          valueName: value.name?.trim() || value.key,
          effectCount: effects.length,
          effectsSummary,
          isBound,
        });
      });
    });

    return list;
  }, [graphDetail, visualDocument]);

  const filteredRows = useMemo(() => {
    if (filter === 'bound') return rows.filter((r) => r.isBound);
    if (filter === 'unbound') return rows.filter((r) => !r.isBound);
    return rows;
  }, [rows, filter]);

  const boundCount = rows.filter((r) => r.isBound).length;

  return (
    <div className="flex h-full flex-col bg-[#101116] border-t border-white/10 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 shrink-0 bg-[#0E0F12]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-[13px] text-white">
            <span>Configuration Coverage</span>
            <span className="flex h-5 items-center justify-center rounded-full bg-white/10 px-1.5 font-mono text-[10px] text-white/70">
              {boundCount} / {rows.length} bound
            </span>
          </div>

          <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-xl border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              All ({rows.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('bound')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filter === 'bound'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Bound ({boundCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unbound')}
              className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                filter === 'unbound'
                  ? 'bg-[#665CFF] text-white shadow-xs'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Unbound ({rows.length - boundCount})
            </button>
          </div>
        </div>
      </div>

      {/* Coverage Table */}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full text-left text-[12px] border-collapse">
          <thead className="sticky top-0 bg-[#14151B] border-b border-white/10 text-[10px] font-mono font-medium uppercase tracking-wider text-white/50 z-10">
            <tr>
              <th className="px-3 py-2">Choice</th>
              <th className="px-3 py-2">Choice Value</th>
              <th className="px-3 py-2">Effects Count</th>
              <th className="px-3 py-2">Configured Operations</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredRows.map((row) => {
              const isSelected =
                authoringFocus?.choiceKey === row.choiceKey &&
                authoringFocus?.valueKey === row.valueKey;

              return (
                <tr
                  key={`${row.choiceKey}-${row.valueKey}`}
                  onClick={() =>
                    setAuthoringFocus({
                      choiceKey: row.choiceKey,
                      valueKey: row.valueKey,
                    })
                  }
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#232549] text-white border-l-2 border-[#665CFF]'
                      : 'hover:bg-white/5 text-white/80'
                  }`}
                >
                  <td className="px-3 py-2 font-medium text-white/90">
                    {row.choiceName}
                  </td>
                  <td className="px-3 py-2 font-semibold text-white">
                    {row.valueName}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-white/70">
                    {row.effectCount} effect{row.effectCount === 1 ? '' : 's'}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[#9D95FF]">
                    {row.effectsSummary}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold ${
                        row.isBound
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                      }`}
                    >
                      <span className={`h-1 w-1 rounded-full ${row.isBound ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {row.isBound ? 'BOUND' : 'UNBOUND'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
