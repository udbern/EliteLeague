'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, House, RefreshCcw } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F1C] text-center p-6 font-montserrat text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* Game Controller Icon */}
        <motion.div 
          className="mb-8"
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Gamepad2 size={80} className="text-purple-500 mx-auto" />
        </motion.div>

        {/* 404 Text */}
        <motion.h1 
          className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 mb-6 drop-shadow-lg"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-gray-100 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Connection Lost
        </motion.h2>

        <motion.p 
          className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Looks like this page has disconnected from the server. 
          It might be in another match or has been moved to a different league.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 border border-purple-500/30"
          >
            <House size={20} className="group-hover:animate-bounce" />
            Return to Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl text-white text-lg font-semibold shadow-lg hover:shadow-gray-500/40 hover:scale-105 transition-all duration-300 border border-gray-600/30"
          >
            <RefreshCcw size={20} className="group-hover:animate-spin" />
            Try Again
          </button>
        </motion.div>

        {/* Gaming-themed footer text */}
        <motion.p 
          className="text-sm text-gray-500 mt-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          "The best defense is a good offense, but the best offense is knowing where you're going."
        </motion.p>
      </motion.div>
    </div>
  );
} 