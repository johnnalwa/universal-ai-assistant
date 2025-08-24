import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { FiSearch, FiFilter, FiDownload, FiUpload, FiRefreshCw, FiArrowLeft, FiHome, FiUsers, FiBox, FiLink, FiTrendingUp, FiBrain, FiCalendar, FiStar, FiBell, FiX, FiFileText, FiHeart, FiTarget, FiBook, FiFile, FiSettings, FiGitBranch, FiZap, FiGlobe, FiAward } from 'react-icons/fi';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  useEffect(() => {
    if (userKnowledgeGraph && userKnowledgeGraph.memory_nodes) {
      const memoryArray = Object.values(userKnowledgeGraph.memory_nodes);
      setMemories(memoryArray);
    }
  }, [userKnowledgeGraph]);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = [
      {
        id: 1,
        type: 'info',
        title: 'Memory System Active',
        message: 'Your personal knowledge graph is learning from conversations',
        timestamp: Date.now(),
        read: false
      },
      {
        id: 2,
        type: 'success',
        title: 'New Features Available',
        message: 'Smart Routines, Milestone Capsules, and Consent Links are now ready',
        timestamp: Date.now() - 3600000,
        read: false
      }
    ];
    setNotifications(initNotifications);
  }, []);

  // Enhanced memory search function
  const handleSearch = async (query) => {
    if (!query.trim() || !userPrincipal) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await backend.search_user_memories(userPrincipal, query, 10);
      if (results.Ok) {
        setSearchResults(results.Ok);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search memories');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, userPrincipal]);

  const handleExportData = async () => {
    if (!userPrincipal) return;
    
    setIsLoadingAction(true);
    setActiveAction('export');
    const loadingToast = toast.loading('Exporting your data...');
    
    try {
      const exportData = await backend.export_user_data(userPrincipal);
      if (exportData.Ok) {
        const dataStr = JSON.stringify(exportData.Ok, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `memory-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully!', { id: loadingToast });
      } else {
        toast.error('Failed to export data', { id: loadingToast });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', { id: loadingToast });
    } finally {
      setIsLoadingAction(false);
      setActiveAction(null);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getMemoryTypeIcon = (type) => {
    const iconComponents = {
      Fact: FiFileText,
      Preference: FiHeart,
      Goal: FiTarget,
      Relationship: FiUsers,
      Experience: FiStar,
      Knowledge: FiBook,
      Context: FiLink
    };
    const IconComponent = iconComponents[type] || FiFile;
    return <IconComponent className="text-blue-500" size={16} />;
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
    : memories.filter(memory => memory && memory.node_type === selectedMemoryType);

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
    <div className="min-h-full bg-white p-3">
      <Toaster position="top-right" />
      
      {/* Simplified Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My AI Memory</h1>
          <p className="text-sm text-gray-500">What I've learned about you</p>
        </div>
        <button 
          onClick={onBackToChat} 
          className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
        >
          Back to Chat
        </button>
      </div>

      {/* Quick Stats */}
      {userDashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{Number(userDashboard.knowledge_nodes_count)}</div>
            <div className="text-xs text-gray-600">Memories</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-green-600">{Math.round((userDashboard.memory_strength || 0) * 100)}%</div>
            <div className="text-xs text-gray-600">Strength</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-purple-600">{Math.round((userDashboard.learning_progress || 0) * 100)}%</div>
            <div className="text-xs text-gray-600">Progress</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-xl font-bold text-orange-600">{Number(userDashboard.days_since_first_interaction)}</div>
            <div className="text-xs text-gray-600">Days</div>
          </div>
        </div>
      )}

      {/* Simple Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={handleExportData}
          disabled={isLoadingAction}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
        >
          <FiDownload size={14} />
          Export Data
        </button>
        <button
          onClick={onOpenSmartRoutines}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
        >
          <FiUsers size={14} />
          Routines
        </button>
        <button
          onClick={onOpenMilestoneCapsules}
          className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-2"
        >
          <FiBox size={14} />
          Milestones
        </button>
      </div>

      {/* Memory Type Filters */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'Fact', 'Preference', 'Goal', 'Relationship', 'Experience', 'Knowledge'].map(type => {
            const count = type === 'all' 
              ? memories.length 
              : memories.filter(m => m.node_type === type).length;
            
            return (
              <button
                key={type}
                onClick={() => setSelectedMemoryType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all ${selectedMemoryType === type 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Memory List */}
      <div className="space-y-3">
        {filteredMemories.length > 0 ? (
          filteredMemories.map((memory, index) => {
            if (!memory || !memory.node_type) return null;
            return (
              <div
                key={memory.id || index}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMemoryTypeIcon(memory.node_type)}
                    <span className="font-medium text-sm text-gray-900">{memory.node_type}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(memory.created_at)}
                  </span>
                </div>
                
                <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                  {memory.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>
                      {[...Array(Math.round(memory.importance_score * 5))].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </span>
                    <span>Used {memory.access_count} times</span>
                  </div>
                  
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex gap-1">
                      {memory.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-gray-100 px-2 py-0.5 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              🧠
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {selectedMemoryType === 'all' ? 'No memories yet' : `No ${selectedMemoryType} memories`}
            </h3>
            <p className="text-gray-500 mb-4">
              Chat with me to start building your personal knowledge graph
            </p>
            <button
              onClick={onBackToChat}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
            >
              Start Chatting
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryDashboard;