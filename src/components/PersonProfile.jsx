import { useMemo } from "react";
import ProfileCard from "./ProfileCard";
import LogShowcase from "./LogShowcase";
import "./PersonProfile.css";

export default function PersonProfile({ person, myLogs, onBack, onMessage }) {
  const mine = useMemo(() => new Set(myLogs.map((l) => l.id)), [myLogs]);
  const shared = useMemo(() => person.logs.filter((l) => mine.has(l.id)), [person.logs, mine]);
  const first = person.name.split(" ")[0];

  const nothingShared =
    myLogs.length === 0 ? (
      <>
        You haven’t logged anything yet. Add some in <strong>My logs</strong> to see what you share with {first}.
      </>
    ) : (
      `Nothing in common yet. Maybe ${first} has your next favorite.`
    );

  return (
    <div className="pp">
      <button type="button" className="pp__back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Back to Home
      </button>

      <ProfileCard profile={person} readOnly onSave={() => {}} onMessage={onMessage} />

      {/* key resets the filter when you jump from one profile to another */}
      <LogShowcase
        key={`shared-${person.id}`}
        title="You both like"
        logs={shared}
        featured={false}
        emptyText={nothingShared}
      />

      <LogShowcase
        key={`logs-${person.id}`}
        title={`${first}’s logs`}
        logs={person.logs}
        sharedIds={mine}
        emptyText={`${first} hasn’t logged anything yet.`}
      />
    </div>
  );
}
