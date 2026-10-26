import ProfileCard from "./ProfileCard";
import MediaCover from "./MediaCover";
import { MEDIA_TYPES } from "../lib/media";
import "./PersonProfile.css";

export default function PersonProfile({ person, myLogs, onBack }) {
  const mine = new Set(myLogs.map((l) => l.id));
  const shared = person.logs.filter((l) => mine.has(l.id));
  const first = person.name.split(" ")[0];
  const featuredId = person.logs[0]?.id;

  const groups = MEDIA_TYPES.map((t) => ({
    ...t,
    items: person.logs.filter((l) => l.media_type === t.id),
  })).filter((g) => g.items.length);

  return (
    <div className="pp">
      <button type="button" className="pp__back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Back to Home
      </button>

      <ProfileCard profile={person} readOnly onSave={() => {}} />

      <section className="pp__card" aria-label="What you have in common">
        <h2 className="pp__title">
          You both like <span className="pp__count">{shared.length}</span>
        </h2>
        {myLogs.length === 0 ? (
          <p className="pp__empty">
            You haven't logged anything yet. Add some in <strong>My logs</strong> to see what you share with {first}.
          </p>
        ) : shared.length === 0 ? (
          <p className="pp__empty">Nothing in common yet. Maybe {first} has your next favorite.</p>
        ) : (
          <ul className="pp__shelf">
            {shared.map((l) => (
              <li key={l.id} className="pp__tile">
                <MediaCover item={l} />
                <span className="pp__name" title={l.title}>{l.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pp__card" aria-label={`${first}'s logs`}>
        <h2 className="pp__title">
          {first}&rsquo;s logs <span className="pp__count">{person.logs.length}</span>
        </h2>
        {groups.map((g) => (
          <div key={g.id} className="pp__group">
            <h3 className="pp__group-title">
              {g.label} <span>{g.items.length}</span>
            </h3>
            <ul className="pp__shelf">
              {g.items.map((l) => (
                <li key={l.id} className="pp__tile">
                  <MediaCover item={l} />
                  {l.id === featuredId && <span className="pp__badge pp__badge--star">Featured</span>}
                  {mine.has(l.id) && <span className="pp__badge pp__badge--shared">Shared</span>}
                  <span className="pp__name" title={l.title}>{l.title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
