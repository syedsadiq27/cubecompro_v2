import Link from 'next/link';
import { Grid, Typography } from '@repo/ui';
import { SOLUTION_PATHS } from '@/lib/solutions';

const SURFACE_NUMS = [
  '01 / RULES ENGINE',
  '02 / 3D SCENE',
  '03 / HEADLESS STACK',
  '04 / CONFIG API',
];

export function SolutionPathCards() {
  return (
    <Grid cols="sm-2-lg-4" gap="xl">
      {SOLUTION_PATHS.map((path, index) => (
        <Link
          key={path.href}
          href={path.href}
          className="group relative flex flex-col justify-between border-t border-[var(--line)] pt-6 transition duration-200 hover:border-[var(--stage-violet)]"
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[var(--stage-violet)] opacity-70 transition group-hover:opacity-100"
                aria-hidden
              />
              <Typography variant="mono" tone="accent">
                {SURFACE_NUMS[index]}
              </Typography>
            </div>

            <Typography
              as="p"
              variant="titleLg"
              className="mt-3 text-[clamp(1.2rem,1.8vw,1.45rem)] transition group-hover:text-[var(--stage-violet)]"
            >
              {path.title}
            </Typography>

            <Typography variant="support" className="mt-2.5 md:text-[15px]">
              {path.claim}
            </Typography>
          </div>

          <Typography
            as="span"
            variant="bodyStrong"
            className="mt-6 inline-flex items-center gap-1.5 transition group-hover:text-[var(--stage-violet)] group-hover:underline group-hover:underline-offset-4"
          >
            Explore {path.label.toLowerCase()}
            <Typography
              as="span"
              variant="bodyStrong"
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </Typography>
          </Typography>
        </Link>
      ))}
    </Grid>
  );
}
