import React, { useState, useEffect } from 'react';
import Button from './Button';
import { ArrowRight, Zap, BrainCircuit, Layers, TrendingUp, CheckCircle2, ShieldCheck, Cloud, Code2, Smartphone, Palette, Globe, Rocket, Search, Server, Database, Bot, Sparkles, MessageSquare, ChevronDown, Workflow, Plug, MessageSquareText, CreditCard, FileText } from 'lucide-react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

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
  const { t, i18n } = useTranslation();
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const isMotionLite = prefersReducedMotion || isMobile;
  const heroEntryDuration = isMotionLite ? 0.5 : 0.8;
  const heroEntryDelay = isMotionLite ? 0 : 0.2;
  const bgTransition = isMotionLite
    ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], opacity: { duration: 0.9 }, scale: { duration: 1.6 } }
    : { duration: 1.8, ease: [0.22, 1, 0.36, 1], opacity: { duration: 1.2 }, scale: { duration: 2.2 } };

  // State for background image loading animation
  const [bgLoaded, setBgLoaded] = useState(false);

  // Independent state for each card to allow random-ordered updates
  const [topLeftIndex, setTopLeftIndex] = useState(0);
  const [topRightIndex, setTopRightIndex] = useState(0);
  const [bottomLeftIndex, setBottomLeftIndex] = useState(0);
  const [bottomRightIndex, setBottomRightIndex] = useState(0);

  const yBackground = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const handleChange = () => setIsMobile(media.matches);
    handleChange();
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  // Fallback for mobile - trigger animation after short delay if onLoad doesn't fire
  useEffect(() => {
    const delay = isMotionLite ? 150 : 300;
    const timer = setTimeout(() => {
      if (!bgLoaded) {
        setBgLoaded(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [bgLoaded, isMotionLite]);

  // Memoize pools to react to language changes
  const POOL_TOP_LEFT = useMemo(() => [
    { icon: Zap, value: "100", max: "/100", label: t('hero.stats.lighthouse'), color: "text-green-400", barColor: "bg-green-500", bg: "bg-green-500/10" },
    { icon: Search, value: "100", max: "%", label: t('hero.stats.seo'), color: "text-blue-400", barColor: "bg-blue-500", bg: "bg-blue-500/10" },
    { icon: CheckCircle2, value: "A+", max: "", label: t('hero.stats.quality'), color: "text-indigo-400", barColor: "bg-indigo-500", bg: "bg-indigo-500/10" },
  ], [i18n.language, t]);

  const POOL_TOP_RIGHT = useMemo(() => [
    { icon: Sparkles, label: t('hero.features.smartContext'), sub: t('hero.features.dataGrounding'), color: "text-indigo-400", bg: "bg-indigo-500/20" },
    { icon: BrainCircuit, label: t('hero.features.llmIntegration'), sub: "", color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: Database, label: t('hero.features.aiMemory'), sub: t('hero.features.semanticSearch'), color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { icon: ShieldCheck, label: t('hero.features.enterpriseAi'), sub: t('hero.features.securePrivate'), color: "text-sky-400", bg: "bg-sky-500/20" },
  ], [i18n.language, t]);

  const POOL_BOTTOM_LEFT = useMemo(() => [
    { icon: Layers, label: t('hero.features.strategy'), sub: t('hero.features.productFirst'), color: "text-purple-400", bg: "bg-purple-500/20" },
    { icon: Palette, label: t('hero.features.uiUx'), sub: t('hero.features.pixelPerfect'), color: "text-pink-400", bg: "bg-pink-500/20" },
    { icon: MessageSquare, label: t('hero.features.promptEng'), sub: t('hero.features.fineTuning'), color: "text-amber-400", bg: "bg-amber-500/20" },
  ], [i18n.language, t]);

  const POOL_BOTTOM_RIGHT = useMemo(() => [
    { icon: TrendingUp, label: t('hero.features.scalable'), sub: t('hero.features.builtToGrow'), color: "text-blue-400", bg: "bg-blue-500/10" },
    { icon: Bot, label: t('hero.features.smartAgents'), sub: t('hero.features.automation'), color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { icon: Globe, label: t('hero.features.global'), sub: t('hero.features.edgeCdn'), color: "text-teal-400", bg: "bg-teal-500/10" },
  ], [i18n.language, t]);

  const MARQUEE_ITEMS = useMemo(() => [
    { icon: Smartphone, label: t('hero.marqueeItems.mobileApps') },
    { icon: Globe, label: t('hero.marqueeItems.webPlatforms') },
    { icon: Workflow, label: t('hero.marqueeItems.workflowAutomation') },
    { icon: Plug, label: t('hero.marqueeItems.apiFirst') },
    { icon: Sparkles, label: t('hero.marqueeItems.aiFlows') },
    { icon: MessageSquareText, label: t('hero.marqueeItems.nlp') },
    { icon: Search, label: t('hero.marqueeItems.semanticSearch') },
    { icon: Zap, label: t('hero.marqueeItems.smartAutomation') },
    { icon: Layers, label: t('hero.marqueeItems.scalableInfra') },
    { icon: CreditCard, label: t('hero.marqueeItems.payments') },
    { icon: FileText, label: t('hero.marqueeItems.eInvoice') },
    { icon: ShieldCheck, label: t('hero.marqueeItems.secureSystems') }
  ], [i18n.language, t]);

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

      {/* Background Image with Gradient Fade - Animated Reveal */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={bgLoaded ? { opacity: 1, scale: 1 } : {}}
        transition={bgTransition}
      >
        <picture>
          <source media="(max-width: 768px)" srcSet="/herobg-mobile.webp" />
          <img
            src="/herobg.webp"
            alt="Hero Background"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover object-center"
            onLoad={() => setBgLoaded(true)}
          />
        </picture>
        {/* Bottom gradient fade for smooth transition - Lighter/More balanced */}
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#030712] via-transparent to-transparent opacity-90 dark:opacity-70"></div>
        {/* Overall subtle overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/5"></div>

        {/* Strong Bottom Gradient for Section Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-48 bg-gradient-to-t from-slate-50 dark:from-[#020617] to-transparent z-10 pointer-events-none"></div>
      </motion.div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Centered Content - Intercom Style */}
        <motion.div
          style={{ opacity }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: heroEntryDuration, delay: heroEntryDelay }}
            className="text-5xl md:text-8xl font-normal tracking-tight text-white mb-8 leading-[1.15] font-serif"
          >
            <Trans
              i18nKey="hero.title"
              components={{
                br: <br />,
                span: <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: heroEntryDuration, delay: isMotionLite ? 0.1 : 0.4 }}
            className="text-base md:text-lg text-white/70 mb-12 leading-relaxed max-w-xl"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMotionLite ? 0.35 : 0.5, delay: isMotionLite ? 0.15 : 0.6 }}
            className="flex flex-row items-center justify-center gap-3"
          >
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-white text-slate-900 text-sm md:text-base font-medium rounded-full hover:bg-white/90 transition-all shadow-lg"
            >
              {t('hero.startProject')}
            </button>
            <button
              onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 md:px-6 md:py-3 bg-transparent text-white text-sm md:text-base font-medium rounded-full border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
            >
              {t('hero.viewWork')}
            </button>
          </motion.div>

          {/* Highlights - Intercom Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMotionLite ? 0.35 : 0.5, delay: isMotionLite ? 0.2 : 0.8 }}
            className="hidden md:flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 mt-12 text-center"
          >
            <span className="text-white/80 font-mono uppercase text-[0.75rem] md:text-[0.875rem] tracking-[0.063rem] md:tracking-[0.094rem] leading-tight">
              {t('hero.highlights.aiPowered')}
            </span>
            <span className="text-white/80 font-mono uppercase text-[0.75rem] md:text-[0.875rem] tracking-[0.063rem] md:tracking-[0.094rem] leading-tight">
              {t('hero.highlights.fastDelivery')}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* MOBILE ONLY: Architect-style 2-Row Marquee */}
      <div className="mt-16 lg:hidden flex justify-center z-10">
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">{t('hero.marqueeTitle')}</span>
      </div>

      <div
        className="mt-2 lg:hidden relative w-full overflow-hidden z-10 flex flex-col gap-1"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        {/* Row 1: Left to Right */}
        <div className="flex overflow-hidden p-1">
          <motion.div
            className="flex shrink-0 gap-2"
            animate={prefersReducedMotion ? { x: 0 } : { x: "-50%" }}
            transition={prefersReducedMotion ? undefined : { duration: 50, ease: "linear", repeat: Infinity }}
          >
            {(prefersReducedMotion ? marqueeRow1 : [...marqueeRow1, ...marqueeRow1]).map((item, idx) => (
              <div
                key={`row1-${idx}`}
                className="flex items-center gap-2 rounded-full py-2 px-4 border border-white/20 bg-white/5 backdrop-blur-sm whitespace-nowrap"
              >
                <item.icon size={14} className="text-white/60" />
                <span className="text-xs text-white/70">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Right to Left (reverse) */}
        <div className="flex overflow-hidden p-1">
          <motion.div
            className="flex shrink-0 gap-2"
            initial={prefersReducedMotion ? { x: 0 } : { x: "-50%" }}
            animate={prefersReducedMotion ? { x: 0 } : { x: "0%" }}
            transition={prefersReducedMotion ? undefined : { duration: 55, ease: "linear", repeat: Infinity }}
          >
            {(prefersReducedMotion ? marqueeRow2 : [...marqueeRow2, ...marqueeRow2]).map((item, idx) => (
              <div
                key={`row2-${idx}`}
                className="flex items-center gap-2 rounded-full py-2 px-4 border border-white/20 bg-white/5 backdrop-blur-sm whitespace-nowrap"
              >
                <item.icon size={14} className="text-white/60" />
                <span className="text-xs text-white/70">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Down Arrow - Fixed to bottom of hero section */}
      <motion.div
        className="hidden md:flex absolute bottom-8 inset-x-0 justify-center cursor-pointer z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => document.getElementById('tech-stack')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-slate-600 dark:text-slate-500 uppercase tracking-widest font-medium">{t('hero.discover')}</span>
          <div className="w-10 h-10 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center backdrop-blur-sm bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/30 transition-all">
            <ChevronDown size={20} className="text-slate-500 dark:text-white/70" />
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};

export default Hero;
