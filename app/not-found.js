// app/not-found.js
'use client';

import Link from 'next/link';
import { IconAlertTriangle } from '@tabler/icons-react'; // Optional, or swap with a gaming icon

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F1C] text-center p-6 font-montserrat text-white">
      <div className="mb-6 animate-pulse">
        <IconAlertTriangle size={64} className="text-red-600" />
      </div>

      <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4 drop-shadow-md">
        404
      </h1>

      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-200 tracking-wide">
        Game Over – Page Not Found
      </h2>

      <p className="text-lg text-gray-400 mb-8 max-w-md">
        Oops! The route you’re trying to access has gone AFK. It either doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="inline-block px-6 py-3 bg-gradient-to-r capitalize from-pink-500 to-purple-600 rounded-xl text-white text-lg font-semibold shadow-lg hover:scale-105 hover:shadow-pink-500/40 transition-transform duration-300"
      >
        Return to home
      </Link>
    </div>
  );
}
