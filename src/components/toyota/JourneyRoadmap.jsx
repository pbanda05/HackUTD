import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Settings, BarChart3, DollarSign, Home } from 'lucide-react';

const ICON_MAP = {
  'welcome': MapPin,
  'preferences': Settings,
  'budget': BarChart3,
  'comparison': BarChart3,
  'customization': Settings,
  'financing': DollarSign,
  'upsell': Settings,
  'reveal': Home
};

export default function JourneyRoadmap({ stages, currentStage, onStageClick }) {
  // Calculate car position based on current stage
  const carPosition = (currentStage / (stages.length - 1)) * 100;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5">
            <div 
              className="h-full bg-red-600 transition-all duration-500"
              style={{ width: `${(currentStage / (stages.length - 1)) * 100}%` }}
            />
            <div className="absolute inset-0 h-full bg-gray-700" style={{ zIndex: -1 }} />
          </div>
          
          {/* Moving Car on Top Bar */}
          <motion.div
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-20"
            style={{ left: `${carPosition}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          >
            {/* Car Shadow */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1.5 bg-black/40 blur-md rounded-full" />
            
            {/* Car Body - Top View */}
            <div className="relative w-10 h-6 bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-lg shadow-xl border-2 border-red-500">
              {/* Car Windows */}
              <div className="absolute top-1 left-2 right-2 h-2 bg-black/40 rounded-sm" />
              
              {/* Car Wheels - Top View */}
              <div className="absolute -bottom-1 left-1 w-3 h-3 bg-gray-900 rounded-full border border-gray-700" />
              <div className="absolute -bottom-1 right-1 w-3 h-3 bg-gray-900 rounded-full border border-gray-700" />
              
              {/* Car Headlights - Front */}
              <div className="absolute top-1 left-0 w-1.5 h-1.5 bg-yellow-300 rounded-full" />
              <div className="absolute top-1 right-0 w-1.5 h-1.5 bg-yellow-300 rounded-full" />
            </div>
          </motion.div>
          
          {stages.map((stage, index) => {
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;
            const isAccessible = index <= currentStage;
            const Icon = ICON_MAP[stage.id] || Settings;
            
            return (
              <motion.div
                key={stage.id}
                className="relative z-10 flex-1 flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  type="button"
                  onClick={() => isAccessible && onStageClick(index)}
                  disabled={!isAccessible}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-red-600 shadow-lg shadow-red-600/50' 
                      : isCompleted
                      ? 'bg-red-600/80 hover:bg-red-600'
                      : 'bg-gray-700 opacity-50'
                  }`}
                  whileHover={isAccessible ? { scale: 1.1 } : {}}
                  whileTap={isAccessible ? { scale: 0.95 } : {}}
                >
                  <Icon className={`w-8 h-8 md:w-10 md:h-10 ${
                    isActive || isCompleted ? 'text-white' : 'text-gray-400'
                  }`} />
                </motion.button>
                
                <motion.p 
                  className={`mt-2 text-xs font-medium text-center transition-colors ${
                    isActive ? 'text-white' : isCompleted ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {stage.title}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}