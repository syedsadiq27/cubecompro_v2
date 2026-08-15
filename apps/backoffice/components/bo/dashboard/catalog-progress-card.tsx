'use client';

export type ProgressItem = {
  id: string;
  name: string;
  current: number;
  total: number;
  unit?: string;
  percentage: number;
};

export function CatalogProgressCard({
  title = 'Catalog progress',
  items,
}: {
  title?: string;
  items: ProgressItem[];
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
      <h3 className="text-[14px] font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <div className="mt-4 space-y-4">
        {items.map((item) => {
          const formattedCurrent =
            item.current >= 1000 ? item.current.toLocaleString() : String(item.current);
          const formattedTotal =
            item.total >= 1000 ? item.total.toLocaleString() : String(item.total);

          return (
            <div key={item.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[var(--ink)]">{item.name}</span>
                <span className="tabular-nums text-[var(--text-muted)] font-normal">
                  {formattedCurrent} / {formattedTotal}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--canvas)]">
                  <div
                    className="h-full rounded-full bg-[#665CFF] transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                  />
                </div>
                <span className="w-9 text-right text-[12px] font-medium text-[var(--ink)] tabular-nums">
                  {item.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
