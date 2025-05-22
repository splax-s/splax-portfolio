'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import MacDock from './MacDock';

const MacDesktop: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="relative w-full h-full bg-cover bg-center overflow-hidden"
         style={{ backgroundImage: 'url(/backgrounds/new-mac-background.svg)' }}>
      {/* Top Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/20 backdrop-blur-md px-4 flex items-center justify-between text-white text-sm z-50">
        <div className="flex items-center space-x-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
          </svg>
          <span className="font-semibold">Finder</span>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
          <span>Help</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.013V14c0 4-2 6-6 6h-6c-4 0-6-2-6-6V10" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v13" />
            </svg>
          </div>
          <div>{currentDate}</div>
          <div>{currentTime}</div>
        </div>
      </div>

      {/* Main Desktop Area */}
      <motion.div 
        className="w-full h-full pt-7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Desktop content goes here */}
      </motion.div>

      {/* Dock */}
      <MacDock />
    </div>
  );
};

export default MacDesktop;
