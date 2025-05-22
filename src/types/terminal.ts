export interface TerminalCommand {
  command: string;
  description: string;
  execute: (args?: string[]) => string;
}

export interface TerminalHistory {
  input: string;
  output: string;
  timestamp: number;
  type?: 'success' | 'error' | 'info' | 'command';
}

export interface TerminalState {
  history: TerminalHistory[];
  commandHistory: string[];
  currentCommandIndex: number;
}

export interface Bio {
  name: string;
  title: string;
  description: string;
  location: string;
  status: string;
}

export interface Skill {
  category: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  demo: string;
}

export interface Contact {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface Fact {
  category: string;
  items: string[];
}
