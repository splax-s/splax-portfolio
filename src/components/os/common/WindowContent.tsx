'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface WindowContentProps {
  component: string;
}

// Dynamic imports with loading states
const components = {
  Terminal: dynamic(() => import('@/components/apps/Terminal'), {
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading Terminal...</div>
  }),
  About: dynamic(() => import('@/components/apps/About'), {
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading About...</div>
  }),
  Projects: dynamic(() => import('@/components/apps/Projects'), {
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading Projects...</div>
  }),
  Contact: dynamic(() => import('@/components/apps/Contact'), {
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading Contact...</div>
  }),
  Settings: dynamic(() => import('@/components/apps/Settings'), {
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading Settings...</div>
  })
};

const WindowContent: React.FC<WindowContentProps> = ({ component }) => {
  // Always declare all hooks at the top level
  const [mounted, setMounted] = useState(false);

  const error: string | null = null; // Placeholder for error handling
  const Component = components[component as keyof typeof components];
  
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      setMounted(true);
    }
    
    return () => {
      isMounted = false;
      setMounted(false);
    };
  }, []);

  // Render method - no early returns before this point
  const renderContent = () => {
    if (!Component) {
      return <div className="p-4">Content for {component}</div>;
    }

    if (!mounted) {
      return <div className="w-full h-full flex items-center justify-center">Loading {component}...</div>;
    }

    if (error) {
      return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;
    }

    return <Component />;
  };
  
  // Single return statement at the end
  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  );
};

export default WindowContent;
