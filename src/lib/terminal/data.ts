import { Bio, Contact, Project, Skill } from '@/types/terminal';

export const bio: Bio = {
  name: 'John Doe',
  title: 'Full Stack Developer',
  description: 'I\'m a passionate developer with expertise in building modern web applications. I specialize in React, Next.js, and TypeScript. I enjoy creating performant, beautiful, and accessible user interfaces.'
};

export const skills: Skill[] = [
  { name: 'React', category: 'Frontend' },
  { name: 'Next.js', category: 'Frontend' },
  { name: 'TypeScript', category: 'Frontend' },
  { name: 'JavaScript', category: 'Frontend' },
  { name: 'Tailwind CSS', category: 'Frontend' },
  { name: 'Framer Motion', category: 'Frontend' },
  { name: 'HTML/CSS', category: 'Frontend' },
  
  { name: 'Node.js', category: 'Backend' },
  { name: 'Express', category: 'Backend' },
  { name: 'MongoDB', category: 'Backend' },
  { name: 'PostgreSQL', category: 'Backend' },
  { name: 'GraphQL', category: 'Backend' },
  
  { name: 'AWS', category: 'Cloud' },
  { name: 'Vercel', category: 'Cloud' },
  { name: 'Docker', category: 'Cloud' },
  { name: 'CI/CD', category: 'Cloud' },
  
  { name: 'HTTP/HTTPS', category: 'Network' },
  { name: 'REST APIs', category: 'Network' },
  { name: 'WebSockets', category: 'Network' },
];

export const projects: Project[] = [
  {
    name: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with advanced product filtering, cart functionality, and payment integration.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL'],
    githubUrl: 'https://github.com/johndoe/ecommerce-platform'
  },
  {
    name: 'Task Management App',
    description: 'A Kanban-style task management application with drag-and-drop functionality, real-time updates, and team collaboration features.',
    technologies: ['React', 'Redux', 'Node.js', 'Socket.io', 'MongoDB'],
    githubUrl: 'https://github.com/johndoe/task-management'
  },
  {
    name: 'Personal Blog',
    description: 'A statically generated blog with markdown support, code syntax highlighting, and search functionality.',
    technologies: ['Next.js', 'MDX', 'Tailwind CSS', 'Vercel'],
    githubUrl: 'https://github.com/johndoe/personal-blog'
  },
  {
    name: 'Weather Dashboard',
    description: 'An interactive weather dashboard that displays current conditions and forecasts for multiple locations with beautiful visualizations.',
    technologies: ['React', 'D3.js', 'OpenWeather API', 'Geolocation API'],
    githubUrl: 'https://github.com/johndoe/weather-dashboard'
  }
];

export const contact: Contact = {
  email: 'john.doe@example.com',
  linkedin: 'https://linkedin.com/in/johndoe'
};
