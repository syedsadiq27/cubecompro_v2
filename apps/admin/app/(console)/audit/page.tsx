import { loadAudit } from '@/lib/api';
import { AuditView } from '@/components/audit/audit-view';
import type { AuditEvent } from '@/lib/types';

export default async function AuditPage() {
  let auditEvents: AuditEvent[] = [];
  try {
    auditEvents = await loadAudit();
  } catch {
    auditEvents = [];
  }

  return <AuditView events={auditEvents} />;
}
