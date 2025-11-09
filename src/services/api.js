const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async recommendModel(preferences) {
    const response = await fetch(`${API_BASE_URL}/recommend-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences }),
    });

    if (!response.ok) {
      throw new Error('Failed to get model recommendation');
    }

    const data = await response.json();
    return {
      model: data.model,
      analysis: data.analysis,
      matchScores: data.matchScores
    };
  },

  async getRecommendations(journeyData) {
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ journeyData }),
    });

    if (!response.ok) {
      throw new Error('Failed to get recommendations');
    }

    const data = await response.json();
    return data;
  },
};

