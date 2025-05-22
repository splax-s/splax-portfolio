'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useOsStore } from '@/store/useOsStore';

const IosHomeScreen: React.FC = () => {
  const { toggleApp } = useOsStore();
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="relative w-full h-full bg-cover bg-center"
         style={{ backgroundImage: 'url(/backgrounds/new-ios-background.svg)' }}>
      {/* Dynamic Island */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-50">
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-800 rounded-full"></div>
      </div>

      {/* Status Bar */}
      <div className="absolute top-1 left-0 right-0 px-6 flex justify-between items-center text-white text-sm z-40">
        <div>{currentTime}</div>
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,3C7.79,3 4.11,5.37 2.31,8.9L1.11,10L2.31,11.1C4.11,14.63 7.79,17 12,17C16.21,17 19.89,14.63 21.69,11.1L22.89,10L21.69,8.9C19.89,5.37 16.21,3 12,3M12,15C9.24,15 7,12.76 7,10C7,7.24 9.24,5 12,5C14.76,5 17,7.24 17,10C17,12.76 14.76,15 12,15M12,7C10.34,7 9,8.34 9,10C9,11.66 10.34,13 12,13C13.66,13 15,11.66 15,10C15,8.34 13.66,7 12,7Z" />
          </svg>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,17H5V7H19M19,5H5A2,2 0 0,0 3,7V17A2,2 0 0,0 5,19H19A2,2 0 0,0 21,17V7A2,2 0 0,0 19,5M16.5,10A1.5,1.5 0 0,0 15,8.5A1.5,1.5 0 0,0 13.5,10A1.5,1.5 0 0,0 15,11.5A1.5,1.5 0 0,0 16.5,10M12,14L10.5,12L8,15H19L15,10L12,14Z" />
          </svg>
        </div>
      </div>

      {/* App Grid */}
      <div className="w-full h-full pt-16 px-6 grid grid-cols-4 gap-8">
        {[
          { name: 'About', icon: '/icons/about.svg', id: 'about' },
          { name: 'Projects', icon: '/icons/projects.svg', id: 'projects' },
          { name: 'Terminal', icon: '/icons/terminal.svg', id: 'terminal' },
          { name: 'Contact', icon: '/icons/contact.svg', id: 'contact' },
        ].map((app) => (
          <motion.button
            key={app.id}
            onClick={() => toggleApp(app.id)}
            className="flex flex-col items-center space-y-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Image
                src={app.icon}
                alt={app.name}
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <span className="text-white text-sm font-medium">{app.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Dock */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-3xl bg-white/20 backdrop-blur-md">
        <div className="flex space-x-6">
          {[
            { name: 'Phone', icon: '📞' },
            { name: 'Messages', icon: '💬' },
            { name: 'Safari', icon: '🌐' },
            { name: 'Mail', icon: '✉️' },
          ].map((app) => (
            <motion.button
              key={app.name}
              className="w-12 h-12 flex items-center justify-center text-2xl"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {app.icon}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full"></div>
    </div>
  );
};

export default IosHomeScreen;
