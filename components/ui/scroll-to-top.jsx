"use client";
import { useState, useEffect } from 'react';
import { IconArrowUp } from '@tabler/icons-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 animate-bounce cursor-pointer right-6 z-50 custom-gradient-3 hover:bg-[#A112BA] text-white rounded-full p-1 shadow-lg transition-all duration-500 ease-in-out transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <IconArrowUp className="w-8 h-8" />
        </button>
      )}
    </>
  );
};