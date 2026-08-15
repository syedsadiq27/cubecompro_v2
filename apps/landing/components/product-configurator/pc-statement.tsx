'use client';

import { useEffect, useState } from 'react';
import { Container, Heading } from '@repo/ui';

const PIPELINE = [
  'Product graph',
  'Rules',
  'Valid state',
  'Commerce resolution',
] as const;

const OUTPUTS = ['SKU', 'Price', 'Inventory', 'Cart'] as const;

const DESKTOP_STEPS = [
  'Product graph',
  'Rules',
  'Valid state',
  'SKU',
  'Price',
  'Inventory',
  'Cart',
] as const;

export function PcStatement() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % DESKTOP_STEPS.length);
    }, 850);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
      <Container className="py-10 md:py-11">
        <Heading as="h2" variant="section" className="max-w-4xl text-white">
          Every choice has a consequence. CubeCom resolves it.
        </Heading>

        <div className="mt-6 md:hidden">
          <ol className="space-y-0">
            {PIPELINE.map((step, index) => (
              <li key={step} className="flex flex-col items-center">
                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-[15px] font-medium">
                  {step}
                </div>
                {index < PIPELINE.length - 1 ? (
                  <span className="py-1.5 text-white/40" aria-hidden>
                    ↓
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {OUTPUTS.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-center font-mono text-xs text-white/75"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 hidden overflow-x-auto pb-1 md:block">
          <ol className="flex min-w-max items-stretch gap-2">
            {DESKTOP_STEPS.map((step, index) => {
              const isActive = index === active;
              const isPast = index < active;
              return (
                <li key={step} className="flex items-center gap-2">
                  <div
                    className={`min-w-[6.75rem] rounded-xl border px-3.5 py-3 text-center text-sm font-medium transition duration-500 ${
                      isActive
                        ? 'scale-[1.03] border-[var(--stage-violet-light)] bg-[var(--stage-violet)]/30 text-white shadow-[0_0_28px_rgba(95,87,247,0.4)]'
                        : isPast
                          ? 'border-white/25 bg-white/10 text-white/85'
                          : 'border-white/10 bg-white/[0.03] text-white/40'
                    }`}
                  >
                    {step}
                  </div>
                  {index < DESKTOP_STEPS.length - 1 ? (
                    <span
                      className={`text-lg ${
                        isPast || isActive ? 'text-white/50' : 'text-white/15'
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
