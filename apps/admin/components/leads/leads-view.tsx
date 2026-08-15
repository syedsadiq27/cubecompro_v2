'use client';

import Link from 'next/link';
import { Button, DataTable, PageHeader, StatusBadge } from '@repo/ui';
import type { LeadRow } from '@/lib/leads';

export function LeadsView({
  leads,
  sheetUrl,
}: {
  leads: LeadRow[];
  sheetUrl?: string | null;
}) {
  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Leads Pipeline"
          count={leads.length}
          description="Live commercial inbound inquiries, prospective pilots, and tenant conversion pipeline."
          action={
            sheetUrl ? (
              <Button
                as="a"
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                size="sm"
                variant="secondary"
              >
                Open Google Sheet ↗
              </Button>
            ) : null
          }
        />

        <div className="p-6 space-y-4">
          <DataTable.Root>
            <DataTable.Header>
              <tr>
                <DataTable.Head>COMPANY / CONTACT</DataTable.Head>
                <DataTable.Head>EMAIL</DataTable.Head>
                <DataTable.Head>INTEREST</DataTable.Head>
                <DataTable.Head>STATUS</DataTable.Head>
                <DataTable.Head className="text-right">ACTIONS</DataTable.Head>
              </tr>
            </DataTable.Header>
            <DataTable.Body>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <DataTable.Row key={`${lead.email}-${lead.timestamp}`}>
                    <DataTable.IdentityCell
                      title={lead.company || lead.name || 'Lead'}
                      subtitle={lead.name}
                    />
                    <DataTable.Cell className="font-mono text-[11px] text-[var(--text-secondary)]">
                      {lead.email}
                    </DataTable.Cell>
                    <DataTable.Cell className="text-[11px] text-[var(--text-secondary)]">
                      {lead.interest || lead.message || 'General Inbound'}
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <StatusBadge role="info" label={lead.status} />
                    </DataTable.Cell>
                    <DataTable.ActionsCell>
                      <Button
                        as={Link}
                        href={`/organizations/new?name=${encodeURIComponent(lead.company || lead.name || '')}&email=${encodeURIComponent(lead.email)}`}
                        size="sm"
                        variant="secondary"
                        className="ui:text-[11px]"
                      >
                        Convert to tenant
                      </Button>
                    </DataTable.ActionsCell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell
                    colSpan={5}
                    className="p-6 text-center text-[var(--text-muted)]"
                  >
                    No inbound leads found.
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable.Body>
          </DataTable.Root>
        </div>
      </div>
    </div>
  );
}
