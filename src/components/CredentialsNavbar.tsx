import React from 'react';
import './CredentialsNavbar.css';

export interface CredentialsNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
    telegram?: string;
  };
}

const CredentialsNavbar: React.FC<CredentialsNavbarProps> = ({
  activeTab = 'home',
  onTabChange,
  socialLinks = {}
}) => {
  const handleTabClick = (tab: string) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSocialClick = (platform: string, url?: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <nav className="credentials-navbar">
      <div 
        className={`navbar-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => handleTabClick('home')}
        data-platform="home"
      >
        <i className="fa-solid fa-house"></i>
        <span>Home</span>
      </div>
      {socialLinks.instagram && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('instagram', socialLinks.instagram)}
          data-platform="instagram"
        >
          <i className="fa-brands fa-instagram"></i>
          <span>Instagram</span>
        </div>
      )}
      {socialLinks.twitter && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('twitter', socialLinks.twitter)}
          data-platform="twitter"
        >
          <i className="fa-brands fa-twitter"></i>
          <span>Twitter</span>
        </div>
      )}
      {socialLinks.facebook && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('facebook', socialLinks.facebook)}
          data-platform="facebook"
        >
          <i className="fa-brands fa-facebook"></i>
          <span>Facebook</span>
        </div>
      )}
      {socialLinks.linkedin && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('linkedin', socialLinks.linkedin)}
          data-platform="linkedin"
        >
          <i className="fa-brands fa-linkedin"></i>
          <span>LinkedIn</span>
        </div>
      )}
      {socialLinks.github && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('github', socialLinks.github)}
          data-platform="github"
        >
          <i className="fa-brands fa-github"></i>
          <span>GitHub</span>
        </div>
      )}
      {socialLinks.discord && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('discord', socialLinks.discord)}
          data-platform="discord"
        >
          <i className="fa-brands fa-discord"></i>
          <span>Discord</span>
        </div>
      )}
      {socialLinks.telegram && (
        <div 
          className="navbar-item"
          onClick={() => handleSocialClick('telegram', socialLinks.telegram)}
          data-platform="telegram"
        >
          <i className="fa-brands fa-telegram"></i>
          <span>Telegram</span>
        </div>
      )}
    </nav>
  );
};

export default CredentialsNavbar; 