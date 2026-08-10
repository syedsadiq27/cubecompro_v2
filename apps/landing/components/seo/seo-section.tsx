import type { ReactNode } from 'react';

export function SeoSection({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = 'default',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  tone?: 'default' | 'muted';
}) {
  return (
    <section
      id={id}
      className={
        tone === 'muted'
          ? 'border-t border-[var(--line)] bg-[var(--surface)]'
          : 'border-t border-[var(--line)] bg-[var(--canvas)]'
      }
    >
      <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-24">
        {eyebrow ? (
          <p className="text-sm text-[var(--text-muted)]">{eyebrow}</p>
        ) : null}
        <h2 className="type-page mt-3 max-w-3xl text-[clamp(1.65rem,3vw,2.35rem)]">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        ) : null}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
