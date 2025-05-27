'use client';

import React, { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { usePreferences } from '@/components/providers/PreferenceProvider';
import { useOsStore } from '@/store/useOsStore';
import { useKeyboardShortcuts } from '@/components/providers/KeyboardShortcutsProvider';

const SettingsApp: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { 
    preferredOs, 
    motionReduced, 
    soundEnabled, 
    fontSize,
    setPreferredOs,
    setMotionReduced,
    setSoundEnabled,
    setFontSize
  } = usePreferences();
  const { osType } = useOsStore();
  const { getActiveShortcuts } = useKeyboardShortcuts();
  
  const shortcuts = getActiveShortcuts();
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark' | null>(null);
  
  // Monitor system theme changes
  React.useEffect(() => {
    // Check if system preference is dark mode
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setActiveTheme(isDark ? 'dark' : 'light');
    
    // Listen for changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setActiveTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const getSettingsSectionClass = () => {
    switch(osType) {
      case 'mac':
        return 'rounded-md bg-gray-100 dark:bg-gray-800 shadow-md';
      case 'windows':
        return 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
      case 'ios':
        return 'rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg';
      case 'android':
        return 'rounded-lg bg-white dark:bg-gray-800 shadow-md';
      default:
        return 'bg-white dark:bg-gray-800 shadow-md';
    }
  };
  
  return (
    <div className="w-full h-full p-4 overflow-y-auto text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Theme Settings */}
      <div className={`${getSettingsSectionClass()} p-4 mb-6`}>
        <h2 className="text-lg font-semibold mb-3">Appearance</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Theme</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`px-4 py-2 rounded ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              System {theme === 'system' && activeTheme && `(${activeTheme})`}
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Font Size</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setFontSize('small')}
              className={`px-4 py-2 rounded ${fontSize === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Small
            </button>
            <button
              onClick={() => setFontSize('medium')}
              className={`px-4 py-2 rounded ${fontSize === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-4 py-2 rounded ${fontSize === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              Large
            </button>
          </div>
        </div>
        
        {/* Theme Preview */}
        <div className="mt-4 p-4 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-base font-medium mb-2">Theme Preview</h3>
          <div className="flex space-x-4">
            <div className="w-16 h-16 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-black dark:text-white">
              Light
            </div>
            <div className="w-16 h-16 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-gray-800 dark:bg-gray-900 text-white">
              Dark
            </div>
            <div className="w-16 h-16 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md bg-blue-500 text-white">
              Accent
            </div>
          </div>
        </div>
      </div>
      
      {/* OS Preferences */}
      <div className={`${getSettingsSectionClass()} p-4 mb-6`}>
        <h2 className="text-lg font-semibold mb-3">Operating System</h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Preferred OS</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <button
              onClick={() => setPreferredOs('auto')}
              className={`p-2 rounded flex flex-col items-center ${preferredOs === 'auto' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className="text-xl mb-1">🔄</span>
              <span className="text-xs">Auto</span>
            </button>
            <button
              onClick={() => setPreferredOs('mac')}
              className={`p-2 rounded flex flex-col items-center ${preferredOs === 'mac' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className="text-xl mb-1">🍎</span>
              <span className="text-xs">macOS</span>
            </button>
            <button
              onClick={() => setPreferredOs('windows')}
              className={`p-2 rounded flex flex-col items-center ${preferredOs === 'windows' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className="text-xl mb-1">🪟</span>
              <span className="text-xs">Windows</span>
            </button>
            <button
              onClick={() => setPreferredOs('ios')}
              className={`p-2 rounded flex flex-col items-center ${preferredOs === 'ios' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className="text-xl mb-1">📱</span>
              <span className="text-xs">iOS</span>
            </button>
            <button
              onClick={() => setPreferredOs('android')}
              className={`p-2 rounded flex flex-col items-center ${preferredOs === 'android' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className="text-xl mb-1">🤖</span>
              <span className="text-xs">Android</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Accessibility Settings */}
      <div className={`${getSettingsSectionClass()} p-4 mb-6`}>
        <h2 className="text-lg font-semibold mb-3">Accessibility</h2>
        
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium">Reduce Motion</label>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
            <input
              type="checkbox"
              className="absolute w-6 h-6 cursor-pointer opacity-0 z-10"
              checked={motionReduced}
              onChange={(e) => setMotionReduced(e.target.checked)}
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${motionReduced ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${motionReduced ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </div>
        
        <div className="mb-4 flex items-center justify-between">
          <label className="text-sm font-medium">Sound Effects</label>
          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
            <input
              type="checkbox"
              className="absolute w-6 h-6 cursor-pointer opacity-0 z-10"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
            />
            <div className={`w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full bg-white shadow transform transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </div>
        </div>
      </div>
      
      {/* Keyboard Shortcuts */}
      <div className={`${getSettingsSectionClass()} p-4 mb-6`}>
        <h2 className="text-lg font-semibold mb-3">Keyboard Shortcuts</h2>
        
        <div className="grid grid-cols-1 gap-2">
          {shortcuts.map((shortcut) => (
            <div 
              key={shortcut.id} 
              className="flex justify-between items-center p-2 rounded bg-gray-100 dark:bg-gray-700"
            >
              <span>{shortcut.description}</span>
              <div className="flex space-x-1">
                {shortcut.modifiers.ctrl && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded">Ctrl</span>
                )}
                {shortcut.modifiers.alt && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded">Alt</span>
                )}
                {shortcut.modifiers.shift && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded">Shift</span>
                )}
                {shortcut.modifiers.meta && (
                  <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded">{osType === 'mac' ? '⌘' : 'Win'}</span>
                )}
                <span className="bg-gray-200 dark:bg-gray-600 text-xs px-2 py-1 rounded">
                  {shortcut.key.length === 1 ? shortcut.key.toUpperCase() : shortcut.key}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* About */}
      <div className={`${getSettingsSectionClass()} p-4 mb-6`}>
        <h2 className="text-lg font-semibold mb-3">About</h2>
        <p className="text-sm mb-2">Portfolio OS v1.0.0</p>
        <p className="text-sm mb-2">© 2025 - All rights reserved</p>
        <p className="text-sm opacity-70">Built with React, Next.js, and TailwindCSS</p>
      </div>
    </div>
  );
};

export default SettingsApp;
