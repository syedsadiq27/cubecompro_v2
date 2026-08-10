'use client';

import { useEffect, useRef, useState } from 'react';

export type CustomizerStep = {
  id: string;
  label: string;
  active?: boolean;
  index?: number;
};

export function CustomizerStepper({
  steps,
  onSelect,
}: {
  steps: CustomizerStep[];
  onSelect?: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const activeStep = steps.find((step) => step.active) ?? steps[0];

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  return (
    <>
      <nav
        aria-label="Customization steps"
        className="ui:relative ui:hidden ui:max-w-[5rem] ui:w-full ui:overflow-auto ui:bg-white ui:shadow-[0px_0px_6px_#98989829] ui:md:flex ui:md:flex-col"
      >
        {steps.map((step, index) => {
          const active = Boolean(step.active);
          return (
            <button
              key={step.id}
              type="button"
              aria-current={active ? 'step' : undefined}
              onClick={() => onSelect?.(step.id)}
              className={[
                'ui:group ui:relative ui:flex ui:h-[4.5rem] ui:w-full ui:flex-col ui:items-center ui:justify-center ui:gap-y-2 ui:p-2.5 ui:py-[1.0938rem] ui:2xl:h-20',
                active
                  ? 'ui:bg-[#e11a38] ui:text-white'
                  : 'ui:bg-white ui:text-[#786e6e] ui:hover:bg-[#e11a38] ui:hover:text-white',
              ].join(' ')}
            >
              <span
                className={[
                  'ui:absolute ui:top-[3px] ui:left-[3px] ui:flex ui:h-[0.85rem] ui:w-[0.85rem] ui:items-center ui:justify-center ui:text-[0.6875rem] ui:font-bold',
                  active
                    ? 'ui:bg-[#f2f1ee] ui:text-[#786e6e]'
                    : 'ui:bg-[#e11a38] ui:text-white',
                ].join(' ')}
              >
                {step.index ?? index + 1}
              </span>
              <span className="ui:text-[0.6875rem] ui:leading-[1.0313rem] ui:font-bold ui:uppercase">
                {step.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div
        ref={menuRef}
        className="ui:absolute ui:right-[1.0625rem] ui:bottom-[4.75rem] ui:z-[9] ui:md:hidden"
      >
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="ui:flex ui:w-[12rem] ui:items-center ui:justify-between ui:bg-[#e11a38] ui:p-[0.875rem] ui:text-sm ui:font-bold ui:text-white ui:shadow-[0px_0px_6px_rgba(0,0,0,0.49)]"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="ui:uppercase">{activeStep?.label ?? 'Menu'}</span>
          <span aria-hidden="true">▾</span>
        </button>
        {isOpen ? (
          <ul
            role="listbox"
            className="ui:absolute ui:right-0 ui:bottom-full ui:mb-2 ui:w-[16.875rem] ui:bg-white ui:pb-[0.625rem] ui:shadow-[0px_0px_6px_rgba(0,0,0,0.16)]"
          >
            {steps.map((step) => {
              const active = Boolean(step.active);
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onSelect?.(step.id);
                      setIsOpen(false);
                    }}
                    className={[
                      'ui:flex ui:w-full ui:items-center ui:gap-[1.5625rem] ui:border-b ui:border-[#E0E0E0] ui:px-[1.25rem] ui:py-[0.8438rem] ui:text-left ui:last:border-b-0',
                      active
                        ? 'ui:bg-[#e11a38] ui:text-white'
                        : 'ui:bg-white ui:text-[#786e6e] ui:hover:bg-[#FCE8EB]',
                    ].join(' ')}
                  >
                    <span className="ui:text-[0.9375rem] ui:leading-[1.25rem] ui:font-bold ui:uppercase">
                      {step.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </>
  );
}
