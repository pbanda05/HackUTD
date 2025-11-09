// Minimal “these modules exist” declarations for your JSX components

declare module '@/components/toyota/JourneyRoadmap' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/PreferencesStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/ComparisonStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/CustomizationStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/FinancingStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/UpsellStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/RevealStage' {
    const C: React.ComponentType<any>;
    export default C;
  }
  declare module '@/components/toyota/DrivingAnimation' {
    const C: React.ComponentType<any>;
    export default C;
  }
  
  /* (Optional) If you import shadcn/ui paths like '@/components/ui/button' or 'slider',
     add these too to prevent future 7016s. */
  declare module '@/components/ui/button' {
    const C: React.ComponentType<any>;
    export { C as Button };
    export default C;
  }
  declare module '@/components/ui/slider' {
    export const Slider: React.ComponentType<any>;
    export default Slider;
  }
  