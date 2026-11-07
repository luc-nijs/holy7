// The home page's banner photos and the films (carousel and Media page), read
// from the two tabs of the H7_home sheet:
//   Banner: Foto, Focus, Publish      (Foto = Drive link, web address or /images/... on the site)
//   Films:  YouTube, Titel, Ondertitel, Publish
// Rows show in sheet order. Shared by the pages (at build time), the picture
// copies and the visitor's browser (to read the sheet live).
import { esc, parseCSV, columns, hidden, webAddress } from './sheet.js';
import { driveId } from './news.js';

// Fill in the published CSV address of each tab (File > Share > Publish to web,
// choose the tab, CSV). While empty, the saved copies in src/data/ show.
export const BANNER_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKNussfnbXFU6bPW0wTqqRQKr6TqamgA4lbfDc1vkyYTd5OswbkTJH3ViLDRbdTrIJuCTMdtsJsvgN/pub?gid=0&single=true&output=csv';
export const FILMS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKNussfnbXFU6bPW0wTqqRQKr6TqamgA4lbfDc1vkyYTd5OswbkTJH3ViLDRbdTrIJuCTMdtsJsvgN/pub?gid=519088387&single=true&output=csv';

// ---------- banner ----------
// Which part of the photo stays in view when the window is wider than the photo.
const FOCUS = { boven: '50% 25%', midden: '50% 50%', onder: '50% 75%' };
export const focusOf = (s) => FOCUS[String(s || '').trim().toLowerCase()] ||
  (/^\d{1,3}%( \d{1,3}%)?$/.test(String(s || '').trim()) ? String(s).trim() : FOCUS.midden);

export const bannerDriveUrl = (id) => `https://drive.google.com/thumbnail?id=${id}&sz=w2000`;

export function bannerFromCSV(text) {
  const rows = parseCSV(text);
  const get = columns(rows, 'foto');
  return rows.slice(1).map((r) => {
    if (hidden(get(r, 'publish'))) return null;
    return { photo: webAddress(get(r, 'foto')), focus: focusOf(get(r, 'focus')) };
  }).filter((r) => r && r.photo);
}

// A Drive photo loads from the site's own copy (made at every build); one added
// since the last build falls back to Drive.
export function photoUrl(link) {
  const id = driveId(link);
  return id ? `/banner-pictures/${id}.jpg` : link;
}

export function layersHtml(recs) {
  return recs.map((r, i) => {
    const id = driveId(r.photo);
    const fallback = id ? ` data-fallback="${esc(bannerDriveUrl(id))}"` : '';
    return `<div class="layer${i === 0 ? ' on' : ''}" style="background-image:url('${esc(photoUrl(r.photo))}');background-position:${esc(r.focus)}"${fallback}></div>`;
  }).join('');
}

// ---------- films ----------
export function youtubeId(link) {
  const s = String(link || '').trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = /(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/.exec(s);
  return m ? m[1] : '';
}

export function filmsFromCSV(text) {
  const rows = parseCSV(text);
  const get = columns(rows, 'youtube');
  return rows.slice(1).map((r) => {
    if (hidden(get(r, 'publish'))) return null;
    return { id: youtubeId(get(r, 'youtube')), title: get(r, 'titel'), sub: get(r, 'ondertitel') };
  }).filter((r) => r && r.id);
}

export const thumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const embed = (id) => `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&autoplay=1`;
export const watch = (id) => `https://www.youtube.com/watch?v=${id}`;

const PLAY = '<span class="play" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M6 4v12l10-6z" fill="currentColor"/></svg></span>';

// The home carousel.
export function carouselHtml(films) {
  return films.map((v) =>
    `<button class="cf-item" type="button" data-id="${esc(v.id)}" data-title="${esc(v.title)}" aria-label="Speel ${esc(v.title)}">` +
    `<img src="${thumb(v.id)}" alt="" loading="lazy">${PLAY}` +
    `<span class="cap"><b>${esc(v.title)}</b><span>${esc(v.sub)}</span></span></button>`).join('');
}

// The Film section of the Media page.
export function filmGridHtml(films) {
  return films.map((v) =>
    `<figure class="film"><button class="film-play" type="button" data-id="${esc(v.id)}" data-title="${esc(v.title)}" aria-label="Speel ${esc(v.title)}">` +
    `<img src="${thumb(v.id)}" alt="" loading="lazy">${PLAY}</button>` +
    `<figcaption><b>${esc(v.title)}</b> ${esc(v.sub)}</figcaption></figure>`).join('');
}
