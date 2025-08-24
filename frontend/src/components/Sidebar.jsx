import React, { useState, useEffect } from 'react';
import { FiHome, FiMessageCircle, FiCpu, FiUser, FiZap } from 'react-icons/fi';
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


  // Load autopilot setting from user profile
  useEffect(() => {
    if (userDashboard?.user_profile?.response_preferences?.autopilot_enabled) {
      setAutopilotEnabled(true);
    }
  }, [userDashboard]);


  const handleAutopilotToggle = async () => {
    if (!userPrincipal || isUpdatingAutopilot) return;
    
    setIsUpdatingAutopilot(true);
    try {
      const newAutopilotState = !autopilotEnabled;
      
      // Get current user preferences or use defaults
      const currentPrefs = userDashboard?.user_profile?.response_preferences || {
        prefers_examples: false,
        prefers_step_by_step: false,
        prefers_quick_answers: false,
        prefers_detailed_explanations: false,
        autopilot_enabled: false
      };
      
      // Update user profile with complete ResponsePreferences structure
      const profileUpdate = {
        response_preferences: {
          ...currentPrefs,
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
    { id: 'welcome', label: 'Welcome', icon: FiHome },
    { id: 'chat', label: 'Chat', icon: FiMessageCircle },
    { id: 'memory', label: 'Memory', icon: FiCpu },
    { id: 'coach', label: 'AI Coach', icon: FiUser },
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
          <img src="/logo-icon.svg" alt="Universal AI Assistant" className="logo-icon" />
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
            <item.icon className="nav-icon" size={20} />
            {!isCollapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-features">
        <div className="feature-item" title="Toggle Autopilot Memory Coach">
          <FiZap className="feature-icon" size={16} />
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
        {/* User authentication moved to top navbar */}
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
