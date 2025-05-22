import { create } from 'zustand';

export interface AppWindow {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isFocused: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  component: string;
}

export type OsType = 'mac' | 'windows' | 'ios' | 'android';

interface OsState {
  osType: OsType;
  isBooting: boolean;
  isBootComplete: boolean;
  windows: AppWindow[];
  maxZIndex: number;
  
  // Actions
  setOsType: (osType: OsType) => void;
  startBoot: () => void;
  completeBoot: () => void;
  openApp: (appId: string) => void;
  closeApp: (appId: string) => void;
  focusApp: (appId: string) => void;
  minimizeApp: (appId: string) => void;
  maximizeApp: (appId: string) => void;
  restoreApp: (appId: string) => void;
  moveWindow: (appId: string, position: { x: number; y: number }) => void;
  resizeWindow: (appId: string, size: { width: number; height: number }) => void;
  toggleApp: (appId: string) => void;
}

export const useOsStore = create<OsState>((set) => ({
  osType: 'mac',
  isBooting: false,
  isBootComplete: false,
  toggleApp: (appId: string) => set((state) => {
    const window = state.windows.find(w => w.id === appId);
    if (window?.isOpen) {
      // If window is open, close it
      return {
        windows: state.windows.map((w) => 
          w.id === appId
            ? { ...w, isOpen: false, isFocused: false, isMaximized: false, isMinimized: false }
            : w
        ),
      };
    } else {
      // If window is closed, open it
      const newMaxZIndex = state.maxZIndex + 1;
      return {
        windows: state.windows.map((w) => 
          w.id === appId
            ? { ...w, isOpen: true, isFocused: true, isMinimized: false, zIndex: newMaxZIndex }
            : { ...w, isFocused: false }
        ),
        maxZIndex: newMaxZIndex,
      };
    }
  }),

  windows: [
    {
      id: 'terminal',
      title: 'Terminal',
      icon: '/icons/terminal.svg',
      isOpen: false,
      isFocused: false,
      isMaximized: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 100, y: 100 },
      size: { width: 600, height: 400 },
      component: 'Terminal',
    },
    {
      id: 'projects',
      title: 'Projects',
      icon: '/icons/projects.svg',
      isOpen: false,
      isFocused: false,
      isMaximized: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 150, y: 150 },
      size: { width: 700, height: 500 },
      component: 'Projects',
    },
    {
      id: 'about',
      title: 'About Me',
      icon: '/icons/about.svg',
      isOpen: false,
      isFocused: false,
      isMaximized: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 200, y: 200 },
      size: { width: 500, height: 400 },
      component: 'About',
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: '/icons/contact.svg',
      isOpen: false,
      isFocused: false,
      isMaximized: false,
      isMinimized: false,
      zIndex: 0,
      position: { x: 250, y: 250 },
      size: { width: 400, height: 350 },
      component: 'Contact',
    },
  ],
  maxZIndex: 0,
  
  setOsType: (osType) => set({ osType }),
  
  startBoot: () => set({ isBooting: true }),
  
  completeBoot: () => set({ isBooting: false, isBootComplete: true }),
  
  openApp: (appId) => set((state) => {
    const newMaxZIndex = state.maxZIndex + 1;
    return {
      windows: state.windows.map((window) => 
        window.id === appId
          ? { ...window, isOpen: true, isFocused: true, isMinimized: false, zIndex: newMaxZIndex }
          : { ...window, isFocused: false }
      ),
      maxZIndex: newMaxZIndex,
    };
  }),
  
  closeApp: (appId) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, isOpen: false, isFocused: false, isMaximized: false, isMinimized: false }
        : window
    ),
  })),
  
  focusApp: (appId) => set((state) => {
    const newMaxZIndex = state.maxZIndex + 1;
    return {
      windows: state.windows.map((window) => 
        window.id === appId
          ? { ...window, isFocused: true, zIndex: newMaxZIndex }
          : { ...window, isFocused: false }
      ),
      maxZIndex: newMaxZIndex,
    };
  }),
  
  minimizeApp: (appId) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, isMinimized: true, isFocused: false }
        : window
    ),
  })),
  
  maximizeApp: (appId) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, isMaximized: true }
        : window
    ),
  })),
  
  restoreApp: (appId) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, isMaximized: false, isMinimized: false }
        : window
    ),
  })),
  
  moveWindow: (appId, position) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, position }
        : window
    ),
  })),
  
  resizeWindow: (appId, size) => set((state) => ({
    windows: state.windows.map((window) => 
      window.id === appId
        ? { ...window, size }
        : window
    ),
  })),
}));
