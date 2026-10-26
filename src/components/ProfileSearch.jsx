import { useState, useRef, useEffect } from "react";

const profiles = [
  { id: 1, name: "Sophia Remulta", username: "sophiaremulta", course: "BS Computer Science" },
  { id: 2, name: "Vince Po", username: "vincepo", course: "BS Information Tech" },
  { id: 3, name: "Francis Pantonial", username: "francisPantonial", course: "BS Data Science" },
  { id: 4, name: "Rodzif Braga", username: "rodzifbraga", course: "BS Computer Science" },
  { id: 5, name: "Lezly Villanueva", username: "lezlyv", course: "BS Information Systems" },
  { id: 6, name: "Merilyn Y. Batasan", username: "merilynbatasan", course: "BS Data Science" },
  { id: 7, name: "Bianca Garcia", username: "biancag", course: "BS Information Tech" },
  { id: 8, name: "Rafael Aquino", username: "rafaquino", course: "BS Computer Science" },
  { id: 9, name: "Isabel Navarro", username: "isabelnav", course: "BS Information Systems" },
  { id: 10, name: "Dennis Villanueva", username: "dennisv", course: "BS Computer Engineering" },
];

// first + last word initials (Merilyn Y. Batasan -> MB)
const initialsOf = (name) => {
  const w = name.split(" ");
  return (w[0][0] + (w.length > 1 ? w[w.length - 1][0] : "")).toUpperCase();
};

// true if any word in the text STARTS with the term
const startsWithTerm = (text, term) =>
  text.toLowerCase().split(/[\s/]+/).some((w) => w.startsWith(term));

export default function ProfileSearch() {
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
    ? profiles
        .map((p) => {
          const nameText = `${p.name} ${p.username}`;
          const courseText = p.course.replace("BS ", "");
          let score = 0;
          const matches = terms.every((t) => {
            if (startsWithTerm(nameText, t)) { score += 2; return true; }
            if (startsWithTerm(courseText, t)) { score += 1; return true; }
            return false;
          });
          return matches ? { p, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.p)
    : [];

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
          placeholder="Search for profiles"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </label>

      {open && terms.length > 0 && (
        <ul className="hdr__results">
          {results.length === 0 ? (
            <li className="hdr__results-empty">No profiles found</li>
          ) : (
            results.map((p) => (
              <li key={p.id} className="hdr__result">
                <span className="hdr__result-avatar">{initialsOf(p.name)}</span>
                <span className="hdr__result-text">
                  <strong>{p.name}</strong>
                  <small>@{p.username} · {p.course}</small>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}