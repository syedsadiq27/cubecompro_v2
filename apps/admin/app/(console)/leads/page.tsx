import { LeadsBoard } from '@/components/leads-board';
import { LeadsEmbed } from '@/components/leads-embed';
import { PageHeader } from '@/components/page-header';
import { Panel } from '@/components/panel';
import { loadLeadFunnel } from '@/lib/api';
import { loadLeads, mergeFunnel } from '@/lib/leads';

export default async function LeadsPage() {
  const leads = await loadLeads();
  const saved = leads.rows.length > 0 ? await loadLeadFunnel() : [];
  const rows = mergeFunnel(leads.rows, saved);

  return (
    <>
      <PageHeader
        title="Leads"
        description="Inbound from the landing form. Status saves in Admin; the sheet updates if sync is connected."
        action={
          leads.sheetUrl
            ? { href: leads.sheetUrl, label: 'Open sheet' }
            : undefined
        }
      />

      {!leads.configured ? (
        <Panel title="Connect the response sheet">
          <ol className="list-decimal space-y-2 pl-5 text-[13px] text-[var(--ink)]">
            <li>Open the CubeCom Google Form → Responses → Link to Sheets.</li>
            <li>
              Share the sheet as Anyone with the link: Viewer, or File → Share
              → Publish to web → CSV.
            </li>
            <li>
              Set <code className="font-mono text-[12px]">GOOGLE_LEADS_SHEET_ID</code>{' '}
              in <code className="font-mono text-[12px]">apps/admin/.env</code>.
            </li>
          </ol>
        </Panel>
      ) : null}

      {rows.length > 0 ? <LeadsBoard rows={rows} /> : null}

      {leads.configured && rows.length === 0 && leads.embedUrl ? (
        <div className="space-y-3">
          {leads.error ? <p className="type-meta">{leads.error}</p> : null}
          <LeadsEmbed src={leads.embedUrl} />
        </div>
      ) : null}

      {leads.configured && rows.length === 0 && !leads.embedUrl ? (
        <p className="type-meta">No leads yet, or the sheet could not be read.</p>
      ) : null}
    </>
  );
}
