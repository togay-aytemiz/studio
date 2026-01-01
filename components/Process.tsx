import React from 'react';
import { PROCESS_STEPS } from '../constants';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Search, PenTool, Code2, Rocket, ArrowRight, GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    <section id="process" className="py-36 md:py-40 bg-white dark:bg-[#040814] relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%" className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <GitBranch size={14} className="text-indigo-400" />
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t('process.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-normal">
            {t('process.title')}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {t('process.subtitle')}
          </p>
        </ScrollReveal>

        <div className="relative">
          {/* Connector Line (Desktop) - Adjusted z-index and opacity */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent -translate-y-1/2 z-0 opacity-30"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
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
                <div className="h-full bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-2xl p-8 hover:bg-slate-50 dark:hover:bg-slate-900/90 hover:border-indigo-400 dark:hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/10 flex flex-col items-start overflow-hidden shadow-sm dark:shadow-none">

                  {/* Large Background Number */}
                  <div className="absolute -right-4 -top-6 text-[100px] font-bold text-slate-200 dark:text-white/[0.03] select-none group-hover:text-slate-300 dark:group-hover:text-white/[0.06] transition-colors duration-500 font-serif">
                    0{step.id}
                  </div>

                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-700 dark:text-white mb-8 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-lg relative z-10">
                    {getIcon(step.id)}
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {t(`process.steps.${step.id}.title`)}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {t(`process.steps.${step.id}.description`)}
                    </p>
                  </div>

                  {/* Bottom Glow Effect */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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