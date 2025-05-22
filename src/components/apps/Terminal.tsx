'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { useOsStore } from '@/store/useOsStore';
import { useTerminalStore } from '@/store/useTerminalStore';

import '@xterm/xterm/css/xterm.css';

const Terminal: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const [prompt, setPrompt] = useState('> ');
  const [currentInput, setCurrentInput] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const mounted = useRef(true);
  
  const { executeCommand, clearTerminal, navigateHistory } = useTerminalStore();
  const { osType } = useOsStore();
  
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (xtermRef.current) {
        try {
          xtermRef.current.dispose();
        } catch (e) {
          console.error('Error disposing terminal:', e);
        }
      }
    };
  }, []);
  
  // Initialize xterm.js
  useEffect(() => {
    if (!terminalRef.current || initialized || !mounted.current) return;
    
    const initTerminal = async () => {
      let term: XTerm | null = null;
      let fitAddon: any = null;

      try {
        // Load FitAddon dynamically
        const { FitAddon } = await import('@xterm/addon-fit');
        
        if (!mounted.current) return;
        
        fitAddon = new FitAddon();
        term = new XTerm({
          cursorBlink: true,
          fontFamily: osType === 'mac' || osType === 'ios'
            ? 'Menlo, Monaco, Courier New, monospace'
            : 'Consolas, Courier New, monospace',
          theme: {
            background: osType === 'mac' || osType === 'ios'
              ? '#1e1e1e'
              : osType === 'windows'
                ? '#0c0c0c'
                : '#121212',
            foreground: '#f0f0f0',
            cursor: '#f0f0f0',
          },
          convertEol: true,
          rows: 24,
          cols: 80,
        });
        
        term.loadAddon(fitAddon);
        
        if (!terminalRef.current || !mounted.current) {
          term.dispose();
          return;
        }

        term.open(terminalRef.current);

        // Wait a frame for the terminal to be properly mounted
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        if (!mounted.current) {
          term.dispose();
          return;
        }

        try {
          fitAddon.fit();
          xtermRef.current = term;
          
          const handleResize = () => {
            if (!term) return;
            try {
              fitAddon.fit();
            } catch (e) {
              console.error('Failed to fit terminal on resize:', e);
            }
          };
          
          window.addEventListener('resize', handleResize);
          
          const welcomeMessage = getWelcomeMessage(osType);
          term.writeln(welcomeMessage);
          term.writeln('');
          term.write(prompt);
          
          term.onKey(({ key, domEvent }) => {
            const ev = domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            
            if (!term) return;
            
            if (ev.keyCode === 13) { // Enter
              processCommand(currentInput);
              setCurrentInput('');
              setCursorPosition(0);
            } else if (ev.keyCode === 8) { // Backspace
              if (currentInput.length > 0 && cursorPosition > 0) {
                term.write('\b \b');
                const newInput = 
                  currentInput.substring(0, cursorPosition - 1) + 
                  currentInput.substring(cursorPosition);
                if (term.buffer.active.cursorX) {
                  term.write(newInput.substring(cursorPosition - 1) + ' ');
                  term.write('\x1b[' + (newInput.length - cursorPosition + 2) + 'D');
                }
                setCurrentInput(newInput);
                setCursorPosition(cursorPosition - 1);
              }
            } else if (ev.keyCode === 37) { // Left arrow
              if (cursorPosition > 0) {
                term.write('\x1b[D');
                setCursorPosition(cursorPosition - 1);
              }
            } else if (ev.keyCode === 39) { // Right arrow
              if (cursorPosition < currentInput.length) {
                term.write('\x1b[C');
                setCursorPosition(cursorPosition + 1);
              }
            } else if (ev.keyCode === 38) { // Up arrow
              const prevCommand = navigateHistory('up');
              term.write('\x1b[2K\r');
              term.write(prompt);
              term.write(prevCommand);
              setCurrentInput(prevCommand);
              setCursorPosition(prevCommand.length);
            } else if (ev.keyCode === 40) { // Down arrow
              const nextCommand = navigateHistory('down');
              term.write('\x1b[2K\r');
              term.write(prompt);
              term.write(nextCommand);
              setCurrentInput(nextCommand);
              setCursorPosition(nextCommand.length);
            } else if (printable) {
              if (cursorPosition < currentInput.length) {
                // Insert at cursor position
                const newInput = 
                  currentInput.substring(0, cursorPosition) + 
                  key +
                  currentInput.substring(cursorPosition);
                term.write(key);
                term.write(currentInput.substring(cursorPosition));
                term.write('\x1b[' + (currentInput.length - cursorPosition) + 'D');
                setCurrentInput(newInput);
                setCursorPosition(cursorPosition + 1);
              } else {
                // Append to the end
                term.write(key);
                setCurrentInput(currentInput + key);
                setCursorPosition(cursorPosition + 1);
              }
            }
          });
          
          setInitialized(true);
        } catch (e) {
          console.error('Failed to initialize terminal:', e);
          if (mounted.current) {
            const event = new Event('terminalError');
            window.dispatchEvent(event);
          }
        }
      } catch (error) {
        console.error('Error initializing terminal:', error);
        if (mounted.current) {
          const event = new Event('terminalError');
          window.dispatchEvent(event);
        }
        if (term) {
          try {
            term.dispose();
          } catch (e) {
            console.error('Error disposing terminal:', e);
          }
        }
      }
    };
    
    initTerminal();
  }, [osType, initialized]);
  
  // Auto focus terminal when it's rendered
  useEffect(() => {
    if (xtermRef.current) {
      xtermRef.current.focus();
    }
  }, [initialized]);
  
  // Process user command
  const processCommand = (input: string) => {
    if (!xtermRef.current) return;
    
    const term = xtermRef.current;
    
    // Add newline
    term.writeln('');
    
    if (input.trim().toLowerCase() === 'clear') {
      // Handle clear command
      clearTerminal();
      term.clear();
    } else {
      // Execute command and get output
      executeCommand(input);
      
      // Get the output from the store
      const { history } = useTerminalStore.getState();
      const lastCommand = history[history.length - 1];
      
      if (lastCommand && lastCommand.input === input) {
        // Write command output with typewriter effect
        const output = lastCommand.output;
        typeOutput(term, output);
      }
    }
    
    // Write new prompt
    term.writeln('');
    term.write(prompt);
  };
  
  // Function to type output with a slight delay for effect
  const typeOutput = (term: XTerm, output: string) => {
    const lines = output.split('\n');
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        term.writeln(line);
      }, index * 15); // 15ms delay between lines
    });
  };
  
  // Get welcome message based on OS
  const getWelcomeMessage = (osType: string): string => {
    switch (osType) {
      case 'mac':
        return `
╭───────────────────────────────────────────╮
│                                           │
│    Welcome to Terminal                    │
│                                           │
│    Type 'help' to see available commands  │
│                                           │
╰───────────────────────────────────────────╯
`;
      case 'windows':
        return `
Microsoft Windows [Version 10.0.19044.1826]
(c) Microsoft Corporation. All rights reserved.

Type 'help' to see available commands.
`;
      case 'ios':
      case 'android':
        return `
┌──────────────────────────────────────┐
│                                      │
│  Mobile Terminal                     │
│                                      │
│  Type 'help' to see available        │
│  commands                            │
│                                      │
└──────────────────────────────────────┘
`;
      default:
        return `Welcome to Terminal. Type 'help' to see available commands.`;
    }
  };
  
  // If there's an issue with xterm, fall back to the simple terminal
  if (!initialized) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        <p>Loading terminal...</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full bg-black">
      <div ref={terminalRef} className="w-full h-full" />
    </div>
  );
};

export default Terminal;
