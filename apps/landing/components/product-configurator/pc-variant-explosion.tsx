'use client';

import { useEffect, useState } from 'react';

const FLOW = [
  'Options',
  'Constraints',
  'Valid State',
  'Commerce Resolution',
] as const;

export function PcVariantExplosion() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % FLOW.length);
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="border-t border-[var(--line)] bg-[var(--surface)]">
      <div className="mx-auto max-w-[90rem] px-5 py-10 md:px-8 md:py-16">
        <p className="text-sm text-[var(--text-muted)]">The real problem</p>
        <h2 className="type-page mt-3 max-w-[18ch] text-[clamp(1.65rem,3.2vw,2.75rem)] md:max-w-3xl">
          Variant matrices explode. Rules do not.
        </h2>

        <div className="mt-8 grid gap-4 md:mt-10 md:gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-pure)]">
            <div className="border-b border-[var(--line)] px-4 py-3 md:px-5 md:py-4">
              <p className="text-[11px] font-medium tracking-[0.1em] text-[var(--text-muted)] uppercase">
                Traditional model
              </p>
              <p className="mt-2 font-mono text-sm text-[var(--ink)] md:text-base">
                10 × 8 × 6 × 5 ={' '}
                <span className="font-semibold">2,400 variants</span>
              </p>
            </div>
            <div className="p-4 md:p-5">
              <MatrixVisual />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
            <div className="border-b border-white/10 px-4 py-3 md:px-5 md:py-4">
              <p className="text-[11px] font-medium tracking-[0.1em] text-white/45 uppercase">
                CubeCom model
              </p>
              <p className="mt-2 font-mono text-sm md:text-base">
                4 dimensions + 12 rules → runtime resolve
              </p>
            </div>
            <div className="p-4 md:p-5">
              <ol className="space-y-2">
                {FLOW.map((step, index) => {
                  const isActive = index === active;
                  return (
                    <li key={step}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                          isActive
                            ? 'border-[var(--stage-violet-light)] bg-white/10'
                            : 'border-white/10 bg-transparent hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="font-mono text-[11px] text-white/45">
                          0{index + 1}
                        </span>
                        <span className="text-sm font-medium">{step}</span>
                      </button>
                      {index < FLOW.length - 1 ? (
                        <div className="flex justify-center py-1">
                          <span
                            className={`text-xs ${
                              index < active ? 'text-white/50' : 'text-white/20'
                            }`}
                          >
                            ↓
                          </span>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-4 font-mono text-[11px] text-white/45">
                {FLOW[active] === 'Commerce Resolution'
                  ? 'SKU · price · inventory · cart'
                  : `Step ${active + 1} of ${FLOW.length}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MatrixVisual() {
  const cols = 40;
  const rows = 16;
  const cells = cols * rows;
  const invalid = new Set([37, 82, 119, 156, 203, 241, 288, 334, 391, 447]);

  return (
    <div>
      <div
        className="grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        aria-hidden
      >
        {Array.from({ length: cells }, (_, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[1px] ${
              invalid.has(index)
                ? 'bg-[var(--danger)]/70'
                : 'bg-[var(--ink)]/25'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-[11px] text-[var(--text-muted)]">
        Dense catalog matrix — red cells still fail after publishing every
        variant.
      </p>
    </div>
  );
}
