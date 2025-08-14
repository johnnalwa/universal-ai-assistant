import React, { useState, useEffect } from 'react';

const MemoryDashboard = ({
  userPrincipal,
  userKnowledgeGraph,
  userDashboard,
  onBackToChat,
  onBackToWelcome,
  onRefresh,
  onOpenConsentLinks,
  onOpenSmartRoutines,
  onOpenMilestoneCapsules
}) => {
  const [memories, setMemories] = useState([]);
  const [selectedMemoryType, setSelectedMemoryType] = useState('all');
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  
  useEffect(() => {
    if (userKnowledgeGraph && userKnowledgeGraph.memory_nodes) {
      const memoryArray = Object.values(userKnowledgeGraph.memory_nodes);
      setMemories(memoryArray);
    }
  }, [userKnowledgeGraph]);

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getMemoryTypeIcon = (type) => {
    const icons = {
      Fact: '📝',
      Preference: '❤️',
      Goal: '🎯',
      Relationship: '👥',
      Experience: '✨',
      Knowledge: '📚',
      Context: '🔗'
    };
    return icons[type] || '📄';
  };

  const getMemoryTypeColor = (type) => {
    const colors = {
      Fact: 'bg-blue-50 text-blue-700 border-blue-200',
      Preference: 'bg-pink-50 text-pink-700 border-pink-200',
      Goal: 'bg-green-50 text-green-700 border-green-200',
      Relationship: 'bg-purple-50 text-purple-700 border-purple-200',
      Experience: 'bg-orange-50 text-orange-700 border-orange-200',
      Knowledge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      Context: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const filteredMemories = selectedMemoryType === 'all' 
    ? memories 
    : memories.filter(memory => memory.node_type === selectedMemoryType);

  const handleMemoryGarden = async () => {
    setIsLoadingAction(true);
    setActiveAction('garden');
    try {
      // Simulate memory garden visualization
      console.log('Opening Memory Garden visualization...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Memory Garden: Visual exploration of your knowledge connections (Feature in development)');
    } catch (error) {
      console.error('Error opening Memory Garden:', error);
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleLearningInsights = async () => {
    setIsLoadingAction(true);
    setActiveAction('insights');
    try {
      // Generate learning insights from user data
      console.log('Generating learning insights...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Learning Insights: Your learning patterns and progress analytics (Feature in development)');
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleShareProfile = async () => {
    setIsLoadingAction(true);
    setActiveAction('share');
    try {
      // Generate shareable profile link
      const shareUrl = `${window.location.origin}/profile/${userPrincipal}`;
      await navigator.clipboard.writeText(shareUrl);
      alert(`Profile link copied to clipboard: ${shareUrl}`);
    } catch (error) {
      console.error('Error sharing profile:', error);
      alert('Error generating share link');
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleMintMilestone = async () => {
    setIsLoadingAction(true);
    setActiveAction('mint');
    try {
      // Mint milestone NFT
      console.log('Minting milestone NFT...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Milestone NFT minted successfully! (Feature in development)');
    } catch (error) {
      console.error('Error minting milestone:', error);
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToChat}
              className="bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            >
              ← Back to Chat
            </button>
            <button
              onClick={onBackToWelcome}
              className="bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-600 hover:bg-white transition-colors"
            >
              🏠 Home
            </button>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🧠 My Memory Dashboard
          </h1>
          
          <button
            onClick={onRefresh}
            className="bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-blue-600 hover:bg-white transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {/* Dashboard Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button 
            className={`flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-600 hover:bg-white transition-colors ${activeAction === 'garden' ? 'opacity-50' : ''}`}
            onClick={handleMemoryGarden}
            disabled={isLoadingAction}
          >
            <span>🌳</span>
            <span>{activeAction === 'garden' ? 'Loading...' : 'Memory Garden'}</span>
          </button>
          <button 
            className={`flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-600 hover:bg-white transition-colors ${activeAction === 'insights' ? 'opacity-50' : ''}`}
            onClick={handleLearningInsights}
            disabled={isLoadingAction}
          >
            <span>📊</span>
            <span>{activeAction === 'insights' ? 'Loading...' : 'Learning Insights'}</span>
          </button>
          <button 
            className={`flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-gray-600 hover:bg-white transition-colors ${activeAction === 'share' ? 'opacity-50' : ''}`}
            onClick={handleShareProfile}
            disabled={isLoadingAction}
          >
            <span>🔗</span>
            <span>{activeAction === 'share' ? 'Copying...' : 'Share Profile'}</span>
          </button>
          <button 
            className={`flex items-center gap-2 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all ${activeAction === 'mint' ? 'opacity-50' : ''}`}
            onClick={handleMintMilestone}
            disabled={isLoadingAction}
          >
            <span>💊</span>
            <span>{activeAction === 'mint' ? 'Minting...' : 'Mint Milestone'}</span>
          </button>
          
          {/* New Feature Buttons */}
          <button 
            className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-purple-600 hover:bg-white transition-colors"
            onClick={onOpenConsentLinks}
          >
            <span>🔗</span>
            <span>Consent Links</span>
          </button>
          <button 
            className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-md text-sm font-medium text-green-600 hover:bg-white transition-colors"
            onClick={onOpenSmartRoutines}
          >
            <span>🔄</span>
            <span>Smart Routines</span>
          </button>
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2 shadow-lg hover:shadow-xl transition-all"
            onClick={onOpenMilestoneCapsules}
          >
            <span>🏆</span>
            <span>Milestone Capsules</span>
          </button>
        </div>

        {/* Stats Overview */}
        {userDashboard && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {Number(userDashboard.knowledge_nodes_count)}
              </div>
              <div className="text-gray-600 text-sm">Memory Nodes</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round((userDashboard.memory_strength || 0) * 100)}%
              </div>
              <div className="text-gray-600 text-sm">Memory Strength</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((userDashboard.learning_progress || 0) * 100)}%
              </div>
              <div className="text-gray-600 text-sm">Learning Progress</div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {Number(userDashboard.days_since_first_interaction)}
              </div>
              <div className="text-gray-600 text-sm">Days Learning</div>
            </div>
          </div>
        )}

        {/* Memory Type Filters */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 shadow-md mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {['all', 'Fact', 'Preference', 'Goal', 'Relationship', 'Experience', 'Knowledge'].map(type => {
              const count = type === 'all' 
                ? memories.length 
                : memories.filter(m => m.node_type === type).length;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMemoryType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedMemoryType === type 
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white/50 text-gray-600 hover:bg-white/90 hover:text-purple-700'
                  }`}
                >
                  <span className="mr-1.5">{getMemoryTypeIcon(type)}</span>
                   {type} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Nodes Grid */}
        <div>
          {filteredMemories.length > 0 ? (
            <div className="grid gap-5">
              {filteredMemories.map((memory, index) => (
                <div
                  key={memory.id || index}
                  className={`${getMemoryTypeColor(memory.node_type)} rounded-2xl p-5 shadow-sm border transition-all duration-300 hover:shadow-lg hover:border-purple-300`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getMemoryTypeIcon(memory.node_type)}</span>
                      <span className="font-semibold text-base tracking-wide">{memory.node_type}</span>
                    </div>
                    <div className="text-xs opacity-75">
                      {formatDate(memory.created_at)}
                    </div>
                  </div>
                  
                  <p className="text-gray-800 mb-4 leading-relaxed text-sm">
                    {memory.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Importance:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i}
                              className={i < Math.round(memory.importance_score * 5) ? 'text-yellow-400' : 'text-gray-300'}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </span>
                      
                      <span>
                        Accessed {memory.access_count} times
                      </span>
                    </div>
                    
                    {memory.tags && memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {memory.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="bg-white/70 px-2 py-1 rounded-md text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block bg-white/80 p-6 rounded-full shadow-lg mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {selectedMemoryType === 'all' ? 'Your Memory Graph is Empty' : `No ${selectedMemoryType} Memories Found`}
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start a conversation with your assistant to build your personal knowledge graph and unlock powerful insights.
              </p>
              <button
                onClick={onBackToChat}
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start a Conversation
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryDashboard;