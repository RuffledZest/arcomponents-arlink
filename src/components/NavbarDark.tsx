import React from 'react';

export interface NavbarDarkProps {
  title: string;
  links: { label: string; href: string }[];
  position?: 'static' | 'sticky';
}

export const NavbarDark: React.FC<NavbarDarkProps> = ({
  title,
  links,
  position = 'static',
}) => {
  return (
    <div className={`w-full relative ${position === 'sticky' ? 'sticky top-0' : ''}`}>
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold">{title}</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}; 