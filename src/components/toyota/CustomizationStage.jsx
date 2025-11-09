
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Palette, Package, Settings } from 'lucide-react';
import Car3DViewer from './Car3DViewer';

const COLORS = [
  { id: 'red', name: 'Supersonic Red', hex: '#C1272D', glow: 'shadow-red-500/50' },
  { id: 'black', name: 'Midnight Black', hex: '#0A0A0A', glow: 'shadow-gray-500/50' },
  { id: 'white', name: 'Blizzard Pearl', hex: '#F0F0F0', glow: 'shadow-gray-300/50' },
  { id: 'silver', name: 'Celestial Silver', hex: '#C0C0C0', glow: 'shadow-gray-400/50' },
  { id: 'blue', name: 'Blueprint', hex: '#1E3A8A', glow: 'shadow-blue-500/50' }
];

const PACKAGES = [
  {
    id: 'base',
    name: 'Base Package',
    price: 0,
    features: ['Standard Features', 'Cloth Seats', 'Basic Audio']
  },
  {
    id: 'premium',
    name: 'Premium Package',
    price: 3500,
    features: ['Leather Seats', 'Sunroof', 'Premium Audio', 'Advanced Safety']
  },
  {
    id: 'luxury',
    name: 'Luxury Package',
    price: 6500,
    features: ['Premium Leather', 'Panoramic Roof', 'Premium Sound', 'All Safety Features', 'Heated & Cooled Seats']
  }
];

const EXTRAS = [
  { id: 'tint', name: 'Window Tint', price: 400 },
  { id: 'mats', name: 'All-Weather Mats', price: 200 },
  { id: 'cargo', name: 'Cargo Organizer', price: 150 },
  { id: 'roof', name: 'Roof Rack', price: 800 }
];

export default function CustomizationStage({ selectedModel, onComplete }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[0]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const toggleExtra = (extra) => {
    setSelectedExtras(prev =>
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const totalPrice = selectedModel.price + selectedPackage.price + 
    selectedExtras.reduce((sum, e) => sum + e.price, 0);

  const handleContinue = () => {
    onComplete({
      color: selectedColor,
      package: selectedPackage,
      extras: selectedExtras,
      totalPrice
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="max-w-7xl mx-auto"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Make It <span className="text-red-600">Yours</span>
        </h2>
        <p className="text-xl text-gray-300">
          Customize your {selectedModel.name} to perfection
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Left: Preview */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-[2rem] p-8 relative overflow-hidden border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent" />
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">Your {selectedModel.name}</h3>
              <div className="h-80 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl mb-4 overflow-hidden">
                <Car3DViewer modelId={selectedModel.id} isActive={true} color={selectedColor} />
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm rounded-2xl">
                <div>
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <motion.p
                    className="text-4xl font-black text-white"
                    key={totalPrice}
                    initial={{ scale: 1.2, color: '#EF4444' }}
                    animate={{ scale: 1, color: '#FFFFFF' }}
                    transition={{ duration: 0.3 }}
                  >
                    ${totalPrice.toLocaleString()}
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{selectedColor.name}</p>
                  <p className="text-sm text-red-400">{selectedPackage.name}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Options */}
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Colors */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-bold text-white">Exterior Color</h3>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {COLORS.map((color) => {
                const isSelected = selectedColor.id === color.id;
                return (
                  <motion.button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`relative aspect-square rounded-3xl transition-all duration-300 ${
                      isSelected ? `ring-4 ring-red-500 ring-offset-4 ring-offset-black shadow-2xl ${color.glow}` : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-black text-lg">✓</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-sm text-gray-400 mt-2">{selectedColor.name}</p>
          </div>

          {/* Packages */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-bold text-white">Package</h3>
            </div>
            <div className="space-y-3">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackage.id === pkg.id;
                return (
                  <motion.button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left p-6 rounded-3xl transition-all duration-300 backdrop-blur-lg ${
                      isSelected
                        ? 'bg-red-600 ring-4 ring-red-500 ring-offset-2 ring-offset-black shadow-lg shadow-red-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white">{pkg.name}</h4>
                      <p className="text-lg font-bold text-white">
                        {pkg.price === 0 ? 'Included' : `+$${pkg.price.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <p key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          {feature}
                        </p>
                      ))}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Extras */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-red-400" />
              <h3 className="text-2xl font-bold text-white">Add-Ons</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EXTRAS.map((extra) => {
                const isSelected = selectedExtras.find(e => e.id === extra.id);
                return (
                  <motion.button
                    key={extra.id}
                    onClick={() => toggleExtra(extra)}
                    className={`p-4 rounded-2xl transition-all duration-300 backdrop-blur-lg ${
                      isSelected
                        ? 'bg-red-600 ring-2 ring-red-500 shadow-lg shadow-red-500/30'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <p className="text-white font-semibold text-sm mb-1">{extra.name}</p>
                    <p className="text-white font-bold">+${extra.price}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={handleContinue}
          className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-red-600/50 hover:scale-105 transition-all font-semibold inline-flex items-center"
        >
          Continue to Financing
          <ChevronRight className="w-6 h-6 ml-2" />
        </button>
      </motion.div>
    </motion.div>
  );
}
