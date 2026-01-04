import React from 'react';
import { Linkedin, Twitter, Github, Instagram, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const isEnglishRoute = location.pathname.startsWith('/en');
  const basePath = isEnglishRoute ? '/en' : '';
  const homePath = basePath || '/';

  const buildFooterHref = (href: string) => {
    if (!href.startsWith('#')) {
      return href;
    }

    return basePath ? `${basePath}${href}` : `/${href}`;
  };

  const handleFooterNav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith('#')) {
      return;
    }

    event.preventDefault();

    if (location.pathname !== homePath) {
      navigate(basePath ? `${basePath}${href}` : `/${href}`);
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', href);
  };

  const footerLinks = {
    company: [
      { label: t('footer.services.selectedWork'), href: '#work' },
      { label: t('footer.services.ourProcess'), href: '#process' },
      { label: t('nav.expertise'), href: '#services' },
      { label: t('footer.services.contact'), href: '#contact' },
    ],
    services: [
      { label: t('footer.services.strategy'), href: '#services' },
      { label: t('footer.services.uiUx'), href: '#services' },
      { label: t('footer.services.webDev'), href: '#services' },
      { label: t('footer.services.mobileApps'), href: '#services' },
    ],
    social: [
      { icon: Linkedin, href: '#', label: 'LinkedIn' },
      { icon: Twitter, href: '#', label: 'Twitter' },
      { icon: Github, href: '#', label: 'GitHub' },
      { icon: Instagram, href: '#', label: 'Instagram' },
    ]
  };

  return (
    <footer
      className="cv-auto dark pt-20 pb-10 relative overflow-hidden"
      style={{ backgroundColor: '#020617' }} /* Inline style to bypass global CSS override */
    >

      {/* Background Decor - Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-8 mb-10 md:mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center">
                <img src="/A.svg" alt="Agens Logo" className="w-full h-full" />
              </div>
              <span className="text-xl md:text-2xl font-semibold tracking-[0.4em] text-white font-brand">AGENS</span>
            </div>
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-3 md:gap-4 mt-1 md:mt-2">
              {footerLinks.social.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  aria-label={item.label}
                  title={item.label}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
                  style={{ backgroundColor: '#0f172a' }} /* Inline style to bypass override */
                >
                  <item.icon size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">{t('footer.explore')}</h4>
            <ul className="space-y-3 md:space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={buildFooterHref(link.href)}
                    onClick={(event) => handleFooterNav(event, link.href)}
                    className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium flex items-center gap-1 group"
                  >
                    {link.label}
                    {link.href.startsWith('#') ? null : <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">{t('footer.expertise')}</h4>
            <ul className="space-y-3 md:space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={buildFooterHref(link.href)}
                    onClick={(event) => handleFooterNav(event, link.href)}
                    className="text-slate-400 hover:text-white transition-colors text-xs md:text-sm font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-4 md:mb-6 text-sm md:text-base">{t('footer.contact.title')}</h4>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-xs md:text-sm">
                <MapPin size={16} className="mt-0.5 md:mt-1 text-indigo-500 flex-shrink-0 w-4 h-4 md:w-4 md:h-4" />
                <span>{t('footer.contact.address')}</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-xs md:text-sm">
                <Phone size={16} className="text-indigo-500 flex-shrink-0 w-4 h-4 md:w-4 md:h-4" />
                <a href="tel:+905074699692" className="hover:text-white transition-colors">+90 (507) 469 9692</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Agens. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">{t('footer.terms')}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
