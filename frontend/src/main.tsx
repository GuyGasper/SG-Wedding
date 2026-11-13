import React, { useEffect, useId, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeddingParty } from './WeddingParty';
import { Travel } from './Travel';
import { Details } from './Details';
import { Faq } from './Faq';
import './styles.css';
const pomponPetalRings = [
  { count: 10, offset: 0, path: 'M0 -13C-8 -19 -11 -29 -6 -34C-3 -38 3 -38 6 -34C11 -29 8 -19 0 -13Z' },
  { count: 8, offset: 0.5, path: 'M0 -6C-7 -10 -8 -19 -4 -23C-2 -26 2 -26 4 -23C8 -19 7 -10 0 -6Z' },
  { count: 6, offset: 0, path: 'M0 -1C-4 -4 -4 -10 0 -12C4 -10 4 -4 0 -1Z' },
];

function Flower() {
  const id = useId();

  return (
    <svg className="flower" viewBox="0 0 120 130" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.95" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 75C54 91 57 105 66 118" />
        <path d="M57 96C45 85 36 85 25 85C34 98 47 102 57 101Z" />
        <path d="M60 105C67 94 76 89 89 89C83 101 71 108 62 109Z" />
        {pomponPetalRings.map(({ count, offset, path }) => {
          const petalId = id + '-petal-' + count;
          return (
            <g key={count} transform="translate(60 45)" fill="var(--sage)">
              <defs><path id={petalId} d={path} /></defs>
              {Array.from({ length: count }, (_, index) => (
                <use
                  key={index}
                  href={'#' + petalId}
                  transform={'rotate(' + (index + offset) * 360 / count + ')'}
                />
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/details', label: 'Details' },
  { href: '/travel-and-accommodation', label: 'Travel and Accommodation', wide: true },
  { href: '/wedding-party', label: 'Wedding Party' },
  { href: '/faq', label: 'FAQ' },
];

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const currentPage = navigation.find(({ href }) => href === pathname) ?? navigation[0];
  const isHome = currentPage.href === '/';
  const isWeddingParty = currentPage.href === '/wedding-party';
  const isTravel = currentPage.href === '/travel-and-accommodation';
  const isDetails = currentPage.href === '/details';
  const isFaq = currentPage.href === '/faq';
  const navMarkerRef = useRef<HTMLDivElement>(null);
  const [navStuck, setNavStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 768px)');
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener('change', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener('change', onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    const marker = navMarkerRef.current;
    if (!marker) return;

    const observer = new IntersectionObserver(([entry]) => {
      setNavStuck(!entry.isIntersecting && entry.boundingClientRect.bottom <= 0);
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href={isHome ? '#home' : '#content'}>Skip to content</a>
      {!isHome ? (
        <header className="party-masthead">
          <a className="party-wordmark" href="/" aria-label="Sarah Eisenman & Guy Gasper — Home">
            <span className="name">Sarah Eisenman</span>
            <span className="and" aria-hidden="true">and</span>
            <span className="name">Guy Gasper</span>
          </a>
        </header>
      ) : (
        <header className="masthead">
          <h1 aria-label="Sarah Eisenman & Guy Gasper">
            <span className="name">Sarah Eisenman</span>
            <span className="and" aria-hidden="true">and</span>
            <span className="name">Guy Gasper</span>
          </h1>
        </header>
      )}
      <div ref={navMarkerRef} className="nav-scroll-marker" aria-hidden="true" />
      <nav ref={navRef} className="site-nav" data-stuck={navStuck || undefined} data-open={menuOpen || undefined} aria-label="Main navigation">
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="menu-icon" aria-hidden="true"><span /><span /><span /></span>
        </button>
        <span className={'mobile-current-page' + (isTravel ? ' mobile-current-page--travel' : '')} aria-current="page">
          {isTravel ? <>Travel and <span>Accommodation</span></> : currentPage.label}
        </span>
        <div className="nav-links" id={menuId}>
        {navigation.map(({ href, label, wide }) => (
          <a
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className={wide ? 'site-nav-wide' : undefined}
            aria-current={currentPage.href === href ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
        </div>
      </nav>
      {isWeddingParty && <WeddingParty />}
      {isTravel && <Travel />}
      {isDetails && <Details />}
      {isFaq && <Faq />}
      {!isHome && !isWeddingParty && !isTravel && !isDetails && !isFaq && (
        <main id="content" className="empty-page" aria-label={currentPage.label} />
      )}
      {isHome && (
        <main id="home">
          <figure className="hero">
            <img src="/images/engagement-on-the-steps.jpg" width="2400" height="1600" alt="Sarah and Guy reading together on the front steps in a black-and-white photograph" fetchPriority="high" />
          </figure>
          <section className="invitation" aria-label="Wedding details">
            <p>please join us for our wedding celebration on</p>
            <time dateTime="2027-10-02">October 2, 2027</time>
            <p className="invitation-location">in Burlington, WI</p>
            <Flower />
          </section>
        </main>
      )}
      <footer className="site-footer">
        <p>
          Brought to you by Guy, with inspiration from{' '}
          <a href="https://www.minted.com/" className="footer-minted">
            <img src="/images/minted-wordmark-white.svg" alt="minted." width="50" height="12" />
          </a>
        </p>
      </footer>
    </>
  );
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
