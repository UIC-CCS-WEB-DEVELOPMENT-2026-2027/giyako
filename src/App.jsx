import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
import "./App.css";

// Dummy account records matching your design structure
const DUMMY_PROFILES = [
  {
    id: "1",
    name: "Person 1",
    course: "BS Computer Science",
    avatar: "👤",
    interests: ["React", "UI/UX", "Mobile Apps"],
  },
  {
    id: "2",
    name: "Person 2",
    course: "BS Information Tech",
    avatar: "👤",
    interests: ["Web Dev", "Networking", "Cloud"],
  },
  {
    id: "3",
    name: "Person 3",
    course: "BS Data Science",
    avatar: "👤",
    interests: ["Machine Learning", "Python", "Analytics"],
  },
  {
    id: "4",
    name: "Alex Rivera",
    course: "BS Computer Engineering",
    avatar: "👤",
    interests: ["Embedded Systems", "IoT", "Robotics"],
  },
  {
    id: "5",
    name: "Sophia Chen",
    course: "BS Information Systems",
    avatar: "👤",
    interests: ["Agile", "Database Management", "Product Design"],
  },
];

function HomeView({ searchQuery }) {
  // Filter dummy profiles based on name, course, or interests
  const filteredProfiles = DUMMY_PROFILES.filter((profile) => {
    const q = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(q) ||
      profile.course.toLowerCase().includes(q) ||
      profile.interests.some((interest) => interest.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* Left main area: Suggestions */}
      <section className="suggestions-section">
        <FollowSuggestions profiles={filteredProfiles} searchQuery={searchQuery} />
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

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const views = {
    home: <HomeView searchQuery={searchQuery} />,
    discover: <PlaceholderView title="Discover" />,
    logs: <PlaceholderView title="My logs" />,
    insights: <PlaceholderView title="Insights" />,
  };

  return (
    <div className="app-container">
      <Header
        active={activeTab}
        onChange={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search profiles..."
      />
      <main className="main-content">{views[activeTab]}</main>
      <Footer />
    </div>
  );
}

export default App;