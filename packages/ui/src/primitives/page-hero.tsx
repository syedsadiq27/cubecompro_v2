import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container } from './container';
import { Stack } from './stack';

export type PageHeroLayout = 'solo' | 'split' | 'splitFeature';
export type PageHeroDensity = 'default' | 'roomy';

function pageHeroShellClass(
  layout: PageHeroLayout,
  density: PageHeroDensity
): string {
  if (layout === 'solo') {
    return 'ui:py-14 ui:md:py-20';
  }

  return cn(
    'ui:grid ui:lg:items-center',
    density === 'default' && 'ui:py-10 ui:md:py-16 ui:lg:py-20',
    density === 'roomy' && 'ui:py-14 ui:md:py-16 ui:lg:py-20',
    layout === 'split' &&
      'ui:gap-8 ui:md:gap-10 ui:lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] ui:lg:gap-14',
    layout === 'splitFeature' &&
      'ui:gap-8 ui:md:gap-10 ui:lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] ui:lg:gap-14'
  );
}

function PageHeroRoot({
  layout = 'solo',
  density = 'default',
  className,
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  layout?: PageHeroLayout;
  density?: PageHeroDensity;
}) {
  return (
    <section
      data-page-hero=""
      className={cn(
        'ui:relative ui:overflow-hidden ui:border-b ui:border-[var(--line)] ui:bg-[var(--canvas)]',
        className
      )}
      {...props}
    >
      <div
        className="ui:pointer-events-none ui:absolute ui:inset-0 ui:opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 16% 18%, rgba(102,92,255,0.08), transparent 40%)',
        }}
      />
      <Container
        className={cn('ui:relative', pageHeroShellClass(layout, density))}
      >
        {children}
      </Container>
    </section>
  );
}

function PageHeroCopy({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('ui-rise', className)} {...props}>
      {children}
    </div>
  );
}

function PageHeroVisual({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('ui-rise ui:min-w-0', className)}
      style={{ animationDelay: '120ms' }}
      {...props}
    >
      {children}
    </div>
  );
}

function PageHeroActions({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <Stack
      direction="row"
      gap="sm"
      wrap
      className={cn('ui:mt-6 ui:md:mt-8', className)}
      {...props}
    >
      {children}
    </Stack>
  );
}

export const PageHero = Object.assign(PageHeroRoot, {
  Copy: PageHeroCopy,
  Visual: PageHeroVisual,
  Actions: PageHeroActions,
});
