import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import Button from './Button';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80; // Height of the navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled && !mobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative z-50">
        {/* Logo */}
        <a href="#" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href} 
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button variant="primary" size="sm" onClick={(e) => handleNavClick(e, '#contact')}>
            Start a project
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="md:hidden text-white p-2 z-50 relative focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 h-[100dvh] bg-slate-950 z-40 flex flex-col justify-center px-8 md:hidden overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="flex flex-col gap-8 relative z-10">
              {NAV_LINKS.map((link) => (
                <motion.a 
                  key={link.label} 
                  href={link.href} 
                  variants={linkVariants}
                  className="text-4xl font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-4 group"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.label}
                  <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" size={32} />
                </motion.a>
              ))}
              
              <motion.div variants={linkVariants} className="pt-8">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full justify-between group"
                  onClick={(e) => handleNavClick(e, '#contact')}
                >
                  Start a project
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>

            <motion.div variants={linkVariants} className="absolute bottom-10 left-8 right-8 border-t border-white/10 pt-6">
                <p className="text-slate-500 text-sm font-medium">hello@nexus.studio</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;