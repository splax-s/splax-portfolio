'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useOsStore } from '@/store/useOsStore';

interface ShortcutAction {
  id: string;
  description: string;
  callback: () => void;
  key: string;
  modifiers: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

interface KeyboardShortcutsContextType {
  registerShortcut: (shortcut: ShortcutAction) => void;
  unregisterShortcut: (id: string) => void;
  getActiveShortcuts: () => ShortcutAction[];
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};

export const KeyboardShortcutsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { osType } = useOsStore();
  const [shortcuts, setShortcuts] = React.useState<ShortcutAction[]>([]);
  
  const registerShortcut = (shortcut: ShortcutAction) => {
    setShortcuts(prev => {
      // Don't register duplicates
      if (prev.some(s => s.id === shortcut.id)) {
        return prev;
      }
      return [...prev, shortcut];
    });
  };
  
  const unregisterShortcut = (id: string) => {
    setShortcuts(prev => prev.filter(shortcut => shortcut.id !== id));
  };
  
  const getActiveShortcuts = () => shortcuts;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if within input field or contentEditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      // Find matching shortcuts
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatches = shortcut.key.toLowerCase() === e.key.toLowerCase();
        const ctrlMatches = !!shortcut.modifiers.ctrl === e.ctrlKey;
        const altMatches = !!shortcut.modifiers.alt === e.altKey;
        const shiftMatches = !!shortcut.modifiers.shift === e.shiftKey;
        const metaMatches = !!shortcut.modifiers.meta === e.metaKey;
        
        return keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches;
      });

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  // Register default OS-specific shortcuts
  useEffect(() => {
    // Define OS-specific shortcuts
    const commonShortcuts: ShortcutAction[] = [
      {
        id: 'close-window',
        description: 'Close active window',
        key: 'Escape',
        modifiers: {},
        callback: () => {
          const { windows, closeApp } = useOsStore.getState();
          const focusedWindow = windows.find(w => w.isFocused && w.isOpen);
          if (focusedWindow) {
            closeApp(focusedWindow.id);
          }
        }
      }
    ];
    
    // Register common shortcuts
    commonShortcuts.forEach(shortcut => {
      registerShortcut(shortcut);
    });
    
    // OS-specific shortcuts
    const isMac = osType === 'mac';
    
    // App launcher shortcuts
    registerShortcut({
      id: 'open-terminal',
      description: 'Open Terminal',
      key: 't',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { toggleApp } = useOsStore.getState();
        toggleApp('terminal');
      }
    });
    
    registerShortcut({
      id: 'open-projects',
      description: 'Open Projects',
      key: 'p',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { toggleApp } = useOsStore.getState();
        toggleApp('projects');
      }
    });
    
    registerShortcut({
      id: 'open-contact',
      description: 'Open Contact',
      key: 'e',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { toggleApp } = useOsStore.getState();
        toggleApp('contact');
      }
    });
    
    registerShortcut({
      id: 'open-about',
      description: 'Open About',
      key: 'i',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { toggleApp } = useOsStore.getState();
        toggleApp('about');
      }
    });
    
    registerShortcut({
      id: 'open-settings',
      description: 'Open Settings',
      key: ',',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { toggleApp } = useOsStore.getState();
        toggleApp('settings');
      }
    });
    
    // Window management shortcuts
    registerShortcut({
      id: 'minimize-window',
      description: 'Minimize active window',
      key: 'm',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true },
      callback: () => {
        const { windows, minimizeApp } = useOsStore.getState();
        const focusedWindow = windows.find(w => w.isFocused && w.isOpen);
        if (focusedWindow) {
          minimizeApp(focusedWindow.id);
        }
      }
    });
    
    registerShortcut({
      id: 'maximize-window',
      description: 'Maximize active window',
      key: 'm',
      modifiers: { [isMac ? 'meta' : 'ctrl']: true, shift: true },
      callback: () => {
        const { windows, maximizeApp } = useOsStore.getState();
        const focusedWindow = windows.find(w => w.isFocused && w.isOpen);
        if (focusedWindow) {
          maximizeApp(focusedWindow.id);
        }
      }
    });
    
    return () => {
      // Cleanup when component is unmounted or OS changes
      commonShortcuts.forEach(shortcut => {
        unregisterShortcut(shortcut.id);
      });
      unregisterShortcut('open-terminal');
      unregisterShortcut('open-projects');
      unregisterShortcut('open-contact');
      unregisterShortcut('open-about');
      unregisterShortcut('open-settings');
      unregisterShortcut('minimize-window');
      unregisterShortcut('maximize-window');
    };
  }, [osType]);

  const contextValue: KeyboardShortcutsContextType = {
    registerShortcut,
    unregisterShortcut,
    getActiveShortcuts,
  };

  return (
    <KeyboardShortcutsContext.Provider value={contextValue}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};
