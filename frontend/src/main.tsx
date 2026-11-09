import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { WeddingParty } from './WeddingParty';
import './styles.css';
function Flower() {
  return <svg className="flower" viewBox="0 0 120 130" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M95 117C68 98 66 68 48 39M94 116C75 105 48 110 24 99M94 116C88 93 87 58 77 25"/><path d="M66 92C43 95 34 78 22 79C33 98 49 103 69 98M83 79C91 62 99 60 105 48C89 50 80 64 83 79M52 51C33 54 21 40 23 33C21 29 27 24 31 27C28 17 35 14 40 23C39 11 48 10 51 23C59 17 66 22 59 32C71 37 65 47 52 51Z" fill="currentColor"/><path d="M77 49C68 38 66 23 71 13C83 23 86 36 82 51M46 108C30 116 18 113 10 109C21 103 34 102 46 108" fill="currentColor"/></g></svg>;
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
