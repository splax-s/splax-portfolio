export interface TerminalCommand {
  command: string;
  description: string;
  execute: () => string;
}

export interface TerminalHistory {
  input: string;
  output: string;
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
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Network' | 'Cloud' | 'Other';
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
}

export interface Contact {
  email: string;
  linkedin: string;
}
