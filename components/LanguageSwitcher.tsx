import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const isEnglishRoute = location.pathname.startsWith('/en');

    const toggleLanguage = () => {
        const newLang = isEnglishRoute ? 'tr' : 'en';
        const nextPath = isEnglishRoute
            ? location.pathname.replace(/^\/en(\/|$)/, '/')
            : `/en${location.pathname === '/' ? '' : location.pathname}`;

        i18n.changeLanguage(newLang);
        navigate(`${nextPath}${location.hash}`);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 transition-colors border border-white/30 dark:border-white/10 text-sm text-white dark:text-gray-300"
            aria-label="Toggle language"
        >
            <Globe className="w-4 h-4" />
            <span>{isEnglishRoute ? 'EN' : 'TR'}</span>
        </button>
    );
};

export default LanguageSwitcher;
