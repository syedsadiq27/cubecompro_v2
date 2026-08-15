import { Grid, List, ListItem, Typography } from '@repo/ui';

export function SolutionFlow({
  steps,
  outputs,
}: {
  steps: string[];
  outputs?: string[];
}) {
  return (
    <div>
      <List
        as="ol"
        direction="col"
        gap="none"
        className="md:flex-row md:flex-wrap md:items-center md:gap-2"
      >
        {steps.map((step, index) => (
          <ListItem
            key={step}
            className="flex flex-col items-center md:flex-row md:gap-2"
          >
            <Typography
              as="div"
              variant="bodyStrong"
              tone="inverse"
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center md:w-auto md:min-w-[8rem]"
            >
              {step}
            </Typography>
            {index < steps.length - 1 ? (
              <Typography
                as="span"
                variant="meta"
                tone="inverse"
                className="py-1.5 text-white/40 md:py-0"
                aria-hidden
              >
                <Typography as="span" variant="meta" className="md:hidden">
                  ↓
                </Typography>
                <Typography as="span" variant="meta" className="hidden md:inline">
                  →
                </Typography>
              </Typography>
            ) : null}
          </ListItem>
        ))}
      </List>
      {outputs?.length ? (
        <Grid cols={2} gap="xs" className="mt-5 sm:grid-cols-4">
          {outputs.map((item) => (
            <Typography
              key={item}
              as="div"
              variant="mono"
              tone="inverse"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-center text-white/75"
            >
              {item}
            </Typography>
          ))}
        </Grid>
      ) : null}
    </div>
  );
}
