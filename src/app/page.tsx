'use client';

import dynamic from 'next/dynamic';

// Dynamically import the OS System to avoid server-side rendering
const OSSystem = dynamic(() => import('@/components/os/OSSystem'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white text-lg">
      Booting...
    </div>
  ),
});

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <OSSystem />
    </div>
  );
}
