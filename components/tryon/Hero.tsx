import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export const Hero: React.FC = () => {
    const { t } = useTranslation();

    const scrollToProducts = () => {
        const el = document.getElementById('products-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 md:pt-8">
            <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[600px] rounded-[2rem] overflow-hidden bg-emerald-900 group shadow-2xl">

                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/tryon/hero.webp"
                        alt="Fashion Model"
                        className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Gradient Overlay for text readability - stronger bottom gradient for mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-black/60 md:via-black/20 md:to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-between md:justify-center h-full px-6 py-8 md:px-16 md:py-0 max-w-2xl">
                    {/* Top Content Group */}
                    <div className="pt-4 md:pt-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-50 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm w-fit">
                            <Sparkles size={14} className="text-emerald-200" />
                            {t('tryon.hero.badge')}
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1] drop-shadow-xl">
                            <Trans i18nKey="tryon.hero.headline" />
                        </h1>

                        {/* Subtext */}
                        <p className="text-lg md:text-xl text-emerald-50 md:mb-8 font-medium leading-relaxed drop-shadow-md">
                            {t('tryon.hero.subtext')}
                        </p>
                    </div>

                    {/* Buttons: Bottom aligned on mobile, normal flow on desktop */}
                    <div className="flex flex-row gap-3 w-full md:w-auto mt-auto md:mt-0">
                        <button
                            onClick={scrollToProducts}
                            className="flex-1 md:flex-none h-12 md:h-14 px-6 bg-white text-emerald-950 hover:bg-emerald-50 rounded-full font-bold text-sm md:text-base transition-all hover:-translate-y-0.5 shadow-lg shadow-black/20 whitespace-nowrap"
                        >
                            {t('tryon.hero.tryNow')}
                        </button>

                        <button
                            onClick={() => {
                                // Future: Open How It Works modal
                            }}
                            className="flex-1 md:flex-none h-12 md:h-14 px-6 bg-black/20 hover:bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-full font-bold text-sm md:text-base transition-all whitespace-nowrap"
                        >
                            {t('tryon.hero.howItWorks')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
