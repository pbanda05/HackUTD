import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Zap, Users, Fuel, Star, Loader2, Sparkles } from 'lucide-react';
import Car3DViewer from './Car3DViewer';
import { MODELS as MODEL_DATA } from '../../data/models';


type Preferences = {
  lifestyle?: string;
  usage?: string;
  location?: string;
  budget?: number | string;
  creditScore?: number | string;
  [key: string]: unknown;
};

interface ComparisonStageProps {
  preferences: Preferences;
  onBack?: () => void;
  onComplete: (modelId: string) => void;
  /**
   * Optional async recommender. Return one of:
   * 'Camry' | 'RAV4' | 'Highlander' | 'Tacoma'
   */
  recommendModel?: (prefs: Preferences) => Promise<string>;
}

type ModelSpec = {
  horsepower: number;
  mpg: number;
  seating: number;
  rating: number;
};

type Model = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  specs: ModelSpec;
  highlights: string[];
  image: string;
  fuel_type: string;
  vehicle_type: 'sedan' | 'SUV' | 'truck' | 'coupe' | 'hatchback' | 'sedan/crossover';
};

const MODELS: Model[] = MODEL_DATA.map(model => {
  // Helper function to determine vehicle type from model name/id
  const getVehicleType = (id: string, name: string): Model['vehicle_type'] => {
    const idLower = id.toLowerCase();
    const nameLower = name.toLowerCase();
    if (idLower.includes('truck') || idLower.includes('tundra') || idLower.includes('tacoma')) return 'truck';
    if (idLower.includes('suv') || idLower.includes('rav4') || idLower.includes('highlander') || idLower.includes('sequoia') || idLower.includes('4runner') || idLower.includes('bz4x')) return 'SUV';
    if (idLower.includes('coupe') || idLower.includes('supra') || idLower.includes('gr86')) return 'coupe';
    if (idLower.includes('hatchback') || idLower.includes('corolla') || idLower.includes('prius')) return 'hatchback';
    if (idLower.includes('crown')) return 'sedan/crossover';
    return 'sedan';
  };

  // Helper function to determine fuel type from model name/id
  const getFuelType = (id: string, name: string): string => {
    const idLower = id.toLowerCase();
    const nameLower = name.toLowerCase();
    if (idLower.includes('bz4x') || idLower.includes('electric')) return 'electric';
    if (idLower.includes('hybrid') || idLower.includes('prius') || idLower.includes('crown') || idLower.includes('grandhighlander')) return 'hybrid';
    if (idLower.includes('iforce') || idLower.includes('tundra') || idLower.includes('sequoia')) return 'gas / hybrid';
    return 'gas';
  };

  // Helper function to get image path
  const getImagePath = (id: string): string => {
    // Default image path - you can update this based on your actual image structure
    return `/pics/${id}.webp`; // or .png, .jpg based on your actual files
  };

  return {
    id: model.id,
    name: model.name,
    tagline: model.tagline,
    price: model.price,
    specs: model.specs,
    highlights: model.highlights,
    image: (model as any).image || getImagePath(model.id),
    fuel_type: (model as any).fuel_type || getFuelType(model.id, model.name),
    vehicle_type: ((model as any).vehicle_type as Model['vehicle_type']) || getVehicleType(model.id, model.name),
  };
});

const NAME_TO_ID: Record<Model['name'], Model['id']> = {
  'Supra': 'supra',
  'Tundra TRD Pro i‑FORCE MAX': 'tundra_trd_pro_iforce_max',
  'Sequoia': 'sequoia',
  'GR Corolla': 'gr_corolla',
  'Tacoma TRD Pro i‑FORCE MAX': 'tacoma_trd_pro_iforce_max',
  'Tundra': 'tundra',
  'GR 86': 'gr86',
  'Grand Highlander': 'grandHighlander',
  '4Runner': '4runner',
  'Crown': 'crown',
  'Highlander': 'highlander',
  'bZ4X': 'bz4x',
  'Camry': 'camry',
  'RAV4': 'rav4',
  'Prius': 'prius',
  'Corolla': 'corolla'
};

const sanitizeToModelId = (value: string | null | undefined): Model['id'] | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed in NAME_TO_ID) return NAME_TO_ID[trimmed as Model['name']];
  const found = Object.entries(NAME_TO_ID).find(
    ([k]) => k.toLowerCase() === trimmed.toLowerCase()
  );
  return found ? found[1] : null;
};

// simple fallback when API/prop isn’t available
const fallbackRecommend = (prefs: Preferences): Model['name'] => {
  const usage = String(prefs.usage ?? '').toLowerCase();
  const lifestyle = String(prefs.lifestyle ?? '').toLowerCase();
  const budgetNum =
    typeof prefs.budget === 'number'
      ? prefs.budget
      : Number(String(prefs.budget ?? '').replace(/[^0-9.]/g, ''));

  if (usage.includes('off') || lifestyle.includes('adventure')) return '4Runner';
  if (usage.includes('family') || lifestyle.includes('family')) return 'Grand Highlander';
  if (!Number.isNaN(budgetNum) && budgetNum < 30000) return 'Corolla';
  if (usage.includes('haul') || usage.includes('work') || usage.includes('truck')) return 'Tundra';
  return 'Camry';
};

const ComparisonStage: React.FC<ComparisonStageProps> = ({ preferences, onBack, onComplete, recommendModel }) => {
  const [selectedModel, setSelectedModel] = useState<Model['id'] | null>(null);
  const [hoveredModel, setHoveredModel] = useState<Model['id'] | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<Model['name'] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [matchScores, setMatchScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        let name: Model['name'];
        let analysis = '';
        let scores: Record<string, number> = {};
        
        if (recommendModel) {
          const raw = await recommendModel(preferences);
          name = Object.keys(NAME_TO_ID).includes(raw)
            ? (raw as Model['name'])
            : 'Camry';
        } else {
          try {
            const { api } = await import('@/services/api');
            const result = await api.recommendModel(preferences);
            name = Object.keys(NAME_TO_ID).includes(result.model)
              ? (result.model as Model['name'])
              : fallbackRecommend(preferences);
            analysis = result.analysis || '';
            scores = result.matchScores || {};
          } catch (apiError) {
            console.error('API recommendation failed, using fallback:', apiError);
            name = fallbackRecommend(preferences);
          }
        }
        if (isMounted) {
          setAiRecommendation(name);
          setAiAnalysis(analysis);
          setMatchScores(scores);
        }
      } catch (err) {
        console.error('Recommendation failed, using fallback:', err);
        if (isMounted) {
          setAiRecommendation('Camry');
          setAiAnalysis('');
          setMatchScores({});
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [preferences, recommendModel]);

  const handleSelectModel = (modelId: Model['id']) => {
    setSelectedModel(modelId);
  };

  const handleContinue = () => {
    if (selectedModel) onComplete(selectedModel);
  };

  const recommendedModelId = aiRecommendation ? sanitizeToModelId(aiRecommendation) : null;
  const recommendedModel = recommendedModelId ? MODELS.find(m => m.id === recommendedModelId) : null;
  
  const getMatchScore = (modelId: string) => {
    if (!modelId || !matchScores) return 0;
    
    // Get the base score from the AI recommendations
    const baseScore = matchScores[modelId] || 0;
    
    // Find the model details
    const model = MODELS.find(m => m.id === modelId);
    if (!model) return baseScore;

    // Apply additional scoring based on preferences
    let additionalScore = 0;
    
    // Budget preference
    const budgetNum = typeof preferences.budget === 'number' 
      ? preferences.budget 
      : Number(String(preferences.budget ?? '').replace(/[^0-9.]/g, ''));
    
    if (!Number.isNaN(budgetNum)) {
      // Give higher score if price is within budget
      if (model.price <= budgetNum) additionalScore += 1;
      // Small penalty if significantly over budget (>20%)
      if (model.price > budgetNum * 1.2) additionalScore -= 0.5;
    }

    // Lifestyle preferences
    const lifestyle = String(preferences.lifestyle ?? '').toLowerCase();
    const usage = String(preferences.usage ?? '').toLowerCase();
    
    // Family preference matching
    if ((lifestyle.includes('family') || usage.includes('family')) && 
        (model.specs.seating >= 5 || model.highlights.some(h => h.toLowerCase().includes('family')))) {
      additionalScore += 0.5;
    }

    // Adventure/Off-road preference matching
    if ((lifestyle.includes('adventure') || usage.includes('off-road')) && 
        (model.vehicle_type === 'SUV' || model.vehicle_type === 'truck' ||
         model.highlights.some(h => h.toLowerCase().includes('off-road')))) {
      additionalScore += 0.5;
    }

    // Performance preference matching
    if ((lifestyle.includes('performance') || usage.includes('sport')) && 
        (model.specs.horsepower > 300 || model.highlights.some(h => h.toLowerCase().includes('performance')))) {
      additionalScore += 0.5;
    }

    // Eco-friendly preference matching
    if ((lifestyle.includes('eco') || usage.includes('efficient')) && 
        (model.fuel_type.includes('hybrid') || model.fuel_type === 'electric')) {
      additionalScore += 0.5;
    }

    // Location-based preferences (if available)
    const location = String(preferences.location ?? '').toLowerCase();
    if (location) {
      // Urban preference
      if (location.includes('city') && (model.vehicle_type === 'sedan' || model.vehicle_type === 'hatchback')) {
        additionalScore += 0.3;
      }
      // Rural/Suburban preference
      if ((location.includes('rural') || location.includes('suburban')) && 
          (model.vehicle_type === 'SUV' || model.vehicle_type === 'truck')) {
        additionalScore += 0.3;
      }
    }

    // Combine base score with additional scoring
    // Cap the final score at 5
    return Math.min(5, baseScore + additionalScore);
  };
  

  return (
    <div className="text-white py-20 px-6 max-w-7xl mx-auto relative min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full">
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
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Choose Your <span className="text-red-600">Car</span>
        </h2>
        <p className="text-xl text-gray-300">
          Each model is engineered for excellence
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
        </div>
      ) : (
        <>
          {/* AI Recommended Car - Large Rectangle */}
          {recommendedModel && (() => {
            const matchScore = getMatchScore(recommendedModelId!);
            if (!matchScore || matchScore < 1) return null;
            
            const isSelected = selectedModel === recommendedModel.id;
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                /* NEW: make the whole card selectable */
                onClick={() => handleSelectModel(recommendedModel.id)}
                className={`mb-12 w-full bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl border-2 overflow-hidden shadow-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'border-green-500 shadow-green-500/30 ring-4 ring-green-500/20'
                    : 'border-red-500 shadow-red-500/20'
                }`}
              >
                <div className="flex flex-row h-96">
                  {/* Left 1/4 - 3D Car Model */}
                  <div className="w-1/4 bg-linear-to-br from-gray-800 to-black relative overflow-hidden">
                    {/* AI Recommended Badge */}
                    <div className="absolute top-4 left-4 bg-linear-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 z-10 shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      AI Recommended
                    </div>
                    {/* Match Score Badge */}
                    <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10 ${
                      matchScore >= 4 ? 'bg-green-600/90 text-white' :
                      matchScore >= 3 ? 'bg-yellow-600/90 text-white' :
                      'bg-gray-600/90 text-white'
                    }`}>
                      {matchScore}/5 Match
                    </div>
                    {/* Car Image - Centered with top padding to avoid badges */}
                    <div className="absolute inset-0 flex items-center justify-center pt-16 pb-4 px-4 pointer-events-none">
                      {/* pointer-events-none ensures the canvas never blocks clicks */}
                      <div className="w-full h-full flex items-center justify-center p-4">
                        <img 
                          src={recommendedModel.image}
                          alt={recommendedModel.name}
                          className="max-w-[80%] max-h-[80%] w-auto h-auto rounded-2xl shadow-lg object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Right 3/4 - Information */}
                  <div className="w-3/4 p-8 flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                      <h3 className="text-4xl font-black text-white mb-2">{recommendedModel.name}</h3>
                      <p className="text-xl text-gray-300 mb-4">{recommendedModel.tagline}</p>
                      
                      {/* Price */}
                      <div className="mb-6">
                        <p className="text-5xl font-black text-red-500 mb-1">
                          ${recommendedModel.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">Starting MSRP</p>
                      </div>
                      
                      {/* AI Analysis */}
                      {aiAnalysis && (
                        <div className="mb-6 bg-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30">
                          <div className="flex items-start gap-3 mb-2">
                            <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
                            <h4 className="text-lg font-bold text-white">Why This Car?</h4>
                          </div>
                          <p className="text-gray-300 leading-relaxed text-sm">
                            {aiAnalysis}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom Section - Specs and Features */}
                    <div className="flex gap-8">
                      {/* Specs */}
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Specifications</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3">
                            <Fuel className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="text-xs text-gray-400">MPG</p>
                              <p className="text-lg font-bold text-white">{recommendedModel.specs.mpg}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="text-xs text-gray-400">Horsepower</p>
                              <p className="text-lg font-bold text-white">{recommendedModel.specs.horsepower} HP</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-red-500" />
                            <div>
                              <p className="text-xs text-gray-400">Seating</p>
                              <p className="text-lg font-bold text-white">{recommendedModel.specs.seating}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-yellow-400" />
                            <div>
                              <p className="text-xs text-gray-400">Safety</p>
                              <p className="text-lg font-bold text-white">{recommendedModel.specs.rating}★</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Key Features</h4>
                        <div className="space-y-2">
                          {recommendedModel.highlights.map((h) => (
                            <div key={h} className="flex items-center gap-2 text-white">
                              <span className="text-red-500 font-bold">✓</span>
                              <span className="text-sm">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Select Button */}
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Choose and immediately continue
                          handleSelectModel(recommendedModel.id);
                          onComplete(recommendedModel.id);
                        }}
                        className={`w-full py-4 rounded-lg font-bold text-lg transition-all cursor-pointer relative z-10 inline-flex items-center justify-center shadow-lg ${
                          isSelected
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-600/50'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/50'
                        }`}
                      >
                        {isSelected ? '✓ Selected' : `Select ${recommendedModel.name} →`}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Continue Button - shows for manual flow / non-AI cards */}
          {selectedModel ? (
            <motion.div
              key="continue-button"
              className="text-center mb-8 sticky top-4 z-50"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleContinue();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-16 py-6 rounded-full text-xl font-bold shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 inline-flex items-center cursor-pointer relative z-50"
              >
                Continue <ChevronRight className="w-6 h-6 ml-2" />
              </button>
            </motion.div>
          ) : null}

          {/* Other Car Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {MODELS
              .filter(model => !recommendedModelId || model.id !== recommendedModelId)
              .sort((a, b) => {
                const scoreA = getMatchScore(a.id);
                const scoreB = getMatchScore(b.id);
                return scoreB - scoreA; // Sort by highest match score
              })
              .map((model) => {
              const isSelected = selectedModel === model.id;
              const isHovered = hoveredModel === model.id;
              const matchScore = getMatchScore(model.id);

              return (
                <motion.div
                  key={model.id}
                  className={`relative rounded-2xl border overflow-hidden transition-all ${
                    isSelected
                      ? 'border-red-500 bg-linear-to-b from-gray-900 to-red-600/20 ring-4 ring-red-500/30'
                      : 'border-gray-700 bg-linear-to-b from-gray-900 to-gray-900/50'
                  } cursor-pointer ${
                    isHovered ? 'scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => handleSelectModel(model.id)}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Match Score Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    matchScore >= 4 ? 'bg-green-600/80 text-white' :
                    matchScore >= 3 ? 'bg-yellow-600/80 text-white' :
                    'bg-gray-600/80 text-white'
                  }`}>
                    {matchScore}/5 Match
                  </div>

                  {/* Car Image Section */}
                  <div className="h-48 bg-linear-to-br from-gray-800 to-black relative overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img 
                        src={model.image}
                        alt={model.name}
                        className="max-w-[70%] max-h-[70%] w-auto h-auto rounded-2xl shadow-lg object-contain"
                      />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 ${isSelected ? 'bg-red-600' : 'bg-gray-900/90'}`}>
                    <h3 className="text-2xl font-bold text-white mb-1">{model.name}</h3>
                    <p className="text-gray-300 mb-4 text-sm">{model.tagline}</p>
                    
                    <div className="mb-4">
                      <p className="text-3xl font-black text-white mb-1">
                        ${model.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-300">Starting MSRP</p>
                    </div>

                    {/* Specs */}
                    <div className="flex justify-between mb-4 text-sm">
                      <div className="flex flex-col items-center">
                        <Fuel className="w-5 h-5 text-white mb-1" />
                        <span className="text-white font-semibold">{model.specs.mpg} MPG</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5 text-white mb-1" />
                        <span className="text-white font-semibold">{model.specs.horsepower} HP</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Star className="w-5 h-5 text-yellow-400 mb-1" />
                        <span className="text-white font-semibold">5★ Safety</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4 space-y-1">
                      {model.highlights.slice(0, 2).map((h) => (
                        <div key={h} className="flex items-center gap-2 text-sm text-white">
                          <span className="text-red-500">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectModel(model.id);
                      }}
                      className={`w-full py-3 rounded-lg font-bold text-sm transition-all ${
                        isSelected
                          ? 'bg-white text-red-600'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      } cursor-pointer relative z-10 inline-flex items-center justify-center`}
                    >
                      Select {model.name} →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </>
      )}
    </div>
  );
};

export default ComparisonStage;