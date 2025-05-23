'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useOsStore } from '@/store/useOsStore';
import dynamic from 'next/dynamic';
import TerminalSimple from '@/components/apps/TerminalSimple';

// Dynamically import the Terminal component with no SSR to avoid hydration issues
const Terminal = dynamic(() => import('@/components/apps/Terminal').catch(() => {
  // If terminal fails to load, return a simple div that will trigger error boundary
  const FallbackComponent = () => (<div>Terminal load failed</div>);
  FallbackComponent.displayName = 'TerminalFallback';
  return FallbackComponent;
}), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black p-4 font-mono">
      <div className="flex flex-col space-y-2 text-white/90">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-t-2 border-r-2 border-white/30 rounded-full animate-spin"></div>
          <span>Initializing terminal environment...</span>
        </div>
        <div className="text-sm text-white/60">
          <div>Loading components...</div>
          <div className="ml-2 text-white/40">• xterm.js</div>
          <div className="ml-2 text-white/40">• addons</div>
        </div>
      </div>
    </div>
  )
});

export const DynamicTerminal: React.FC = () => {
  const mounted = useRef(true);
  const [useSimpleTerminal, setUseSimpleTerminal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { osType } = useOsStore();

  console.log(isLoaded, loadError);

  useEffect(() => {
    mounted.current = true;
    
    const handleTerminalError = () => {
      if (mounted.current) {
        setUseSimpleTerminal(true);
      }
    };

    window.addEventListener('terminalError', handleTerminalError);
    
    // Attempt to load xterm.js
    const loadXterm = async () => {
      try {
        await import('@xterm/xterm');
        if (mounted.current) {
          setIsLoaded(true);
        }
      } catch (error) {
        if (mounted.current) {
          setLoadError(error as Error);
          setUseSimpleTerminal(true);
        }
      }
    };

    loadXterm();
    
    return () => {
      mounted.current = false;
      window.removeEventListener('terminalError', handleTerminalError);
    };
  }, []);

  useEffect(() => {
    // If load failed, switch to simple terminal
    if (loadError) {
      setUseSimpleTerminal(true);
    }
  }, [loadError]);

  if (useSimpleTerminal) {
    return <TerminalSimple />;
  }

  return <Terminal key={`terminal-${osType}`} />;
};
