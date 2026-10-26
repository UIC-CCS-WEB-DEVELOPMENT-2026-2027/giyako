import { useState } from "react";
import App from "../App";
import Landing from "./Landing";
import AuthPage from "./AuthPage";
import Onboarding from "./Onboarding";
import { currentUser, deleteUser, logOut, updateUser } from "../lib/auth";
import { newNotif, saveNotifs } from "../lib/notifications";
import { saveLogs, toLog } from "../lib/media";
import { saveThreads } from "../lib/messages";

const ready = (u) => u.onboarded && u.profile;

// Decides what to show: landing -> log in / sign up -> setup -> the app.
export default function Root() {
  const [user, setUser] = useState(currentUser);
  const [view, setView] = useState(() => (user ? (ready(user) ? "app" : "setup") : "landing"));
  const [mode, setMode] = useState("login");

  const open = (m) => { setMode(m); setView("auth"); };
  const done = (u) => { setUser(u); setView(ready(u) ? "app" : "setup"); };

  const finishSetup = (profile, picks) => {
    // Fresh account: overwrite anything left over from earlier sessions
    saveLogs(picks.map(toLog));
    saveThreads({});
    saveNotifs([newNotif({ kind: "info", text: "Welcome to Giyako! Log a few things you love to see who shares your taste." })]);
    setUser(updateUser(user.email, { onboarded: true, profile }));
    setView("app");
  };

  const deleteAccount = () => {
    deleteUser(user.email);
    saveLogs([]); saveThreads({}); saveNotifs([]);
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
  if (view === "auth") return <AuthPage mode={mode} onMode={setMode} onBack={() => setView("landing")} onDone={done} />;
  return <Landing onLogin={() => open("login")} onSignup={() => open("signup")} />;
}
