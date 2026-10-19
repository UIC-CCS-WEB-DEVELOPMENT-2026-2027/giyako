import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Giyako</h3>
          <p>Where U and I, Connect.</p>
        </div>

        <nav className="footer-links">
          <a href="#about">About</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <p className="footer-copy">
        &copy; {new Date().getFullYear()} Giyako. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;