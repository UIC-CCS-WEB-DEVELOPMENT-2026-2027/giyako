import MediaCover from "./MediaCover";
import Footer from "./Footer";
import "./Landing.css";

const SAMPLE = [
  { id: "a", title: "Interstellar", media_type: "movie" },
  { id: "b", title: "Hades", media_type: "game" },
  { id: "c", title: "Currents", media_type: "music" },
  { id: "d", title: "Dune", media_type: "book" },
];
const STEPS = [
  ["Log what you love", "Movies, shows, anime, games, albums, books. Add the ones you keep coming back to."],
  ["See who overlaps", "Your home page ranks people on campus by how much of your taste they share."],
  ["Say hi", "Open a profile, spot what you have in common, and start with that."],
];

export default function Landing({ onLogin, onSignup }) {
  return (
    <div className="ld">
      <header className="ld__bar">
        <a href="/" className="ld__brand" onClick={(e) => e.preventDefault()}>
          <span className="ld__logo" aria-hidden="true">g</span>giyako.
        </a>
        <nav className="ld__nav">
          <button type="button" className="ld__link" onClick={onLogin}>Log in</button>
          <button type="button" className="ld__btn" onClick={onSignup}>Sign up</button>
        </nav>
      </header>

      <main>
        <section className="ld__hero">
          <div className="ld__copy">
            <h1>Find your people through what you love.</h1>
            <p>
              Log the shows, games, albums and books you can’t stop talking about. Giyako shows you
              who on campus shares your taste.
            </p>
            <div className="ld__cta">
              <button type="button" className="ld__btn ld__btn--lg" onClick={onSignup}>Create your profile</button>
              <button type="button" className="ld__link" onClick={onLogin}>I already have an account</button>
            </div>
          </div>
          <div className="ld__stack" aria-hidden="true">
            {SAMPLE.map((s, i) => (
              <div key={s.id} className={`ld__card ld__card--${i}`}><MediaCover item={s} /></div>
            ))}
            <span className="ld__chip">You both like Dune</span>
          </div>
        </section>

        <section className="ld__how" aria-label="How it works">
          <h2>How it works</h2>
          <ol>
            {STEPS.map(([t, d]) => (
              <li key={t}><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
          <button type="button" className="ld__btn ld__btn--lg" onClick={onSignup}>Get started</button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
