import { useState } from "react";
import { changePassword } from "../lib/auth";
import "./Settings.css";

const VISIBILITY = ["My campus", "My college only", "People I’ve logged", "Just me"];

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="st__toggle">
      <span>{label}<small>{hint}</small></span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}

export default function Settings({ email, profile, settings, onSettings, onProfile, onSignOut, onDelete }) {
  const [pw, setPw] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState(null);
  const [confirm, setConfirm] = useState(false);

  const savePassword = async (e) => {
    e.preventDefault();
    if (pw.next.length < 8) return setMsg({ ok: false, text: "Use at least 8 characters." });
    try {
      await changePassword(email, pw.current, pw.next);
      setPw({ current: "", next: "" });
      setMsg({ ok: true, text: "Password updated." });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };

  return (
    <div className="st">
      <h1 className="st__title">Settings</h1>

      <section className="st__card" aria-label="Account">
        <h2>Account</h2>
        <p className="st__row"><span>Email</span><strong>{email}</strong></p>
        <form className="st__form" onSubmit={savePassword}>
          <label>Current password
            <input type="password" autoComplete="current-password" value={pw.current}
              onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} /></label>
          <label>New password
            <input type="password" autoComplete="new-password" value={pw.next}
              onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} /></label>
          {msg && <p className={msg.ok ? "st__ok" : "st__bad"} role="status">{msg.text}</p>}
          <button type="submit" className="st__btn" disabled={!pw.current || !pw.next}>Update password</button>
        </form>
      </section>

      <section className="st__card" aria-label="Privacy">
        <h2>Privacy</h2>
        <label className="st__select">Who can see your profile
          <select value={profile.visibility} onChange={(e) => onProfile({ ...profile, visibility: e.target.value })}>
            {VISIBILITY.map((v) => <option key={v}>{v}</option>)}
          </select>
        </label>
      </section>

      <section className="st__card" aria-label="Preferences">
        <h2>Preferences</h2>
        <Toggle label="Message notifications" hint="Get notified when someone replies to you."
          checked={settings.notifyMessages} onChange={(v) => onSettings({ notifyMessages: v })} />
        <Toggle label="Reduce animations" hint="Turns off motion across the site."
          checked={settings.reduceMotion} onChange={(v) => onSettings({ reduceMotion: v })} />
      </section>

      <section className="st__card" aria-label="Session">
        <h2>Session</h2>
        <div className="st__actions">
          <button type="button" className="st__btn st__btn--ghost" onClick={onSignOut}>Sign out</button>
          {!confirm && <button type="button" className="st__btn st__btn--danger" onClick={() => setConfirm(true)}>Delete account</button>}
        </div>
        {confirm && (
          <div className="st__confirm" role="alertdialog" aria-label="Confirm account deletion">
            <p>This permanently deletes your account, logs and messages. This can’t be undone.</p>
            <div className="st__actions">
              <button type="button" className="st__btn st__btn--solid-danger" onClick={onDelete}>Yes, delete everything</button>
              <button type="button" className="st__btn st__btn--ghost" onClick={() => setConfirm(false)}>Keep my account</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
