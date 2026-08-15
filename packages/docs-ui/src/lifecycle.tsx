import { Children, type ReactNode } from 'react';

type LifecycleStepProps = {
  children: ReactNode;
  note?: string;
};

export function LifecycleStep({ children, note }: LifecycleStepProps) {
  return (
    <li className="flex min-w-0 flex-col gap-1">
      <span className="font-mono text-sm font-semibold tracking-tight text-fd-foreground">
        {children}
      </span>
      {note ? (
        <span className="text-xs text-fd-muted-foreground">{note}</span>
      ) : null}
    </li>
  );
}

type LifecycleProps = {
  children: ReactNode;
};

function LifecycleRoot({ children }: LifecycleProps) {
  const items = Children.toArray(children);
  return (
    <ol className="my-4 flex list-none flex-wrap items-start gap-x-3 gap-y-4 p-0 not-prose">
      {items.map((child, index) => (
        <span key={index} className="contents">
          {child}
          {index < items.length - 1 ? (
            <li
              aria-hidden
              className="flex h-6 items-center text-fd-muted-foreground"
            >
              →
            </li>
          ) : null}
        </span>
      ))}
    </ol>
  );
}

export const Lifecycle = Object.assign(LifecycleRoot, {
  Step: LifecycleStep,
});
