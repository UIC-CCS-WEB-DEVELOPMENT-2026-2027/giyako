import Header from "./components/Header";
import Footer from "./components/Footer";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* Left main area: Suggestions */}
        <section className="suggestions-section">
          <FollowSuggestions />
        </section>

        {/* Right side panel: Upcoming Events */}
        <aside className="events-sidebar">
          <UpcomingEvents />
        </aside>
      </main>
      <Footer />
    </div>
  );
}

export default App;