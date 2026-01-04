import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Expertise from './components/Expertise';
import Process from './components/Process';
import Work from './components/Work';
import FounderMessage from './components/FounderMessage';
import Team from './components/Team';

import Contact from './components/Contact';
import Footer from './components/Footer';
const ValidatePage = lazy(() => import('./pages/ValidatePage'));

import TechStack from './components/TechStack';

// Home page component
const HomePage = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
    <Navbar />
    <main>
      <Hero />
      <TechStack />

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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/validate"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
              <ValidatePage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
