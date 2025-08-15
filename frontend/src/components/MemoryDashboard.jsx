import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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
      Fact: 'bg-blue-50 text-blue-800 border-blue-200',
      Preference: 'bg-red-50 text-red-800 border-red-200',
      Goal: 'bg-green-50 text-green-800 border-green-200',
      Relationship: 'bg-purple-50 text-purple-800 border-purple-200',
      Experience: 'bg-orange-50 text-orange-800 border-orange-200',
      Knowledge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      Context: 'bg-gray-50 text-gray-800 border-gray-200'
    };
    return colors[type] || 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const filteredMemories = selectedMemoryType === 'all' 
    ? memories 
    : memories.filter(memory => memory.node_type === selectedMemoryType);

  const handleMemoryGarden = async () => {
    setIsLoadingAction(true);
    setActiveAction('garden');
    
    const loadingToast = toast.loading('Opening Memory Garden visualization...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Memory Garden: Visual exploration of your knowledge connections (Feature in development)', {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      console.error('Error opening Memory Garden:', error);
      toast.error('Failed to open Memory Garden', { id: loadingToast });
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleLearningInsights = async () => {
    setIsLoadingAction(true);
    setActiveAction('insights');
    
    const loadingToast = toast.loading('Generating learning insights...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Learning Insights: Your learning patterns and progress analytics (Feature in development)', {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast.error('Failed to generate insights', { id: loadingToast });
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleShareProfile = async () => {
    setIsLoadingAction(true);
    setActiveAction('share');
    
    const loadingToast = toast.loading('Generating share link...');
    
    try {
      const shareUrl = `${window.location.origin}/profile/${userPrincipal}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Profile link copied to clipboard!', {
        id: loadingToast,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
      toast.error('Failed to copy share link', { id: loadingToast });
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const handleMintMilestone = async () => {
    setIsLoadingAction(true);
    setActiveAction('mint');
    
    const loadingToast = toast.loading('Minting milestone NFT...');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Milestone NFT minted successfully! (Feature in development)', {
        id: loadingToast,
        duration: 4000,
      });
    } catch (error) {
      console.error('Error minting milestone:', error);
      toast.error('Failed to mint milestone NFT', { id: loadingToast });
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const ActionButton = ({ icon, title, subtitle, onClick, disabled, isActive, colorClass }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${colorClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'}`}
    >
      <div className="text-3xl mb-3 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-semibold text-white text-center text-lg tracking-wide">{title}</h3>
      {subtitle && <p className="text-sm text-white/90 text-center mt-1">{subtitle}</p>}
      {isActive && (
        <div className="absolute top-3 right-3 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      )}
    </button>
  );

  return (
    <div className="min-h-full bg-white p-4 sm:p-6 lg:p-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            Memory Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, {userPrincipal ? `${userPrincipal.slice(0, 5)}...${userPrincipal.slice(-3)}` : 'User'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBackToWelcome} 
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200" 
            title="Back to Welcome"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={onBackToChat} 
            className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Back to Chat
          </button>
        </div>
      </div>

        {/* Primary Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton 
              icon="🌳" 
              title="Memory Garden" 
              subtitle="Visualize connections" 
              onClick={handleMemoryGarden} 
              disabled={isLoadingAction} 
              isActive={activeAction === 'garden'} 
              colorClass="bg-gradient-to-br from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600" 
            />
            <ActionButton 
              icon="💡" 
              title="Learning Insights" 
              subtitle="Track your progress" 
              onClick={handleLearningInsights} 
              disabled={isLoadingAction} 
              isActive={activeAction === 'insights'} 
              colorClass="bg-gradient-to-br from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600" 
            />
            <ActionButton 
              icon="🌐" 
              title="Share Profile" 
              subtitle="Public knowledge link" 
              onClick={handleShareProfile} 
              disabled={isLoadingAction} 
              isActive={activeAction === 'share'} 
              colorClass="bg-gradient-to-br from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600" 
            />
            <ActionButton 
              icon="💎" 
              title="Mint Milestone" 
              subtitle="Create an NFT" 
              onClick={handleMintMilestone} 
              disabled={isLoadingAction} 
              isActive={activeAction === 'mint'} 
              colorClass="bg-gradient-to-br from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600" 
            />
          </div>
        </div>

        {/* Secondary Tools */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Tools & Utilities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={onOpenSmartRoutines}
              className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <span className="text-2xl mb-2">🤖</span>
              <span className="text-sm font-medium text-gray-700">Smart Routines</span>
            </button>
            <button
              onClick={onOpenMilestoneCapsules}
              className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <span className="text-2xl mb-2">📦</span>
              <span className="text-sm font-medium text-gray-700">Milestone Capsules</span>
            </button>
            <button
              onClick={onOpenConsentLinks}
              className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <span className="text-2xl mb-2">🔗</span>
              <span className="text-sm font-medium text-gray-700">Consent Links</span>
            </button>
            <button
              onClick={onRefresh}
              className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
            >
              <span className="text-2xl mb-2">🔄</span>
              <span className="text-sm font-medium text-gray-700">Refresh Data</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {userDashboard && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Progress</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {Number(userDashboard.knowledge_nodes_count)}
                </div>
                <div className="text-gray-600 text-sm font-medium">Memory Nodes</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {Math.round((userDashboard.memory_strength || 0) * 100)}%
                </div>
                <div className="text-gray-600 text-sm font-medium">Memory Strength</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {Math.round((userDashboard.learning_progress || 0) * 100)}%
                </div>
                <div className="text-gray-600 text-sm font-medium">Learning Progress</div>
              </div>
              
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent mb-2">
                  {Number(userDashboard.days_since_first_interaction)}
                </div>
                <div className="text-gray-600 text-sm font-medium">Days Learning</div>
              </div>
            </div>
          </div>
        )}

        {/* Memory Type Filters */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Memory Types</h2>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
            <div className="flex flex-wrap gap-3">
              {['all', 'Fact', 'Preference', 'Goal', 'Relationship', 'Experience', 'Knowledge'].map(type => {
                const count = type === 'all' 
                  ? memories.length 
                  : memories.filter(m => m.node_type === type).length;
                
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedMemoryType(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${selectedMemoryType === type 
                        ? 'bg-gradient-to-r from-red-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span className="mr-2">{getMemoryTypeIcon(type)}</span>
                    {type === 'all' ? 'All' : type} ({count})
                  </button>
                );
              })}
            </div>
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