import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Music, Navigation, ChevronLeft } from 'lucide-react';

type FeaturesStageProps = {
  onBack?: () => void;
  onComplete: (data: { priority: string }) => void;
};

const FEATURE_OPTIONS = [
  {
    id: 'safety',
    label: 'Safety',
    description: 'Advanced safety features and crash protection',
    icon: Shield,
    color: 'blue',
    bgColor: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-500'
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Powerful engine and sporty driving experience',
    icon: Zap,
    color: 'yellow',
    bgColor: 'from-yellow-600 to-yellow-700',
    borderColor: 'border-yellow-500'
  },
  {
    id: 'technology',
    label: 'Technology',
    description: 'Latest infotainment and connectivity features',
    icon: Music,
    color: 'purple',
    bgColor: 'from-purple-600 to-purple-700',
    borderColor: 'border-purple-500'
  },
  {
    id: 'convenience',
    label: 'Convenience',
    description: 'Navigation, comfort, and everyday ease',
    icon: Navigation,
    color: 'green',
    bgColor: 'from-green-600 to-green-700',
    borderColor: 'border-green-500'
  }
];

const FeaturesStage: React.FC<FeaturesStageProps> = ({ onBack, onComplete }) => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const handleSelect = (priorityId: string) => {
    setSelectedPriority(priorityId);
  };

  const handleSubmit = () => {
    if (selectedPriority) {
      onComplete({ priority: selectedPriority });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-6xl mx-auto text-white relative z-20 min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full"
    >
      {/* Back Button */}
      {onBack && (
        <motion.button
          type="button"
          onClick={onBack}
          className="fixed top-4 left-4 flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer z-30 bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 hover:border-gray-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>
      )}
      
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          What Matters <span className="text-red-600">Most?</span>
        </h2>
        <p className="text-xl text-gray-300">
          Select your top priority when choosing a vehicle
        </p>
      </motion.div>

      {/* 2x2 Grid of Feature Priority Options */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto relative z-20">
        {FEATURE_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedPriority === option.id;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? `${option.borderColor} bg-gradient-to-br ${option.bgColor} shadow-2xl scale-105`
                  : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900/70'
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <Icon className={`w-10 h-10 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{option.label}</h3>
                <p className="text-gray-300 text-sm">{option.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      {selectedPriority && (
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10"
          >
            Continue
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FeaturesStage;

