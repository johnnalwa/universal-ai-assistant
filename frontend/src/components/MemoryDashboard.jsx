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

  const ActionButton = ({ icon, title, subtitle, onClick, disabled, isActive, colorClass }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
    >
      <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-semibold text-white text-center text-base tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-white/80 text-center">{subtitle}</p>}
      {isActive && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      )}
    </button>
  );

  return (
    <div className="min-h-full bg-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Memory Dashboard</h1>
          <p className="text-slate-400 mt-1">Welcome back, {userPrincipal ? `${userPrincipal.slice(0, 5)}...${userPrincipal.slice(-3)}` : 'User'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onBackToWelcome} className="p-2 rounded-full hover:bg-slate-700 transition-colors" title="Back to Welcome">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={onBackToChat} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg">
            Back to Chat
          </button>
        </div>
      </div>

        {/* Actions Grid */}
        <div className="mb-10 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Primary Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionButton icon="🌳" title="Memory Garden" subtitle="Visualize connections" onClick={handleMemoryGarden} disabled={isLoadingAction} isActive={activeAction === 'garden'} colorClass="bg-gradient-to-br from-green-500 to-cyan-600" />
              <ActionButton icon="💡" title="Learning Insights" subtitle="Track your progress" onClick={handleLearningInsights} disabled={isLoadingAction} isActive={activeAction === 'insights'} colorClass="bg-gradient-to-br from-yellow-500 to-orange-600" />
              <ActionButton icon="🌐" title="Share Profile" subtitle="Public knowledge link" onClick={handleShareProfile} disabled={isLoadingAction} isActive={activeAction === 'share'} colorClass="bg-gradient-to-br from-blue-500 to-indigo-600" />
              <ActionButton icon="💎" title="Mint Milestone" subtitle="Create an NFT" onClick={handleMintMilestone} disabled={isLoadingAction} isActive={activeAction === 'mint'} colorClass="bg-gradient-to-br from-purple-500 to-pink-600" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-700 pb-2">Tools & Utilities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <ActionButton icon="🤖" title="Smart Routines" onClick={onOpenSmartRoutines} colorClass="bg-slate-800 hover:bg-slate-700" />
              <ActionButton icon="캡" title="Milestone Capsules" onClick={onOpenMilestoneCapsules} colorClass="bg-slate-800 hover:bg-slate-700" />
              <ActionButton icon="🔗" title="Consent Links" onClick={onOpenConsentLinks} colorClass="bg-slate-800 hover:bg-slate-700" />
              <ActionButton icon="🔄" title="Refresh Data" onClick={onRefresh} colorClass="bg-slate-800 hover:bg-slate-700" />
            </div>
          </div>
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
  );
};

export default MemoryDashboard;