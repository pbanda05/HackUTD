import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

import JourneyRoadmap from '@/components/toyota/JourneyRoadmap';
import PreferencesStage from '@/components/toyota/PreferencesStage';
import ComparisonStage from '@/components/toyota/ComparisonStage';
import CustomizationStage from '@/components/toyota/CustomizationStage';
import FinancingStage from '@/components/toyota/FinancingStage';
import UpsellStage from '@/components/toyota/UpsellStage';
import RevealStage from '@/components/toyota/RevealStage';
import DrivingAnimation from '@/components/toyota/DrivingAnimation';

/** ---- Types used in this page ---- */

type StageId =
  | 'welcome'
  | 'preferences'
  | 'comparison'
  | 'customization'
  | 'financing'
  | 'upsell'
  | 'reveal';

type StageItem = { id: StageId; title: string; icon: string };

type Preferences = Record<string, unknown>;

type JourneyData = {
  preferences: Preferences;
  selectedModel: string | null;
  customization: Record<string, unknown>;
  financing: Record<string, unknown>;
  finalChoice: string; // 'current' or a specific choice string
  upsellData?: unknown;
};

/** Child component prop shapes (minimal, based on usage here) */
type JourneyRoadmapProps = {
  stages: StageItem[];
  currentStage: number;
  onStageClick: (index: number) => void;
};
// These are only for local type assertions; your actual components can have richer props.
const _assertJourneyRoadmap: JourneyRoadmapProps | null = null;

type PreferencesStageProps = {
  onComplete: (data: Preferences) => void;
};
const _assertPreferencesStage: PreferencesStageProps | null = null;

type ComparisonStageProps = {
  preferences: Preferences;
  onComplete: (modelId: string) => void;
};
const _assertComparisonStage: ComparisonStageProps | null = null;

type CustomizationStageProps = {
  selectedModel: string | null;
  onComplete: (data: Record<string, unknown>) => void;
};
const _assertCustomizationStage: CustomizationStageProps | null = null;

type FinancingStageProps = {
  selectedModel: string | null;
  customization: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
};
const _assertFinancingStage: FinancingStageProps | null = null;

type UpsellStageProps = {
  journeyData: JourneyData;
  onComplete: (choice: string, recommendations?: unknown) => void;
};
const _assertUpsellStage: UpsellStageProps | null = null;

type RevealStageProps = {
  journeyData: JourneyData;
};
const _assertRevealStage: RevealStageProps | null = null;

/** ---- Constants ---- */

const STAGES: StageItem[] = [
  { id: 'welcome',      title: 'Start Your Journey', icon: '🏁' },
  { id: 'preferences',  title: 'Your Profile',       icon: '❤️' },
  { id: 'comparison',   title: 'AI Matching',        icon: '🤖' },
  { id: 'customization',title: 'Customize',          icon: '🎨' },
  { id: 'financing',    title: 'Financing',          icon: '💰' },
  { id: 'upsell',       title: 'Best Options',       icon: '✨' },
  { id: 'reveal',       title: 'Dream Reveal',       icon: '🎉' },
];

/** ---- Component ---- */

export default function ToyotaDreamTrip() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [journeyData, setJourneyData] = useState<JourneyData>({
    preferences: {},
    selectedModel: null,
    customization: {},
    financing: {},
    finalChoice: 'current',
  });
  const [showDriving, setShowDriving] = useState<boolean>(false);

  const updateJourneyData = (stage: keyof JourneyData | 'upsellData', data: unknown) => {
    setJourneyData(prev => ({
      ...prev,
      [stage]: data as never,
    }));
  };

  const nextStage = () => {
    if (currentStage < STAGES.length - 1) {
      setShowDriving(true);
      setTimeout(() => {
        setCurrentStage(prev => prev + 1);
        setShowDriving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);
    }
  };

  const goToStage = (index: number) => {
    if (index <= currentStage) {
      setCurrentStage(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Driving animation overlay */}
      <AnimatePresence>{showDriving && <DrivingAnimation />}</AnimatePresence>

      {/* Journey progress roadmap */}
      <JourneyRoadmap stages={STAGES} currentStage={currentStage} onStageClick={goToStage} />

      {/* Main content */}
      <div className="relative z-10 pt-32 pb-20 px-4">
        <AnimatePresence mode="wait">
          {currentStage === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="max-w-5xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-block mb-6"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-2xl shadow-red-600/50">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Your <span className="text-red-600">Dream</span>
                <br />
                Toyota Journey
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Experience the ultimate car-buying adventure. From preferences to your driveway,
                we'll guide you every mile of the way.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={nextStage}
                  className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 font-semibold inline-flex items-center"
                >
                  Start Your Journey
                  <ChevronRight className="w-6 h-6 ml-2" />
                </button>
              </motion.div>

              {/* Decorative road lines */}
              <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-t from-red-600 to-transparent" />
              </div>
            </motion.div>
          )}

          {currentStage === 1 && (
            <PreferencesStage
              key="preferences"
              onComplete={(data: Preferences) => {
                updateJourneyData('preferences', data);
                nextStage();
              }}
            />
          )}

          {currentStage === 2 && (
            <ComparisonStage
              key="comparison"
              preferences={journeyData.preferences}
              onComplete={(model: string) => {
                updateJourneyData('selectedModel', model);
                nextStage();
              }}
            />
          )}

          {currentStage === 3 && (
            <CustomizationStage
              key="customization"
              selectedModel={journeyData.selectedModel}
              onComplete={(data: Record<string, unknown>) => {
                updateJourneyData('customization', data);
                nextStage();
              }}
            />
          )}

          {currentStage === 4 && (
            <FinancingStage
              key="financing"
              selectedModel={journeyData.selectedModel}
              customization={journeyData.customization}
              onComplete={(data: Record<string, unknown>) => {
                updateJourneyData('financing', data);
                nextStage();
              }}
            />
          )}

          {currentStage === 5 && (
            <UpsellStage
              key="upsell"
              journeyData={journeyData}
              onComplete={(choice: string, recommendations?: unknown) => {
                updateJourneyData('finalChoice', choice);
                updateJourneyData('upsellData', recommendations);
                nextStage();
              }}
            />
          )}

          {currentStage === 6 && <RevealStage key="reveal" journeyData={journeyData} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
