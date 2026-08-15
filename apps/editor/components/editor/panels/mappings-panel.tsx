'use client';

import { useState } from 'react';
import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

type VisualMapping = {
  id: string;
  optionLabel: string;
  optionValue: string;
  targetMesh: string;
  operation: 'SET_MATERIAL' | 'SHOW_HIDE' | 'SWAP_MESH';
  targetValue: string;
  status: 'Active' | 'Draft';
};

const DEFAULT_MAPPINGS: VisualMapping[] = [
  {
    id: 'map-1',
    optionLabel: 'Frame',
    optionValue: 'Walnut',
    targetMesh: 'Chair_Frame',
    operation: 'SET_MATERIAL',
    targetValue: 'Material_Walnut_Wood',
    status: 'Active',
  },
  {
    id: 'map-2',
    optionLabel: 'Frame',
    optionValue: 'Oak',
    targetMesh: 'Chair_Frame',
    operation: 'SET_MATERIAL',
    targetValue: 'Material_Oak_Wood',
    status: 'Active',
  },
  {
    id: 'map-3',
    optionLabel: 'Color',
    optionValue: 'Black',
    targetMesh: 'Seat_Cushion',
    operation: 'SET_MATERIAL',
    targetValue: 'Material_Black_Leather',
    status: 'Active',
  },
  {
    id: 'map-4',
    optionLabel: 'Color',
    optionValue: 'White',
    targetMesh: 'Seat_Cushion',
    operation: 'SET_MATERIAL',
    targetValue: 'Material_White_Leather',
    status: 'Active',
  },
];

export function MappingsPanel() {
  const [mappings, setMappings] = useState<VisualMapping[]>(DEFAULT_MAPPINGS);
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_MAPPINGS[0]?.id ?? '');
  const [createOpen, setCreateOpen] = useState(false);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  // Form states
  const [newOption, setNewOption] = useState('Frame = Walnut');
  const [newTarget, setNewTarget] = useState('Chair_Frame');
  const [newOperation, setNewOperation] = useState<'SET_MATERIAL' | 'SHOW_HIDE' | 'SWAP_MESH'>('SET_MATERIAL');
  const [newTargetValue, setNewTargetValue] = useState('Material_Walnut_Wood');

  const handleTestMapping = (mapping: VisualMapping) => {
    setStatusMessage(`Testing mapping: ${mapping.targetMesh} → ${mapping.targetValue}`);
  };

  const handleAddMapping = (e: React.FormEvent) => {
    e.preventDefault();
    const [optLabel, optVal] = newOption.split(' = ');
    const newMap: VisualMapping = {
      id: `map-${Date.now()}`,
      optionLabel: optLabel || 'Option',
      optionValue: optVal || 'Value',
      targetMesh: newTarget,
      operation: newOperation,
      targetValue: newTargetValue,
      status: 'Active',
    };
    setMappings((prev) => [...prev, newMap]);
    setSelectedId(newMap.id);
    setCreateOpen(false);
    setStatusMessage(`Created mapping: ${newMap.optionLabel} → ${newMap.targetMesh}`);
  };

  return (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-3 text-[12px]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Option &rarr; Scene Bindings ({mappings.length})
          </p>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded border border-[var(--line)] bg-[var(--surface-pure)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
          >
            + Add mapping
          </button>
        </div>

        <div className="space-y-1.5 text-[11px]">
          {mappings.map((mapping) => {
            const isSelected = selectedId === mapping.id;
            return (
              <div
                key={mapping.id}
                onClick={() => setSelectedId(mapping.id)}
                className={`rounded-lg border p-2.5 space-y-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[var(--brand)] bg-violet-50/20'
                    : 'border-[var(--line)] bg-[var(--surface-pure)] hover:bg-[var(--canvas)]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--ink)]">
                    {mapping.optionLabel} &rarr; {mapping.optionValue}
                  </span>
                  <StatusBadge role="published" label={mapping.operation} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                  <span>Target: {mapping.targetMesh}</span>
                  <span>{mapping.targetValue}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestMapping(mapping);
                    }}
                    className="rounded border border-[var(--line)] bg-[var(--canvas)]/50 px-2 py-0.5 text-[10px] font-medium hover:bg-[var(--canvas)]"
                  >
                    Test binding
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Mapping Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-100">
          <div className="w-full max-w-sm rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-2xl space-y-3 text-[12px]">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
              <h3 className="font-bold text-[var(--ink)]">New Visual Effect Binding</h3>
              <button type="button" onClick={() => setCreateOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--ink)]">✕</button>
            </div>

            <form onSubmit={handleAddMapping} className="space-y-2.5">
              <div className="space-y-1">
                <label className="font-medium text-[var(--ink)] block">Product Option &amp; Value</label>
                <select
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 px-2 text-[11px] text-[var(--ink)] outline-none"
                >
                  <option value="Frame = Walnut">Frame = Walnut</option>
                  <option value="Frame = Oak">Frame = Oak</option>
                  <option value="Color = Black">Color = Black</option>
                  <option value="Color = White">Color = White</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--ink)] block">Target Mesh in Scene</label>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 px-2 text-[11px] text-[var(--ink)] outline-none"
                >
                  <option value="Chair_Frame">Chair_Frame (Mesh)</option>
                  <option value="Seat_Cushion">Seat_Cushion (Mesh)</option>
                  <option value="Front_Leg">Front_Leg (Mesh)</option>
                  <option value="Back_Leg">Back_Leg (Mesh)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--ink)] block">Operation</label>
                <select
                  value={newOperation}
                  onChange={(e) => setNewOperation(e.target.value as any)}
                  className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 px-2 text-[11px] text-[var(--ink)] outline-none"
                >
                  <option value="SET_MATERIAL">Set Material</option>
                  <option value="SHOW_HIDE">Show / Hide Object</option>
                  <option value="SWAP_MESH">Swap Geometry</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-[var(--ink)] block">Target Material / Value</label>
                <input
                  type="text"
                  required
                  value={newTargetValue}
                  onChange={(e) => setNewTargetValue(e.target.value)}
                  placeholder="Material_Walnut_Wood"
                  className="h-8 w-full rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 px-2 text-[11px] font-mono text-[var(--ink)] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="rounded border border-[var(--line)] px-2.5 py-1 text-[11px] hover:bg-[var(--canvas)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-[var(--ink)] hover:bg-black px-3 py-1 text-[11px] font-semibold text-white"
                >
                  Save Binding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
