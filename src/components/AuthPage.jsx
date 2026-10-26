import { useState } from "react";
import { isEmail, logIn, signUp } from "../lib/auth";
import InfoDialog from "./InfoDialog";
import "./Auth.css";

const COPY = {
  login: { title: "Welcome back", sub: "Log in to see who shares your taste.", cta: "Log in" },
  signup: { title: "Create your account", sub: "Use your campus email so people on campus can find you.", cta: "Create account" },
  reset: { title: "Reset your password", sub: "Enter your email and we’ll send you a reset link.", cta: "Send reset link" },
};

export default function AuthPage({ mode, onMode, onBack, onDone }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null); // which info page is open: "terms" | "privacy" | null
  const c = COPY[mode];

  const switchTo = (m) => { setError(""); setSent(false); onMode(m); };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isEmail(email)) return setError("Enter a valid email address.");
    if (mode === "reset") return setSent(true); // mock: a real backend sends the email
    if (mode === "signup" && password.length < 8) return setError("Use at least 8 characters for your password.");
    if (mode === "signup" && !agree) return setError("Please agree to the Terms and Privacy Policy.");
    if (!password) return setError("Enter your password.");
    setBusy(true);
    try {
      onDone(await (mode === "signup" ? signUp(email, password) : logIn(email, password)));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="au">
      <aside className="au__side">
        <button type="button" className="au__brand" onClick={onBack}>giyako.</button>
        <p className="au__tag">Where U and I, Connect.</p>
      </aside>

      <main className="au__main">
        <form className="au__card" onSubmit={submit} noValidate>
          <h1>{c.title}</h1>
          <p className="au__sub">{c.sub}</p>

          {sent ? (
            <p className="au__note" role="status">If an account exists for {email}, a reset link is on its way.</p>
          ) : (
            <>
              <label className="au__field">
                <span>Email</span>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" autoFocus />
              </label>

              {mode !== "reset" && (
                <label className="au__field">
                  <span>Password</span>
                  <span className="au__pw">
                    <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "signup" ? "new-password" : "current-password"} />
                    <button type="button" onClick={() => setShow((s) => !s)} aria-pressed={show}>{show ? "Hide" : "Show"}</button>
                  </span>
                  {mode === "signup" && <small>At least 8 characters.</small>}
                </label>
              )}

              {mode === "signup" && (
                <label className="au__check">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <span>
                    I agree to the{" "}
                    <button type="button" className="au__linkbtn" onClick={() => setInfo("terms")}>Terms</button>
                    {" "}and{" "}
                    <button type="button" className="au__linkbtn" onClick={() => setInfo("privacy")}>Privacy Policy</button>.
                  </span>
                </label>
              )}

              {error && <p className="au__error" role="alert">{error}</p>}
              <button type="submit" className="au__btn" disabled={busy}>{busy ? "One moment…" : c.cta}</button>
            </>
          )}

          <div className="au__links">
            {mode === "login" && <button type="button" onClick={() => switchTo("reset")}>Forgot password?</button>}
            {mode === "signup" ? (
              <p>Already have an account? <button type="button" onClick={() => switchTo("login")}>Log in</button></p>
            ) : (
              <p>{mode === "reset" ? "Remembered it?" : "New here?"}{" "}
                <button type="button" onClick={() => switchTo(mode === "reset" ? "login" : "signup")}>
                  {mode === "reset" ? "Log in" : "Create an account"}
                </button>
              </p>
            )}
          </div>
        </form>
      </main>

      <InfoDialog page={info} onPage={setInfo} onClose={() => setInfo(null)} />
    </div>
  );
}
