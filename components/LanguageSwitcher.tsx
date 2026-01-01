import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'tr' ? 'en' : 'tr';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 transition-colors border border-white/30 dark:border-white/10 text-sm text-white dark:text-gray-300"
            aria-label="Toggle language"
        >
            <Globe className="w-4 h-4" />
            <span>{i18n.language === 'tr' ? 'TR' : 'EN'}</span>
        </button>
    );
};

export default LanguageSwitcher;
