import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mountain, Zap, Briefcase } from 'lucide-react';

type PreferenceValue = string | number | boolean | null;
type Preferences = Record<string, PreferenceValue>;
interface PreferencesStageProps {
  onComplete: (data: Preferences) => void;
}

const LIFESTYLE_OPTIONS = [
  {
    id: 'family',
    label: 'Family',
    description: 'Spacious, safe, practical',
    icon: Users,
    color: 'blue',
    bgColor: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-500'
  },
  {
    id: 'adventure',
    label: 'Adventure',
    description: 'Rugged, powerful, capable',
    icon: Mountain,
    color: 'green',
    bgColor: 'from-green-600 to-green-700',
    borderColor: 'border-green-500'
  },
  {
    id: 'performance',
    label: 'Performance',
    description: 'Fast, sleek, thrilling',
    icon: Zap,
    color: 'red',
    bgColor: 'from-red-600 to-red-700',
    borderColor: 'border-red-500'
  },
  {
    id: 'business',
    label: 'Business',
    description: 'Elegant, efficient, refined',
    icon: Briefcase,
    color: 'purple',
    bgColor: 'from-purple-600 to-purple-700',
    borderColor: 'border-purple-500'
  }
];

const PreferencesStage: React.FC<PreferencesStageProps> = ({ onComplete }) => {
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
