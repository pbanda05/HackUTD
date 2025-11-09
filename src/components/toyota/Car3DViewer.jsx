import React from 'react';

// Model IDs for different Toyota models on Sketchfab
const MODEL_IDS = {
  camry: '147a0afe465144b5a474dc2f8c0a42cc', // Toyota Camry Hybrid SE 2021
  rav4: 'ed155ad0cb7d447085a519eaff9aa2df', // Toyota RAV4 2022
  corolla: '6d7d34ee42734d1ab28a6b1f1c5fc4fc', // Toyota Corolla Sport 2019
  supra: 'b7616ec43ecf4ffd8ed810d94f15eea6', // Toyota GR Supra 2020
  highlander: 'ff144d062f244a3ebfae71bc2a41564b', // Toyota Highlander 2020
  gr86: '2724aadbf88b4706a26cf7d1b2332d0c', // Toyota GR86 2022
  tacoma: '573f79c0d10647caa44b4c7d80533eaa', // Toyota Tacoma 2020
  '4runner' : '247f7a9466c64e7283637d1913f470cf', // Toyota 4Runner 2021
  bz4x: 'bae4423cff184f8ebf3a46a1ffaf064a', // Toyota bZ4X 2022
  crown: 'f87692f39a2342a79eec9369f4f0846d', // Toyota Crown 2023
  grandhighlander: '4d35cd3f76f8477e87ef2bf8bd267800', // Toyota Grand Highlander 2024
  prius: '17c2bd8364844ba5bf1ec4740ab04ed6', // Toyota Prius 2023
  sequoia: 'e3c290bf112147898484aa25fbee75ea', // Toyota Sequoia 2023

  // If no specific model is found, use a generic Toyota model that looks modern
  default: '147a0afe465144b5a474dc2f8c0a42cc' // Default to Camry if model not found
};

export default function Car3DViewer({ modelId, isActive, color }) {
  // Get the appropriate Sketchfab model ID
  const sketchfabModelId = MODEL_IDS[modelId] || MODEL_IDS.default;
  const isDefaultModel = !MODEL_IDS[modelId];
  
  return (
    <div className="w-full h-full relative">
      <div className="sketchfab-embed-wrapper h-full">
        <iframe
          title={`Toyota ${modelId.charAt(0).toUpperCase() + modelId.slice(1)} 3D Model`}
          frameBorder="0"
          allowFullScreen
          mozallowfullscreen="true"
          webkitallowfullscreen="true"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full rounded-xl bg-gray-900/50"
          style={{
            minHeight: '256px'
          }}
          src={`https://sketchfab.com/models/${sketchfabModelId}/embed?autospin=1&autostart=1&preload=1&ui_theme=dark&dnt=1`}
        />
        {isDefaultModel && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl pointer-events-none">
            <p className="text-white text-sm px-4 py-2 bg-gray-900/80 rounded-lg">
              3D model preview not available for this vehicle
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
