import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Container } from './container';

export type PageHeroLayout = 'solo' | 'split' | 'splitFeature';
export type PageHeroDensity = 'default' | 'roomy';

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
            'radial-gradient(circle at 16% 18%, rgba(95,87,247,0.08), transparent 40%)',
        }}
      />
      <Container
        className={cn(
          'ui:relative',
          layout === 'solo' && 'ui:py-14 ui:md:py-20',
          layout !== 'solo' &&
            density === 'default' &&
            'ui:grid ui:gap-9 ui:py-10 ui:md:gap-10 ui:md:py-16 ui:lg:items-center ui:lg:gap-14 ui:lg:py-20',
          layout !== 'solo' &&
            density === 'roomy' &&
            'ui:grid ui:gap-9 ui:py-14 ui:md:gap-10 ui:md:py-16 ui:lg:items-center ui:lg:gap-14 ui:lg:py-20',
          layout === 'split' &&
            'ui:lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]',
          layout === 'splitFeature' &&
            'ui:lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.22fr)] ui:lg:gap-12'
        )}
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
    <div className={cn('landing-rise', className)} {...props}>
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
      className={cn('landing-rise ui:min-w-0', className)}
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
    <div
      className={cn(
        'ui:mt-6 ui:flex ui:flex-wrap ui:gap-3 ui:md:mt-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const PageHero = Object.assign(PageHeroRoot, {
  Copy: PageHeroCopy,
  Visual: PageHeroVisual,
  Actions: PageHeroActions,
});
