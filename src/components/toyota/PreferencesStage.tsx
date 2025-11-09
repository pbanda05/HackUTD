import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mountain, Zap, Briefcase, ChevronLeft } from 'lucide-react';

type PreferenceValue = string | number | boolean | null;
type Preferences = Record<string, PreferenceValue>;
interface PreferencesStageProps {
  onBack?: () => void;
  onComplete: (data: Preferences) => void;
}

const LIFESTYLE_OPTIONS = [
  {
    id: 'family',
    label: 'Family',
    description: 'Spacious, safe, practical',
    icon: Users,
    color: 'red',
    bgColor: 'from-gray-900 via-red-900/30 to-black',
    borderColor: 'border-red-500'
  },
  {
    id: 'adventure',
    label: 'Adventure',
    description: 'Rugged, powerful, capable',
    icon: Mountain,
    color: 'red',
    bgColor: 'from-black via-red-600/20 to-gray-900',
    borderColor: 'border-red-500'
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Fast, sleek, thrilling',
    icon: Zap,
    color: 'red',
    bgColor: 'from-gray-800 via-red-800/40 to-black',
    borderColor: 'border-red-500'
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Elegant, efficient, refined',
    icon: Briefcase,
    color: 'red',
    bgColor: 'from-black via-red-700/30 to-gray-800',
    borderColor: 'border-red-500'
  }
];

const PreferencesStage: React.FC<PreferencesStageProps> = ({ onBack, onComplete }) => {
  const [selectedLifestyle, setSelectedLifestyle] = useState<string | null>(null);

  const handleSelect = (lifestyleId: string) => {
    setSelectedLifestyle(lifestyleId);
  };

  const handleSubmit = () => {
    if (selectedLifestyle) {
      onComplete({ lifestyle: selectedLifestyle });
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
          What Drives <span className="text-red-600">You?</span>
        </h2>
        <p className="text-xl text-gray-300">
          Choose the lifestyle that matches your journey
        </p>
      </motion.div>

      {/* 2x2 Grid of Lifestyle Options */}
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto relative z-20">
        {LIFESTYLE_OPTIONS.map((option, index) => {
          const Icon = option.icon;
          const isSelected = selectedLifestyle === option.id;
          
          return (
            <motion.button
              key={option.id}
              type="button"
              onClick={() => handleSelect(option.id)}
              className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                isSelected
                  ? `${option.borderColor} bg-gradient-to-br ${option.bgColor} shadow-2xl scale-105 ring-4 ring-opacity-50`
                  : `${option.borderColor} bg-gradient-to-br ${option.bgColor} opacity-60 hover:opacity-80 border-opacity-50`
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isSelected ? 1 : 0.6 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, opacity: isSelected ? 1 : 0.9 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                  isSelected ? 'bg-white/30 shadow-lg' : 'bg-white/20'
                }`}>
                  <Icon className={`w-10 h-10 ${isSelected ? 'text-white' : 'text-white'}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{option.label}</h3>
                <p className={`text-sm ${isSelected ? 'text-white' : 'text-white/90'}`}>{option.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      {selectedLifestyle && (
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

export default PreferencesStage;
