import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DemoHeaderProps {
    title: string;
}

const DemoHeader: React.FC<DemoHeaderProps> = ({ title }) => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLanguageSwitch = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
        // Navigate to new language path
        const currentPath = location.pathname;
        if (newLang === 'en') {
            // Add /en prefix
            const newPath = currentPath.startsWith('/en') ? currentPath : `/en${currentPath}`;
            navigate(newPath);
        } else {
            // Remove /en prefix
            const newPath = currentPath.replace(/^\/en/, '') || '/';
            navigate(newPath);
        }
    };

    return (
        <header className="border-b border-slate-100 pt-2">
            <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                    <img src="/A.svg" alt="Agens" className="h-7 w-7 invert" />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-medium">Agens</span>
                        <span className="text-sm font-semibold text-slate-700 tracking-tight">{title}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://agens.studio/#contact"
                        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
                    >
                        {i18n.language === 'en' ? 'Schedule a Call' : 'Görüşme Planla'}
                    </a>
                    <button
                        onClick={handleLanguageSwitch}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                        type="button"
                    >
                        {i18n.language === 'tr' ? 'EN' : 'TR'}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DemoHeader;
