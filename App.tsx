import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import TechStack from './components/TechStack';
import RouteMeta from './components/RouteMeta';
import Expertise from './components/Expertise';
import Process from './components/Process';
import Work from './components/Work';
import FounderMessage from './components/FounderMessage';
import Team from './components/Team';
import Contact from './components/Contact';
import ValidatePage from './pages/ValidatePage';

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
