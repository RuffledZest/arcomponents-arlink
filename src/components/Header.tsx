import React from 'react';
import { Button } from './Button';
import StarBorder from './StarBorder';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  overlayColor?: string;
  textColor?: 'light' | 'dark';
  height?: 'sm' | 'md' | 'lg';
  ctaButton?: {
    text: string;
    href: string;
    buttonType?: 'default' | 'primary' | 'secondary' | 'outline' | 'star';
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  backgroundImage,
  overlayColor = 'rgba(0, 0, 0, 0.5)',
  textColor = 'light',
  height = 'md',
  ctaButton,
}) => {
  const heightStyles = {
    sm: 'h-64',
    md: 'h-96',
    lg: 'h-screen',
  };

  const textStyles = {
    light: 'text-white',
    dark: 'text-gray-900',
  };

  const renderButton = () => {
    if (!ctaButton) return null;

    switch (ctaButton.buttonType) {
      case 'star':
        return (
          <StarBorder
            color={textColor === 'light' ? 'white' : '#007bff'}
            speed="6s"
          >
            <a href={ctaButton.href} className="text-inherit">
              {ctaButton.text}
            </a>
          </StarBorder>
        );
      case 'primary':
      case 'secondary':
      case 'outline':
        return (
          <a href={ctaButton.href}>
            <Button
              text={ctaButton.text}
              variant={ctaButton.variant || 'primary'}
              size={ctaButton.size || 'md'}
            />
          </a>
        );
      default:
        return (
          <a
            href={ctaButton.href}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {ctaButton.text}
          </a>
        );
    }
  };

  return (
    <header
      className={`relative ${heightStyles[height]} flex items-center justify-center`}
      style={{
        backgroundImage: backgroundImage
          ? `linear-gradient(${overlayColor}, ${overlayColor}), url(${backgroundImage})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${textStyles[textColor]}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`text-xl md:text-2xl mb-8 ${textStyles[textColor]}`}>
            {subtitle}
          </p>
        )}
        {ctaButton && renderButton()}
      </div>
    </header>
  );
}; 