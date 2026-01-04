import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import TechStack from './components/TechStack';
import LazySection from './components/LazySection';
import RouteMeta from './components/RouteMeta';

const Expertise = lazy(() => import('./components/Expertise'));
const Process = lazy(() => import('./components/Process'));
const Work = lazy(() => import('./components/Work'));
const FounderMessage = lazy(() => import('./components/FounderMessage'));
const Team = lazy(() => import('./components/Team'));
const Contact = lazy(() => import('./components/Contact'));
const ValidatePage = lazy(() => import('./pages/ValidatePage'));

// Home page component
const HomePage = () => (
  <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
    <Navbar />
    <main>
      <Hero />
      <TechStack />

      <LazySection fallback={<section id="services" className="cv-auto min-h-[50vh] bg-slate-50 dark:bg-slate-950" />}>
        <Expertise />
      </LazySection>
      <LazySection fallback={<section id="process" className="cv-auto min-h-[50vh] bg-white dark:bg-[#030712]" />}>
        <Process />
      </LazySection>
      <LazySection fallback={<section id="work" className="cv-auto min-h-[50vh] bg-slate-950" />}>
        <Work />
      </LazySection>
      <LazySection fallback={<section className="cv-auto min-h-[50vh] bg-[#020617]" />}>
        <FounderMessage />
      </LazySection>
      <LazySection fallback={<section id="team" className="cv-auto min-h-[50vh] bg-white dark:bg-[#030712]" />}>
        <Team />
      </LazySection>
      <LazySection fallback={<section id="contact" className="cv-auto min-h-[60vh] bg-[#020617]" />}>
        <Contact />
      </LazySection>
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <RouteMeta />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/en" element={<HomePage />} />
        <Route
          path="/validate"
          element={
            <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
              <ValidatePage />
            </Suspense>
          }
        />
        <Route
          path="/en/validate"
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
