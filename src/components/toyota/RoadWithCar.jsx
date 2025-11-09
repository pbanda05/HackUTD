import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Home, MapPin, DollarSign, Settings, Sparkles } from 'lucide-react';

export default function RoadWithCar({ currentStage = 0, totalStages = 8, className = '' }) {
  // Calculate car position based on current stage
  const carPosition = (currentStage / (totalStages - 1)) * 100;
  
  // Landmarks configuration
  const landmarks = [
    { stage: 0, icon: Building2, label: 'Dealership', position: 0 },
    { stage: 2, icon: MapPin, label: 'Budget', position: 25 },
    { stage: 3, icon: Sparkles, label: 'AI Match', position: 40 },
    { stage: 4, icon: Settings, label: 'Customize', position: 55 },
    { stage: 5, icon: DollarSign, label: 'Finance', position: 70 },
    { stage: 7, icon: Home, label: 'Home', position: 100 },
  ];

  return (
    <div className={`fixed left-1/2 top-0 bottom-0 w-32 transform -translate-x-1/2 z-0 pointer-events-none ${className}`}>
      {/* Road Background - Dark asphalt */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
      
      {/* Road Edges/Lines */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400/60" />
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400/60" />
      
      {/* Center Lane Divider - Dashed Yellow Line */}
      <div 
        className="absolute left-1/2 top-0 bottom-0 w-0.5 transform -translate-x-1/2"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(to bottom, #fbbf24 0px, #fbbf24 30px, transparent 30px, transparent 50px)'
        }} 
      />
      
      {/* Road Texture - Subtle lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 3px)'
        }} 
      />
      
      {/* Landmarks */}
      {landmarks.map((landmark, index) => {
        const Icon = landmark.icon;
        const isPassed = currentStage > landmark.stage;
        const isCurrent = currentStage === landmark.stage;
        
        return (
          <div
            key={index}
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ top: `${landmark.position}%` }}
          >
            <div className={`relative ${isPassed ? 'opacity-60' : isCurrent ? 'opacity-100 scale-110' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isPassed ? 'bg-green-600' : isCurrent ? 'bg-red-600' : 'bg-gray-600'
              } shadow-lg`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <p className="text-xs text-white font-semibold bg-black/60 px-2 py-1 rounded">
                  {landmark.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Moving Car Model - Side View */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ top: `${carPosition}%` }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
      >
        {/* Car Shadow */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-black/40 blur-lg rounded-full" />
        
        {/* Car Body - Side View - More Realistic */}
        <div className="relative">
          {/* Main Car Body */}
          <div className="relative w-16 h-10 bg-gradient-to-b from-red-600 via-red-700 to-red-800 rounded-lg shadow-2xl border-2 border-red-500">
            {/* Car Roof/Windshield */}
            <div className="absolute top-0 left-3 right-3 h-4 bg-gradient-to-b from-gray-900/80 to-transparent rounded-t-lg">
              {/* Windshield */}
              <div className="absolute top-0 left-1 right-1 h-2.5 bg-blue-400/30 rounded-t-sm" />
            </div>
            
            {/* Car Windows */}
            <div className="absolute top-1 left-4 right-4 h-2.5 bg-black/40 rounded-sm" />
            
            {/* Car Wheels - Side View with more detail */}
            <div className="absolute -bottom-1.5 left-2 w-5 h-5 bg-gray-900 rounded-full border-2 border-gray-700 shadow-xl">
              <div className="absolute inset-1 bg-gray-700 rounded-full" />
              <div className="absolute inset-2 bg-gray-800 rounded-full" />
              <div className="absolute inset-3 bg-gray-900 rounded-full" />
            </div>
            <div className="absolute -bottom-1.5 right-2 w-5 h-5 bg-gray-900 rounded-full border-2 border-gray-700 shadow-xl">
              <div className="absolute inset-1 bg-gray-700 rounded-full" />
              <div className="absolute inset-2 bg-gray-800 rounded-full" />
              <div className="absolute inset-3 bg-gray-900 rounded-full" />
            </div>
            
            {/* Car Headlights - Front */}
            <div className="absolute top-3 left-0 w-2.5 h-2.5 bg-yellow-300 rounded-full shadow-xl shadow-yellow-300/70 border border-yellow-200" />
            
            {/* Car Taillights - Back */}
            <div className="absolute top-3 right-0 w-2 h-2 bg-red-500 rounded-full shadow-lg" />
            
            {/* Car Door Handle */}
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-3 h-1 bg-gray-600 rounded-full" />
            
            {/* Toyota Logo */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            
            {/* Car Grille */}
            <div className="absolute top-6 left-1 w-2 h-1 bg-gray-800 rounded-sm" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

