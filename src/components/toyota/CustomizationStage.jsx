import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, ChevronLeft } from 'lucide-react';

// Mapping of car models to their Sketchfab embed URLs
const SKETCHFAB_MODELS = {
  camry: {
    embedUrl: 'https://sketchfab.com/models/147a0afe465144b5a474dc2f8c0a42cc/embed',
    modelUrl: 'https://sketchfab.com/3d-models/toyota-camry-hybrid-se-2021-147a0afe465144b5a474dc2f8c0a42cc?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc',
    title: 'Toyota Camry Hybrid SE 2021',
    author: 'SQUIR3D',
    authorUrl: 'https://sketchfab.com/SQUIR3D?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc'
  },
  highlander: {
    embedUrl: 'https://sketchfab.com/models/ff144d062f244a3ebfae71bc2a41564b/embed', // TODO: Replace with actual Highlander embed URL
    modelUrl: 'https://sketchfab.com/3d-models/toyota-camry-hybrid-se-2021-147a0afe465144b5a474dc2f8c0a42cc?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc', // TODO: Replace with actual Highlander model URL
    title: 'Toyota Highlander', // TODO: Update with actual title
    author: 'SQUIR3D', // TODO: Update with actual author
    authorUrl: 'https://sketchfab.com/SQUIR3D?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc' // TODO: Update with actual author URL
  },
  tacoma: {
    embedUrl: 'https://sketchfab.com/models/573f79c0d10647caa44b4c7d80533eaa/embed', // TODO: Replace with actual Highlander embed URL
    modelUrl: 'https://sketchfab.com/3d-models/toyota-camry-hybrid-se-2021-147a0afe465144b5a474dc2f8c0a42cc?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc', // TODO: Replace with actual Highlander model URL
    title: 'Toyota Highlander', // TODO: Update with actual title
    author: 'SQUIR3D', // TODO: Update with actual author
    authorUrl: 'https://sketchfab.com/SQUIR3D?utm_medium=embed&utm_campaign=share-popup&utm_content=147a0afe465144b5a474dc2f8c0a42cc' // TODO: Update with actual author URL
  },
  rav4: {
    embedUrl: 'https://sketchfab.com/models/ed155ad0cb7d447085a519eaff9aa2df/embed',
    modelUrl: 'https://sketchfab.com/3d-models/toyota-rav4-ed155ad0cb7d447085a519eaff9aa2df?utm_medium=embed&utm_campaign=share-popup&utm_content=ed155ad0cb7d447085a519eaff9aa2df',
    title: 'Toyota RAV4',
    author: 'SQUIR3D',
    authorUrl: 'https://sketchfab.com/SQUIR3D?utm_medium=embed&utm_campaign=share-popup&utm_content=ed155ad0cb7d447085a519eaff9aa2df'
  }
};

// Default to Camry if model not found
const getSketchfabModel = (modelId) => {
  return SKETCHFAB_MODELS[modelId?.toLowerCase()] || SKETCHFAB_MODELS.camry;
};

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

export default function CustomizationStage({ selectedModel, onBack, onComplete }) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [wheelSize, setWheelSize] = useState(18);
  const [selectedPackages, setSelectedPackages] = useState([]);

  const basePrice = selectedModel?.price || 0;
  const packagePrice = selectedPackages.reduce((sum, pkg) => sum + pkg.price, 0);
  const totalPrice = basePrice + packagePrice;
  
  // Get the appropriate Sketchfab model for the selected car
  const sketchfabModel = getSketchfabModel(selectedModel?.id);

  const handlePackageToggle = (pkg) => {
    setSelectedPackages(prev => {
      const isSelected = prev.some(selected => selected.id === pkg.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== pkg.id);
      } else {
        return [...prev, pkg];
      }
    });
  };

  const handleContinue = () => {
    onComplete({
      color: selectedColor,
      wheelSize,
      packages: selectedPackages,
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
            {selectedPackages.map((pkg) => (
              <div key={pkg.id} className="flex justify-between items-center mb-4">
                <span className="text-gray-300">{pkg.name}</span>
                <span className="text-red-500 font-semibold">+${pkg.price.toLocaleString()}</span>
              </div>
            ))}
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
              Wheel Size
            </h3>
            <div className="relative">
              <select
                value={wheelSize}
                onChange={(e) => setWheelSize(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-900/50 border-2 border-gray-700 rounded-xl text-white text-lg font-semibold focus:border-red-500 focus:ring-4 focus:ring-red-500/30 outline-none transition-all cursor-pointer hover:border-gray-600"
              >
                <option value={17} className="bg-gray-900 text-white">17"</option>
                <option value={18} className="bg-gray-900 text-white">18"</option>
                <option value={19} className="bg-gray-900 text-white">19"</option>
                <option value={20} className="bg-gray-900 text-white">20"</option>
                <option value={21} className="bg-gray-900 text-white">21"</option>
              </select>
            </div>
          </div>

          {/* Upgrade Packages */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Upgrade Packages</h3>
            <div className="space-y-3">
              {PACKAGES.map((pkg) => {
                const isSelected = selectedPackages.some(selected => selected.id === pkg.id);
                return (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => handlePackageToggle(pkg)}
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
