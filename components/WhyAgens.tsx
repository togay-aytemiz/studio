import React from 'react';
import ScrollReveal from './ScrollReveal';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { isOpenAIConfigured } from '../services/openaiService';

const WhyAgens: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isAIEnabled = isOpenAIConfigured();
    const isEnglishRoute = location.pathname.startsWith('/en');
    const basePath = isEnglishRoute ? '/en' : '';

    const items = ['product', 'speed', 'team', 'architecture'];

    return (
        <section id="why-agens" className="cv-auto py-12 md:py-20 bg-white dark:bg-[#030712] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50 dark:from-[#030712] dark:via-[#030712]/80 dark:to-slate-950/70 pointer-events-none" />
            <div className="container mx-auto px-6 relative z-10">
                <ScrollReveal width="100%" className="max-w-3xl mb-8 md:mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
                        <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                            {t('whyAgens.badge')}
                        </span>
                    </div>
                    <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-6 md:mb-8"></div>
                    <h2 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white mb-4 md:mb-5 font-serif leading-tight">
                        <Trans
                            i18nKey="whyAgens.title"
                            components={{ br: <br />, span: <span className="text-indigo-400" /> }}
                        />
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t('whyAgens.subtitle')}
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.45fr] gap-10 lg:gap-16">
                    <ScrollReveal width="100%" className="lg:pt-2">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            {['experience', 'recommendation'].map((key) => (
                                <div
                                    key={key}
                                    className="rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/30 p-4 md:p-6 shadow-sm dark:shadow-none"
                                >
                                    <div className="text-xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-1">
                                        {t(`whyAgens.metrics.${key}.value`)}
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {t(`whyAgens.metrics.${key}.label`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 md:mt-8 hidden lg:flex flex-col gap-5 lg:mt-10">
                            <span className="text-sm text-slate-500 dark:text-slate-400 max-w-sm lg:max-w-md xl:max-w-lg leading-relaxed">
                                {t('whyAgens.ctaLabel')}
                            </span>
                            <div className="flex items-start gap-3">
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                        className="px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-900 text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-all shadow-lg"
                                    >
                                        {t('hero.startProject')}
                                    </button>
                                    <span className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-tight text-center">
                                        {t('hero.ctaNote')}
                                    </span>
                                </div>
                                {isAIEnabled && (
                                    <Link
                                        to={basePath ? `${basePath}/validate` : '/validate'}
                                        className="px-5 py-2.5 md:px-6 md:py-3 bg-transparent text-slate-700 dark:text-white text-sm md:text-base font-medium rounded-full border border-slate-300 dark:border-white/30 hover:bg-slate-900/5 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/50 transition-all"
                                    >
                                        {t('nav.aiIdeaAnalysis')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="divide-y divide-slate-200/80 dark:divide-white/10 border-t border-b border-slate-200/80 dark:border-white/10">
                        {items.map((item, index) => {
                            const number = String(index + 1).padStart(2, '0');
                            return (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.08 }}
                                    className="py-5 md:py-7"
                                >
                                    <div className="flex items-start gap-5 md:gap-6">
                                        <div className="text-sm md:text-base font-semibold text-slate-400/60 dark:text-slate-500/60 tracking-[0.35em] min-w-[2.5rem]">
                                            {number}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                                                {t(`whyAgens.items.${item}.title`)}
                                            </h3>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {t(`whyAgens.items.${item}.description`)}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-5 md:mt-8 flex flex-col items-center gap-3 lg:hidden">
                        <span className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
                            {t('whyAgens.ctaLabel')}
                        </span>
                        <div className="flex flex-row items-start justify-center gap-3">
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                                    className="px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-900 text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-all shadow-lg"
                                >
                                    {t('hero.startProject')}
                                </button>
                                <span className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 leading-tight text-center">
                                    {t('hero.ctaNote')}
                                </span>
                            </div>
                            {isAIEnabled && (
                                <Link
                                    to={basePath ? `${basePath}/validate` : '/validate'}
                                    className="px-5 py-2.5 md:px-6 md:py-3 bg-transparent text-slate-700 dark:text-white text-sm md:text-base font-medium rounded-full border border-slate-300 dark:border-white/30 hover:bg-slate-900/5 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/50 transition-all"
                                >
                                    {t('nav.aiIdeaAnalysis')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyAgens;
