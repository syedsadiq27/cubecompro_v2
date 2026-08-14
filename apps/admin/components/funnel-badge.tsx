import { FUNNEL, FUNNEL_TONE, type FunnelId } from '@/lib/funnel';

export function FunnelBadge({ status }: { status: FunnelId }) {
  const label = FUNNEL.find((stage) => stage.id === status)?.label ?? status;
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${FUNNEL_TONE[status]}`}
    >
      {label}
    </span>
  );
}
