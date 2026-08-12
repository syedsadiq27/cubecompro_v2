'use client';

import {
  type GraphAttribute,
  type GraphAttributeValue,
} from '@/lib/product-workspace';

export function ValueDetailDrawer({
  attribute,
  value,
  effects,
  onClose,
}: {
  attribute: GraphAttribute;
  value: GraphAttributeValue;
  effects: Array<{ binding: string; operation: string; value: string }>;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--bo-line)] bg-white shadow-[var(--bo-shadow)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--bo-line)] px-5 py-4">
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">
              {value.name}
            </h2>
            <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
              {attribute.name} choice
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-[13px] text-[var(--bo-muted)] hover:bg-black/[0.04]"
          >
            Close
          </button>
        </div>
        <div className="space-y-6 overflow-y-auto px-5 py-5 text-[13px]">
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              General
            </h3>
            <Row label="Name" value={value.name} />
            <Row label="Key" value={value.key} />
          </section>
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              3D
            </h3>
            {effects.length === 0 ? (
              <p className="text-[var(--bo-muted)]">
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
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Commerce
            </h3>
            <Row label="Attribute" value={attribute.key} />
            <Row label="Value" value={value.key} />
          </section>
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Availability
            </h3>
            <Row label="Available when" value="Always" />
          </section>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--bo-line)] py-2 last:border-b-0">
      <span className="text-[var(--bo-muted)]">{label}</span>
      <span className="text-right font-medium text-[var(--bo-ink)]">
        {value}
      </span>
    </div>
  );
}
