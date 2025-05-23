'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';
import Image from 'next/image';

const AndroidHomeScreen: React.FC = () => {
  const { windows, toggleApp } = useOsStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [time, setTime] = useState(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [swipeInProgress, setSwipeInProgress] = useState(false);
  const [swipeDistance, setSwipeDistance] = useState(0);
  
  const appsPerRow = orientation === 'portrait' ? 5 : 8;
  const appsPerPage = orientation === 'portrait' ? 20 : 24;
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const currentTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Handle orientation changes
  useEffect(() => {
    const handleResize = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };
    
    // Set initial orientation
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle touch gestures for drawer
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setSwipeInProgress(true);
    setSwipeDistance(0);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const currentTouch = e.touches[0].clientY;
    const diff = touchStart - currentTouch;
    
    // Only consider vertical swipes
    if (Math.abs(diff) > 10) {
      setSwipeDistance(diff);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    // If swipe distance is significant, toggle drawer
    if (Math.abs(diff) > 50) {
      if (diff > 0 && !isDrawerOpen) {
        // Swipe up - open drawer
        setIsDrawerOpen(true);
      } else if (diff < 0 && isDrawerOpen) {
        // Swipe down - close drawer
        setIsDrawerOpen(false);
      }
    }
    
    setTouchStart(null);
    setSwipeInProgress(false);
    setSwipeDistance(0);
  };
  
  // Staggered app animation for the grid
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.02,
        staggerDirection: -1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Calculate drawer animation based on swipe
  const getDrawerAnimation = () => {
    if (swipeInProgress) {
      const progress = Math.max(0, Math.min(1, swipeDistance / 200));
      return {
        y: isDrawerOpen ? swipeDistance : (window.innerHeight * (1 - progress))
      };
    }
    
    return {
      y: isDrawerOpen ? 0 : window.innerHeight
    };
  };
  
  const drawerAnimation = getDrawerAnimation();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{
        backgroundImage: "url('/backgrounds/android-background.svg')",
        backgroundSize: 'cover'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Status Bar */}
      <motion.div 
        className="py-1 px-4 flex justify-between items-center text-white bg-black/30"
        initial={{ translateY: -20 }}
        animate={{ translateY: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <span className="text-sm">{currentTime}</span>
        <div className="flex items-center space-x-2">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M7 19h10V5H7v14zm-5-1.5C2 18.9 3.1 20 4.5 20s2.5-1.1 2.5-2.5S5.9 15 4.5 15 2 16.1 2 17.5zm19-15C21 1.1 19.9 0 18.5 0S16 1.1 16 2.5 17.1 5 18.5 5 21 3.9 21 2.5z"/>
            </svg>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Home Screen */}
      <div 
        className="flex-1 p-4 flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* App Grid on Home Screen */}
        <AnimatePresence mode="wait">
          {!isDrawerOpen && (
            <motion.div 
              key="homescreen"
              className="flex-1 flex flex-col justify-end"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <div 
                className="grid gap-4" 
                style={{
                  gridTemplateColumns: `repeat(${appsPerRow}, minmax(0, 1fr))`
                }}
              >
                {windows.slice(0, appsPerPage).map((app, index) => (
                  <motion.button
                    key={app.id + index.toString()}
                    className="flex flex-col items-center"
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleApp(app.id)}
                    aria-label={`Open ${app.title}`}
                  >
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center shadow-md"
                      whileHover={{
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)"
                      }}
                    >
                      <Image src={app.icon} alt="" className="w-8 h-8" width={32} height={32} />
                    </motion.div>
                    <span className="mt-1 text-xs text-white bg-black/30 px-2 rounded-md">{app.title}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* App Drawer */}
        <motion.div 
          className="fixed inset-x-0 bottom-0 top-12 bg-black/20 backdrop-blur-sm rounded-t-xl p-4 overflow-auto"
          initial={{ y: window.innerHeight }}
          animate={drawerAnimation}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            restDelta: 0.5,
          }}
        >
          <motion.div
            className="w-16 h-1 bg-white/30 rounded-full mx-auto mb-3"
            animate={{ scale: isDrawerOpen ? 1 : 1.2 }}
            transition={{ repeat: isDrawerOpen ? 0 : Infinity, repeatType: "reverse", duration: 1 }}
          />
          
          <h2 className="text-white text-lg font-medium mb-4">All Apps</h2>
          
          <motion.div 
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${appsPerRow}, minmax(0, 1fr))`
            }}
            variants={container}
            initial="hidden"
            animate={isDrawerOpen ? "show" : "hidden"}
          >
            {windows.map((app, index) => (
              <motion.button
                key={app.id + index.toString()}
                className="flex flex-col items-center"
                variants={item}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  toggleApp(app.id);
                  setIsDrawerOpen(false);
                }}
                aria-label={`Open ${app.title}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-md">
                  <Image src={app.icon} alt="" className="w-8 h-8" width={32} height={32}/>
                </div>
                <span className="mt-1 text-xs text-white">{app.title}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Navigation Bar */}
      <motion.div 
        className="bg-black/70 backdrop-blur-sm py-2 px-6 flex items-center justify-between"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ 
          delay: 0.4, 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
      >
        <motion.button 
          className="w-10 h-10 flex items-center justify-center"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Back"
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </motion.button>
        
        <motion.button 
          className="w-10 h-10 flex items-center justify-center"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Home"
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </motion.button>
        
        <motion.button 
          className="w-10 h-10 flex items-center justify-center"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="All apps"
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/>
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AndroidHomeScreen;
