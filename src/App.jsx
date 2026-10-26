import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
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

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const views = {
    home: <HomeView />,
    discover: <PlaceholderView title="Discover" />,
    logs: <PlaceholderView title="My logs" />,
    insights: <PlaceholderView title="Insights" />,
  };

  return (
    <div className="app-container">
      <Header active={activeTab} onChange={setActiveTab} />
      <main className="main-content">{views[activeTab]}</main>
      <Footer />
    </div>
  );
}

export default App;