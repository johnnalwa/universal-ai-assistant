import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const ConsentLinks = ({ userPrincipal, isOpen, onClose }) => {
  const [links, setLinks] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    scope: 'work', // work, personal, skills, goals
    duration: '24h', // 1h, 24h, 7d, 30d
    description: ''
  });

  useEffect(() => {
    if (isOpen && userPrincipal) {
      loadConsentLinks();
    }
  }, [isOpen, userPrincipal]);

  const loadConsentLinks = () => {
    // Load from localStorage for now
    const savedLinks = localStorage.getItem(`consent_links_${userPrincipal}`);
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  };

  const createConsentLink = async () => {
    setIsCreating(true);
    try {
      const linkId = `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date();
      
      switch (newLink.duration) {
        case '1h': expiresAt.setHours(expiresAt.getHours() + 1); break;
        case '24h': expiresAt.setHours(expiresAt.getHours() + 24); break;
        case '7d': expiresAt.setDate(expiresAt.getDate() + 7); break;
        case '30d': expiresAt.setDate(expiresAt.getDate() + 30); break;
      }

      const consentLink = {
        id: linkId,
        name: newLink.name,
        scope: newLink.scope,
        description: newLink.description,
        url: `${window.location.origin}/shared/${linkId}`,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        accessCount: 0,
        isActive: true
      };

      const updatedLinks = [...links, consentLink];
      setLinks(updatedLinks);
      localStorage.setItem(`consent_links_${userPrincipal}`, JSON.stringify(updatedLinks));

      // Reset form
      setNewLink({ name: '', scope: 'work', duration: '24h', description: '' });
      
      // Copy to clipboard
      await navigator.clipboard.writeText(consentLink.url);
      alert('Consent link created and copied to clipboard!');
      
    } catch (error) {
      console.error('Error creating consent link:', error);
      alert('Failed to create consent link');
    } finally {
      setIsCreating(false);
    }
  };

  const revokeLink = (linkId) => {
    const updatedLinks = links.map(link => 
      link.id === linkId ? { ...link, isActive: false } : link
    );
    setLinks(updatedLinks);
    localStorage.setItem(`consent_links_${userPrincipal}`, JSON.stringify(updatedLinks));
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const isExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content consent-links-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 Consent Links</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Create secure, expiring links to share specific parts of your AI memory with others.
          </p>

          {/* Create New Link Form */}
          <div className="create-link-section">
            <h3>Create New Consent Link</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Link Name:</label>
                <input
                  type="text"
                  value={newLink.name}
                  onChange={(e) => setNewLink({...newLink, name: e.target.value})}
                  placeholder="e.g., Work Context for John"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Scope:</label>
                <select
                  value={newLink.scope}
                  onChange={(e) => setNewLink({...newLink, scope: e.target.value})}
                  className="form-select"
                >
                  <option value="work">Work Context</option>
                  <option value="personal">Personal Info</option>
                  <option value="skills">Skills & Expertise</option>
                  <option value="goals">Goals & Projects</option>
                  <option value="preferences">Communication Style</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration:</label>
                <select
                  value={newLink.duration}
                  onChange={(e) => setNewLink({...newLink, duration: e.target.value})}
                  className="form-select"
                >
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="30d">30 Days</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description (Optional):</label>
                <textarea
                  value={newLink.description}
                  onChange={(e) => setNewLink({...newLink, description: e.target.value})}
                  placeholder="What will this link be used for?"
                  className="form-textarea"
                  rows="2"
                />
              </div>
            </div>

            <button
              onClick={createConsentLink}
              disabled={isCreating || !newLink.name}
              className="create-btn"
            >
              {isCreating ? 'Creating...' : 'Create Consent Link'}
            </button>
          </div>

          {/* Existing Links */}
          <div className="existing-links-section">
            <h3>Your Consent Links</h3>
            {links.length === 0 ? (
              <p className="no-links">No consent links created yet.</p>
            ) : (
              <div className="links-list">
                {links.map(link => (
                  <div key={link.id} className={`link-card ${!link.isActive ? 'revoked' : isExpired(link.expiresAt) ? 'expired' : ''}`}>
                    <div className="link-header">
                      <div className="link-name">{link.name}</div>
                      <div className="link-status">
                        {!link.isActive ? (
                          <span className="status revoked">Revoked</span>
                        ) : isExpired(link.expiresAt) ? (
                          <span className="status expired">Expired</span>
                        ) : (
                          <span className="status active">Active</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="link-details">
                      <div className="link-scope">Scope: {link.scope}</div>
                      <div className="link-expires">
                        Expires: {new Date(link.expiresAt).toLocaleString()}
                      </div>
                      <div className="link-access">Access Count: {link.accessCount}</div>
                      {link.description && (
                        <div className="link-description">{link.description}</div>
                      )}
                    </div>

                    <div className="link-actions">
                      {link.isActive && !isExpired(link.expiresAt) && (
                        <>
                          <button
                            onClick={() => copyLink(link.url)}
                            className="copy-btn"
                          >
                            Copy Link
                          </button>
                          <button
                            onClick={() => revokeLink(link.id)}
                            className="revoke-btn"
                          >
                            Revoke
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentLinks;
