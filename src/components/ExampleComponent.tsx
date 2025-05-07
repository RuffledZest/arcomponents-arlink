import React from 'react';

// 1. Define the component's props interface
export interface ExampleComponentProps {
  // Required props
  title: string;
  
  // Optional props
  description?: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  
  // Complex props
  style?: React.CSSProperties;
  className?: string;
}

// 2. Create the component with proper typing
const ExampleComponent: React.FC<ExampleComponentProps> = ({
  title,
  description = 'Default description', // Default value for optional prop
  count = 0,
  isActive = false,
  onClick,
  style,
  className = '', // Default value for optional prop
}) => {
  return (
    <div 
      className={`example-component ${className}`}
      style={style}
      onClick={onClick}
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div>Count: {count}</div>
      <div>Status: {isActive ? 'Active' : 'Inactive'}</div>
    </div>
  );
};

// 3. Export the component
export default ExampleComponent; 