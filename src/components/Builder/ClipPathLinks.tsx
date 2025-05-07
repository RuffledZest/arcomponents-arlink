/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ClipPathLinks } from '../ClipPathLinks';
import { Component } from '@/types/builder';

interface BuilderClipPathLinksProps {
  component: Component;
  onPropertyChange: (key: string, value: any) => void;
}

export const BuilderClipPathLinks: React.FC<BuilderClipPathLinksProps> = ({ 
  component,
  onPropertyChange 
}) => {
  return (
    <ClipPathLinks
      className={component.props.className}
      style={component.props.style}
      links={component.props.links}
      gridLayout={component.props.gridLayout}
      customGrid={component.props.customGrid}
      iconSize={component.props.iconSize}
      hoverColor={component.props.hoverColor}
      backgroundColor={component.props.backgroundColor}
      borderColor={component.props.borderColor}
      animationDuration={component.props.animationDuration}
    />
  );
}; 