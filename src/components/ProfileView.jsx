import ProfileCard from "./ProfileCard";
import InterestCard from "./InterestCard";

export default function ProfileView({ profile, onSave }) {
  return (
    <div className="profile-page">
      <ProfileCard profile={profile} onSave={onSave} />
      <InterestCard />
    </div>
  );
}
