// src/components/toyota/ComparisonStage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, Users, Fuel, Star, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        let name: Model['name'];
        if (recommendModel) {
          const raw = await recommendModel(preferences);
          name = (['Camry', 'RAV4', 'Highlander', 'Tacoma'] as const).includes(
            raw as Model['name']
          )
            ? (raw as Model['name'])
            : 'Camry';
        } else {
          name = fallbackRecommend(preferences);
        }
        if (isMounted) setAiRecommendation(name);
      } catch (err) {
        console.error('Recommendation failed, using fallback:', err);
        if (isMounted) setAiRecommendation('Camry');
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

  return (
    <div className="text-white text-center py-20 px-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl font-extrabold mb-8"
      >
        AI Matching Results
      </motion.h2>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
        </div>
      ) : (
        <>
          <p className="text-lg text-gray-300 mb-12">
            Our AI recommends:{' '}
            <span className="text-red-500 font-semibold">
              {aiRecommendation ?? 'Camry'}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {MODELS.map((model) => {
              const isSelected = selectedModel === model.id;
              const isHovered = hoveredModel === model.id;

              return (
                <motion.div
                  key={model.id}
                  className={`p-6 rounded-2xl border ${
                    isSelected
                      ? 'border-red-500 bg-red-600/20'
                      : 'border-gray-700 bg-gray-900/50'
                  } cursor-pointer transition-transform ${
                    isHovered ? 'scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => handleSelectModel(model.id)}
                  onMouseEnter={() => setHoveredModel(model.id)}
                  onMouseLeave={() => setHoveredModel(null)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                  <p className="text-gray-400 mb-4">{model.tagline}</p>
                  <p className="text-xl font-semibold mb-4">
                    ${model.price.toLocaleString()}
                  </p>

                  <ul className="text-sm text-gray-400 space-y-1 mb-4">
                    {model.highlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>

                  <div className="flex justify-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center">
                      <Zap className="w-4 h-4 mr-1" /> {model.specs.horsepower} HP
                    </span>
                    <span className="flex items-center">
                      <Fuel className="w-4 h-4 mr-1" /> {model.specs.mpg} MPG
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" /> {model.specs.seating}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" /> {model.specs.rating}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {selectedModel && (
            <motion.button
              onClick={handleContinue}
              className="mt-12 bg-red-600 hover:bg-red-700 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-red-600/50 transition-all inline-flex items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Continue <ChevronRight className="w-5 h-5 ml-2" />
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default ComparisonStage;
