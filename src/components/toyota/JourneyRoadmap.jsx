import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function JourneyRoadmap({ stages, currentStage, onStageClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-red-600/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          {/* Glowing road line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600/30 to-transparent" />
          
          {stages.map((stage, index) => {
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;
            const isAccessible = index <= currentStage;
            
            return (
              <motion.div
                key={stage.id}
                className="relative z-10 flex-1 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  onClick={() => isAccessible && onStageClick(index)}
                  disabled={!isAccessible}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-red-600 shadow-2xl shadow-red-600/60 scale-110' 
                      : isCompleted
                      ? 'bg-red-700/80 shadow-lg shadow-red-700/40 hover:scale-105 cursor-pointer'
                      : 'bg-gray-800/50 opacity-50 backdrop-blur-sm'
                  }`}
                  whileHover={isAccessible ? { scale: 1.1 } : {}}
                  whileTap={isAccessible ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  ) : (
                    <span className="text-xl md:text-2xl">{stage.icon}</span>
                  )}
                </motion.button>
                
                <motion.p 
                  className={`mt-2 text-xs md:text-sm font-medium text-center transition-colors ${
                    isActive ? 'text-red-400' : isCompleted ? 'text-red-300' : 'text-gray-500'
                  }`}
                  animate={{ 
                    opacity: isActive ? 1 : 0.7,
                    y: isActive ? [0, -2, 0] : 0
                  }}
                  transition={{
                    y: { repeat: Infinity, duration: 2 }
                  }}
                >
                  {stage.title}
                </motion.p>

                {/* Pulsing ring for active stage */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-red-400"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [1, 0, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}