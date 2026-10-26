// Backend base URL. Set VITE_API_URL in a .env file for deployed builds.
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:5000").replace(/\/$/, "");

export const MEDIA_TYPES = [
  { id: "movie", label: "Movies", single: "Movie" },
  { id: "tv", label: "TV", single: "TV show" },
  { id: "anime", label: "Anime", single: "Anime" },
  { id: "game", label: "Games", single: "Game" },
  { id: "music", label: "Music", single: "Album" },
  { id: "book", label: "Books", single: "Book" },
];

export const typeLabel = (id) => MEDIA_TYPES.find((t) => t.id === id)?.single ?? id;

export async function searchMedia({ query, type }, signal) {
  const params = new URLSearchParams({ query, type });
  const res = await fetch(`${API_URL}/api/media/search?${params}`, { signal });
  if (!res.ok) throw new Error(`Search failed (${res.status})`);
  return res.json();
}

// Keep only what a log needs
export const toLog = (item) => ({
  id: item.id,
  title: item.title,
  media_type: item.media_type,
  creator: item.creator ?? "",
  year: item.year ?? null,
  poster_url: item.poster_url ?? null,
});

const STORAGE_KEY = "giyako.logs.v1";

export function loadLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    /* storage unavailable: logs just won't persist */
  }
}
