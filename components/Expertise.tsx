import React, { useState, useMemo } from 'react';
import { SERVICES } from '../constants';
import ScrollReveal from './ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, LayoutGrid, Calendar, Bot, ChevronRight } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const Expertise: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'services' | 'capabilities'>('services');

    // Reusing Capability Groups Logic
    const CAPABILITY_GROUPS = useMemo(() => [
        {
            id: "fintech",
            title: t('capabilities.groups.fintech.title'),
            icon: CreditCard,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            items: t('capabilities.groups.fintech.items', { returnObjects: true }) as string[]
        },
        {
            id: "saas",
            title: t('capabilities.groups.saas.title'),
            icon: LayoutGrid,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            items: t('capabilities.groups.saas.items', { returnObjects: true }) as string[]
        },
        {
            id: "ops",
            title: t('capabilities.groups.ops.title'),
            icon: Calendar,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            items: t('capabilities.groups.ops.items', { returnObjects: true }) as string[]
        },
        {
            id: "ai",
            title: t('capabilities.groups.ai.title'),
            icon: Bot,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            items: t('capabilities.groups.ai.items', { returnObjects: true }) as string[]
        }
    ], [t]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        exit: { opacity: 0 }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section id="services" className="bg-slate-50 dark:bg-slate-950 relative overflow-hidden pb-20 md:pb-32">
            {/* Background Decor */}
            <div className="absolute left-0 top-0 w-full h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none"></div>

            {/* Header Section - Left Aligned */}
            <div className="container mx-auto px-6 pt-20 md:pt-32 pb-12 relative z-10">
                <ScrollReveal>
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
                            <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                                {t('expertise.badge', 'Yeteneklerimiz')}
                            </span>
                        </div>
                        <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-8"></div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif leading-tight">
                            <Trans
                                i18nKey="expertise.title"
                                defaults="Uçtan Uca <br /> <span>Dijital Çözümler.</span>"
                                components={{ br: <br />, span: <span className="text-slate-500 dark:text-slate-500" /> }}
                            />
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
                            {t('expertise.subtitle', 'Hem teknik uygulama hem de sektörel deneyim. İhtiyacınız olan tüm yetkinlikler tek bir noktada.')}
                        </p>
                    </div>
                </ScrollReveal>
            </div>

            {/* Sticky Tabs Navigation - Intercom Style */}
            <div className="sticky top-[80px] z-30 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md border-y border-slate-200 dark:border-white/10 mb-12">
                <div className="container mx-auto px-6">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`relative py-4 text-xs md:text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === 'services' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {t('expertise.tabs.services', 'Hizmetler')}
                            {activeTab === 'services' && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"
                                />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('capabilities')}
                            className={`relative py-4 text-xs md:text-sm font-bold tracking-widest uppercase transition-colors whitespace-nowrap ${activeTab === 'capabilities' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            {t('expertise.tabs.capabilities', 'Sektörel Deneyim')}
                            {activeTab === 'capabilities' && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white"
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-6 relative z-10 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'services' ? (
                        <motion.div
                            key="services-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
                        >
                            {SERVICES.map((service, index) => {
                                const keyId = service.id.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                                return (
                                    <motion.div
                                        key={service.id}
                                        variants={itemVariants}
                                        className="h-full p-8 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 relative overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all duration-300 group shadow-sm dark:shadow-none"
                                    >
                                        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                                            <service.icon size={26} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                                            {t(`services.items.${keyId}.title`)}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
                                            {t(`services.items.${keyId}.description`)}
                                        </p>
                                        {/* Decorative corner */}
                                        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-3xl pointer-events-none"></div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="capabilities-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {CAPABILITY_GROUPS.map((group) => (
                                <motion.div
                                    key={group.id}
                                    variants={itemVariants}
                                    className={`bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors duration-300 group shadow-sm dark:shadow-none`}
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`p-3 rounded-xl ${group.bg} border ${group.border} ${group.color}`}>
                                            <group.icon size={24} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{group.title}</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {Array.isArray(group.items) && group.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                                                <ChevronRight size={14} className={`mt-0.5 ${group.color} opacity-50`} />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default Expertise;
