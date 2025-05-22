import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  children,
  initialPosition = { x: 400, y: 400 },
  initialSize = { width: 600, height: 400 },
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  const {
    osType,
    windows,
    focusApp,
    closeApp,
    minimizeApp,
    maximizeApp,
    restoreApp,
    moveWindow,
    resizeWindow,
  } = useOsStore();
  
  const window = windows.find(w => w.id === id);
  
  // Early return using null - move it after all hooks
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (window && !window.isOpen && !isClosing) {
      setIsClosing(true);
    }
  }, [window?.isOpen]);
  
  if (!window || (!window.isOpen && !isClosing)) return null;
  
  const { isFocused, isMaximized, zIndex } = window;
  
  // Calculate position in the center of the screen for new windows
  const getInitialPosition = () => {
    if (typeof window !== 'undefined') {
      const viewportWidth = globalThis.window?.innerWidth || 1024;
      const viewportHeight = globalThis.window?.innerHeight || 768;
      
      // Default size for the window
      const defaultWidth = initialSize.width || 600;
      const defaultHeight = initialSize.height || 400;
      
      // Center the window both horizontally and vertically
      console.log(Math.max(0, (viewportWidth - defaultWidth) / 2))
      return {
        x: Math.max(0, (viewportWidth - defaultWidth) / 2),
        y: Math.max(0, (viewportHeight - defaultHeight) / 2)
      };
    }
    return initialPosition;
  };
  
  // Use stored position or calculate a centered position
  const position = window.isMaximized 
    ? { x: 0, y: 0 } 
    : window.position && (window.position.x !== 0 && window.position.y !== 0)
      ? window.position
      : getInitialPosition();
    
  const size = window.isMaximized
    ? { width: '100%', height: '100%' }
    : window.size || initialSize;
  
  const isMobile = osType === 'ios' || osType === 'android';
  
  useEffect(() => {
    if (isFocused && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isFocused]);
  
  // Handle window controls based on OS type
  const renderWindowControls = () => {
    switch (osType) {
      case 'mac':
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => closeApp(id)}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600"
              aria-label="Close"
            />
            <button
              onClick={() => minimizeApp(id)}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600"
              aria-label="Minimize"
            />
            <button
              onClick={() => isMaximized ? restoreApp(id) : maximizeApp(id)}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600"
              aria-label="Maximize"
            />
          </div>
        );
        
      case 'windows':
        return (
          <div className="flex">
            <button
              onClick={() => minimizeApp(id)}
              className="px-3 py-1 hover:bg-gray-300"
              aria-label="Minimize"
            >
              _
            </button>
            <button
              onClick={() => isMaximized ? restoreApp(id) : maximizeApp(id)}
              className="px-3 py-1 hover:bg-gray-300"
              aria-label="Maximize"
            >
              □
            </button>
            <button
              onClick={() => closeApp(id)}
              className="px-3 py-1 hover:bg-red-500 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        );
        
      default:
        return (
          <button
            onClick={() => closeApp(id)}
            className="p-2"
            aria-label="Close"
          >
            ×
          </button>
        );
    }
  };
  
  if (isMobile) {
    // For mobile OS, we render a full-screen modal with specific OS styling
    const iosStyles = osType === 'ios' ? {
      header: 'bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      closeBtn: 'text-blue-500 font-medium px-3 py-1',
      content: 'bg-white dark:bg-gray-900',
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    } : {
      header: 'bg-gray-800 text-white',
      closeBtn: 'text-white rounded-full w-8 h-8 flex items-center justify-center',
      content: 'bg-gray-100 dark:bg-gray-900',
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.2 }
    };
    
    return (
      <motion.div
        ref={windowRef}
        className="fixed inset-0 z-50 flex flex-col"
        initial={iosStyles.initial}
        animate={iosStyles.animate}
        exit={iosStyles.exit}
        transition={iosStyles.transition}
        onClick={() => focusApp(id)}
        tabIndex={0}
      >
        <motion.div 
          className={`flex items-center justify-between p-2 ${iosStyles.header}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <div className="flex items-center">
            <motion.img 
              src={icon} 
              alt={title} 
              className="w-5 h-5 mr-2"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            />
            <h2 className="font-medium">{title}</h2>
          </div>
          <motion.button
            onClick={() => closeApp(id)}
            className={iosStyles.closeBtn}
            aria-label="Close"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {osType === 'ios' ? 'Done' : '×'}
          </motion.button>
        </motion.div>
        <motion.div 
          className={`flex-1 overflow-auto ${iosStyles.content}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {children}
        </motion.div>
        
        {/* Bottom Pill for iOS */}
        {osType === 'ios' && (
          <motion.div 
            className="flex justify-center py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </motion.div>
        )}
        
        {/* Android Back Button */}
        {osType === 'android' && (
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            <button
              onClick={() => closeApp(id)}
              className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
              aria-label="Back"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
            </button>
          </motion.div>
        )}
      </motion.div>
    );
  }
  
  // For desktop OS, we render a draggable, resizable window
  return (
    <motion.div
      ref={windowRef}
      className={`absolute flex flex-col ${
        osType === 'mac' 
          ? 'rounded-lg overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl' 
          : osType === 'windows'
            ? 'border border-gray-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl'
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl'
      } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: isFocused ? "0px 10px 30px rgba(0, 0, 0, 0.2)" : "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ 
        type: "spring",
        duration: 0.2,
        opacity: { duration: 0.15 },
        boxShadow: { duration: 0.3 }
      }}
      drag={!isMaximized}
      dragMomentum={false}
      dragListener={!isMaximized}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false); 
        moveWindow(id, {
          x: position.x + info.offset.x,
          y: position.y + info.offset.y
        });
      }}
      onClick={() => focusApp(id)}
      tabIndex={0}
    >
      <div 
        className={`flex items-center justify-between p-2 ${
          osType === 'mac' 
            ? 'bg-gray-200 dark:bg-gray-800 rounded-t-lg' 
            : osType === 'windows' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 dark:bg-gray-800'
        }`}
        onDoubleClick={() => isMaximized ? restoreApp(id) : maximizeApp(id)}
      >
        {osType === 'mac' ? (
          <>
            {renderWindowControls()}
            <div className="flex-1 text-center">
              <h2 className="text-sm font-medium">{title}</h2>
            </div>
            <div className="w-16"></div> {/* Spacer to center the title */}
          </>
        ) : (
          <>
            <div className="flex items-center">
              <img src={icon} alt={title} className="w-4 h-4 mr-2" />
              <h2 className="text-sm font-medium">{title}</h2>
            </div>
            {renderWindowControls()}
          </>
        )}
      </div>
      
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
        {children}
      </div>
      
      {!isMaximized && (
        <>
          {/* Right resize handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-blue-400/20"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              
              const startSize = { ...size };
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startPos.x;
                
                const newWidth = Math.max(300, (startSize as any).width + deltaX);
                
                resizeWindow(id, { width: newWidth, height: (startSize as any).height });
              };
              
              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />
          
          {/* Bottom resize handle */}
          <div
            className="absolute bottom-0 left-0 w-full h-1 cursor-ns-resize hover:bg-blue-400/20"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              
              const startSize = { ...size };
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaY = e.clientY - startPos.y;
                
                const newHeight = Math.max(200, (startSize as any).height + deltaY);
                
                resizeWindow(id, { width: (startSize as any).width, height: newHeight });
              };
              
              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          />
          
          {/* Corner resize handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              
              const startSize = { ...size };
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startPos.x;
                const deltaY = e.clientY - startPos.y;
                
                const newWidth = Math.max(300, (startSize as any).width + deltaX);
                const newHeight = Math.max(200, (startSize as any).height + deltaY);
                
                resizeWindow(id, { width: newWidth, height: newHeight });
              };
              
              const onMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
              };
              
              document.addEventListener('mousemove', onMouseMove);
              document.addEventListener('mouseup', onMouseUp);
            }}
          >
            <svg width="6" height="6" viewBox="0 0 6 6" className="opacity-50">
              <rect x="0" y="3" width="3" height="1" fill="currentColor" />
              <rect x="3" y="0" width="1" height="3" fill="currentColor" />
              <rect x="3" y="3" width="3" height="1" fill="currentColor" />
              <rect x="0" y="4" width="1" height="2" fill="currentColor" />
              <rect x="4" y="0" width="2" height="1" fill="currentColor" />
            </svg>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Window;
