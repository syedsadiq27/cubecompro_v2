'use client';

import type { ReactNode } from 'react';

export function ExperiencePanel({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={[
        'ui:flex ui:flex-col ui:px-4 ui:py-3 ui:md:px-5 ui:md:py-5',
        compact ? 'ui:h-auto' : 'ui:h-full',
      ].join(' ')}
    >
      <header className="ui:mb-4 ui:md:mb-5">
        {eyebrow ? (
          <p className="ui:mb-1 ui:text-[0.6875rem] ui:font-medium ui:tracking-[0.18em] ui:text-[#8a867e] ui:uppercase ui:md:mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="ui:max-w-[14ch] ui:text-[2rem] ui:leading-[1.05] ui:font-semibold ui:tracking-[-0.03em] ui:text-[#141311] ui:md:text-[1.875rem]">
          {title}
        </h2>
        {description ? (
          <p className="ui:mt-1.5 ui:max-w-[30ch] ui:text-sm ui:leading-relaxed ui:text-[#6f6b63]">
            {description}
          </p>
        ) : null}
      </header>
      <div className="ui:flex ui:min-h-0 ui:flex-col ui:gap-5">{children}</div>
    </div>
  );
}
