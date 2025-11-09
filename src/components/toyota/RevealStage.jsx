import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, ArrowDown } from 'lucide-react';
import { generateToyotaInvoice } from '@/utils/pdfGenerator';

export default function RevealStage({ journeyData }) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(true), 500);
  }, []);

  const { selectedModel, customization, financing } = journeyData;
  const modelName = selectedModel?.name || 'RAV4';
  const colorName = customization?.color?.name || 'gray';
  const monthlyPayment = financing?.monthlyPayment || 478;
  const totalPrice = customization?.totalPrice || selectedModel?.price || 30375;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto relative text-center min-h-screen flex flex-col justify-center items-center w-full"
    >

      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(100)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#EF4444', '#FFFFFF', '#DC2626'][i % 3],
                  left: `${Math.random() * 100}%`,
                  top: -20
                }}
                initial={{ y: -20, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 720
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 pt-20 pb-20">
        {/* Title */}
        <motion.h1
          className="text-6xl md:text-8xl font-black text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome <span className="text-red-600">Home</span>
        </motion.h1>

        <motion.p
          className="text-2xl text-gray-300 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your dream {modelName} awaits
        </motion.p>

        {/* Summary Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Your Model Card */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-red-600 text-xs font-bold uppercase mb-2 tracking-wider">
              YOUR MODEL
            </p>
            <p className="text-4xl font-black text-white mb-1">{modelName}</p>
            <p className="text-gray-400 text-sm">{colorName}</p>
          </motion.div>

          {/* Monthly Payment Card */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-red-600 text-xs font-bold uppercase mb-2 tracking-wider">
              MONTHLY PAYMENT
            </p>
            <p className="text-4xl font-black text-white mb-1">${monthlyPayment}</p>
            <p className="text-gray-400 text-sm">Financed</p>
          </motion.div>

          {/* Total Price Card */}
          <motion.div
            className="bg-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p className="text-red-600 text-xs font-bold uppercase mb-2 tracking-wider">
              TOTAL PRICE
            </p>
            <p className="text-4xl font-black text-white mb-1">${totalPrice.toLocaleString()}</p>
            <p className="text-gray-400 text-sm">Including upgrades</p>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <button
            type="button"
            onClick={() => {
              generateToyotaInvoice(journeyData);
            }}
            className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10 inline-flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Summary
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10"
          >
            Start New Journey
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
