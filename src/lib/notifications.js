const KEY = "giyako.notifs";
export const loadNotifs = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; } };
export const saveNotifs = (n) => localStorage.setItem(KEY, JSON.stringify(n.slice(0, 30)));
export const newNotif = (n) => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: Date.now(), read: false, ...n });
export function ago(ts) {
  const s = (Date.now() - ts) / 1000;
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
