import { Panel } from '@/components/panel';
import { UsageBar } from '@/components/usage-bar';
import { loadResolved } from '@/lib/api';
import { limitDisplay, sourceLabel } from '@/lib/format';

export default async function OrganizationUsagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = await loadResolved(id);

  return (
    <Panel title="Current consumption">
      <ul className="space-y-4">
        {resolved.limits.map((row) => (
          <li key={row.key}>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-[13px]">
              <span>
                <span className="font-medium">{row.label}</span>
                <span className="type-meta ml-2 font-mono">{row.key}</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="tabular-nums">{limitDisplay(row)}</span>
                <span className="type-meta">
                  {sourceLabel(row.source, resolved.planName)}
                </span>
              </span>
            </div>
            <UsageBar used={row.used ?? 0} limit={row.limit ?? 0} />
          </li>
        ))}
      </ul>
    </Panel>
  );
}
