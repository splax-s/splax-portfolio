'use client';

import React, { useEffect, useRef } from 'react';
import { useOsStore } from '@/store/useOsStore';
import { useTerminalStore } from '@/store/useTerminalStore';
import { commands } from '@/lib/terminal/commands';

const TerminalSimple: React.FC = () => {
  const { osType } = useOsStore();
  const { history, executeCommand } = useTerminalStore();
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Auto-focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputRef.current && inputRef.current.value.trim()) {
      const command = inputRef.current.value;
      executeCommand(command);
      inputRef.current.value = '';
    }
  };
  
  const getOsClass = () => {
    switch(osType) {
      case 'mac':
        return 'bg-gray-900 text-green-400 font-mono';
      case 'windows':
        return 'bg-black text-white font-mono';
      case 'ios':
        return 'bg-black text-white font-mono';
      case 'android':
        return 'bg-gray-900 text-green-300 font-mono';
      default:
        return 'bg-black text-green-400 font-mono';
    }
  };
  
  return (
    <div className={`h-full flex flex-col ${getOsClass()} p-2 overflow-auto`}>
      <div className="flex-1 overflow-auto pb-4" ref={terminalRef}>
        <div className="mb-4">
          <pre className="text-yellow-400">
{`
 _______                   _             _   ____   _____ 
|__   __|                 (_)           | | / __ \\ / ____|
   | | ___ _ __ _ __ ___   _ _ __   __ _| || |  | | (___  
   | |/ _ \\ '__| '_ \` _ \\ | | '_ \\ / _\` | || |  | |\\___ \\ 
   | |  __/ |  | | | | | || | | | | (_| | || |__| |____) |
   |_|\\___|_|  |_| |_| |_||_|_| |_|\\__,_|_(_)____/|_____/ 
                                                          
`}
          </pre>
          <p className="mb-2">Welcome to Terminal. Type 'help' to see available commands.</p>
        </div>
        
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="flex">
              <span className="text-blue-400 mr-2">&gt;</span>
              <span>{item.input}</span>
            </div>
            <div className="whitespace-pre-wrap pl-4">
              {item.output}
            </div>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="flex items-center border-t border-gray-700 pt-2">
        <span className="text-blue-400 mr-2">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none"
          autoComplete="off"
          spellCheck="false"
        />
      </form>
    </div>
  );
};

export default TerminalSimple;
