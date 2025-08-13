import React from 'react';
import { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import '../styles/sidebar.css';

const Sidebar = ({ 
  currentView, 
  setCurrentView, 
  userPrincipal, 
  userDashboard,
  isAuthenticated,
  onLogout,
  onLogin,
  isMobileOpen,
  onMobileClose
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (userDashboard?.user_profile?.preferred_name) {
      setUserName(userDashboard.user_profile.preferred_name);
    } else if (userDashboard?.user_profile?.name) {
      setUserName(userDashboard.user_profile.name);
    } else if (userPrincipal) {
      setUserName(userPrincipal.substring(0, 8) + '...');
    }
  }, [userDashboard, userPrincipal]);

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Close mobile sidebar when navigating
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const navItems = [
    { id: 'welcome', label: 'Welcome', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`mobile-sidebar-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={onMobileClose}
      />
      
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🧠</span>
          {!isCollapsed && <span className="logo-text">Universal AI</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isAuthenticated ? (
          <div className="user-section">
            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-status">Connected</span>
              </div>
            )}
            <button 
              className="logout-btn"
              onClick={onLogout}
              title="Logout"
            >
              🚪
            </button>
          </div>
        ) : (
          <button 
            className="login-btn"
            onClick={onLogin}
            disabled={!onLogin}
          >
            <span className="nav-icon">🔓</span>
            {!isCollapsed && <span className="nav-label">Connect Wallet</span>}
          </button>
        )}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
