import { useState } from "react";
import { typeLabel } from "../lib/media";
import "./MediaCover.css";

const PALETTE = [
  ["#1f4a3a", "#3f7d63"],
  ["#2f5d50", "#7fb69e"],
  ["#5a3e2b", "#c08a5c"],
  ["#3b4a6b", "#8fa3d1"],
  ["#6b3b4a", "#d18fa3"],
  ["#4a3b6b", "#a38fd1"],
];

const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

// Poster art when we have it; a generated title cover when we don't (or it fails to load).
export default function MediaCover({ item, className = "" }) {
  const [broken, setBroken] = useState(false);
  const showImage = item.poster_url && !broken;
  const [from, to] = PALETTE[hash(item.title) % PALETTE.length];

  return (
    <div
      className={`mc mc--${item.media_type} ${className}`}
      style={showImage ? undefined : { background: `linear-gradient(150deg, ${from}, ${to})` }}
    >
      {showImage ? (
        <img
          src={item.poster_url}
          alt={item.title}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="mc__fallback" role="img" aria-label={item.title}>
          <span className="mc__tag">{typeLabel(item.media_type)}</span>
          <span className="mc__title">{item.title}</span>
        </div>
      )}
    </div>
  );
}
