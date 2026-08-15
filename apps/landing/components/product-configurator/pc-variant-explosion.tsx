'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Frame, Grid, List, ListItem, Section, Typography } from '@repo/ui';

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
    <Section tone="soft" spacing="compact">
      <Section.Header>
        <Section.Title className="max-w-[18ch] md:max-w-3xl">
          Variant matrices explode. Rules do not.
        </Section.Title>
        <Typography variant="body" className="mt-4 max-w-2xl md:text-base">
          Options → Constraints → Valid State → SKU / Price / Inventory. That is
          the engine path — whether or not a 3D scene is attached.
        </Typography>
      </Section.Header>

      <Section.Body gap="md">
        <Grid cols="lg-2" gap="md" className="md:gap-5">
          <Frame className="bg-[var(--surface-pure)]">
            <div className="border-b border-[var(--line)] px-4 py-3 md:px-5 md:py-4">
              <Typography variant="label">Traditional model</Typography>
              <Typography variant="code" className="mt-2 text-sm md:text-base normal-case tracking-normal text-[var(--ink)]">
                10 × 8 × 6 × 5 ={' '}
                <Typography as="span" variant="bodyStrong">
                  2,400 variants
                </Typography>
              </Typography>
            </div>
            <div className="p-4 md:p-5">
              <MatrixVisual />
            </div>
          </Frame>

          <Frame
            className="border-[var(--ink)] bg-[var(--ink)]"
            data-surface-tone="ink"
          >
            <div className="border-b border-white/10 px-4 py-3 md:px-5 md:py-4">
              <Typography variant="label">CubeCom model</Typography>
              <Typography variant="code" tone="inverse" className="mt-2 text-sm md:text-base normal-case tracking-normal">
                4 dimensions + 12 rules → runtime resolve
              </Typography>
            </div>
            <div className="p-4 md:p-5">
              <List as="ol" gap="xs">
                {FLOW.map((step, index) => {
                  const isActive = index === active;
                  return (
                    <ListItem key={step}>
                      <button
                        type="button"
                        onClick={() => setActive(index)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                          isActive
                            ? 'border-[var(--stage-violet-light)] bg-white/10'
                            : 'border-white/10 bg-transparent hover:bg-white/[0.04]'
                        }`}
                      >
                        <Typography variant="code">0{index + 1}</Typography>
                        <Typography as="span" variant="bodyStrong" tone="inverse">
                          {step}
                        </Typography>
                      </button>
                      {index < FLOW.length - 1 ? (
                        <div className="flex justify-center py-1">
                          <Typography
                            as="span"
                            variant="meta"
                            tone="inverse"
                            className={
                              index < active ? 'text-white/50' : 'text-white/20'
                            }
                          >
                            ↓
                          </Typography>
                        </div>
                      ) : null}
                    </ListItem>
                  );
                })}
              </List>
              <Typography variant="code" className="mt-4">
                {FLOW[active] === 'SKU / Price / Inventory'
                  ? 'Sellable state from one resolve'
                  : `Step ${active + 1} of ${FLOW.length}`}
              </Typography>
            </div>
          </Frame>
        </Grid>
      </Section.Body>
    </Section>
  );
}

function MatrixVisual() {
  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[var(--line)]">
        <Image
          src="/images/problem-variant-matrix.jpg"
          alt="Variant matrix explosion versus resolved valid state"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <Typography variant="meta" className="mt-3">
        Variant matrix explodes into thousands of disconnected fragments —
        rules resolve into a single valid state.
      </Typography>
    </div>
  );
}
