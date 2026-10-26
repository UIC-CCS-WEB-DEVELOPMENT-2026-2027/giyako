import { useState } from "react";
import InfoDialog from "./InfoDialog";
import { PAGES, PAGE_ORDER } from "../lib/legal";
import "./Footer.css";

function Footer() {
  const [page, setPage] = useState(null);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Giyako</h3>
          <p>Where U and I, Connect.</p>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Giyako. All rights reserved.
        </p>

        <nav className="footer-links" aria-label="Footer">
          {PAGE_ORDER.map((id) => (
            <button key={id} type="button" onClick={() => setPage(id)}>
              {PAGES[id].label}
            </button>
          ))}
        </nav>
      </div>

      <InfoDialog page={page} onPage={setPage} onClose={() => setPage(null)} />
    </footer>
  );
}

export default Footer;
