// Shared model data for the application
export const MODELS = [
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

export const getModelById = (id) => {
  return MODELS.find(model => model.id === id) || MODELS[0];
};

