'use client';

import { InspectorSection } from '@repo/ui';

export function BehaviorInspector() {
  return (
    <div className="space-y-4">
      <div>
        <InspectorSection title="Visual Behavior Rule" />
        <div className="space-y-2 rounded-lg bg-[var(--canvas)] p-3 border border-[var(--line)] text-[11px]">
          <span className="font-bold text-[var(--ink)] block">WHEN Frame = Walnut</span>
          <p className="text-emerald-700 font-mono">&rarr; SET MATERIAL Chair_Frame &rarr; Walnut Wood</p>
          <p className="text-blue-700 font-mono">&rarr; SHOW Walnut_Legs</p>
          <p className="text-red-700 font-mono">&rarr; HIDE Oak_Legs</p>
        </div>
      </div>
    </div>
  );
}
