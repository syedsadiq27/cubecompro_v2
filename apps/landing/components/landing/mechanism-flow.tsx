import { Typography } from '@repo/ui';

const CHOICE = ['Fabric', 'Size', 'Legs'] as const;
const RULES = ['Compatibility', 'Availability', 'Exclusions'] as const;

function InputPanel({
  label,
  items,
}: {
  label: string;
  items: readonly string[];
}) {
  return (
    <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--surface-pure)] px-3.5 py-3 md:px-4 md:py-3.5">
      <Typography variant="mono">{label}</Typography>
      <ul className="mt-2 space-y-1">
        {items.map((item) => (
          <li
            key={item}
            className="text-[15px] tracking-tight text-[var(--ink)] md:text-[16px]"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 550 }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OutputPanel({
  label,
  title,
  detail,
}: {
  label: string;
  title: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--line)] border-t-[2.5px] border-t-[var(--ink)] bg-[var(--surface)] px-4 py-4 md:px-5">
      <Typography variant="mono" tone="secondary">
        {label}
      </Typography>
      <Typography variant="titleSm" tone="strong" className="mt-2">
        {title}
      </Typography>
      <Typography variant="meta" className="mt-1.5">
        {detail}
      </Typography>
    </div>
  );
}

export function MechanismFlow() {
  return (
    <div className="mx-auto w-full max-w-[820px]">
      <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-3 md:gap-4">
        <InputPanel label="Choice" items={CHOICE} />
        <InputPanel label="Rules" items={RULES} />
      </div>

      <div className="flex justify-center py-0.5" aria-hidden>
        <svg
          className="h-6 w-[140px] text-[var(--border-strong)] md:w-[180px]"
          viewBox="0 0 180 24"
          fill="none"
        >
          <path
            d="M30 2 L90 18 L150 2 M90 18 V24"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mx-auto w-full max-w-[300px] rounded-2xl bg-[var(--ink)] px-5 py-4 text-center text-white md:max-w-[320px] md:py-5">
        <p
          className="text-[clamp(1.2rem,2.2vw,1.4rem)] font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Valid State
        </p>
        <Typography variant="support" className="mt-1.5 text-white/55">
          Beige · 3-seat · Brass
        </Typography>
        <span className="mt-3 inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] tracking-wide text-white/75">
          ✓ sellable
        </span>
      </div>

      <div className="flex justify-center py-0.5" aria-hidden>
        <svg
          className="h-6 w-[160px] text-[var(--border-strong)] md:w-[200px]"
          viewBox="0 0 200 24"
          fill="none"
        >
          <path
            d="M100 0 V8 M100 8 H36 V22 M100 8 H164 V22"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-3 md:gap-4">
        <OutputPanel
          label="Visual state"
          title="Scene + UI"
          detail="material · geometry · visibility"
        />
        <OutputPanel
          label="Commerce state"
          title="SKU · Price · Inventory · Cart"
          detail="sellable identity"
        />
      </div>
    </div>
  );
}
