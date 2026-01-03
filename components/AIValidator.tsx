import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Cpu, RefreshCw, AlertCircle, AlertTriangle, Code2, Layers, Clock, BarChart3, Wallet, Info, Activity, Loader2 } from 'lucide-react';
import { useProductAnalysis } from '../hooks/useAI';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import MarkdownRenderer from './MarkdownRenderer';
import { useTranslation, Trans } from 'react-i18next';
import { stripRedundantMonetizationHeading } from '../utils/markdown';

const LOADING_MESSAGES = [
  "Analiz başlatılıyor...",
  "Teknik gereksinimler taranıyor...",
  "Pazar verileri karşılaştırılıyor...",
  "Mimari kurgulanıyor...",
  "Rapor hazırlanıyor..."
];

const AIValidator: React.FC = () => {
  const [ideaInput, setIdeaInput] = useState('');
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const { analysis, isAnalyzing, error, analyze, reset } = useProductAnalysis();
  const { t } = useTranslation();
  const monetizationStrategy = stripRedundantMonetizationHeading(analysis?.monetizationStrategy || '');

  // Loading message rotation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      setLoadingMsgIndex(0);
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaInput.trim()) return;
    await analyze(ideaInput);
  };

  const handleReset = () => {
    reset();
    setIdeaInput('');
  };

  // Improved Circular Progress Component
  const CircularProgress = ({ score }: { score: number }) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="relative w-40 h-40 flex items-center justify-center mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#1e293b"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeLinecap="round"
            className={`${score > 75 ? 'text-green-500' : score > 50 ? 'text-amber-500' : 'text-red-500'}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring" }}
            className="text-4xl font-bold text-white tracking-tighter"
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>
    );
  };

  const getComplexityLabel = (value: number) => {
    if (value >= 80) return 'Çok karmaşık';
    if (value >= 60) return 'Karmaşık';
    if (value >= 40) return 'Orta';
    if (value >= 20) return 'Düşük';
    return 'Çok düşük';
  };

  const ComplexityBar = ({ label, value, color }: { label: string, value: number, color: string }) => {
    const safeValue = Math.max(0, Math.min(100, value));
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          <span>{label}</span>
          <span className="text-slate-200">{getComplexityLabel(safeValue)}</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${safeValue}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-12 md:py-40 bg-slate-50 dark:bg-[#030712] relative border-t border-slate-200 dark:border-white/5 min-h-[800px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal width="100%" className="max-w-3xl mx-auto">

          <AnimatePresence mode="wait">
            {!analysis && !isAnalyzing && (
              <motion.div
                key="input-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-16">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
                    <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{t('aiValidator.badge')}</span>
                  </div>
                  <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-8"></div>
                  <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-serif">
                    <Trans i18nKey="aiValidator.title" components={{ br: <br />, span: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 dark:from-indigo-400 to-purple-500 dark:to-purple-400" /> }} />
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-lg">
                    {t('aiValidator.subtitle')}
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 shadow-lg dark:shadow-2xl relative overflow-hidden">
                  <input
                    type="text"
                    placeholder={t('aiValidator.placeholder')}
                    className="flex-1 bg-transparent text-slate-900 dark:text-white px-6 py-4 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 text-lg"
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze(e)}
                  />
                  <Button
                    onClick={handleAnalyze}
                    disabled={!ideaInput.trim()}
                    className="md:w-auto w-full shrink-0 min-w-[160px]"
                    icon={<Sparkles size={18} />}
                  >
                    {t('aiValidator.analyze')}
                  </Button>
                </div>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div
                key="loading-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw size={48} className="text-indigo-500" />
                  </motion.div>
                </div>

                <div className="h-8 overflow-hidden relative w-full">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingMsgIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-xl font-medium text-white absolute left-0 right-0"
                    >
                      {LOADING_MESSAGES[loadingMsgIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="text-slate-500 mt-2 text-sm">Bu işlem yapay zeka tarafından gerçek zamanlı yapılıyor.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400"
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REPORT VIEW - VERTICALLY STACKED & ANIMATED */}
          <AnimatePresence>
            {analysis && !isAnalyzing && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mt-8 space-y-6 md:space-y-8 pb-20"
              >
                {/* 1. Verdict & Score Section (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-[#0B1121] border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>

                  <div className="flex flex-col items-center text-center">
                    <CircularProgress score={analysis.feasibilityScore} />

                    <h3 className="text-2xl font-bold text-white mb-3">{t('aiValidator.report.title')}</h3>
                    {analysis.executiveSummary && (
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-2xl">
                        {analysis.executiveSummary}
                      </p>
                    )}

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700">
                      <Clock size={16} className="text-indigo-400" />
                      <span className="text-sm text-slate-300 font-medium">{t('aiValidator.report.mvp')}: <span className="text-white font-bold">{analysis.mvpTimeline}</span></span>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Complexity Breakdown (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{t('aiValidator.report.complexity')}</h3>
                      <p className="text-slate-500 text-sm">Teknik efor dağılımı</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <ComplexityBar label={t('aiValidator.complexity.frontend')} value={analysis.complexity.frontend} color="bg-blue-500" />
                    </div>
                    <div>
                      <ComplexityBar label={t('aiValidator.complexity.backend')} value={analysis.complexity.backend} color="bg-purple-500" />
                    </div>
                    <div>
                      <ComplexityBar label={t('aiValidator.complexity.ai')} value={analysis.complexity.ai} color="bg-indigo-500" />
                    </div>
                  </div>
                </motion.div>


                {/* 3. Technical Stack (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 md:p-8">
                  <h4 className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                    <Layers size={14} /> {t('aiValidator.stack.title')}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg text-indigo-400"><Code2 size={20} /></div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase">{t('aiValidator.stack.frontend')}</div>
                        <div className="text-slate-200 font-medium text-sm">{analysis.recommendedStack.frontend.join(', ')}</div>
                      </div>
                    </div>
                    <div className="bg-slate-950/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg text-purple-400"><Cpu size={20} /></div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase">{t('aiValidator.stack.backend')}</div>
                        <div className="text-slate-200 font-medium text-sm">{analysis.recommendedStack.backend.join(', ')}</div>
                      </div>
                    </div>
                    <div className="bg-slate-950/50 border border-white/5 p-4 rounded-xl flex items-center gap-4">
                      <div className="p-2 bg-slate-800 rounded-lg text-sky-400"><BarChart3 size={20} /></div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase">{t('aiValidator.stack.infrastructure')}</div>
                        <div className="text-slate-200 font-medium text-sm">{analysis.recommendedStack.infrastructure.join(', ')}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 4. Challenges (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-[#0f0a0a] border border-red-900/30 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                      <AlertTriangle size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{t('aiValidator.report.risk')}</h3>
                  </div>
                  <div className="space-y-4">
                    {analysis.technicalChallenges.map((challenge, i) => (
                      <div key={i} className="flex gap-4 p-3 hover:bg-red-500/5 rounded-lg transition-colors">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center text-xs font-bold border border-red-500/20 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-slate-300 text-sm leading-relaxed">{challenge}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 5. Monetization (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl flex-shrink-0">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{t('aiValidator.report.monetization')}</h3>
                    <div className="text-slate-300 text-sm leading-relaxed">
                      <MarkdownRenderer content={monetizationStrategy} />
                    </div>
                  </div>
                </motion.div>

                {/* 6. Agens Insight (Strategic Closing) (Full Width) */}
                <motion.div variants={sectionVariants} className="bg-gradient-to-r from-indigo-900/20 to-slate-900 border border-indigo-500/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left shadow-lg shadow-indigo-900/10">
                  <div className="p-4 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20 flex-shrink-0 animate-pulse">
                    <Sparkles size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{t('aiValidator.report.insight')}</h3>
                    <div className="text-slate-200 leading-relaxed text-lg font-medium">
                      <MarkdownRenderer content={analysis.agensInsight} />
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-slate-900"
                  >
                    <RefreshCw size={16} /> {t('aiValidator.reset')}
                  </button>

                  <Button size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
                    {t('aiValidator.consult')} <ArrowRight size={18} className="ml-2" />
                  </Button>
                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AIValidator;
