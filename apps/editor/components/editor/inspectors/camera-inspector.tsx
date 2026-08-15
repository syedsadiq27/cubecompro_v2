'use client';

import { Button, DetailRow, InspectorSection } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function CameraInspector() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="space-y-4">
      <div>
        <InspectorSection title="Camera View" />
        <div className="space-y-1.5">
          <DetailRow label="Preset" value="Default Storefront" />
          <DetailRow label="Field of View" value="45°" />
          <DetailRow label="Position" value="X: 1.2, Y: 0.8, Z: 2.4" />
          <DetailRow label="Orbit Limits" value="10° &rarr; 85°" />
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="w-full ui:h-8 ui:text-[12px]"
        onClick={() => setStatusMessage('Set camera from current view')}
      >
        Set from current view
      </Button>
    </div>
  );
}
