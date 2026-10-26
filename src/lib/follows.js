// Who follows whom. Your own follows live in localStorage until there is a real backend.
// The sample people on Home carry fixed edges in mockProfiles.js (`follows`, `followsMe`).
const KEY = "giyako.follows.v1";

export const ME = "me";

export function loadFollowing() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFollowing(ids) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable: follows just won't persist */
  }
}

/* ---------- Visibility ---------- */

export const AUDIENCES = [
  { id: "everyone", label: "Everyone" },
  // Internal id stays "mutuals": the viewer and the owner follow each other
  { id: "mutuals", label: "People I follow back" },
  { id: "private", label: "Only me" },
];

export const STAT_KINDS = [
  { id: "followers", label: "Followers" },
  { id: "following", label: "Following" },
];

const DEFAULT_VISIBILITY = { followers: "everyone", following: "everyone" };

// Accounts created before this setting existed have no value, so always fill in defaults
export const statsVisibility = (profile) => ({ ...DEFAULT_VISIBILITY, ...profile?.statsVisibility });

/* ---------- Graph ---------- */

// Map of personId -> Set of ids that person follows (you are ME)
export function buildGraph(people, myFollowing) {
  const graph = new Map();
  for (const p of people) {
    const out = new Set(p.follows ?? []);
    if (p.followsMe) out.add(ME);
    graph.set(p.id, out);
  }
  graph.set(ME, new Set(myFollowing));
  return graph;
}

export function relations(graph, id) {
  const following = [...(graph.get(id) ?? [])].filter((x) => graph.has(x));
  const followers = [...graph.keys()].filter((k) => k !== id && graph.get(k).has(id));
  return { followers, following };
}

const canSee = (audience, viewerId, ownerId, graph) => {
  if (viewerId === ownerId || audience === "everyone") return true;
  if (audience === "mutuals") return !!graph.get(viewerId)?.has(ownerId) && !!graph.get(ownerId)?.has(viewerId);
  return false;
};

// { followers, following }, each { visible, count, ids }. Hidden stats expose nothing.
export function statsFor(owner, viewerId, graph) {
  const rel = relations(graph, owner.id);
  const vis = statsVisibility(owner);
  return Object.fromEntries(
    STAT_KINDS.map(({ id }) => {
      const visible = canSee(vis[id], viewerId, owner.id, graph);
      return [id, visible ? { visible, count: rel[id].length, ids: rel[id] } : { visible, count: 0, ids: [] }];
    })
  );
}

/* ---------- Mutuals ---------- */

// People you follow who also follow `otherId`. Callers only need to know whether this is
// non-empty, so the profile shows a small indicator with no names and no count.
export function sharedConnections(graph, meId, otherId) {
  const { following } = relations(graph, meId);
  const { followers } = relations(graph, otherId);
  return following.filter((x) => x !== otherId && followers.includes(x));
}
