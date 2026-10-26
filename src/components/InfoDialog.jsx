import { useEffect, useRef } from "react";
import { LAST_UPDATED, PAGES, PAGE_ORDER } from "../lib/legal";
import "./InfoDialog.css";

// A modal that shows About / Privacy / Terms / Contact. Open it by passing a page id
// ("about", "privacy", "terms" or "contact"); pass null to keep it closed.
export default function InfoDialog({ page, onPage, onClose }) {
  const ref = useRef(null);

  // The native <dialog> gives us focus trapping, Esc to close and a backdrop for free
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (page && !d.open) d.showModal();
    if (!page && d.open) d.close();
  }, [page]);

  const p = page ? PAGES[page] : null;

  return (
    <dialog
      ref={ref}
      className="info"
      aria-labelledby="info-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {p && (
        <div className="info__box">
          <header className="info__head">
            <nav className="info__tabs" aria-label="Information pages">
              {PAGE_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={id === page ? "is-active" : ""}
                  aria-current={id === page ? "page" : undefined}
                  onClick={() => onPage(id)}
                >
                  {PAGES[id].label}
                </button>
              ))}
            </nav>
            <button type="button" className="info__close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          {/* key resets the scroll position when you switch pages */}
          <article className="info__body" key={page}>
            <h1 id="info-title">{p.title}</h1>
            {p.updated && <p className="info__updated">Last updated {LAST_UPDATED}</p>}
            {p.intro && <p className="info__intro">{p.intro}</p>}

            {p.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p?.map((t, i) => <p key={i}>{t}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                )}
              </section>
            ))}

            {p.email && (
              <a className="info__mail" href={`mailto:${p.email}`}>{p.email}</a>
            )}
          </article>
        </div>
      )}
    </dialog>
  );
}
