import { useState, useRef, useEffect } from "react";
import { yearLabel } from "../lib/years";

// first + last word initials (Merilyn Y. Batasan -> MB)
const initialsOf = (name) => {
  const w = name.split(" ");
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

// true if any word in the text STARTS with the term
const startsWithTerm = (text, term) =>
  text.toLowerCase().split(/[\s/:.,-]+/).some((w) => w.startsWith(term));

// Search the same people shown on Home: by name/handle, program, or something they've logged.
export default function ProfileSearch({ people = [], onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  // Ctrl/⌘ + K focuses the search, Esc closes it
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const results = terms.length
    ? people
        .map((p) => {
          const nameText = `${p.name} ${p.handle}`;
          const programText = `${p.program.replace("BS ", "")} ${yearLabel(p.year)}`;
          let score = 0;
          const matchedLogs = new Set();
          const matches = terms.every((t) => {
            if (startsWithTerm(nameText, t)) { score += 3; return true; }
            if (startsWithTerm(programText, t)) { score += 2; return true; }
            const hits = p.logs.filter((l) => startsWithTerm(l.title, t));
            if (hits.length) {
              hits.forEach((l) => matchedLogs.add(l));
              score += 1;
              return true;
            }
            return false;
          });
          return matches ? { p, score, matchedLogs: [...matchedLogs] } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
    : [];

  const choose = (id) => {
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
    onSelect?.(id);
  };

  return (
    <div className="hdr__search-wrap" ref={wrapRef}>
      <label className="hdr__search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search people or interests"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) choose(results[0].p.id);
          }}
        />
      </label>

      {open && terms.length > 0 && (
        <ul className="hdr__results">
          {results.length === 0 ? (
            <li className="hdr__results-empty">No profiles found</li>
          ) : (
            results.map(({ p, matchedLogs }) => (
              <li key={p.id}>
                <button type="button" className="hdr__result" onClick={() => choose(p.id)}>
                  <span className="hdr__result-avatar" style={{ background: p.color }}>
                    {initialsOf(p.name)}
                  </span>
                  <span className="hdr__result-text">
                    <strong>{p.name}</strong>
                    <small>@{p.handle} · {[p.program, yearLabel(p.year)].filter(Boolean).join(" · ")}</small>
                    {matchedLogs.length > 0 && (
                      <span className="hdr__tags">
                        {matchedLogs.slice(0, 3).map((l) => (
                          <span key={l.id} className="hdr__tag is-match">{l.title}</span>
                        ))}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
