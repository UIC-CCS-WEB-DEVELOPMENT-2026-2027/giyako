import { useEffect, useRef, useState } from "react";
import "./Header.css";
import ProfileSearch from "./ProfileSearch";
import NotificationBell from "./NotificationBell";

const Icon = ({ children, size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: <Icon><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></Icon>,
  },
  {
    id: "logs",
    label: "My logs",
    icon: <Icon><path d="M6 3h12v18l-6-4-6 4z" /></Icon>,
  },
  {
    id: "hub",
    label: "Campus hub",
    icon: <Icon><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2c2.9.3 5 2.6 5 5.8" /></Icon>,
  },
  {
    id: "messages",
    label: "Messages",
    icon: <Icon><path d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1h-8l-5 4v-4H4a1 1 0 01-1-1V6a1 1 0 011-1z" /></Icon>,
  },
];

export default function Header({ initials = "SR", active, onChange, people = [], onOpenPerson, unread = 0, onLogout, notifs = [], onNotifOpen, onNotifReadAll, onNotifClear }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="hdr">
      <div className="hdr__inner">
        <div className="hdr__left">
          <a
            href="/"
            className="hdr__brand"
            aria-label="giyako home"
            onClick={(e) => {
              e.preventDefault();
              onChange("home");
            }}
          >
            <span className="hdr__logo">
              <Icon size={22}>
                <path d="M4 20V9l8-5 8 5v11" />
                <circle cx="12" cy="13" r="2.2" />
              </Icon>
            </span>
            <span className="hdr__wordmark">giyako.</span>
          </a>

          <nav className="hdr__nav" aria-label="Primary">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hdr__link ${active === item.id ? "is-active" : ""}`}
                aria-current={active === item.id ? "page" : undefined}
                aria-label={item.id === "messages" && unread > 0 ? `${item.label}, ${unread} unread` : item.label}
                onClick={() => onChange(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === "messages" && unread > 0 && (
                  <span className="hdr__badge" aria-label={`${unread} unread messages`}>
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="hdr__right">
          <ProfileSearch people={people} onSelect={onOpenPerson} />

          <NotificationBell items={notifs} onOpen={onNotifOpen} onReadAll={onNotifReadAll} onClear={onNotifClear} />

          <div className="hdr__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className={`hdr__avatar ${(active === "profile" || active === "settings") ? "is-active" : ""}`}
              aria-label="Your account"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {initials}
            </button>
            {menuOpen && (
              <div className="hdr__menu" role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className="hdr__menu-item"
                  onClick={() => {
                    onChange("profile");
                    setMenuOpen(false);
                  }}
                >
                  View profile
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="hdr__menu-item"
                  onClick={() => {
                    onChange("settings");
                    setMenuOpen(false);
                  }}
                >
                  Settings
                </button>
                <div className="hdr__menu-divider" role="separator" />
                <button
                  type="button"
                  role="menuitem"
                  className="hdr__menu-item"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}