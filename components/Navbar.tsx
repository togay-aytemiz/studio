import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isOpenAIConfigured } from '../services/openaiService';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(() => (
    typeof window !== 'undefined' ? window.scrollY > 50 : false
  ));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isAIEnabled = isOpenAIConfigured();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
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

  // Handle hash scrolling on route change
  useEffect(() => {
    if (location.pathname !== '/' || !location.hash) {
      return;
    }

    const hash = location.hash;
    let attempts = 0;
    const tryScroll = () => {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (attempts < 10) {
        attempts += 1;
        setTimeout(tryScroll, 120);
      }
    };

    setTimeout(tryScroll, 0);
  }, [location]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
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

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled && !mobileMenuOpen ? 'bg-slate-950/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between relative z-50">
        {/* Logo */}
        {/* Logo */}
        <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 md:gap-3 group">
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/A.svg" alt="Agens Logo" className="w-full h-full" />
          </div>
          <span className="text-lg md:text-xl font-semibold tracking-[0.4em] text-white font-brand">AGENS</span>
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
              {t(`nav.${link.label.toLowerCase()}`)}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {isAIEnabled && (
            <Link
              to="/validate"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-white/30 text-sm font-medium text-white hover:bg-white/10 hover:border-white/50 transition-all"
            >
              <Sparkles size={14} />
              <span>AI Fikir Analizi</span>
            </Link>
          )}
          <Button variant="primary" size="sm" onClick={(e) => handleNavClick(e, '#contact')}>
            {t('nav.startProject')}
          </Button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden text-white p-1.5 z-50 relative focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
            id="mobile-menu"
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
                  {t(`nav.${link.label.toLowerCase()}`)}
                  <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500" size={32} />
                </motion.a>
              ))}

              <motion.div variants={linkVariants} className="pt-8 flex flex-col gap-4">
                {isAIEnabled && (
                  <Link
                    to="/validate"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-start px-6 py-4 rounded-full bg-transparent border border-white/30 text-white text-lg font-semibold text-left hover:bg-white/10 hover:border-white/50 transition-all"
                  >
                    <span>AI Fikir Analizi</span>
                  </Link>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full justify-start px-6 py-4 text-lg font-semibold text-left"
                  onClick={(e) => handleNavClick(e, '#contact')}
                >
                  {t('nav.startProject')}
                </Button>
              </motion.div>
            </div>


          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
