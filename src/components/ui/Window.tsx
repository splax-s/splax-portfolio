import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOsStore } from '@/store/useOsStore';
import Image from 'next/image';
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
  // Declare all hooks first
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [localSize, setLocalSize] = useState(initialSize);
  const [resizeDirection, setResizeDirection] = useState<string | null>(null);
  const [startResizePosition, setStartResizePosition] = useState({ x: 0, y: 0 });
  const [startResizeSize, setStartResizeSize] = useState(initialSize);
  
  const handleClose = () => {
    // Just trigger the closing animation
    setIsClosing(true);
  };
  
  const handleResizeStart = (direction: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    setStartResizePosition({ x: e.clientX, y: e.clientY });
    
    // Ensure we start with numeric values
    const currentWidth = typeof window?.size?.width === 'number' ? window.size.width : initialSize.width;
    const currentHeight = typeof window?.size?.height === 'number' ? window.size.height : initialSize.height;
    
    setStartResizeSize({ width: currentWidth, height: currentHeight });
    setLocalSize({ width: currentWidth, height: currentHeight });
  };
  
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing || !resizeDirection) return;

    const deltaX = e.clientX - startResizePosition.x;
    const deltaY = e.clientY - startResizePosition.y;
    
    let newWidth = startResizeSize.width;
    let newHeight = startResizeSize.height;
    
    // Update size based on resize direction
    if (resizeDirection.includes('e')) {
      newWidth = Math.max(200, startResizeSize.width + deltaX);
    }
    if (resizeDirection.includes('s')) {
      newHeight = Math.max(200, startResizeSize.height + deltaY);
    }
    if (resizeDirection.includes('w')) {
      const widthDelta = -deltaX;
      newWidth = Math.max(200, startResizeSize.width + widthDelta);
      if (window?.position) {
        moveWindow(id, { 
          x: window.position.x - widthDelta, 
          y: window.position.y 
        });
      }
    }
    if (resizeDirection.includes('n')) {
      const heightDelta = -deltaY;
      newHeight = Math.max(200, startResizeSize.height + heightDelta);
      if (window?.position) {
        moveWindow(id, { 
          x: window.position.x, 
          y: window.position.y - heightDelta 
        });
      }
    }
    
    setLocalSize({ width: newWidth, height: newHeight });
  };
  
  const handleResizeEnd = () => {
    if (isResizing) {
      setIsResizing(false);
      setResizeDirection(null);
      // Update the global store with the final size
      resizeWindow(id, localSize);
    }
  };
  
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
  
  // Get properties safely with defaults
  const isFocused = window?.isFocused ?? false;
  const isMaximized = window?.isMaximized ?? false;
  const zIndex = window?.zIndex ?? 0;

  useEffect(() => {
    if (window && !window.isOpen && !isClosing) {
      setIsClosing(true);
    }
  }, [window?.isOpen, isClosing]);

  useEffect(() => {
    if (isFocused && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isResizing && typeof globalThis.window !== 'undefined') {
      globalThis.window.addEventListener('mousemove', handleResizeMove);
      globalThis.window.addEventListener('mouseup', handleResizeEnd);
    }
    return () => {
      if (typeof globalThis.window !== 'undefined') {
        globalThis.window.removeEventListener('mousemove', handleResizeMove);
        globalThis.window.removeEventListener('mouseup', handleResizeEnd);
      }
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);
  
  // Return only after all hooks are called
  if (!window || (!window.isOpen && !isClosing)) return null;

  // Calculate position in the center of the screen for new windows
  const getInitialPosition = () => {
    // Ensure we have access to window object and it's properly defined
    if (typeof globalThis.window === 'undefined') {
      return initialPosition;
    }

    const viewportWidth = globalThis.window.innerWidth || 1024;
    const viewportHeight = globalThis.window.innerHeight || 768;
    
    // Default size for the window
    const defaultWidth = typeof initialSize.width === 'number' ? initialSize.width : 600;
    const defaultHeight = typeof initialSize.height === 'number' ? initialSize.height : 400;
    
    // Center the window both horizontally and vertically
    // Ensure the window is always at least partially visible
    return {
      x: Math.min(Math.max(0, (viewportWidth - defaultWidth) / 2), viewportWidth - 100),
      y: Math.min(Math.max(0, (viewportHeight - defaultHeight) / 2), viewportHeight - 100)
    };
  };
  
  // Use stored position or calculate a centered position
  const position = window.isMaximized 
    ? { x: 0, y: 0 } 
    : window.position 
      ? {
          x: Math.min(Math.max(0, window.position.x), globalThis.window?.innerWidth - 100 || 0),
          y: Math.min(Math.max(0, window.position.y), globalThis.window?.innerHeight - 100 || 0)
        }
      : getInitialPosition();
    
  const windowSize = window.isMaximized
    ? { width: '100%', height: '100%' }
    : window.size || localSize;

  // Use local state during resize to avoid animation lag
  const displaySize = isResizing ? localSize : windowSize;
  
  const isMobile = osType === 'ios' || osType === 'android';
  
  useEffect(() => {
    if (isFocused && windowRef.current) {
      windowRef.current.focus();
    }
  }, [isFocused]);
  
  // Watch for isClosing changes
  useEffect(() => {
    if (isClosing) {
      // Wait for animation to complete
      const timer = setTimeout(() => {
        closeApp(id);
      }, 200); // Match this with your animation duration
      return () => clearTimeout(timer);
    }
  }, [isClosing, closeApp, id]);

  // Handle window controls based on OS type
  const renderWindowControls = () => {
    switch (osType) {
      case 'mac':
        return (
          <div className="flex space-x-2">
            <button
              onClick={handleClose}
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
              onClick={handleClose}
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
            onClick={handleClose}
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
            onClick={handleClose}
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
              onClick={handleClose}
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
      initial={{ 
        scale: 0.9, 
        opacity: 0,
        x: position.x,
        y: position.y
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: !isResizing ? position.x : undefined,
        y: !isResizing ? position.y : undefined,
        boxShadow: isFocused ? "0px 10px 30px rgba(0, 0, 0, 0.2)" : "0px 4px 10px rgba(0, 0, 0, 0.1)"
      }}
      style={{
        width: displaySize.width,
        height: displaySize.height,
        zIndex,
        top: isResizing ? position.y : 10,
        left: isResizing ? position.x : undefined
      }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ 
        type: "spring",
        duration: 0.2,
        bounce: 0.15,
        opacity: { duration: 0.15 },
        boxShadow: { duration: 0.3 }
      }}
      drag={!isMaximized}
      dragMomentum={false}
      dragConstraints={{ left: 0, top: 0, right: globalThis.window.innerWidth - 100, bottom: globalThis.window.innerHeight - 100 }}
      dragElastic={0.1}
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
              <Image src={icon} alt={title} className="w-4 h-4 mr-2" width={16} height={16} />
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
              
              const startSize = {
                width: typeof windowSize.width === 'number' ? windowSize.width : 600,
                height: typeof windowSize.height === 'number' ? windowSize.height : 400
              };
              setLocalSize(startSize);
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startPos.x;
                
                const newSize = {
                  width: Math.max(300, startSize.width + deltaX),
                  height: startSize.height
                };
                
                setLocalSize(newSize);
                resizeWindow(id, newSize);
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
              
              const startSize = {
                width: typeof windowSize.width === 'number' ? windowSize.width : 600,
                height: typeof windowSize.height === 'number' ? windowSize.height : 400
              };
              setLocalSize(startSize);
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaY = e.clientY - startPos.y;
                
                const newSize = {
                  width: startSize.width,
                  height: Math.max(200, startSize.height + deltaY)
                };
                
                setLocalSize(newSize);
                resizeWindow(id, newSize);
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
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize flex items-center justify-center hover:bg-blue-400/20"
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsResizing(true);
              
              const startSize = {
                width: typeof windowSize.width === 'number' ? windowSize.width : 600,
                height: typeof windowSize.height === 'number' ? windowSize.height : 400
              };
              setLocalSize(startSize);
              
              const startPos = { x: e.clientX, y: e.clientY };
              
              const onMouseMove = (e: MouseEvent) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startPos.x;
                const deltaY = e.clientY - startPos.y;
                
                const newSize = {
                  width: Math.max(300, startSize.width + deltaX),
                  height: Math.max(200, startSize.height + deltaY)
                };
                
                setLocalSize(newSize);
                resizeWindow(id, newSize);
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
