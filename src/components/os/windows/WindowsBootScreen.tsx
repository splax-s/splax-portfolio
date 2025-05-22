'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';

const WindowsBootScreen: React.FC = () => {
  const { completeBoot } = useOsStore();
  
  // Auto transition to desktop after boot animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      completeBoot();
    }, 4000); // Windows boot takes a bit longer
    
    return () => clearTimeout(timer);
  }, [completeBoot]);
  
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-blue-900 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      key="windows-boot-screen"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="white">
          <path d="M3 12V6.75l6-1.32v6.48L3 12m17-9v8.75l-10 .15V5.21L20 3m0 18-10-1.5V13l10 .19V21m-17-9.75l6 .09v6.81l-6-1.15V11.25z"/>
        </svg>
      </motion.div>
      
      <motion.div
        className="mt-12 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div 
          className="w-3 h-3 bg-white rounded-full mx-1"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0
          }}
        />
        <motion.div 
          className="w-3 h-3 bg-white rounded-full mx-1"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.2
          }}
        />
        <motion.div 
          className="w-3 h-3 bg-white rounded-full mx-1"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.4
          }}
        />
        <motion.div 
          className="w-3 h-3 bg-white rounded-full mx-1"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.6
          }}
        />
        <motion.div 
          className="w-3 h-3 bg-white rounded-full mx-1"
          animate={{ 
            y: [0, -10, 0],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1,
            delay: 0.8
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default WindowsBootScreen;
