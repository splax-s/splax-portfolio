'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/terminal/data';
import { useOsStore } from '@/store/useOsStore';

const Projects: React.FC = () => {
  const { osType } = useOsStore();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const closeDetails = () => setSelectedProject(null);

  const getOsSpecificStyles = () => {
    switch (osType) {
      case 'mac':
        return 'bg-white dark:bg-gray-900 rounded-md';
      case 'windows':
        return 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700';
      case 'ios':
        return 'bg-white dark:bg-gray-900 rounded-xl';
      case 'android':
        return 'bg-white dark:bg-gray-900 rounded-lg shadow';
      default:
        return 'bg-white dark:bg-gray-900';
    }
  };

  return (
    <div className="h-full overflow-auto p-4 md:p-6 bg-white dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6 10H6v-2h8v2zm4-4H6v-2h12v2z"/>
        </svg>
        My Projects
      </h1>
      
      <AnimatePresence mode="wait">
        {selectedProject !== null ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`${getOsSpecificStyles()} p-5 relative`}
          >
            <button 
              onClick={closeDetails} 
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <div className="h-48 -mx-5 -mt-5 mb-5 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-white">{projects[selectedProject].name}</h2>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {projects[selectedProject].description}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {projects[selectedProject].technologies.map(tech => (
                  <span 
                    key={tech} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <a 
              href={projects[selectedProject].githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.88 14.76c-3.11-.55-5.56-3-6.11-6.11l2.03-.41c.41 2.18 2.11 3.88 4.28 4.28l-.2 2.24zm1.7-3.41l4.27-4.27-1.42-1.41-2.85 2.85-.7-.7-1.42 1.41 2.12 2.12zm4.26-7.59c2.17.4 3.88 2.11 4.28 4.28l2.03-.41c-.54-3.11-3-5.55-6.11-6.11l-.2 2.24z"/>
              </svg>
              View Project on GitHub
            </a>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                className={`${getOsSpecificStyles()} overflow-hidden hover:shadow-lg transition-all cursor-pointer`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProject(index)}
              >
                <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center p-4">
                  <h2 className="text-xl font-bold text-white text-center">{project.name}</h2>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span 
                        key={tech} 
                        className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
