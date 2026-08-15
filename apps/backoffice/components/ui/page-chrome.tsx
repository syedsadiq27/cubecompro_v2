import { Heading, Typography } from '@repo/ui';
import { HeaderActions } from '@/components/ui/header-actions';
import type { ActionMenuItem } from '@/components/ui/action-menu';

export function PageChrome({
  children,
  title,
  description,
  meta,
  actions,
  primaryAction,
  secondaryAction,
  overflow,
  toolbar,
  flush = false,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  overflow?: ActionMenuItem[];
  toolbar?: React.ReactNode;
  flush?: boolean;
}) {
  const resolvedActions =
    actions ??
    (primaryAction || secondaryAction || overflow ? (
      <HeaderActions
        primary={primaryAction}
        secondary={secondaryAction}
        overflow={overflow}
      />
    ) : null);

  const hasHeader = Boolean(title || description || meta || resolvedActions);

  return (
    <div
      data-fill-page
      className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]"
    >
      {hasHeader ? (
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2">
          <div className="min-w-0">
            {title ? (
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <Heading
                  as="h1"
                  variant="section"
                  className="text-[15px] md:text-[15px]"
                >
                  {title}
                </Heading>
                {meta ? (
                  typeof meta === 'string' || typeof meta === 'number' ? (
                    <Typography as="span" variant="meta">
                      {meta}
                    </Typography>
                  ) : (
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {meta}
                    </span>
                  )
                ) : null}
              </div>
            ) : null}
            {description ? (
              <Typography variant="meta" className="mt-0.5">
                {description}
              </Typography>
            ) : null}
          </div>
          {resolvedActions ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {resolvedActions}
            </div>
          ) : null}
        </div>
      ) : null}
      {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
      <div
        className={
          flush
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'min-h-0 flex-1 overflow-y-auto px-3 py-2.5'
        }
      >
        {children}
      </div>
    </div>
  );
}
