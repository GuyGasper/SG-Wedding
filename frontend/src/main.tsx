import React, { useEffect, useId, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeddingParty } from './WeddingParty';
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

function App() {
  const isWeddingParty = /^\/wedding-party\/?$/.test(window.location.pathname);
  const navMarkerRef = useRef<HTMLDivElement>(null);
  const [navStuck, setNavStuck] = useState(false);

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
      <a className="skip-link" href={isWeddingParty ? '#content' : '#home'}>Skip to content</a>
      {isWeddingParty ? (
        <header className="party-masthead">
          <a className="party-wordmark" href="/" aria-label="Sarah Eisenman & Guy Gasper — Home">
            <span>Sarah Eisenman</span>
            <Flower />
            <span>Guy Gasper</span>
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
      <nav className="site-nav" data-stuck={navStuck || undefined} aria-label="Main navigation">
        <a href="/" aria-current={isWeddingParty ? undefined : 'page'}>Home</a>
        <a href="/wedding-party" aria-current={isWeddingParty ? 'page' : undefined}>Wedding Party</a>
      </nav>
      {isWeddingParty ? (
        <WeddingParty />
      ) : (
        <main id="home">
          <figure className="hero">
            <img src="/images/engagement-on-the-steps.jpg" width="2400" height="1600" alt="Sarah and Guy reading together on the front steps in a black-and-white photograph" fetchPriority="high" />
          </figure>
          <section className="invitation" aria-label="Wedding date">
            <p>please join us for our wedding celebration on</p>
            <time dateTime="2027-10-02">October 2, 2027</time>
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
