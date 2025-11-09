import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car } from 'lucide-react';
import Car3DViewer from './Car3DViewer';
import { Slider } from '@/components/ui/slider';

const COLORS = [
  { id: 'red', name: 'Supersonic Red', hex: '#C1272D' },
  { id: 'white', name: 'Wind Chill Pearl', hex: '#F0F0F0' },
  { id: 'black', name: 'Midnight Black', hex: '#0A0A0A' },
  { id: 'silver', name: 'Celestial Silver', hex: '#C0C0C0' },
  { id: 'blue', name: 'Blueprint', hex: '#1E3A8A' },
  { id: 'gray', name: 'Magnetic Gray', hex: '#808080' }
];

const PACKAGES = [
  {
    id: 'premium',
    name: 'Premium Package',
    price: 2850,
    features: ['Leather Seats', 'Heated Steering', 'Premium Sound']
  },
  {
    id: 'tech',
    name: 'Tech Package',
    price: 1900,
    features: ['360° Camera', 'Parking Assist', 'Wireless Charging']
  },
  {
    id: 'sport',
    name: 'Sport Package',
    price: 2200,
    features: ['Sport Wheels', 'Spoiler', 'Performance Exhaust']
  }
];

export default function CustomizationStage({ selectedModel, onComplete }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [wheelSize, setWheelSize] = useState(18);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const basePrice = selectedModel?.price || 0;
  const packagePrice = selectedPackage?.price || 0;
  const totalPrice = basePrice + packagePrice;

  const handleContinue = () => {
    onComplete({
      color: selectedColor,
      wheelSize,
      package: selectedPackage,
      totalPrice
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-7xl mx-auto relative min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Customize Every <span className="text-red-600">Detail</span>
        </h2>
        <p className="text-xl text-gray-300">
          Make your {selectedModel?.name || 'car'} uniquely yours
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Car Preview & Price Summary */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Car Visualization */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
            <div className="h-64 bg-gradient-to-br from-gray-800 to-black rounded-xl mb-4 overflow-hidden">
              <Car3DViewer 
                modelId={selectedModel?.id || 'camry'} 
                isActive={true} 
                color={selectedColor} 
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-300">Base Price</span>
              <span className="text-white font-semibold">${basePrice.toLocaleString()}</span>
            </div>
            {selectedPackage && (
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">{selectedPackage.name}</span>
                <span className="text-red-500 font-semibold">+${selectedPackage.price.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-white text-lg font-bold">Total</span>
              <span className="text-white text-2xl font-black">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Customization Options */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Exterior Color */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-bold text-white">Exterior Color</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {COLORS.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-500 ring-4 ring-red-500/30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg mb-2"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className={`text-sm font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}>
                      {color.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wheel Size */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              Wheel Size: {wheelSize}"
            </h3>
            <div className="relative">
              <Slider
                value={wheelSize}
                onChange={(val) => setWheelSize(val)}
                min={17}
                max={21}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-400">
                <span>17"</span>
                <span>18"</span>
                <span>21"</span>
              </div>
            </div>
          </div>

          {/* Upgrade Packages */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Upgrade Packages</h3>
            <div className="space-y-3">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackage?.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(isSelected ? null : pkg)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'border-red-500 bg-red-600/20'
                        : 'border-gray-700 bg-gray-900/50 hover:bg-gray-900/70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white mb-1">{pkg.name}</h4>
                        <p className="text-sm text-gray-400">
                          {pkg.features.join(' • ')}
                        </p>
                      </div>
                      <span className={`text-lg font-bold ${
                        isSelected ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        +${pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          type="button"
          onClick={handleContinue}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10 inline-flex items-center"
        >
          Continue to Financing →
        </button>
      </motion.div>
    </motion.div>
  );
}
