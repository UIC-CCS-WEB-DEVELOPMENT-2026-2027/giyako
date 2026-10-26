import { useEffect, useRef, useState } from "react";
import { ago } from "../lib/notifications";
import "./NotificationBell.css";

const Svg = ({ children, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export default function NotificationBell({ items = [], onOpen, onReadAll, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const unread = items.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const down = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const key = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <div className="nb" ref={ref}>
      <button type="button" className="hdr__icon-btn" aria-haspopup="dialog" aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} onClick={() => setOpen((o) => !o)}>
        <Svg><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.9 1.9 0 003.4 0" /></Svg>
        {unread > 0 && <span className="hdr__dot" />}
      </button>

      {open && (
        <div className="nb__panel" role="dialog" aria-label="Notifications">
          <div className="nb__head">
            <h2>Notifications</h2>
            {unread > 0 && <button type="button" onClick={onReadAll}>Mark all read</button>}
          </div>
          {items.length === 0 ? (
            <p className="nb__empty">You’re all caught up.</p>
          ) : (
            <>
              <ul className="nb__list">
                {items.map((n) => (
                  <li key={n.id}>
                    <button type="button" className={`nb__item ${n.read ? "" : "is-unread"}`}
                      onClick={() => { onOpen(n); setOpen(false); }}>
                      <span className="nb__ico">
                        {n.kind === "message"
                          ? <Svg size={16}><path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1h-8l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" /></Svg>
                          : <Svg size={16}><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z" /></Svg>}
                      </span>
                      <span className="nb__text">{n.text}<small>{ago(n.ts)}</small></span>
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className="nb__clear" onClick={onClear}>Clear all</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
