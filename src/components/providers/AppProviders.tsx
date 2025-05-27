'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { PreferenceProvider } from './PreferenceProvider';
import { KeyboardShortcutsProvider } from './KeyboardShortcutsProvider';
import { SoundProvider } from './SoundProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <PreferenceProvider>
        <KeyboardShortcutsProvider>
          <SoundProvider>
            {children}
          </SoundProvider>
        </KeyboardShortcutsProvider>
      </PreferenceProvider>
    </ThemeProvider>
  );
};
