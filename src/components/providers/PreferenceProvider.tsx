'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { usePreferenceStore } from '@/store/usePreferenceStore';
import { OsType, useOsStore } from '@/store/useOsStore';
import { detectOS } from '@/lib/os/detectOS';

interface PreferenceContextType {
  preferredOs: OsType | 'auto';
  motionReduced: boolean;
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  setPreferredOs: (os: OsType | 'auto') => void;
  setMotionReduced: (reduced: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferenceContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferenceProvider');
  }
  return context;
};

export const PreferenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    preferredOs,
    motionReduced,
    soundEnabled,
    fontSize,
    setPreferredOs,
    setMotionReduced,
    setSoundEnabled,
    setFontSize,
  } = usePreferenceStore();
  
  const { setOsType } = useOsStore();

  // Apply preferred OS or detect system OS
  useEffect(() => {
    if (preferredOs === 'auto') {
      const detectedOs = detectOS();
      setOsType(detectedOs);
    } else {
      setOsType(preferredOs);
    }
  }, [preferredOs, setOsType]);

  // Apply reduced motion setting
  useEffect(() => {
    if (motionReduced) {
      document.documentElement.classList.add('motion-reduce');
    } else {
      document.documentElement.classList.remove('motion-reduce');
    }
  }, [motionReduced]);

  // Apply font size setting
  useEffect(() => {
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  // Check system preference for reduced motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setMotionReduced(true);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setMotionReduced(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setMotionReduced]);

  const contextValue: PreferenceContextType = {
    preferredOs,
    motionReduced,
    soundEnabled,
    fontSize,
    setPreferredOs,
    setMotionReduced,
    setSoundEnabled,
    setFontSize,
  };

  return (
    <PreferenceContext.Provider value={contextValue}>
      {children}
    </PreferenceContext.Provider>
  );
};
