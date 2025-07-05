"use client";

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/assets/loader.json';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Prevent scrolling when loader is active
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const timer = setTimeout(() => setIsLoading(false), 1700);
    
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'unset';
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030003] transition-opacity duration-500 overflow-hidden">
      <Lottie
        animationData={loaderAnimation}
        loop
        autoplay
        style={{ height: '160px', width: '160px' }}
      />
    </div>
  );
} 