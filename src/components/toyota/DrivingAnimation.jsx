import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MapPin } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';

export default function DrivingAnimation({ currentStage = 0, nextStage = 1, stages = [] }) {
  const [windowWidth, setWindowWidth] = useState(1000);
  const [windowHeight, setWindowHeight] = useState(600);
  const logoAnimationDuration = 6;
  const nextStageDelay = logoAnimationDuration;
  const currentStageData = stages[currentStage];
  const nextStageData = stages[nextStage];
  const isLastStage = nextStage === stages.length - 1;
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <motion.div
      className="fixed inset-0 z-100 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: nextStageDelay - 2 } }}
      transition={{ duration: 1 }}
    >
      {/* Animated gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent opacity-60 animate-pulse" 
           style={{ animationDuration: '4s' }} />
      
      {/* Winding Road Background */}
      <div className="absolute inset-0">
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="none"
          viewBox={`0 0 ${windowWidth} ${windowHeight}`}
        >
          <defs>
            <path
              id="roadPath"
              d={`M0,${windowHeight/2} 
                  C${windowWidth*0.3},${windowHeight*0.3} 
                  ${windowWidth*0.5},${windowHeight*0.7} 
                  ${windowWidth*0.7},${windowHeight*0.4} 
                  S${windowWidth*0.9},${windowHeight*0.6} 
                  ${windowWidth},${windowHeight*0.5}`}
            />
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1a1a1a" />
              <stop offset="50%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#1a1a1a" />
            </linearGradient>
          </defs>
          
          {/* Road glow effect */}
          <use 
            href="#roadPath" 
            stroke="rgba(220, 38, 38, 0.15)" 
            strokeWidth="50" 
            fill="none"
            filter="blur(8px)"
          />
          
          {/* Main road */}
          <use 
            href="#roadPath" 
            stroke="url(#roadGradient)" 
            strokeWidth="44" 
            fill="none"
          />
          
          {/* Road edges */}
          <use 
            href="#roadPath" 
            stroke="rgba(100, 100, 100, 0.4)" 
            strokeWidth="46" 
            fill="none"
          />
          
          {/* Center dashed line */}
          <use 
            href="#roadPath" 
            stroke="#FFF" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="30,30"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Toyota Logo Moving Along Path */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full z-40"
      >
        <motion.div
          className="absolute"
          initial={{ offsetDistance: "0%", scale: 1 }}
          animate={{ 
            offsetDistance: "100%",
            scale: isLastStage ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            offsetDistance: { duration: logoAnimationDuration, ease: "easeInOut" },
            scale: { duration: 0.3, times: [0, 0.5, 1] }
          }}
          style={{
            offsetPath: `path('M0,${windowHeight/2} C${windowWidth*0.3},${windowHeight*0.3} ${windowWidth*0.5},${windowHeight*0.7} ${windowWidth*0.7},${windowHeight*0.4} S${windowWidth*0.9},${windowHeight*0.6} ${windowWidth},${windowHeight*0.5}')`,
            offsetRotate: "0deg"
          }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            {/* Logo glow */}
            <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full scale-150" />
            
            <motion.img 
              src={logoUrl} 
              alt="Toyota Logo" 
              className="relative w-20 h-20 object-contain"
              animate={{ 
                filter: ["brightness(1.6) contrast(1.15)", "brightness(1.8) contrast(1.2)", "brightness(1.6) contrast(1.15)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                filter: "brightness(1.6) contrast(1.15)",
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                padding: "6px",
                borderRadius: "16px",
                boxShadow: "0 8px 24px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Destination Markers */}
      {/* Current Location */}
      {currentStageData && (
        <motion.div
          className="absolute left-8 sm:left-20 top-1/4 sm:top-1/3 z-30"
          initial={{ opacity: 0, x: -50, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-lg scale-110" />
            
            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 text-white px-5 py-3 rounded-xl border border-slate-600/50 shadow-2xl backdrop-blur-md">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <p className="text-sm font-semibold tracking-wide">{currentStageData.title}</p>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-slate-800/95" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Destination */}
      <AnimatePresence>
        {nextStageData && (
          <motion.div
            key={nextStage}
            className="absolute right-8 sm:right-20 top-2/3 sm:top-2/3 z-30"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative group">
              {/* Animated glow effect */}
              <motion.div 
                className="absolute inset-0 bg-red-500/30 blur-2xl rounded-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {isLastStage ? (
                <div className="relative bg-gradient-to-br from-red-600/95 to-red-700/95 text-white px-6 py-4 rounded-xl border-2 border-red-400/50 shadow-2xl backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Home className="w-6 h-6" />
                    </motion.div>
                    <p className="text-lg font-bold tracking-wide">{nextStageData.title}</p>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600/95" />
                </div>
              ) : (
                <div className="relative bg-gradient-to-br from-red-600/95 to-red-700/95 text-white px-6 py-4 rounded-xl border-2 border-red-400/50 shadow-2xl backdrop-blur-md">
                  <p className="text-lg font-bold tracking-wide">{nextStageData.title}</p>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600/95" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Environment Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced Speed Lines - Horizontal */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`speed-${i}`}
            className="absolute h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: 0,
              width: `${Math.random() * 200 + 100}px`,
            }}
            animate={{
              x: [-300, windowWidth + 300],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Scenery Elements - Static */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`scenery-${i}`}
              className="absolute opacity-60"
              style={{
                top: `${i % 2 === 0 ? '15%' : '70%'}`,
                left: `${(i * 100 / 7)}%`,
              }}
            >
              {i % 3 === 0 ? (
                // Tree with gradient
                <div className="w-14 h-24 bg-gradient-to-t from-green-900/50 to-green-700/40 rounded-t-full shadow-lg" />
              ) : i % 3 === 1 ? (
                // Building with windows
                <div className="relative w-18 h-28 bg-gradient-to-t from-slate-800/50 to-slate-700/40 rounded-sm shadow-lg">
                  <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400/30 rounded-sm" />
                  <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400/30 rounded-sm" />
                </div>
              ) : (
                // Mountain with gradient
                <div 
                  className="w-36 h-44 bg-gradient-to-t from-slate-700/40 to-slate-600/30 shadow-xl" 
                  style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} 
                />
              )}
            </div>
          ))}
        </div>
        
        {/* Subtle particle effects */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/40 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity
            }}
          />
        ))}
      </div>

      {/* Progress text with enhanced styling */}
      <motion.div
        className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 text-center z-20 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: logoAnimationDuration * 0.8, delay: 0.5 }}
        >
          {/* Text glow */}
          <div className="absolute inset-0 blur-xl bg-red-500/20 rounded-lg" />
          
          <p className="relative text-white text-xl sm:text-2xl font-light tracking-wider drop-shadow-2xl">
            {isLastStage ? (
              <span className="bg-gradient-to-r from-red-400 via-red-300 to-red-400 bg-clip-text text-transparent font-semibold">
                Arriving at your dream destination...
              </span>
            ) : (
              <>
                Traveling to <span className="text-red-400 font-semibold">{nextStageData?.title || 'next destination'}</span>
              </>
            )}
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}