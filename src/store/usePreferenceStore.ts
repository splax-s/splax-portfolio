import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OsType } from '@/store/useOsStore';

interface PreferenceState {
  preferredOs: OsType | 'auto';
  motionReduced: boolean;
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  setPreferredOs: (os: OsType | 'auto') => void;
  setMotionReduced: (reduced: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      preferredOs: 'auto',
      motionReduced: false,
      soundEnabled: true,
      fontSize: 'medium',
      
      setPreferredOs: (os) => set({ preferredOs: os }),
      setMotionReduced: (reduced) => set({ motionReduced: reduced }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setFontSize: (size) => set({ fontSize: size }),
    }),
    {
      name: 'portfolio-preferences',
    }
  )
);
