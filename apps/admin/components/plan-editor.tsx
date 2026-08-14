'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { createPlanAction, updatePlanAction } from '@/actions/tenants';
import { isOn, resolvePlanRows, slugify } from '@/lib/format';
import type { Catalog, Plan, PlanEntitlement } from '@/lib/types';

function grouped<T extends { application: string }>(
  items: T[],
  applications: Catalog['applications']
) {
  return applications
    .map((app) => ({
      app,
      items: items.filter((item) => item.application === app.id),
    }))
    .filter((group) => group.items.length > 0);
}

function capMap(catalog: Catalog, rows: PlanEntitlement[]) {
  const map: Record<string, boolean> = {};
  const byKey = new Map(rows.map((row) => [row.key, row]));
  for (const item of catalog.capabilities) {
    map[item.key] = isOn(byKey.get(item.key)?.value);
  }
  return map;
}

function limitMap(catalog: Catalog, rows: PlanEntitlement[]) {
  const map: Record<string, string> = {};
  const byKey = new Map(rows.map((row) => [row.key, row]));
  for (const item of catalog.limits) {
    map[item.key] = byKey.get(item.key)?.value ?? '0';
  }
  return map;
}

export function PlanEditor({
  catalog,
  plans,
  plan,
}: {
  catalog: Catalog;
  plans: Plan[];
  plan?: Plan;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(plan?.name ?? '');
  const [key, setKey] = useState(plan?.key ?? '');
  const [parentPlanId, setParentPlanId] = useState(plan?.parentPlanId ?? '');
  const seedRows = useMemo(() => {
    if (plan) return resolvePlanRows(plan, plans);
    const parent = plans.find((item) => item.id === parentPlanId);
    return parent ? resolvePlanRows(parent, plans) : [];
  }, [plan, plans, parentPlanId]);
  const [caps, setCaps] = useState(() => capMap(catalog, seedRows));
  const [limits, setLimits] = useState(() => limitMap(catalog, seedRows));

  const parents = plans.filter((item) => item.id !== plan?.id);

  function collect() {
    const parent = plans.find((item) => item.id === parentPlanId);
    const inherited = parent ? resolvePlanRows(parent, plans) : [];
    const inheritedMap = new Map(inherited.map((row) => [row.key, row]));
    const rows: Array<{
      key: string;
      kind: 'CAPABILITY' | 'LIMIT';
      value: string;
    }> = [];
    for (const item of catalog.capabilities) {
      const enabled = caps[item.key] === true;
      const parentOn = isOn(inheritedMap.get(item.key)?.value);
      if (!parent || enabled !== parentOn) {
        rows.push({
          key: item.key,
          kind: 'CAPABILITY',
          value: enabled ? 'true' : 'false',
        });
      }
    }
    for (const item of catalog.limits) {
      const value = limits[item.key] || '0';
      const parentValue = inheritedMap.get(item.key)?.value;
      if (!parent || value !== parentValue) {
        rows.push({ key: item.key, kind: 'LIMIT', value });
      }
    }
    return rows;
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        start(async () => {
          const entitlements = collect();
          const result = plan
            ? await updatePlanAction(plan.id, {
                name,
                parentPlanId: parentPlanId || null,
                entitlements,
              })
            : await createPlanAction({
                key,
                name,
                parentPlanId: parentPlanId || null,
                entitlements,
              });
          if (!result.ok) {
            setError(result.error ?? 'Failed');
            return;
          }
          router.push(plan ? `/plans/${plan.id}` : `/plans/${result.id}`);
          router.refresh();
        });
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-[12px]">
          <span className="type-meta block">Name</span>
          <input
            value={name}
            required
            onChange={(event) => {
              setName(event.target.value);
              if (!plan) setKey(slugify(event.target.value));
            }}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
          />
        </label>
        <label className="space-y-1 text-[12px]">
          <span className="type-meta block">Key</span>
          <input
            value={key}
            required
            disabled={Boolean(plan)}
            onChange={(event) => setKey(slugify(event.target.value))}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 font-mono text-[13px] disabled:bg-[var(--surface)]"
          />
        </label>
        <label className="space-y-1 text-[12px] sm:col-span-2">
          <span className="type-meta block">Includes</span>
          <select
            value={parentPlanId}
            onChange={(event) => {
              const next = event.target.value;
              setParentPlanId(next);
              if (plan) return;
              const parent = plans.find((item) => item.id === next);
              const rows = parent ? resolvePlanRows(parent, plans) : [];
              setCaps(capMap(catalog, rows));
              setLimits(limitMap(catalog, rows));
            }}
            className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
          >
            <option value="">None</option>
            {parents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section>
        <h2 className="type-nav-label mb-3">Capabilities</h2>
        <div className="space-y-4">
          {grouped(catalog.capabilities, catalog.applications).map((group) => (
            <div key={group.app.id}>
              <p className="mb-2 text-[12px] font-medium text-[var(--ink)]">
                {group.app.label}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
                  >
                    <input
                      type="checkbox"
                      checked={caps[item.key] === true}
                      onChange={(event) =>
                        setCaps((prev) => ({
                          ...prev,
                          [item.key]: event.target.checked,
                        }))
                      }
                    />
                    <span>
                      <span className="block">{item.label}</span>
                      <span className="type-meta font-mono">{item.key}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="type-nav-label mb-3">Limits</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {catalog.limits.map((item) => (
            <label key={item.key} className="space-y-1 text-[12px]">
              <span className="type-meta block">
                {item.label}
                <span className="ml-2 font-mono">{item.key}</span>
              </span>
              <input
                value={limits[item.key] ?? '0'}
                onChange={(event) =>
                  setLimits((prev) => ({
                    ...prev,
                    [item.key]: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
              />
            </label>
          ))}
        </div>
      </section>

      {error ? (
        <p className="text-[12px] text-[var(--danger)]">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--ink)] px-4 py-2 text-[13px] text-white disabled:opacity-50"
      >
        {plan ? 'Save plan' : 'Create plan'}
      </button>
    </form>
  );
}
