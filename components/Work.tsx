import React from 'react';
import { PROJECTS } from '../constants';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';
import { ArrowUpRight, Trophy, Zap, Layers } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const Work: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="work" className="py-36 md:py-40 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <ScrollReveal width="100%">
          <div className="mb-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Trophy size={14} className="text-indigo-400" />
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t('work.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-normal">
              <Trans i18nKey="work.title" components={{ br: <br /> }} />
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {t('work.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col bg-[#080c16] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 h-full"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-transparent to-transparent opacity-90"></div>

                {/* Top Right Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-3 block border border-indigo-500/20 bg-indigo-500/5 w-fit px-2 py-0.5 rounded">
                    {t(`work.projects.${project.id}.category`)}
                  </span>
                  <h3 className="text-2xl font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {t(`work.projects.${project.id}.title`)}
                  </h3>
                </div>

                {/* Description (Solution) */}
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                  {t(`work.projects.${project.id}.solution`)}
                </p>

                {/* Outcome Badge */}
                <div className="mb-6 bg-slate-950/50 border border-white/5 rounded-xl p-4 flex items-start gap-3 group-hover:border-indigo-500/20 transition-colors">
                  <div className="mt-1 text-emerald-400">
                    <Zap size={16} fill="currentColor" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">{t('work.impact')}</span>
                    <span className="text-sm font-medium text-white">{t(`work.projects.${project.id}.outcome`)}</span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;