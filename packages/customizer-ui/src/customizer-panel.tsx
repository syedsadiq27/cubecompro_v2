import type { ReactNode } from 'react';

export function CustomizerPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="ui:flex ui:h-full ui:flex-col ui:p-4 ui:text-left ui:md:p-6">
      <header className="ui:mb-4">
        <h2 className="ui:text-lg ui:font-semibold ui:text-[#353535]">
          {title}
        </h2>
        {description ? (
          <p className="ui:mt-1 ui:text-sm ui:text-[#5d5d5d]">{description}</p>
        ) : null}
      </header>
      <div className="ui:min-h-0 ui:flex-1">{children}</div>
    </div>
  );
}
