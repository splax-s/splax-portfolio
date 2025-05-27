'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useOsStore } from '@/store/useOsStore';
import { usePreferences } from './PreferenceProvider';

interface SoundContextType {
  playSound: (soundName: SoundName) => void;
}

type SoundName = 
  | 'windowOpen' 
  | 'windowClose' 
  | 'click' 
  | 'notification' 
  | 'error' 
  | 'success' 
  | 'typing';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { soundEnabled } = usePreferences();
  const { osType } = useOsStore();
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  
  // Preload sounds based on OS
  useEffect(() => {
    if (!soundEnabled) return;
    
    const baseUrl = '/sounds';
    const osSounds: Record<string, string> = {
      windowOpen: `${baseUrl}/${osType}/window-open.mp3`,
      windowClose: `${baseUrl}/${osType}/window-close.mp3`,
      click: `${baseUrl}/${osType}/click.mp3`,
      notification: `${baseUrl}/${osType}/notification.mp3`,
      error: `${baseUrl}/${osType}/error.mp3`,
      success: `${baseUrl}/${osType}/success.mp3`,
      typing: `${baseUrl}/${osType}/typing.mp3`,
    };
    
    // Preload all sounds
    Object.entries(osSounds).forEach(([name, url]) => {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audioCache.current[name] = audio;
      } catch (e) {
        console.error(`Failed to preload sound: ${name}`, e);
      }
    });
    
    return () => {
      // Cleanup
      Object.values(audioCache.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      audioCache.current = {};
    };
  }, [osType, soundEnabled]);
  
  const playSound = (soundName: SoundName) => {
    if (!soundEnabled) return;
    
    const audio = audioCache.current[soundName];
    if (audio) {
      // Reset and play
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.error(`Failed to play sound: ${soundName}`, e);
      });
    }
  };
  
  return (
    <SoundContext.Provider value={{ playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
