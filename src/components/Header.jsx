import "./Header.css";

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
    id: "discover",
    label: "Discover",
    icon: <Icon><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></Icon>,
  },
  {
    id: "logs",
    label: "My logs",
    icon: <Icon><path d="M6 3h12v18l-6-4-6 4z" /></Icon>,
  },
  {
    id: "insights",
    label: "Insights",
    icon: <Icon><path d="M4 20V10M10 20V4M16 20v-8M22 20H2" /></Icon>,
  },
];

export default function Header({ initials = "SR", active, onChange }) {
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
                onClick={() => onChange(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="hdr__right">
          <label className="hdr__search">
            <Icon size={16}>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </Icon>
            <input type="text" placeholder="Search your campus" />
            <kbd>⌘ K</kbd>
          </label>

          <button type="button" className="hdr__icon-btn" aria-label="Search">
            <Icon>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </Icon>
          </button>

          <button type="button" className="hdr__icon-btn" aria-label="Notifications">
            <Icon>
              <path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.9 1.9 0 003.4 0" />
            </Icon>
            <span className="hdr__dot" />
          </button>

          <button type="button" className="hdr__avatar" aria-label="Your profile">
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}