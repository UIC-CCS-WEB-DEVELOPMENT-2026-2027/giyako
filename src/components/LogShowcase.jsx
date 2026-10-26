import { useState } from "react";
import MediaCover from "./MediaCover";
import { MEDIA_TYPES, typeLabel } from "../lib/media";
import "./LogShowcase.css";

// Featured pick + two rows of side tiles on desktop; the rest sits behind "Show more".
const DEFAULT_LIMIT = 13;

function Tile({ item, big = false, isFeatured = false, isShared = false }) {
  return (
    <li className={`sc__tile sc__tile--${item.media_type}${big ? " sc__tile--featured" : ""}`}>
      <div className="sc__cover">
        <MediaCover item={item} />
        {(isFeatured || isShared) && (
          <div className="sc__badges">
            {isFeatured && <span className="sc__badge sc__badge--star">Featured</span>}
            {isShared && <span className="sc__badge sc__badge--shared">Shared</span>}
          </div>
        )}
      </div>
      <div className="sc__cap">
        <span className="sc__name" title={item.title}>{item.title}</span>
        <span className="sc__type">{typeLabel(item.media_type)}</span>
      </div>
    </li>
  );
}

/**
 * One layout for every "things someone logged" card (your profile and other people's).
 *
 * logs       – array of log items; the first one is the featured pick
 * featured   – show the first log as a large spotlight tile (needs 3+ logs)
 * sharedIds  – Set of ids to mark with a "Shared" badge
 * action     – { label, onClick } text button in the header
 * onAdd      – when set, shows a "+" tile at the end and an add button in the empty state
 * emptyText  – node shown when there are no logs
 * limit      – tiles shown before "Show more"
 */
export default function LogShowcase({
  title,
  logs = [],
  featured = true,
  sharedIds = null,
  action = null,
  onAdd = null,
  emptyText = "Nothing logged yet.",
  limit = DEFAULT_LIMIT,
}) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const types = MEDIA_TYPES.map((t) => ({
    ...t,
    count: logs.filter((l) => l.media_type === t.id).length,
  })).filter((t) => t.count);
  const active = types.some((t) => t.id === filter) ? filter : "all";

  const pick = featured && logs.length > 1 ? logs[0] : null;
  const spotlight = pick && logs.length >= 3 && active === "all" ? pick : null;
  const pool =
    active === "all"
      ? spotlight ? logs.slice(1) : logs
      : logs.filter((l) => l.media_type === active);

  const cap = spotlight ? limit - 1 : limit;
  const shown = expanded ? pool : pool.slice(0, cap);
  const hidden = pool.length - shown.length;
  const canToggle = pool.length > cap;

  const tileProps = (item) => ({
    isFeatured: !!pick && item.id === pick.id,
    isShared: !!sharedIds && sharedIds.has(item.id),
  });

  return (
    <section className="sc" aria-label={title}>
      <div className="sc__head">
        <h2 className="sc__title">
          {title} <span className="sc__count">{logs.length}</span>
        </h2>
        {action && (
          <button type="button" className="sc__link" onClick={action.onClick}>
            {action.label}
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="sc__empty">
          <p>{emptyText}</p>
          {onAdd && (
            <button type="button" className="sc__btn" onClick={onAdd}>
              Add your first log
            </button>
          )}
        </div>
      ) : (
        <>
          {types.length > 1 && (
            <div className="sc__chips" role="group" aria-label="Filter by category">
              {[{ id: "all", label: "All", count: logs.length }, ...types].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`sc__chip ${active === t.id ? "is-active" : ""}`}
                  aria-pressed={active === t.id}
                  onClick={() => setFilter(t.id)}
                >
                  {t.label} <span>{t.count}</span>
                </button>
              ))}
            </div>
          )}

          <ul className="sc__grid">
            {spotlight && <Tile key={spotlight.id} item={spotlight} big {...tileProps(spotlight)} />}
            {shown.map((item) => (
              <Tile key={item.id} item={item} {...tileProps(item)} />
            ))}
            {onAdd && active === "all" && hidden === 0 && (
              <li className="sc__tile">
                <button type="button" className="sc__add" onClick={onAdd} aria-label="Add another log">
                  +
                </button>
              </li>
            )}
          </ul>

          {canToggle && (
            <button
              type="button"
              className="sc__more"
              aria-expanded={expanded}
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? "Show less" : `Show ${hidden} more`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
