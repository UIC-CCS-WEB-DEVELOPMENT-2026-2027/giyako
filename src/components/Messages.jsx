import { useEffect, useMemo, useRef, useState } from "react";
import { formatTime, lastActivity, unreadCount } from "../lib/messages";
import "./Messages.css";

const initialsOf = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ person, size = 44 }) {
  return (
    <span className="ms__avatar" style={{ background: person.color, width: size, height: size, fontSize: size * 0.36 }} aria-hidden="true">
      {initialsOf(person.name)}
    </span>
  );
}

function Composer({ name, onSend }) {
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  };
  return (
    <div className="ms__composer">
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            send();
          }
        }}
        rows={1}
        maxLength={1000}
        placeholder={`Message ${name}…`}
        aria-label={`Message ${name}`}
      />
      <button type="button" className="ms__send" onClick={send} disabled={!draft.trim()} aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4z" />
        </svg>
      </button>
    </div>
  );
}

export default function Messages({ people, myLogs, threads, typing, chatId, onSelect, onSend, onRead, onOpenPerson }) {
  const [narrow] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 760px)").matches);
  const listRef = useRef(null);

  const byId = useMemo(() => Object.fromEntries(people.map((p) => [p.id, p])), [people]);

  const convos = useMemo(
    () =>
      Object.entries(threads)
        .filter(([id]) => byId[id])
        .map(([id, thread]) => ({ id, person: byId[id], thread, last: thread.messages.at(-1), at: lastActivity(thread) }))
        .sort((a, b) => b.at - a.at),
    [threads, byId]
  );

  // undefined = default (most recent chat on desktop); null = nothing open (list only)
  const activeId = chatId === undefined ? (narrow ? null : convos[0]?.id ?? null) : chatId;
  const active = convos.find((c) => c.id === activeId);
  const others = people.filter((p) => !threads[p.id]);

  const activeUnread = active ? unreadCount(active.thread) : 0;
  const messageCount = active?.thread.messages.length ?? 0;
  const isTyping = active ? !!typing[active.id] : false;

  // Mark the open chat as read whenever something new arrives in it
  useEffect(() => {
    if (activeId && activeUnread > 0) onRead(activeId);
  }, [activeId, activeUnread, onRead]);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeId, messageCount, isTyping]);

  const shared = active
    ? active.person.logs.filter((l) => myLogs.some((m) => m.id === l.id))
    : [];

  return (
    <div className="ms-page">
      <section className={`ms ${active ? "has-active" : ""}`} aria-label="Messages">
        {/* Conversation list */}
        <aside className="ms__side">
          <h1 className="ms__title">Messages</h1>

          {convos.length === 0 ? (
            <p className="ms__empty-note">No conversations yet. Start one below.</p>
          ) : (
            <ul className="ms__convos">
              {convos.map(({ id, person, thread, last }) => {
                const unread = unreadCount(thread);
                return (
                  <li key={id}>
                    <button
                      type="button"
                      className={`ms__convo ${id === activeId ? "is-active" : ""}`}
                      aria-current={id === activeId ? "true" : undefined}
                      onClick={() => onSelect(id)}
                    >
                      <Avatar person={person} />
                      <span className="ms__convo-text">
                        <span className="ms__convo-top">
                          <strong>{person.name}</strong>
                          <small>{last ? formatTime(last.ts) : ""}</small>
                        </span>
                        <span className={`ms__preview ${unread ? "is-unread" : ""}`}>
                          {last ? `${last.from === "me" ? "You: " : ""}${last.text}` : "No messages yet"}
                        </span>
                      </span>
                      {unread > 0 && <span className="ms__badge" aria-label={`${unread} unread`}>{unread}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {others.length > 0 && (
            <div className="ms__new">
              <h2 className="ms__new-title">Start a chat</h2>
              <ul className="ms__new-list">
                {others.map((p) => (
                  <li key={p.id}>
                    <button type="button" className="ms__new-btn" onClick={() => onSelect(p.id, true)}>
                      <Avatar person={p} size={32} />
                      <span>{p.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Thread */}
        <div className="ms__main">
          {active ? (
            <>
              <header className="ms__head">
                <button type="button" className="ms__back" onClick={() => onSelect(null)} aria-label="Back to conversations">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <Avatar person={active.person} size={42} />
                <div className="ms__who">
                  <strong>{active.person.name}</strong>
                  <small>
                    @{active.person.handle} · {active.person.program}
                  </small>
                </div>
                <button type="button" className="ms__profile-btn" onClick={() => onOpenPerson(active.id)}>
                  View profile
                </button>
              </header>

              {shared.length > 0 && (
                <p className="ms__shared">
                  You both like {shared.slice(0, 3).map((l) => l.title).join(", ")}
                  {shared.length > 3 ? ` and ${shared.length - 3} more` : ""}
                </p>
              )}

              <div className="ms__list" ref={listRef} role="log" aria-live="polite" aria-label={`Conversation with ${active.person.name}`}>
                {active.thread.messages.length === 0 && (
                  <p className="ms__hello">
                    Say hi to {active.person.name.split(" ")[0]}. A good opener is something you both log.
                  </p>
                )}
                {active.thread.messages.map((m, i, arr) => {
                  const next = arr[i + 1];
                  const showTime = !next || next.from !== m.from || next.ts - m.ts > 10 * 60 * 1000;
                  return (
                    <div key={m.id} className={`ms__row ms__row--${m.from}`}>
                      <div className="ms__bubble">{m.text}</div>
                      {showTime && <span className="ms__time">{formatTime(m.ts)}</span>}
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="ms__row ms__row--them" aria-label={`${active.person.name} is typing`}>
                    <div className="ms__bubble ms__typing"><i /><i /><i /></div>
                  </div>
                )}
              </div>

              <Composer key={active.id} name={active.person.name.split(" ")[0]} onSend={(text) => onSend(active.id, text)} />
            </>
          ) : (
            <div className="ms__placeholder">
              <p>Select a conversation, or start a new one from the list.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
