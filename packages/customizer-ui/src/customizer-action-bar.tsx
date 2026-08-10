'use client';

import type { ReactNode } from 'react';

export function CustomizerActionBar({
  product,
  progress,
  price,
  priceHint,
  action,
}: {
  product?: ReactNode;
  progress?: ReactNode;
  price?: ReactNode;
  priceHint?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="ui:border-b ui:border-white/10 ui:bg-[#111110] ui:px-4 ui:py-3 ui:md:px-6 ui:md:py-3.5">
      <div className="ui:flex ui:items-center ui:gap-3 ui:md:gap-6">
        <div className="ui:min-w-0 ui:shrink-0 ui:md:w-[12rem]">{product}</div>

        <div className="ui:hidden ui:min-w-0 ui:flex-1 ui:md:block">{progress}</div>

        <div className="ui:ml-auto ui:flex ui:min-w-0 ui:items-center ui:gap-3 ui:md:gap-5">
          <div className="ui:min-w-0 ui:text-right">
            {price}
            {priceHint}
          </div>
          {action}
        </div>
      </div>

      <div className="ui:mt-3 ui:md:hidden">{progress}</div>
    </header>
  );
}

export function CustomizerPrice({ value = '—' }: { value?: string }) {
  return (
    <p className="ui:text-base ui:leading-none ui:font-semibold ui:tracking-tight ui:text-white ui:md:text-xl">
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
      className="ui:inline-flex ui:h-10 ui:min-w-[7.5rem] ui:shrink-0 ui:items-center ui:justify-center ui:rounded-full ui:bg-white ui:px-5 ui:text-sm ui:font-semibold ui:tracking-tight ui:text-[#111110] ui:transition-opacity ui:disabled:cursor-not-allowed ui:disabled:opacity-35 ui:hover:opacity-90 ui:md:h-11 ui:md:min-w-[9rem] ui:md:px-6"
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
      className="ui:inline-flex ui:h-10 ui:shrink-0 ui:items-center ui:justify-center ui:rounded-full ui:border ui:border-white/20 ui:bg-transparent ui:px-4 ui:text-sm ui:font-medium ui:text-white/80 ui:transition-colors ui:disabled:cursor-not-allowed ui:disabled:opacity-35 ui:hover:border-white/35 ui:hover:text-white ui:md:h-11 ui:md:px-5"
    >
      {children}
    </button>
  );
}
