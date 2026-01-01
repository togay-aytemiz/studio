import React from 'react';
import { Linkedin, Twitter, Github, Instagram, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

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
      { icon: Linkedin, href: '#' },
      { icon: Twitter, href: '#' },
      { icon: Github, href: '#' },
      { icon: Instagram, href: '#' },
    ]
  };

  return (
    <footer
      className="dark border-t border-white/5 pt-20 pb-10 relative overflow-hidden"
      style={{ backgroundColor: '#020617' }} /* Inline style to bypass global CSS override */
    >

      {/* Background Decor - Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20"
                style={{ background: 'linear-gradient(to bottom right, #6366f1, #a855f7)' }}
              >
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Nexus</span>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4 mt-2">
              {footerLinks.social.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
                  style={{ backgroundColor: '#0f172a' }} /* Inline style to bypass override */
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h4 className="text-white font-bold mb-6">{t('footer.explore')}</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-1 group">
                    {link.label}
                    {link.href.startsWith('#') ? null : <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">{t('footer.expertise')}</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6">{t('footer.studio')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-400 text-sm">
                <MapPin size={16} className="mt-1 text-indigo-500 flex-shrink-0" />
                <span><Trans i18nKey="footer.address" components={{ br: <br /> }} /></span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Mail size={16} className="text-indigo-500 flex-shrink-0" />
                <a href="mailto:hello@nexus.studio" className="hover:text-white transition-colors">hello@nexus.studio</a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <Phone size={16} className="text-indigo-500 flex-shrink-0" />
                <a href="tel:+15550123456" className="hover:text-white transition-colors">+1 (555) 012-3456</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Nexus Product Studio. {t('footer.rights')}
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