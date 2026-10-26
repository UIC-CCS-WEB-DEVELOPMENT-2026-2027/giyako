import { useState } from "react";
import { YEARS } from "../lib/years";
import "./Auth.css";

// Shown once to existing accounts that don't have a year level yet
export default function YearPrompt({ onSave, onSignOut }) {
  const [year, setYear] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!year) return setErr("Choose your year to continue.");
    onSave(year);
  };

  return (
    <div className="au">
      <aside className="au__side">
        <span className="au__brand">giyako.</span>
        <p className="au__tag">Where U and I, Connect.</p>
      </aside>
      <main className="au__main">
        <form className="au__card" onSubmit={submit}>
          <h1>Which year are you in?</h1>
          <p className="au__sub">Giyako now shows your year on your profile so people know where you’re at. It only takes a second.</p>

          <div className="au__years" role="radiogroup" aria-label="Year level">
            {YEARS.map((y) => (
              <button key={y.id} type="button" role="radio" aria-checked={year === y.id}
                className={`au__year ${year === y.id ? "is-on" : ""}`}
                onClick={() => { setYear(y.id); setErr(""); }}>
                {y.label}
              </button>
            ))}
          </div>

          {err && <p className="au__error" role="alert">{err}</p>}
          <div className="au__actions">
            <button type="submit" className="au__btn">Continue</button>
          </div>
          <button type="button" className="au__later" onClick={onSignOut}>Sign out</button>
        </form>
      </main>
    </div>
  );
}
