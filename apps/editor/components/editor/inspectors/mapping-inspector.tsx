'use client';

import { Button, DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function MappingInspector() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">Option Binding</h3>
          <StatusBadge role="published" label="ACTIVE" />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Connect product choices to 3D scene mutations.
        </p>
      </div>

      <div>
        <InspectorSection title="Binding Details" />
        <div className="space-y-1.5">
          <DetailRow label="Product Option" value="Frame" />
          <DetailRow label="Option Value" value="Walnut" />
          <DetailRow label="Action Type" value={<span className="text-[var(--brand)]">Set material</span>} />
          <DetailRow label="Target Mesh" value="Chair_Frame" />
          <DetailRow label="Material Applied" value="Walnut Wood" />
        </div>
      </div>

      <div>
        <InspectorSection title="Export Targets" />
        <div className="space-y-1.5 text-[11px] text-[var(--text-secondary)]">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
            <span>Web 3D Customizer (WebGL)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
            <span>AR Quick Look (USDZ)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
            <span>Dynamic Thumbnail Generation</span>
          </label>
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="w-full ui:h-8 ui:text-[12px]"
        onClick={() => setStatusMessage('Validating option binding…')}
      >
        Validate mapping
      </Button>
    </div>
  );
}
