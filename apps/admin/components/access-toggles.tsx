'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { StatusBadge, Switch } from '@repo/ui';
import {
  deleteOverrideAction,
  upsertOverrideAction,
} from '@/actions/tenants';
import { isOn, sourceLabel } from '@/lib/format';
import type { CatalogApplication, ResolvedRow } from '@/lib/types';

export function AccessToggles({
  organizationId,
  applications,
  capabilities,
  planName,
}: {
  organizationId: string;
  applications: CatalogApplication[];
  capabilities: ResolvedRow[];
  planName?: string | null;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <fieldset disabled={pending} className="space-y-2">
      {applications.map((app) => {
        const resolved = capabilities.find((row) => row.key === app.gate);
        const planOn = isOn(resolved?.baseValue ?? 'false');
        const checked = resolved?.enabled === true;
        return (
          <div
            key={app.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
          >
            <span className="flex items-center gap-3">
              <Switch
                checked={checked}
                aria-label={`Toggle ${app.label}`}
                disabled={pending}
                onCheckedChange={(next) => {
                  start(async () => {
                    if (next === planOn) {
                      await deleteOverrideAction(organizationId, app.gate);
                    } else {
                      await upsertOverrideAction({
                        organizationId,
                        key: app.gate,
                        kind: 'CAPABILITY',
                        value: next ? 'true' : 'false',
                      });
                    }
                    router.refresh();
                  });
                }}
              />
              <span>
                <span className="block font-medium text-[var(--ink)]">
                  {app.label}
                </span>
                <span className="type-meta font-mono">{app.gate}</span>
              </span>
            </span>
            <span className="flex items-center gap-2">
              <StatusBadge
                role={checked ? 'active' : 'draft'}
                label={checked ? 'Enabled' : 'Disabled'}
              />
              <span className="type-meta">
                {sourceLabel(resolved?.source ?? 'NONE', planName)}
              </span>
            </span>
          </div>
        );
      })}
    </fieldset>
  );
}
