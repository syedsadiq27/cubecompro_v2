'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createRuleAction } from '@/actions/graph';
import { Panel } from '@/components/ui';
import { describeRule, type GraphDetail, type GraphRule } from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

function formatRuleLine(when: string, then: string) {
  const ifLine = when
    .replace(/ is /g, ' = ')
    .replace(/ and /g, ' AND ')
    .replace(/ or /g, ' OR ');
  const thenLine = then
    .replace(/ cannot be /g, ' ≠ ')
    .replace(/ must be /g, ' = ');
  return { ifLine, thenLine };
}

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
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<GraphRule | null>(null);

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

  const selectedDescribed = selected
    ? formatRuleLine(
        describeRule(selected, detail.attributes).when,
        describeRule(selected, detail.attributes).then
      )
    : null;

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">Rules</h2>
            <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
              Which option combinations are valid.
            </p>
          </div>
          {editable ? (
            <button
              type="button"
              onClick={() => {
                setSelected(null);
                setAdding(true);
              }}
              className="text-[13px] font-medium text-[var(--bo-ink)] hover:underline"
            >
              + Add rule
            </button>
          ) : null}
        </div>

        <ul className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
          {detail.rules.map((rule) => {
            const described = describeRule(rule, detail.attributes);
            const { ifLine, thenLine } = formatRuleLine(
              described.when,
              described.then
            );
            return (
              <li
                key={rule.id}
                className="border-b border-[var(--bo-line)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setSelected(rule);
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-black/[0.02]"
                >
                  <span className="min-w-0 flex-1 font-mono text-[13px] leading-relaxed text-[var(--bo-ink)]">
                    <span className="block">
                      <span className="mr-2 font-sans text-[11px] font-semibold tracking-[0.06em] text-[var(--bo-muted)] uppercase">
                        If
                      </span>
                      {ifLine}
                    </span>
                    <span className="mt-0.5 block">
                      <span className="mr-2 font-sans text-[11px] font-semibold tracking-[0.06em] text-[var(--bo-muted)] uppercase">
                        Then
                      </span>
                      {thenLine}
                    </span>
                  </span>
                  <span className="shrink-0 text-[12px] text-[var(--bo-live)]">
                    Active
                  </span>
                  <span className="text-[var(--bo-muted)]">→</span>
                </button>
              </li>
            );
          })}
          {detail.rules.length === 0 ? (
            <li className="px-3.5 py-6 text-sm text-[var(--bo-muted)]">
              No rules yet.
            </li>
          ) : null}
        </ul>

        {message ? (
          <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
        ) : null}
      </Panel>

      {selected && selectedDescribed ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelected(null)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--bo-line)] bg-white shadow-[var(--bo-shadow)]">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--bo-line)] px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  Rule
                </p>
                <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
                  Compatibility
                </h2>
                <p className="mt-1 text-[12px] text-[var(--bo-live)]">Active</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-md px-2 py-1 text-[13px] text-[var(--bo-muted)] hover:bg-black/[0.04]"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 px-5 py-5 font-mono text-[14px]">
              <div>
                <p className="mb-1 font-sans text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  If
                </p>
                <p>{selectedDescribed.ifLine}</p>
              </div>
              <div>
                <p className="mb-1 font-sans text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  Then
                </p>
                <p>{selectedDescribed.thenLine}</p>
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      {adding && editable ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 cursor-default"
            onClick={() => setAdding(false)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--bo-line)] bg-white shadow-[var(--bo-shadow)]">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--bo-line)] px-5 py-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                  New rule
                </p>
                <h2 className="mt-1 text-[18px] font-semibold tracking-tight">
                  Add compatibility rule
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-md px-2 py-1 text-[13px] text-[var(--bo-muted)] hover:bg-black/[0.04]"
              >
                Close
              </button>
            </div>
            <form
              className="space-y-3 overflow-y-auto px-5 py-5"
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
                    setAdding(false);
                    router.refresh();
                  }
                });
              }}
            >
              <input type="hidden" name="graphVersionId" value={detail.id} />
              <label className="block space-y-1 text-[12px] text-[var(--bo-muted)]">
                When
                <select name="whenAttr" required className={inputClass}>
                  {keys.map((entry) => (
                    <option key={entry.key} value={entry.key}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1 text-[12px] text-[var(--bo-muted)]">
                is
                <input name="whenEq" required className={inputClass} />
              </label>
              <label className="block space-y-1 text-[12px] text-[var(--bo-muted)]">
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
              <label className="block space-y-1 text-[12px] text-[var(--bo-muted)]">
                Option
                <select name="effectAttr" required className={inputClass}>
                  {keys.map((entry) => (
                    <option key={entry.key} value={entry.key}>
                      {entry.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1 text-[12px] text-[var(--bo-muted)]">
                Value
                <input name="effectEq" required className={inputClass} />
              </label>
              <button
                type="submit"
                disabled={pending || keys.length === 0}
                className="bo-btn-primary w-full rounded-lg px-3 py-2 text-[13px] font-medium disabled:opacity-60"
              >
                {pending ? 'Adding…' : 'Add rule'}
              </button>
            </form>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
