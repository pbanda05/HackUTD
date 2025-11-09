import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home } from 'lucide-react';
import logoUrl from '../../assets/logo.svg';

export default function DrivingAnimation({ currentStage = 0, nextStage = 1, stages = [] }) {
  const [windowWidth, setWindowWidth] = useState(1000);
  const [windowHeight, setWindowHeight] = useState(600);
  const logoAnimationDuration = 6;
  // Small extra pause after the logo finishes before transitioning
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
      className="fixed inset-0 z-100 bg-black flex flex-col overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: nextStageDelay-2} }}
      transition={{ duration: 1 }}
    >
      {/* Winding Road Background */}
      <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900">
        {/* Curved Road */}
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
          </defs>
          {/* Black road base */}
          <use 
            href="#roadPath" 
            stroke="#000000" 
            strokeWidth="40" 
            fill="none"
          />
          {/* Center dashed line */}
          <use 
            href="#roadPath" 
            stroke="#FFFFFF" 
            strokeWidth="3" 
            fill="none" 
            strokeDasharray="30,30"
          />
        </svg>
      </div>

      {/* Toyota Logo Moving Along Path */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full z-10"
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
            <motion.img 
              src={logoUrl} 
              alt="Toyota Logo" 
              className="w-20 h-20 object-contain"
              style={{
                filter: "brightness(1.6) contrast(1.15)",
                backgroundColor: "rgba(255, 255, 255, 0.22)",
                padding: "4px",
                borderRadius: "12px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.45)",
                opacity: 1
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Destination Markers */}
      {/* Current Location */}
      {currentStageData && (
        <motion.div
          className="absolute left-20 top-1/3 z-30"
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2 }}
        >
          <div className="bg-gray-700/90 text-white px-6 py-3 rounded-lg border-2 border-gray-600 shadow-xl backdrop-blur-lg">
            <p className="text-sm font-medium">{currentStageData.title}</p>
          </div>
        </motion.div>
      )}

      {/* Next Destination */}
      <AnimatePresence>
        {nextStageData && (
          <motion.div
            key={nextStage}
            className="absolute right-20 top-2/3 z-30"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 2 }}
          >
            {isLastStage ? (
              <div className="bg-red-600/90 text-white px-8 py-4 rounded-lg border-2 border-red-500 shadow-xl backdrop-blur-lg flex items-center gap-3">
                <Home className="w-6 h-6" />
                <p className="text-lg font-bold">{nextStageData.title}</p>
              </div>
            ) : (
              <div className="bg-red-600/90 text-white px-8 py-4 rounded-lg border-2 border-red-500 shadow-xl backdrop-blur-lg">
                <p className="text-lg font-bold">{nextStageData.title}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>


      {/* Environment Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Speed Lines */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`speed-${i}`}
            className="absolute w-0.5 bg-linear-to-b from-transparent via-red-600/40 to-transparent"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 200 + 50}px`,
              transform: `rotate(${Math.random() * 60 - 30}deg)`
            }}
            animate={{
              y: [-1000, 1000],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 1 + Math.random(),
              delay: Math.random() * 0.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Scenery Elements */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`scenery-${i}`}
              className="absolute"
              style={{
                top: `${i % 2 === 0 ? '20%' : '70%'}`,
                left: `${(i * 100 / 6)}%`,
              }}
              animate={{
                x: [-100, windowWidth + 100]
              }}
              transition={{
                duration: 3 + Math.random(),
                delay: i * 0.3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {i % 3 === 0 ? (
                // Tree
                <div className="w-12 h-20 bg-linear-to-t from-green-800/40 to-green-900/40 rounded-t-full" />
              ) : i % 3 === 1 ? (
                // Building
                <div className="w-16 h-24 bg-linear-to-t from-gray-800/40 to-gray-900/40 rounded-sm" />
              ) : (
                // Mountain
                <div className="w-32 h-40 bg-linear-to-t from-gray-700/30 to-gray-800/30" style={{ clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress text with dynamic content */}
      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1, delay: nextStageDelay }}
      >
        <motion.p
          className="text-white text-2xl font-light tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: logoAnimationDuration * 0.8, delay: nextStageDelay }}
        >
          {isLastStage ? (
            'Arriving at your dream destination...'
          ) : (
            `Traveling to ${nextStageData?.title || 'next destination'}...`
          )}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
