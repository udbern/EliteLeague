'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from '@/components/Loader/loader';
import Header from '@/components/Header/Header';

import { SeasonProvider } from '@/components/SeasonProvider';

export default function ClientLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageReady, setIsPageReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Reset loading state on route change
    setIsLoading(true);
    setIsPageReady(false);

    // Simulate minimum loading time of 3 seconds
    const minLoadingTimer = setTimeout(() => {
      setIsPageReady(true);
    }, 3000);

    // Check if the page is actually ready
    const checkPageReady = () => {
      if (document.readyState === 'complete') {
        setIsPageReady(true);
      }
    };

    // Listen for page load events
    window.addEventListener('load', checkPageReady);
    
    // If page is already loaded, set ready state
    if (document.readyState === 'complete') {
      setIsPageReady(true);
    }

    return () => {
      clearTimeout(minLoadingTimer);
      window.removeEventListener('load', checkPageReady);
    };
  }, [pathname]);

  useEffect(() => {
    // Only hide loader when both minimum time has passed AND page is ready
    if (isPageReady) {
      const hideLoaderTimer = setTimeout(() => {
        setIsLoading(false);
      }, 500); // Small delay for smooth transition
      return () => clearTimeout(hideLoaderTimer);
    }
  }, [isPageReady]);

  return (
    <SeasonProvider>
      <Loader isLoading={isLoading} />
      <div className={`flex flex-col bg-[#0f5c4f] transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Header />
        <main className="">
          {children}
        </main>
      </div>
    </SeasonProvider>
  );
}
