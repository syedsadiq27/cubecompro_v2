import Link from 'next/link';

export function SeoCta({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="border-t border-[var(--ink)] bg-[var(--ink)] text-[var(--canvas)]">
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-20">
        <h2 className="type-page max-w-3xl text-[clamp(1.65rem,3vw,2.35rem)] text-[var(--canvas)]">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={primaryHref}
            className="rounded-lg bg-[var(--canvas)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-white"
          >
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link
              href={secondaryHref}
              className="rounded-lg border border-white/30 px-5 py-3 text-sm font-medium text-[var(--canvas)] transition hover:border-white/60"
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
