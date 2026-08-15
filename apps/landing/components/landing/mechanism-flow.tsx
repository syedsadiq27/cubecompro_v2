import { List, ListItem, Typography } from '@repo/ui';

type Step = {
  label: string;
  detail: string;
  accent?: boolean;
};

const STEPS: Step[] = [
  {
    label: 'Choice',
    detail: 'Shopper intent & parameter inputs',
  },
  {
    label: 'Valid State',
    detail: 'Constraint rules & singular truth',
    accent: true,
  },
  {
    label: 'Commerce',
    detail: 'Deterministic SKU, price & cart',
  },
];

export function MechanismFlow() {
  return (
    <List
      as="ol"
      direction="col"
      gap="sm"
      className="w-full md:flex-row md:items-stretch md:gap-0"
    >
      {STEPS.map((step, index) => (
        <ListItem
          key={step.label}
          className={`flex flex-col md:flex-row md:items-stretch ${
            step.accent ? 'md:flex-[1.4]' : 'md:flex-1'
          }`}
        >
          <div
            className={`relative flex h-full min-h-[13.5rem] flex-1 flex-col justify-between rounded-2xl border px-7 py-8 md:px-8 md:py-9 ${
              step.accent
                ? 'border-[var(--stage-violet)] bg-[var(--stage-violet)]/25 shadow-[0_0_32px_-8px_rgba(102,92,255,0.4)]'
                : 'border-white/12 bg-white/[0.04]'
            }`}
          >
            {step.accent ? (
              <span
                className="absolute inset-x-8 top-0 h-[2px] bg-[var(--stage-violet-light)] shadow-[0_0_12px_var(--stage-violet-light)]"
                aria-hidden
              />
            ) : null}

            <div>
              <Typography
                variant="mono"
                tone={step.accent ? 'accent' : 'inverse'}
                className={
                  step.accent
                    ? 'text-[var(--stage-violet-light)]'
                    : undefined
                }
              >
                0{index + 1}
              </Typography>
              <Typography
                as="p"
                variant="titleLg"
                tone="inverse"
                className={`mt-4 tracking-tight ${
                  step.accent
                    ? 'text-[clamp(1.9rem,3.4vw,2.5rem)] leading-[1.05]'
                    : 'text-[clamp(1.4rem,2.4vw,1.8rem)] leading-[1.1] text-white/90'
                }`}
              >
                {step.label}
              </Typography>
            </div>

            <Typography
              variant="support"
              tone="inverse"
              className={`mt-6 ${
                step.accent ? 'font-medium text-white/85' : 'text-white/50'
              }`}
            >
              {step.detail}
            </Typography>
          </div>

          {index < STEPS.length - 1 ? (
            <div
              className="flex items-center justify-center py-1 md:w-8 md:shrink-0"
              aria-hidden
            >
              <span className="h-6 w-[2px] bg-[var(--stage-violet)]/80 md:hidden" />
              <span className="hidden h-[2px] w-6 bg-[var(--stage-violet)]/80 md:block" />
            </div>
          ) : null}
        </ListItem>
      ))}
    </List>
  );
}
