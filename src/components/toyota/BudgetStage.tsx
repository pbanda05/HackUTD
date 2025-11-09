import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Zap, ChevronLeft } from 'lucide-react';

type BudgetStageProps = {
  onBack?: () => void;
  onComplete: (data: { budget: number; creditScore: number }) => void;
};

const getCreditScoreLabel = (score: number): string => {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Poor';
};

const BudgetStage: React.FC<BudgetStageProps> = ({ onBack, onComplete }) => {
  const [budget, setBudget] = useState(46000);
  const [creditScore, setCreditScore] = useState(700);

  const handleContinue = () => {
    onComplete({ budget, creditScore });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-4xl mx-auto text-white relative z-20 min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full"
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
          Let's Talk <span className="text-red-600">Budget</span>
        </h2>
        <p className="text-xl text-gray-300">
          Help us find options that fit your financial situation
        </p>
      </motion.div>

      <div className="space-y-12">
        {/* Budget Slider */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-300 mb-2 block">
              $ Your Budget
            </label>
            <motion.div
              className="text-5xl font-black text-red-600 mb-6"
              key={budget}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              ${budget.toLocaleString()}
            </motion.div>
          </div>
          <Slider
            value={budget}
            onChange={(val: number) => setBudget(val)}
            min={20000}
            max={80000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>$20,000</span>
            <span>$80,000</span>
          </div>
        </motion.div>

        {/* Credit Score Slider */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4">
            <label className="text-lg font-semibold text-gray-300 mb-2 block">
              Credit Score
            </label>
            <div className="flex items-baseline gap-4 mb-2">
              <motion.div
                className="text-5xl font-black text-red-600"
                key={creditScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {creditScore}
              </motion.div>
              <motion.p
                className="text-xl text-white font-semibold"
                key={getCreditScoreLabel(creditScore)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {getCreditScoreLabel(creditScore)}
              </motion.p>
            </div>
          </div>
          <Slider
            value={creditScore}
            onChange={(val: number) => setCreditScore(val)}
            min={500}
            max={850}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>500</span>
            <span>850</span>
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <button
          type="button"
          onClick={handleContinue}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 font-semibold inline-flex items-center cursor-pointer relative z-10"
        >
          Find My Perfect Car
          <Zap className="w-6 h-6 ml-2" />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BudgetStage;

