import React from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

export default function DrivingAnimation() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Glowing road */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-2 h-full bg-gradient-to-b from-transparent via-red-600 to-transparent"
          animate={{
            scaleY: [0, 1, 1],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Road lines moving */}
      <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-16 bg-red-500"
            initial={{ top: `${i * 12}%`, opacity: 0 }}
            animate={{
              top: ['0%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Car driving */}
      <motion.div
        className="relative z-10"
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: [-100, 0, -100],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut"
        }}
      >
        <motion.div
          animate={{
            y: [0, -5, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Car className="w-24 h-24 text-red-600" />
        </motion.div>
        
        {/* Headlight glow */}
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-red-600/30 rounded-full blur-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-red-600/50 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`
            }}
            animate={{
              x: [-1000, 1000],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 1 + Math.random(),
              delay: Math.random() * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Progress text */}
      <motion.p
        className="absolute bottom-20 text-white text-xl font-light tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2 }}
      >
        Driving to next destination...
      </motion.p>
    </motion.div>
  );
}