import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
import ProfileView from "./components/ProfileView";
import "./App.css";

function HomeView() {
  return (
    <>
      {/* Left main area: Suggestions */}
      <section className="suggestions-section">
        <FollowSuggestions />
      </section>

      {/* Right side panel: Upcoming Events */}
      <aside className="events-sidebar">
        <UpcomingEvents />
      </aside>
    </>
  );
}

// Placeholder pages: replace with your real components later
function PlaceholderView({ title }) {
  return (
    <section className="suggestions-section" style={{ gridColumn: "1 / -1" }}>
      <h2>{title}</h2>
      <p>Coming soon.</p>
    </section>
  );
}

const INITIAL_PROFILE = {
  name: "Sam Reyes",
  program: "BS Computer Science",
  handle: "samreyes",
  pronouns: "she/her",
  description:
    "Third-year who codes at night and boulders on weekends. Always down for board games and lo-fi playlists.",
  visibility: "My campus",
  avatar: "/avatars/1.png",
  socials: [
    { type: "instagram", value: "samreyes" },
    { type: "tiktok", value: "samreyes" },
    { type: "discord", value: "samreyes" },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  const views = {
    home: <HomeView />,
    logs: <PlaceholderView title="My logs" />,
    insights: <PlaceholderView title="Insights" />,
    profile: <ProfileView profile={profile} onSave={setProfile} />,
  };

  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-container">
      <Header initials={initials} active={activeTab} onChange={setActiveTab} />
      <main className="main-content">{views[activeTab]}</main>
      <Footer />
    </div>
  );
}

export default App;