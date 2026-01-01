import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else if (savedTheme === 'dark' || prefersDark) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-white/10 dark:bg-slate-800/50 border border-black/10 dark:border-white/10 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-colors"
            whileTap={{ scale: 0.95 }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <motion.div
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {isDark ? (
                    <Moon size={18} className="text-slate-300" />
                ) : (
                    <Sun size={18} className="text-amber-500" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default ThemeToggle;
