'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  applyPcConstraints,
  describeBlock,
  explainBlocked,
  isFabricBlocked,
  isLegsBlocked,
  isSizeBlocked,
  PC_DEFAULT,
  PC_FABRICS,
  PC_LEGS,
  PC_SIZES,
  resolvePc,
  type PcState,
} from './pc-logic';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function PcOptionGraph({
  compact = false,
}: {
  compact?: boolean;
} = {}) {
  const [state, setState] = useState<PcState>(PC_DEFAULT);
  const [notice, setNotice] = useState<string | null>(
    'Try Brass → Charcoal is blocked'
  );
  const [flash, setFlash] = useState(0);
  const resolved = useMemo(() => resolvePc(state), [state]);

  useEffect(() => {
    setFlash((value) => value + 1);
  }, [resolved.sku, resolved.price]);

  const commit = (next: PcState) => {
    const { state: constrained, rewritten } = applyPcConstraints(next);
    setState(constrained);
    setNotice(rewritten ?? describeBlock(constrained));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]">
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] ${
          compact ? 'px-3 py-2.5' : 'px-4 py-3'
        }`}
      >
        <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--text-muted)] uppercase">
          Live option graph
        </p>
        {notice ? (
          <p className="max-w-[18rem] truncate text-right text-[12px] leading-snug text-[var(--ink)] md:max-w-[22rem]">
            {notice}
          </p>
        ) : null}
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className={`space-y-3 ${compact ? 'p-3 md:space-y-4 md:p-5' : 'space-y-4 p-4 md:p-5'}`}
        >
          <OptionGroup label="Fabric">
            {PC_FABRICS.map((option) => {
              const blocked = isFabricBlocked(state, option.id);
              return (
                <Chip
                  key={option.id}
                  label={option.label}
                  swatch={option.swatch}
                  active={state.fabric === option.id}
                  blocked={blocked}
                  onClick={() => {
                    if (blocked) {
                      setNotice(
                        explainBlocked(state, 'fabric', option.id) ??
                          'Combination blocked by rules'
                      );
                      return;
                    }
                    commit({ ...state, fabric: option.id });
                  }}
                />
              );
            })}
          </OptionGroup>

          <OptionGroup label="Size">
            {PC_SIZES.map((option) => {
              const blocked = isSizeBlocked(state, option.id);
              return (
                <Chip
                  key={option.id}
                  label={option.label}
                  active={state.size === option.id}
                  blocked={blocked}
                  onClick={() => {
                    if (blocked) {
                      setNotice(
                        explainBlocked(state, 'size', option.id) ??
                          'Combination blocked by rules'
                      );
                      return;
                    }
                    commit({ ...state, size: option.id });
                  }}
                />
              );
            })}
          </OptionGroup>

          <OptionGroup label="Legs">
            {PC_LEGS.map((option) => {
              const blocked = isLegsBlocked(state, option.id);
              return (
                <Chip
                  key={option.id}
                  label={option.label}
                  swatch={option.swatch}
                  active={state.legs === option.id}
                  blocked={blocked}
                  onClick={() => {
                    if (blocked) {
                      setNotice(
                        explainBlocked(state, 'legs', option.id) ??
                          'Combination blocked by rules'
                      );
                      return;
                    }
                    commit({ ...state, legs: option.id });
                  }}
                />
              );
            })}
          </OptionGroup>
        </div>

        <div
          className={`border-t border-[var(--line)] bg-[var(--canvas)] md:border-t-0 md:border-l ${
            compact ? 'p-3 md:p-5' : 'p-4 md:p-5'
          }`}
        >
          <p className="text-[10px] tracking-[0.08em] text-[var(--text-muted)] uppercase">
            Resolution
          </p>
          <div
            key={flash}
            className={`pc-resolve-flash mt-2.5 ${
              compact
                ? 'grid grid-cols-2 gap-2 md:block md:space-y-2.5'
                : 'space-y-2.5'
            }`}
          >
            <Metric label="SKU" value={resolved.sku} mono />
            <Metric label="Price" value={formatPrice(resolved.price)} mono />
            <Metric
              label="Inventory"
              value={
                resolved.inventory > 0 ? `${resolved.inventory}` : '0'
              }
              tone={resolved.inventory > 0 ? 'ok' : 'bad'}
            />
            <Metric label="Valid" value="Yes" tone="ok" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-medium tracking-[0.08em] text-[var(--text-muted)] uppercase">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  label,
  swatch,
  active,
  blocked,
  onClick,
}: {
  label: string;
  swatch?: string;
  active: boolean;
  blocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-disabled={blocked}
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs transition ${
        blocked
          ? 'border-[var(--line)] text-[var(--text-muted)] line-through opacity-45 hover:opacity-70'
          : active
            ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
            : 'border-[var(--border-strong)] text-[var(--ink)] hover:border-[var(--ink)]'
      }`}
    >
      {swatch ? (
        <span
          className={`h-3 w-3 rounded-full border ${
            active ? 'border-white/30' : 'border-black/10'
          }`}
          style={{ background: swatch }}
        />
      ) : null}
      {label}
    </button>
  );
}

function Metric({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: 'ok' | 'bad';
}) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-2.5">
      <p className="text-[10px] tracking-[0.08em] text-[var(--text-muted)] uppercase">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-medium ${
          tone === 'ok'
            ? 'text-[var(--success)]'
            : tone === 'bad'
              ? 'text-[var(--danger)]'
              : 'text-[var(--ink)]'
        } ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
