import { useEffect, useRef, useState } from "react";
import "./ProfileCard.css";

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

const SOCIAL_META = {
  instagram: {
    label: "Instagram",
    placeholder: "username",
    href: (v) => `https://instagram.com/${v.replace(/^@/, "")}`,
    icon: (
      <Icon>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
      </Icon>
    ),
  },
  tiktok: {
    label: "TikTok",
    placeholder: "username",
    href: (v) => `https://tiktok.com/@${v.replace(/^@/, "")}`,
    icon: (
      <Icon>
        <path d="M14 4v10.5a3.5 3.5 0 11-3.5-3.5" />
        <path d="M14 4c.4 2.4 2 3.9 4.5 4.1" />
      </Icon>
    ),
  },
  discord: {
    label: "Discord",
    placeholder: "username",
    href: null,
    icon: (
      <Icon>
        <path d="M5 6h14a2 2 0 012 2v7a2 2 0 01-2 2h-6l-4 3v-3H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
        <circle cx="9" cy="11.5" r="0.7" fill="currentColor" />
        <circle cx="15" cy="11.5" r="0.7" fill="currentColor" />
      </Icon>
    ),
  },
};

export default function ProfileCard({ profile, onSave, readOnly = false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [copied, setCopied] = useState(false);
  const descRef = useRef(null);
  const fileRef = useRef(null);

  const data = editing ? draft : profile;

  const set = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));
  const setSocial = (type) => (e) => {
    const value = e.target.value;
    setDraft((d) => ({
      ...d,
      socials: d.socials.map((s) => (s.type === type ? { ...s, value } : s)),
    }));
  };

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const save = () => {
    onSave({
      ...draft,
      name: draft.name.trim() || profile.name,
      handle: draft.handle.replace(/^@/, "").trim() || profile.handle,
    });
    setEditing(false);
  };

  // Drop the cursor at the end of the description when edit mode opens
  useEffect(() => {
    if (!editing || !descRef.current) return;
    const el = descRef.current;
    el.focus();
    const end = el.value.length;
    el.setSelectionRange(end, end);
  }, [editing]);

  // Keep the description box sized to its text
  useEffect(() => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [data.description, editing]);

  const onKeyDown = (e) => {
    if (!editing) return;
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) save();
  };

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraft((d) => ({ ...d, avatar: URL.createObjectURL(file) }));
  };

  const share = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/@${profile.handle}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const initials = data.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const filledSocials = data.socials.filter((s) => s.value.trim());

  return (
    <section
      className={`pc ${editing ? "is-editing" : ""}`}
      aria-label="Profile"
      onKeyDown={onKeyDown}
    >
      {editing && (
        <div className="pc__banner" role="status">
          <span className="pc__pulse" />
          Editing your profile
          <span className="pc__hint">Esc to cancel · Ctrl/⌘ + Enter to save</span>
        </div>
      )}

      <div className="pc__grid">
        {/* Avatar, name, program */}
        <div className="pc__identity">
          <div className="pc__avatar-wrap">
            {data.avatar ? (
              <img className="pc__avatar" src={data.avatar} alt="" />
            ) : (
              <div
                className="pc__avatar pc__avatar--initials"
                style={{ background: data.color }}
                aria-hidden="true"
              >
                {initials}
              </div>
            )}
            {editing && (
              <>
                <button
                  type="button"
                  className="pc__avatar-edit"
                  onClick={() => fileRef.current?.click()}
                  aria-label="Change profile photo"
                >
                  <Icon size={22}>
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4z" />
                    <circle cx="12" cy="13.5" r="3.2" />
                  </Icon>
                  <span>Change</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onPickAvatar}
                />
              </>
            )}
          </div>

          {editing ? (
            <>
              <input
                className="pc__field pc__name"
                value={draft.name}
                onChange={set("name")}
                maxLength={40}
                aria-label="Display name"
                placeholder="Your name"
              />
              <input
                className="pc__field pc__program"
                value={draft.program}
                onChange={set("program")}
                maxLength={60}
                aria-label="Program"
                placeholder="Program"
              />
            </>
          ) : (
            <>
              <h1 className="pc__name">{profile.name}</h1>
              <p className="pc__program">{profile.program}</p>
            </>
          )}
        </div>

        {/* Handle, pronouns, description, socials */}
        <div className="pc__body">
          <div className="pc__meta">
            {editing ? (
              <>
                <label className="pc__handle-field">
                  <span>@</span>
                  <input
                    className="pc__field"
                    value={draft.handle}
                    onChange={set("handle")}
                    maxLength={24}
                    aria-label="Handle"
                    placeholder="handle"
                  />
                </label>
                <input
                  className="pc__field pc__pronouns-field"
                  value={draft.pronouns}
                  onChange={set("pronouns")}
                  maxLength={16}
                  aria-label="Pronouns"
                  placeholder="pronouns"
                />
              </>
            ) : (
              <>
                <span className="pc__handle">@{profile.handle}</span>
                {profile.pronouns && (
                  <span className="pc__pronouns">{profile.pronouns}</span>
                )}
              </>
            )}
          </div>

          {editing ? (
            <div className="pc__desc-wrap">
              <textarea
                ref={descRef}
                className="pc__field pc__desc"
                value={draft.description}
                onChange={set("description")}
                maxLength={160}
                rows={2}
                aria-label="Description"
                placeholder="Tell people what you're into…"
              />
              <span className="pc__count">{draft.description.length}/160</span>
            </div>
          ) : (
            <p className="pc__desc">{profile.description}</p>
          )}

          <div className="pc__find">
            <h2 className="pc__find-title">find me here!</h2>
            {editing ? (
              <div className="pc__social-edit">
                {draft.socials.map((s) => (
                  <label key={s.type} className="pc__social-row">
                    <span className="pc__social-icon">
                      {SOCIAL_META[s.type].icon}
                    </span>
                    <input
                      className="pc__field"
                      value={s.value}
                      onChange={setSocial(s.type)}
                      aria-label={SOCIAL_META[s.type].label}
                      placeholder={SOCIAL_META[s.type].placeholder}
                      maxLength={40}
                    />
                  </label>
                ))}
              </div>
            ) : filledSocials.length ? (
              <ul className="pc__socials">
                {filledSocials.map((s) => {
                  const meta = SOCIAL_META[s.type];
                  const href = meta.href?.(s.value);
                  return (
                    <li key={s.type}>
                      {href ? (
                        <a
                          className="pc__social-icon"
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          title={`${meta.label}: ${s.value}`}
                          aria-label={`${meta.label}: ${s.value}`}
                        >
                          {meta.icon}
                        </a>
                      ) : (
                        <span
                          className="pc__social-icon"
                          title={`${meta.label}: ${s.value}`}
                          aria-label={`${meta.label}: ${s.value}`}
                        >
                          {meta.icon}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="pc__empty">No links yet. Add some in edit mode.</p>
            )}
          </div>
        </div>

        {/* Actions + visibility */}
        <div className="pc__side">
          <div className="pc__actions">
            {editing ? (
              <>
                <button type="button" className="pc__btn pc__btn--solid" onClick={save}>
                  Save
                </button>
                <button type="button" className="pc__btn pc__btn--ghost" onClick={cancel}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button type="button" className="pc__btn pc__btn--solid" onClick={share}>
                  <Icon size={16}>
                    <path d="M12 15V4M8 8l4-4 4 4" />
                    <path d="M5 13v6h14v-6" />
                  </Icon>
                  {copied ? "Link copied" : "share"}
                </button>
                {!readOnly && (
                  <button type="button" className="pc__btn pc__btn--ghost" onClick={startEdit}>
                    <Icon size={16}>
                      <path d="M4 20l1-4L16.5 4.5a2 2 0 013 3L8 19z" />
                    </Icon>
                    edit
                  </button>
                )}
              </>
            )}
          </div>

          {/* Fills the empty space under share/edit: who can see this profile */}
          {!readOnly && (
          <div className="pc__visibility">
            <span className="pc__visibility-label">Who can see this</span>
            {editing ? (
              <select
                className="pc__field pc__select"
                value={draft.visibility}
                onChange={set("visibility")}
                aria-label="Profile visibility"
              >
                <option>My campus</option>
                <option>My college only</option>
                <option>People I've logged</option>
                <option>Just me</option>
              </select>
            ) : (
              <span className="pc__chip">
                <Icon size={14}>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </Icon>
                {profile.visibility}
              </span>
            )}
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
