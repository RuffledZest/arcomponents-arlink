/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { PermawebProfile } from '../PermawebProfile';
import { Component } from '@/types/builder';

interface PermawebProfileProps {
  component: Component;
  onPropertyChange: (key: string, value: any) => void;
}

export const BuilderPermawebProfile: React.FC<PermawebProfileProps> = ({
  component,
  onPropertyChange
}) => {
  return (
    <div className="relative w-full">
      <PermawebProfile
        profileId={component.props.profileId}
        walletAddress={component.props.walletAddress}
        onCreateProfile={(profileId) => onPropertyChange('profileId', profileId)}
      />
    </div>
  );
}; 