import ProfileCard from "./ProfileCard";
import InterestCard from "./InterestCard";

export default function ProfileView({ profile, onSave, logs, onOpenLogs }) {
  return (
    <div className="profile-page">
      <ProfileCard profile={profile} onSave={onSave} />
      <InterestCard logs={logs} onOpenLogs={onOpenLogs} />
    </div>
  );
}
