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
  {
    id: 'supra',
    name: 'Supra',
    tagline: 'Performance Elevated.',
    price: 56250,
    specs: {
      horsepower: 382,
      mpg: 27,
      seating: 2,
      rating: 4.9
    },
    fuel_type: 'gas',
    vehicle_type: 'coupe',
    highlights: ['Supercar Performance', 'Legendary Heritage', 'Track Ready'],
  },
  {
    id: 'tundra_trd_pro_iforce_max',
    name: 'Tundra TRD Pro i‑FORCE MAX',
    tagline: 'Heavy‑Duty Performance.',
    price: 72510,
    specs: {
      horsepower: 437,
      mpg: 17,
      seating: 5,
      rating: 4.9
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'truck',
    highlights: ['Maximum Power', 'TRD Pro Package', 'Heavy-Duty Towing'],
  },
  {
    id: 'sequoia',
    name: 'Sequoia',
    tagline: 'Maximum Capability',
    price: 62425,
    specs: {
      horsepower: 437,
      mpg: 22,
      seating: 7,
      rating: 4.8
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'SUV',
    highlights: ['Maximum Towing', 'Premium Luxury', 'Advanced Safety'],
  },
  {
    id: 'gr_corolla',
    name: 'GR Corolla',
    tagline: 'Race Inspired. Road Ready.',
    price: 39160,
    specs: {
      horsepower: 300,
      mpg: 24,
      seating: 5,
      rating: 4.9
    },
    fuel_type: 'gas',
    vehicle_type: 'hatchback',
    highlights: ['High Performance', 'Racing Heritage', 'Sport Mode'],
  },
  {
    id: 'tacoma_trd_pro_iforce_max',
    name: 'Tacoma TRD Pro i‑FORCE MAX',
    tagline: 'Off‑Road Beast.',
    price: 46320,
    specs: {
      horsepower: 326,
      mpg: 24,
      seating: 5,
      rating: 4.8
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'truck',
    highlights: ['Off-Road Beast', 'i-FORCE MAX', 'TRD Pro Package'],
  },
  {
    id: 'tundra',
    name: 'Tundra',
    tagline: 'Power. Performance. Precision.',
    price: 43355,
    specs: {
      horsepower: 389,
      mpg: 18,
      seating: 5,
      rating: 4.7
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'truck',
    highlights: ['Heavy-Duty Towing', 'i-FORCE Hybrid', 'Premium Interior'],
  },
  {
    id: 'gr86',
    name: 'GR 86',
    tagline: 'Pure Driving Joy.',
    price: 30400,
    specs: {
      horsepower: 228,
      mpg: 24,
      seating: 4,
      rating: 4.7
    },
    fuel_type: 'gas',
    vehicle_type: 'coupe',
    highlights: ['Sports Car', 'Track Ready', 'Pure Performance'],
  },
  {
    id: 'grandHighlander',
    name: 'Grand Highlander',
    tagline: 'More Space. More Power.',
    price: 40860,
    specs: {
      horsepower: 362,
      mpg: 34,
      seating: 7,
      rating: 4.8
    },
    fuel_type: 'hybrid',
    vehicle_type: 'SUV',
    highlights: ['Maximum Space', 'Hybrid Power', 'Premium Features'],
  },
  {
    id: '4runner',
    name: '4Runner',
    tagline: 'Built for Adventure',
    price: 41270,
    specs: {
      horsepower: 278,
      mpg: 24,
      seating: 5,
      rating: 4.6
    },
    fuel_type: 'gas',
    vehicle_type: 'SUV',
    highlights: ['Off-Road Package', 'Rugged Design', 'Best Resale Value'],
  },
  {
    id: 'crown',
    name: 'Crown',
    tagline: 'Elevated Luxury',
    price: 41440,
    specs: {
      horsepower: 240,
      mpg: 38,
      seating: 5,
      rating: 4.9
    },
    fuel_type: 'hybrid',
    vehicle_type: 'sedan/crossover',
    highlights: ['Premium Interior', 'Hybrid Performance', 'Luxury Features'],
  },
  {
    id: 'highlander',
    name: 'Highlander',
    tagline: 'Family Luxury',
    price: 40320,
    specs: {
      horsepower: 265,
      mpg: 25,
      seating: 7,
      rating: 4.9
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'SUV',
    highlights: ['3-Row Seating', 'Premium Interior', 'Towing Capacity'],
  },
  {
    id: 'bz4x',
    name: 'bZ4X',
    tagline: 'Electric. Elevated.',
    price: 37070,
    specs: {
      horsepower: 201,
      mpg: 119,
      seating: 5,
      rating: 4.6
    },
    fuel_type: 'electric',
    vehicle_type: 'SUV',
    highlights: ['Fully Electric', 'Zero Emissions', 'Advanced Tech'],
  },
  {
    id: 'camry',
    name: 'Camry',
    tagline: 'The Icon Redefined',
    price: 28700,
    specs: {
      horsepower: 232,
      mpg: 51,
      seating: 5,
      rating: 4.8
    },
    fuel_type: 'hybrid',
    vehicle_type: 'sedan',
    highlights: ['Advanced Safety', 'Hybrid Available', 'Sport Mode'],
  },
  {
    id: 'rav4',
    name: 'RAV4',
    tagline: 'Adventure Awaits',
    price: 29550,
    specs: {
      horsepower: 219,
      mpg: 39,
      seating: 5,
      rating: 4.7
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'SUV',
    highlights: ['AWD Available', 'Spacious Interior', 'Off-Road Ready'],
  },
  {
    id: 'prius',
    name: 'Prius',
    tagline: 'The Original Hybrid',
    price: 28495,
    specs: {
      horsepower: 194,
      mpg: 57,
      seating: 5,
      rating: 4.8
    },
    fuel_type: 'hybrid',
    vehicle_type: 'hatchback',
    highlights: ['Ultra Fuel Efficient', 'Eco-Friendly', 'Advanced Tech'],
  },
  {
    id: 'corolla',
    name: 'Corolla',
    tagline: 'Reliable. Efficient. Always.',
    price: 22725,
    specs: {
      horsepower: 169,
      mpg: 35,
      seating: 5,
      rating: 4.7
    },
    fuel_type: 'gas / hybrid',
    vehicle_type: 'sedan',
    highlights: ['Fuel Efficient', 'Advanced Safety', 'Reliable Performance'],
  },

];


export const getModelById = (id) => {
  return MODELS.find(model => model.id === id) || MODELS[0];
};

