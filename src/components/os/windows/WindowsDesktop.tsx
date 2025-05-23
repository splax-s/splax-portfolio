'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useOsStore } from '@/store/useOsStore';

// const WindowsTaskbar: React.FC = () => {
//   const [isStartOpen, setIsStartOpen] = useState(false);
// //   const { windows, toggleApp } = useOsStore();
//   const currentTime = new Date().toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   });

//   return (
//     <>
//       <motion.div 
//         className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-md flex items-center px-4"
//         initial={{ y: 50 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.3, delay: 0.2 }}
//       >
//         <div className="flex items-center space-x-2 flex-1">
//           {/* Start Button */}
//           <motion.button
//             className="p-2 rounded-lg hover:bg-white/10"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setIsStartOpen(!isStartOpen)}
//           >
//             <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M3 3H11V11H3V3M3 13H11V21H3V13M13 3H21V11H13V3M13 13H21V21H13V13Z" />
//             </svg>
//           </motion.button>

//           {/* Search */}
//           <div className="flex items-center bg-white/10 rounded-lg px-4 py-1.5">
//             <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <span className="text-white/60 text-sm">Type here to search</span>
//           </div>

//           {/* Running Apps */}
//           <div className="flex space-x-1">
//             {/* Add running apps indicators here */}
//           </div>
//         </div>

//         {/* System Tray */}
//         <div className="flex items-center space-x-4 text-white">
//           <div className="flex items-center space-x-2">
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
//             </svg>
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.013V14c0 4-2 6-6 6h-6c-4 0-6-2-6-6V10" />
//             </svg>
//           </div>
//           <div className="text-sm">{currentTime}</div>
//           <div className="text-sm">{new Date().toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//           })}</div>
//         </div>
//       </motion.div>
      
//       <AnimatePresence>
//         {isStartOpen && <WindowsStartMenu onClose={() => setIsStartOpen(false)} />}
//       </AnimatePresence>
//     </>
//   );
// };

// const WindowsStartMenu: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const { windows, toggleApp } = useOsStore();
  
//   return (
//     <motion.div 
//       className="fixed bottom-12 left-0 w-80 bg-blue-900/90 backdrop-blur-sm rounded-tr-lg shadow-lg flex flex-col text-white z-20"
//       initial={{ y: 20, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       exit={{ y: 20, opacity: 0 }}
//       transition={{ duration: 0.2 }}
//     >
//       <div className="p-4 border-b border-blue-800">
//         <h3 className="text-lg font-medium">Splax OS</h3>
//         <p className="text-sm opacity-80">Windows Edition</p>
//       </div>
      
//       <div className="flex-1 p-2">
//         <div className="grid grid-cols-2 gap-2">
//           {windows.map((app) => (
//             <button
//               key={app.id}
//               className="flex flex-col items-center p-3 rounded hover:bg-blue-800 transition-colors"
//               onClick={() => {
//                 toggleApp(app.id);
//                 onClose();
//               }}
//             >
//               <Image src={app.icon} alt={app.title} className="w-10 h-10 mb-1" width={40} height={40}/>
//               <span className="text-xs text-center">{app.title}</span>
//             </button>
//           ))}
//         </div>
//       </div>
      
//       <button 
//         className="p-2 border-t border-blue-800 hover:bg-blue-800 transition-colors flex items-center"
//         onClick={onClose}
//       >
//         <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="white">
//           <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z"/>
//         </svg>
//         <span>Power</span>
//       </button>
//     </motion.div>
//   );
// };

const WindowsDesktop: React.FC = () => {
  const { toggleApp } = useOsStore();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="relative w-full h-full bg-cover bg-center"
         style={{ backgroundImage: 'url(/backgrounds/new-windows-background.svg)' }}>
      {/* Desktop Icons */}
      <div className="grid grid-cols-1 gap-6 p-4">
        {[
          { name: 'About', icon: '/icons/about.svg', id: 'about' },
          { name: 'Projects', icon: '/icons/projects.svg', id: 'projects' },
          { name: 'Terminal', icon: '/icons/terminal.svg', id: 'terminal' },
          { name: 'Contact', icon: '/icons/contact.svg', id: 'contact' },
        ].map((app) => (
          <motion.button
            key={app.id}
            onClick={() => toggleApp(app.id)}
            className="flex flex-col items-center space-y-1 p-2 rounded-lg hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src={app.icon}
              alt={app.name}
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <span className="text-white text-sm font-medium text-shadow">{app.name}</span>
          </motion.button>
        ))}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/80 backdrop-blur-md flex items-center px-4">
        <div className="flex items-center space-x-2 flex-1">
          {/* Start Button */}
          <motion.button
            className="p-2 rounded-lg hover:bg-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsStartOpen(!isStartOpen)}
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3H11V11H3V3M3 13H11V21H3V13M13 3H21V11H13V3M13 13H21V21H13V13Z" />
            </svg>
          </motion.button>

          {/* Search */}
          <div className="flex items-center bg-white/10 rounded-lg px-4 py-1.5">
            <svg className="w-4 h-4 text-white mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-white/60 text-sm">Type here to search</span>
          </div>

          {/* Running Apps */}
          <div className="flex space-x-1">
            {/* Add running apps indicators here */}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center space-x-4 text-white">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10.013V14c0 4-2 6-6 6h-6c-4 0-6-2-6-6V10" />
            </svg>
          </div>
          <div className="text-sm">{currentTime}</div>
          <div className="text-sm">{currentDate}</div>
        </div>
      </div>
    </div>
  );
};

export default WindowsDesktop;
