import React from 'react';
import { motion } from 'framer-motion';

// Different scenery backgrounds for each stage
const STAGE_SCENERY = {
  welcome: {
    gradient: 'from-blue-900 via-indigo-900 to-purple-900',
    elements: 'cityscape',
    description: 'City Skyline'
  },
  preferences: {
    gradient: 'from-green-800 via-emerald-800 to-teal-800',
    elements: 'nature',
    description: 'Mountain Range'
  },
  budget: {
    gradient: 'from-amber-900 via-orange-900 to-red-900',
    elements: 'desert',
    description: 'Desert Horizon'
  },
  comparison: {
    gradient: 'from-purple-900 via-pink-900 to-rose-900',
    elements: 'aurora',
    description: 'Aurora Sky'
  },
  customization: {
    gradient: 'from-cyan-900 via-blue-900 to-indigo-900',
    elements: 'ocean',
    description: 'Ocean View'
  },
  financing: {
    gradient: 'from-slate-800 via-gray-800 to-zinc-800',
    elements: 'urban',
    description: 'Urban Night'
  },
  upsell: {
    gradient: 'from-violet-900 via-purple-900 to-fuchsia-900',
    elements: 'sunset',
    description: 'Sunset Horizon'
  },
  reveal: {
    gradient: 'from-emerald-900 via-green-800 to-teal-800',
    elements: 'home',
    description: 'Home Sweet Home'
  }
};

export default function StageBackground({ currentStageId = 'welcome', className = '' }) {
  const scenery = STAGE_SCENERY[currentStageId] || STAGE_SCENERY.welcome;
  
  return (
    <div className={`fixed inset-0 z-0 pointer-events-none ${className}`}>
      {/* Base Gradient Background */}
      <motion.div
        key={currentStageId}
        className={`absolute inset-0 bg-gradient-to-br ${scenery.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Animated Elements Based on Stage */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles/stars */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Stage-specific decorative elements */}
        {currentStageId === 'welcome' && (
          <>
            {/* City lights */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-8 bg-yellow-300/40 rounded-t-full"
                style={{
                  left: `${10 + i * 6}%`,
                  bottom: '10%',
                }}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </>
        )}
        
        {currentStageId === 'preferences' && (
          <>
            {/* Mountain silhouettes */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900/50 to-transparent" />
            <div className="absolute bottom-0 left-1/4 w-32 h-24 bg-gray-800/40 rounded-t-full transform -skew-x-12" />
            <div className="absolute bottom-0 right-1/4 w-40 h-28 bg-gray-800/40 rounded-t-full transform skew-x-12" />
          </>
        )}
        
        {currentStageId === 'budget' && (
          <>
            {/* Desert dunes */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-800/30 to-transparent" />
            <motion.div
              className="absolute bottom-0 left-1/3 w-64 h-32 bg-amber-700/20 rounded-t-full"
              animate={{
                scaleX: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
          </>
        )}
        
        {currentStageId === 'comparison' && (
          <>
            {/* Aurora waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full h-32 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent"
                style={{
                  top: `${20 + i * 25}%`,
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 2,
                }}
              />
            ))}
          </>
        )}
        
        {currentStageId === 'customization' && (
          <>
            {/* Ocean waves */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-cyan-600/20 to-transparent"
                style={{
                  bottom: `${i * 20}px`,
                }}
                animate={{
                  x: ['-10%', '10%'],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </>
        )}
        
        {currentStageId === 'financing' && (
          <>
            {/* Urban grid */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-px h-full bg-white"
                  style={{ left: `${12.5 * (i + 1)}%` }}
                />
              ))}
            </div>
          </>
        )}
        
        {currentStageId === 'upsell' && (
          <>
            {/* Sunset rays */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-full bg-gradient-to-b from-orange-400/30 to-transparent"
                style={{
                  left: `${20 + i * 15}%`,
                  transform: `rotate(${-10 + i * 5}deg)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </>
        )}
        
        {currentStageId === 'reveal' && (
          <>
            {/* Home elements - trees */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 w-16 h-24 bg-gradient-to-t from-green-800/40 to-transparent rounded-t-full"
                style={{
                  left: `${15 + i * 12}%`,
                }}
                animate={{
                  scaleY: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
            {/* House silhouette */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-gray-800/30 rounded-t-lg" />
          </>
        )}
      </div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
    </div>
  );
}

