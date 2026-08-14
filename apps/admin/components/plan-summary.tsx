import { isOn, limitValueLabel } from '@/lib/format';
import type { Catalog, Plan, PlanEntitlement } from '@/lib/types';

export function PlanSummary({
  catalog,
  rows,
  parentName,
}: {
  catalog: Catalog;
  rows: PlanEntitlement[];
  parentName?: string | null;
}) {
  const byKey = new Map(rows.map((row) => [row.key, row]));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        {parentName ? (
          <p className="type-meta mb-3">Includes {parentName}</p>
        ) : null}
        <p className="type-nav-label mb-2">Capabilities</p>
        <ul className="space-y-1">
          {catalog.capabilities.map((item) => {
            const enabled = isOn(byKey.get(item.key)?.value);
            return (
              <li
                key={item.key}
                className="flex items-center justify-between text-[13px]"
              >
                <span className={enabled ? 'text-[var(--ink)]' : 'type-meta'}>
                  {enabled ? '✓' : '–'} {item.label}
                </span>
                <span className="type-meta font-mono">{item.key}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <p className="type-nav-label mb-2">Limits</p>
        <ul className="space-y-1">
          {catalog.limits.map((item) => {
            const value = byKey.get(item.key)?.value ?? '0';
            return (
              <li
                key={item.key}
                className="flex items-center justify-between text-[13px]"
              >
                <span>{item.label}</span>
                <span className="tabular-nums">
                  {limitValueLabel(item.key, value)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
