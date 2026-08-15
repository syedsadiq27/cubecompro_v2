'use client';

export function CamerasPanel() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2 select-none text-[12px]">
      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
        Saved Camera Views (8)
      </p>
      {['Default Storefront', 'Front View', 'Side Profile', 'Top Down', 'Detail Stitching', 'Lifestyle Room', 'AR Start', 'Catalog Thumbnail'].map((cam) => (
        <div
          key={cam}
          className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2 hover:bg-[var(--canvas)] cursor-pointer"
        >
          <span className="font-medium text-[var(--ink)]">{cam}</span>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">45°</span>
        </div>
      ))}
    </div>
  );
}
