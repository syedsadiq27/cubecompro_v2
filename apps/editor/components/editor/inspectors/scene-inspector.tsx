'use client';

import { useState } from 'react';
import { Button, DetailRow, InspectorSection } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function SceneInspector() {
  const editorDocument = useEditorStore((state) => state.document);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [environment, setEnvironment] = useState('Studio Soft');
  const [camera, setCamera] = useState('Perspective');
  const [units, setUnits] = useState('Inches');

  return (
    <div className="space-y-4">
      <div>
        <InspectorSection title="Scene Parameters" />
        <div className="space-y-2">
          <DetailRow
            label="Product"
            value={editorDocument?.productName || 'Studio Chair'}
          />
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--text-muted)]">Environment</span>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 py-0.5 text-[11px] text-[var(--ink)] outline-none"
            >
              <option value="Studio Soft">Studio Soft</option>
              <option value="Warm Studio">Warm Studio</option>
              <option value="Outdoor Day">Outdoor Day</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--text-muted)]">Camera</span>
            <select
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 py-0.5 text-[11px] text-[var(--ink)] outline-none"
            >
              <option value="Perspective">Perspective</option>
              <option value="Orthographic">Orthographic</option>
            </select>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-[var(--text-muted)]">Units</span>
            <select
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              className="rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2 py-0.5 text-[11px] text-[var(--ink)] outline-none"
            >
              <option value="Inches">Inches</option>
              <option value="Centimeters">Centimeters</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <InspectorSection title="Scene Summary" />
        <div className="space-y-1">
          <DetailRow label="Objects" value="8 meshes" />
          <DetailRow label="Materials" value="4 PBR" />
          <DetailRow label="Vertices" value="24,310" />
          <DetailRow label="Triangles" value="48,620" />
          <DetailRow label="Textures" value="12 maps" />
          <DetailRow label="File size" value="24.6 MB" />
        </div>
      </div>

      <div>
        <InspectorSection title="Configuration Status" />
        <div className="space-y-1">
          <DetailRow label="Option attributes" value="3 / 4 mapped" />
          <DetailRow label="Visual behaviors" value="6 active" />
          <DetailRow label="Draco compression" value="Enabled (Level 7)" />
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="w-full ui:h-8 ui:text-[12px] ui:font-medium"
        onClick={() => setStatusMessage('Validating scene geometry & Draco compression…')}
      >
        Validate scene
      </Button>
    </div>
  );
}
