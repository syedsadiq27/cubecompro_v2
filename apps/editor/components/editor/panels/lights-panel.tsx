'use client';

export function LightsPanel() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2 select-none text-[12px]">
      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
        Studio Lighting Rig (4)
      </p>
      {[
        { name: 'Key Light', type: 'Directional', intensity: '1.8' },
        { name: 'Fill Light', type: 'Directional', intensity: '0.6' },
        { name: 'Rim Light', type: 'Spotlight', intensity: '1.2' },
        { name: 'Ambient Light', type: 'Hemisphere', intensity: '0.4' },
      ].map((lt) => (
        <div
          key={lt.name}
          className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2 hover:bg-[var(--canvas)] cursor-pointer"
        >
          <div>
            <p className="font-medium text-[var(--ink)]">{lt.name}</p>
            <p className="text-[10px] text-[var(--text-muted)]">{lt.type}</p>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">{lt.intensity}x</span>
        </div>
      ))}
    </div>
  );
}
