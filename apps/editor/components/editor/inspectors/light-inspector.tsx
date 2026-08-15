'use client';

import { DetailRow, InspectorSection } from '@repo/ui';

export function LightInspector() {
  return (
    <div className="space-y-4">
      <div>
        <InspectorSection title="Light Parameters" />
        <div className="space-y-1.5">
          <DetailRow label="Light" value="Key Light" />
          <DetailRow label="Type" value="Directional" />
          <DetailRow label="Intensity" value="1.8x" />
          <DetailRow label="Temperature" value="5500K" />
          <DetailRow label="Shadow Map" value="2048 x 2048" />
        </div>
      </div>
    </div>
  );
}
