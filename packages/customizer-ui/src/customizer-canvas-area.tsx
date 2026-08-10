import type { ReactNode } from 'react';

export function CustomizerCanvasArea({
  children,
  controls,
  overlay,
  hint,
}: {
  children: ReactNode;
  controls?: ReactNode;
  overlay?: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <div className="ui:relative ui:h-full ui:w-full ui:bg-[radial-gradient(ellipse_at_50%_42%,#4a4641_0%,#2f2d2a_58%,#242220_100%)]">
      <div className="ui:relative ui:h-full ui:w-full">{children}</div>
      {overlay ? (
        <div className="ui:pointer-events-none ui:absolute ui:inset-0 ui:z-10">
          {overlay}
        </div>
      ) : null}
      {hint ? (
        <div className="ui:pointer-events-none ui:absolute ui:inset-x-0 ui:bottom-4 ui:z-20 ui:flex ui:justify-center ui:md:hidden">
          {hint}
        </div>
      ) : null}
      {controls ? (
        <div className="ui:absolute ui:bottom-6 ui:left-5 ui:z-20 ui:hidden ui:md:bottom-8 ui:md:left-7 ui:md:block">
          {controls}
        </div>
      ) : null}
    </div>
  );
}
