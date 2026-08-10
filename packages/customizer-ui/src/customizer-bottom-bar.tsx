'use client';

import type { ReactNode } from 'react';

export function CustomizerBottomBar({
  progress,
  price,
  priceHint,
  action,
}: {
  progress?: ReactNode;
  price?: ReactNode;
  priceHint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <footer className="ui:border-t ui:border-white/10 ui:bg-[#111110] ui:px-4 ui:py-3 ui:md:px-7 ui:md:py-4">
      <div className="ui:flex ui:items-center ui:justify-between ui:gap-4">
        {progress ? (
          <div className="ui:hidden ui:min-w-0 ui:flex-1 ui:md:block">
            {progress}
          </div>
        ) : (
          <div className="ui:hidden ui:flex-1 ui:md:block" />
        )}
        <div className="ui:flex ui:min-w-0 ui:flex-1 ui:items-center ui:justify-between ui:gap-4 ui:md:flex-none ui:md:justify-end ui:md:gap-6">
          <div className="ui:min-w-0 ui:text-left ui:md:text-right">
            {price}
            {priceHint}
          </div>
          {action}
        </div>
      </div>
    </footer>
  );
}

export function CustomizerPrice({ value = '—' }: { value?: string }) {
  return (
    <p className="ui:text-[1.375rem] ui:leading-none ui:font-semibold ui:tracking-tight ui:text-white ui:md:text-[1.75rem]">
      {value}
    </p>
  );
}

export function CustomizerContinueButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="ui:inline-flex ui:h-12 ui:min-w-[8.5rem] ui:shrink-0 ui:items-center ui:justify-center ui:rounded-full ui:bg-white ui:px-6 ui:text-sm ui:font-semibold ui:tracking-tight ui:text-[#111110] ui:transition-opacity ui:disabled:cursor-not-allowed ui:disabled:opacity-35 ui:hover:opacity-90 ui:md:h-16 ui:md:min-w-[11rem] ui:md:px-8 ui:md:text-base"
    >
      {children}
    </button>
  );
}

export function CustomizerBackButton({
  children = 'Back',
  onClick,
  disabled,
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="ui:inline-flex ui:h-12 ui:shrink-0 ui:items-center ui:justify-center ui:rounded-full ui:border ui:border-white/20 ui:bg-transparent ui:px-5 ui:text-sm ui:font-medium ui:text-white/80 ui:transition-colors ui:disabled:cursor-not-allowed ui:disabled:opacity-35 ui:hover:border-white/35 ui:hover:text-white ui:md:h-16 ui:md:px-6"
    >
      {children}
    </button>
  );
}
