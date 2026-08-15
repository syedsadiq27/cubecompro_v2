'use client';

import { DetailRow, InspectorSection } from '@repo/ui';

export function EnvironmentInspector() {
  return (
    <div className="space-y-4">
      <div>
        <InspectorSection title="Global Environment" />
        <div className="space-y-1.5">
          <DetailRow label="HDRI Map" value="studio_soft.hdr" />
          <DetailRow label="Exposure" value="1.0" />
          <DetailRow label="Tone Mapping" value="ACES Filmic" />
          <DetailRow label="Ground Shadow" value={<span className="text-emerald-700">Contact Catcher</span>} />
        </div>
      </div>
    </div>
  );
}
