'use client';

import { Button, DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function PreviewInspector() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="space-y-4 select-none">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-bold text-[var(--ink)]">Resolved State</h3>
          <StatusBadge role="published" label="VALID" />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">Real-time configuration validator</p>
      </div>

      <div>
        <InspectorSection title="Configuration Resolution" />
        <div className="space-y-1.5 text-[11px]">
          <DetailRow label="Resolved SKU" value={<span className="font-mono">SKU-BLK-L-WAL</span>} />
          <DetailRow label="Unit Price" value={<span className="font-mono font-semibold">$349.00</span>} />
          <DetailRow label="Inventory" value={<span className="font-mono">12 in stock</span>} />
          <DetailRow label="Bindings" value={<span className="font-mono text-emerald-700">3 / 3 Active</span>} />
        </div>
      </div>

      <div>
        <InspectorSection title="Applied Visual Effects" />
        <div className="space-y-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
          <div className="p-2 rounded bg-[var(--canvas)]/50 border border-[var(--line)] space-y-0.5">
            <span className="text-[var(--ink)] font-bold block font-sans">1. Frame &rarr; Walnut Wood</span>
            <span className="text-[10px] text-[var(--text-muted)]">Mesh: Chair_Frame &middot; Mat: Walnut_Wood</span>
          </div>
          <div className="p-2 rounded bg-[var(--canvas)]/50 border border-[var(--line)] space-y-0.5">
            <span className="text-[var(--ink)] font-bold block font-sans">2. Color &rarr; Black Leather</span>
            <span className="text-[10px] text-[var(--text-muted)]">Mesh: Seat_Cushion &middot; Mat: Leather_Black</span>
          </div>
        </div>
      </div>

      <div>
        <InspectorSection title="WebGL Telemetry" />
        <div className="space-y-1.5 text-[11px]">
          <DetailRow label="Framerate" value={<span className="font-mono text-emerald-700 font-semibold">60.0 FPS</span>} />
          <DetailRow label="Draw Calls" value={<span className="font-mono">14 calls</span>} />
          <DetailRow label="Triangles" value={<span className="font-mono">9,640</span>} />
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        className="w-full ui:bg-[var(--ink)] ui:text-white ui:h-8 ui:text-[12px] ui:font-semibold"
        onClick={() => setStatusMessage('Configuration validated and synchronized')}
      >
        Validate Full Configuration
      </Button>
    </div>
  );
}
