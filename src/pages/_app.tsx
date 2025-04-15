import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Add effect for tracking navigation
  useEffect(() => {
    // Remove loading indicator after navigation is complete
    setIsLoading(false);

    // Subscribe to router events
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      <Navbar />
      <main>
        {isLoading ? (
          <div className="global-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EcoCraft</h3>
            <p>Creating beauty with care for nature.</p>
            <div className="social-icons">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <i className="social-icon facebook"></i>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="social-icon instagram"></i>
              </a>
              <a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
                <i className="social-icon pinterest"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Navigation</h4>
            <div className="footer-links">
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
              <Link href="/portfolio">Portfolio</Link>
              <Link href="/contacts">Contacts</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Contacts</h4>
            <address>
              <p>📍 Kyiv, Green Street, 15</p>
              <p>📞 +380 123 456 789</p>
              <p>📧 info@ecocraft.com</p>
            </address>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} EcoCraft. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default MyApp;