import { FUNNEL } from './funnel';

export async function syncLeadStatusToSheet(input: {
  email: string;
  submittedAt: string;
  status: string;
}) {
  const url = process.env.GOOGLE_LEADS_SYNC_URL?.trim();
  if (!url) return;

  const label =
    FUNNEL.find((stage) => stage.id === input.status)?.label ?? input.status;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: input.email,
      submittedAt: input.submittedAt,
      status: label,
      secret: process.env.GOOGLE_LEADS_SYNC_SECRET ?? '',
    }),
  });

  if (!response.ok) {
    throw new Error(`Sheet sync failed (${response.status})`);
  }
}
