import ProfileCard from "./ProfileCard";
import InterestCard from "./InterestCard";

export default function ProfileView({ profile, onSave, logs, onOpenLogs, stats, onOpenStats }) {
  return (
    <div className="profile-page">
      <ProfileCard profile={profile} onSave={onSave} stats={stats} onOpenStats={onOpenStats} />
      <InterestCard logs={logs} onOpenLogs={onOpenLogs} />
    </div>
  );
}
