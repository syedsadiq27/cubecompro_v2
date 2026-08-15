'use client';

import { CloseIcon } from '@/components/bo/icons';
import {
  type GraphAttribute,
  type GraphAttributeValue,
} from '@/lib/product-workspace';

export function ValueDetailDrawer({
  attribute,
  value,
  effects = [],
  open = true,
  onClose,
}: {
  attribute: GraphAttribute | null;
  value: GraphAttributeValue | null;
  effects?: Array<{ binding: string; operation: string; value: string }>;
  open?: boolean;
  onClose: () => void;
}) {
  if (!open || !attribute || !value) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 animate-in fade-in duration-150">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] p-4">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Option Value Details
            </p>
            <h2 className="mt-1 text-[16px] font-semibold text-[var(--ink)]">
              {value.name}
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
              {attribute.name} choice · <span className="font-mono">{value.key}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-4 text-[13px]">
          <section className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 shadow-xs">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              General Identity
            </h3>
            <Row label="Name" value={value.name} />
            <Row label="Key" value={value.key} isMono />
          </section>

          <section className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 shadow-xs">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              3D Visual Mapping
            </h3>
            {effects.length === 0 ? (
              <p className="text-[12px] text-[var(--text-muted)]">
                No visual mapping yet. Add one in the 3D tab.
              </p>
            ) : (
              effects.map((effect, index) => (
                <Row
                  key={`${effect.binding}-${index}`}
                  label={effect.binding}
                  value={effect.value}
                />
              ))
            )}
          </section>

          <section className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 shadow-xs">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Commerce Link
            </h3>
            <Row label="Attribute" value={attribute.key} isMono />
            <Row label="Value" value={value.key} isMono />
          </section>

          <section className="space-y-2 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5 shadow-xs">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Availability
            </h3>
            <Row label="Available when" value="Always" />
          </section>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  isMono,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--line)]/60 py-2 last:border-b-0">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className={`text-right font-medium text-[var(--ink)] ${isMono ? 'font-mono text-[12px]' : ''}`}>
        {value}
      </span>
    </div>
  );
}
