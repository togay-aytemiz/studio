import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { Palette, Terminal, Target, ArrowRight, CheckCircle2, Users, BrainCircuit } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

const UserCentricOrbit = () => {
   return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-0 opacity-[0.15] select-none">
         <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
               <linearGradient id="user-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
               </linearGradient>
            </defs>

            {/* Central User Silhouette (Abstract) */}
            <g transform="translate(400, 400)" opacity="0.8">
               {/* Head */}
               <circle cx="0" cy="-60" r="35" fill="none" stroke="url(#user-glow)" strokeWidth="2" />
               <circle cx="0" cy="-60" r="15" fill="#6366f1" opacity="0.5" />

               {/* Shoulders / Body (Arc) */}
               <path d="M -70 40 Q 0 -50 70 40" fill="none" stroke="url(#user-glow)" strokeWidth="2" strokeLinecap="round" />

               {/* Base connection */}
               <path d="M -70 40 L -70 100" fill="none" stroke="url(#user-glow)" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
               <path d="M 70 40 L 70 100" fill="none" stroke="url(#user-glow)" strokeWidth="1" opacity="0.3" strokeDasharray="4 4" />
            </g>

            {/* Orbits representing Disciplines revolving around the User */}

            {/* Orbit 1: Engineering (Horizontal Ellipse) */}
            <ellipse cx="400" cy="400" rx="250" ry="80" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.3" transform="rotate(-15 400 400)" />
            <path id="orbit1" d="M 155,380 A 250,80 -15 1,1 645,420 A 250,80 -15 1,1 155,380" fill="none" />
            <circle r="5" fill="#60a5fa">
               <animateMotion dur="14s" repeatCount="indefinite">
                  <mpath href="#orbit1" />
               </animateMotion>
            </circle>


            {/* Orbit 2: Design (Vertical/Diagonal Ellipse) */}
            <ellipse cx="400" cy="400" rx="220" ry="80" fill="none" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.3" transform="rotate(45 400 400)" />
            <path id="orbit2" d="M 245,245 A 220,80 45 1,1 555,555 A 220,80 45 1,1 245,245" fill="none" stroke="none" />
            <circle r="5" fill="#c084fc">
               <animateMotion dur="18s" repeatCount="indefinite">
                  <mpath href="#orbit2" />
               </animateMotion>
            </circle>

            {/* Orbit 3: Strategy (Circular/Wide) */}
            <circle cx="400" cy="400" r="180" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 4" />
            <circle r="4" fill="#34d399">
               <animateMotion dur="25s" repeatCount="indefinite" path="M 400,220 A 180,180 0 1,1 400,580 A 180,180 0 1,1 400,220" />
            </circle>

            {/* Connection Lines (Pulsing) */}
            <line x1="400" y1="340" x2="400" y2="220" stroke="white" strokeOpacity="0.1" strokeDasharray="2 4">
               <animate attributeName="stroke-opacity" values="0.1;0.5;0.1" dur="3s" repeatCount="indefinite" />
            </line>

         </svg>
      </div>
   );
};

const Team: React.FC = () => {
   const { t } = useTranslation();

   const DISCIPLINES = useMemo(() => [
      {
         id: "dev",
         title: t('team.disciplines.dev.title'),
         role: t('team.disciplines.dev.role'),
         desc: t('team.disciplines.dev.desc'),
         icon: Terminal,
         color: "text-blue-400",
         bg: "bg-blue-500/10",
         border: "border-blue-500/20"
      },
      {
         id: "des",
         title: t('team.disciplines.des.title'),
         role: t('team.disciplines.des.role'),
         desc: t('team.disciplines.des.desc'),
         icon: Palette,
         color: "text-purple-400",
         bg: "bg-purple-500/10",
         border: "border-purple-500/20"
      },
      {
         id: "prod",
         title: t('team.disciplines.prod.title'),
         role: t('team.disciplines.prod.role'),
         desc: t('team.disciplines.prod.desc'),
         icon: BrainCircuit,
         color: "text-emerald-400",
         bg: "bg-emerald-500/10",
         border: "border-emerald-500/20"
      }
   ], [t]);

   return (
      <section id="team" className="cv-auto py-12 md:py-40 bg-white dark:bg-[#030712] relative overflow-hidden">

         {/* New Background Animation */}
         <UserCentricOrbit />

         <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal width="100%">
               <div className="flex flex-col lg:flex-row gap-16 items-center">

                  {/* Left: Text Content - Studio & Expertise Focused */}
                  <div className="lg:w-1/2">
                     <div className="flex items-center gap-3 mb-6">
                        <div className="w-2.5 h-2.5 bg-indigo-500 rounded-sm"></div>
                        <span className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">{t('team.studio.badge')}</span>
                     </div>
                     <div className="w-full h-px bg-slate-200 dark:bg-white/10 mb-8"></div>

                     <h2 className="text-4xl md:text-5xl font-medium text-slate-900 dark:text-white mb-6 leading-[1.1] font-serif">
                        <Trans i18nKey="team.studio.title" components={{ br: <br />, span: <span className="text-indigo-600 dark:text-indigo-400" /> }} />
                     </h2>

                     <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        {t('team.studio.p1')}
                     </p>

                     <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        {t('team.studio.p2')}
                     </p>

                     <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 text-slate-300">
                           <CheckCircle2 size={18} className="text-indigo-500" />
                           <span className="text-sm md:text-lg">{t('team.studio.checklist.inHouse')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                           <CheckCircle2 size={18} className="text-indigo-500" />
                           <span className="font-medium text-white text-sm md:text-lg">{t('team.studio.checklist.aiExpertise')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                           <CheckCircle2 size={18} className="text-indigo-500" />
                           <span className="text-sm md:text-lg">{t('team.studio.checklist.partnership')}</span>
                        </div>
                     </div>
                  </div>

                  {/* Right: Visual (Squad Composition) */}
                  <div className="lg:w-1/2 w-full">
                     <div className="relative">
                        {/* Decorative backdrop */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl transform rotate-3 scale-105 border border-slate-200 dark:border-white/5"></div>

                        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 relative shadow-xl dark:shadow-2xl">
                           <div className="mb-6 flex justify-between items-center border-b border-slate-200 dark:border-white/5 pb-4">
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{t('team.squad.badge')}</span>
                              <div className="flex -space-x-2">
                                 {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-5 h-5 rounded-full bg-gradient-to-br ${i === 1 ? 'from-blue-500 to-blue-600' : i === 2 ? 'from-purple-500 to-purple-600' : 'from-emerald-500 to-emerald-600'} border-2 border-white dark:border-slate-900 shadow-sm transition-transform hover:scale-110`}></div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-4">
                              {DISCIPLINES.map((item, index) => (
                                 <motion.div
                                    key={item.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-slate-200 dark:border-transparent ${item.border} bg-slate-50 dark:bg-transparent ${item.bg} md:hover:bg-slate-100 md:dark:hover:bg-slate-800 transition-colors`}
                                 >
                                    <div className={`p-2 md:p-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 ${item.color}`}>
                                       <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                       <h4 className="text-sm md:text-lg text-slate-900 dark:text-white font-bold mb-0.5">{item.title}</h4>
                                       <div className="flex flex-col gap-1">
                                          <span className="text-xs md:text-sm font-semibold text-slate-700 dark:text-indigo-300">{item.role}</span>
                                          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                                             {item.desc}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                       <ArrowRight size={18} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                 </motion.div>
                              ))}
                           </div>


                        </div>
                     </div>
                  </div>

               </div>
            </ScrollReveal>
         </div>
      </section>
   );
};

export default Team;
