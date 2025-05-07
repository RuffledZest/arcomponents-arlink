/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { LandingPageOne } from '@ar-dacity/ardacity-landing-page-one';
import { Component } from '@/types/builder';

interface BuilderLandingPageOneProps {
  component: Component;
  onPropertyChange: (key: string, value: any) => void;
}

const BuilderLandingPageOne: React.FC<BuilderLandingPageOneProps> = ({ 
  component,
  onPropertyChange 
}) => {
  return (
    <LandingPageOne
      title={component.props.title}
      subtitleLines={component.props.subtitleLines}
      description={component.props.description}
      auroraColorStops={component.props.auroraColorStops}
      pixelTransitionImgUrl={component.props.pixelTransitionImgUrl}
      pixelTransitionText={component.props.pixelTransitionText}
    />
  );
};

export default BuilderLandingPageOne; 