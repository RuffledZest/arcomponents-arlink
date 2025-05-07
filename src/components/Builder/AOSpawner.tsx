
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Component } from '@/types/builder';
import AOSpawner from '../AOSpawner';

interface BuilderAOSpawnerProps {
  component: Component;
  onPropertyChange: (key: string, value: any) => void;
}

export const BuilderAOSpawner: React.FC<BuilderAOSpawnerProps> = ({
  component,
  onPropertyChange
}) => {
  return (
    <div className="relative w-full">
      <AOSpawner
        luaCode={component.props?.luaCode}
        onProcessCreated={(processId) => onPropertyChange('processId', processId)}
      />
    </div>
  );
}; 