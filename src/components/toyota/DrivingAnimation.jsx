import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DrivingAnimation({ currentStage = 0, nextStage = 1, stages = [] }) {
  const [windowWidth, setWindowWidth] = useState(1000);
  const currentStageData = stages[currentStage];
  const nextStageData = stages[nextStage];
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Road Background - Horizontal */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        {/* Road Edges - Top and Bottom */}
        <div className="absolute left-0 right-0 top-1/4 h-1 bg-white/60" />
        <div className="absolute left-0 right-0 bottom-1/4 h-1 bg-white/60" />
        
        {/* Center Lane Divider - Dashed White Line - Horizontal */}
        <div 
          className="absolute left-0 right-0 top-1/2 h-0.5 transform -translate-y-1/2"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(to right, #ffffff 0px, #ffffff 40px, transparent 40px, transparent 60px)'
          }} 
        />
        
        {/* Road Texture - Horizontal */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)'
          }} 
        />
      </div>

      {/* Moving Road Lines - Horizontal Perspective Effect */}
      <div className="absolute left-0 right-0 top-1/2 h-64 transform -translate-y-1/2 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 transform -translate-y-1/2 w-20 h-1 bg-white/80"
            style={{
              left: `${i * 8}%`,
            }}
            animate={{
              x: [0, windowWidth + 200],
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

      {/* Destination Markers on the Road - Horizontal Layout */}
      {/* Current Location - Left */}
      {currentStageData && (
        <motion.div
          className="absolute left-20 top-1/2 transform -translate-y-1/2 z-30"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-gray-700/90 text-white px-6 py-3 rounded-lg border-2 border-gray-600 shadow-xl backdrop-blur-lg">
            <p className="text-sm font-medium">{currentStageData.title}</p>
          </div>
        </motion.div>
      )}

      {/* Next Destination - Right */}
      <AnimatePresence>
        {nextStageData && (
          <motion.div
            key={nextStage}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 z-30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-red-600/90 text-white px-8 py-4 rounded-lg border-2 border-red-500 shadow-xl backdrop-blur-lg">
              <p className="text-lg font-bold">{nextStageData.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Speed lines - Horizontal */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 bg-gradient-to-b from-transparent via-red-600/40 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 300 + 100}px`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`
            }}
            animate={{
              y: [-2000, 2000],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              delay: Math.random() * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Roadside elements - trees/buildings passing by - Horizontal */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-8 bg-gradient-to-l from-green-800/30 to-transparent rounded-l-full"
            style={{
              top: `${i % 2 === 0 ? '15%' : '75%'}`,
              left: `${i * 10}%`,
            }}
            animate={{
              x: [0, windowWidth + 200],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: i * 0.2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Progress text */}
      <motion.p
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white text-2xl font-light tracking-wider z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.5 }}
      >
        Traveling to {nextStageData?.title || 'next destination'}...
      </motion.p>
    </motion.div>
  );
}
