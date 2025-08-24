import React, { useState, useEffect, useRef } from 'react';
import { FiUser, FiLogOut, FiDollarSign, FiZap, FiCopy, FiExternalLink } from 'react-icons/fi';
import { backend } from 'declarations/backend';
import '../styles/user-profile.css';

const UserProfile = ({ 
  userPrincipal, 
  userDashboard,
  isAuthenticated,
  onLogout,
  onLogin
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [ckBTCBalance, setCkBTCBalance] = useState('0.0000');
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [autopilotEnabled, setAutopilotEnabled] = useState(false);
  const [isUpdatingAutopilot, setIsUpdatingAutopilot] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Set user name from dashboard data
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatPrincipalId = (principal) => {
    if (!principal) return '';
    if (principal.length <= 16) return principal;
    return `${principal.substring(0, 8)}...${principal.substring(principal.length - 8)}`;
  };

  if (!isAuthenticated) {
    return (
      <button 
        className="user-profile-login-btn"
        onClick={onLogin}
        disabled={!onLogin}
      >
        <FiUser size={20} />
        <span>Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="user-profile-container" ref={dropdownRef}>
      <button 
        className="user-profile-trigger"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <div className="user-avatar">
          {userName.charAt(0).toUpperCase()}
        </div>
        <span className="user-name-short">{userName}</span>
      </button>

      {isDropdownOpen && (
        <div className="user-profile-dropdown">
          <div className="dropdown-header">
            <div className="user-avatar-large">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3 className="user-name">{userName}</h3>
              <p className="user-status">Connected</p>
            </div>
          </div>

          <div className="dropdown-section">
            <div className="section-title">Internet Identity</div>
            <div className="identity-info">
              <span className="identity-label">Principal ID:</span>
              <div className="identity-value">
                <span className="principal-id">{formatPrincipalId(userPrincipal)}</span>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(userPrincipal)}
                  title="Copy full Principal ID"
                >
                  <FiCopy size={14} />
                </button>
              </div>
              {copySuccess && <span className="copy-success">Copied!</span>}
            </div>
          </div>

          <div className="dropdown-section">
            <div className="section-title">Wallet Balance</div>
            <div className="balance-info">
              <FiDollarSign className="balance-icon" size={16} />
              <div className="balance-details">
                <span className="balance-label">ckBTC</span>
                <span className="balance-amount">
                  {isLoadingBalance ? 'Loading...' : ckBTCBalance}
                </span>
              </div>
            </div>
          </div>

          <div className="dropdown-section">
            <div className="section-title">AI Settings</div>
            <div className="autopilot-control">
              <div className="autopilot-info">
                <FiZap className="autopilot-icon" size={16} />
                <div className="autopilot-details">
                  <span className="autopilot-label">Autopilot Mode</span>
                  <span className="autopilot-description">AI learns and adapts automatically</span>
                </div>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autopilotEnabled} 
                  onChange={handleAutopilotToggle}
                  disabled={isUpdatingAutopilot}
                />
                <span className={`slider round ${isUpdatingAutopilot ? 'updating' : ''}`}></span>
              </label>
            </div>
          </div>

          <div className="dropdown-footer">
            <button 
              className="logout-btn"
              onClick={() => {
                setIsDropdownOpen(false);
                onLogout();
              }}
            >
              <FiLogOut size={16} />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
