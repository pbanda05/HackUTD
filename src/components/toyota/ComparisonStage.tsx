// src/components/toyota/ComparisonStage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Users, Fuel, Star, Loader2, Sparkles } from 'lucide-react';
import Car3DViewer from './Car3DViewer';

// NOTE: If you want to use your Base44 client, pass a `recommendModel` prop:
// recommendModel: (prefs) => Promise<string>

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
  id: 'camry' | 'rav4' | 'highlander' | 'tacoma';
  name: 'Camry' | 'RAV4' | 'Highlander' | 'Tacoma';
  tagline: string;
  price: number;
  specs: ModelSpec;
  highlights: string[];
};

const MODELS: Model[] = [
  {
    id: 'camry',
    name: 'Camry',
    tagline: 'The Icon Redefined',
    price: 28000,
    specs: { horsepower: 203, mpg: 32, seating: 5, rating: 4.8 },
    highlights: ['Advanced Safety', 'Hybrid Available', 'Sport Mode'],
  },
  {
    id: 'rav4',
    name: 'RAV4',
    tagline: 'Adventure Awaits',
    price: 32000,
    specs: { horsepower: 203, mpg: 30, seating: 5, rating: 4.7 },
    highlights: ['AWD Available', 'Spacious Interior', 'Off-Road Ready'],
  },
  {
    id: 'highlander',
    name: 'Highlander',
    tagline: 'Family Luxury',
    price: 38000,
    specs: { horsepower: 295, mpg: 24, seating: 8, rating: 4.9 },
    highlights: ['3-Row Seating', 'Premium Interior', 'Towing Capacity'],
  },
  {
    id: 'tacoma',
    name: 'Tacoma',
    tagline: 'Built for Legends',
    price: 34000,
    specs: { horsepower: 278, mpg: 20, seating: 5, rating: 4.6 },
    highlights: ['Off-Road Package', 'Rugged Design', 'Best Resale Value'],
  },
];

const NAME_TO_ID: Record<Model['name'], Model['id']> = {
  Camry: 'camry',
  RAV4: 'rav4',
  Highlander: 'highlander',
  Tacoma: 'tacoma',
};

const sanitizeToModelId = (value: string | null | undefined): Model['id'] | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed in NAME_TO_ID) return NAME_TO_ID[trimmed as Model['name']];
  // also try case-insensitive match
  const found = Object.entries(NAME_TO_ID).find(
    ([k]) => k.toLowerCase() === trimmed.toLowerCase()
  );
  return found ? found[1] : null;
};

// very simple fallback heuristic if no recommendModel is provided
const fallbackRecommend = (prefs: Preferences): Model['name'] => {
  const usage = String(prefs.usage ?? '').toLowerCase();
  const lifestyle = String(prefs.lifestyle ?? '').toLowerCase();
  const budgetNum =
    typeof prefs.budget === 'number'
      ? prefs.budget
      : Number(String(prefs.budget ?? '').replace(/[^0-9.]/g, ''));

  if (usage.includes('off') || lifestyle.includes('adventure')) return 'RAV4';
  if (usage.includes('family') || lifestyle.includes('family')) return 'Highlander';
  if (!Number.isNaN(budgetNum) && budgetNum < 30000) return 'Camry';
  if (usage.includes('haul') || usage.includes('work') || usage.includes('truck')) return 'Tacoma';
  return 'Camry';
};

const ComparisonStage: React.FC<ComparisonStageProps> = ({ preferences, onComplete, recommendModel }) => {
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
          name = (['Camry', 'RAV4', 'Highlander', 'Tacoma'] as const).includes(
            raw as Model['name']
          )
            ? (raw as Model['name'])
            : 'Camry';
        } else {
          // Use API if no recommendModel prop is provided
          try {
            const { api } = await import('@/services/api');
            const result = await api.recommendModel(preferences);
            name = (['Camry', 'RAV4', 'Highlander', 'Tacoma'] as const).includes(
              result.model as Model['name']
            )
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
  const getMatchScore = (modelId: string) => matchScores[modelId] || 3;

  return (
    <div className="text-white py-20 px-6 max-w-7xl mx-auto relative min-h-[calc(100vh-200px)] flex flex-col justify-center items-center w-full">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Choose Your <span className="text-red-600">Champion</span>
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
          {/* AI Analysis Card */}
          {aiAnalysis && aiRecommendation && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12 bg-gradient-to-br from-purple-900/50 to-purple-800/30 backdrop-blur-lg rounded-3xl p-8 border border-purple-500/30"
            >
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    AI Recommends: {aiRecommendation}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {aiAnalysis}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Car Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              const isHovered = hoveredModel === model.id;
              const isRecommended = recommendedModelId === model.id;
              const matchScore = getMatchScore(model.id);

              return (
                <motion.div
                  key={model.id}
                  className={`relative rounded-2xl border overflow-hidden transition-all ${
                    isSelected
                      ? 'border-red-500 bg-gradient-to-b from-gray-900 to-red-600/20 ring-4 ring-red-500/30'
                      : isRecommended
                      ? 'border-red-500 bg-gradient-to-b from-gray-900 to-gray-900/70'
                      : 'border-gray-700 bg-gradient-to-b from-gray-900 to-gray-900/50'
                  } cursor-pointer ${
                    isHovered ? 'scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => handleSelectModel(model.id)}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* AI Recommended Badge */}
                  {isRecommended && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10">
                      <Sparkles className="w-3 h-3" />
                      AI Recommended
                    </div>
                  )}

                  {/* Match Score Badge */}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
                    matchScore >= 4 ? 'bg-green-600/80 text-white' :
                    matchScore >= 3 ? 'bg-yellow-600/80 text-white' :
                    'bg-gray-600/80 text-white'
                  }`}>
                    {matchScore}/5 Match
                  </div>

                  {/* Car Image Section */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden">
                    <Car3DViewer 
                      key={`${model.id}-${isSelected}`}
                      modelId={model.id} 
                      isActive={isSelected || isRecommended}
                      color={{ hex: '#C1272D' }}
                    />
                  </div>

                  {/* Content Section */}
                  <div className={`p-6 ${isSelected ? 'bg-red-600' : isRecommended ? 'bg-gray-900' : 'bg-gray-900/90'}`}>
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

          {selectedModel && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button
                type="button"
                onClick={handleContinue}
                className="bg-red-600 hover:bg-red-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-red-600/50 transition-all inline-flex items-center cursor-pointer relative z-10"
              >
                Continue <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default ComparisonStage;
