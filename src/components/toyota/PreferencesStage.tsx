// src/Components/toyota/PreferencesStage.tsx  (or src/components/... but keep casing consistent)
import React, { useState } from 'react';

// --- types you can tweak later ---
type PreferenceValue = string | number | boolean | null;
type Preferences = Record<string, PreferenceValue>;
interface PreferencesStageProps {
  onComplete: (data: Preferences) => void;
}

// Selected per section: key is sectionId, value is chosen optionId (string) or null
type SelectedMap = Record<string, string | null>;

const SECTIONS: Array<{
  id: string;
  title: string;
  options: Array<{ id: string; label: string; value?: PreferenceValue }>;
}> = [
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    options: [
      { id: 'adventure', label: 'Adventure' },
      { id: 'family', label: 'Family' },
      { id: 'city', label: 'City' },
      { id: 'commute', label: 'Commute' }
    ]
  },
  {
    id: 'usage',
    title: 'Primary Usage',
    options: [
      { id: 'daily', label: 'Daily' },
      { id: 'longtrips', label: 'Long Trips' },
      { id: 'offroad', label: 'Off-road' }
    ]
  },
  {
    id: 'location',
    title: 'Driving Location',
    options: [
      { id: 'urban', label: 'Urban' },
      { id: 'suburban', label: 'Suburban' },
      { id: 'rural', label: 'Rural' }
    ]
  },
  {
    id: 'budget',
    title: 'Budget',
    options: [
      { id: '25000', label: 'Up to $25k', value: 25000 },
      { id: '30000', label: 'Up to $30k', value: 30000 },
      { id: '40000', label: 'Up to $40k', value: 40000 },
      { id: '50000', label: 'Up to $50k', value: 50000 }
    ]
  },
  {
    id: 'creditScore',
    title: 'Credit Score',
    options: [
      { id: 'excellent', label: 'Excellent' },
      { id: 'good', label: 'Good' },
      { id: 'fair', label: 'Fair' },
      { id: 'poor', label: 'Poor' }
    ]
  }
];

const PreferencesStage: React.FC<PreferencesStageProps> = ({ onComplete }) => {
  // Selected option key per section id
  const [selected, setSelected] = useState<SelectedMap>({});

  const handleSelect = (sectionId: string, optionId: string) => {
    setSelected(prev => ({ ...prev, [sectionId]: optionId }));
  };

  const handleSubmit = () => {
    // Build a normalized preferences object
    const result: Preferences = {};
    for (const section of SECTIONS) {
      const chosenId = selected[section.id] ?? null;
      if (chosenId === null) {
        result[section.id] = null;
        continue;
      }
      const opt = section.options.find(o => o.id === chosenId);
      // prefer the provided value, otherwise the option id
      result[section.id] = opt?.value ?? chosenId;
    }
    onComplete(result);
  };

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h2 className="text-4xl font-extrabold mb-8">Tell us about you</h2>

      <div className="space-y-8">
        {SECTIONS.map(section => (
          <div key={section.id}>
            <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
            <div className="flex flex-wrap gap-3">
              {section.options.map(opt => {
                const active = selected[section.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(section.id, opt.id)}
                    className={`px-4 py-2 rounded-full border transition ${
                      active
                        ? 'bg-red-600 border-red-500'
                        : 'bg-gray-900/60 border-gray-700 hover:bg-gray-800'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PreferencesStage;
