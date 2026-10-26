import { useState } from "react";
import App from "../App";
import Landing from "./Landing";
import AuthPage from "./AuthPage";
import Onboarding from "./Onboarding";
import YearPrompt from "./YearPrompt";
import { currentUser, deleteUser, logOut, updateUser } from "../lib/auth";
import { newNotif, saveNotifs } from "../lib/notifications";
import { saveLogs, toLog } from "../lib/media";
import { saveThreads } from "../lib/messages";
import { resetHub } from "../lib/hub";
import { saveFollowing } from "../lib/follows";

const ready = (u) => u.onboarded && u.profile;
// Accounts made before year level existed are asked for it once before entering the app
const stage = (u) => (!ready(u) ? "setup" : u.profile.year ? "app" : "year");

// Decides what to show: landing -> log in / sign up -> setup -> the app.
export default function Root() {
  const [user, setUser] = useState(currentUser);
  const [view, setView] = useState(() => (user ? stage(user) : "landing"));
  const [mode, setMode] = useState("login");

  const open = (m) => { setMode(m); setView("auth"); };
  const done = (u) => { setUser(u); setView(stage(u)); };

  const finishSetup = (profile, picks) => {
    // Fresh account: overwrite anything left over from earlier sessions
    saveLogs(picks.map(toLog));
    saveFollowing([]);
    saveThreads({});
    resetHub();
    saveNotifs([newNotif({ kind: "info", text: "Welcome to Giyako! Log a few things you love to see who shares your taste." })]);
    setUser(updateUser(user.email, { onboarded: true, profile }));
    setView("app");
  };

  const deleteAccount = () => {
    deleteUser(user.email);
    saveLogs([]); saveThreads({}); saveNotifs([]); resetHub(); saveFollowing([]);
    setUser(null); setMode("signup"); setView("landing");
  };

  const signOut = () => { logOut(); setUser(null); setMode("login"); setView("landing"); };

  if (view === "app" && user?.profile) {
    return (
      <App
        initialProfile={user.profile}
        email={user.email}
        onDeleteAccount={deleteAccount}
        onProfileChange={(profile) => updateUser(user.email, { profile })}
        onLogout={signOut}
      />
    );
  }
  if (view === "setup" && user) return <Onboarding user={user} onFinish={finishSetup} />;
  if (view === "year" && user?.profile) {
    return (
      <YearPrompt
        onSave={(year) => {
          setUser(updateUser(user.email, { profile: { ...user.profile, year } }));
          setView("app");
        }}
        onSignOut={signOut}
      />
    );
  }
  if (view === "auth") return <AuthPage mode={mode} onMode={setMode} onBack={() => setView("landing")} onDone={done} />;
  return <Landing onLogin={() => open("login")} onSignup={() => open("signup")} />;
}
