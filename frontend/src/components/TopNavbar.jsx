import React from 'react';
import { FiMenu } from 'react-icons/fi';
import UserProfile from './UserProfile';
import '../styles/top-navbar.css';

const TopNavbar = ({ 
  userPrincipal, 
  userDashboard,
  isAuthenticated,
  onLogout,
  onLogin,
  onMobileMenuToggle
}) => {
  return (
    <nav className="top-navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button 
            className="mobile-menu-btn"
            onClick={onMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <FiMenu size={20} />
          </button>
          
          <div className="navbar-logo">
            <img src="/logo-icon.svg" alt="Universal AI Assistant" className="logo-icon" />
            <span className="logo-text">Universal AI</span>
          </div>
        </div>

        <div className="navbar-right">
          <UserProfile
            userPrincipal={userPrincipal}
            userDashboard={userDashboard}
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
            onLogin={onLogin}
          />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
