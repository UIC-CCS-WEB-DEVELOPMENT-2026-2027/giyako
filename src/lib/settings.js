const KEY = "giyako.settings";
const DEFAULTS = { notifyMessages: true, reduceMotion: false };
export const loadSettings = () => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return DEFAULTS; } };
export const saveSettings = (s) => localStorage.setItem(KEY, JSON.stringify(s));
