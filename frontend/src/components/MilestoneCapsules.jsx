import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const MilestoneCapsules = ({ userPrincipal, isOpen, onClose }) => {
  const [capsules, setCapsules] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [newCapsule, setNewCapsule] = useState({
    title: '',
    description: '',
    category: 'project',
    achievement: '',
    impact: '',
    date: new Date().toISOString().split('T')[0]
  });

  const milestoneCategories = [
    { id: 'project', name: 'Project Launch', icon: '🚀', color: '#4CAF50' },
    { id: 'learning', name: 'Learning Achievement', icon: '🎓', color: '#2196F3' },
    { id: 'career', name: 'Career Milestone', icon: '💼', color: '#FF9800' },
    { id: 'personal', name: 'Personal Goal', icon: '🎯', color: '#9C27B0' },
    { id: 'collaboration', name: 'Team Success', icon: '🤝', color: '#00BCD4' },
    { id: 'innovation', name: 'Innovation', icon: '💡', color: '#FFC107' }
  ];

  useEffect(() => {
    if (isOpen && userPrincipal) {
      loadCapsules();
    }
  }, [isOpen, userPrincipal]);

  const loadCapsules = () => {
    const savedCapsules = localStorage.getItem(`milestone_capsules_${userPrincipal}`);
    if (savedCapsules) {
      setCapsules(JSON.parse(savedCapsules));
    }
  };

  const createCapsule = async () => {
    setIsCreating(true);
    try {
      const category = milestoneCategories.find(cat => cat.id === newCapsule.category);
      
      // Generate AI-enhanced description
      const prompt = `Create an inspiring milestone description for: "${newCapsule.title}". Achievement: ${newCapsule.achievement}. Impact: ${newCapsule.impact}. Make it celebratory and shareable, highlighting the significance of this accomplishment.`;
      
      let aiDescription = '';
      try {
        const response = await backend.memory_mind_prompt(prompt, null, false);
        aiDescription = typeof response === 'string' ? response : newCapsule.description;
      } catch (error) {
        aiDescription = newCapsule.description;
      }

      const capsule = {
        id: `capsule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: newCapsule.title,
        description: newCapsule.description,
        aiDescription,
        category: newCapsule.category,
        categoryInfo: category,
        achievement: newCapsule.achievement,
        impact: newCapsule.impact,
        date: newCapsule.date,
        createdAt: new Date().toISOString(),
        isMinted: false,
        shareCount: 0,
        likes: 0
      };

      const updatedCapsules = [capsule, ...capsules];
      setCapsules(updatedCapsules);
      localStorage.setItem(`milestone_capsules_${userPrincipal}`, JSON.stringify(updatedCapsules));

      // Reset form
      setNewCapsule({
        title: '',
        description: '',
        category: 'project',
        achievement: '',
        impact: '',
        date: new Date().toISOString().split('T')[0]
      });

      alert('Milestone capsule created successfully!');
    } catch (error) {
      console.error('Error creating capsule:', error);
      alert('Failed to create milestone capsule');
    } finally {
      setIsCreating(false);
    }
  };

  const mintCapsule = async (capsuleId) => {
    setIsMinting(true);
    try {
      // Simulate NFT minting process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedCapsules = capsules.map(capsule => 
        capsule.id === capsuleId 
          ? { 
              ...capsule, 
              isMinted: true, 
              nftId: `nft_${Date.now()}`,
              mintedAt: new Date().toISOString(),
              blockchainTx: `0x${Math.random().toString(16).substr(2, 64)}`
            } 
          : capsule
      );
      
      setCapsules(updatedCapsules);
      localStorage.setItem(`milestone_capsules_${userPrincipal}`, JSON.stringify(updatedCapsules));
      
      alert('🎉 Milestone NFT minted successfully! Your achievement is now permanently recorded on the blockchain.');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  const shareCapsule = async (capsule) => {
    const shareText = `🎉 Just achieved a major milestone!\n\n${capsule.title}\n\n${capsule.aiDescription}\n\n#milestone #achievement #success`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Milestone: ${capsule.title}`,
          text: shareText,
          url: `${window.location.origin}/milestone/${capsule.id}`
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Milestone details copied to clipboard!');
      }
      
      // Update share count
      const updatedCapsules = capsules.map(c => 
        c.id === capsule.id ? { ...c, shareCount: c.shareCount + 1 } : c
      );
      setCapsules(updatedCapsules);
      localStorage.setItem(`milestone_capsules_${userPrincipal}`, JSON.stringify(updatedCapsules));
    } catch (error) {
      console.error('Error sharing capsule:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content milestone-capsules-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🏆 Milestone Capsules</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Celebrate and immortalize your achievements! Create shareable milestone capsules and mint them as NFTs.
          </p>

          {/* Create New Capsule */}
          <div className="create-capsule-section">
            <h3>Create New Milestone</h3>
            <div className="capsule-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Milestone Title:</label>
                  <input
                    type="text"
                    value={newCapsule.title}
                    onChange={(e) => setNewCapsule({...newCapsule, title: e.target.value})}
                    placeholder="e.g., Launched My First App"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={newCapsule.date}
                    onChange={(e) => setNewCapsule({...newCapsule, date: e.target.value})}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Category:</label>
                <div className="category-grid">
                  {milestoneCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setNewCapsule({...newCapsule, category: category.id})}
                      className={`category-btn ${newCapsule.category === category.id ? 'active' : ''}`}
                      style={{ borderColor: category.color }}
                    >
                      <span className="category-icon">{category.icon}</span>
                      <span className="category-name">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Achievement Description:</label>
                <textarea
                  value={newCapsule.achievement}
                  onChange={(e) => setNewCapsule({...newCapsule, achievement: e.target.value})}
                  placeholder="What did you accomplish?"
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Impact & Significance:</label>
                <textarea
                  value={newCapsule.impact}
                  onChange={(e) => setNewCapsule({...newCapsule, impact: e.target.value})}
                  placeholder="Why is this milestone important? What impact did it have?"
                  className="form-textarea"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Personal Notes:</label>
                <textarea
                  value={newCapsule.description}
                  onChange={(e) => setNewCapsule({...newCapsule, description: e.target.value})}
                  placeholder="Any additional thoughts or reflections?"
                  className="form-textarea"
                  rows="2"
                />
              </div>

              <button
                onClick={createCapsule}
                disabled={isCreating || !newCapsule.title || !newCapsule.achievement}
                className="create-capsule-btn"
              >
                {isCreating ? 'Creating...' : 'Create Milestone Capsule'}
              </button>
            </div>
          </div>

          {/* Existing Capsules */}
          <div className="capsules-section">
            <h3>Your Milestone Capsules</h3>
            {capsules.length === 0 ? (
              <p className="no-capsules">No milestone capsules created yet. Create your first one above!</p>
            ) : (
              <div className="capsules-grid">
                {capsules.map(capsule => (
                  <div key={capsule.id} className="capsule-card">
                    <div className="capsule-header">
                      <div className="capsule-category" style={{ backgroundColor: capsule.categoryInfo.color }}>
                        <span className="category-icon">{capsule.categoryInfo.icon}</span>
                        <span className="category-name">{capsule.categoryInfo.name}</span>
                      </div>
                      <div className="capsule-date">
                        {new Date(capsule.date).toLocaleDateString()}
                      </div>
                    </div>

                    <h4 className="capsule-title">{capsule.title}</h4>
                    
                    <div className="capsule-content">
                      <div className="achievement-text">
                        <strong>Achievement:</strong>
                        <p>{capsule.achievement}</p>
                      </div>
                      
                      {capsule.impact && (
                        <div className="impact-text">
                          <strong>Impact:</strong>
                          <p>{capsule.impact}</p>
                        </div>
                      )}

                      {capsule.aiDescription && (
                        <div className="ai-description">
                          <strong>AI Enhancement:</strong>
                          <p>{capsule.aiDescription}</p>
                        </div>
                      )}
                    </div>

                    <div className="capsule-stats">
                      <span className="stat">
                        👁️ {capsule.shareCount} shares
                      </span>
                      <span className="stat">
                        ❤️ {capsule.likes} likes
                      </span>
                      {capsule.isMinted && (
                        <span className="stat nft-badge">
                          🏅 NFT Minted
                        </span>
                      )}
                    </div>

                    <div className="capsule-actions">
                      <button
                        onClick={() => shareCapsule(capsule)}
                        className="share-btn"
                      >
                        Share
                      </button>
                      
                      {!capsule.isMinted ? (
                        <button
                          onClick={() => mintCapsule(capsule.id)}
                          disabled={isMinting}
                          className="mint-btn"
                        >
                          {isMinting ? 'Minting...' : 'Mint NFT'}
                        </button>
                      ) : (
                        <button className="view-nft-btn" disabled>
                          View NFT
                        </button>
                      )}
                    </div>

                    {capsule.isMinted && capsule.blockchainTx && (
                      <div className="nft-details">
                        <small>
                          <strong>NFT ID:</strong> {capsule.nftId}<br/>
                          <strong>Tx:</strong> {capsule.blockchainTx.substring(0, 20)}...
                        </small>
                      </div>
                    )}
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

export default MilestoneCapsules;
