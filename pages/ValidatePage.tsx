import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, ArrowRight, Cpu, RefreshCw, AlertCircle, AlertTriangle, Code2, Layers, Clock, BarChart3, Wallet, Info, Activity } from 'lucide-react';
import { useProductAnalysis } from '../hooks/useAI';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const ValidatePage: React.FC = () => {
    const [ideaInput, setIdeaInput] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [displayedPlaceholder, setDisplayedPlaceholder] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const { analysis, isAnalyzing, error, analyze, reset } = useProductAnalysis();
    const { t } = useTranslation();

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

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ideaInput.trim()) return;
        await analyze(ideaInput);
    };

    const handleReset = () => {
        reset();
        setIdeaInput('');
    };

    // Circular Progress Component
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

    const ComplexityBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
        <div className="mb-4 last:mb-0">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 dark:from-[#030712] dark:via-[#030712] dark:to-[#030712] flex flex-col relative">
            {/* Background Image - Mobile */}
            <div
                className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/validatebg-mobile.webp)' }}
            />
            {/* Background Image - Desktop */}
            <div
                className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/validatebg-desktop.webp)' }}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/50" />

            {/* Navbar */}
            <Navbar />

            {/* Main Content - Full viewport height */}
            <main className="min-h-screen flex items-center justify-center px-6 pt-20 relative z-10">
                <div className="w-full max-w-3xl">
                    <AnimatePresence mode="wait">
                        {!analysis ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                {/* Title */}
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight font-serif">
                                    Fikrinizi <span className="relative inline-block" style={{ textShadow: '0 0 10px rgba(129, 140, 248, 0.8), 0 0 20px rgba(129, 140, 248, 0.6), 0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.4), 0 0 120px rgba(139, 92, 246, 0.3)' }}>saniyeler içinde</span><br />analiz edin.
                                </h1>

                                <p className="text-lg text-white/70 mb-12 max-w-xl mx-auto">
                                    Yapay zeka ile projenizin teknik fizibilitesini, tahmini süresini ve maliyetini öğrenin — ücretsiz.
                                </p>

                                {/* Input Form */}
                                <form onSubmit={handleAnalyze} className="relative">
                                    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-2 md:p-3 flex flex-col md:flex-row gap-2 shadow-xl dark:shadow-2xl">
                                        <input
                                            type="text"
                                            placeholder={displayedPlaceholder + "|"}
                                            className="flex-1 bg-transparent text-slate-900 dark:text-white px-4 py-3 md:px-6 md:py-4 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-base md:text-lg"
                                            value={ideaInput}
                                            onChange={(e) => setIdeaInput(e.target.value)}
                                            disabled={isAnalyzing}
                                        />
                                        <Button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !ideaInput.trim()}
                                            className="w-full md:w-auto md:min-w-[160px] py-3 md:py-4 text-sm md:text-base"
                                            icon={isAnalyzing ? <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles size={16} className="md:w-[18px] md:h-[18px]" />}
                                        >
                                            {isAnalyzing ? 'Analiz Ediliyor...' : 'Analiz Et'}
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
                                </form>

                                {/* Feature Pills */}
                                <div className="flex flex-wrap justify-center gap-3 mt-10">
                                    {['Teknik Fizibilite', 'Pazar Analizi', 'Maliyet Tahmini', 'Süre Öngörüsü'].map((feature) => (
                                        <span key={feature} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 text-sm font-medium border border-slate-200 dark:border-slate-700">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl"
                            >
                                {/* Results Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
                                            <BrainCircuit size={24} className="text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-900 dark:text-white">Analiz Sonucu</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">AI değerlendirmesi tamamlandı</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleReset} icon={<RefreshCw size={16} />}>
                                        Yeni Analiz
                                    </Button>
                                </div>

                                {/* Score */}
                                <CircularProgress score={analysis.score} />

                                {/* Summary */}
                                <div className="text-center mb-8">
                                    <p className="text-slate-600 dark:text-slate-300">{analysis.summary}</p>
                                </div>

                                {/* Complexity Bars */}
                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                        <ComplexityBar label="Teknik Karmaşıklık" value={analysis.technicalComplexity} color="bg-blue-500" />
                                        <ComplexityBar label="Pazar Potansiyeli" value={analysis.marketPotential} color="bg-green-500" />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock size={14} className="text-amber-500" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tahmini Süre</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.estimatedTime}</p>

                                        <div className="flex items-center gap-2 mb-2 mt-4">
                                            <Wallet size={14} className="text-emerald-500" />
                                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Bütçe Aralığı</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{analysis.budgetRange}</p>
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info size={16} className="text-indigo-600 dark:text-indigo-400" />
                                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">Öneriler</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {analysis.recommendations?.map((rec: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <ArrowRight size={14} className="mt-0.5 text-indigo-500" />
                                                {rec}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* CTA */}
                                <div className="mt-8 text-center">
                                    <Link to="/#contact">
                                        <Button size="lg" icon={<ArrowRight size={18} />}>
                                            Projeye Başlayalım
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
            {/* Footer */}
            <div className="relative z-10">
                <Footer />
            </div>
        </div>
    );
};

export default ValidatePage;
