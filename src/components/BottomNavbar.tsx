import { useRef, useEffect } from 'react';
import './BottomNavbar.css';

export interface BottomNavbarProps {
  // Required props
  className?: string;

  // Optional props with defaults
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  className = '',
  activeTab = 'home',
  onTabChange = () => {},
}) => {
  // Refs for DOM elements and cleanup
  const navbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!navbarRef.current) return;

    // Setup or any DOM manipulation code

    return () => {
      // Cleanup code here (if necessary)
    };
  }, [/* dependencies */]);

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
  };

  return (
    <div ref={navbarRef} className={`bottom-navbar ${className}`}>
      <div
        className={`navbar-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home')}
      >
        Home
      </div>
      <div
        className={`navbar-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => handleTabClick('search')}
      >
        Search
      </div>
      <div
        className={`navbar-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => handleTabClick('profile')}
      >
        Profile
      </div>
      <div
        className={`navbar-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => handleTabClick('settings')}
      >
        Settings
      </div>
    </div>
  );
};

export default BottomNavbar; 