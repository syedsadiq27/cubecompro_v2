'use client';

import { useState } from 'react';
import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function PreviewPanel() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [activeColor, setActiveColor] = useState<'Black' | 'White'>('Black');
  const [activeSize, setActiveSize] = useState<'L' | 'XL'>('L');
  const [activeFrame, setActiveFrame] = useState<'Walnut' | 'Oak'>('Walnut');

  const handleColorChange = (color: 'Black' | 'White') => {
    setActiveColor(color);
    setStatusMessage(`Applied Color: ${color} → Cushion material updated`);
  };

  const handleSizeChange = (size: 'L' | 'XL') => {
    setActiveSize(size);
    setStatusMessage(`Applied Size: ${size} → Mesh scale updated`);
  };

  const handleFrameChange = (frame: 'Walnut' | 'Oak') => {
    setActiveFrame(frame);
    setStatusMessage(`Applied Frame: ${frame} → Frame wood texture updated`);
  };

  return (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-4 text-[12px]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Live Storefront Configurator
          </p>
          <StatusBadge role="published" label="SYNCED" />
        </div>

        {/* Option 1: Colorway Swatch */}
        <div className="space-y-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--ink)]">Color</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{activeColor}</span>
          </div>
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleColorChange('Black')}
              className={`h-7 w-7 rounded-full bg-[#18181B] border transition-all cursor-pointer ${
                activeColor === 'Black' ? 'ring-2 ring-[var(--brand)] ring-offset-2 scale-105' : 'border-stone-300'
              }`}
              title="Black Leather"
            />
            <button
              type="button"
              onClick={() => handleColorChange('White')}
              className={`h-7 w-7 rounded-full bg-[#F4F4F5] border transition-all cursor-pointer ${
                activeColor === 'White' ? 'ring-2 ring-[var(--brand)] ring-offset-2 scale-105 border-stone-400' : 'border-stone-300'
              }`}
              title="White Leather"
            />
          </div>
        </div>

        {/* Option 2: Sizing Pill */}
        <div className="space-y-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--ink)]">Dimension Size</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{activeSize}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {(['L', 'XL'] as const).map((size) => {
              const active = activeSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeChange(size)}
                  className={`rounded-lg py-1.5 text-center font-medium text-[11px] transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--ink)] text-white shadow-xs font-semibold'
                      : 'border border-[var(--line)] bg-[var(--canvas)]/40 text-[var(--text-secondary)] hover:bg-[var(--canvas)]'
                  }`}
                >
                  {size} Standard
                </button>
              );
            })}
          </div>
        </div>

        {/* Option 3: Wood Frame */}
        <div className="space-y-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[var(--ink)]">Wood Frame</span>
            <span className="font-mono text-[10px] text-[var(--text-muted)]">{activeFrame}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {[
              { id: 'Walnut', label: 'Walnut Wood', hex: '#5C3A21' },
              { id: 'Oak', label: 'Oak Wood', hex: '#C29B62' },
            ].map((f) => {
              const active = activeFrame === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => handleFrameChange(f.id as any)}
                  className={`flex items-center gap-2 rounded-lg p-2 text-left text-[11px] transition-all cursor-pointer ${
                    active
                      ? 'border border-[var(--ink)] bg-[var(--canvas)]/60 font-semibold'
                      : 'border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--text-secondary)] hover:bg-[var(--canvas)]/30'
                  }`}
                >
                  <span className="h-4 w-4 rounded-full shrink-0 border border-black/10" style={{ backgroundColor: f.hex }} />
                  <span className="truncate">{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary of Active State */}
        <div className="rounded-lg bg-[var(--canvas)]/60 border border-[var(--line)] p-2.5 space-y-1 font-mono text-[10px] text-[var(--text-muted)]">
          <div className="flex justify-between"><span className="font-sans">Resolved State</span><span className="text-[var(--ink)]">{activeColor} / {activeSize} / {activeFrame}</span></div>
          <div className="flex justify-between"><span className="font-sans">Active Effects</span><span className="text-[var(--ink)]">3 bindings applied</span></div>
        </div>
      </div>
    </div>
  );
}
