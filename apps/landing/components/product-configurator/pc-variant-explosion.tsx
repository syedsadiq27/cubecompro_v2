'use client';

import { useEffect, useState } from 'react';
import { Container, Frame, Grid, Heading, Typography } from '@repo/ui';

const FLOW = [
  'Options',
  'Constraints',
  'Valid State',
  'SKU / Price / Inventory',
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
      <Container padding="sectionCompact">
        <Heading
          as="h2"
          variant="section"
          className="max-w-[18ch] md:max-w-3xl"
        >
          Variant matrices explode. Rules do not.
        </Heading>
        <Typography variant="body" className="mt-4 max-w-2xl md:text-base">
          Options → Constraints → Valid State → SKU / Price / Inventory. That is
          the engine path — whether or not a 3D scene is attached.
        </Typography>

        <Grid cols="lg-2" gap="md" className="mt-8 md:mt-10 md:gap-5">
          <Frame className="bg-[var(--surface-pure)]">
            <div className="border-b border-[var(--line)] px-4 py-3 md:px-5 md:py-4">
              <Typography variant="label">Traditional model</Typography>
              <p className="mt-2 font-mono text-sm text-[var(--ink)] md:text-base">
                10 × 8 × 6 × 5 ={' '}
                <span className="font-semibold">2,400 variants</span>
              </p>
            </div>
            <div className="p-4 md:p-5">
              <MatrixVisual />
            </div>
          </Frame>

          <Frame className="border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
            <div className="border-b border-white/10 px-4 py-3 md:px-5 md:py-4">
              <Typography variant="label" tone="ink">
                CubeCom model
              </Typography>
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
                        <Typography variant="code" tone="ink">
                          0{index + 1}
                        </Typography>
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
              <Typography variant="code" tone="ink" className="mt-4">
                {FLOW[active] === 'SKU / Price / Inventory'
                  ? 'Sellable state from one resolve'
                  : `Step ${active + 1} of ${FLOW.length}`}
              </Typography>
            </div>
          </Frame>
        </Grid>
      </Container>
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
      <Typography variant="meta" className="mt-3">
        Dense catalog matrix — red cells still fail after publishing every
        variant.
      </Typography>
    </div>
  );
}
