// Shared helpers for the published Google Sheets (News and Agenda), as on the other sites.

export const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Reads CSV with quoted fields, doubled quotes, and commas or newlines inside quotes.
export function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else { inQuotes = false; }
      } else { field += c; }
    } else if (c === '"') { inQuotes = true;
    } else if (c === ',') { row.push(field); field = '';
    } else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '';
    } else if (c !== '\r') { field += c; }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => String(v).trim() !== ''));
}

// At build time (live = false) with a timeout; in the browser (live = true) past any cache.
export async function fetchSheet(url, { live = false } = {}) {
  if (!url) throw new Error('no sheet address yet');
  const full = live ? url + (url.includes('?') ? '&' : '?') + 'v=' + Math.floor(Date.now() / 60000) : url;
  const res = await fetch(full, live ? { cache: 'no-cache' } : { signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.text();
}

// A table's columns by lower-case name; throws when a required one is missing,
// so an error page is not mistaken for a sheet with everything removed.
export function columns(rows, required) {
  const header = (rows[0] || []).map((h) => String(h).trim().toLowerCase());
  if (header.indexOf(required) === -1) throw new Error(`no ${required} column`);
  return (r, name) => String(r[header.indexOf(name)] ?? '').trim();
}

// YYYY-MM-DD from the formats a sheet may write (2025-08-10, 10/08/2025, 10-8-2025), or ''.
export function isoDate(s) {
  let m = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/.exec(s);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/.exec(s);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return '';
}

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Only an explicit no hides a row.
export const hidden = (v) => /^(n|nee|no|false|0|hide|verberg)$/i.test(v);

export const webAddress = (s) => (!s ? '' : /^(https?:\/\/|\/)/i.test(s) ? s : /^[a-z][a-z0-9+.-]*:/i.test(s) ? '' : 'https://' + s);
