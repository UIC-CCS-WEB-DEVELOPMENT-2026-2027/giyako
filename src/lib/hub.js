const KEY = "giyako.hub";

export const TAGS = [
  { id: "lost", label: "Lost & Found", color: "#b45309", done: "Resolved" },
  { id: "study", label: "Study Help", color: "#2563eb", done: "Resolved" },
  { id: "events", label: "Events", color: "#7c3aed" },
  { id: "market", label: "Buy & Sell", color: "#0f766e", done: "Sold" },
  { id: "housing", label: "Housing", color: "#be185d" },
  { id: "rides", label: "Rides", color: "#0369a1", done: "Filled" },
  { id: "clubs", label: "Clubs", color: "#4d7c0f" },
  { id: "general", label: "General", color: "#475569" },
];
export const tagOf = (id) => TAGS.find((t) => t.id === id) ?? TAGS[TAGS.length - 1];
export const uid = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36);

const A = (id, name, handle, color) => ({ id, name, handle, color });
const mika = A("s1", "Mika Tan", "mikatan", "#3b4a6b"), leo = A("s2", "Leo Cruz", "leocruz", "#6b3b4a");
const ana = A("s3", "Ana Reyes", "anareyes", "#5a3e2b"), dev = A("s4", "Dev Patel", "devp", "#2f5d50");
const t = (mins) => Date.now() - mins * 60000;
const C = (author, text, mins) => ({ id: uid(), author, text, ts: t(mins) });
const P = (author, tag, title, body, mins, score, comments = [], resolved = false) =>
  ({ id: uid(), author, tag, title, body, ts: t(mins), score, my: 0, comments, resolved });

const seed = () => [
  P(mika, "lost", "Lost: black backpack near the library",
    "Left it on the 2nd-floor study tables around 3pm. Blue keychain, and my laptop charger is inside. Please message me if you see it!",
    35, 14, [C(leo, "Check the library front desk, they keep a lost box.", 20), C(mika, "Going there now, thank you!", 12)]),
  P(leo, "study", "Anyone have notes for the Data Structures midterm (trees and graphs)?",
    "Missed two lectures because of a fever. Happy to trade my algorithms notes.", 90, 9,
    [C(dev, "I have the slides plus my own summary. Sending you a message.", 60)]),
  P(ana, "events", "Board game night at the student lounge, Friday 7PM",
    "Catan, Codenames and a few card games. Bring snacks if you can. Everyone is welcome, even if you’ve never played.", 180, 31,
    [C(mika, "Count me in!", 150), C(dev, "Can I bring Exploding Kittens?", 120)]),
  P(dev, "market", "Selling: Calculus textbook (Stewart, 8th ed.), ₱600",
    "Barely highlighted, no torn pages. Meet on campus.", 300, 5),
  P(leo, "rides", "Carpool from Matina to campus, MWF 7:30AM?",
    "I drive and have two empty seats. Can split gas.", 420, 12, [C(ana, "Interested! Which gate do you drop off at?", 380)]),
  P(ana, "clubs", "Photography club is looking for new members",
    "We do weekend photo walks and a small exhibit every semester. No camera needed to start.", 1000, 18),
  P(mika, "housing", "Looking for a roommate near campus, ₱4,500 each",
    "2-bedroom apartment, 10 minutes' walk. Quiet building, wifi included.", 1500, 7),
  P(dev, "general", "Best study spot with decent wifi?",
    "The library gets full by 10am. Looking for somewhere quiet that isn’t packed.", 2400, 22,
    [C(leo, "The 3rd-floor engineering lounge. Hardly anyone knows about it.", 2300), C(ana, "Second that.", 2200)], true),
];

export function loadPosts() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY));
    if (Array.isArray(p)) return p;
  } catch { /* fall through to seed */ }
  return seed();
}
export const savePosts = (p) => localStorage.setItem(KEY, JSON.stringify(p));
export const resetHub = () => localStorage.removeItem(KEY);
