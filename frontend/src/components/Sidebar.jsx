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
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [isUpdatingAutopilot, setIsUpdatingAutopilot] = useState(false);
  const [isAutopilotOn, setIsAutopilotOn] = useState(false);
  const [userName, setUserName] = useState('');
  const [ckBTCBalance, setCkBTCBalance] = useState('0.0000');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);

  useEffect(() => {
    if (userDashboard?.user_profile?.preferred_name) {
      setUserName(userDashboard.user_profile.preferred_name);
    } else if (userDashboard?.user_profile?.name) {
      setUserName(userDashboard.user_profile.name);
    } else if (userPrincipal) {
      setUserName(userPrincipal.substring(0, 8) + '...');
    }
  }, [userDashboard, userPrincipal]);

  // Load autopilot setting from user profile
  useEffect(() => {
    if (userDashboard?.user_profile?.response_preferences?.autopilot_enabled) {
      setAutopilotEnabled(true);
    }
  }, [userDashboard]);

  // Load ckBTC balance
  useEffect(() => {
    const loadBalance = async () => {
      if (!userPrincipal || isLoadingBalance) return;
      
      setIsLoadingBalance(true);
      try {
        // Simulate balance loading - in real implementation, this would call a ckBTC canister
        const mockBalance = (Math.random() * 0.1).toFixed(4);
        setCkBTCBalance(mockBalance);
      } catch (error) {
        console.error('Error loading ckBTC balance:', error);
        setCkBTCBalance('0.0000');
      } finally {
        setIsLoadingBalance(false);
      }
    };

    if (isAuthenticated && userPrincipal) {
      loadBalance();
    }
  }, [userPrincipal, isAuthenticated, isLoadingBalance]);

  const handleAutopilotToggle = async () => {
    if (!userPrincipal || isUpdatingAutopilot) return;
    
    setIsUpdatingAutopilot(true);
    try {
      const newAutopilotState = !autopilotEnabled;
      
      // Update user profile with autopilot preference
      const profileUpdate = {
        response_preferences: {
          autopilot_enabled: newAutopilotState
        }
      };
      
      const result = await backend.update_user_profile(userPrincipal, profileUpdate);
      
      if ('Ok' in result) {
        setAutopilotEnabled(newAutopilotState);
        console.log('Autopilot setting updated:', newAutopilotState);
      } else {
        console.error('Failed to update autopilot setting:', result.Err);
      }
    } catch (error) {
      console.error('Error updating autopilot setting:', error);
    } finally {
      setIsUpdatingAutopilot(false);
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    // Close mobile sidebar after a short delay to allow navigation to complete
    if (onMobileClose) {
      setTimeout(() => {
        onMobileClose();
      }, 100);
    }
  };

  const navItems = [
    { id: 'welcome', label: 'Welcome', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'memory', label: 'Memory', icon: '🧠' },
    { id: 'coach', label: 'WCHL Coach', icon: '🏆' },
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

      <div className="sidebar-features">
        <div className="feature-item" title="Toggle Autopilot Memory Coach">
          <span className="feature-icon">🚀</span>
          {!isCollapsed && <span className="feature-label">Autopilot</span>}
          {!isCollapsed && (
            <label className="switch">
              <input 
                type="checkbox" 
                checked={autopilotEnabled} 
                onChange={handleAutopilotToggle}
                disabled={isUpdatingAutopilot}
              />
              <span className={`slider round ${isUpdatingAutopilot ? 'updating' : ''}`}></span>
            </label>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        {isAuthenticated && (
          <div className="sidebar-balance">
            <span className="balance-icon">💰</span>
            {!isCollapsed && (
              <>
                <span className="balance-label">ckBTC</span>
                <span className="balance-amount">
                  {isLoadingBalance ? '...' : ckBTCBalance}
                </span>
              </>
            )}
          </div>
        )}
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
