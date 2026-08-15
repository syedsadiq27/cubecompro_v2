'use client';

export function MaterialsPanel() {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-2 select-none">
      <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase">
        Material Palette (5)
      </p>
      {[
        { name: 'Walnut Wood', type: 'Wood PBR', color: '#6B4423', meshes: 4 },
        { name: 'Leather Black', type: 'Upholstery PBR', color: '#1A1A1A', meshes: 2 },
        { name: 'Leather White', type: 'Upholstery PBR', color: '#F0EFEA', meshes: 0 },
        { name: 'Fabric Gray', type: 'Fabric PBR', color: '#8E8E93', meshes: 0 },
        { name: 'Metal Brass', type: 'Metal PBR', color: '#D4AF37', meshes: 0 },
      ].map((mat) => (
        <div
          key={mat.name}
          className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2 hover:bg-[var(--canvas)] cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-black/20 shrink-0 shadow-2xs"
              style={{ backgroundColor: mat.color }}
            />
            <div>
              <p className="font-semibold text-[var(--ink)] leading-tight text-[12px]">{mat.name}</p>
              <p className="text-[10px] text-[var(--text-muted)]">{mat.type}</p>
            </div>
          </div>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {mat.meshes > 0 ? `${mat.meshes} meshes` : 'Unbound'}
          </span>
        </div>
      ))}
    </div>
  );
}
