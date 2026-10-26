import MediaCover from "./MediaCover";
import "./InterestCard.css";

const SLOTS = 6;

// First log is the featured pick; the next six fill the grid.
export default function InterestCard({ logs = [], onOpenLogs }) {
  const [featured, ...rest] = logs;
  const shown = rest.slice(0, SLOTS);
  const empty = SLOTS - shown.length;
  const hidden = Math.max(0, logs.length - 1 - SLOTS);

  return (
    <section className="ic" aria-label="Interests">
      <div className="ic__head">
        <h2 className="ic__title">Interest</h2>
        <button type="button" className="ic__link" onClick={onOpenLogs}>
          {logs.length ? `Manage logs (${logs.length})` : "Add your first log"}
        </button>
      </div>

      <div className="ic__body">
        {featured ? (
          <div className="ic__featured-wrap" title={featured.title}>
            <MediaCover item={featured} className="ic__featured" />
            <span className="ic__star">Featured</span>
          </div>
        ) : (
          <button type="button" className="ic__featured ic__empty" onClick={onOpenLogs}
            aria-label="Add a featured interest">
            +
          </button>
        )}

        <ul className="ic__grid">
          {shown.map((item) => (
            <li key={item.id} title={item.title}>
              <MediaCover item={item} />
            </li>
          ))}
          {Array.from({ length: empty }, (_, i) => (
            <li key={`empty-${i}`}>
              <button type="button" className="ic__slot" onClick={onOpenLogs} aria-label="Add an interest">
                +
              </button>
            </li>
          ))}
        </ul>
      </div>

      {hidden > 0 && (
        <button type="button" className="ic__more" onClick={onOpenLogs}>
          +{hidden} more in My logs
        </button>
      )}
    </section>
  );
}
