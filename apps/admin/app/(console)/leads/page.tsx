import { LeadsView } from '@/components/leads/leads-view';
import { loadLeads } from '@/lib/leads';

export default async function LeadsPage() {
  const result = await loadLeads();

  return <LeadsView leads={result.rows} sheetUrl={result.sheetUrl} />;
}
