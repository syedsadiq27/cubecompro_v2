import { normalizeFunnel, type FunnelId } from './funnel';

export type LeadRow = {
  timestamp: string;
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  sheetStatus: string;
  status: FunnelId;
};

export type LeadsResult = {
  rows: LeadRow[];
  embedUrl: string | null;
  sheetUrl: string | null;
  configured: boolean;
  error?: string;
};

function sheetIdFrom(value: string) {
  const fromUrl = value.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (fromUrl) return fromUrl[1];
  if (/^[a-zA-Z0-9-_]{20,}$/.test(value)) return value;
  return null;
}

function gidFrom(value: string) {
  const match = value.match(/[?&#]gid=(\d+)/);
  return match?.[1] ?? null;
}

const DEFAULT_SHEET_ID = '1VtnQhBi87Ha04TvB3x4NZqVL0vgF76BzCY_FS_XhBEg';
const DEFAULT_SHEET_GID = '1100356470';

export function leadsConfig() {
  const csv = process.env.GOOGLE_LEADS_CSV_URL?.trim() || '';
  const embed = process.env.GOOGLE_LEADS_EMBED_URL?.trim() || '';
  const raw =
    process.env.GOOGLE_LEADS_SHEET_ID?.trim() || DEFAULT_SHEET_ID;
  const gidEnv = process.env.GOOGLE_LEADS_SHEET_GID?.trim() || '';
  const id = sheetIdFrom(raw) ?? DEFAULT_SHEET_ID;
  const gid =
    gidEnv || gidFrom(raw) || DEFAULT_SHEET_GID;

  return {
    csvUrl:
      csv ||
      (id
        ? `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`
        : null),
    embedUrl:
      embed ||
      (id
        ? `https://docs.google.com/spreadsheets/d/${id}/htmlembed?gid=${gid}&widget=true&headers=false`
        : null),
    sheetUrl: id
      ? `https://docs.google.com/spreadsheets/d/${id}/edit#gid=${gid}`
      : embed || csv || null,
  };
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += char;
      }
      continue;
    }
    if (char === '"') {
      quoted = true;
      continue;
    }
    if (char === ',') {
      row.push(cell);
      cell = '';
      continue;
    }
    if (char === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    if (char !== '\r') cell += char;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some((value) => value.trim()));
}

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function pick(headers: string[], row: string[], aliases: string[]) {
  const index = headers.findIndex((header) =>
    aliases.some((alias) => header.includes(alias) || alias.includes(header))
  );
  if (index < 0) return '';
  return row[index]?.trim() ?? '';
}

function toLeads(table: string[][]): LeadRow[] {
  const [headerRow, ...body] = table;
  if (!headerRow || body.length === 0) return [];
  const headers = headerRow.map(normalize);

  return body
    .map((row) => {
      const sheetStatus = pick(headers, row, ['status', 'stage', 'funnel']);
      return {
        timestamp: pick(headers, row, ['timestamp', 'date', 'submitted']),
        name: pick(headers, row, ['name', 'fullname']),
        email: pick(headers, row, ['email']),
        company: pick(headers, row, ['company', 'organization', 'org']),
        interest: pick(headers, row, ['interest', 'plan', 'topic', 'need']),
        message: pick(headers, row, [
          'message',
          'notes',
          'comment',
          'selling',
          'configuring',
        ]),
        sheetStatus,
        status: normalizeFunnel(sheetStatus),
      };
    })
    .reverse();
}

export function mergeFunnel(
  rows: LeadRow[],
  saved: Array<{ email: string; submittedAt: string; status: string }>
): LeadRow[] {
  const map = new Map(
    saved.map((row) => [`${row.email}|${row.submittedAt}`, row.status])
  );
  return rows.map((row) => {
    const overlay = map.get(`${row.email}|${row.timestamp}`);
    return {
      ...row,
      status: overlay ? normalizeFunnel(overlay) : row.status,
    };
  });
}

export async function loadLeads(): Promise<LeadsResult> {
  const config = leadsConfig();
  const configured = Boolean(config.csvUrl || config.embedUrl);
  if (!configured) {
    return {
      rows: [],
      embedUrl: null,
      sheetUrl: null,
      configured: false,
    };
  }

  if (!config.csvUrl) {
    return {
      rows: [],
      embedUrl: config.embedUrl,
      sheetUrl: config.sheetUrl,
      configured: true,
    };
  }

  try {
    const response = await fetch(config.csvUrl, {
      next: { revalidate: 60 },
      redirect: 'follow',
    });
    const contentType = response.headers.get('content-type') ?? '';
    const text = await response.text();
    if (
      !response.ok ||
      contentType.includes('text/html') ||
      text.trimStart().startsWith('<')
    ) {
      return {
        rows: [],
        embedUrl: config.embedUrl,
        sheetUrl: config.sheetUrl,
        configured: true,
        error: 'Sheet is not publicly readable as CSV. Showing embed instead.',
      };
    }
    return {
      rows: toLeads(parseCsv(text)),
      embedUrl: config.embedUrl,
      sheetUrl: config.sheetUrl,
      configured: true,
    };
  } catch {
    return {
      rows: [],
      embedUrl: config.embedUrl,
      sheetUrl: config.sheetUrl,
      configured: true,
      error: 'Could not load the sheet. Showing embed instead.',
    };
  }
}
