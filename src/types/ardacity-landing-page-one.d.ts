declare module '@ar-dacity/ardacity-landing-page-one' {
  export interface LandingPageOneProps {
    title?: string;
    subtitleLines?: string[];
    description?: string;
    auroraColorStops?: string[];
    pixelTransitionImgUrl?: string;
    pixelTransitionText?: string;
  }

  export const LandingPageOne: React.FC<LandingPageOneProps>;
} 