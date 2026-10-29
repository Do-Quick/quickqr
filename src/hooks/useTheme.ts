import { useState, useEffect } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    return (localStorage.getItem('quickqr_theme') as ThemePreference) || 'system';
  });

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (theme === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = theme === 'dark';
      }

      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();
    localStorage.setItem('quickqr_theme', theme);

    // If on system, listen to OS-level dark/light mode toggles
    const listener = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  return { theme, setTheme };
}
