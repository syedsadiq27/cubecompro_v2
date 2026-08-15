import { List, ListItem, Section, Typography } from '@repo/ui';

export type MechanismStep = {
  label: string;
  detail: string;
  accent?: boolean;
};

export function SignatureMechanism({
  eyebrow = 'Core Mechanism',
  title = 'One configuration runtime. Deterministic commerce output.',
  description,
  steps,
  children,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: MechanismStep[];
  children?: React.ReactNode;
}) {
  return (
    <Section id="mechanism" tone="ink" spacing="default" className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(102,92,255,0.18)_0%,transparent_70%)]"
        aria-hidden
      />

      <Section.Header
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <Section.Body gap="lg">
        {steps && steps.length > 0 ? (
          <List
            as="ol"
            direction="col"
            gap="sm"
            className="w-full md:flex-row md:items-stretch md:gap-0"
          >
            {steps.map((step, index) => (
              <ListItem
                key={step.label}
                className={`flex flex-col md:flex-row md:items-stretch ${
                  step.accent ? 'md:flex-[1.3]' : 'md:flex-1'
                }`}
              >
                <div
                  className={`relative flex h-full min-h-[12.5rem] flex-1 flex-col justify-between rounded-2xl border px-6 py-7 md:px-8 md:py-8 ${
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
                          ? 'text-[clamp(1.7rem,3vw,2.2rem)] leading-[1.05]'
                          : 'text-[clamp(1.3rem,2.2vw,1.6rem)] leading-[1.1] text-white/90'
                      }`}
                    >
                      {step.label}
                    </Typography>
                  </div>

                  <Typography
                    variant="support"
                    tone="inverse"
                    className={`mt-5 ${
                      step.accent ? 'font-medium text-white/85' : 'text-white/50'
                    }`}
                  >
                    {step.detail}
                  </Typography>
                </div>

                {index < steps.length - 1 ? (
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
        ) : null}

        {children}
      </Section.Body>
    </Section>
  );
}
