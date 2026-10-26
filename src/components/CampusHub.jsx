import { useEffect, useMemo, useState } from "react";
import { TAGS, tagOf, loadPosts, savePosts, uid } from "../lib/hub";
import { ago } from "../lib/notifications";
import "./CampusHub.css";

const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const when = (ts) => (ago(ts) === "now" ? "just now" : `${ago(ts)} ago`);

const Svg = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Avatar = ({ who, size = 26 }) => (
  <span className="hp__av" style={{ background: who.color, width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
    {initials(who.name)}
  </span>
);
const TagPill = ({ id }) => {
  const t = tagOf(id);
  return <span className="hp__tag" style={{ "--c": t.color }}>{t.label}</span>;
};

function Composer({ onPost, onClose }) {
  const [tag, setTag] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const ok = tag && title.trim();
  const submit = (e) => { e.preventDefault(); if (ok) onPost({ tag, title: title.trim(), body: body.trim() }); };
  return (
    <form className="hub__composer" onSubmit={submit}
      onKeyDown={(e) => { if (e.key === "Escape") onClose(); if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit(e); }}>
      <div className="hub__pick" role="group" aria-label="Choose a tag">
        {TAGS.map((t) => (
          <button key={t.id} type="button" className={`hp__tag hub__pickbtn ${tag === t.id ? "is-on" : ""}`}
            style={{ "--c": t.color }} aria-pressed={tag === t.id} onClick={() => setTag(t.id)}>{t.label}</button>
        ))}
      </div>
      <input className="hub__input" value={title} maxLength={120} autoFocus placeholder="Title" aria-label="Post title"
        onChange={(e) => setTitle(e.target.value)} />
      <textarea className="hub__input" rows={3} value={body} maxLength={1000} placeholder="Add details (optional)"
        aria-label="Post details" onChange={(e) => setBody(e.target.value)} />
      <div className="hub__composer-foot">
        <small>{tag ? "" : "Pick a tag to post"}</small>
        <button type="button" className="hub__btn hub__btn--ghost" onClick={onClose}>Cancel</button>
        <button type="submit" className="hub__btn" disabled={!ok}>Post</button>
      </div>
    </form>
  );
}

function Comments({ post, who, onAdd }) {
  const [text, setText] = useState("");
  const send = (e) => { e.preventDefault(); if (text.trim()) { onAdd(text.trim()); setText(""); } };
  return (
    <div className="hp__comments">
      {post.comments.length > 0 && (
        <ul>
          {post.comments.map((c) => {
            const a = who(c.author);
            return (
              <li key={c.id}>
                <Avatar who={a} size={24} />
                <div><strong>@{a.handle}</strong> <small>{when(c.ts)}</small><p>{c.text}</p></div>
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={send}>
        <input value={text} maxLength={300} placeholder="Write a reply…" aria-label="Write a reply" onChange={(e) => setText(e.target.value)} />
        <button type="submit" className="hub__btn" disabled={!text.trim()}>Reply</button>
      </form>
    </div>
  );
}

export default function CampusHub({ profile }) {
  const [posts, setPosts] = useState(loadPosts);
  const [tag, setTag] = useState("all");
  const [sort, setSort] = useState("new");
  const [q, setQ] = useState("");
  const [composing, setComposing] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => savePosts(posts), [posts]);

  const me = { id: "me", name: profile.name, handle: profile.handle, color: "#1f4a3a" };
  const who = (a) => (a.id === "me" ? me : a);
  const update = (id, fn) => setPosts((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));
  const score = (p) => p.score + p.my;

  const counts = useMemo(() => Object.fromEntries(TAGS.map((t) => [t.id, posts.filter((p) => p.tag === t.id).length])), [posts]);
  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return posts
      .filter((p) => (tag === "all" || p.tag === tag) && (!needle || `${p.title} ${p.body}`.toLowerCase().includes(needle)))
      .sort(sort === "top" ? (a, b) => score(b) - score(a) || b.ts - a.ts : (a, b) => b.ts - a.ts);
  }, [posts, tag, sort, q]);

  const vote = (id, v) => update(id, (p) => ({ ...p, my: p.my === v ? 0 : v }));
  const post = ({ tag: t, title, body }) => {
    setPosts((ps) => [{ id: uid(), author: { id: "me" }, tag: t, title, body, ts: Date.now(), score: 0, my: 0, comments: [], resolved: false }, ...ps]);
    setTag("all"); setSort("new"); setComposing(false);
  };
  const comment = (id, text) => update(id, (p) => ({ ...p, comments: [...p.comments, { id: uid(), author: { id: "me" }, text, ts: Date.now() }] }));
  const remove = (id) => { setPosts((ps) => ps.filter((p) => p.id !== id)); setConfirmId(null); };

  return (
    <div className="hub">
      <header className="hub__head">
        <h1>Campus hub</h1>
        <p>Ask, share and find out what’s happening on campus.</p>
      </header>

      <nav className="hub__tags" aria-label="Topics">
        {[{ id: "all", label: "All posts", n: posts.length }, ...TAGS.map((t) => ({ ...t, n: counts[t.id] }))].map((t) => (
          <button key={t.id} type="button" className={tag === t.id ? "is-active" : ""} aria-pressed={tag === t.id}
            onClick={() => setTag(t.id)}>
            {t.color && <i style={{ background: t.color }} />}{t.label}<span>{t.n}</span>
          </button>
        ))}
      </nav>

      <section className="hub__feed" aria-label="Posts">
        {composing ? (
          <Composer onPost={post} onClose={() => setComposing(false)} />
        ) : (
          <button type="button" className="hub__start" onClick={() => setComposing(true)}>
            <Avatar who={me} size={32} /> Post something to campus…
          </button>
        )}

        <div className="hub__bar">
          <label className="hub__search">
            <Svg><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></Svg>
            <input type="search" value={q} placeholder="Search posts" aria-label="Search posts" onChange={(e) => setQ(e.target.value)} />
          </label>
          <div className="hub__sort" role="group" aria-label="Sort posts">
            {[["new", "New"], ["top", "Top"]].map(([id, l]) => (
              <button key={id} type="button" className={sort === id ? "is-active" : ""} aria-pressed={sort === id} onClick={() => setSort(id)}>{l}</button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="hub__empty">
            <p>{q ? "No posts match your search." : "Nothing here yet. Be the first to post."}</p>
            {!q && <button type="button" className="hub__btn" onClick={() => setComposing(true)}>Create a post</button>}
          </div>
        ) : (
          shown.map((p) => {
            const a = who(p.author), mine = a.id === "me", t = tagOf(p.tag), open = openId === p.id;
            return (
              <article key={p.id} className={`hp ${p.resolved ? "is-done" : ""}`}>
                <div className="hp__vote">
                  <button type="button" className={p.my === 1 ? "is-up" : ""} aria-pressed={p.my === 1} aria-label="Upvote" onClick={() => vote(p.id, 1)}>
                    <Svg><path d="M12 19V5M5 12l7-7 7 7" /></Svg></button>
                  <b aria-label={`Score ${score(p)}`}>{score(p)}</b>
                  <button type="button" className={p.my === -1 ? "is-down" : ""} aria-pressed={p.my === -1} aria-label="Downvote" onClick={() => vote(p.id, -1)}>
                    <Svg><path d="M12 5v14M5 12l7 7 7-7" /></Svg></button>
                </div>
                <div className="hp__main">
                  <div className="hp__meta">
                    <Avatar who={a} />
                    <span>@{a.handle}</span><span aria-hidden="true">·</span><span>{when(p.ts)}</span>
                    <TagPill id={p.tag} />
                    {p.resolved && <span className="hp__done">{t.done}</span>}
                  </div>
                  <h2 className="hp__title">{p.title}</h2>
                  {p.body && <p className={`hp__body ${open ? "is-open" : ""}`}>{p.body}</p>}
                  <div className="hp__foot">
                    <button type="button" aria-expanded={open} onClick={() => setOpenId(open ? null : p.id)}>
                      <Svg><path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1h-8l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" /></Svg>
                      {p.comments.length} {p.comments.length === 1 ? "comment" : "comments"}
                    </button>
                    {mine && t.done && (
                      <button type="button" onClick={() => update(p.id, (x) => ({ ...x, resolved: !x.resolved }))}>
                        {p.resolved ? "Reopen" : `Mark as ${t.done.toLowerCase()}`}
                      </button>
                    )}
                    {mine && (
                      <button type="button" className={confirmId === p.id ? "is-danger" : ""}
                        onClick={() => (confirmId === p.id ? remove(p.id) : setConfirmId(p.id))}
                        onBlur={() => setConfirmId(null)}>
                        {confirmId === p.id ? "Confirm delete" : "Delete"}
                      </button>
                    )}
                  </div>
                  {open && <Comments post={p} who={who} onAdd={(text) => comment(p.id, text)} />}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
