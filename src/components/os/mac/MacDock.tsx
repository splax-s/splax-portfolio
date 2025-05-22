'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';
import Image from 'next/image';

const MacDock: React.FC = () => {
  const { windows, toggleApp } = useOsStore();

  return (
    <motion.div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-end space-x-1 px-3 py-1 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.7, type: 'spring', stiffness: 300, damping: 20 }}
    >
      {windows.map((app, index) => (
        <motion.button
          key={app.id}
          className={`relative flex items-center justify-center w-12 h-12 rounded-xl ${
            app.isOpen ? 'bg-gray-400/30' : 'hover:bg-gray-400/20'
          } transition-all duration-200`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.8 + index * 0.1, 
            type: 'spring',
            stiffness: 400,
            damping: 25
          }}
          whileHover={{ y: -10, scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleApp(app.id)}
        >
          <Image src={app.icon} alt={app.title} className="w-10 h-10" width={40} height={40} />
          {app.isOpen && (
            <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-white" />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default MacDock;
