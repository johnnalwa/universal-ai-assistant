import React, { useState } from 'react';

const Sidebar = ({ currentView, setCurrentView, userPrincipal, userDashboard }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    {
      id: 'welcome',
      label: 'Home',
      icon: '🏠',
      description: 'Welcome & Overview'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: '💬',
      description: 'AI Conversation',
      badge: userDashboard?.total_conversations || 0
    },
    {
      id: 'memory',
      label: 'Memory',
      icon: '🧠',
      description: 'Knowledge Dashboard',
      badge: userDashboard?.total_memories || 0
    }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-section">
          <div className="brand-logo">
            <span className="logo-icon">🧠</span>
            {!isCollapsed && (
              <div className="brand-text">
                <h3>Universal AI</h3>
                <p>Your Personal AI</p>
              </div>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
            title={item.description}
          >
            <span className="nav-icon">{item.icon}</span>
            {!isCollapsed && (
              <div className="nav-content">
                <span className="nav-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
            )}
          </button>
        ))}
      </nav>

      {userPrincipal && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userPrincipal.toString().slice(0, 2).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <div className="user-name">
                  {userDashboard?.profile?.name || 'User'}
                </div>
                <div className="user-id">
                  {userPrincipal.toString().slice(0, 8)}...
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
