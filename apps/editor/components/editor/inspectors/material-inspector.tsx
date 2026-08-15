'use client';

import { Button, DetailRow, InspectorSection, StatusBadge } from '@repo/ui';

export function MaterialInspector() {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">Walnut Wood</h3>
          <StatusBadge role="published" label="PBR" />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Bound to 4 meshes in scene
        </p>
      </div>

      <div>
        <InspectorSection title="PBR Properties" />
        <div className="space-y-1.5">
          <DetailRow
            label="Base Color"
            value={
              <div className="flex items-center gap-1.5">
                <span className="h-3.5 w-3.5 rounded-full bg-[#6B4423] border border-black/20" />
                <span className="font-mono text-[11px]">#6B4423</span>
              </div>
            }
          />
          <DetailRow label="Roughness" value={<span className="font-mono text-[11px]">0.65</span>} />
          <DetailRow label="Metalness" value={<span className="font-mono text-[11px]">0.05</span>} />
          <DetailRow label="Normal Map" value={<span className="font-mono text-[11px] text-emerald-700">walnut_n.png</span>} />
        </div>
      </div>

      <div>
        <InspectorSection title="Used by Meshes" />
        <ul className="space-y-1 text-[11px] text-[var(--text-secondary)]">
          <li>&bull; Chair_Frame / Front_Leg</li>
          <li>&bull; Chair_Frame / Back_Leg</li>
          <li>&bull; Chair_Frame / Side_Rail</li>
          <li>&bull; Chair_Frame / Seat_Frame</li>
        </ul>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" size="sm" variant="secondary" className="flex-1 ui:text-[11px]">
          Replace material
        </Button>
        <Button type="button" size="sm" variant="secondary" className="flex-1 ui:text-[11px]">
          Save to library
        </Button>
      </div>
    </div>
  );
}
