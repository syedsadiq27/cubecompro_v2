'use client';

export function BehaviorsPanel() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2 select-none text-[12px]">
      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
        Visual Rules &amp; Behaviors
      </p>
      <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-2.5 space-y-1 text-[11px]">
        <span className="font-semibold text-[var(--ink)] block">WHEN Frame = Walnut</span>
        <span className="text-emerald-700 font-mono text-[10px]">&rarr; SET MATERIAL Chair_Frame &rarr; Walnut Wood</span>
      </div>
      <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-2.5 space-y-1 text-[11px]">
        <span className="font-semibold text-[var(--ink)] block">WHEN Size = XL</span>
        <span className="text-blue-700 font-mono text-[10px]">&rarr; SCALE Seat_Frame X: 1.25</span>
      </div>
    </div>
  );
}
