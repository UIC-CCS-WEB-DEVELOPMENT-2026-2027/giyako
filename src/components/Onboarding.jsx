import { useEffect, useState } from "react";
import MediaCover from "./MediaCover";
import { searchMedia } from "../lib/media";
import { YEARS } from "../lib/years";
import { DEMO_CODE, handleProblem, handleTaken, normalizeHandle, verifyEmail } from "../lib/auth";
import "./Auth.css";

const STEPS = ["verify", "handle", "year", "photo", "about", "links", "interests"];
const TITLES = {
  verify: ["Check your email", "We sent a 6-digit code to confirm it’s you."],
  handle: ["Pick your handle", "This is how people find and mention you. You can change it later."],
  year: ["Which year are you in?", "This shows on your profile so people know where you’re at. Required."],
  photo: ["Add a profile photo", "Faces help people say hi. Optional."],
  about: ["Tell people about you", "A line or two goes a long way. Optional."],
  links: ["Where else can people find you?", "Add the places you’re happy to be found. Optional."],
  interests: ["Pick a few things you love", "These power your matches. You can add more any time in My logs."],
};
const SOCIALS = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["discord", "Discord"]];

// Downscale to 256px so the avatar fits comfortably in storage
const toAvatar = (file) =>
  new Promise((res) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 256 / Math.min(img.width, img.height));
      const c = Object.assign(document.createElement("canvas"), { width: img.width * s, height: img.height * s });
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.85));
    };
    img.src = URL.createObjectURL(file);
  });

export default function Onboarding({ user, onFinish }) {
  const [i, setI] = useState(user.verified ? 1 : 0);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [items, setItems] = useState(null); // null = loading, [] = failed
  const [picks, setPicks] = useState([]);
  const [p, setP] = useState({
    name: "", handle: "", avatar: null, year: "", program: "", pronouns: "", description: "",
    socials: { instagram: "", tiktok: "", discord: "" },
  });
  const step = STEPS[i];
  const set = (k) => (e) => setP((d) => ({ ...d, [k]: e.target.value }));
  const handleMsg = p.handle ? handleProblem(p.handle) || (handleTaken(p.handle, user.email) ? "That handle is taken." : "") : "";

  useEffect(() => {
    if (step !== "interests" || items) return;
    const ctl = new AbortController();
    searchMedia({ query: "", type: "all" }, ctl.signal).then((r) => setItems(r.slice(0, 18))).catch(() => setItems([]));
    return () => ctl.abort();
  }, [step, items]);

  const finish = () => {
    if (!p.year) {
      setI(STEPS.indexOf("year"));
      return setErr("Choose your year to continue.");
    }
    onFinish(
      {
        ...p,
        name: p.name.trim() || p.handle || user.email.split("@")[0],
        handle: p.handle || normalizeHandle(user.email.split("@")[0]),
        color: "#1f4a3a",
        socials: SOCIALS.map(([type]) => ({ type, value: p.socials[type].trim().replace(/^@/, "") })),
      },
      picks
    );
  };

  const next = () => {
    setErr("");
    if (step === "verify") {
      try { verifyEmail(user.email, code); } catch (e) { return setErr(e.message); }
    }
    if (step === "handle" && (!p.handle || handleMsg)) return setErr(handleMsg || "Choose a handle to continue.");
    if (step === "year" && !p.year) return setErr("Choose your year to continue.");
    i === STEPS.length - 1 ? finish() : setI(i + 1);
  };

  const optional = !["verify", "handle", "year"].includes(step);
  const n = i, total = STEPS.length - 1;

  return (
    <div className="au">
      <aside className="au__side">
        <span className="au__brand">giyako.</span>
        <p className="au__tag">Where U and I, Connect.</p>
      </aside>
      <main className="au__main">
        <form className="au__card" onSubmit={(e) => { e.preventDefault(); next(); }}>
          {n > 0 && (
            <div className="au__progress" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={n}
              aria-label={`Step ${n} of ${total}`}>
              {Array.from({ length: total }, (_, k) => <span key={k} className={k < n ? "is-done" : ""} />)}
            </div>
          )}
          <h1>{TITLES[step][0]}</h1>
          <p className="au__sub">{step === "verify" ? <>We sent a 6-digit code to <strong>{user.email}</strong>.</> : TITLES[step][1]}</p>

          {step === "verify" && (
            <>
              <label className="au__field">
                <span>Verification code</span>
                <input inputMode="numeric" maxLength={6} value={code} autoFocus autoComplete="one-time-code"
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
                <small>Demo mode: use {DEMO_CODE}. A real backend emails the code.</small>
              </label>
            </>
          )}

          {step === "handle" && (
            <>
              <label className="au__field">
                <span>Handle</span>
                <span className="au__at"><b>@</b>
                  <input value={p.handle} autoFocus maxLength={24} placeholder="yourhandle"
                    onChange={(e) => setP((d) => ({ ...d, handle: normalizeHandle(e.target.value) }))} />
                </span>
                <small className={handleMsg ? "is-bad" : p.handle ? "is-good" : ""}>
                  {handleMsg || (p.handle ? "Available" : "Letters, numbers, . and _")}
                </small>
              </label>
              <label className="au__field">
                <span>Display name (optional)</span>
                <input value={p.name} maxLength={40} onChange={set("name")} placeholder="How your name appears" />
              </label>
            </>
          )}

          {step === "year" && (
            <div className="au__years" role="radiogroup" aria-label="Year level">
              {YEARS.map((y) => (
                <button key={y.id} type="button" role="radio" aria-checked={p.year === y.id}
                  className={`au__year ${p.year === y.id ? "is-on" : ""}`}
                  onClick={() => { setP((d) => ({ ...d, year: y.id })); setErr(""); }}>
                  {y.label}
                </button>
              ))}
            </div>
          )}

          {step === "photo" && (
            <div className="au__photo">
              {p.avatar ? <img src={p.avatar} alt="Your profile photo preview" /> :
                <span aria-hidden="true">{(p.name || p.handle || "?")[0].toUpperCase()}</span>}
              <label className="au__btn au__btn--ghost">
                {p.avatar ? "Choose another" : "Upload a photo"}
                <input type="file" accept="image/*" hidden onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) { const avatar = await toAvatar(f); setP((d) => ({ ...d, avatar })); }
                }} />
              </label>
            </div>
          )}

          {step === "about" && (
            <>
              <label className="au__field">
                <span>Bio</span>
                <textarea rows={3} maxLength={160} value={p.description} onChange={set("description")}
                  placeholder="What are you into?" />
                <small>{p.description.length}/160</small>
              </label>
              <div className="au__row">
                <label className="au__field"><span>Program</span>
                  <input value={p.program} maxLength={60} onChange={set("program")} placeholder="BS Computer Science" /></label>
                <label className="au__field"><span>Pronouns</span>
                  <input value={p.pronouns} maxLength={16} onChange={set("pronouns")} placeholder="she/her" /></label>
              </div>
            </>
          )}

          {step === "links" &&
            SOCIALS.map(([type, label]) => (
              <label key={type} className="au__field">
                <span>{label}</span>
                <input value={p.socials[type]} maxLength={40} placeholder="username"
                  onChange={(e) => setP((d) => ({ ...d, socials: { ...d.socials, [type]: e.target.value } }))} />
              </label>
            ))}

          {step === "interests" &&
            (items === null ? <p className="au__note" role="status">Loading…</p> :
             items.length === 0 ? <p className="au__note">Couldn’t load the catalog right now. You can add logs later in My logs.</p> : (
              <ul className="au__picks">
                {items.map((it) => {
                  const on = picks.some((x) => x.id === it.id);
                  return (
                    <li key={it.id}>
                      <button type="button" className={on ? "is-on" : ""} aria-pressed={on} title={it.title}
                        onClick={() => setPicks((a) => (on ? a.filter((x) => x.id !== it.id) : [...a, it]))}>
                        <MediaCover item={it} />
                        {on && <b aria-hidden="true">✓</b>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ))}

          {err && <p className="au__error" role="alert">{err}</p>}

          <div className="au__actions">
            <button type="submit" className="au__btn">
              {step === "interests" ? (picks.length ? `Finish (${picks.length} picked)` : "Finish") : "Continue"}
            </button>
            {optional && (
              <button type="button" className="au__btn au__btn--ghost" onClick={() => (step === "interests" ? finish() : setI(i + 1))}>
                Skip for now
              </button>
            )}
          </div>
          {i > STEPS.indexOf("year") && (
            <button type="button" className="au__later" onClick={finish}>Finish setup later</button>
          )}
        </form>
      </main>
    </div>
  );
}
