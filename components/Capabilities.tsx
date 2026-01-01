import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { CreditCard, FileText, LayoutGrid, Calendar, Lock, Globe, Database, Bot, ChevronRight, Puzzle } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const Capabilities: React.FC = () => {
  const { t } = useTranslation();

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

  return (
    <section className="py-36 md:py-40 bg-[#020617] relative border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[100px] pointer-events-none opacity-40"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">

          {/* Header Section - Now Left Aligned & Standardized */}
          <div className="mb-20 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Puzzle size={14} className="text-indigo-400" />
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">{t('capabilities.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-normal">
              <Trans i18nKey="capabilities.title" components={{ br: <br />, span: <span className="text-slate-600" /> }} />
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              {t('capabilities.subtitle')}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITY_GROUPS.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`bg-white dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors duration-300 group shadow-sm dark:shadow-none`}
              >
                {/* Card Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${group.bg} border ${group.border} ${group.color}`}>
                    <group.icon size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{group.title}</h3>
                </div>

                {/* List Items */}
                <ul className="space-y-3">
                  {/* Check if items is array before mapping to support i18n returnObjects safety */}
                  {Array.isArray(group.items) && group.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      <ChevronRight size={14} className={`mt-0.5 ${group.color} opacity-50`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Bottom Visual */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Proficiency: High</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${group.color.replace('text-', 'bg-')} animate-pulse`}></div>
                </div>
              </motion.div>
            ))}
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
};

export default Capabilities;