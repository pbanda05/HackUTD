import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Model recommendation endpoint with AI analysis
app.post('/api/recommend-model', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // TODO: Replace with actual LLM integration (e.g., OpenAI, Anthropic, or Base44)
    // For now, using a simple heuristic with analysis
    const recommendation = getModelRecommendation(preferences);
    const analysis = getModelAnalysis(preferences, recommendation);
    const matchScores = getMatchScores(preferences, recommendation);
    
    res.json({ 
      model: recommendation,
      analysis: analysis,
      matchScores: matchScores
    });
  } catch (error) {
    console.error('Error in recommend-model:', error);
    res.status(500).json({ error: 'Failed to get recommendation' });
  }
});

// Upsell/Downsell recommendations endpoint
app.post('/api/recommendations', async (req, res) => {
  try {
    const { journeyData } = req.body;
    
    // TODO: Replace with actual LLM integration
    // For now, using a simple calculation-based approach
    const recommendations = getUpsellDownsellRecommendations(journeyData);
    
    res.json(recommendations);
  } catch (error) {
    console.error('Error in recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Helper function for model recommendation
function getModelRecommendation(preferences) {
  const usage = String(preferences.usage ?? '').toLowerCase();
  const lifestyle = String(preferences.lifestyle ?? '').toLowerCase();
  const budgetNum =
    typeof preferences.budget === 'number'
      ? preferences.budget
      : Number(String(preferences.budget ?? '').replace(/[^0-9.]/g, ''));

  if (usage.includes('off') || lifestyle.includes('adventure')) return 'RAV4';
  if (usage.includes('family') || lifestyle.includes('family')) return 'Highlander';
  if (!Number.isNaN(budgetNum) && budgetNum < 30000) return 'Camry';
  if (usage.includes('haul') || usage.includes('work') || usage.includes('truck')) return 'Tacoma';
  return 'Camry';
}

// Helper function to generate AI analysis reasoning
function getModelAnalysis(preferences, recommendedModel) {
  const lifestyle = String(preferences.lifestyle ?? '').toLowerCase();
  const usage = String(preferences.usage ?? '').toLowerCase();
  const location = String(preferences.location ?? '').toLowerCase();
  const budgetNum = typeof preferences.budget === 'number'
    ? preferences.budget
    : Number(String(preferences.budget ?? '').replace(/[^0-9.]/g, '')) || 0;

  const analyses = {
    'RAV4': `The RAV4 is the best fit for ${lifestyle || 'an adventurous'} lifestyle due to its versatility, ample cargo space for gear, and off-road capabilities while remaining comfortable for ${usage || 'weekend trips'}. It perfectly balances adventure-oriented features and practicality for ${location || 'mixed'} driving conditions.`,
    'Highlander': `The Highlander is the ideal choice for ${lifestyle || 'family-focused'} needs with its spacious 3-row seating, premium interior, and advanced safety features. It provides the perfect combination of luxury and functionality for ${usage || 'family'} use, making it excellent for ${location || 'suburban'} driving.`,
    'Camry': `The Camry offers exceptional value and reliability, making it perfect for ${lifestyle || 'daily'} commuting and ${usage || 'city'} driving. With excellent fuel economy and advanced safety features, it's an ideal choice for ${location || 'urban'} environments while staying within budget.`,
    'Tacoma': `The Tacoma is built for ${lifestyle || 'adventurous'} individuals who need rugged capability and durability. Its off-road prowess, towing capacity, and legendary reliability make it perfect for ${usage || 'work'} and ${location || 'rural'} driving conditions.`
  };

  return analyses[recommendedModel] || analyses['Camry'];
}

// Helper function to calculate match scores for each model
function getMatchScores(preferences, recommendedModel) {
  const lifestyle = String(preferences.lifestyle ?? '').toLowerCase();
  const usage = String(preferences.usage ?? '').toLowerCase();
  const location = String(preferences.location ?? '').toLowerCase();
  const budgetNum = typeof preferences.budget === 'number'
    ? preferences.budget
    : Number(String(preferences.budget ?? '').replace(/[^0-9.]/g, '')) || 0;

  const scores = {
    'camry': 0,
    'rav4': 0,
    'highlander': 0,
    'tacoma': 0
  };

  // Score based on lifestyle
  if (lifestyle.includes('adventure')) {
    scores.rav4 += 2;
    scores.tacoma += 2;
  }
  if (lifestyle.includes('family')) {
    scores.highlander += 2;
    scores.rav4 += 1;
  }
  if (lifestyle.includes('city') || lifestyle.includes('commute')) {
    scores.camry += 2;
    scores.rav4 += 1;
  }

  // Score based on usage
  if (usage.includes('off') || usage.includes('offroad')) {
    scores.rav4 += 2;
    scores.tacoma += 2;
  }
  if (usage.includes('family') || usage.includes('longtrips')) {
    scores.highlander += 2;
    scores.rav4 += 1;
  }
  if (usage.includes('daily') || usage.includes('commute')) {
    scores.camry += 2;
  }
  if (usage.includes('haul') || usage.includes('work') || usage.includes('truck')) {
    scores.tacoma += 2;
  }

  // Score based on budget
  if (budgetNum >= 35000) {
    scores.highlander += 1;
    scores.tacoma += 1;
  }
  if (budgetNum < 30000) {
    scores.camry += 2;
  }
  if (budgetNum >= 30000 && budgetNum < 35000) {
    scores.rav4 += 1;
  }

  // Score based on location
  if (location.includes('rural') || location.includes('off')) {
    scores.tacoma += 1;
    scores.rav4 += 1;
  }
  if (location.includes('urban') || location.includes('city')) {
    scores.camry += 1;
  }

  // Convert recommended model name to ID
  const recommendedId = recommendedModel.toLowerCase();
  
  // Ensure recommended model has the highest score
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0 && recommendedId in scores) {
    // Set recommended model to max score + bonus to ensure it's highest
    scores[recommendedId] = maxScore + 2;
  }

  // Normalize scores to 1-5 scale, ensuring recommended is 5/5
  const newMaxScore = Math.max(...Object.values(scores));
  const normalizedScores = {};
  Object.keys(scores).forEach(key => {
    if (newMaxScore > 0) {
      const normalized = Math.max(1, Math.round((scores[key] / newMaxScore) * 5));
      // Ensure recommended model is always 5/5
      if (key === recommendedId) {
        normalizedScores[key] = 5;
      } else {
        normalizedScores[key] = normalized;
      }
    } else {
      normalizedScores[key] = key === recommendedId ? 5 : 3;
    }
  });

  return normalizedScores;
}

// Helper function for upsell/downsell recommendations
function getUpsellDownsellRecommendations(journeyData) {
  const { selectedModel, customization, preferences, financing } = journeyData;
  // Handle both object and legacy string format
  const modelPrice = selectedModel?.price || (typeof selectedModel === 'object' && selectedModel?.price) || 0;
  const totalPrice = customization?.totalPrice || modelPrice || 0;
  const budget = typeof preferences?.budget === 'number' 
    ? preferences.budget 
    : Number(String(preferences?.budget ?? '').replace(/[^0-9.]/g, '')) || 0;
  const monthlyPayment = financing?.monthlyPayment || 0;

  const shouldUpsell = budget > totalPrice && (budget - totalPrice) > 5000;
  const shouldDownsell = totalPrice > budget && (totalPrice - budget) > 3000;

  const result = {
    should_upsell: shouldUpsell,
    should_downsell: shouldDownsell,
    upsell_option: null,
    downsell_option: null,
  };

  if (shouldUpsell) {
    const additionalCost = Math.min(10000, budget - totalPrice);
    const newTotal = totalPrice + additionalCost;
    const newMonthly = monthlyPayment + (additionalCost / 60); // 60 month loan estimate

    result.upsell_option = {
      title: 'Premium Upgrade Package',
      description: 'Enhance your experience with premium features and upgrades',
      additional_cost: additionalCost,
      new_monthly: Math.round(newMonthly),
      benefits: [
        'Premium sound system upgrade',
        'Advanced safety features',
        'Extended warranty coverage',
        'Premium interior materials',
      ],
    };
  }

  if (shouldDownsell) {
    const savings = Math.min(8000, totalPrice - budget);
    const newTotal = totalPrice - savings;
    const newMonthly = monthlyPayment - (savings / 60);

    result.downsell_option = {
      title: 'Smart Savings Option',
      description: 'Get the same great experience while staying within your budget',
      savings: savings,
      new_monthly: Math.round(newMonthly),
      benefits: [
        'Same reliable performance',
        'Essential features included',
        'Lower monthly payments',
        'Better budget alignment',
      ],
    };
  }

  return result;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});

