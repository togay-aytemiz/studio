import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import TechStack from './components/TechStack';
import RouteMeta from './components/RouteMeta';
import Expertise from './components/Expertise';
import WhyAgens from './components/WhyAgens';
import Process from './components/Process';
import Work from './components/Work';
import FounderMessage from './components/FounderMessage';
import Team from './components/Team';
import Contact from './components/Contact';
import ValidatePage from './pages/ValidatePage';

const HashScroller = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const targetId = location.hash.slice(1);
    if (!targetId) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const retryDelay = 80;

    const scrollToTarget = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'start' });
        return;
      }
      if (attempts < maxAttempts) {
        attempts += 1;
        window.setTimeout(scrollToTarget, retryDelay);
      }
    };

    window.setTimeout(scrollToTarget, 0);
    const settleTimer = window.setTimeout(scrollToTarget, 250);

    return () => {
      window.clearTimeout(settleTimer);
    };
  }, [location.hash, location.pathname]);

  return null;
};

// Home page component
const HomePage = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
    <Navbar />
    <main>
      <Hero />
      <TechStack />
      <WhyAgens />
      <Expertise />
      <Process />
      <Work />
      <FounderMessage />
      <Team />
      <Contact />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <HashScroller />
      <RouteMeta />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en" element={<HomePage />} />
        <Route path="/validate" element={<ValidatePage />} />
        <Route path="/en/validate" element={<ValidatePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
