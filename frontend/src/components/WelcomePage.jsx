import React from 'react';

const WelcomePage = ({ 
  userPrincipal, 
  userDashboard,
  onConnect, 
  onDisconnect, 
  onGetStarted,
  onViewMemory
}) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (typeof num === 'bigint') num = Number(num);
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="relative mb-8">
            <span className="text-6xl md:text-8xl filter drop-shadow-lg">🧠</span>
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Universal AI Assistant
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-6 font-medium">
            Your Personal AI That Remembers Everything
          </p>
          
          <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Built on Internet Computer Protocol with permanent memory and knowledge graphs.
            Your conversations, insights, and personal data stay with you forever.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-2xl">🧠</span>
              <span className="text-white font-medium">Permanent Memory</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-2xl">🔗</span>
              <span className="text-white font-medium">Knowledge Graph</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <span className="text-2xl">🔐</span>
              <span className="text-white font-medium">You Own Your Data</span>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="max-w-md mx-auto">
            {userPrincipal ? (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Connected to ICP</span>
                  </div>
                  <button 
                    onClick={onDisconnect}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-colors border border-red-400/30"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="text-center mb-4">
                  <div className="text-blue-100 text-sm font-mono">
                    {userPrincipal.slice(0, 12)}...{userPrincipal.slice(-8)}
                  </div>
                </div>
                
                {/* User Stats */}
                {userDashboard && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {formatNumber(userDashboard.total_memories || 0)}
                      </div>
                      <div className="text-blue-200 text-sm">Memory Nodes</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round((userDashboard.memory_strength || 0) * 100)}%
                      </div>
                      <div className="text-blue-200 text-sm">Memory Strength</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {userDashboard.total_conversations || 0}
                      </div>
                      <div className="text-blue-200 text-sm">Conversations</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round((userDashboard.profile_completeness || 0) * 100)}%
                      </div>
                      <div className="text-blue-200 text-sm">Profile Complete</div>
                    </div>
                  </div>
                )}
                
                <div className="action-buttons">
                  <button onClick={onGetStarted} className="primary-button">
                    <span className="button-icon">💬</span>
                    Start Chatting
                  </button>
                  <button onClick={onViewMemory} className="secondary-button">
                    <span className="button-icon">🧠</span>
                    View Memory
                  </button>
                </div>
              </div>
            ) : (
              <div className="disconnected-card">
                <div className="connection-header">
                  <div className="status-indicator disconnected"></div>
                  <span className="connection-text">Ready to Connect</span>
                </div>
                <p className="connection-description">
                  Connect with Internet Identity to start building your personal AI brain
                </p>
                <button onClick={onConnect} className="connect-button">
                  <span className="button-icon">🔐</span>
                  Connect Internet Identity
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold mb-2">Personal Knowledge Graph</h3>
            <p className="text-gray-600 text-sm">
              I build a comprehensive map of your interests, goals, preferences, and context that grows with every conversation
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🤔</div>
            <h3 className="text-lg font-semibold mb-2">Smart Inquiry System</h3>
            <p className="text-gray-600 text-sm">
              Instead of guessing, I ask clarifying questions to give you the most relevant and helpful responses
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">💭</div>
            <h3 className="text-lg font-semibold mb-2">Contextual Memory</h3>
            <p className="text-gray-600 text-sm">
              I remember our previous conversations and reference them naturally, making each interaction more meaningful
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold mb-2">Relationship Mapping</h3>
            <p className="text-gray-600 text-sm">
              I understand how different pieces of information connect, creating a rich web of knowledge about you
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2">Continuous Learning</h3>
            <p className="text-gray-600 text-sm">
              Every interaction teaches me more about you, making future conversations more personalized and helpful
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold mb-2">Decentralized & Yours</h3>
            <p className="text-gray-600 text-sm">
              Your personal AI brain runs on ICP blockchain - you own it, control it, and it can never be taken away
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {!userPrincipal ? (
            <>
              <button
                onClick={onConnect}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-xl">🧠</span>
                Start Building Your AI Brain
              </button>
              <button
                onClick={onGetStarted}
                className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-gray-200"
              >
                Try Without Connecting
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-xl">💬</span>
                Start Chatting
              </button>
              <button
                onClick={onViewMemory}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-xl">🧠</span>
                View My Memory
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built on Internet Computer Protocol • Powered by Personal Knowledge Graphs</p>
          <p className="mt-1">Your AI brain that grows with you, forever</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;