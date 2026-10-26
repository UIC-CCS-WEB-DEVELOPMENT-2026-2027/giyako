import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProfileSearch from "./components/ProfileSearch";
import FollowSuggestions from "./components/FollowSuggestions";
import UpcomingEvents from "./components/UpcomingEvents";
import ProfileView from "./components/ProfileView";
import PersonProfile from "./components/PersonProfile";
import MyLogs from "./components/MyLogs";
import Messages from "./components/Messages";
import Settings from "./components/Settings";
import CampusHub from "./components/CampusHub";
import FollowList from "./components/FollowList";
import { loadNotifs, saveNotifs, newNotif } from "./lib/notifications";
import { loadSettings, saveSettings } from "./lib/settings";
import { loadThreads, saveThreads, newMessage, unreadCount } from "./lib/messages";
import { loadLogs, saveLogs, toLog, searchMedia } from "./lib/media";
import { MOCK_PROFILES } from "./lib/mockProfiles";
import { loadFollowing, saveFollowing, buildGraph, statsFor, sharedConnections } from "./lib/follows";
import "./App.css";

const SUGGESTIONS_SHOWN = 6;

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function HomeView({ firstName, people, logs, onOpenPerson, onMessage, onOpenLogs }) {
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
        <div className="home__search">
          <ProfileSearch people={people} onSelect={onOpenPerson} />
        </div>
      </header>

      <FollowSuggestions
        people={ranked}
        hasLogs={logs.length > 0}
        onOpen={onOpenPerson}
        onMessage={onMessage}
        onRefresh={() => setSeed((s) => s + 1)}
        onOpenLogs={onOpenLogs}
      />

      <aside className="home__side">
        <UpcomingEvents />
      </aside>
    </div>
  );
}

function App({ initialProfile, email, onProfileChange, onLogout, onDeleteAccount }) {
  const [activeTab, setActiveTab] = useState("home");
  const [viewingId, setViewingId] = useState(null);
  const [profile, setProfile] = useState(initialProfile);
  const [logs, setLogs] = useState(loadLogs);
  const [posters, setPosters] = useState({});
  const [threads, setThreads] = useState(loadThreads);
  const [chatId, setChatId] = useState(undefined); // undefined = most recent, null = list only
  const [typing, setTyping] = useState({});
  const replyTimers = useRef(new Map());
  const [notifs, setNotifs] = useState(loadNotifs);
  const [settings, setSettings] = useState(loadSettings);
  const [following, setFollowing] = useState(loadFollowing);
  const [statsOpen, setStatsOpen] = useState(null); // { ownerId, kind } while the follow list is open
  // Latest values for use inside the delayed mock reply
  const live = useRef({});
  live.current = { settings, tab: activeTab, chat: chatId };

  useEffect(() => saveLogs(logs), [logs]);
  useEffect(() => saveThreads(threads), [threads]);
  useEffect(() => saveNotifs(notifs), [notifs]);
  useEffect(() => saveFollowing(following), [following]);
  useEffect(() => {
    saveSettings(settings);
    document.documentElement.dataset.motion = settings.reduceMotion ? "reduced" : "";
  }, [settings]);
  useEffect(() => {
    const timers = replyTimers.current;
    return () => timers.forEach(clearTimeout);
  }, []);

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

  const graph = useMemo(() => buildGraph(people, following), [people, following]);
  // Everyone who can appear in a follow list, you included
  const directory = useMemo(
    () => ({
      me: { id: "me", name: profile.name, handle: profile.handle, color: profile.color ?? "#1f4a3a", avatar: profile.avatar, year: profile.year },
      ...Object.fromEntries(people.map((p) => [p.id, p])),
    }),
    [people, profile]
  );
  const toggleFollow = (id) =>
    setFollowing((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const addLog = (item) =>
    setLogs((prev) => (prev.some((l) => l.id === item.id) ? prev : [...prev, toLog(item)]));
  const removeLog = (id) => setLogs((prev) => prev.filter((l) => l.id !== id));
  // The first log is the featured pick on the profile
  const featureLog = (id) =>
    setLogs((prev) => {
      const target = prev.find((l) => l.id === id);
      return target ? [target, ...prev.filter((l) => l.id !== id)] : prev;
    });

  const unread = Object.values(threads).reduce((n, t) => n + unreadCount(t), 0);

  const ensureThread = (id) =>
    setThreads((prev) =>
      prev[id] ? prev : { ...prev, [id]: { created: Date.now(), lastRead: Date.now(), messages: [] } }
    );

  // Open Messages on a specific person (starting the chat if it doesn't exist yet)
  const startChat = (id) => {
    ensureThread(id);
    setChatId(id);
    setActiveTab("messages");
    window.scrollTo({ top: 0 });
  };

  // Selecting inside the Messages tab (null = back to the list on phones)
  const selectChat = (id) => {
    if (id) ensureThread(id);
    setChatId(id);
  };

  const markRead = useCallback((id) => {
    setThreads((prev) => {
      const t = prev[id];
      return t ? { ...prev, [id]: { ...t, lastRead: Date.now() } } : prev;
    });
  }, []);

  const sendMessage = (id, text) => {
    const clean = text.trim();
    if (!clean) return;
    const now = Date.now();
    setThreads((prev) => {
      const t = prev[id] ?? { created: now, lastRead: now, messages: [] };
      return { ...prev, [id]: { ...t, lastRead: now, messages: [...t.messages, newMessage("me", clean, now)] } };
    });

    // Mock reply until there is a real messaging backend
    if (replyTimers.current.has(id)) return;
    const person = MOCK_PROFILES.find((p) => p.id === id);
    if (!person?.replies?.length) return;
    setTyping((prev) => ({ ...prev, [id]: true }));
    const timer = setTimeout(() => {
      replyTimers.current.delete(id);
      setTyping((prev) => ({ ...prev, [id]: false }));
      const { settings: s, tab, chat } = live.current;
      if (s.notifyMessages && !(tab === "messages" && chat === id)) {
        setNotifs((prev) => [
          newNotif({ kind: "message", personId: id, text: `${person.name.split(" ")[0]} replied to your message` }),
          ...prev,
        ]);
      }
      setThreads((prev) => {
        const t = prev[id];
        if (!t) return prev;
        const theirs = t.messages.filter((m) => m.from === "them").length;
        const reply = person.replies[theirs % person.replies.length];
        return { ...prev, [id]: { ...t, messages: [...t.messages, newMessage("them", reply)] } };
      });
    }, 1400 + Math.random() * 1600);
    replyTimers.current.set(id, timer);
  };

  const openPerson = (id) => {
    if (id === "me") {
      setActiveTab("profile");
      window.scrollTo({ top: 0 });
      return;
    }
    setViewingId(id);
    setActiveTab("person");
    window.scrollTo({ top: 0 });
  };

  const openNotif = (n) => {
    setNotifs((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    if (n.kind === "message" && n.personId) startChat(n.personId);
    else setActiveTab("logs");
  };
  const readAllNotifs = () => setNotifs((prev) => prev.map((x) => ({ ...x, read: true })));
  const changeSettings = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const viewing = people.find((p) => p.id === viewingId);
  const myStats = statsFor({ id: "me", statsVisibility: profile.statsVisibility }, "me", graph);
  const viewingStats = viewing ? statsFor(viewing, "me", graph) : null;
  const hasMutuals = viewing ? sharedConnections(graph, "me", viewing.id).length > 0 : false;
  const dialogOwner = statsOpen ? directory[statsOpen.ownerId] : null;
  const dialogStats = !dialogOwner ? null : statsOpen.ownerId === "me" ? myStats : statsFor(dialogOwner, "me", graph);

  const views = {
    home: (
      <HomeView
        firstName={profile.name.split(" ")[0]}
        people={people}
        logs={myLogs}
        onOpenPerson={openPerson}
        onMessage={startChat}
        onOpenLogs={() => setActiveTab("logs")}
      />
    ),
    logs: <MyLogs logs={myLogs} onAdd={addLog} onRemove={removeLog} onFeature={featureLog} />,
    messages: (
      <Messages
        people={people}
        myLogs={myLogs}
        threads={threads}
        typing={typing}
        chatId={chatId}
        onSelect={selectChat}
        onSend={sendMessage}
        onRead={markRead}
        onOpenPerson={openPerson}
      />
    ),
    profile: (
      <ProfileView
        profile={profile}
        onSave={(p) => {
          setProfile(p);
          onProfileChange?.(p);
        }}
        logs={myLogs}
        onOpenLogs={() => setActiveTab("logs")}
        stats={myStats}
        onOpenStats={(kind) => setStatsOpen({ ownerId: "me", kind })}
      />
    ),
    hub: <CampusHub profile={profile} />,
    settings: (
      <Settings
        email={email}
        profile={profile}
        settings={settings}
        onSettings={changeSettings}
        onProfile={(p) => {
          setProfile(p);
          onProfileChange?.(p);
        }}
        onSignOut={onLogout}
        onDelete={onDeleteAccount}
      />
    ),
    person: viewing && (
      <PersonProfile
        person={viewing}
        myLogs={myLogs}
        onBack={() => setActiveTab("home")}
        onMessage={() => startChat(viewing.id)}
        stats={viewingStats}
        following={following.includes(viewing.id)}
        onToggleFollow={() => toggleFollow(viewing.id)}
        hasMutuals={hasMutuals}
        onOpenStats={(kind) => setStatsOpen({ ownerId: viewing.id, kind })}
      />
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
        unread={unread}
        onLogout={onLogout}
        notifs={notifs}
        onNotifOpen={openNotif}
        onNotifReadAll={readAllNotifs}
        onNotifClear={() => setNotifs([])}
      />
      <main className="main-content">
        <div key={`${activeTab}-${activeTab === "person" ? viewingId : ""}`} className="view-enter">
          {views[activeTab] ?? views.home}
        </div>
      </main>
      <Footer />

      <FollowList
        kind={statsOpen?.kind ?? null}
        onKind={(kind) => setStatsOpen((s) => s && { ...s, kind })}
        owner={dialogOwner}
        isMe={statsOpen?.ownerId === "me"}
        stats={dialogStats}
        directory={directory}
        following={following}
        graph={graph}
        onToggleFollow={toggleFollow}
        onOpenPerson={(id) => {
          setStatsOpen(null);
          openPerson(id);
        }}
        onClose={() => setStatsOpen(null)}
      />
    </div>
  );
}

export default App;
