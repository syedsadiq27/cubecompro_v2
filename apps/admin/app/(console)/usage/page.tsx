import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { UsageBar } from '@/components/usage-bar';
import { loadResolved, loadTenants } from '@/lib/api';
import { limitDisplay } from '@/lib/format';

const KEYS = [
  { key: 'limits.products', label: 'Products' },
  { key: 'limits.models', label: 'Models' },
  { key: 'limits.storage.gb', label: 'Storage' },
  { key: 'limits.users', label: 'Users' },
  { key: 'limits.ai.generations.monthly', label: 'AI / mo' },
] as const;

export default async function UsagePage() {
  const tenants = await loadTenants();
  const resolved = await Promise.all(
    tenants.map((tenant) => loadResolved(tenant.id))
  );

  return (
    <>
      <PageHeader
        title="Usage"
        description="Live consumption against resolved limits. Open a tenant to override."
      />
      <div className="space-y-3">
        {resolved.map((row) => (
          <Link
            key={row.organizationId}
            href={`/organizations/${row.organizationId}/usage`}
            className="block rounded-2xl border border-[var(--line)] px-4 py-3 hover:bg-[var(--surface)]"
          >
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <p className="text-[13px] font-medium">{row.organizationName}</p>
              <p className="type-meta">{row.planName ?? 'No plan'}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {KEYS.map((item) => {
                const limit = row.limits.find((rowItem) => rowItem.key === item.key);
                return (
                  <div key={item.key}>
                    <div className="mb-1 flex justify-between text-[12px]">
                      <span className="type-meta">{item.label}</span>
                      <span className="tabular-nums">
                        {limit ? limitDisplay(limit) : '—'}
                      </span>
                    </div>
                    <UsageBar
                      used={limit?.used ?? 0}
                      limit={limit?.limit ?? 0}
                    />
                  </div>
                );
              })}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
