import { Section } from '@repo/ui';
import Link from 'next/link';

import { audiences, benefitOutcomes } from '@/lib/content';

export function Benefits() {
  return (
    <Section id="outcomes" tone="muted" spacing="default">
      <Section.Header title="Keep configuration truth in one place." />

      <Section.Body gap="spacious">
        <ul className="grid gap-8 border-t border-[var(--line)] pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {benefitOutcomes.map((outcome, index) => (
            <li
              key={outcome}
              className={`min-w-0 lg:px-6 lg:first:pl-0 lg:last:pr-0 ${
                index > 0 ? 'lg:border-l lg:border-[var(--line)]' : ''
              }`}
            >
              <p
                className="text-[13px] font-medium tracking-[0.08em] text-[var(--stage-violet)]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {String(index + 1).padStart(2, '0')}
              </p>
              <p
                className="mt-4 text-[clamp(1.4rem,2.5vw,1.75rem)] leading-[1.2] tracking-tight text-[var(--ink)]"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 650 }}
              >
                {outcome}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-14 border-t border-[var(--line)] pt-10">
          <p className="max-w-xl text-lg leading-snug text-[var(--ink)] md:text-xl">
            Built for products that change before they’re bought.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
            {audiences.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="underline-offset-4 transition hover:text-[var(--ink)] hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section.Body>
    </Section>
  );
}
