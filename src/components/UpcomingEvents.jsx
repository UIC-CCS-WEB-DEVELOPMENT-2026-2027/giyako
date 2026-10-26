import "./UpcomingEvents.css";

// Mock events until a real source exists
const EVENTS = [
  { id: 1, month: "Nov", day: "06", title: "Campus Tech Summit 2026", meta: "9:00 AM · Main Auditorium" },
  { id: 2, month: "Nov", day: "14", title: "Design Workshop & Hackathon", meta: "1:00 PM · Innovation Lab" },
  { id: 3, month: "Nov", day: "20", title: "AI & Machine Learning Seminar", meta: "3:00 PM · Room 204" },
  { id: 4, month: "Dec", day: "03", title: "Annual Career & Internship Fair", meta: "10:00 AM · Gymnasium" },
];

export default function UpcomingEvents() {
  return (
    <section className="ev" aria-label="Upcoming university events">
      <h2 className="ev__title">Upcoming University Events</h2>
      <ul className="ev__list">
        {EVENTS.map((e) => (
          <li key={e.id} className="ev__item">
            <span className="ev__date" aria-hidden="true">
              <span className="ev__month">{e.month}</span>
              <span className="ev__day">{e.day}</span>
            </span>
            <span className="ev__text">
              <strong>{e.title}</strong>
              <small>{e.meta}</small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
