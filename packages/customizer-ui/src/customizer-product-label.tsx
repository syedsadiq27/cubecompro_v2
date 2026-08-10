import type { ReactNode } from 'react';

export function CustomizerProductLabel({
  title,
  meta,
}: {
  title?: string;
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="ui:min-w-0">
      {title ? (
        <p className="ui:truncate ui:text-sm ui:font-semibold ui:tracking-tight ui:text-white/95 ui:md:text-base">
          {title}
        </p>
      ) : null}
      {meta ? (
        <p className="ui:mt-0.5 ui:truncate ui:text-[0.6875rem] ui:tracking-wide ui:text-white/45">
          {meta}
        </p>
      ) : null}
    </div>
  );
}
