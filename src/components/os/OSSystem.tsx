'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useOsStore } from '@/store/useOsStore';
import { detectOS } from '@/lib/os/detectOS';

// OS-specific components
import MacDesktop from '@/components/os/mac/MacDesktop';
import MacDock from '@/components/os/mac/MacDock';
import WindowsDesktop from '@/components/os/windows/WindowsDesktop';
import IosHomeScreen from '@/components/os/ios/IosHomeScreen';
import AndroidHomeScreen from '@/components/os/android/AndroidHomeScreen';

// App windows
import Window from '@/components/ui/Window';

// Boot animations
import MacBootScreen from '@/components/os/mac/MacBootScreen';
import WindowsBootScreen from '@/components/os/windows/WindowsBootScreen';
import IosBootScreen from '@/components/os/ios/IosBootScreen';
import AndroidBootScreen from '@/components/os/android/AndroidBootScreen';

// Dynamic import of WindowContent
const DynamicWindowContent = dynamic(() => import('./common/WindowContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <p>Loading app...</p>
    </div>
  ),
});

const OSSystem: React.FC = () => {
  const { osType, setOsType, isBooting, isBootComplete, startBoot, completeBoot, windows } = useOsStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const detectedOs = detectOS();
      setOsType(detectedOs);
      startBoot();

      const bootFallbackTimer = setTimeout(() => {
        completeBoot();
      }, 6000);

      setIsInitialized(true);

      return () => clearTimeout(bootFallbackTimer);
    }
  }, [isInitialized, setOsType, startBoot, completeBoot]);

  const renderBootScreen = () => {
    if (!isBooting) return null;

    switch (osType) {
      case 'mac':
        return <MacBootScreen />;
      case 'windows':
        return <WindowsBootScreen />;
      case 'ios':
        return <IosBootScreen />;
      case 'android':
        return <AndroidBootScreen />;
      default:
        return <MacBootScreen />;
    }
  };

  const renderOS = () => {
    if (!isBootComplete) return null;

    switch (osType) {
      case 'mac':
        return (
          <>
            <MacDesktop />
            <MacDock />
          </>
        );
      case 'windows':
        return <WindowsDesktop />;
      case 'ios':
        return <IosHomeScreen />;
      case 'android':
        return <AndroidHomeScreen />;
      default:
        return (
          <>
            <MacDesktop />
            <MacDock />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {isBooting ? (
          renderBootScreen()
        ) : (
          <motion.div
            key="os-content"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {renderOS()}
            <AnimatePresence>
              {windows.map((window) =>
                window.isOpen ? (
                  <Window
                    key={window.id}
                    id={window.id}
                    title={window.title}
                    icon={window.icon}
                    initialPosition={window.position}
                    initialSize={window.size}
                  >
                    <DynamicWindowContent component={window.component} />
                  </Window>
                ) : null
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OSSystem;
