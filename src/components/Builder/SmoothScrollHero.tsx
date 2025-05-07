/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Component, BuilderComponentProps } from '../types';
import SmoothScrollHero from '../SmoothScrollHero';

const BuilderSmoothScrollHero: React.FC<BuilderComponentProps> = ({
  component,
  onPropertyChange,
}) => {
  return (
    <SmoothScrollHero
      backgroundImage={component.props.backgroundImage}
      parallaxImages={component.props.parallaxImages}
      scheduleItems={component.props.scheduleItems}
    />
  );
};

export default BuilderSmoothScrollHero; 