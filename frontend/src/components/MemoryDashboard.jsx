import React, { useState, useEffect } from 'react';

const MemoryDashboard = ({
  userPrincipal,
  userKnowledgeGraph,
  userDashboard,
  onBackToChat,
  onBackToWelcome,
  onRefresh
}) => {
  const [memories, setMemories] = useState([]);
  const [selectedMemoryType, setSelectedMemoryType] = useState('all');
  
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

        {/* Memory Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMemoryType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMemoryType === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Memories ({memories.length})
            </button>
            
            {['Fact', 'Preference', 'Goal', 'Relationship', 'Experience', 'Knowledge'].map(type => {
              const count = memories.filter(m => m.node_type === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedMemoryType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedMemoryType === type 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {getMemoryTypeIcon(type)} {type} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Memory Nodes Grid */}
      <div className="mx-auto max-w-6xl">
        {filteredMemories.length > 0 ? (
          <div className="grid gap-4">
            {filteredMemories.map((memory, index) => (
              <div
                key={memory.id || index}
                className={`${getMemoryTypeColor(memory.node_type)} rounded-2xl p-6 shadow-lg border-2 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMemoryTypeIcon(memory.node_type)}</span>
                    <span className="font-semibold text-lg">{memory.node_type}</span>
                  </div>
                  <div className="text-sm opacity-75">
                    {formatDate(memory.created_at)}
                  </div>
                </div>
                
                <div className="text-gray-800 mb-4 leading-relaxed">
                  {memory.content}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Importance:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i}
                            className={i < Math.round(memory.importance_score * 5) ? 'text-yellow-500' : 'text-gray-300'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </span>
                    
                    <span className="text-gray-600">
                      Accessed {memory.access_count} times
                    </span>
                  </div>
                  
                  {memory.tags && memory.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {memory.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-white/60 px-2 py-1 rounded-full text-xs"
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {selectedMemoryType === 'all' ? 'No Memories Yet' : `No ${selectedMemoryType} Memories`}
            </h3>
            <p className="text-gray-600 mb-6">
              Start chatting to build your personal knowledge graph!
            </p>
            <button
              onClick={onBackToChat}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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