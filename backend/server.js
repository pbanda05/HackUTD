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

// Model recommendation endpoint
app.post('/api/recommend-model', async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // TODO: Replace with actual LLM integration (e.g., OpenAI, Anthropic, or Base44)
    // For now, using a simple heuristic
    const recommendation = getModelRecommendation(preferences);
    
    res.json({ model: recommendation });
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

