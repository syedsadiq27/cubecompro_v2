'use client';

export function EnvironmentPanel() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2 select-none text-[12px]">
      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
        Environment Presets
      </p>
      {[
        { name: 'Studio Soft (Default)', hdri: 'studio_soft.hdr', active: true },
        { name: 'Warm Interior', hdri: 'warm_living.hdr', active: false },
        { name: 'Sunny Outdoor', hdri: 'outdoor_day.hdr', active: false },
        { name: 'Clean White Neutral', hdri: 'pure_white.hdr', active: false },
      ].map((env) => (
        <div
          key={env.name}
          className={`rounded-lg border p-2 cursor-pointer ${
            env.active
              ? 'border-[var(--brand)] bg-[var(--brand-soft)]/40'
              : 'border-[var(--line)] bg-[var(--surface-pure)] hover:bg-[var(--canvas)]'
          }`}
        >
          <p className="font-medium text-[var(--ink)]">{env.name}</p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]">{env.hdri}</p>
        </div>
      ))}
    </div>
  );
}
