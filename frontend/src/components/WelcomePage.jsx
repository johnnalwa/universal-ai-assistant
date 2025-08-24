import React from 'react';
import { FiCpu, FiLink, FiMessageCircle, FiLock, FiBookOpen, FiHelpCircle, FiGlobe } from 'react-icons/fi';
import '../styles/animations.css';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-200 rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-red-300 rounded-full opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Full Width Logo Section */}
      <div className="relative z-10 w-full">
        <div className="w-full px-6 py-8 text-center">
          {/* Full Width Logo */}
          <div className="mb-8 animate-fade-in">
            <div className="w-full max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-500">
              <img src="/logo.svg" alt="Universal AI Assistant" className="w-full h-auto max-h-32 md:max-h-40 filter drop-shadow-2xl animate-float" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          {/* Main Content */}
          <div className="mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <p className="text-lg md:text-xl text-gray-600 mb-8 font-medium">
              Your Personal AI That Remembers Everything
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <FiCpu className="text-lg text-red-500" />
                <span className="text-gray-800 font-medium text-sm">Permanent Memory</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <FiLink className="text-lg text-blue-500" />
                <span className="text-gray-800 font-medium text-sm">Knowledge Graph</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300 transform hover:scale-105">
                <FiLock className="text-lg text-purple-500" />
                <span className="text-gray-800 font-medium text-sm">You Own Your Data</span>
              </div>
            </div>
          </div>
          
          {/* Connection Section */}
          <div className="max-w-md mx-auto animate-slide-up" style={{animationDelay: '0.6s'}}>
            {userPrincipal ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-800 font-semibold">Connected</span>
                  </div>
                </div>
                
                {/* User Stats */}
                {userDashboard && (
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 text-center border border-red-200">
                      <div className="text-xl font-bold text-red-600">
                        {formatNumber(userDashboard.total_memories || 0)}
                      </div>
                      <div className="text-red-700 text-xs">Memories</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center border border-blue-200">
                      <div className="text-xl font-bold text-blue-600">
                        {Math.round((userDashboard.memory_strength || 0) * 100)}%
                      </div>
                      <div className="text-blue-700 text-xs">Strength</div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={() => onGetStarted()}
                    className="w-full bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle className="text-lg" />
                    Start Chatting
                  </button>
                  <button
                    onClick={() => onViewMemory()}
                    className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-800 py-3 px-6 rounded-xl font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiCpu className="text-lg" />
                    View Memory
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Connect Your Identity</h3>
                  <p className="text-gray-600 mb-6">
                    Start building your personal AI knowledge graph
                  </p>
                </div>
                <button
                  onClick={onConnect}
                  className="bg-gradient-to-r from-red-500 to-blue-500 hover:from-red-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                  </svg>
                  Connect to ICP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simplified Features Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-4 animate-slide-up" style={{animationDelay: '0.8s'}}>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
            <FiCpu className="text-2xl mb-2 text-red-500" />
            <h3 className="font-semibold mb-1 text-gray-800">Personal Memory</h3>
            <p className="text-gray-600 text-xs">
              Builds knowledge about you with every conversation
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
            <FiLink className="text-2xl mb-2 text-blue-500" />
            <h3 className="font-semibold mb-1 text-gray-800">Smart Connections</h3>
            <p className="text-gray-600 text-xs">
              Links information to provide contextual responses
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
            <FiGlobe className="text-2xl mb-2 text-purple-500" />
            <h3 className="font-semibold mb-1 text-gray-800">Decentralized</h3>
            <p className="text-gray-600 text-xs">
              Your AI runs on blockchain - you own and control it
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-xs animate-fade-in" style={{animationDelay: '1s'}}>
          <p>Built on Internet Computer Protocol</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;