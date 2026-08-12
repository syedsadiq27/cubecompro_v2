'use client';

import {
  INSPECTOR_GROUP_LABELS,
  type InspectorStep,
  type InspectorStepStatus,
} from '@/lib/inspector/types';

function StatusMark({ status }: { status?: InspectorStepStatus }) {
  if (!status) return <span className="text-[var(--text-muted)]">—</span>;
  if (status.kind === 'complete') {
    return <span className="text-[12px] text-[var(--ink)]">✓</span>;
  }
  if (status.kind === 'warning') {
    return <span className="text-[12px] text-[var(--stage-violet)]">!</span>;
  }
  if (status.kind === 'empty') {
    return <span className="text-[var(--text-muted)]">—</span>;
  }
  if (status.kind === 'count') {
    return (
      <span className="text-[12px] tabular-nums text-[var(--text-muted)]">
        {status.value}
      </span>
    );
  }
  return (
    <span className="max-w-[72px] truncate text-[11px] text-[var(--text-muted)]">
      {status.value}
    </span>
  );
}

export function InspectorRail({
  groups,
  activeId,
  onSelect,
  resolveStatus,
  resolveSummary,
  numberedGroups = ['configure'],
}: {
  groups: Array<{
    group: keyof typeof INSPECTOR_GROUP_LABELS;
    steps: InspectorStep[];
  }>;
  activeId: string | null;
  onSelect: (id: string) => void;
  resolveStatus: (step: InspectorStep) => InspectorStepStatus | undefined;
  resolveSummary: (step: InspectorStep) => string | undefined;
  numberedGroups?: Array<keyof typeof INSPECTOR_GROUP_LABELS>;
}) {
  return (
    <div className="space-y-4">
      {groups.map(({ group, steps }) => (
        <section key={group}>
          <p className="type-nav-label mb-1.5 px-1">
            {INSPECTOR_GROUP_LABELS[group]}
          </p>
          <ul className="space-y-0.5">
            {steps.map((step, index) => {
              const active = activeId === step.id;
              const numbered = numberedGroups.includes(group);
              const prefix = numbered
                ? String(index + 1).padStart(2, '0')
                : null;
              const status = resolveStatus(step);
              const summary = resolveSummary(step) || step.description;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(step.id)}
                    className={`flex h-11 w-full items-center gap-2 rounded-[8px] px-2 text-left ${
                      active ? 'bg-black/[0.05]' : 'hover:bg-black/[0.03]'
                    }`}
                  >
                    {prefix ? (
                      <span className="w-5 shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">
                        {prefix}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13px] ${
                          active
                            ? 'font-medium text-[var(--ink)]'
                            : 'text-[var(--ink)]/85'
                        }`}
                      >
                        {step.label}
                      </span>
                      {summary ? (
                        <span className="block truncate text-[11px] text-[var(--text-muted)]">
                          {summary}
                        </span>
                      ) : null}
                    </span>
                    <StatusMark status={status} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
