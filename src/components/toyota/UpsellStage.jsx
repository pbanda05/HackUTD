import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, TrendingUp, TrendingDown, Sparkles, Loader2 } from 'lucide-react';
import Car3DViewer from './Car3DViewer';

export default function UpsellStage({ journeyData, onBack, onComplete }) {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedOption, setSelectedOption] = useState('current');

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const { api } = await import('@/services/api');
        const response = await api.getRecommendations(journeyData);
        setRecommendations(response);
      } catch (error) {
        console.error('Recommendations failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [journeyData]);

  const handleContinue = () => {
    onComplete(selectedOption, recommendations);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto text-center py-20"
      >
        <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto mb-4" />
        <p className="text-2xl text-white">Analyzing your perfect configuration...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-7xl mx-auto relative"
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
          One More <span className="text-red-600">Thing...</span>
        </h2>
        <p className="text-xl text-gray-300">
          We found some options you might want to consider
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6 mb-12">
        {/* Downsell Option - First (Left) */}
        {(recommendations?.should_downsell && recommendations.downsell_option) ? (
          <motion.div
            className={`relative bg-white/5 backdrop-blur-lg rounded-[2rem] p-6 border transition-all duration-500 ${
              selectedOption === 'downsell' ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-white/10'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              DOWNGRADE
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{recommendations.downsell_option.title}</h3>
            <p className="text-gray-400 mb-4 text-sm">{recommendations.downsell_option.description}</p>
            
            <div className="space-y-2 mb-4">
              {recommendations.downsell_option.benefits.slice(0, 3).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">You Save:</span>
                <span className="text-blue-400 font-bold">${recommendations.downsell_option.savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Monthly:</span>
                <span className="text-white font-bold">${recommendations.downsell_option.new_monthly}/mo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOption('downsell')}
              className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer relative z-10 ${
                selectedOption === 'downsell'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {selectedOption === 'downsell' ? 'Selected ✓' : 'Downgrade'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            className={`relative bg-white/5 backdrop-blur-lg rounded-[2rem] p-6 border transition-all duration-500 ${
              selectedOption === 'downsell' ? 'border-blue-500 ring-4 ring-blue-500/30' : 'border-white/10'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              DOWNGRADE
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Smart Savings Option</h3>
            <p className="text-gray-400 mb-4 text-sm">Get the same great experience while staying within your budget</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Same reliable performance</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Essential features included</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Lower monthly payments</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">You Save:</span>
                <span className="text-blue-400 font-bold">$5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Monthly:</span>
                <span className="text-white font-bold">${Math.max(0, Math.round(journeyData.financing.monthlyPayment - (5000 / 60)))}/mo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOption('downsell')}
              className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer relative z-10 ${
                selectedOption === 'downsell'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {selectedOption === 'downsell' ? 'Selected ✓' : 'Downgrade'}
            </button>
          </motion.div>
        )}

        {/* Current Selection - Middle */}
        <motion.div
          className={`relative bg-white/5 backdrop-blur-lg rounded-[2rem] p-6 border transition-all duration-500 ${
            selectedOption === 'current' ? 'border-red-500 ring-4 ring-red-500/30' : 'border-white/10'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-lg text-white px-3 py-1 rounded-full text-xs font-bold">
            YOUR CHOICE
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">Current Selection</h3>
          <p className="text-gray-400 mb-4">{journeyData.selectedModel.name}</p>
          
          <div className="h-40 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-2xl mb-4">
            <Car3DViewer 
              modelId={journeyData.selectedModel.id} 
              isActive={selectedOption === 'current'}
              color={journeyData.customization.color}
            />
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Price:</span>
              <span className="text-white font-bold">${journeyData.customization.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly:</span>
              <span className="text-white font-bold">${journeyData.financing.monthlyPayment}/mo</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedOption('current')}
            className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer relative z-10 ${
              selectedOption === 'current'
                ? 'bg-red-600 text-white'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {selectedOption === 'current' ? 'Selected ✓' : 'Keep This'}
          </button>
        </motion.div>

        {/* Upsell Option - Last (Right) */}
        {(recommendations?.should_upsell && recommendations.upsell_option) ? (
          <motion.div
            className={`relative bg-white/5 backdrop-blur-lg rounded-[2rem] p-6 border transition-all duration-500 ${
              selectedOption === 'upsell' ? 'border-green-500 ring-4 ring-green-500/30' : 'border-white/10'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              UPGRADE
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">{recommendations.upsell_option.title}</h3>
            <p className="text-gray-400 mb-4 text-sm">{recommendations.upsell_option.description}</p>
            
            <div className="space-y-2 mb-4">
              {recommendations.upsell_option.benefits.slice(0, 3).map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Additional Cost:</span>
                <span className="text-green-400 font-bold">+${recommendations.upsell_option.additional_cost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Monthly:</span>
                <span className="text-white font-bold">${recommendations.upsell_option.new_monthly}/mo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOption('upsell')}
              className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer relative z-10 ${
                selectedOption === 'upsell'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {selectedOption === 'upsell' ? 'Selected ✓' : 'Upgrade'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            className={`relative bg-white/5 backdrop-blur-lg rounded-[2rem] p-6 border transition-all duration-500 ${
              selectedOption === 'upsell' ? 'border-green-500 ring-4 ring-green-500/30' : 'border-white/10'
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              UPGRADE
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">Premium Upgrade Package</h3>
            <p className="text-gray-400 mb-4 text-sm">Enhance your experience with premium features and upgrades</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Premium sound system upgrade</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Advanced safety features</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">Extended warranty coverage</span>
              </div>
            </div>

            <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Additional Cost:</span>
                <span className="text-green-400 font-bold">+$8,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">New Monthly:</span>
                <span className="text-white font-bold">${Math.round(journeyData.financing.monthlyPayment + (8000 / 60))}/mo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOption('upsell')}
              className={`w-full py-3 rounded-full font-semibold transition-all cursor-pointer relative z-10 ${
                selectedOption === 'upsell'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {selectedOption === 'upsell' ? 'Selected ✓' : 'Upgrade'}
            </button>
          </motion.div>
        )}
      </div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          onClick={handleContinue}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-red-600/50 font-semibold inline-flex items-center hover:scale-105 transition-all cursor-pointer relative z-10"
        >
          Continue to Reveal
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </motion.div>
    </motion.div>
  );
}
