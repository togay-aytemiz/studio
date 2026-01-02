import React from 'react';
import { PROCESS_STEPS } from '../constants';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Search, PenTool, Code2, Rocket, ArrowRight, GitBranch } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const Process: React.FC = () => {
  const { t } = useTranslation();

  // Map specific icons to step IDs for better visualization
  const getIcon = (id: number) => {
    switch (id) {
      case 1: return <Search className="w-6 h-6" />;
      case 2: return <PenTool className="w-6 h-6" />;
      case 3: return <Code2 className="w-6 h-6" />;
      case 4: return <Rocket className="w-6 h-6" />;
      default: return <ArrowRight className="w-6 h-6" />;
    }
  };

  return (
    <section id="process" className="py-12 md:pt-10 md:pb-24 bg-white dark:bg-[#030712] relative overflow-hidden">
      {/* CSS Overrides to defeat aggressive global styles */}

      {/* Background Image - Mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: 'url(/proceesbg-mobile.webp)' }}
      />
      {/* Background Image - Desktop */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: 'url(/proceesbg-desktop.webp)' }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />
      {/* Top gradient fade for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712] via-transparent to-transparent" />
      {/* Bottom gradient fade for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent" />

      {/* Abstract Background Elements - Light mode only */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2 dark:hidden"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%" className="max-w-3xl mb-12 md:mb-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
            <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{t('process.badge')}</span>
          </div>
          <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-8"></div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1] font-serif">
            <Trans
              i18nKey="process.title"
              components={{
                br: <br />,
                span: <span className="text-indigo-400" />
              }}
            />
          </h2>
          <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('process.subtitle')}
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Connector Line (Desktop) - Adjusted z-index and opacity */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-y-1/2 z-0 opacity-30"></div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 relative z-10">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group relative"
              >
                {/* Card Container */}
                <div className="h-full bg-white dark:bg-white/5 dark:backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 md:p-8 md:hover:bg-slate-50 md:dark:hover:bg-white/10 md:hover:border-indigo-400 md:dark:hover:border-indigo-500/30 transition-all duration-500 md:hover:-translate-y-2 md:hover:shadow-xl md:dark:hover:shadow-2xl md:hover:shadow-indigo-500/10 md:dark:hover:shadow-indigo-500/10 flex flex-col items-start overflow-hidden shadow-sm dark:shadow-none group/card">

                  {/* Large Background Number */}
                  <div className="absolute right-1 -top-2 md:-right-4 md:-top-6 text-[40px] md:text-[100px] font-bold text-slate-200 dark:text-white/[0.08] select-none md:group-hover:text-slate-300 md:dark:group-hover:text-white/[0.12] transition-colors duration-500 font-serif z-0">
                    {step.id}
                  </div>

                  {/* Icon Badge - Added icon-wrapper class */}
                  <div className="icon-wrapper w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white mb-2 md:mb-6 md:group-hover/card:text-[#ffffff] md:group-hover/card:bg-indigo-600 md:group-hover/card:border-indigo-500 group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10">
                    {getIcon(step.id)}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-3 md:group-hover:text-indigo-600 md:dark:group-hover:text-indigo-300 transition-colors">
                      {t(`process.steps.${step.id}.title`)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                      {t(`process.steps.${step.id}.description`)}
                    </p>
                  </div>

                  {/* Bottom Glow Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;