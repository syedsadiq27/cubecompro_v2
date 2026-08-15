'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Button,
  ConfirmDialog,
  DataTable,
  DetailRow,
  FilterTab,
  FilterTabs,
  InspectorBody,
  InspectorHeader,
  InspectorSection,
  InspectorWorkspace,
  ListWorkspace,
  MetricCard,
  MetricsStrip,
  PageHeader,
  PageWorkspace,
  PageWorkspaceBody,
  SearchField,
  StatusBadge,
  Switch,
  useToast,
} from '@repo/ui';
import { ChangePlanModal, CreateTenantModal } from '@/components/ops/action-dialogs';
import { setStatusAction, upsertOverrideAction } from '@/actions/tenants';
import type { Tenant } from '@/lib/types';

type Organization = {
  id: string;
  name: string;
  slug: string;
  initials: string;
  plan: string;
  members: number;
  usagePercent: number;
  usageLabel: string;
  status: string;
  renewalDate: string;
  renewalNote: string;
  isPastDue?: boolean;
};

const DEFAULT_SAMPLE_ORGS: Organization[] = [
  {
    id: 'org-1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    initials: 'AC',
    plan: 'Pro',
    members: 12,
    usagePercent: 72,
    usageLabel: '1.44M / 2M API',
    status: 'Active',
    renewalDate: 'Sep 12, 2025',
    renewalNote: 'In 89 days',
  },
  {
    id: 'org-2',
    name: 'Nike Demo',
    slug: 'nike-demo',
    initials: 'ND',
    plan: 'Starter',
    members: 3,
    usagePercent: 18,
    usageLabel: '180K / 1M API',
    status: 'Trial',
    renewalDate: 'Expires in 8 days',
    renewalNote: 'May 22, 2025',
  },
  {
    id: 'org-3',
    name: 'Northwind',
    slug: 'northwind',
    initials: 'NW',
    plan: 'Enterprise',
    members: 84,
    usagePercent: 61,
    usageLabel: '1.22M / 2M API',
    status: 'Active',
    renewalDate: 'Annual',
    renewalNote: 'Dec 1, 2025',
  },
];

export function OrganizationsView({
  initialTenants = [],
}: {
  initialTenants?: Tenant[];
}) {
  const { showToast } = useToast();

  const orgsList: Organization[] =
    initialTenants.length > 0
      ? initialTenants.map((t) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          initials: t.name.slice(0, 2).toUpperCase(),
          plan: t.planName ?? 'Starter',
          members: t.memberCount ?? 1,
          usagePercent: 35,
          usageLabel: '350K / 1M API',
          status: t.status === 'ACTIVE' ? 'Active' : t.status === 'TRIAL' ? 'Trial' : 'Suspended',
          renewalDate: t.trialEndsAt ? new Date(t.trialEndsAt).toLocaleDateString() : 'Active',
          renewalNote: t.status === 'TRIAL' ? 'Expiring soon' : 'Monthly',
        }))
      : DEFAULT_SAMPLE_ORGS;

  const [selectedId, setSelectedId] = useState<string>(orgsList[0]?.id ?? 'org-2');
  const [activeTab, setActiveTab] = useState('all');
  const [inspectorTab, setInspectorTab] = useState<'overview' | 'limits' | 'entitlements' | 'activity'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [supportModeOrg, setSupportModeOrg] = useState<string | null>(null);

  // Operational Modals State
  const [createOpen, setCreateOpen] = useState(false);
  const [changePlanOpen, setChangePlanOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const selectedOrg: Organization =
    orgsList.find((o) => o.id === selectedId) || orgsList[0] || DEFAULT_SAMPLE_ORGS[0]!;

  const filteredOrgs = orgsList.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSuspendTenant = async () => {
    if (!selectedOrg) return;
    try {
      await setStatusAction(selectedOrg.id, 'suspended');
      showToast(`Suspended tenant ${selectedOrg.name}`);
      setSuspendOpen(false);
    } catch {
      showToast(`Failed to suspend tenant`, 'error');
    }
  };

  const handleExtendTrial = async () => {
    if (!selectedOrg) return;
    try {
      await setStatusAction(selectedOrg.id, 'trial');
      showToast(`Extended trial for ${selectedOrg.name} by +14 days`);
    } catch {
      showToast(`Failed to extend trial`, 'error');
    }
  };

  const handleToggleCapability = async (capabilityKey: string, currentValue: boolean) => {
    try {
      await upsertOverrideAction({
        organizationId: selectedOrg.id,
        key: capabilityKey,
        kind: 'BOOLEAN',
        value: (!currentValue).toString(),
      });
      showToast(`Updated override for ${capabilityKey}: ${!currentValue ? 'Enabled' : 'Disabled'}`);
    } catch {
      showToast(`Failed to update capability override`, 'error');
    }
  };

  const handleLaunchSupportSession = () => {
    setSupportModeOrg(selectedOrg.name);
    showToast(`Elevated support session active for ${selectedOrg.name}`, 'info');
  };

  return (
    <>
      <PageWorkspace
        inspector={
          selectedOrg ? (
            <InspectorWorkspace className="hidden lg:flex">
              <InspectorHeader
                title={selectedOrg.name}
                subtitle={`ID: ${selectedOrg.id} · ${selectedOrg.slug}`}
                badge={
                  <StatusBadge
                    role={
                      selectedOrg.status === 'Active'
                        ? 'active'
                        : selectedOrg.status === 'Trial'
                          ? 'trial'
                          : 'suspended'
                    }
                    label={selectedOrg.status}
                  />
                }
                actions={
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleLaunchSupportSession}
                      className="flex-1 ui:text-[#665CFF] ui:border-[#665CFF]/30 ui:hover:bg-violet-50/50 ui:text-[11px] ui:font-bold"
                    >
                      Access Tenant ↗
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setChangePlanOpen(true)}
                      className="flex-1 ui:text-[11px]"
                    >
                      Edit plan
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setSuspendOpen(true)}
                      className="ui:text-red-700 ui:hover:bg-red-50 ui:text-[11px]"
                    >
                      Suspend
                    </Button>
                  </div>
                }
              />

              <div className="flex items-center justify-between border-b border-[var(--line)] px-4 text-[11px]">
                {(['overview', 'limits', 'entitlements', 'activity'] as const).map(
                  (tab) => {
                    const active = inspectorTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setInspectorTab(tab)}
                        className={`relative cursor-pointer py-2 font-medium capitalize transition-colors ${
                          active
                            ? 'font-semibold text-[var(--ink)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--ink)]'
                        }`}
                      >
                        <span>{tab}</span>
                        {active ? (
                          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--ink)]" />
                        ) : null}
                      </button>
                    );
                  }
                )}
              </div>

              <InspectorBody className="text-[11px]">
                {inspectorTab === 'overview' && (
                  <div className="space-y-4">
                    <InspectorSection title="Tenant Details">
                      <div className="space-y-1.5">
                        <DetailRow label="Plan" value={selectedOrg.plan} />
                        <DetailRow
                          label="Team Members"
                          value={<span className="font-mono">{selectedOrg.members}</span>}
                        />
                        <DetailRow label="Status" value={selectedOrg.status} />
                        <DetailRow label="Renewal Date" value={selectedOrg.renewalDate} />
                      </div>
                    </InspectorSection>

                    {selectedOrg.status === 'Trial' && (
                      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--canvas)]/50 p-3">
                        <div>
                          <p className="text-[11px] font-semibold text-[var(--ink)]">
                            Trial Active
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)]">
                            {selectedOrg.renewalDate}
                          </p>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={handleExtendTrial}
                          className="ui:text-[11px] ui:font-medium"
                        >
                          +14 Days
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {inspectorTab === 'limits' && (
                  <InspectorSection title="Resource Quotas">
                    <div className="space-y-2.5">
                      <div className="space-y-1">
                        <DetailRow
                          label="API Requests"
                          value={<span className="font-mono">{selectedOrg.usageLabel}</span>}
                        />
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--canvas)]">
                          <div
                            className="h-full bg-[var(--ink)]"
                            style={{ width: `${selectedOrg.usagePercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <DetailRow
                          label="Storage (Assets)"
                          value={<span className="font-mono">48 GB / 100 GB</span>}
                        />
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--canvas)]">
                          <div className="h-full bg-[var(--ink)]" style={{ width: '48%' }} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <DetailRow
                          label="Team Seats"
                          value={
                            <span className="font-mono">{selectedOrg.members} / 25</span>
                          }
                        />
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--canvas)]">
                          <div className="h-full bg-[var(--ink)]" style={{ width: '48%' }} />
                        </div>
                      </div>
                    </div>
                  </InspectorSection>
                )}

                {inspectorTab === 'entitlements' && (
                  <InspectorSection title="Capability Gates">
                    <div className="space-y-2">
                      {[
                        {
                          key: '3d.configurator',
                          label: '3D Configurator Engine',
                          enabled: true,
                        },
                        {
                          key: 'rules.advanced',
                          label: 'Advanced Rule Graph',
                          enabled: true,
                        },
                        {
                          key: 'api.access',
                          label: 'Direct GraphQL Access',
                          enabled: true,
                        },
                        {
                          key: 'connectors.commerce',
                          label: 'Headless Commerce',
                          enabled: selectedOrg.plan !== 'Starter',
                        },
                      ].map((cap) => (
                        <div
                          key={cap.key}
                          className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--canvas)]/40 p-2"
                        >
                          <div>
                            <p className="text-[11px] font-medium text-[var(--ink)]">
                              {cap.label}
                            </p>
                            <p className="font-mono text-[9px] text-[var(--text-muted)]">
                              {cap.key}
                            </p>
                          </div>
                          <Switch
                            checked={cap.enabled}
                            aria-label={`Toggle ${cap.label}`}
                            onCheckedChange={() =>
                              handleToggleCapability(cap.key, cap.enabled)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </InspectorSection>
                )}

                {inspectorTab === 'activity' && (
                  <InspectorSection title="Recent Events">
                    <div className="space-y-2 text-[11px]">
                      <div className="space-y-0.5 rounded border border-[var(--line)] bg-[var(--canvas)]/30 p-2">
                        <p className="font-semibold text-[var(--ink)]">
                          Plan Assigned ({selectedOrg.plan})
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          By admin@cubecompro.com
                        </p>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          Today at 10:14 AM
                        </span>
                      </div>
                      <div className="space-y-0.5 rounded border border-[var(--line)] bg-[var(--canvas)]/30 p-2">
                        <p className="font-semibold text-[var(--ink)]">
                          Organization Provisioned
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          Slug: {selectedOrg.slug}
                        </p>
                        <span className="font-mono text-[9px] text-[var(--text-muted)]">
                          May 14, 2025
                        </span>
                      </div>
                    </div>
                  </InspectorSection>
                )}
              </InspectorBody>
            </InspectorWorkspace>
          ) : null
        }
      >
        {supportModeOrg ? (
          <div className="flex items-center justify-between bg-[#665CFF] px-6 py-2 text-[12px] font-medium text-white shadow-xs select-none">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span>
                ELEVATED SUPPORT ACCESS ACTIVE: Impersonating{' '}
                <strong>{supportModeOrg}</strong>
              </span>
            </div>
            <Button
              type="button"
              size="sm"
              variant="inverseSecondary"
              onClick={() => {
                setSupportModeOrg(null);
                showToast(`Exited support session`);
              }}
              className="ui:bg-white/20 ui:hover:bg-white/30 ui:border-0 ui:text-[11px] ui:font-bold ui:text-white"
            >
              Exit session ✕
            </Button>
          </div>
        ) : null}

        <PageHeader
          title="Organizations"
          count={orgsList.length}
          description="Manage tenant access, plans, resource usage quotas, and capability overrides."
          action={
            <Button
              type="button"
              size="sm"
              onClick={() => setCreateOpen(true)}
              className="ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black ui:text-[12px] ui:font-semibold"
            >
              + New organization
            </Button>
          }
        />

        <MetricsStrip>
          <MetricCard
            label="Total Organizations"
            value={orgsList.length}
            hint="Active cluster"
          />
          <MetricCard
            label="Active Subscriptions"
            value={orgsList.filter((o) => o.status === 'Active').length}
            hint="Live accounts"
          />
          <MetricCard
            label="Active Trials"
            value={orgsList.filter((o) => o.status === 'Trial').length}
            hint="Evaluation phase"
          />
          <MetricCard
            label="Suspended"
            value={orgsList.filter((o) => o.status === 'Suspended').length}
            hint="Needs attention"
          />
          <MetricCard
            label="Platform MRR"
            value="$18,420"
            hint="+12% vs last month"
          />
        </MetricsStrip>

        <ListWorkspace
          views={
            <FilterTabs>
              {[
                { id: 'all', label: 'All', count: orgsList.length },
                {
                  id: 'active',
                  label: 'Active',
                  count: orgsList.filter((o) => o.status === 'Active').length,
                },
                {
                  id: 'trial',
                  label: 'Trial',
                  count: orgsList.filter((o) => o.status === 'Trial').length,
                },
              ].map((tab) => (
                <FilterTab
                  key={tab.id}
                  label={tab.label}
                  count={tab.count}
                  active={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </FilterTabs>
          }
          toolbar={
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter by name or slug..."
            />
          }
        />

        <PageWorkspaceBody flush>
          <DataTable.Root variant="fill" minWidth={780}>
            <DataTable.Header sticky>
              <tr>
                <DataTable.Head>ORGANIZATION ⌄</DataTable.Head>
                <DataTable.Head>PLAN</DataTable.Head>
                <DataTable.Head>MEMBERS</DataTable.Head>
                <DataTable.Head>USAGE</DataTable.Head>
                <DataTable.Head>STATUS</DataTable.Head>
                <DataTable.Head>RENEWAL</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {filteredOrgs.map((org) => {
                const isSelected = selectedId === org.id;
                return (
                  <DataTable.Row
                    key={org.id}
                    selected={isSelected}
                    onClick={() => setSelectedId(org.id)}
                    className="cursor-pointer"
                  >
                    <DataTable.Cell>
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--canvas)] font-mono text-[10px] font-semibold text-[var(--ink)]">
                          {org.initials}
                        </div>
                        <div>
                          <p className="leading-tight font-semibold text-[var(--ink)]">
                            {org.name}
                          </p>
                          <p className="font-mono text-[10px] text-[var(--text-muted)]">
                            {org.slug}
                          </p>
                        </div>
                      </div>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <span className="inline-block rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2 py-0.5 font-mono text-[10px] text-[var(--ink)]">
                        {org.plan}
                      </span>
                    </DataTable.Cell>

                    <DataTable.Cell numeric>{org.members}</DataTable.Cell>

                    <DataTable.Cell className="min-w-[150px]">
                      <div className="space-y-1">
                        <div className="flex justify-between font-mono text-[10px]">
                          <span className="text-[var(--ink)]">{org.usagePercent}%</span>
                          <span className="text-[var(--text-muted)]">
                            {org.usageLabel}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--canvas)]">
                          <div
                            className="h-full rounded-full bg-[var(--ink)]"
                            style={{ width: `${org.usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </DataTable.Cell>

                    <DataTable.Cell>
                      <StatusBadge
                        role={
                          org.status === 'Active'
                            ? 'active'
                            : org.status === 'Trial'
                              ? 'trial'
                              : 'suspended'
                        }
                        label={org.status}
                      />
                    </DataTable.Cell>

                    <DataTable.DateCell
                      date={org.renewalDate}
                      time={org.renewalNote}
                    />

                    <DataTable.ActionsCell>
                      <Link
                        href={`/organizations/${org.id}`}
                        className="rounded-lg border border-[var(--line)] px-2 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Details
                      </Link>
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                );
              })}
            </DataTable.Body>
          </DataTable.Root>
        </PageWorkspaceBody>
      </PageWorkspace>

      <CreateTenantModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <ChangePlanModal
        isOpen={changePlanOpen}
        organizationId={selectedOrg.id}
        organizationName={selectedOrg.name}
        currentPlan={selectedOrg.plan}
        onClose={() => setChangePlanOpen(false)}
      />
      <ConfirmDialog
        open={suspendOpen}
        title={`Suspend ${selectedOrg.name}?`}
        description="Suspending this organization will immediately disable storefront customizer embeds, revoke active member sessions, and block GraphQL API requests."
        confirmLabel="Suspend Organization"
        isDestructive
        onConfirm={handleSuspendTenant}
        onClose={() => setSuspendOpen(false)}
      />
    </>
  );
}
