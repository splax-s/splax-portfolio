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
    <div className="relative w-full h-full bg-cover bg-center overflow-hidden select-none"
         style={{ backgroundImage: 'url(/backgrounds/new-mac-background.svg)' }}>
      {/* Top Menu Bar - macOS style */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-[#1d1d1dcc] backdrop-blur-2xl px-2 
                    flex items-center justify-between text-white/90 text-[13px] font-normal z-50 
                    border-b border-[#ffffff0a] shadow-sm">
        <div className="flex items-center space-x-4">
          {/* Apple Logo */}
          <div className="flex items-center space-x-4 px-2">
            <svg className="w-[16px] h-[16px]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
            </svg>
          </div>
          
          {/* App name in bold */}
          <span className="font-bold">Finder</span>
          
          {/* Menu items with hover effect */}
          <div className="flex items-center space-x-4">
            {['File', 'Edit', 'View', 'Go', 'Window', 'Help'].map((item) => (
              <button
                key={item}
                className="hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors duration-150"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Right side system icons */}
        <div className="flex items-center space-x-2 text-xs">
          {/* System icons */}
          <div className="flex items-center space-x-2 px-2">
            <button className="hover:bg-white/10 p-1 rounded-sm transition-colors duration-150">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </button>
            <button className="hover:bg-white/10 p-1 rounded-sm transition-colors duration-150">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M12 3v10M3.05 13A9 9 0 1 0 21 13" />
              </svg>
            </button>
          </div>

          {/* Date and Time with hover effect */}
          <button className="hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors duration-150">
            {currentDate}
          </button>
          <button className="hover:bg-white/10 px-2 py-0.5 rounded-sm transition-colors duration-150 mr-1">
            {currentTime}
          </button>
        </div>
      </div>

      {/* Main Desktop Area */}
      <motion.div 
        className="w-full h-full pt-6"
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
