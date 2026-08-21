'use client';

type ChoiceValueOption = {
  key: string;
  name: string;
  disabled?: boolean;
};

export function ChoiceValueSelect({
  label,
  value,
  options,
  onChange,
  className = '',
  compact = false,
}: {
  label?: string;
  value: string;
  options: ChoiceValueOption[];
  onChange: (valueKey: string) => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label ? (
        <span className="mb-1 block text-[10px] font-medium leading-none text-white/40">
          {label}
        </span>
      ) : null}
      <div className="relative">
        <select
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            if (!next) return;
            onChange(next);
          }}
          className={`w-full appearance-none rounded-xl border border-white/10 bg-[#181920] text-[12px] font-medium text-white outline-none transition-colors hover:border-white/20 focus:border-[#665CFF]/60 ${
            compact ? 'h-8 py-0 pl-2.5 pr-7' : 'h-9 py-0 pl-3 pr-8'
          }`}
        >
          {options.length === 0 ? (
            <option value="" disabled>
              No values
            </option>
          ) : null}
          {options.map((option) => (
            <option
              key={option.key}
              value={option.key}
              disabled={option.disabled}
              className="bg-[#181920] text-white"
            >
              {option.name}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/40"
        >
          ▾
        </span>
      </div>
    </label>
  );
}
