import { useCallback, useEffect, useState } from "react";
import MediaCover from "./MediaCover";
import { MEDIA_TYPES, searchMedia, typeLabel } from "../lib/media";
import "./MyLogs.css";

const FILTERS = [{ id: "all", label: "All" }, ...MEDIA_TYPES];

const Icon = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export default function MyLogs({ logs, onAdd, onRemove, onFeature }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [attempt, setAttempt] = useState(0);

  const loggedIds = new Set(logs.map((l) => l.id));
  const searching = query.trim().length > 0;

  // Debounced search; stale requests are aborted
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setStatus("loading");
      try {
        const data = await searchMedia({ query: query.trim(), type }, controller.signal);
        setResults(data);
        setStatus("ready");
      } catch (err) {
        if (err.name !== "AbortError") setStatus("error");
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, type, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  // Group logs by type for the shelf
  const groups = MEDIA_TYPES.map((t) => ({
    ...t,
    items: logs.filter((l) => l.media_type === t.id),
  })).filter((g) => g.items.length);

  return (
    <div className="logs-page">
      <section className="lg-card" aria-label="Find media to log">
        <h1 className="lg-title">My logs</h1>
        <p className="lg-sub">Search for something you love and add it to your profile.</p>

        <label className="lg-search">
          <Icon size={18}>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </Icon>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, shows, anime, games, music, books…"
            aria-label="Search media"
          />
        </label>

        <div className="lg-chips" role="group" aria-label="Category">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`lg-chip ${type === f.id ? "is-active" : ""}`}
              aria-pressed={type === f.id}
              onClick={() => setType(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h2 className="lg-heading">{searching ? `Results for “${query.trim()}”` : "Browse"}</h2>

        {status === "error" ? (
          <div className="lg-state" role="alert">
            <p>Couldn't reach the catalog server. Is the backend running?</p>
            <button type="button" className="lg-btn" onClick={retry}>Try again</button>
          </div>
        ) : status === "loading" && results.length === 0 ? (
          <p className="lg-state" role="status">Searching…</p>
        ) : results.length === 0 ? (
          <p className="lg-state" role="status">
            Nothing found{searching ? ` for “${query.trim()}”` : ""}. Try another title or category.
          </p>
        ) : (
          <ul className={`lg-results ${status === "loading" ? "is-stale" : ""}`}>
            {results.map((item) => {
              const added = loggedIds.has(item.id);
              return (
                <li key={item.id} className="lg-item">
                  <MediaCover item={item} />
                  <div className="lg-item__meta">
                    <strong title={item.title}>{item.title}</strong>
                    <small>
                      {typeLabel(item.media_type)}
                      {item.year ? ` · ${item.year}` : ""}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`lg-btn ${added ? "lg-btn--done" : "lg-btn--solid"}`}
                    disabled={added}
                    onClick={() => onAdd(item)}
                    aria-label={added ? `${item.title} is already logged` : `Add ${item.title} to my logs`}
                  >
                    {added ? (
                      <><Icon><path d="M5 12l5 5L20 7" /></Icon> Added</>
                    ) : (
                      <><Icon><path d="M12 5v14M5 12h14" /></Icon> Add</>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="lg-card" aria-label="Your logs">
        <h2 className="lg-title lg-title--sm">
          Your logs <span className="lg-count">{logs.length}</span>
        </h2>

        {logs.length === 0 ? (
          <p className="lg-state">
            Nothing logged yet. Add something above and it will show up on your profile.
          </p>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="lg-group">
              <h3 className="lg-group__title">
                {g.label} <span>{g.items.length}</span>
              </h3>
              <ul className="lg-shelf">
                {g.items.map((item) => {
                  const featured = logs[0]?.id === item.id;
                  return (
                    <li key={item.id} className="lg-tile">
                      <MediaCover item={item} />
                      <div className="lg-tile__actions">
                        <button
                          type="button"
                          className={`lg-icon-btn ${featured ? "is-on" : ""}`}
                          onClick={() => onFeature(item.id)}
                          aria-pressed={featured}
                          aria-label={featured ? `${item.title} is your featured pick` : `Feature ${item.title} on your profile`}
                          title={featured ? "Featured on your profile" : "Feature on your profile"}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={featured ? "currentColor" : "none"}
                            stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="lg-icon-btn"
                          onClick={() => onRemove(item.id)}
                          aria-label={`Remove ${item.title} from my logs`}
                          title="Remove"
                        >
                          <Icon size={14}><path d="M6 6l12 12M18 6L6 18" /></Icon>
                        </button>
                      </div>
                      <span className="lg-tile__name" title={item.title}>{item.title}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
