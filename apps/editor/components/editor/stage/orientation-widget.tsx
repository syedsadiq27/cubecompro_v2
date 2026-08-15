'use client';

export function OrientationWidget() {
  return (
    <div className="pointer-events-none absolute right-4 top-4 z-[4] select-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-pure)]/85 border border-[var(--line)] shadow-xs">
        <div className="relative h-8 w-8">
          <span className="absolute top-0 right-1/2 translate-x-1/2 h-4 w-1 bg-emerald-500 rounded" title="Y-axis" />
          <span className="absolute bottom-1 right-0 h-1 w-4 bg-blue-500 rounded" title="Z-axis" />
          <span className="absolute bottom-1 left-0 h-1 w-4 bg-red-500 rounded" title="X-axis" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white border border-stone-400" />
        </div>
      </div>
    </div>
  );
}
