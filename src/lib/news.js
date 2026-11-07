// News, as on the other sites: a published Google Sheet with the columns
// Text, Link, Picture, Until, Publish. Shared by the home page (at build time),
// the picture copies and the visitor's browser (to read the sheet live).
import { esc, parseCSV, columns, isoDate, today, hidden, webAddress } from './sheet.js';

// Fill in the address of the published H7_webnews sheet (File > Share > Publish
// to web > CSV). While it is empty, the saved copy in src/data/news-snapshot.json shows.
export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT54GuMfdkbsYAfde4kDD-qBN6GUvR8IUfhy0Evs7-AqJX3BqItisb7yRKIahdSMwYIZh03mnS5ARLv/pub?output=csv';

export function driveId(link) {
  if (!/^https?:\/\/(drive|docs)\.google\.com\//i.test(link || '')) return '';
  const m = /\/d\/([-\w]+)/.exec(link) || /[?&]id=([-\w]+)/.exec(link);
  return m ? m[1] : '';
}

export const driveImageUrl = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w800`;

export const current = (recs) => recs.filter((r) => !r.until || r.until >= today());

export function recordsFromCSV(text) {
  const rows = parseCSV(text);
  const get = columns(rows, 'text');
  return rows.slice(1).map((r) => {
    if (hidden(get(r, 'publish'))) return null;
    return {
      text: get(r, 'text').replace(/\s+/g, ' '),
      link: webAddress(get(r, 'link')),
      picture: webAddress(get(r, 'picture')),
      until: isoDate(get(r, 'until')),
    };
  }).filter((r) => r && r.text);
}

function pictureHtml(link) {
  if (!link) return '';
  const id = driveId(link);
  if (!id) return `<img class="news-pic" src="${esc(link)}" alt="" loading="lazy">`;
  return `<img class="news-pic" src="/news-pictures/${id}.jpg" alt="" loading="lazy" referrerpolicy="no-referrer" ` +
    `onerror="this.onerror=null;this.src='${driveImageUrl(id)}'">`;
}

// The sheet's last row shows first, so a row added at the bottom tops the news.
export function newsHtml(recs) {
  return [...recs].reverse().map((r) => {
    const ext = /^https?:/i.test(r.link) ? ' target="_blank" rel="noopener"' : '';
    const more = r.link ? ` <a class="more" href="${esc(r.link)}"${ext}>zie hier</a>` : '';
    return `<article class="news-item">${pictureHtml(r.picture)}<p>${esc(r.text)}${more}</p></article>`;
  }).join('');
}
