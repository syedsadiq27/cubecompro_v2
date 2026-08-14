import Link from 'next/link';
import { plans } from '@/lib/content';

export function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <section
      id="pricing"
      className={
        compact
          ? 'bg-[var(--canvas)]'
          : 'border-t border-[var(--line)] bg-[var(--canvas)]'
      }
    >
      <div
        className={`mx-auto max-w-[90rem] px-5 md:px-8 ${
          compact ? 'pt-10 pb-16 md:pb-20' : 'py-20 lg:py-28'
        }`}
      >
        {compact ? null : (
          <>
            <p className="text-sm text-[var(--text-muted)]">Pricing</p>
            <h2 className="type-page mt-3 max-w-2xl text-[clamp(1.85rem,3.5vw,2.85rem)]">
              Founding rates while we’re still early.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
              Lock in early. Decorations and image generation stay modular —
              compute does not inflate the base plan.
            </p>
          </>
        )}

        <div
          className={`grid gap-5 lg:grid-cols-3 ${compact ? '' : 'mt-14'}`}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col px-6 py-8 ${
                plan.featured
                  ? 'bg-[var(--ink)] text-white'
                  : 'border border-[var(--border-strong)] bg-[var(--surface-pure)]'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className={`type-section text-[22px] ${
                    plan.featured ? 'text-white' : ''
                  }`}
                >
                  {plan.name}
                </h3>
                {plan.featured ? (
                  <span className="text-[10px] font-medium tracking-[0.12em] text-white/55 uppercase">
                    Most popular
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-5 text-[2.15rem] font-semibold tracking-tight ${
                  plan.featured ? 'text-white' : 'text-[var(--ink)]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {plan.foundingPrice}
                {plan.foundingPrice !== 'Custom' ? (
                  <span
                    className={`ml-1 text-sm font-normal ${
                      plan.featured
                        ? 'text-white/55'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    /mo
                  </span>
                ) : null}
              </p>
              {plan.regularPrice ? (
                <p
                  className={`mt-1 text-xs ${
                    plan.featured
                      ? 'text-white/45'
                      : 'text-[var(--text-muted)]'
                  }`}
                >
                  then {plan.regularPrice}/mo
                </p>
              ) : null}
              <p
                className={`mt-4 text-sm leading-relaxed ${
                  plan.featured
                    ? 'text-white/75'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {plan.blurb}
              </p>
              <p
                className={`mt-2 text-xs ${
                  plan.featured
                    ? 'text-white/50'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {plan.bestFor}
              </p>
              <ul
                className={`mt-7 flex-1 space-y-2 text-sm ${
                  plan.featured
                    ? 'text-white/75'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link
                href={`/?interest=${plan.interest}#contact`}
                className={`mt-8 inline-flex justify-center rounded-lg px-4 py-3 text-sm font-medium transition ${
                  plan.featured
                    ? 'bg-white text-[var(--ink)] hover:bg-white/90'
                    : 'bg-[var(--ink)] text-white hover:bg-[var(--ink)]/90'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
