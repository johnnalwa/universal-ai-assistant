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
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 text-center">
          {/* Main Hero Content */}
          <div className="mb-12">
            <div className="relative inline-block mb-8">
              <span className="text-8xl md:text-9xl filter drop-shadow-2xl">🧠</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
                Universal AI Assistant
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-6 font-medium">
              Your Personal AI That Remembers Everything
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Built on Internet Computer Protocol with permanent memory and knowledge graphs.
              Your conversations, insights, and personal data stay with you forever.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-200 transition-all duration-300">
                <span className="text-2xl">🧠</span>
                <span className="text-gray-800 font-medium">Permanent Memory</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-200 transition-all duration-300">
                <span className="text-2xl">🔗</span>
                <span className="text-gray-800 font-medium">Knowledge Graph</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-full border border-gray-200 hover:bg-gray-200 transition-all duration-300">
                <span className="text-2xl">🔐</span>
                <span className="text-gray-800 font-medium">You Own Your Data</span>
              </div>
            </div>
          </div>
          
          {/* Connection Section */}
          <div className="max-w-lg mx-auto">
            {userPrincipal ? (
              <div className="bg-gray-100 rounded-3xl p-8 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-800 font-semibold text-lg">Connected to ICP</span>
                  </div>
                  <button 
                    onClick={onDisconnect}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors border border-red-300 text-sm"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-gray-600 text-sm font-mono bg-gray-200 rounded-lg py-2 px-4">
                    {userPrincipal.slice(0, 12)}...{userPrincipal.slice(-8)}
                  </div>
                </div>
                
                {/* User Stats */}
                {userDashboard && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <div className="text-3xl font-bold text-gray-800">
                        {formatNumber(userDashboard.total_memories || 0)}
                      </div>
                      <div className="text-gray-500 text-sm">Memory Nodes</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <div className="text-3xl font-bold text-gray-800">
                        {Math.round((userDashboard.memory_strength || 0) * 100)}%
                      </div>
                      <div className="text-gray-500 text-sm">Memory Strength</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <div className="text-3xl font-bold text-gray-800">
                        {userDashboard.total_conversations || 0}
                      </div>
                      <div className="text-gray-500 text-sm">Conversations</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                      <div className="text-3xl font-bold text-gray-800">
                        {Math.round((userDashboard.profile_completeness || 0) * 100)}%
                      </div>
                      <div className="text-gray-500 text-sm">Profile Complete</div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <button
                    onClick={() => onGetStarted()}
                    className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">💬</span>
                    Start Chatting
                  </button>
                  <button
                    onClick={() => onViewMemory()}
                    className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    <span className="text-2xl">🧠</span>
                    View My Memory
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-3xl p-10 border border-gray-200 shadow-lg text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">Connect Your Identity</h3>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    Connect with Internet Identity to start building your personal AI knowledge graph and unlock the full potential of decentralized AI.
                  </p>
                </div>
                <button
                  onClick={onConnect}
                  className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 mx-auto"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                  </svg>
                  Connect to ICP
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Personal Knowledge Graph</h3>
            <p className="text-gray-600 text-sm">
              I build a comprehensive map of your interests, goals, preferences, and context that grows with every conversation
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🤔</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Smart Inquiry System</h3>
            <p className="text-gray-600 text-sm">
              Instead of guessing, I ask clarifying questions to give you the most relevant and helpful responses
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">💭</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Contextual Memory</h3>
            <p className="text-gray-600 text-sm">
              I remember our previous conversations and reference them naturally, making each interaction more meaningful
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Relationship Mapping</h3>
            <p className="text-gray-600 text-sm">
              I understand how different pieces of information connect, creating a rich web of knowledge about you
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Continuous Learning</h3>
            <p className="text-gray-600 text-sm">
              Every interaction teaches me more about you, making future conversations more personalized and helpful
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-6 shadow-md border border-gray-200">
            <div className="text-3xl mb-3">🌐</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Decentralized & Yours</h3>
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
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-xl">🧠</span>
                Start Building Your AI Brain
              </button>
              <button
                onClick={onGetStarted}
                className="bg-gray-100 text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-gray-200"
              >
                Try Without Connecting
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
              >
                <span className="text-xl">💬</span>
                Start Chatting
              </button>
              <button
                onClick={onViewMemory}
                className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-3"
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