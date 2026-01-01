import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Capabilities from './components/Capabilities';
import Process from './components/Process';
import Work from './components/Work';
import FounderMessage from './components/FounderMessage';
import Team from './components/Team';
import AIValidator from './components/AIValidator';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <Navbar />
      <main>
        <Hero />
        <AIValidator />
        <Services />
        <Capabilities />
        <Process />
        <Work />
        <FounderMessage />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;