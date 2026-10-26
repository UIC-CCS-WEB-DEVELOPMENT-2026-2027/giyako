import MediaCover from "./MediaCover";
import "./FollowSuggestions.css";

const initialsOf = (name) =>
  name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function SharedLine({ shared, hasLogs, onOpenLogs }) {
  if (!hasLogs) {
    return (
      <p className="sg__shared sg__shared--muted">
        <button type="button" className="sg__textlink" onClick={(e) => { e.stopPropagation(); onOpenLogs(); }}>
          Log something
        </button>{" "}
        to see what you have in common.
      </p>
    );
  }
  if (!shared.length) {
    return <p className="sg__shared sg__shared--muted">No overlap yet, but they might surprise you.</p>;
  }
  return (
    <div className="sg__shared">
      <span className="sg__shared-label">You both like</span>
      <div className="sg__chips">
        {shared.slice(0, 2).map((l) => (
          <span key={l.id} className="sg__chip" title={l.title}>{l.title}</span>
        ))}
        {shared.length > 2 && <span className="sg__chip sg__chip--more">+{shared.length - 2}</span>}
      </div>
    </div>
  );
}

export default function FollowSuggestions({ people, hasLogs, onOpen, onRefresh, onOpenLogs }) {
  return (
    <section className="sg" aria-label="People you may click with">
      <div className="sg__head">
        <div>
          <h2 className="sg__title">People you may click with</h2>
          <p className="sg__sub">Ranked by what you both log. Open a profile to see their shelf.</p>
        </div>
        <button type="button" className="sg__refresh" onClick={onRefresh}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 11a8 8 0 00-14.5-4M4 4v4h4M4 13a8 8 0 0014.5 4M20 20v-4h-4" />
          </svg>
          Refresh
        </button>
      </div>

      <ul className="sg__grid">
        {people.map((p) => (
          <li key={p.id}>
            <article className="sg__card" onClick={() => onOpen(p.id)}>
              <div className="sg__top">
                <span className="sg__avatar" style={{ background: p.color }} aria-hidden="true">
                  {initialsOf(p.name)}
                </span>
                <div className="sg__who">
                  <h3 className="sg__name">
                    <button type="button" className="sg__name-btn" onClick={(e) => { e.stopPropagation(); onOpen(p.id); }}>
                      {p.name}
                    </button>
                  </h3>
                  <p className="sg__program">{p.program}</p>
                </div>
              </div>

              <SharedLine shared={p.shared} hasLogs={hasLogs} onOpenLogs={onOpenLogs} />

              <div className="sg__logs">
                <span className="sg__logs-label">Also enjoys…</span>
                <ul className="sg__strip">
                  {p.logs.slice(0, 4).map((l) => (
                    <li key={l.id} title={l.title}>
                      <MediaCover item={l} />
                    </li>
                  ))}
                </ul>
              </div>

              <button type="button" className="sg__view" onClick={(e) => { e.stopPropagation(); onOpen(p.id); }}
                aria-label={`View ${p.name}'s profile`}>
                View profile
              </button>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
