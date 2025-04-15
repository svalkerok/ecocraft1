import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span>EcoCraft</span>
        </Link>

        <div className="navbar-actions">
          <ThemeToggle className="theme-toggle-navbar" />
          
          <button 
            className={`navbar-toggle ${menuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </button>
        </div>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className={isActive('/') ? 'active' : ''}>
            <Link href="/" onClick={closeMenu}>Home</Link>
          </li>
          <li className={isActive('/about') ? 'active' : ''}>
            <Link href="/about" onClick={closeMenu}>About Us</Link>
          </li>
          <li className={isActive('/portfolio') ? 'active' : ''}>
            <Link href="/portfolio" onClick={closeMenu}>Portfolio</Link>
          </li>
          <li className={isActive('/contacts') ? 'active' : ''}>
            <Link href="/contacts" onClick={closeMenu}>Contacts</Link>
          </li>
          <li className="theme-toggle-menu-item">
            <ThemeToggle className="theme-toggle-menu" />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;