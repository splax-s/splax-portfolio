import { create } from 'zustand';
import { TerminalHistory, TerminalState } from '@/types/terminal';
import { commands } from '@/lib/terminal/commands';

interface TerminalStore extends TerminalState {
  executeCommand: (input: string) => void;
  clearTerminal: () => void;
  navigateHistory: (direction: 'up' | 'down') => string;
}

const processCommand = (input: string): { output: string; type: 'success' | 'error' | 'info' } => {
  const args = input.trim().split(/\s+/);
  const commandName = args[0].toLowerCase();
  const commandArgs = args.slice(1);

  // Special case for empty input
  if (!commandName) {
    return { output: '', type: 'success' };
  }

  // Special case for clear command
  if (commandName === 'clear') {
    return { output: '', type: 'success' };
  }

  // Check if command exists
  const command = commands[commandName];
  if (!command) {
    return {
      output: `Command not found: ${commandName}\nType 'help' to see available commands.`,
      type: 'error'
    };
  }

  try {
    const output = command.execute(commandArgs);
    return { output, type: 'success' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      output: `Error executing command: ${errorMessage}`,
      type: 'error'
    };
  }
};

export const useTerminalStore = create<TerminalStore>((set, get) => ({
  history: [],
  commandHistory: [],
  currentCommandIndex: -1,
  
  executeCommand: (input: string) => {
    if (!input.trim()) return;
    
    // Process the command
    const { output, type } = processCommand(input);
    
    // If it's a clear command, clear the terminal
    if (input.trim().toLowerCase() === 'clear') {
      get().clearTerminal();
      return;
    }
    
    // Add to terminal history
    set((state) => ({
      history: [...state.history, { 
        input, 
        output, 
        timestamp: Date.now(),
        type
      }],
      // Add to command history (but only if it's not the same as the last command)
      commandHistory: state.commandHistory.length > 0 && state.commandHistory[0] === input
        ? state.commandHistory
        : [input, ...state.commandHistory].slice(0, 50), // Keep last 50 commands
      currentCommandIndex: -1,
    }));
  },
  
  clearTerminal: () => set({ history: [] }),
  
  navigateHistory: (direction: 'up' | 'down') => {
    const { commandHistory, currentCommandIndex } = get();
    
    if (commandHistory.length === 0) return '';
    
    let newIndex = currentCommandIndex;
    
    if (direction === 'up') {
      // Go back in history (if not at the beginning)
      newIndex = Math.min(newIndex + 1, commandHistory.length - 1);
    } else {
      // Go forward in history (if not at the end)
      newIndex = Math.max(newIndex - 1, -1);
    }
    
    set({ currentCommandIndex: newIndex });
    
    // Return the command at the new index, or empty string if at the end
    return newIndex >= 0 ? commandHistory[newIndex] : '';
  },
}));
