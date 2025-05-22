import { Bio, Skill, Project, Contact, Fact } from '@/types/terminal';

export const bio: Bio = {
  name: 'Splax',
  title: 'Full Stack Developer & DevOps Engineer',
  description: 'Passionate about creating intuitive and performant web applications. Experienced in modern web technologies and cloud infrastructure.',
  location: 'Based in Germany',
  status: 'Open to opportunities',
};

export const facts: Fact[] = [
  {
    category: 'coding',
    items: [
      'Started coding at the age of 16',
      'Built my first website in 2015',
      'Contributed to over 50 open source projects',
      'Love experimenting with new technologies',
    ],
  },
  {
    category: 'interests',
    items: [
      'Avid mechanical keyboard enthusiast',
      'Enjoy solving complex architectural challenges',
      'Passionate about developer experience',
      'Always learning new programming languages',
    ],
  },
  {
    category: 'achievements',
    items: [
      'Led development of enterprise-scale applications',
      'Created popular open source tools',
      'Speaker at tech conferences',
      'Published technical articles and tutorials',
    ],
  },
];

export const skills: Skill[] = [
  { category: 'Frontend', name: 'React/Next.js', level: 'Expert' },
  { category: 'Frontend', name: 'TypeScript', level: 'Expert' },
  { category: 'Frontend', name: 'Tailwind CSS', level: 'Expert' },
  { category: 'Backend', name: 'Node.js', level: 'Expert' },
  { category: 'Backend', name: 'Python', level: 'Advanced' },
  { category: 'Backend', name: 'PostgreSQL', level: 'Advanced' },
  { category: 'Cloud', name: 'AWS', level: 'Advanced' },
  { category: 'Cloud', name: 'Docker', level: 'Expert' },
  { category: 'DevOps', name: 'CI/CD', level: 'Expert' },
];

export const projects: Project[] = [
  {
    name: 'Portfolio OS',
    description: 'An operating system simulation built with React and TypeScript',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/splax/portfolio',
    demo: 'https://splax.dev',
  },
  // Add more projects here
];

export const funFacts: string[] = [
  'I can type at 120 WPM',
  'I use Neovim as my primary editor',
  'I have contributed to the React core',
  'I built my first computer at age 14',
  'I love automating everything',
];

export const quotes: string[] = [
  'The best code is no code at all',
  'Make it work, make it right, make it fast',
  'Simplicity is the ultimate sophistication',
];

export const contact: Contact = {
  email: 'contact@splax.dev',
  github: 'github.com/splax',
  linkedin: 'linkedin.com/in/splax',
  twitter: '@splax',
};
