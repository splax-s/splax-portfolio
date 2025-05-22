'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';

const AndroidBootScreen: React.FC = () => {
  const { completeBoot } = useOsStore();
  
  // Auto transition to home screen after boot animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      completeBoot();
    }, 3500); // Android takes a bit longer than iOS
    
    return () => clearTimeout(timer);
  }, [completeBoot]);
  
  return (
    <motion.div 
      className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      key="android-boot-screen"
    >
      {/* Android Logo with animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: 0.5, 
          duration: 0.7, 
          type: "spring",
          stiffness: 200
        }}
      >
        <svg className="w-24 h-24" viewBox="0 0 24 24" fill="#3DDC84">
          <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.983 5.983 0 0 0 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
        </svg>
      </motion.div>
      
      {/* Animated Loading Circle - Similar to Android Boot Animation */}
      <motion.div
        className="mt-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <svg className="w-16 h-16" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke="#3DDC84"
            strokeWidth="4"
            fill="none"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ 
              strokeDashoffset: [251.2, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 2,
              ease: "linear",
              repeat: Infinity,
            }}
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      </motion.div>
      
      {/* Android Version Text */}
      <motion.div
        className="mt-6 text-green-400 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span>Android</span>
      </motion.div>
      
      {/* Manufacturer Text */}
      <motion.div
        className="mt-2 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <span>powered by Portfolio OS</span>
      </motion.div>
    </motion.div>
  );
};

export default AndroidBootScreen;
