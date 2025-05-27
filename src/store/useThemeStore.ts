import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  isSystemDark: boolean;
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSystemTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isSystemDark: false,
      get isDark() {
        return get().theme === 'dark' || (get().theme === 'system' && get().isSystemDark);
      },
      setTheme: (theme) => set({ theme }),
      setSystemTheme: (isDark) => set({ isSystemDark: isDark }),
    }),
    {
      name: 'portfolio-theme', // local storage key
    }
  )
);
