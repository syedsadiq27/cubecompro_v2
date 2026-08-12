'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createRuleAction } from '@/actions/graph';
import { Panel } from '@/components/ui';
import { describeRule, type GraphDetail } from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function RulesTab({
  projectId,
  productId,
  detail,
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration before adding compatibility rules.
        </p>
      </Panel>
    );
  }

  const keys = detail.attributes.map((attribute) => ({
    key: attribute.key,
    name: attribute.name,
  }));

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Rules</h2>
          <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
            Keep invalid combinations out of the cart before resolve.
          </p>
        </div>

        <div className="space-y-3">
          {detail.rules.map((rule) => {
            const described = describeRule(rule, detail.attributes);
            return (
              <div
                key={rule.id}
                className="rounded-[10px] border border-[var(--bo-line)] px-4 py-3"
              >
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  When
                </p>
                <p className="mt-1 text-[14px] font-medium">{described.when}</p>
                <p className="mt-3 text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  Then
                </p>
                <p className="mt-1 text-[14px] font-medium">{described.then}</p>
              </div>
            );
          })}
          {detail.rules.length === 0 ? (
            <p className="text-sm text-[var(--bo-muted)]">No rules yet.</p>
          ) : null}
        </div>
      </Panel>

      {editable ? (
        <Panel className="space-y-3">
          <h3 className="text-[13px] font-semibold">Add rule</h3>
          <form
            className="grid gap-2 md:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              startTransition(async () => {
                const result = await createRuleAction(
                  projectId,
                  productId,
                  formData
                );
                setMessage(
                  result.ok ? 'Rule added.' : result.error || 'Failed.'
                );
                if (result.ok) {
                  form.reset();
                  router.refresh();
                }
              });
            }}
          >
            <input type="hidden" name="graphVersionId" value={detail.id} />
            <label className="space-y-1 text-[12px] text-[var(--bo-muted)]">
              When
              <select name="whenAttr" required className={inputClass}>
                {keys.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-[12px] text-[var(--bo-muted)]">
              is
              <input name="whenEq" required className={inputClass} />
            </label>
            <label className="space-y-1 text-[12px] text-[var(--bo-muted)]">
              Then
              <select
                name="effectKind"
                className={inputClass}
                defaultValue="forbid"
              >
                <option value="forbid">cannot be</option>
                <option value="require">must be</option>
              </select>
            </label>
            <label className="space-y-1 text-[12px] text-[var(--bo-muted)]">
              Option
              <select name="effectAttr" required className={inputClass}>
                {keys.map((entry) => (
                  <option key={entry.key} value={entry.key}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-[12px] text-[var(--bo-muted)]">
              Value
              <div className="flex gap-2">
                <input name="effectEq" required className={inputClass} />
                <button
                  type="submit"
                  disabled={pending || keys.length === 0}
                  className="bo-btn-primary shrink-0 rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
                >
                  Add
                </button>
              </div>
            </label>
          </form>
          {message ? (
            <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
