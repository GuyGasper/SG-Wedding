import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
function Flower() {
  return <svg className="flower" viewBox="0 0 120 130" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M95 117C68 98 66 68 48 39M94 116C75 105 48 110 24 99M94 116C88 93 87 58 77 25"/><path d="M66 92C43 95 34 78 22 79C33 98 49 103 69 98M83 79C91 62 99 60 105 48C89 50 80 64 83 79M52 51C33 54 21 40 23 33C21 29 27 24 31 27C28 17 35 14 40 23C39 11 48 10 51 23C59 17 66 22 59 32C71 37 65 47 52 51Z" fill="currentColor"/><path d="M77 49C68 38 66 23 71 13C83 23 86 36 82 51M46 108C30 116 18 113 10 109C21 103 34 102 46 108" fill="currentColor"/></g></svg>;
}
function App() {
  return <><a className="skip-link" href="#home">Skip to content</a><header className="masthead"><h1 aria-label="Sarah Eisenman & Guy Gasper"><span className="name">Sarah Eisenman</span><span className="and" aria-hidden="true">and</span><span className="name">Guy Gasper</span></h1></header><nav aria-label="Main navigation"><a href="/" aria-current="page">Home</a></nav><main id="home"><figure className="hero"><img src="/images/sarah-and-guy.jpg" width="4032" height="3024" alt="Sarah and Guy celebrating their engagement beside Lake Michigan, with the Chicago skyline behind them" fetchPriority="high" /></figure><section className="invitation" aria-label="Wedding date"><p>please join us for our wedding<br className="desktop-break" /> celebration on</p><time dateTime="2027-10-02">October 2, 2027</time><Flower /></section></main></>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
