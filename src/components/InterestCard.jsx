import "./InterestCard.css";

const SLOTS = 6;

export default function InterestCard() {
  return (
    <section className="ic" aria-label="Interests">
      <h2 className="ic__title">Interest</h2>
      <div className="ic__body">
        <div className="ic__featured" aria-label="Featured interest (empty)" />
        <div className="ic__grid">
          {Array.from({ length: SLOTS }, (_, i) => (
            <button
              key={i}
              type="button"
              className="ic__slot"
              aria-label="Add an interest"
              title="Adding interests is coming soon"
              disabled
            >
              +
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
