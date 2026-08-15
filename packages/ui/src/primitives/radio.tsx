'use client';

import {
  createContext,
  useContext,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value,
  onChange,
  disabled,
  children,
  className,
  legend,
}: {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
  legend?: ReactNode;
}) {
  return (
    <fieldset disabled={disabled} className={cn('ui:min-w-0', className)}>
      {legend ? (
        <legend className="ui:mb-2 ui:text-[12px] ui:font-medium ui:text-[var(--ink)]">
          {legend}
        </legend>
      ) : null}
      <RadioGroupContext.Provider value={{ name, value, onChange, disabled }}>
        <div className="ui:flex ui:flex-col ui:gap-2">{children}</div>
      </RadioGroupContext.Provider>
    </fieldset>
  );
}

export function Radio({
  value,
  label,
  description,
  className,
  id,
  name: nameProp,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> & {
  value: string;
  label: ReactNode;
  description?: ReactNode;
}) {
  const ctx = useContext(RadioGroupContext);
  const name = ctx?.name ?? nameProp;
  const checked = ctx ? ctx.value === value : props.checked;
  const inputId = id ?? (name ? `${name}-${value}` : undefined);

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'ui:flex ui:cursor-pointer ui:items-start ui:gap-3 ui:rounded-[7px] ui:border ui:border-[var(--line)] ui:p-3 ui:transition-colors',
        checked
          ? 'ui:border-[var(--ink)] ui:bg-[var(--canvas)]/60'
          : 'ui:hover:bg-[var(--canvas)]/30',
        className
      )}
    >
      <input
        {...props}
        id={inputId}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={ctx?.disabled || props.disabled}
        onChange={() => ctx?.onChange?.(value)}
        className="ui:mt-0.5 ui:h-4 ui:w-4 ui:accent-[var(--ink)] ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--brand)]"
      />
      <span className="ui:min-w-0">
        <span className="ui:block ui:text-[13px] ui:font-semibold ui:text-[var(--ink)]">
          {label}
        </span>
        {description ? (
          <span className="ui:mt-0.5 ui:block ui:text-[11px] ui:text-[var(--text-muted)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
