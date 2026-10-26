// Conversations are kept in the browser (localStorage) until there is a real messaging backend.
// Shape: { [personId]: { created, lastRead, messages: [{ id, from: "me" | "them", text, ts }] } }
const STORAGE_KEY = "giyako.messages.v1";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
export const newMessage = (from, text, ts = Date.now()) => ({ id: uid(), from, text, ts });

// A couple of starter chats so the tab isn't empty on first open
function seed() {
  const now = Date.now();
  const H = 3600 * 1000;
  return {
    p1: {
      created: now - 2 * H,
      lastRead: 0,
      messages: [newMessage("them", "hey Sam! saw your profile, what are you playing lately?", now - 2 * H)],
    },
    p2: {
      created: now - 26 * H,
      lastRead: 0,
      messages: [newMessage("them", "Hi! Your bio made me laugh. Any book recs?", now - 26 * H)],
    },
  };
}

export function loadThreads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return seed();
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return seed();
  }
}

export function saveThreads(threads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    /* storage unavailable: chats just won't persist */
  }
}

export const unreadCount = (thread) =>
  thread ? thread.messages.filter((m) => m.from === "them" && m.ts > thread.lastRead).length : 0;

export const lastActivity = (thread) => thread.messages.at(-1)?.ts ?? thread.created;

// "3:42 PM" today, weekday this week, otherwise "Oct 3"
export function formatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  const days = (now - d) / (24 * 3600 * 1000);
  if (days < 6) return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
