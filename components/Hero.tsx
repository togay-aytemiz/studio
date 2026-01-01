import React, { useState, useEffect } from 'react';
import Button from './Button';
import { ArrowRight, Zap, BrainCircuit, Layers, TrendingUp, CheckCircle2, ShieldCheck, Cloud, Code2, Smartphone, Palette, Globe, Rocket, Search, Server, Database, Bot, Sparkles, MessageSquare, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- BACKGROUND ANIMATION COMPONENT: ORBITAL SYSTEM ---
const OrbitalSystem = () => {
  // Center point roughly at 720, 500

  // Orbit 1: Inner (Fastest, solid structure)
  const orbit1 = "M 370, 500 a 350,120 0 1,0 700,0 a 350,120 0 1,0 -700,0";

  // Orbit 2: Middle (The Tech Layer - Dashed)
  const orbit2 = "M 170, 500 a 550,220 0 1,0 1100,0 a 550,220 0 1,0 -1100,0";

  // Orbit 3: Outer (The Boundary - Faint)
  const orbit3 = "M -30, 500 a 750,350 0 1,0 1500,0 a 750,350 0 1,0 -1500,0";

  // Comet Path: Crossing the system diagonally (Idea entering reality)
  // Starts top-left-ish, curves through center, exits bottom-right
  const cometPath = "M 0,200 Q 720,500 1440,800";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      <svg className="w-full h-full opacity-60" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.8)" />
            <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
          </linearGradient>

          <linearGradient id="comet-tail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(165, 180, 252, 0.8)" />
          </linearGradient>

          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.3)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
          </radialGradient>
        </defs>

        {/* --- CENTRAL CORE (Pulse) --- */}
        <circle cx="720" cy="500" r="150" fill="url(#core-glow)">
          <animate attributeName="r" values="150;170;150" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* --- ORBIT 1 (INNER - Structure) --- */}
        {/* Track - More visible now */}
        <path d={orbit1} stroke="currentColor" strokeWidth="1.5" fill="none" className="text-white/10 dark:text-white/10" style={{ stroke: 'var(--orbit-stroke, rgba(99, 102, 241, 0.3))' }} />
        {/* Moving Particle */}
        <circle r="3" fill="#818cf8">
          <animateMotion dur="12s" repeatCount="indefinite" path={orbit1} />
        </circle>
        {/* Trail Effect */}
        <path d={orbit1} stroke="url(#orbit-gradient)" strokeWidth="2" fill="none" strokeDasharray="100 1200" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="0" to="-1300" dur="12s" repeatCount="indefinite" />
        </path>


        {/* --- ORBIT 2 (MIDDLE - Tech/Data) --- */}
        {/* Track - Dashed line for UI/HUD feel */}
        <path d={orbit2} stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 6" style={{ stroke: 'var(--orbit-stroke, rgba(99, 102, 241, 0.2))' }} />
        {/* Secondary Solid Arc just for aesthetics on part of the ring */}
        <path d={orbit2} stroke="rgba(99, 102, 241, 0.2)" strokeWidth="1" fill="none" strokeDasharray="200 1500" strokeDashoffset="500" />

        {/* Moving Particle */}
        <circle r="4" fill="#a78bfa">
          <animateMotion dur="24s" repeatCount="indefinite" path={orbit2} begin="0s" />
        </circle>
        {/* Counter-Orbit Particle */}
        <circle r="2" fill="#6366f1">
          <animateMotion keyPoints="1;0" keyTimes="0;1" dur="30s" repeatCount="indefinite" path={orbit2} />
        </circle>


        {/* --- ORBIT 3 (OUTER - Boundary) --- */}
        {/* Track - Very faint */}
        <path d={orbit3} stroke="currentColor" strokeWidth="1" fill="none" style={{ stroke: 'var(--orbit-stroke, rgba(99, 102, 241, 0.15))' }} />


        {/* --- THE COMET (Idea -> Product) --- */}
        {/* This path is invisible, used for the comet motion */}
        <path id="cometTrack" d={cometPath} fill="none" />

        {/* The Comet Head */}
        <circle r="3" fill="#6366f1" filter="drop-shadow(0 0 4px #6366f1)">
          <animateMotion dur="15s" repeatCount="indefinite" path={cometPath} rotate="auto">
            {/* Optional: Ease-in-out for more natural flyby */}
            <mpath xlinkHref="#cometTrack" />
          </animateMotion>
          {/* Fade in/out at edges */}
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="15s" repeatCount="indefinite" />
        </circle>

        {/* --- DECORATIVE NODES (Static Stations) --- */}
        <g opacity="0.4">
          <circle cx="1070" cy="500" r="4" fill="#4f46e5" /> {/* Orbit 1 Right */}
          <circle cx="370" cy="500" r="4" fill="#4f46e5" />  {/* Orbit 1 Left */}
          <circle cx="720" cy="280" r="3" fill="#9333ea" />  {/* Orbit 2 Top */}
          <circle cx="720" cy="720" r="3" fill="#9333ea" />  {/* Orbit 2 Bottom */}
        </g>
      </svg>
    </div>
  );
};

// --- DATA POOLS FOR DYNAMIC SLOTS ---
import { useTranslation, Trans } from 'react-i18next';
import { useMemo } from 'react';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();

  // Independent state for each card to allow random-ordered updates
  const [topLeftIndex, setTopLeftIndex] = useState(0);
  const [topRightIndex, setTopRightIndex] = useState(0);
  const [bottomLeftIndex, setBottomLeftIndex] = useState(0);
  const [bottomRightIndex, setBottomRightIndex] = useState(0);

  const yBackground = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Memoize pools to react to language changes
  const POOL_TOP_LEFT = useMemo(() => [
    { icon: Zap, value: "100", max: "/100", label: t('hero.stats.lighthouse'), color: "text-green-400", barColor: "bg-green-500", bg: "bg-green-500/10" },
    { icon: Search, value: "100", max: "%", label: t('hero.stats.seo'), color: "text-blue-400", barColor: "bg-blue-500", bg: "bg-blue-500/10" },
    { icon: CheckCircle2, value: "A+", max: "", label: t('hero.stats.quality'), color: "text-indigo-400", barColor: "bg-indigo-500", bg: "bg-indigo-500/10" },
  ], [t]);

  const POOL_TOP_RIGHT = useMemo(() => [
    { icon: Sparkles, label: t('hero.features.smartContext'), sub: t('hero.features.dataGrounding'), color: "text-indigo-400", bg: "bg-indigo-500/20" },
    { icon: BrainCircuit, label: t('hero.features.llmIntegration'), sub: "", color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: Database, label: t('hero.features.aiMemory'), sub: t('hero.features.semanticSearch'), color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { icon: ShieldCheck, label: t('hero.features.enterpriseAi'), sub: t('hero.features.securePrivate'), color: "text-sky-400", bg: "bg-sky-500/20" },
  ], [t]);

  const POOL_BOTTOM_LEFT = useMemo(() => [
    { icon: Layers, label: t('hero.features.strategy'), sub: t('hero.features.productFirst'), color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: Palette, label: t('hero.features.uiUx'), sub: t('hero.features.pixelPerfect'), color: "text-pink-400", bg: "bg-pink-500/20" },
    { icon: MessageSquare, label: t('hero.features.promptEng'), sub: t('hero.features.fineTuning'), color: "text-amber-400", bg: "bg-amber-500/20" },
  ], [t]);

  const POOL_BOTTOM_RIGHT = useMemo(() => [
    { icon: TrendingUp, label: t('hero.features.scalable'), sub: t('hero.features.builtToGrow'), color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Bot, label: t('hero.features.smartAgents'), sub: t('hero.features.automation'), color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: Globe, label: t('hero.features.global'), sub: t('hero.features.edgeCdn'), color: "text-teal-400", bg: "bg-teal-500/10" },
  ], [t]);

  const MARQUEE_ITEMS = useMemo(() => [
    { icon: Zap, label: t('hero.marquee.highPerformance') },
    { icon: BrainCircuit, label: t('hero.marquee.genAi') },
    { icon: Database, label: t('hero.marquee.aiMemory') },
    { icon: Smartphone, label: t('hero.marquee.mobileFirst') },
    { icon: ShieldCheck, label: t('hero.marquee.secure') },
    { icon: Globe, label: t('hero.marquee.globalCdn') },
    { icon: Bot, label: t('hero.marquee.autoAgents') },
    { icon: Code2, label: t('hero.marquee.cleanCode') },
    { icon: Sparkles, label: t('hero.marquee.naturalLang') },
    { icon: Search, label: t('hero.marquee.neuralSearch') }
  ], [t]);

  // Set up staggered intervals for "organic" feel
  useEffect(() => {
    // Interval 1: ~4.2s
    const timer1 = setInterval(() => {
      setTopLeftIndex((prev) => (prev + 1) % POOL_TOP_LEFT.length);
    }, 4200);

    // Interval 2: ~3.5s
    const timer2 = setInterval(() => {
      setTopRightIndex((prev) => (prev + 1) % POOL_TOP_RIGHT.length);
    }, 3500);

    // Interval 3: ~5.1s
    const timer3 = setInterval(() => {
      setBottomLeftIndex((prev) => (prev + 1) % POOL_BOTTOM_LEFT.length);
    }, 5100);

    // Interval 4: ~4.7s
    const timer4 = setInterval(() => {
      setBottomRightIndex((prev) => (prev + 1) % POOL_BOTTOM_RIGHT.length);
    }, 4700);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
      clearInterval(timer4);
    };
  }, [POOL_TOP_LEFT.length, POOL_TOP_RIGHT.length, POOL_BOTTOM_LEFT.length, POOL_BOTTOM_RIGHT.length]); // Dependencies added

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(5px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 1.05, filter: "blur(5px)", transition: { duration: 0.6 } }
  };

  // Split Marquee Items for 2 rows
  const marqueeHalf = Math.ceil(MARQUEE_ITEMS.length / 2);
  const marqueeRow1 = MARQUEE_ITEMS.slice(0, marqueeHalf);
  const marqueeRow2 = MARQUEE_ITEMS.slice(marqueeHalf);

  return (
    <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">

      {/* 1. Base Gradient Mesh */}
      <motion.div
        style={{ y: yBackground }}
        className="absolute top-0 right-0 w-[800px] h-[800px] opacity-20 pointer-events-none z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[10s]" />
      </motion.div>

      {/* 2. NEW: Orbital System Animation */}
      <OrbitalSystem />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content (Centered on Mobile, Left on Desktop) */}
          <motion.div
            style={{ opacity }}
            className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left flex flex-col items-center lg:items-start relative z-10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:shadow-[0_0_15px_rgba(99,102,241,0.2)]"
            >
              <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-100 uppercase tracking-wider">{t('hero.tagline')}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.2]"
            >
              <Trans
                i18nKey="hero.title"
                components={{
                  br: <br />,
                  span: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300" />
                }}
              />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl"
            >
              {t('hero.subtitle')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<ArrowRight size={18} />}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.startProject')}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {t('hero.viewWork')}
              </Button>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('hero.highlights.aiPowered')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('hero.highlights.fastDelivery')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Fully Dynamic Bento Grid (Hidden on Mobile) */}
          <div className="relative h-[500px] w-full hidden lg:block perspective-1000 z-10">
            {/* Abstract Ring */}
            <div className="absolute inset-0 border border-slate-800/50 rounded-full opacity-30 scale-125"></div>

            {/* DYNAMIC SLOT 1: Metrics (Top Left) */}
            <div className="absolute top-10 left-0 w-64 h-36 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={POOL_TOP_LEFT[topLeftIndex].label}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${POOL_TOP_LEFT[topLeftIndex].bg} ${POOL_TOP_LEFT[topLeftIndex].color}`}>
                      <React.Fragment>
                        {React.createElement(POOL_TOP_LEFT[topLeftIndex].icon, { size: 20, fill: "currentColor" })}
                      </React.Fragment>
                    </div>
                    <span className="text-2xl font-bold text-white">
                      {POOL_TOP_LEFT[topLeftIndex].value}
                      <span className="text-slate-500 text-sm">{POOL_TOP_LEFT[topLeftIndex].max}</span>
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.2, duration: 1 }}
                        className={`h-full ${POOL_TOP_LEFT[topLeftIndex].barColor}`}
                      />
                    </div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
                      {POOL_TOP_LEFT[topLeftIndex].label}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DYNAMIC SLOT 2: Tech (Top Right) */}
            <div className="absolute top-24 right-10 w-56 h-32 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={POOL_TOP_RIGHT[topRightIndex].label}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center gap-4"
                >
                  <div className={`p-2 rounded-lg ${POOL_TOP_RIGHT[topRightIndex].bg} ${POOL_TOP_RIGHT[topRightIndex].color}`}>
                    <React.Fragment>
                      {React.createElement(POOL_TOP_RIGHT[topRightIndex].icon, { size: 22 })}
                    </React.Fragment>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="block text-white font-bold text-lg leading-tight">{POOL_TOP_RIGHT[topRightIndex].label}</span>
                    {/* Only show subtext if it exists */}
                    {POOL_TOP_RIGHT[topRightIndex].sub && (
                      <span className="text-xs text-slate-400">{POOL_TOP_RIGHT[topRightIndex].sub}</span>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DYNAMIC SLOT 3: Process (Bottom Left) */}
            <div className="absolute bottom-24 left-12 w-64 h-24 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={POOL_BOTTOM_LEFT[bottomLeftIndex].label}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4"
                >
                  <div className={`p-2 rounded-lg ${POOL_BOTTOM_LEFT[bottomLeftIndex].bg} ${POOL_BOTTOM_LEFT[bottomLeftIndex].color}`}>
                    <React.Fragment>
                      {React.createElement(POOL_BOTTOM_LEFT[bottomLeftIndex].icon, { size: 20 })}
                    </React.Fragment>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{POOL_BOTTOM_LEFT[bottomLeftIndex].label}</div>
                    <div className="text-xs text-slate-500">{POOL_BOTTOM_LEFT[bottomLeftIndex].sub}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DYNAMIC SLOT 4: Growth (Bottom Right) */}
            <div className="absolute bottom-10 right-0 w-60 h-24 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={POOL_BOTTOM_RIGHT[bottomRightIndex].label}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center gap-4"
                  whileHover={{ x: -5 }}
                >
                  <div className={`p-3 rounded-full ${POOL_BOTTOM_RIGHT[bottomRightIndex].bg} ${POOL_BOTTOM_RIGHT[bottomRightIndex].color}`}>
                    <React.Fragment>
                      {React.createElement(POOL_BOTTOM_RIGHT[bottomRightIndex].icon, { size: 24 })}
                    </React.Fragment>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{POOL_BOTTOM_RIGHT[bottomRightIndex].label}</div>
                    <div className="text-xs text-slate-500">{POOL_BOTTOM_RIGHT[bottomRightIndex].sub}</div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* MOBILE ONLY: 2-Row Infinite Marquee Scroll */}
        <div className="mt-16 lg:hidden relative w-screen -ml-6 overflow-hidden z-10 flex flex-col gap-3">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none"></div>

          {/* Row 1: Right to Left */}
          <div className="flex w-[200%]">
            <motion.div
              className="flex gap-3 pr-4"
              animate={{ x: "-50%" }}
              transition={{ duration: 25, ease: "linear", repeat: Infinity }}
            >
              {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((item, idx) => (
                <div key={`row1-${idx}`} className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl whitespace-nowrap backdrop-blur-sm shadow-sm dark:shadow-none">
                  <item.icon size={16} className="text-indigo-400" />
                  <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2: Left to Right */}
          <div className="flex w-[200%]">
            <motion.div
              className="flex gap-3 pr-4"
              initial={{ x: "-50%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            >
              {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((item, idx) => (
                <div key={`row2-${idx}`} className="flex items-center gap-2 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-xl whitespace-nowrap backdrop-blur-sm shadow-sm dark:shadow-none">
                  <item.icon size={16} className="text-purple-400" />
                  <span className="text-slate-300 text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>



      </div>

      {/* Animated Scroll Down Arrow - Fixed to bottom of hero section */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 inset-x-0 flex justify-center cursor-pointer z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 dark:text-slate-500 uppercase tracking-widest font-medium">Keşfet</span>
          <div className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center backdrop-blur-sm bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30 transition-all">
            <ChevronDown size={20} className="text-slate-500 dark:text-white/70" />
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;