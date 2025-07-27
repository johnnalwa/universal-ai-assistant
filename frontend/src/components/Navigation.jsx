import React, { useState, useRef, useEffect } from 'react';

const Navigation = ({ currentView, setCurrentView, userPrincipal, userDashboard }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const profileRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
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
    <nav className="navigation-container">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <div className="nav-brand">
          <div className="brand-logo">
            <span className="logo-icon">🧠</span>
            <div className="brand-text">
              <h1 className="brand-title">Universal AI Assistant</h1>
              <p className="brand-subtitle">Your Personal AI That Remembers</p>
            </div>
          </div>
        </div>

        <div className="nav-center">
          <div className="nav-tabs">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-tab ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
                title={item.description}
              >
                <span className="tab-icon">{item.icon}</span>
                <span className="tab-label">{item.label}</span>
                {item.badge > 0 && (
                  <span className="tab-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="nav-actions">
          <div className="user-info" ref={profileRef}>
            {userPrincipal ? (
              <>
                <button 
                  className="profile-button"
                  onClick={() => setShowProfilePopup(!showProfilePopup)}
                >
                  <div className="user-avatar">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <div className="status-indicator"></div>
                </button>
                
                {/* Profile Popup */}
                {showProfilePopup && (
                  <div className="profile-popup">
                    <div className="popup-header">
                      <div className="popup-avatar">
                        <span className="popup-avatar-icon">👤</span>
                      </div>
                      <div className="popup-info">
                        <h3 className="popup-title">Connected Account</h3>
                        <p className="popup-status">✅ Internet Identity</p>
                      </div>
                    </div>
                    
                    <div className="popup-details">
                      <div className="detail-item">
                        <span className="detail-label">Principal ID</span>
                        <div className="detail-value principal-id">
                          <span className="principal-text">{userPrincipal.slice(0, 12)}...{userPrincipal.slice(-8)}</span>
                          <button 
                            className="copy-button"
                            onClick={() => navigator.clipboard.writeText(userPrincipal)}
                            title="Copy full Principal ID"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                      
                      {userDashboard && (
                        <>
                          <div className="detail-item">
                            <span className="detail-label">Memory Nodes</span>
                            <span className="detail-value">{userDashboard.total_memories || 0}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">Conversations</span>
                            <span className="detail-value">{userDashboard.total_conversations || 0}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">Days Active</span>
                            <span className="detail-value">{userDashboard.days_since_first_interaction || 0}</span>
                          </div>
                          
                          <div className="progress-section">
                            <div className="progress-item-popup">
                              <div className="progress-header">
                                <span className="progress-label-popup">Memory Strength</span>
                                <span className="progress-percentage">{Math.round((userDashboard.memory_strength || 0) * 100)}%</span>
                              </div>
                              <div className="progress-bar-popup">
                                <div 
                                  className="progress-fill-popup memory-fill"
                                  style={{ width: `${(userDashboard.memory_strength || 0) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="progress-item-popup">
                              <div className="progress-header">
                                <span className="progress-label-popup">Learning Progress</span>
                                <span className="progress-percentage">{Math.round((userDashboard.learning_progress || 0) * 100)}%</span>
                              </div>
                              <div className="progress-bar-popup">
                                <div 
                                  className="progress-fill-popup learning-fill"
                                  style={{ width: `${(userDashboard.learning_progress || 0) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="progress-item-popup">
                              <div className="progress-header">
                                <span className="progress-label-popup">Profile Complete</span>
                                <span className="progress-percentage">{Math.round((userDashboard.profile_completeness || 0) * 100)}%</span>
                              </div>
                              <div className="progress-bar-popup">
                                <div 
                                  className="progress-fill-popup profile-fill"
                                  style={{ width: `${(userDashboard.profile_completeness || 0) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="popup-actions">
                      <button className="action-button secondary">
                        <span className="action-icon">⚙️</span>
                        Settings
                      </button>
                      <button className="action-button primary">
                        <span className="action-icon">🚪</span>
                        Disconnect
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="connect-prompt">
                <span className="connect-icon">🔐</span>
                <span className="connect-text">Connect Identity</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {userDashboard && (
        <div className="progress-bar">
          <div className="progress-section">
            <div className="progress-item">
              <span className="progress-label">Memory Strength</span>
              <div className="progress-track">
                <div 
                  className="progress-fill memory-progress"
                  style={{ width: `${(userDashboard.memory_strength || 0) * 100}%` }}
                ></div>
              </div>
              <span className="progress-value">{Math.round((userDashboard.memory_strength || 0) * 100)}%</span>
            </div>
            
            <div className="progress-item">
              <span className="progress-label">Learning Progress</span>
              <div className="progress-track">
                <div 
                  className="progress-fill learning-progress"
                  style={{ width: `${(userDashboard.learning_progress || 0) * 100}%` }}
                ></div>
              </div>
              <span className="progress-value">{Math.round((userDashboard.learning_progress || 0) * 100)}%</span>
            </div>
            
            <div className="progress-item">
              <span className="progress-label">Profile Complete</span>
              <div className="progress-track">
                <div 
                  className="progress-fill profile-progress"
                  style={{ width: `${(userDashboard.profile_completeness || 0) * 100}%` }}
                ></div>
              </div>
              <span className="progress-value">{Math.round((userDashboard.profile_completeness || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .navigation-container {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .nav-brand {
          flex: 1;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-icon {
          font-size: 2.5rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .brand-text {
          color: white;
        }

        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-subtitle {
          font-size: 0.875rem;
          margin: 0;
          opacity: 0.9;
          font-weight: 400;
        }

        .nav-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }

        .nav-tabs {
          display: flex;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }

        .nav-tab {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.8);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          position: relative;
        }

        .nav-tab:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateY(-1px);
        }

        .nav-tab.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .tab-label {
          font-size: 0.95rem;
        }

        .tab-badge {
          background: #ff6b6b;
          color: white;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 1rem;
          min-width: 1.5rem;
          text-align: center;
          font-weight: 600;
        }

        .nav-actions {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        .user-info {
          display: flex;
          align-items: center;
          position: relative;
        }

        .profile-button {
          position: relative;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .profile-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .status-indicator {
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .profile-popup {
          position: absolute;
          top: calc(100% + 1rem);
          right: 0;
          width: 320px;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          z-index: 1000;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popup-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .popup-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .popup-info {
          flex: 1;
        }

        .popup-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .popup-status {
          font-size: 0.875rem;
          color: #10b981;
          margin: 0;
          font-weight: 500;
        }

        .popup-details {
          padding: 1rem 1.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .detail-value {
          font-size: 0.875rem;
          color: #1f2937;
          font-weight: 600;
        }

        .principal-id {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f3f4f6;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-family: monospace;
          font-size: 0.75rem;
        }

        .principal-text {
          flex: 1;
        }

        .copy-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.25rem;
          transition: background 0.2s;
        }

        .copy-button:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .progress-section {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .progress-item-popup {
          margin-bottom: 1rem;
        }

        .progress-item-popup:last-child {
          margin-bottom: 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label-popup {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .progress-percentage {
          font-size: 0.8rem;
          color: #1f2937;
          font-weight: 600;
        }

        .progress-bar-popup {
          height: 0.5rem;
          background: #f3f4f6;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .progress-fill-popup {
          height: 100%;
          border-radius: 0.25rem;
          transition: width 0.3s ease;
        }

        .memory-fill {
          background: linear-gradient(90deg, #4facfe, #00f2fe);
        }

        .learning-fill {
          background: linear-gradient(90deg, #43e97b, #38f9d7);
        }

        .profile-fill {
          background: linear-gradient(90deg, #fa709a, #fee140);
        }

        .popup-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .action-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button.secondary {
          background: #f3f4f6;
          color: #6b7280;
        }

        .action-button.secondary:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .action-button.primary {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        }

        .action-button.primary:hover {
          background: linear-gradient(45deg, #dc2626, #b91c1c);
          transform: translateY(-1px);
        }

        .action-icon {
          font-size: 1rem;
        }

        .user-avatar {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          color: white;
        }

        .user-status {
          font-size: 0.8rem;
          opacity: 0.9;
          font-weight: 500;
        }

        .user-id {
          font-size: 0.75rem;
          opacity: 0.7;
          font-family: monospace;
        }

        .connect-prompt {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.9rem;
        }

        .connect-icon {
          font-size: 1.2rem;
        }

        .progress-bar {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .progress-section {
          display: flex;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .progress-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .progress-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.8rem;
          font-weight: 500;
          min-width: 100px;
        }

        .progress-track {
          flex: 1;
          height: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 0.25rem;
          transition: width 0.3s ease;
        }

        .memory-progress {
          background: linear-gradient(90deg, #4facfe, #00f2fe);
        }

        .learning-progress {
          background: linear-gradient(90deg, #43e97b, #38f9d7);
        }

        .profile-progress {
          background: linear-gradient(90deg, #fa709a, #fee140);
        }

        .progress-value {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }

        @media (max-width: 768px) {
          .top-nav {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }

          .nav-center {
            order: -1;
          }

          .brand-title {
            font-size: 1.2rem;
          }

          .brand-subtitle {
            font-size: 0.8rem;
          }

          .progress-section {
            flex-direction: column;
            gap: 1rem;
          }

          .progress-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .progress-label {
            min-width: auto;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navigation;
