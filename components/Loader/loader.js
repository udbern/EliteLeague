// components/Loader/Loader.js
"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Football from '@/assets/logo.png';

const Loader = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#622085] via-[#A112BA] to-[#0f5c4f] z-50"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeOut"
              }
            }}
            className="relative"
          >
            <Image 
              src={Football} 
              alt="Logo" 
              width={100} 
              height={100} 
              className="object-center object-contain drop-shadow-2xl" 
              priority
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-0 border-4 border-white/20 rounded-full"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.3 }
            }}
            className="mt-8 text-white text-xl font-bold font-montserrat"
          >
            Loading Elite League...
          </motion.div>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: "200px",
              transition: { 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }
            }}
            className="h-1 bg-white/30 rounded-full mt-4 overflow-hidden"
          >
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="h-full w-1/2 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;