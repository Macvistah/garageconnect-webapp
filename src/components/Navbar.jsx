import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';

const NAV_LINKS = ['Services', 'Find a garage', 'Tow trucks', 'Suppliers', 'Diagnostics'];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">⚙</div>
        <span className="navbar-logo-text">GarageConnect</span>
      </Link>

      {/* Desktop links */}
      <div className="navbar-links">
        {NAV_LINKS.map(link => (
          <a key={link} href="#" className="navbar-link">{link}</a>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="navbar-cta">
        <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
        <button className="btn-orange" onClick={() => navigate('/register')}>Get started</button>
      </div>

      {/* Hamburger — mobile only */}
      <button
        className="navbar-hamburger"
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${menuOpen ? 'open-1' : ''}`} />
        <span className={`hamburger-line ${menuOpen ? 'open-2' : ''}`} />
        <span className={`hamburger-line ${menuOpen ? 'open-3' : ''}`} />
      </button>

      {/* Mobile dropdown */}
      <div className={`navbar-mobile ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(link => (
          <a key={link} href="#" className="navbar-mobile-link" onClick={() => setMenuOpen(false)}>
            {link}
          </a>
        ))}
        <div className="navbar-mobile-cta">
          <button className="btn-ghost" style={{ width: '100%' }} onClick={() => { navigate('/login'); setMenuOpen(false); }}>
            Sign in
          </button>
          <button className="btn-orange" style={{ width: '100%' }} onClick={() => { navigate('/register'); setMenuOpen(false); }}>
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}
