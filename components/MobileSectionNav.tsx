import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface Section {
    id: string;
    labelKey: string;
}

const sections: Section[] = [
    { id: 'why-agens', labelKey: 'nav.whyAgens' },
    { id: 'services', labelKey: 'nav.expertise' },
    { id: 'process', labelKey: 'nav.process' },
    { id: 'work', labelKey: 'nav.work' },
    { id: 'team', labelKey: 'nav.team' },
    { id: 'contact', labelKey: 'nav.contact' },
];

// Fallback labels if translation not found
const fallbackLabels: Record<string, string> = {
    'why-agens': 'Neden Agens',
    'services': 'Yeteneklerimiz',
    'process': 'Süreç',
    'work': 'Projeler',
    'team': 'Hakkımızda',
    'contact': 'İletişim',
};

const MobileSectionNav: React.FC = () => {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<string>('why-agens');
    const [isSticky, setIsSticky] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Get label for section
    const getLabel = (section: Section) => {
        const translated = t(section.labelKey, { defaultValue: '' });
        return translated || fallbackLabels[section.id] || section.id;
    };

    // Scroll active tab into view
    useEffect(() => {
        const activeTab = tabRefs.current.get(activeSection);
        if (activeTab && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const tabLeft = activeTab.offsetLeft;
            const tabWidth = activeTab.offsetWidth;
            const containerWidth = container.offsetWidth;
            const scrollLeft = container.scrollLeft;

            // Center the active tab
            const targetScroll = tabLeft - (containerWidth / 2) + (tabWidth / 2);
            container.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    }, [activeSection]);

    // Intersection Observer for active section detection
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0,
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, []);

    // Sticky detection
    useEffect(() => {
        const handleScroll = () => {
            if (navRef.current) {
                const rect = navRef.current.getBoundingClientRect();
                setIsSticky(rect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle tab click
    const handleClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 104; // Height of navbar (56px) + section nav bar (~48px)
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div
            ref={navRef}
            className="md:hidden sticky top-14 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800"
        >
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <div className="flex px-4 py-3 gap-1 min-w-max">
                    {sections.map((section, index) => {
                        const isActive = activeSection === section.id;
                        return (
                            <button
                                key={section.id}
                                ref={(el) => {
                                    if (el) tabRefs.current.set(section.id, el);
                                }}
                                onClick={() => handleClick(section.id)}
                                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all duration-200
                  ${isActive
                                        ? 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }
                `}
                            >
                                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                                <span>{getLabel(section)}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileSectionNav;
