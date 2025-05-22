import { TerminalCommand } from '@/types/terminal';
import { bio, skills, projects, contact, facts, funFacts, quotes } from '@/lib/terminal/data';

const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const formatAsTable = (headers: string[], rows: string[][]): string => {
  const colWidths = headers.map((h, i) => 
    Math.max(h.length, ...rows.map(r => r[i]?.length || 0))
  );
  
  const separator = colWidths.map(w => '─'.repeat(w)).join('─┬─');
  const formatRow = (cells: string[]) => 
    cells.map((cell, i) => cell.padEnd(colWidths[i])).join(' │ ');

  return [
    formatRow(headers),
    `${'─'.repeat(separator.length)}`,
    ...rows.map(formatRow)
  ].join('\n');
};

const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export const commands: Record<string, TerminalCommand> = {
  help: {
    command: 'help',
    description: 'Show available commands',
    execute: (args?: string[]) => {
      if (args && args.length > 0) {
        const cmd = commands[args[0].toLowerCase()];
        if (cmd) {
          return `Command: ${cmd.command}\nDescription: ${cmd.description}`;
        }
        return `Command not found: ${args[0]}. Type 'help' to see all commands.`;
      }
      
      const categories = {
        'System Commands': ['clear', 'help', 'banner', 'theme', 'time', 'weather'],
        'Information': ['about', 'whoami', 'skills', 'projects', 'contact'],
        'Fun Stuff': ['quote', 'fact', 'funfact', 'ascii-art', 'fortune'],
      };

      return Object.entries(categories)
        .map(([category, cmds]) => {
          const cmdList = cmds
            .map(cmd => commands[cmd])
            .filter(Boolean)
            .map(cmd => `  ${cmd.command.padEnd(15)} - ${cmd.description}`)
            .join('\n');
          
          return `${category}:\n${cmdList}`;
        })
        .join('\n\n');
    },
  },

  whoami: {
    command: 'whoami',
    description: 'Display information about me',
    execute: () => {
      return `
┌────────────────────────────────────┐
│ ${getTimeBasedGreeting()}!                     │
├────────────────────────────────────┤
│ ${bio.name.padEnd(34)} │
│ ${bio.title.padEnd(34)} │
├────────────────────────────────────┤
│ ${bio.location.padEnd(34)} │
│ ${bio.status.padEnd(34)} │
└────────────────────────────────────┘

${bio.description}
`;
    },
  },

  skills: {
    command: 'skills',
    description: 'List my technical skills',
    execute: () => {
      const grouped = skills.reduce((acc, skill) => {
        acc[skill.category] = acc[skill.category] || [];
        acc[skill.category].push(skill);
        return acc;
      }, {} as Record<string, typeof skills>);

      return Object.entries(grouped)
        .map(([category, skills]) => {
          const table = formatAsTable(
            ['Skill', 'Level'],
            skills.map(s => [s.name, s.level])
          );
          return `${category}:\n${table}`;
        })
        .join('\n\n');
    },
  },

  projects: {
    command: 'projects',
    description: 'Show my projects',
    execute: () => {
      return projects.map((project, i) => `
${i + 1}. ${project.name}
   ${project.description}
   Tech: ${project.technologies.join(', ')}
   Links: [GitHub](${project.githubUrl}) | [Demo](${project.demo})
`).join('\n');
    },
  },

  contact: {
    command: 'contact',
    description: 'Display contact information',
    execute: () => {
      return `
┌─ Contact Information ─────────────┐
│                                   │
│  📧 Email    : ${contact.email.padEnd(17)} │
│  🐙 GitHub   : ${contact.github.padEnd(17)} │
│  💼 LinkedIn : ${contact.linkedin.padEnd(17)} │
│  🐦 Twitter  : ${contact.twitter.padEnd(17)} │
│                                   │
└───────────────────────────────────┘
`;
    },
  },

  clear: {
    command: 'clear',
    description: 'Clear the terminal screen',
    execute: () => '',
  },

  theme: {
    command: 'theme',
    description: 'Change terminal theme (dark|matrix|retro|synthwave)',
    execute: (args?: string[]) => {
      if (!args || args.length === 0) {
        return 'Usage: theme <name>\nAvailable themes: dark, matrix, retro, synthwave';
      }
      // Theme change is handled by the Terminal component
      return `Theme will be changed to ${args[0]}...`;
    },
  },

  time: {
    command: 'time',
    description: 'Display current time and date',
    execute: () => {
      const now = new Date();
      return `
┌─ System Time ───────────────────┐
│                                 │
│  🕐 ${now.toLocaleTimeString().padEnd(25)} │
│  📅 ${now.toLocaleDateString().padEnd(25)} │
│                                 │
└─────────────────────────────────┘
`;
    },
  },

  weather: {
    command: 'weather',
    description: 'Show current weather (demo)',
    execute: () => {
      const conditions = ['☀️ Sunny', '🌤 Partly Cloudy', '🌧 Rainy', '⛈ Stormy'];
      const temps = ['18°C', '22°C', '25°C', '28°C'];
      return `
┌─ Current Weather ─────────────┐
│                              │
│  ${getRandomItem(conditions).padEnd(28)} │
│  Temperature: ${getRandomItem(temps).padEnd(16)} │
│                              │
└──────────────────────────────┘
`;
    },
  },

  quote: {
    command: 'quote',
    description: 'Show a random inspirational quote',
    execute: () => {
      const quote = getRandomItem(quotes);
      return `"${quote}"`;
    },
  },

  fact: {
    command: 'fact',
    description: 'Show a random fact',
    execute: () => {
      return `Did you know? ${getRandomItem(facts)}`;
    },
  },

  funfact: {
    command: 'funfact',
    description: 'Show a random fun fact about me',
    execute: () => {
      return `Fun fact: ${getRandomItem(funFacts)}`;
    },
  },

  'ascii-art': {
    command: 'ascii-art',
    description: 'Display some ASCII art',
    execute: () => {
      const arts = [
`    __________________
   /\\  ______________ \\
  /::\\ \\TERMINAL v1.0/ \\
 /::::\\ \\__________/   \\
/:::::::\\    Help!     \\
\\:::::::/    Type:      \\
 \\:::::/   "help"       /
  \\:::/________________/
   \\/________________/
        Art by splax
`,
`   /\\_/\\  
  ( o.o ) 
   > ^ <
   Meow!
`,
      ];
      return getRandomItem(arts);
    },
  },

  fortune: {
    command: 'fortune',
    description: 'Get your terminal fortune',
    execute: () => {
      const fortunes = [
        "You will commit great code today! 🎯",
        "A mysterious bug will soon reveal itself 🐛",
        "Your next pull request will be approved ✨",
        "Remember to git push your luck 🍀",
        "Your code will bring joy to many users 🌟",
      ];
      return `
🔮 Your Fortune:
${getRandomItem(fortunes)}`;
    },
  },

  banner: {
    command: 'banner',
    description: 'Display the welcome banner',
    execute: () => `
╔════════════════════════════════════════════╗
║                                            ║
║  ${getTimeBasedGreeting()}!                          ║
║  Welcome to Splax's Interactive Terminal   ║
║                                            ║
║  Type 'help' to see available commands     ║
║  Try 'ascii-art' or 'fortune' for fun!     ║
║                                            ║
╚════════════════════════════════════════════╝
`,
  },
};
