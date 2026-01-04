import React from 'react';
import { PROJECTS } from '../constants';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const Work: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="work" className="py-8 md:py-40 bg-slate-950 scroll-mt-24">
      <div className="container mx-auto px-6">
        <ScrollReveal width="100%">
          <div className="mb-20 max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
              <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{t('work.badge')}</span>
            </div>
            <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-8"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1] font-serif">
              <Trans
                i18nKey="work.title"
                components={{
                  br: <br />,
                  span: <span className="text-indigo-400" />
                }}
              />
            </h2>
            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
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
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col bg-[#080c16] border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 h-full"
            >
              {/* Image Section */}
              <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  decoding="async"
                  className={`object-cover w-full h-full group-hover:scale-105 transition-all duration-700 ${project.inProgress ? 'opacity-40' : 'opacity-90 group-hover:opacity-100'}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/60 via-30% to-transparent"></div>

                {/* In Progress Badge */}
                {project.inProgress && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="px-4 py-2 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        <span className="text-xs font-semibold text-white tracking-wide">{t('work.inProgressLabel')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Right Arrow */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-3 md:mb-4">
                  <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase mb-2 md:mb-3 block border border-indigo-500/20 bg-indigo-500/5 w-fit px-2 py-0.5 rounded">
                    {t(`work.projects.${project.id}.category`)}
                  </span>
                  <h3 className="text-base md:text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">
                    {t(`work.projects.${project.id}.title`)}
                  </h3>
                </div>

                {/* Description (Solution) */}
                <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6">
                  {t(`work.projects.${project.id}.solution`)}
                </p>

                {/* Bullet Points - If available */}
                {(() => {
                  const bullets = t(`work.projects.${project.id}.bullets`, { returnObjects: true });
                  if (Array.isArray(bullets) && bullets.length > 0) {
                    return (
                      <ul className="space-y-2 mb-6 flex-grow">
                        {bullets.map((bullet: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5 text-slate-400 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  return <div className="flex-grow" />;
                })()}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 pt-4 md:pt-6 border-t border-white/5">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Explore Button - If projectUrl exists */}
                {project.projectUrl && (
                  <div className="mt-6 flex justify-end">
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-full transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                    >
                      <span>{t('work.explore', { title: t(`work.projects.${project.id}.title`) })}</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                )}

                {/* In Progress Button - If project is in progress */}
                {project.inProgress && !project.projectUrl && (
                  <div className="mt-6 flex justify-end">
                    <button
                      disabled
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-700/50 text-slate-400 text-sm font-medium rounded-full cursor-not-allowed border border-white/5"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                      </span>
                      <span>{t('work.inProgressButton')}</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
