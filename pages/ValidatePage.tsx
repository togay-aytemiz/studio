import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Cpu, RefreshCw, AlertCircle, AlertTriangle, Code2, Layers, Clock, BarChart3, Wallet, Info, Activity, Loader2, ListChecks, CheckCircle2 } from 'lucide-react';
import { useProductAnalysis } from '../hooks/useAI';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MarkdownRenderer from '../components/MarkdownRenderer';
import { stripRedundantMonetizationHeading } from '../utils/markdown';
import { isOpenAIConfigured } from '../services/openaiService';

const PLACEHOLDER_IDEAS = [
    "Sağlık takibi için yapay zeka asistanı",
    "E-ticaret için müşteri segmentasyonu",
    "Restoran rezervasyon yönetim sistemi",
    "Freelancer proje yönetim platformu",
    "Akıllı ev enerji optimizasyonu",
    "Online eğitim içerik platformu",
    "Sosyal medya analiz aracı",
    "Kişisel finans yönetim uygulaması"
];

const LOADING_MESSAGES = [
    "Analiz başlatılıyor...",
    "Teknik gereksinimler taranıyor...",
    "Pazar verileri karşılaştırılıyor...",
    "Rakip analizi derinleştiriliyor...",
    "Maliyet tahminleri hesaplanıyor...",
    "Mimari kurgulanıyor...",
    "Teknoloji yığını optimize ediliyor...",
    "Ölçeklenebilirlik senaryoları test ediliyor...",
    "Risk analizi yapılıyor...",
    "Rapor hazırlanıyor..."
];

const CircularProgress = ({ score }: { score: number }) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center mx-auto my-6">
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
                    className="text-4xl font-bold text-slate-900 dark:text-white tracking-tighter"
                >
                    {score}
                </motion.span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">/ 100</span>
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

const getComplexityColorClass = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-yellow-400';
    if (value >= 20) return 'bg-emerald-400';
    return 'bg-emerald-700';
};

const getSignalColorClass = (value: number, isPositive: boolean) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const scale = ['bg-emerald-700', 'bg-emerald-400', 'bg-yellow-400', 'bg-orange-500', 'bg-red-500'];
    const index = safeValue >= 80 ? 4 : safeValue >= 60 ? 3 : safeValue >= 40 ? 2 : safeValue >= 20 ? 1 : 0;
    return isPositive ? scale[4 - index] : scale[index];
};

const ComplexityBar = ({ label, value }: { label: string, value: number }) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const colorClass = getComplexityColorClass(safeValue);
    return (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{label}</span>
                <span className="text-slate-700 dark:text-slate-300">{getComplexityLabel(safeValue)}</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${safeValue}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${colorClass}`}
                />
            </div>
        </div>
    );
};

const MarketSignalBar = ({
    label,
    valueLabel,
    value,
    isPositive
}: {
    label: string;
    valueLabel: string;
    value: number;
    isPositive: boolean;
}) => {
    const safeValue = Math.max(0, Math.min(100, value));
    const colorClass = getSignalColorClass(safeValue, isPositive);
    return (
        <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            <span>{label}</span>
            <span className="text-slate-700 dark:text-slate-300">{valueLabel}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${safeValue}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={`h-full rounded-full ${colorClass}`}
            />
        </div>
        </div>
    );
};

const ValidatePage: React.FC = () => {
    const [ideaInput, setIdeaInput] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
    const { analysis, isAnalyzing, error, analyze, reset } = useProductAnalysis();
    const { t } = useTranslation();
    const isAIEnabled = isOpenAIConfigured();
    const [bgLoaded, setBgLoaded] = useState(false);
    const mvpModules = analysis?.mvpModules?.length ? analysis.mvpModules : (analysis?.implementationSteps || []);
    const phase2Modules = analysis?.phase2Modules || [];
    const validationPlan = analysis?.validationPlan || [];
    const openQuestions = analysis?.openQuestions || [];
    const executiveSummary = analysis?.executiveSummary || '';
    const competitionDensity = analysis?.competitionDensity;
    const userDemand = analysis?.userDemand;
    const monetizationStrategy = stripRedundantMonetizationHeading(analysis?.monetizationStrategy || '');

    if (!isAIEnabled) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
                <Navbar />
                <main className="pt-24 md:pt-32 pb-16">
                    <div className="container mx-auto px-6">
                        <div className="max-w-2xl mx-auto text-center bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-2xl p-10 shadow-xl">
                            <h1 className="text-2xl md:text-3xl font-bold mb-4">AI Fikir Analizi su an kapali</h1>
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Bu ozellik istenildiginde tekrar aktif edilecek. Proje fikirlerinizi bizimle paylasmak icin iletisim formunu kullanabilirsiniz.
                            </p>
                            <Link
                                to="/#contact"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Iletisime gec
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Email sending states
    const [emailStatus, setEmailStatus] = useState<null | 'sending' | 'success' | 'error'>(null);
    const [submittedContact, setSubmittedContact] = useState({ email: '', phone: '' });
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const contactFormRef = useRef<HTMLDivElement | null>(null);
    const contactNameRef = useRef<HTMLInputElement | null>(null);

    const handleScrollToContact = () => {
        if (!contactFormRef.current) {
            return;
        }

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        contactFormRef.current.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
        });

        const focusDelay = prefersReducedMotion ? 0 : 500;
        window.setTimeout(() => {
            contactNameRef.current?.focus({ preventScroll: true });
        }, focusDelay);
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactForm.name || (!contactForm.email && !contactForm.phone)) {
            return;
        }
        setEmailStatus('sending');
        const emailTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

        const safeIdea = ideaInput.trim();
        const technicalChallenges = analysis?.technicalChallenges?.length
            ? analysis.technicalChallenges
            : [];
        const feasibilityScore = typeof analysis?.feasibilityScore === 'number'
            ? analysis.feasibilityScore
            : null;
        const mvpTimeline = analysis?.mvpTimeline?.trim() || 'Paylaşılmadı';
        const adminAnalysis = analysis
            ? {
                viabilityVerdict: analysis.viabilityVerdict,
                complexity: analysis.complexity,
                mvpModules: analysis.mvpModules,
                phase2Modules: analysis.phase2Modules,
                recommendedStack: analysis.recommendedStack,
                competitionDensity: analysis.competitionDensity,
                userDemand: analysis.userDemand,
                marketAnalysis: analysis.marketAnalysis,
                monetizationStrategy: analysis.monetizationStrategy,
                validationPlan: analysis.validationPlan,
                openQuestions: analysis.openQuestions,
                agensInsight: analysis.agensInsight
            }
            : null;
        const { sendEmail } = await import('../services/emailService');
        const emailSent = await sendEmail({
            type: 'analysis_contact',
            name: contactForm.name,
            email: contactForm.email,
            phone: contactForm.phone,
            message: contactForm.message,
            analysisIdea: safeIdea || 'Paylaşılmadı',
            executiveSummary: analysis?.executiveSummary || 'Paylaşılmadı',
            technicalChallenges,
            feasibilityScore: feasibilityScore ?? undefined,
            mvpTimeline,
            adminAnalysis: adminAnalysis ?? undefined,
            emailTheme
        });

        if (emailSent) {
            setSubmittedContact({ email: contactForm.email, phone: contactForm.phone });
            setEmailStatus('success');
            requestAnimationFrame(() => {
                contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        } else {
            setEmailStatus('error');
            setTimeout(() => setEmailStatus(null), 5000);
        }
    };

    // Animated placeholder effect
    useEffect(() => {
        const currentIdea = PLACEHOLDER_IDEAS[placeholderIndex];
        let charIndex = 0;
        let typingInterval: NodeJS.Timeout;
        let pauseTimeout: NodeJS.Timeout;

        if (isTyping) {
            typingInterval = setInterval(() => {
                if (charIndex <= currentIdea.length) {
                    setDisplayedPlaceholder(currentIdea.slice(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    pauseTimeout = setTimeout(() => {
                        setIsTyping(false);
                    }, 2000);
                }
            }, 50);
        } else {
            typingInterval = setInterval(() => {
                if (charIndex < currentIdea.length) {
                    charIndex++;
                    setDisplayedPlaceholder(currentIdea.slice(0, currentIdea.length - charIndex));
                } else {
                    clearInterval(typingInterval);
                    setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_IDEAS.length);
                    setIsTyping(true);
                }
            }, 30);
        }

        return () => {
            clearInterval(typingInterval);
            clearTimeout(pauseTimeout);
        };
    }, [placeholderIndex, isTyping]);

    // Loading message rotation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAnalyzing) {
            setLoadingMsgIndex(0);
            interval = setInterval(() => {
                setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    // Fallback for background image load
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!bgLoaded) {
                setBgLoaded(true);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [bgLoaded]);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ideaInput.trim()) return;

        // Scroll to top for better mobile experience
        window.scrollTo({ top: 0, behavior: 'smooth' });

        await analyze(ideaInput);
    };

    const handleReset = () => {
        reset();
        setIdeaInput('');
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-[#030712] flex flex-col relative">
            {/* Background Image - Hero-style reveal */}
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={bgLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{
                    duration: 1.8,
                    ease: [0.22, 1, 0.36, 1],
                    opacity: { duration: 1.2 },
                    scale: { duration: 2.2 }
                }}
            >
                <picture>
                    <source media="(max-width: 768px)" srcSet="/validatebg-mobile.webp" />
                    <img
                        src="/validatebg-desktop.webp"
                        alt="Validate Background"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                        className="w-full h-full object-cover object-center"
                        onLoad={() => setBgLoaded(true)}
                    />
                </picture>
                {/* Dark Overlay - Reduced opacity for better visibility of space background on mobile */}
                <div className="absolute inset-0 bg-black/20 md:bg-black/50 dark:bg-black/20 md:dark:bg-black/50" />
            </motion.div>

            {/* Top Gradient to mask header area */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#030712] via-[#030712]/50 to-transparent z-[5]" />

            {/* Navbar */}
            <Navbar />

            {/* Main Content - Full viewport height */}
            <main className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
                <div className="w-full max-w-4xl">
                    <AnimatePresence mode="wait">
                        {!analysis && !isAnalyzing ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                {/* Title */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="text-5xl md:text-6xl font-normal text-white mb-8 leading-[1.1] font-serif max-w-4xl mx-auto"
                                >
                                    Fikrinizi <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">saniyeler içinde</span><br />analiz edin.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.4 }}
                                    className="text-base md:text-lg text-white/70 mb-12 leading-relaxed max-w-xl mx-auto"
                                >
                                    Yapay zeka ile projenizin teknik fizibilitesini, tahmini süresini ve maliyetini öğrenin — ücretsiz.
                                </motion.p>

                                {/* Input Form */}
                                <motion.form
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                    onSubmit={handleAnalyze}
                                    className="relative"
                                >
                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 shadow-2xl">
                                        <input
                                            type="text"
                                            placeholder={displayedPlaceholder + "|"}
                                            className="flex-1 bg-transparent text-white px-4 py-3 md:px-6 md:py-4 outline-none placeholder:text-white/70 text-base md:text-lg"
                                            value={ideaInput}
                                            onChange={(e) => setIdeaInput(e.target.value)}
                                            disabled={isAnalyzing}
                                        />
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !ideaInput.trim()}
                                            className="w-full md:w-auto md:min-w-[160px] py-3 md:py-4 text-sm md:text-base"
                                            icon={<Sparkles size={16} className="md:w-[18px] md:h-[18px]" />}
                                        >
                                            Analiz Et
                                        </Button>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2"
                                        >
                                            <AlertCircle size={16} /> {error}
                                        </motion.div>
                                    )}
                                </motion.form>

                                {/* Highlights - Output Categories */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                    className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mt-10 text-center"
                                >
                                    <span className="text-white/80 font-mono uppercase text-[0.75rem] md:text-[0.875rem] tracking-[0.063rem] md:tracking-[0.094rem] leading-tight">
                                        Teknik Fizibilite
                                    </span>
                                    <span className="text-white/80 font-mono uppercase text-[0.75rem] md:text-[0.875rem] tracking-[0.063rem] md:tracking-[0.094rem] leading-tight">
                                        Maliyet Tahmini
                                    </span>
                                    <span className="text-white/80 font-mono uppercase text-[0.75rem] md:text-[0.875rem] tracking-[0.063rem] md:tracking-[0.094rem] leading-tight">
                                        Süre Öngörüsü
                                    </span>
                                </motion.div>
                            </motion.div>
                        ) : isAnalyzing ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 text-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10"
                            >
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <RefreshCw size={48} className="text-indigo-400" />
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
                                <p className="text-white/50 mt-2 text-sm">Bu işlem yapay zeka tarafından gerçek zamanlı yapılıyor.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl mb-20 mt-8 md:mt-12"
                            >
                                {/* Results Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-8 gap-4 md:gap-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
                                            <BrainCircuit size={24} className="text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-base md:text-xl text-slate-900 dark:text-white">Agens AI Analiz Sonucu</h2>
                                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">AI değerlendirmesi tamamlandı</p>
                                        </div>
                                    </div>
                                    <Button className="w-full md:w-auto" variant="outline" size="sm" onClick={handleReset} icon={<RefreshCw size={16} />}>
                                        Yeni Analiz
                                    </Button>
                                </div>

                                {/* User's Idea Display */}
                                <div className="mb-8 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Sparkles size={48} className="text-indigo-500" />
                                    </div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2">Analiz Edilen Fikir</h3>
                                    <p className="text-base md:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
                                        "{ideaInput}"
                                    </p>
                                </div>

                                <div className="space-y-4 md:space-y-8">
                                    {/* 1. Verdict & Score Section (Stacked) */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-indigo-500/20 rounded-2xl p-4 md:p-8 text-center relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                                        <CircularProgress score={analysis.feasibilityScore} />
                                        <h3 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white mb-3">Teknik Fizibilite Raporu</h3>
                                        {executiveSummary && (
                                            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-4 max-w-2xl mx-auto">
                                                {executiveSummary}
                                            </p>
                                        )}
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 mt-2">
                                            <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                                            <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">MVP Süresi: <span className="text-slate-900 dark:text-white font-bold">{analysis.mvpTimeline}</span></span>
                                        </div>
                                        <div className="mt-6 pt-5 border-t border-slate-200/70 dark:border-white/10 flex flex-col items-center gap-3">
                                            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                                                Raporu birlikte yorumlayalım, projeniz için net bir yol haritası çıkaralım.
                                            </p>
                                            <Button
                                                type="button"
                                                onClick={handleScrollToContact}
                                                className="group !bg-indigo-600 !text-white !hover:bg-indigo-500 !focus:ring-indigo-500/60 shadow-[0_0_24px_rgba(99,102,241,0.35)] text-sm md:text-base whitespace-nowrap"
                                            >
                                                Ücretsiz Ön Görüşme Ayarla
                                                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                                30 dk • Zorunluluk yok
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* 2. Complexity Breakdown */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Activity size={20} className="text-indigo-500" />
                                            <h3 className="font-bold text-slate-900 dark:text-white">Teknik Karmaşıklık</h3>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            <ComplexityBar label="Frontend & UX" value={analysis.complexity.frontend} />
                                            <ComplexityBar label="Backend & Mantık" value={analysis.complexity.backend} />
                                            <ComplexityBar label="AI & Veri" value={analysis.complexity.ai} />
                                        </div>
                                    </motion.div>

                                    {/* 2.5 MVP Modules */}
                                    {mvpModules.length > 0 && (
                                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.15 }} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-6 mt-4 md:mt-0">
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <ListChecks size={20} className="text-indigo-500" />
                                                    <h3 className="font-bold text-slate-900 dark:text-white">MVP Modülleri</h3>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pl-7">
                                                    * İlk sürümde değer üretmek için zorunlu minimum kapsam.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                                {mvpModules.map((step, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{step}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* 2.6 Phase 2 Modules */}
                                    {phase2Modules.length > 0 && (
                                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-6 mt-4 md:mt-0">
                                            <div className="mb-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Layers size={20} className="text-indigo-500" />
                                                    <h3 className="font-bold text-slate-900 dark:text-white">Faz 2 / Ölçek Modülleri</h3>
                                                </div>
                                                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pl-7">
                                                    * Ürün doğrulandıktan sonra büyümeyi ve operasyonu güçlendiren adımlar.
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                                {phase2Modules.map((step, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                                        <div className="text-xs font-medium text-slate-800 dark:text-slate-200">{step}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-6">
                                        <div className="flex items-center gap-2 mb-6">
                                            <Layers size={20} className="text-indigo-500" />
                                            <h3 className="font-bold text-slate-900 dark:text-white">Önerilen Teknolojiler</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {/* Frontend Chips */}
                                            <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                                                <div className="mb-3">
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Frontend</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.recommendedStack.frontend.map((tech, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-lg">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Backend Chips */}
                                            <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                                                <div className="mb-3">
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Backend</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.recommendedStack.backend.map((tech, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold rounded-lg">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Infrastructure Chips */}
                                            <div className="bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 p-4 rounded-xl">
                                                <div className="mb-3">
                                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Altyapı</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.recommendedStack.infrastructure.map((tech, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-lg">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Market Analysis (New) */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.35 }} className="bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-500/10 rounded-2xl p-4 md:p-6">
                                        <div className="flex items-center gap-2 mb-4 text-sky-600 dark:text-sky-400">
                                            <BarChart3 size={20} />
                                            <h3 className="font-bold text-slate-900 dark:text-white">Pazar & Rekabet Analizi</h3>
                                        </div>
                                        {(competitionDensity || userDemand) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                {competitionDensity && (
                                                    <MarketSignalBar
                                                        label="Rekabet Yoğunluğu"
                                                        valueLabel={competitionDensity.label}
                                                        value={competitionDensity.score}
                                                        isPositive={false}
                                                    />
                                                )}
                                                {userDemand && (
                                                    <MarketSignalBar
                                                        label="Kullanıcı Talebi"
                                                        valueLabel={userDemand.label}
                                                        value={userDemand.score}
                                                        isPositive={true}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div>
                                            <MarkdownRenderer content={analysis.marketAnalysis} />
                                        </div>
                                    </motion.div>

                                    {/* 4. Monetization (Moved Up) */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="bg-emerald-50 dark:bg-slate-900 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-4 md:p-6">
                                        <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                                            <Wallet size={20} />
                                            <h3 className="font-bold text-slate-900 dark:text-white">Gelir Modeli Önerisi</h3>
                                        </div>
                                        <div>
                                            <MarkdownRenderer content={monetizationStrategy} />
                                        </div>
                                    </motion.div>

                                    {/* Validation Plan & Open Questions */}
                                    {(validationPlan.length > 0 || openQuestions.length > 0) && (
                                        <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.45 }} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            {validationPlan.length > 0 && (
                                                <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 rounded-2xl p-4 md:p-6">
                                                    <div className="flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                                                        <ListChecks size={20} />
                                                        <h3 className="font-bold text-slate-900 dark:text-white">Hızlı Doğrulama Planı</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {validationPlan.map((item, idx) => (
                                                            <div key={`${item}-${idx}`} className="flex gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                                                                    {idx + 1}
                                                                </span>
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {openQuestions.length > 0 && (
                                                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-6">
                                                    <div className="flex items-center gap-2 mb-4 text-slate-600 dark:text-slate-300">
                                                        <Info size={20} />
                                                        <h3 className="font-bold text-slate-900 dark:text-white">Netleştirilmesi Gereken Sorular</h3>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {openQuestions.map((item, idx) => (
                                                            <div key={`${item}-${idx}`} className="flex gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold">
                                                                    {idx + 1}
                                                                </span>
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* 5. Challenges (Moved Down) */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-red-50 dark:bg-[#0f0a0a] border border-red-100 dark:border-red-900/30 rounded-2xl p-4 md:p-6">
                                        <div className="flex items-center gap-2 mb-4 text-red-600 dark:text-red-500">
                                            <AlertTriangle size={20} />
                                            <h3 className="font-bold">Riskler ve İlk Önlemler</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {analysis.technicalChallenges.map((challenge, i) => (
                                                <div key={i} className="flex gap-3 text-xs md:text-sm text-slate-600 dark:text-slate-300">
                                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </span>
                                                    {challenge}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* 6. Agens Insight */}
                                    <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-slate-900 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start gap-6 text-left">
                                        <div className="p-4 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/20 flex-shrink-0">
                                            <Sparkles size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Agens AI Stratejik Tavsiyesi</h3>
                                            <div className="text-slate-600 dark:text-slate-200 font-medium">
                                                <MarkdownRenderer content={analysis.agensInsight} />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* AI Disclaimer */}
                                    <div className="text-center px-4">
                                        <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed">
                                            <span className="font-semibold text-slate-500 dark:text-slate-400">Yasal Uyarı:</span> Agens AI tarafından üretilen bu analiz ve stratejiler, yapay zeka modelleri kullanılarak oluşturulmuştur ve yalnızca bilgilendirme amaçlıdır. Nihai yatırım ve geliştirme kararlarınızı almadan önce lütfen profesyonel bir uzmana danışın.
                                        </p>
                                    </div>
                                </div>

                                {/* Contact Form Section */}
                                <div ref={contactFormRef} id="contact-form" className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-slate-200 dark:border-white/5">

                                    <AnimatePresence mode="wait">
                                        {emailStatus === 'success' ? (
                                            <motion.div
                                                key="validate-success"
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                                className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl p-6 md:p-10 shadow-xl text-left"
                                            >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-10 w-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-500 dark:text-emerald-300">
                                                    <CheckCircle2 size={20} />
                                                </div>
                                                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Mesajınızı aldık</p>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Fikrinizi aldık. Paylaştığınız bilgiler doğrultusunda AI destekli ön analiz tamamlandı.
                                                Bir sonraki adımda, fikri birlikte ele alıp ürünleştirme ve teknik yol haritasını netleştirmek için kısa bir görüşme öneriyoruz.
                                            </p>
                                            <p className="mt-4 text-slate-600 dark:text-slate-300">
                                                {submittedContact.email && submittedContact.phone
                                                    ? (
                                                        <>
                                                            Talebiniz ekibimize iletildi. Yaklaşık 24 saat içinde sizinle paylaştığınız{" "}
                                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedContact.email}</span>{" "}
                                                            ya da{" "}
                                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedContact.phone}</span>{" "}
                                                            üzerinden iletişime geçeceğiz.
                                                        </>
                                                    )
                                                    : submittedContact.phone
                                                    ? (
                                                        <>
                                                            Talebiniz ekibimize iletildi. Yaklaşık 24 saat içinde sizinle paylaştığınız{" "}
                                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedContact.phone}</span>{" "}
                                                            üzerinden iletişime geçeceğiz.
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            Talebiniz ekibimize iletildi. Yaklaşık 24 saat içinde sizinle paylaştığınız{" "}
                                                            <span className="font-semibold text-slate-900 dark:text-white">{submittedContact.email || 'e-posta'}</span>{" "}
                                                            üzerinden iletişime geçeceğiz.
                                                        </>
                                                    )}
                                            </p>
                                            </motion.div>
                                        ) : (
                                            <motion.form
                                                key="validate-form"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -8 }}
                                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                                onSubmit={handleContactSubmit}
                                                className="bg-slate-50 dark:bg-[#0f0a0a] border border-slate-100 dark:border-white/5 rounded-2xl p-4 md:p-8"
                                            >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                                            <div className="group">
                                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Ad Soyad</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        required
                                                        ref={contactNameRef}
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                        placeholder="Adınız Soyadınız"
                                                    />
                                                </div>
                                            </div>
                                            <div className="group">
                                                <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Telefon</label>
                                                <div className="relative">
                                                    <input
                                                        type="tel"
                                                        value={contactForm.phone}
                                                        onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                        placeholder="0555 555 55 55"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-8">
                                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">E-posta Adresi</label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    value={contactForm.email}
                                                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                                                    placeholder="ornek@sirket.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 ml-1">Proje Detayları / Notunuz</label>
                                            <textarea
                                                rows={6}
                                                value={contactForm.message}
                                                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-xs md:placeholder:text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none leading-relaxed"
                                                placeholder={`AI analiz raporu ekibe iletilecek. Ek talepleriniz varsa buraya yazabilirsiniz, yoksa boş bırakabilirsiniz.`}
                                            />
                                        </div>

                                        <div className="flex justify-center md:justify-end">
                                            <Button
                                                type="submit"
                                                size="md"
                                                disabled={emailStatus === 'sending' || !contactForm.name || (!contactForm.email && !contactForm.phone)}
                                                className="group !px-5 !py-2.5 !text-sm md:!px-6 md:!py-3 md:!text-base w-full md:w-auto"
                                            >
                                                {emailStatus === 'sending' ? 'Gönderiliyor...' : 'Gönder'}
                                                {emailStatus !== 'sending' && (
                                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                                )}
                                            </Button>
                                        </div>
                                            </motion.form>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            {/* Gradient Transition to Footer */}
            <div className="h-48 bg-gradient-to-b from-transparent to-[#020617] relative z-10 -mb-1 w-full pointer-events-none"></div>

            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default ValidatePage;
