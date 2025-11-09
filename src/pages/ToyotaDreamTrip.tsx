import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

import JourneyRoadmap from '@/components/toyota/JourneyRoadmap';
import PreferencesStage from '@/components/toyota/PreferencesStage';
import BudgetStage from '@/components/toyota/BudgetStage';
import ComparisonStage from '@/components/toyota/ComparisonStage';
import CustomizationStage from '@/components/toyota/CustomizationStage';
import FinancingStage from '@/components/toyota/FinancingStage';
import UpsellStage from '@/components/toyota/UpsellStage';
import RevealStage from '@/components/toyota/RevealStage';
import DrivingAnimation from '@/components/toyota/DrivingAnimation';
import RoadWithCar from '@/components/toyota/RoadWithCar';
import { getModelById } from '@/data/models';

/** ---- Types used in this page ---- */

type StageId =
  | 'welcome'
  | 'preferences'
  | 'budget'
  | 'comparison'
  | 'customization'
  | 'financing'
  | 'upsell'
  | 'reveal';

type StageItem = { id: StageId; title: string; icon: string };

type Preferences = Record<string, unknown>;

type JourneyData = {
  preferences: Preferences;
  selectedModel: { id: string; name: string; price: number; [key: string]: unknown } | null;
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
  { id: 'budget',       title: 'Budget',             icon: '💰' },
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
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Driving animation overlay */}
      <AnimatePresence>{showDriving && <DrivingAnimation />}</AnimatePresence>

      {/* Journey progress roadmap */}
      <JourneyRoadmap stages={STAGES} currentStage={currentStage} onStageClick={goToStage} />

      {/* Road with Moving Car - Global (only one, centered) */}
      <RoadWithCar currentStage={currentStage} totalStages={STAGES.length} />

      {/* Main content */}
      <div className="relative z-20 pt-32 pb-20 px-4 min-h-[calc(100vh-200px)] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStage === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto text-center relative w-full"
            >

              <motion.h1
                className="text-8xl md:text-9xl font-black text-red-600 mb-4 tracking-tight"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                style={{ textShadow: '0 0 40px rgba(220, 38, 38, 0.5)' }}
              >
                TOYOTA
              </motion.h1>

              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Dream Trip
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your journey from dealership to driveway starts here.
                <br />
                Every mile brings you closer to your perfect Toyota.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="button"
                  onClick={nextStage}
                  className="bg-red-600 hover:bg-red-700 text-white px-16 py-4 text-lg font-bold rounded-lg shadow-2xl shadow-red-600/50 hover:shadow-red-600/70 transition-all duration-300 hover:scale-105 uppercase tracking-wider cursor-pointer relative z-10"
                >
                  START YOUR JOURNEY
                </button>
              </motion.div>
            </motion.div>
          )}

          {currentStage === 1 && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="relative z-20"
            >
              <PreferencesStage
                onComplete={(data: Preferences) => {
                  updateJourneyData('preferences', data);
                  nextStage();
                }}
              />
            </motion.div>
          )}

          {currentStage === 2 && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="relative z-20"
            >
              <BudgetStage
                onComplete={(data: { budget: number; creditScore: number }) => {
                  updateJourneyData('preferences', {
                    ...journeyData.preferences,
                    budget: data.budget,
                    creditScore: data.creditScore,
                  });
                  nextStage();
                }}
              />
            </motion.div>
          )}

          {currentStage === 3 && (
            <ComparisonStage
              key="comparison"
              preferences={journeyData.preferences}
              onComplete={(modelId: string) => {
                const model = getModelById(modelId);
                updateJourneyData('selectedModel', model);
                nextStage();
              }}
            />
          )}

          {currentStage === 4 && (
            <CustomizationStage
              key="customization"
              selectedModel={journeyData.selectedModel}
              onComplete={(data: Record<string, unknown>) => {
                updateJourneyData('customization', data);
                nextStage();
              }}
            />
          )}

          {currentStage === 5 && (
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

          {currentStage === 6 && (
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

          {currentStage === 7 && <RevealStage key="reveal" journeyData={journeyData} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
