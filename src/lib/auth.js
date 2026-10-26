// MOCK AUTH for local development (localStorage). Swap each function for a real API call;
// never keep passwords or verification codes client-side in production.
const USERS = "giyako.users", SESSION = "giyako.session";
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const hash = async (s) =>
  [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
const pub = ({ pw, ...u }) => u;

export const DEMO_CODE = "123456";
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
export const normalizeHandle = (v) => v.toLowerCase().replace(/[^a-z0-9_.]/g, "").slice(0, 24);
export const handleProblem = (h) => (h.length < 3 ? "Use at least 3 characters." : null);
export const handleTaken = (h, email) =>
  ["admin", "giyako", "support"].includes(h) ||
  Object.values(read(USERS, {})).some((u) => u.handle === h && u.email !== email);

export function currentUser() {
  const email = read(SESSION, null);
  const u = email && read(USERS, {})[email];
  return u ? pub(u) : null;
}

export async function signUp(email, password) {
  const key = email.trim().toLowerCase(), users = read(USERS, {});
  if (users[key]) throw new Error("That email already has an account. Try logging in.");
  users[key] = { email: key, pw: await hash(password), verified: false, onboarded: false, profile: null };
  write(USERS, users); write(SESSION, key);
  return pub(users[key]);
}

export async function logIn(email, password) {
  const key = email.trim().toLowerCase(), u = read(USERS, {})[key];
  if (!u || u.pw !== (await hash(password))) throw new Error("Email or password doesn’t match.");
  write(SESSION, key);
  return pub(u);
}

export const logOut = () => localStorage.removeItem(SESSION);

export function updateUser(email, patch) {
  const users = read(USERS, {});
  if (!users[email]) return null;
  users[email] = { ...users[email], ...patch };
  write(USERS, users);
  return pub(users[email]);
}

export function verifyEmail(email, code) {
  if (code.trim() !== DEMO_CODE) throw new Error("That code isn’t right. Check your inbox and try again.");
  return updateUser(email, { verified: true });
}

export async function changePassword(email, current, next) {
  const u = read(USERS, {})[email];
  if (!u || u.pw !== (await hash(current))) throw new Error("Your current password doesn’t match.");
  updateUser(email, { pw: await hash(next) });
}

export function deleteUser(email) {
  const users = read(USERS, {});
  delete users[email];
  write(USERS, users);
  localStorage.removeItem(SESSION);
}
