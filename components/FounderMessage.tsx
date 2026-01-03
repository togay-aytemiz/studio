import React from 'react';
import { Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useTranslation, Trans } from 'react-i18next';

const FounderMessage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="py-12 md:py-40 bg-[#020617] relative overflow-hidden">

      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet="/founder-desktop.webp" />
          <img src="/founder-mobile.webp" alt="" className="w-full h-full object-cover opacity-95" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/70 to-[#020617]/70 md:via-[#020617]/40 md:to-transparent"></div>
      </div>

      {/* Top Gradient for Smooth Transition */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#020617] to-transparent z-10 pointer-events-none"></div>

      {/* Bottom Gradient for Smooth Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] to-transparent z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="max-w-6xl mx-auto">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

              {/* Image Section (Left) - Editorial Style */}
              <motion.div
                className="col-span-1 md:col-span-5 relative max-w-[280px] mx-auto md:max-w-none"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-white/10 group">
                  <div className="absolute inset-0 bg-indigo-500/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-all duration-700"></div>
                  <img
                    src="/profile.webp"
                    alt={t('founder.name')}
                    className="w-full aspect-[4/5] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  />

                  {/* Mobile Badge Overlay - Only visible on mobile */}
                  <div className="absolute top-4 left-4 z-20 md:hidden animate-fade-in">
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg py-1.5 px-3 flex items-center gap-2">
                      <Quote size={14} className="text-white fill-current" />
                      <span className="text-white text-xs font-semibold tracking-wider uppercase">{t('founder.badge')}</span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements around image */}

                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-full h-full border border-indigo-500/30 rounded-2xl -z-10"></div>
              </motion.div>

              {/* Text Section (Right) */}
              <div className="col-span-1 md:col-span-7 relative">

                {/* Large Background Quote Mark - Desktop Only */}
                <div className="absolute -top-16 -left-8 text-indigo-500/10 -z-10 select-none hidden md:block">
                  <Quote size={180} fill="currentColor" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="hidden md:flex items-center gap-4 mb-6">
                    <div className="h-px w-12 bg-indigo-500"></div>
                    <span className="text-indigo-400 font-medium uppercase tracking-widest text-xs">{t('founder.badge')}</span>
                  </div>

                  <h3 className="text-2xl md:text-5xl font-serif text-white mb-6 md:mb-8 leading-[1.15] md:leading-normal mt-2 md:mt-0">
                    "<Trans i18nKey="founder.quote" components={{ br: <br />, span: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300" /> }} />"
                  </h3>

                  <div className="space-y-6 text-slate-400 text-sm md:text-lg leading-relaxed font-light">
                    <p>
                      {t('founder.p1')}
                    </p>
                    <p>
                      {t('founder.p2')}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-4">
                    <div>
                      <h4 className="text-white font-bold text-xl font-serif">{t('founder.name')}</h4>
                      <p className="text-indigo-500/80 text-sm font-medium">{t('founder.role')}</p>
                    </div>

                    {/* Visual signature representation */}
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4"></div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FounderMessage;