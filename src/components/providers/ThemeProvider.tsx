'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, isDark, setTheme, setSystemTheme } = useThemeStore();

  // Detect system theme preference and watch for changes
  useEffect(() => {
    // Check initial system preference
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(isDarkMode);

    // Set up listener for theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setSystemTheme]);

  // Apply theme class to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const contextValue: ThemeContextType = {
    theme,
    isDark,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
