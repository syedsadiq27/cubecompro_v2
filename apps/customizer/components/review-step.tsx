'use client';

import { ExperiencePanel } from '@repo/customizer-ui';
import { useConfiguration } from '@/providers/configuration-provider';

const REGION_LABELS = {
  front: 'Front',
  left: 'Left side',
  right: 'Right side',
  back: 'Back',
} as const;

export function ReviewStep() {
  const { state, priceLabel, validation } = useConfiguration();
  const decorations = state.decorations.filter(
    (entry) => entry.logoName || entry.text
  );

  return (
    <ExperiencePanel
      eyebrow="Review"
      title={state.productName || 'Your design'}
      description="Confirm the look, then add it to your cart."
    >
      <div className="rounded-2xl border border-[#e4e0d9] bg-white p-5">
        <p className="text-sm text-[#7a776f]">
          {state.sku ? `SKU ${state.sku}` : 'Product'}
        </p>
        <p className="mt-1 text-base font-semibold text-[#1f1f1f]">
          {state.productName || 'Configured product'}
        </p>
        <p className="mt-3 text-sm text-[#353535]">
          {state.colorway?.displayName ||
            (state.partColors.length
              ? 'Custom part colors'
              : 'No colorway selected')}
        </p>

        {decorations.length ? (
          <ul className="mt-4 space-y-2 border-t border-[#efece7] pt-4 text-sm text-[#6f6b63]">
            {decorations.map((entry) => (
              <li key={entry.id}>
                <span className="font-medium text-[#353535]">
                  {REGION_LABELS[entry.region]}
                </span>
                {entry.logoName ? ` · ${entry.logoName}` : null}
                {entry.text ? ` · “${entry.text}”` : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border-t border-[#efece7] pt-4 text-sm text-[#7a776f]">
            No decoration added
          </p>
        )}

        <p className="mt-5 text-xl font-semibold tracking-tight text-[#1f1f1f]">
          {priceLabel}
        </p>
      </div>

      {validation.issues.length ? (
        <ul className="space-y-2 text-sm">
          {validation.issues.map((issue) => (
            <li
              key={issue.id}
              className={
                issue.severity === 'block'
                  ? 'text-[#b42318]'
                  : 'text-[#8a6a1f]'
              }
            >
              {issue.severity === 'block' ? '❌' : '⚠'} {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </ExperiencePanel>
  );
}
