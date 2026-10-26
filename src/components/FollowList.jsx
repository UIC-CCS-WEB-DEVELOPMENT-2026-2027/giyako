import { useEffect, useRef } from "react";
import { STAT_KINDS } from "../lib/follows";
import { yearLabel } from "../lib/years";
import "./FollowList.css";

const initialsOf = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ person }) {
  return person.avatar ? (
    <img className="fl__av" src={person.avatar} alt="" />
  ) : (
    <span className="fl__av" style={{ background: person.color }} aria-hidden="true">
      {initialsOf(person.name)}
    </span>
  );
}

// Modal with the Followers / Following / Mutuals of one person. `kind` is the open tab (null = closed).
export default function FollowList({
  kind, onKind, owner, isMe, stats, directory, following, graph, onToggleFollow, onOpenPerson, onClose,
}) {
  const ref = useRef(null);
  const open = !!kind && !!owner && !!stats;

  // The native <dialog> gives focus trapping, Esc to close and a backdrop for free
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const first = owner?.name.split(" ")[0];
  const current = open ? stats[kind] : null;
  const people = current?.visible ? current.ids.map((id) => directory[id]).filter(Boolean) : [];

  const empty = {
    followers: isMe ? "No followers yet. Log a few things you love and people will find you." : `${first} has no followers yet.`,
    following: isMe ? "You aren’t following anyone yet. Open a profile and tap follow." : `${first} isn’t following anyone yet.`,
  };

  return (
    <dialog ref={ref} className="fl" aria-labelledby="fl-title" onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}>
      {open && (
        <div className="fl__box">
          <header className="fl__head">
            <h2 id="fl-title" className="fl__title">{isMe ? "Your people" : `${first}’s people`}</h2>
            <button type="button" className="fl__close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div className="fl__tabs" role="tablist" aria-label="Follow lists">
            {STAT_KINDS.map((t) => (
              <button key={t.id} type="button" role="tab" aria-selected={kind === t.id}
                className={`fl__tab ${kind === t.id ? "is-active" : ""}`} onClick={() => onKind(t.id)}>
                {t.label}
                {stats[t.id].visible && <span>{stats[t.id].count}</span>}
              </button>
            ))}
          </div>

          <div className="fl__body" role="tabpanel">
            {!current.visible ? (
              <p className="fl__empty">{first} keeps this private.</p>
            ) : people.length === 0 ? (
              <p className="fl__empty">{empty[kind]}</p>
            ) : (
              <>
                <ul className="fl__list">
                  {people.map((p) => {
                    const isSelf = p.id === "me";
                    const iFollow = following.includes(p.id);
                    const followsMe = !!graph.get(p.id)?.has("me");
                    return (
                      <li key={p.id} className="fl__row">
                        <button type="button" className="fl__who" onClick={() => onOpenPerson(p.id)}>
                          <Avatar person={p} />
                          <span className="fl__text">
                            <strong>{isSelf ? `${p.name} (you)` : p.name}</strong>
                            <small>@{p.handle}{p.year ? ` · ${yearLabel(p.year)}` : ""}{!isSelf && followsMe ? " · Follows you" : ""}</small>
                          </span>
                        </button>
                        {!isSelf && (
                          <button type="button" className={`fl__btn ${iFollow ? "is-on" : ""}`}
                            aria-pressed={iFollow} aria-label={`${iFollow ? "Unfollow" : "Follow"} ${p.name}`}
                            onClick={() => onToggleFollow(p.id)}>
                            {iFollow ? "Following" : followsMe ? "Follow back" : "Follow"}
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
