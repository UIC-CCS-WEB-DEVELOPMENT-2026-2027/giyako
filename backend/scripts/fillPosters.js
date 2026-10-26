// Fills in "poster_url" in data/media_catalog.json using each service's own API.
//
//   node scripts/fillPosters.js           -> only items that have no poster yet
//   node scripts/fillPosters.js --force   -> re-fetch everything
//
// Keys go in backend/.env (all optional; items whose service has no key are skipped):
//   TMDB_API_KEY=...            movies + TV   (free: themoviedb.org -> Settings -> API)
//   TWITCH_CLIENT_ID=...        games (IGDB)  (free: dev.twitch.tv/console)
//   TWITCH_CLIENT_SECRET=...
// No key needed: anime (Jikan), books (Open Library), music (iTunes Search).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG = path.join(__dirname, '../data/media_catalog.json');
const FORCE = process.argv.includes('--force');

const { TMDB_API_KEY, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET } = process.env;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------- one finder per media type; each returns { url, matched } or null ----------

async function findTmdb(item, kind) {
  if (!TMDB_API_KEY) throw new Error('TMDB_API_KEY missing');
  const yearParam = kind === 'movie' ? 'primary_release_year' : 'first_air_date_year';
  const q = new URLSearchParams({ api_key: TMDB_API_KEY, query: item.title });
  if (item.year) q.set(yearParam, item.year);
  const data = await getJson(`https://api.themoviedb.org/3/search/${kind}?${q}`);
  const hit = data.results?.find((r) => r.poster_path);
  return hit
    ? { url: `https://image.tmdb.org/t/p/w500${hit.poster_path}`, matched: hit.title ?? hit.name }
    : null;
}

async function findAnime(item) {
  const q = new URLSearchParams({ q: item.title, limit: '1' });
  const data = await getJson(`https://api.jikan.moe/v4/anime?${q}`);
  const hit = data.data?.[0];
  const url = hit?.images?.jpg?.large_image_url ?? hit?.images?.jpg?.image_url;
  return url ? { url, matched: hit.title } : null;
}

async function findBook(item) {
  const q = new URLSearchParams({ title: item.title, author: item.creator ?? '', limit: '5' });
  const data = await getJson(`https://openlibrary.org/search.json?${q}`);
  const hit = data.docs?.find((d) => d.cover_i);
  return hit
    ? { url: `https://covers.openlibrary.org/b/id/${hit.cover_i}-L.jpg`, matched: hit.title }
    : null;
}

async function findAlbum(item) {
  const q = new URLSearchParams({ term: `${item.title} ${item.creator ?? ''}`, entity: 'album', limit: '1' });
  const data = await getJson(`https://itunes.apple.com/search?${q}`);
  const hit = data.results?.[0];
  return hit?.artworkUrl100
    ? { url: hit.artworkUrl100.replace('100x100bb', '600x600bb'), matched: `${hit.collectionName} - ${hit.artistName}` }
    : null;
}

let igdbToken = null;
async function findGame(item) {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) throw new Error('TWITCH_CLIENT_ID/SECRET missing');
  if (!igdbToken) {
    const q = new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });
    igdbToken = (await getJson(`https://id.twitch.tv/oauth2/token?${q}`, { method: 'POST' })).access_token;
  }
  const hits = await getJson('https://api.igdb.com/v4/games', {
    method: 'POST',
    headers: { 'Client-ID': TWITCH_CLIENT_ID, Authorization: `Bearer ${igdbToken}`, 'Content-Type': 'text/plain' },
    body: `search "${item.title.replace(/"/g, '')}"; fields name,cover.image_id; where cover != null; limit: 1;`,
  });
  const hit = hits[0];
  return hit?.cover?.image_id
    ? { url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${hit.cover.image_id}.jpg`, matched: hit.name }
    : null;
}

const FINDERS = {
  movie: (i) => findTmdb(i, 'movie'),
  tv: (i) => findTmdb(i, 'tv'),
  anime: findAnime,
  book: findBook,
  music: findAlbum,
  game: findGame,
};

// ---------- main ----------

const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf-8'));
const failures = [];
let filled = 0;

for (const item of catalog) {
  if (item.poster_url && !FORCE) continue;
  const find = FINDERS[item.media_type];
  if (!find) continue;

  try {
    const result = await find(item);
    if (result) {
      item.poster_url = result.url;
      filled++;
      console.log(`✔ ${item.title}  ->  matched "${result.matched}"`);
    } else {
      failures.push(`${item.title}: no result`);
      console.log(`✘ ${item.title}  (no result)`);
    }
  } catch (err) {
    failures.push(`${item.title}: ${err.message}`);
    console.log(`✘ ${item.title}  (${err.message})`);
  }

  // Be polite to free APIs (Jikan allows ~3 requests/second)
  await sleep(item.media_type === 'anime' ? 450 : 120);
}

fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 2) + '\n');
console.log(`\nFilled ${filled} poster(s). ${failures.length} problem(s).`);
if (failures.length) console.log('Needs attention:\n - ' + failures.join('\n - '));
console.log('Eyeball the "matched" titles above: the first search hit is usually, but not always, right.');