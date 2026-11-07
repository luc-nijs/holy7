// Copies the banner photos from Drive into the site at every build, as on the
// other sites. A picture that can't be copied is loaded from Drive instead (see home.js).
import { BANNER_CSV_URL, bannerFromCSV, bannerDriveUrl } from '../../lib/home.js';
import { driveId } from '../../lib/news.js';
import { fetchSheet } from '../../lib/sheet.js';
import snapshot from '../../data/banner-snapshot.json';

export async function getStaticPaths() {
  let records = snapshot;
  try { records = bannerFromCSV(await fetchSheet(BANNER_CSV_URL)); }
  catch (err) { console.warn('[banner] Using the saved copy:', err.message); }

  const ids = [...new Set(records.map((r) => driveId(r.photo)).filter(Boolean))];
  const paths = [];
  for (const id of ids) {
    try {
      const res = await fetch(bannerDriveUrl(id), { signal: AbortSignal.timeout(20000) });
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.startsWith('image/')) throw new Error(`HTTP ${res.status} ${type}`);
      paths.push({ params: { id }, props: { bytes: await res.arrayBuffer() } });
    } catch (err) {
      console.warn(`[banner] Picture ${id} was not copied.`, err.message);
    }
  }
  return paths;
}

export function GET({ props }) {
  return new Response(props.bytes, { headers: { 'Content-Type': 'image/jpeg' } });
}
