import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Share2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Car3DViewer from './Car3DViewer';

export default function RevealStage({ journeyData }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [garageOpen, setGarageOpen] = useState(false);

  useEffect(() => {
    // Trigger garage door opening
    setTimeout(() => setGarageOpen(true), 500);
    // Trigger confetti
    setTimeout(() => setShowConfetti(true), 1500);
  }, []);

  const { selectedModel, customization, financing } = journeyData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto relative"
    >
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#EF4444', '#FFFFFF', '#000000', '#DC2626'][i % 4],
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

      {/* Spotlight Effect */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Title Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className="w-16 h-16 text-red-500 mx-auto" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-4">
            Welcome to
            <br />
            <span className="text-red-600">Your Dream</span>
          </h1>
          <p className="text-2xl text-gray-300">
            Your {selectedModel?.name} is ready to hit the road!
          </p>
        </motion.div>

        {/* Garage Reveal */}
        <motion.div
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Garage Door */}
          <motion.div
            className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 z-20"
            initial={{ y: 0 }}
            animate={{ y: garageOpen ? '-100%' : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            {/* Garage Door Panels */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-[12.5%] border-b border-gray-700"
                style={{ backgroundColor: `rgba(31, 41, 55, ${1 - i * 0.1})` }}
              />
            ))}
          </motion.div>

          {/* Car Display */}
          <div className="relative z-10 p-12">
            <motion.div
              className="h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: garageOpen ? 1 : 0 }}
              transition={{ delay: 1 }}
            >
              <Car3DViewer modelId={selectedModel?.id} isActive={garageOpen} />
            </motion.div>

            {/* Spotlights */}
            {garageOpen && (
              <>
                <motion.div
                  className="absolute top-0 left-1/4 w-32 h-full bg-gradient-to-b from-yellow-500/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-0 right-1/4 w-32 h-full bg-gradient-to-b from-yellow-500/20 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-600/20">
            <Car className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-1">Model</p>
            <p className="text-2xl font-bold text-white">{selectedModel?.name}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-600/20">
            <div className="w-8 h-8 rounded-full mx-auto mb-3" style={{ backgroundColor: customization?.color?.hex }} />
            <p className="text-gray-400 text-sm mb-1">Color</p>
            <p className="text-xl font-bold text-white">{customization?.color?.name}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-600/20">
            <Sparkles className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm mb-1">Package</p>
            <p className="text-xl font-bold text-white">{customization?.package?.name}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 border border-red-600/20">
            <div className="text-3xl mb-3">💰</div>
            <p className="text-gray-400 text-sm mb-1">Monthly</p>
            <p className="text-2xl font-bold text-red-500">${financing?.monthlyPayment}/mo</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.3 }}
        >
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl shadow-red-600/50"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Summary
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-8 py-6 text-lg rounded-full"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Your Dream
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full"
            onClick={() => window.location.reload()}
          >
            Start New Journey
          </Button>
        </motion.div>

        {/* Final Message */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <p className="text-xl text-gray-400 mb-2">
            Ready to make this dream a reality?
          </p>
          <p className="text-3xl font-bold text-white">
            Visit your nearest <span className="text-red-600">Toyota</span> dealer today!
          </p>
        </motion.div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-red-600/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}