import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Logo data
const TECHNOLOGIES = [
    { name: 'React', color: '#61DAFB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', color: '#000000', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', invertDark: true },
    { name: 'React Native', color: '#61DAFB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Vue.js', color: '#4FC08D', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'TypeScript', color: '#3178C6', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'Tailwind', color: '#06B6D4', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Node.js', color: '#339933', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Docker', color: '#2496ED', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', color: '#326CE5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'AWS', color: '#FF9900', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', darkIcon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg' },
    { name: 'Python', color: '#3776AB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Supabase', color: '#3ECF8E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
    { name: 'Flutter', color: '#02569B', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'PostgreSQL', color: '#4169E1', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'Figma', color: '#F24E1E', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
];

const TechStack: React.FC = () => {
    const { t } = useTranslation();
    const prefersReducedMotion = useReducedMotion();
    const loopedTechnologies = prefersReducedMotion ? TECHNOLOGIES : [...TECHNOLOGIES, ...TECHNOLOGIES];

    return (
        <section id="tech-stack" className="cv-auto py-12 bg-slate-50 dark:bg-[#020617]/50 overflow-hidden scroll-mt-20">
            <div className="container mx-auto px-6 mb-12 text-center">
                <p className="text-sm font-semibold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                    {t('techStack.title', 'Technologies We Master')}
                </p>
            </div>

            <div className="flex relative overflow-hidden">
                {/* Gradient Masks */}
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-slate-50 dark:from-[#020617] to-transparent"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-slate-50 dark:from-[#020617] to-transparent"></div>

                {/* Marquee Container - Seamless infinite loop */}
                <div className="flex overflow-hidden">
                    <motion.div
                        className="flex shrink-0 gap-4 md:gap-10 items-center"
                        animate={prefersReducedMotion ? { x: 0 } : { x: "-50%" }}
                        transition={prefersReducedMotion ? undefined : {
                            duration: 100,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    >
                        {/* Double the list for seamless loop */}
                        {loopedTechnologies.map((tech, index) => (
                            <div
                                key={`${tech.name}-${index}`}
                                className="flex flex-col md:flex-row items-center justify-center min-w-[80px] sm:min-w-[90px] md:min-w-[140px] grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100 cursor-default group"
                                title={tech.name}
                            >
                                {tech.darkIcon ? (
                                    <>
                                        <img
                                            src={tech.icon}
                                            alt={tech.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-6 w-6 md:h-10 md:w-10 object-contain dark:hidden group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <img
                                            src={tech.darkIcon}
                                            alt={tech.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="h-6 w-6 md:h-10 md:w-10 object-contain hidden dark:block group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </>
                                ) : (
                                    <img
                                        src={tech.icon}
                                        alt={tech.name}
                                        loading="lazy"
                                        decoding="async"
                                        className={`h-6 w-6 md:h-10 md:w-10 object-contain group-hover:scale-110 transition-transform duration-300 ${tech.invertDark ? 'dark:invert dark:brightness-200' : ''}`}
                                    />
                                )}
                                {/* Always visible text, colored on hover */}
                                <span className="mt-1 md:mt-0 md:ml-3 text-[10px] sm:text-xs md:text-sm font-semibold text-slate-700 dark:text-slate-300 text-center md:text-left leading-tight block opacity-100 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TechStack;
