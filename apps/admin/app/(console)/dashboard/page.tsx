import Link from 'next/link';
import { PageHeader } from '@/components/suite-ui';

export default function DashboardPage() {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-y-auto bg-[var(--canvas)] select-none">
      {/* Bold Backoffice Page Header */}
      <PageHeader
        title="Platform Overview"
        description="Real-time telemetry, tenant health, resource quotas, and incidents across CubeCom."
        action={
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              <span>Cluster Healthy</span>
            </div>
            <Link
              href="/organizations"
              className="rounded-lg bg-[var(--ink)] hover:bg-black px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors"
            >
              Manage Organizations →
            </Link>
          </div>
        }
      />

      <div className="p-6 sm:p-8 space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Total Tenants
            </span>
            <p className="font-mono text-[22px] font-bold text-[var(--ink)]">24</p>
            <span className="text-[11px] text-[var(--text-muted)] block">3 cloud regions</span>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Active Subscriptions
            </span>
            <p className="font-mono text-[22px] font-bold text-[var(--ink)]">19</p>
            <span className="text-[11px] text-[var(--text-muted)] block">79% of total</span>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Active Trials
            </span>
            <p className="font-mono text-[22px] font-bold text-[var(--ink)]">3</p>
            <span className="text-[11px] text-[var(--text-muted)] block">Expiring soon</span>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Suspended
            </span>
            <p className="font-mono text-[22px] font-bold text-[var(--ink)]">2</p>
            <span className="text-[11px] text-[var(--text-muted)] block">Needs attention</span>
          </div>

          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 space-y-1">
            <span className="text-[10px] font-mono font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Platform MRR
            </span>
            <p className="font-mono text-[22px] font-bold text-[var(--ink)]">$18,420</p>
            <span className="text-[11px] font-mono text-[var(--text-muted)] block">+12% vs last month</span>
          </div>
        </div>

        {/* Main 2-Column Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-5">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                  Needs Attention
                </h3>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">3 items</span>
              </div>

              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 p-2.5">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">3 Trials Expire This Week</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Nike Demo (in 8 days), Globex Ventures (in 23 days)</p>
                  </div>
                  <Link href="/organizations" className="rounded border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                    Review
                  </Link>
                </div>

                <div className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 p-2.5">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">2 Organizations Above 90% API Quota</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Soylent Corp (91%), Acme Corp (72%)</p>
                  </div>
                  <Link href="/usage" className="rounded border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                    Inspect
                  </Link>
                </div>

                <div className="flex items-center justify-between rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 p-2.5">
                  <div>
                    <p className="font-semibold text-[var(--ink)]">1 Connector Incident (Shopify Sync Timeout)</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Vandelay Industries &middot; 3 webhooks failed</p>
                  </div>
                  <Link href="/integrations" className="rounded border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]">
                    Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                  Monthly Platform Telemetry
                </h3>
                <Link href="/usage" className="text-[11px] text-[var(--text-muted)] hover:text-[var(--ink)]">
                  Full analytics →
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5 p-2.5 rounded-md bg-[var(--canvas)]/40 border border-[var(--line)]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-secondary)] font-medium">API Calls</span>
                    <span className="font-mono font-semibold text-[var(--ink)]">14.2M / 20M</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--ink)]" style={{ width: '71%' }} />
                  </div>
                </div>

                <div className="space-y-1.5 p-2.5 rounded-md bg-[var(--canvas)]/40 border border-[var(--line)]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-secondary)] font-medium">Storage Volume</span>
                    <span className="font-mono font-semibold text-[var(--ink)]">1.8 TB / 3.0 TB</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--ink)]" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
                <h3 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider font-mono">
                  Recent Operations
                </h3>
                <Link href="/audit" className="text-[11px] text-[var(--text-muted)] hover:text-[var(--ink)]">
                  View all
                </Link>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex items-start gap-2.5 p-2 rounded hover:bg-[var(--canvas)] transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)] mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[var(--ink)]">Plan Upgraded &middot; Northwind</p>
                    <p className="text-[11px] text-[var(--text-muted)]">Enterprise tier activated</p>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">12 mins ago</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 rounded hover:bg-[var(--canvas)] transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)] mt-1.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-[var(--ink)]">Trial Extended &middot; Nike Demo</p>
                    <p className="text-[11px] text-[var(--text-muted)]">+14 days trial extension</p>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
