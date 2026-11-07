// Agenda: a published Google Sheet with the columns
// Datum, Uur, Titel, Plaats, Stad, Land, Link, Publish.
// Upcoming concerts show first (soonest on top), then past ones by year.
import { esc, parseCSV, columns, isoDate, today, hidden, webAddress } from './sheet.js';

// Fill in the address of the published H7_agenda sheet (CSV). While it is
// empty, the saved copy in src/data/agenda-snapshot.json shows.
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTJyVqtDYH7QVBCKG6xT4QQzsVnuYpkjR74kc1u43yHkGHdzFDxiMk46AcYgWRMh-7K0UzP54oI-YRR/pub?output=csv';

export function recordsFromCSV(text) {
  const rows = parseCSV(text);
  const get = columns(rows, 'datum');
  return rows.slice(1).map((r) => {
    if (hidden(get(r, 'publish'))) return null;
    return {
      date: isoDate(get(r, 'datum')),
      time: get(r, 'uur'),
      title: get(r, 'titel'),
      venue: get(r, 'plaats'),
      city: get(r, 'stad'),
      country: get(r, 'land'),
      link: webAddress(get(r, 'link')),
    };
  }).filter((r) => r && r.date && (r.title || r.venue));
}

export function split(recs) {
  const t = today();
  const upcoming = recs.filter((r) => r.date >= t).sort((a, b) => a.date.localeCompare(b.date));
  const past = recs.filter((r) => r.date < t).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

const MONTHS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

function itemHtml(r) {
  const [y, m, d] = r.date.split('-');
  const place = [r.venue, r.city, r.country].filter(Boolean).join(', ');
  const title = r.title || r.venue;
  const sub = r.title ? place : [r.city, r.country].filter(Boolean).join(', ');
  const ext = /^https?:/i.test(r.link) ? ' target="_blank" rel="noopener"' : '';
  const head = r.link ? `<a href="${esc(r.link)}"${ext}>${esc(title)}</a>` : esc(title);
  return `<li class="ag-item"><time datetime="${r.date}"><b>${+d}</b><span>${MONTHS[+m - 1]} ${y}</span></time>` +
    `<div><h3>${head}</h3>${sub ? `<p>${esc(sub)}${r.time ? ` · ${esc(r.time)}` : ''}</p>` : r.time ? `<p>${esc(r.time)}</p>` : ''}</div></li>`;
}

export function upcomingHtml(upcoming) {
  if (!upcoming.length) return '<p class="ag-none">Nieuwe concerten worden binnenkort aangekondigd.</p>';
  return `<ul class="ag-list">${upcoming.map(itemHtml).join('')}</ul>`;
}

export function pastHtml(past) {
  const byYear = new Map();
  for (const r of past) {
    const y = r.date.slice(0, 4);
    if (!byYear.has(y)) byYear.set(y, []);
    byYear.get(y).push(r);
  }
  return [...byYear].map(([y, list]) =>
    `<section class="ag-year"><h3 class="ag-y">${y}</h3><ul class="ag-list past">${list.map(itemHtml).join('')}</ul></section>`).join('');
}
