import { TerminalCommand } from '@/types/terminal';
import { bio, skills, projects, contact } from '@/lib/terminal/data';

export const commands: Record<string, TerminalCommand> = {
  whoami: {
    command: 'whoami',
    description: 'Display user information',
    execute: () => {
      return `
Name: ${bio.name}
Title: ${bio.title}

${bio.description}
`;
    },
  },
  
  skills: {
    command: 'skills',
    description: 'List my technical skills by category',
    execute: () => {
      const categories = ['Frontend', 'Backend', 'Network', 'Cloud'];
      let output = '';
      
      categories.forEach(category => {
        const categorySkills = skills.filter(skill => skill.category === category);
        output += `\n${category}:\n`;
        output += categorySkills.map(skill => `  - ${skill.name}`).join('\n');
        output += '\n';
      });
      
      return output;
    },
  },
  
  projects: {
    command: 'projects',
    description: 'Show my projects',
    execute: () => {
      return projects.map(project => `
Project: ${project.name}
Description: ${project.description}
Technologies: ${project.technologies.join(', ')}
GitHub: ${project.githubUrl}
`).join('\n');
    },
  },
  
  contact: {
    command: 'contact',
    description: 'Show contact information',
    execute: () => {
      return `
Email: ${contact.email}
LinkedIn: ${contact.linkedin}
`;
    },
  },
  
  clear: {
    command: 'clear',
    description: 'Clear the terminal screen',
    execute: () => {
      // This command doesn't return any output
      // The terminal component will handle clearing itself
      return '';
    },
  },
  
  help: {
    command: 'help',
    description: 'List available commands',
    execute: () => {
      let output = 'Available commands:\n\n';
      
      Object.values(commands).forEach(cmd => {
        output += `${cmd.command.padEnd(12)} - ${cmd.description}\n`;
      });
      
      return output;
    },
  },
};

export const processCommand = (input: string): string => {
  const trimmedInput = input.trim().toLowerCase();
  
  if (!trimmedInput) {
    return '';
  }
  
  const command = commands[trimmedInput];
  
  if (command) {
    return command.execute();
  } else {
    return `Command not found: ${trimmedInput}. Type 'help' to see available commands.`;
  }
};
