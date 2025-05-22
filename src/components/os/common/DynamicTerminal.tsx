'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useOsStore } from '@/store/useOsStore';
import dynamic from 'next/dynamic';
import TerminalSimple from '@/components/apps/TerminalSimple';

// Dynamically import the Terminal component with no SSR to avoid hydration issues
const Terminal = dynamic(() => import('@/components/apps/Terminal'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-black flex items-center justify-center text-white">
      <div className="flex flex-col items-center">
        <p className="mb-2">Initializing terminal...</p>
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
});

export const DynamicTerminal: React.FC = () => {
  const mounted = useRef(true);
  const [useSimpleTerminal, setUseSimpleTerminal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { osType } = useOsStore();

  useEffect(() => {
    mounted.current = true;
    
    // Check if we're running on a mobile device where xterm.js might not work well
    if (osType === 'ios' || osType === 'android') {
      setUseSimpleTerminal(true);
    }

    // If Terminal errors, we'll fall back to TerminalSimple
    const handleTerminalError = () => {
      if (mounted.current) {
        console.log('Terminal error detected, falling back to simple terminal');
        setUseSimpleTerminal(true);
      }
    };

    window.addEventListener('terminalError', handleTerminalError);
    
    // Set loaded after a small delay to ensure terminal has time to initialize
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => {
      mounted.current = false;
      window.removeEventListener('terminalError', handleTerminalError);
      clearTimeout(timer);
    };
  }, [osType]);

  return useSimpleTerminal ? <TerminalSimple /> : <Terminal />;
};
