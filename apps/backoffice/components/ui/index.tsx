import { Panel as UiPanel, Typography } from '@repo/ui';

export { EmptyState } from '@/components/ui/empty-state';
export { HeaderActions } from '@/components/ui/header-actions';
export { ActionMenu } from '@/components/ui/action-menu';
export type { ActionMenuItem } from '@/components/ui/action-menu';
export {
  OpsTable,
  OpsThead,
  OpsTh,
  OpsTd,
  OpsRow,
  OpsIdentity,
  OpsActionsCell,
} from '@/components/ui/ops-table';
export { BulkToolbar } from '@/components/ui/bulk-toolbar';
export { SkeletonRows, SkeletonFields } from '@/components/ui/skeleton';
export { InlineFeedback, ToastCopy } from '@/components/ui/feedback';
export {
  confirmDeleteCopy,
  confirmDisconnectCopy,
  confirmDiscardCopy,
} from '@/components/ui/confirm-copy';

export function ErrorState({ message }: { message: string }) {
  return (
    <UiPanel className="border-[var(--danger)]/25 bg-[var(--danger-soft)]">
      <Typography variant="support" className="text-[var(--danger)]">
        {message}
      </Typography>
    </UiPanel>
  );
}
