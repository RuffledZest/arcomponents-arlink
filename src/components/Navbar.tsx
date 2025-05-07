import React from 'react';

export interface NavbarProps {
  logo?: string;
  title?: string;
  links?: Array<{ label: string; href: string }>;
  variant?: 'light' | 'dark';
  position?: 'fixed' | 'static';
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  title = 'My Website',
  links = [
    { label: 'Home', href: '#' },
    { label: 'About', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  variant = 'light',
  position = 'static',
}) => {
  const baseStyles = 'w-full px-4 py-3 shadow-sm';
  const variantStyles = {
    light: 'bg-white text-gray-800',
    dark: 'bg-gray-800 text-white',
  };

  return (
    <div className={position === 'fixed' ? 'sticky top-0 z-50' : ''}>
      <nav className={`${baseStyles} ${variantStyles[variant]}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {logo && <img src={logo} alt="Logo" className="h-8 w-auto" />}
            <span className="text-xl font-semibold">{title}</span>
          </div>
          <div className="hidden md:flex space-x-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-blue-500 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </div>
  );
}; 