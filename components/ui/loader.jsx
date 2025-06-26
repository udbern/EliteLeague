"use client";

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import loaderAnimation from '@/assets/loader.json';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1700);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030003] transition-opacity duration-500">
      <Lottie
        animationData={loaderAnimation}
        loop
        autoplay
        style={{ height: '160px', width: '160px' }}
      />
    </div>
  );
} 