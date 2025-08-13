import React from 'react';
import '../styles/mobile-menu.css';

const MobileMenuBar = ({ 
  isSidebarOpen, 
  toggleSidebar, 
  currentView, 
  userPrincipal,
  userDashboard,
  isAuthenticated 
}) => {
  const getUserDisplayName = () => {
    if (userDashboard?.user_profile?.preferred_name) {
      return userDashboard.user_profile.preferred_name;
    } else if (userDashboard?.user_profile?.name) {
      return userDashboard.user_profile.name;
    } else if (userPrincipal) {
      return userPrincipal.substring(0, 8) + '...';
    }
    return 'Guest';
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'welcome':
        return 'Welcome';
      case 'chat':
        return 'AI Chat';
      case 'memory':
        return 'Memory Dashboard';
      default:
        return 'Universal AI';
    }
  };

  return (
    <div className="mobile-menu-bar">
      <div className="mobile-menu-content">
        <button 
          className={`hamburger-btn ${isSidebarOpen ? 'active' : ''}`}
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <div className="mobile-title">
          <span className="title-icon">🧠</span>
          <span className="title-text">{getViewTitle()}</span>
        </div>

        <div className="mobile-user-info">
          {isAuthenticated ? (
            <div className="mobile-user-avatar">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="mobile-connect-indicator">
              <span className="connect-dot"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenuBar;
