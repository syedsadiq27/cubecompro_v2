'use client';

import type { ReactNode } from 'react';

export function ColorSidebar({
  title = 'Color',
  description,
  progress,
  onBack,
  children,
}: {
  title?: string;
  description?: string;
  progress?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="ui:flex ui:h-full ui:flex-col ui:p-4 ui:text-left ui:md:p-6">
      <header className="ui:mb-4 ui:flex ui:items-start ui:justify-between ui:gap-3">
        <div>
          <h2 className="ui:text-lg ui:font-semibold ui:uppercase ui:text-[#353535]">
            {title}
          </h2>
          {description ? (
            <p className="ui:mt-1 ui:text-sm ui:text-[#5d5d5d]">{description}</p>
          ) : null}
        </div>
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="ui:shrink-0 ui:text-sm ui:font-bold ui:uppercase ui:text-[#cf132b]"
          >
            Back
          </button>
        ) : null}
      </header>
      {progress ? <div className="ui:mb-4">{progress}</div> : null}
      <div className="ui:min-h-0 ui:flex-1 ui:overflow-auto">{children}</div>
    </div>
  );
}
