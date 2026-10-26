import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
import ProfileView from "./components/ProfileView";
import PersonProfile from "./components/PersonProfile";
import MyLogs from "./components/MyLogs";
import { loadLogs, saveLogs, toLog, searchMedia } from "./lib/media";
import { MOCK_PROFILES } from "./lib/mockProfiles";
import "./App.css";

const SUGGESTIONS_SHOWN = 6;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomeView({ firstName, people, logs, onOpenPerson, onOpenLogs }) {
  const [seed, setSeed] = useState(0);

  const mine = useMemo(() => new Set(logs.map((l) => l.id)), [logs]);

  // Rank by shared logs; Refresh reshuffles people who tie
  const ranked = useMemo(() => {
    const jitter = (id) => {
      let h = seed * 2654435761;
      for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
      return (h % 1000) / 1000;
    };
    return people
      .map((p) => ({ ...p, shared: p.logs.filter((l) => mine.has(l.id)) }))
      .sort((a, b) => b.shared.length - a.shared.length || jitter(a.id) - jitter(b.id))
      .slice(0, SUGGESTIONS_SHOWN);
  }, [people, mine, seed]);

  const overlapCount = ranked.filter((p) => p.shared.length).length;

  return (
    <div className="home">
      <header className="home__hero">
        <h1 className="home__title">
          {greeting()}, {firstName}
        </h1>
        <p className="home__sub">
          {logs.length === 0
            ? "Log a few things you love and we'll show who on campus shares your taste."
            : `${logs.length} ${logs.length === 1 ? "thing" : "things"} logged · ${overlapCount} ${
                overlapCount === 1 ? "person shares" : "people share"
              } your interests`}
        </p>
      </header>

      <FollowSuggestions
        people={ranked}
        hasLogs={logs.length > 0}
        onOpen={onOpenPerson}
        onRefresh={() => setSeed((s) => s + 1)}
        onOpenLogs={onOpenLogs}
      />

      <aside className="home__side">
        <UpcomingEvents />
      </aside>
    </div>
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
  const [viewingId, setViewingId] = useState(null);
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [logs, setLogs] = useState(loadLogs);
  const [posters, setPosters] = useState({});

  useEffect(() => saveLogs(logs), [logs]);

  // Pull poster art from the backend catalog once; everything else works without it
  useEffect(() => {
    const controller = new AbortController();
    searchMedia({ query: "", type: "all" }, controller.signal)
      .then((items) =>
        setPosters(Object.fromEntries(items.filter((i) => i.poster_url).map((i) => [i.id, i.poster_url])))
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const withPoster = (l) => (posters[l.id] ? { ...l, poster_url: posters[l.id] } : l);
  const myLogs = useMemo(() => logs.map(withPoster), [logs, posters]); // eslint-disable-line react-hooks/exhaustive-deps
  const people = useMemo(
    () => MOCK_PROFILES.map((p) => ({ ...p, logs: p.logs.map(withPoster) })),
    [posters] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const addLog = (item) =>
    setLogs((prev) => (prev.some((l) => l.id === item.id) ? prev : [...prev, toLog(item)]));
  const removeLog = (id) => setLogs((prev) => prev.filter((l) => l.id !== id));
  // The first log is the featured pick on the profile
  const featureLog = (id) =>
    setLogs((prev) => {
      const target = prev.find((l) => l.id === id);
      return target ? [target, ...prev.filter((l) => l.id !== id)] : prev;
    });

  const openPerson = (id) => {
    setViewingId(id);
    setActiveTab("person");
    window.scrollTo({ top: 0 });
  };

  const viewing = people.find((p) => p.id === viewingId);

  const views = {
    home: (
      <HomeView
        firstName={profile.name.split(" ")[0]}
        people={people}
        logs={myLogs}
        onOpenPerson={openPerson}
        onOpenLogs={() => setActiveTab("logs")}
      />
    ),
    logs: <MyLogs logs={myLogs} onAdd={addLog} onRemove={removeLog} onFeature={featureLog} />,
    profile: (
      <ProfileView
        profile={profile}
        onSave={setProfile}
        logs={myLogs}
        onOpenLogs={() => setActiveTab("logs")}
      />
    ),
    person: viewing && (
      <PersonProfile person={viewing} myLogs={myLogs} onBack={() => setActiveTab("home")} />
    ),
  };

  const initials = profile.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="app-container">
      <Header
        initials={initials}
        active={activeTab === "person" ? "home" : activeTab}
        onChange={setActiveTab}
        people={people}
        onOpenPerson={openPerson}
      />
      <main className="main-content">{views[activeTab] ?? views.home}</main>
      <Footer />
    </div>
  );
}

export default App;
