
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import PermawebAtomicAsset from '../PermawebAtomicAsset';
import { Component } from '@/types/builder';

interface PermawebAtomicAssetProps {
  component: Component;
  onPropertyChange: (key: string, value: any) => void;
}

export const BuilderPermawebAtomicAsset: React.FC<PermawebAtomicAssetProps> = ({
  component,
  onPropertyChange
}) => {
  return (
    <div className="relative w-full">
      <PermawebAtomicAsset
        assetId={component.props?.assetId}
        assetIds={component.props?.assetIds}
        luaCode={component.props?.luaCode}
        processId={component.props?.processId}
        onAssetCreated={(assetId) => onPropertyChange('assetId', assetId)}
      />
    </div>
  );
}; 