'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useOsStore } from '@/store/useOsStore';
import { useTerminalStore } from '@/store/useTerminalStore';
import { commands } from '@/lib/terminal/commands';
import MatrixRain from './MatrixRain';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [focused, setFocused] = useState(false);
  const [fontSize, setFontSize] = useState(14); // Dynamic font size
  const [opacity, setOpacity] = useState(1); // For fade effects
  const [theme, setTheme] = useState<'dark' | 'matrix' | 'retro' | 'synthwave'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('terminal-theme');
      return (savedTheme as 'dark' | 'matrix' | 'retro' | 'synthwave') || 'dark';
    }
    return 'dark';
  });
  const [isTyping, setIsTyping] = useState(false);
  const [autoCompleteHint, setAutoCompleteHint] = useState('');
  
  const { executeCommand, clearTerminal, navigateHistory, history } = useTerminalStore();
  const { osType } = useOsStore();
  
  // Get prompt based on OS type
  const getPrompt = () => {
    const user = 'splax';
    const machine = osType.toLowerCase();
    const path = '~';
    return osType === 'windows' 
      ? 'C:\\>' 
      : `${user}@${machine} ${path} $`;
  };

  // Dynamic font size based on terminal width
  useEffect(() => {
    const handleResize = () => {
      if (terminalRef.current) {
        const width = terminalRef.current.offsetWidth;
        const newSize = Math.max(12, Math.min(16, width / 50));
        setFontSize(newSize);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme cycling with Cmd/Ctrl + T
  useEffect(() => {
    const handleThemeChange = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setTheme(current => {
          const nextTheme = current === 'dark' ? 'matrix' :
                          current === 'matrix' ? 'retro' :
                          current === 'retro' ? 'synthwave' : 'dark';
          // Store theme in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('terminal-theme', nextTheme);
          }
          return nextTheme;
        });
        // Add fade effect
        setOpacity(0);
        setTimeout(() => setOpacity(1), 150);
      }
    };

    window.addEventListener('keydown', handleThemeChange);
    return () => window.removeEventListener('keydown', handleThemeChange);
  }, []);

  // Auto-completion hint system
  useEffect(() => {
    if (currentInput.trim()) {
      const [command] = currentInput.trim().split(/\s+/);
      const matchingCommands = Object.keys(commands).filter(
        cmd => cmd.startsWith(command.toLowerCase())
      );
      
      if (matchingCommands.length === 1 && matchingCommands[0] !== command) {
        setAutoCompleteHint(matchingCommands[0].slice(command.length));
      } else {
        setAutoCompleteHint('');
      }
    } else {
      setAutoCompleteHint('');
    }
  }, [currentInput]);

  // Focus management
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (terminalRef.current?.contains(e.target as Node)) {
        setFocused(true);
      } else {
        setFocused(false);
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  
  // Scroll to bottom after command execution
  useEffect(() => {
    if (terminalRef.current) {
      const scrollToBottom = () => {
        terminalRef.current?.scrollTo({
          top: terminalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      };
      
      scrollToBottom();
      // Also scroll after any potential delayed output
      const timer = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(timer);
    }
  }, [history, currentInput]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem('terminal-theme', theme);
  }, [theme]);

  // Keyboard input handling
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!focused) return;
    
    // Handle Cmd/Ctrl + Key combinations
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'l': // Clear screen
          e.preventDefault();
          clearTerminal();
          return;
        case 'k': // Clear current line
          e.preventDefault();
          setCurrentInput('');
          setCursorPosition(0);
          return;
        case 'u': // Clear to start of line
          e.preventDefault();
          setCurrentInput(prev => prev.slice(cursorPosition));
          setCursorPosition(0);
          return;
        case 'w': // Delete word backwards
          e.preventDefault();
          const lastSpaceIndex = currentInput.slice(0, cursorPosition).lastIndexOf(' ');
          setCurrentInput(prev => 
            prev.slice(0, lastSpaceIndex + 1) + prev.slice(cursorPosition)
          );
          setCursorPosition(lastSpaceIndex + 1);
          return;
        case 'a': // Move to start of line
          e.preventDefault();
          setCursorPosition(0);
          return;
        case 'e': // Move to end of line
          e.preventDefault();
          setCursorPosition(currentInput.length);
          return;
        case 'l': // Change theme
          e.preventDefault();
          setTheme(current => {
            switch (current) {
              case 'dark': return 'matrix';
              case 'matrix': return 'retro';
              case 'retro': return 'synthwave';
              default: return 'dark';
            }
          });
          setOpacity(0);
          setTimeout(() => setOpacity(1), 150);
          return;
        case 'c': // Copy selected text or signal interrupt
          if (window.getSelection()?.toString()) {
            return; // Let browser handle copy
          }
          e.preventDefault();
          setCurrentInput('');
          setCursorPosition(0);
          executeCommand('^C');
          return;
        case 'v': // Paste text
          return; // Let browser handle paste
      }
      return;
    }

    // Handle Alt/Option + Key combinations
    if (e.altKey) {
      switch (e.key) {
        case 'b': // Move back one word
          e.preventDefault();
          const prevSpaceIndex = currentInput.slice(0, cursorPosition).lastIndexOf(' ');
          setCursorPosition(prevSpaceIndex === -1 ? 0 : prevSpaceIndex);
          return;
        case 'f': // Move forward one word
          e.preventDefault();
          const nextSpaceIndex = currentInput.indexOf(' ', cursorPosition);
          setCursorPosition(nextSpaceIndex === -1 ? currentInput.length : nextSpaceIndex + 1);
          return;
        case 'Backspace': // Delete word backwards
          e.preventDefault();
          const lastWordIndex = currentInput.slice(0, cursorPosition).lastIndexOf(' ');
          setCurrentInput(prev => 
            prev.slice(0, lastWordIndex + 1) + prev.slice(cursorPosition)
          );
          setCursorPosition(lastWordIndex + 1);
          return;
      }
    }

    e.preventDefault();
    
    switch (e.key) {
      case 'Enter':
        if (currentInput.trim()) {
          executeCommand(currentInput);
          setCurrentInput('');
          setCursorPosition(0);
        }
        break;
        
      case 'Tab':
        e.preventDefault();
        if (autoCompleteHint) {
          setCurrentInput(prev => prev + autoCompleteHint);
          setCursorPosition(prev => prev + autoCompleteHint.length);
        }
        break;
        
      case 'Backspace':
        if (cursorPosition > 0) {
          setCurrentInput(prev => 
            prev.slice(0, cursorPosition - 1) + prev.slice(cursorPosition)
          );
          setCursorPosition(prev => prev - 1);
        }
        break;
        
      case 'Delete':
        if (cursorPosition < currentInput.length) {
          setCurrentInput(prev =>
            prev.slice(0, cursorPosition) + prev.slice(cursorPosition + 1)
          );
        }
        break;
        
      case 'Home':
        setCursorPosition(0);
        break;
        
      case 'End':
        setCursorPosition(currentInput.length);
        break;

      case 'ArrowLeft':
        if (cursorPosition > 0) {
          setCursorPosition(prev => prev - 1);
        }
        break;
        
      case 'ArrowRight':
        if (cursorPosition < currentInput.length) {
          setCursorPosition(prev => prev + 1);
        }
        break;
        
      case 'ArrowUp':
        {
          const prevCommand = navigateHistory('up');
          setCurrentInput(prevCommand);
          setCursorPosition(prevCommand.length);
        }
        break;
        
      case 'ArrowDown':
        {
          const nextCommand = navigateHistory('down');
          setCurrentInput(nextCommand);
          setCursorPosition(nextCommand.length);
        }
        break;
        
      default:
        // Only handle printable characters
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          setCurrentInput(prev => 
            prev.slice(0, cursorPosition) + e.key + prev.slice(cursorPosition)
          );
          setCursorPosition(prev => prev + 1);
        }
    }
  }, [focused, currentInput, cursorPosition, executeCommand, navigateHistory, autoCompleteHint, clearTerminal]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focused, currentInput, cursorPosition, executeCommand, navigateHistory, autoCompleteHint, handleKeyDown]);

  // Handle command output typing effect
  useEffect(() => {
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setIsTyping(false);
      }, Math.min(lastEntry.output.length * 10, 1000)); // Cap at 1 second
      
      return () => clearTimeout(timeout);
    }
  }, [history]);
  
  const getThemeStyles = () => {
    switch (theme) {
      case 'matrix':
        return {
          background: 'bg-black',
          text: 'text-green-400',
          prompt: 'text-green-600',
          output: 'text-green-300/70',
          cursor: 'bg-green-500/50',
          shadow: 'shadow-lg shadow-green-900/20',
        };
      case 'retro':
        return {
          background: 'bg-amber-950',
          text: 'text-amber-200',
          prompt: 'text-amber-400',
          output: 'text-amber-200/70',
          cursor: 'bg-amber-400/50',
          shadow: 'shadow-lg shadow-amber-900/20',
        };
      case 'synthwave':
        return {
          background: 'bg-gray-900',
          text: 'text-pink-400',
          prompt: 'text-blue-500',
          output: 'text-violet-300',
          cursor: 'bg-pink-500/50',
          shadow: 'shadow-lg shadow-purple-900/20',
        };
      default:
        return {
          background: 'bg-gray-900',
          text: 'text-gray-100',
          prompt: 'text-blue-400',
          output: 'text-gray-300/70',
          cursor: 'bg-white/50',
          shadow: 'shadow-lg shadow-black/20',
        };
    };
  };

  const styles = getThemeStyles();
  
  return (
    <div 
      ref={terminalRef}
      className={`w-full h-full ${styles.background} font-mono overflow-auto transition-all duration-300
                  ${focused ? 'ring-1 ring-white/20' : ''} ${styles.shadow}`}
      style={{ 
        fontSize: `${fontSize}px`,
        opacity,
        transition: 'background-color 0.3s, opacity 0.15s'
      }}
      tabIndex={0}
      onClick={() => setFocused(true)}
    >
      <div className="p-4 min-h-full">
        {/* Matrix effect */}
        {theme === 'matrix' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            <MatrixRain />
          </div>
        )}

        {/* Welcome Message */}
        <div className={`mb-4 ${styles.text} font-bold`}>
          {osType === 'mac' ? '📍' : '>'} Welcome to Splax&apos;s Interactive Terminal
          <div className={`mt-1 ${styles.output} font-normal text-sm`}>
            Type &apos;help&apos;p for commands • Cmd/Ctrl+T to change theme • Cmd/Ctrl+L to clear
          </div>
        </div>
        
        {/* Command History */}
        <div className="space-y-2">
          {history.map((entry, i) => (
            <div key={i} className="group">
              <div className="flex items-center">
                <span className={styles.prompt}>{getPrompt()}</span>
                <span className={`ml-2 ${styles.text}`}>{entry.input}</span>
              </div>
              <div className={`whitespace-pre-wrap pl-4 ${styles.output} group-hover:opacity-100 transition-opacity 
                            ${entry.type === 'error' ? 'text-red-400' : ''}`}>
                {entry.output}
              </div>
            </div>
          ))}
        </div>
        
        {/* Current Input Line */}
        <div className="flex items-center mt-2">
          <span className={styles.prompt}>{getPrompt()}</span>
          <div className="relative ml-2 flex-1">
            <span className={styles.text}>
              {currentInput}
              {autoCompleteHint && (
                <span className="opacity-30">{autoCompleteHint}</span>
              )}
            </span>
            <span 
              className={`absolute top-0 -left-[0.1em] w-[0.6em] h-full transition-all
                        ${styles.cursor} ${focused ? 'opacity-100' : 'opacity-0'}
                        ${isTyping ? 'animate-pulse' : ''}`}
              style={{ transform: `translateX(${cursorPosition}ch)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
