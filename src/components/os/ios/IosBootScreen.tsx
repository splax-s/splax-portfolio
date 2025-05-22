'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';

const IosBootScreen: React.FC = () => {
  const { completeBoot } = useOsStore();
  
  // Auto transition to home screen after boot animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      completeBoot();
    }, 3000); // iOS boots quickly
    
    return () => clearTimeout(timer);
  }, [completeBoot]);
  
  return (
    <motion.div 
      className="fixed inset-0 flex items-center justify-center bg-black z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      key="ios-boot-screen"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.5, 
          duration: 0.8,
          ease: [0.34, 1.56, 0.64, 1] // Custom spring-like ease
        }}
      >
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      </motion.div>
      
      {/* Spinning loading indicator */}
      <motion.div 
        className="absolute bottom-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <motion.div 
          className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </motion.div>
      
      {/* Device name that appears during boot */}
      <motion.div 
        className="absolute bottom-8 text-white/80 font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span>iPhone</span>
      </motion.div>
    </motion.div>
  );
};

export default IosBootScreen;
