"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Load from "@/assets/logo.png";

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#030003]">
      <div className="relative w-20 h-20 animate-pulse">
        <Image
          src={Load}
          alt="Loading..."
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
} 