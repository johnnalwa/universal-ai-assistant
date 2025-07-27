import React, { useState } from 'react';

const WalletNav = ({ userPrincipal, currentView, setCurrentView, userDashboard, onConnect, onDisconnect }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative">
                <span className="text-3xl filter drop-shadow-lg">🧠</span>
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Universal AI Assistant
                </h1>
                <p className="text-xs text-blue-200 opacity-80">Decentralized AI on ICP</p>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-1">
                <button 
                  onClick={() => setCurrentView('welcome')}
                  className={`${currentView === 'welcome' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  Home
                </button>
                <button 
                  onClick={() => setCurrentView('chat')}
                  className={`${currentView === 'chat' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                  Chat
                </button>
                <button 
                  onClick={() => setCurrentView('memory')}
                  className={`${currentView === 'memory' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Memory
                </button>
              </div>
            </div>
          </div>

          {/* Right side - Wallet Connection */}
          <div className="flex items-center space-x-4">
            {userPrincipal ? (
              <div className="relative">
                {/* Connected State */}
                <div className="flex items-center space-x-3">
                  {/* Connection Status */}
                  <div className="hidden sm:flex items-center space-x-2 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-400/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-100 text-sm font-medium">Connected</span>
                  </div>
                  
                  {/* Profile Button */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-white text-sm font-medium">My Identity</div>
                      <div className="text-blue-200 text-xs font-mono">
                        {userPrincipal.slice(0, 6)}...{userPrincipal.slice(-4)}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 z-50">
                    <div className="p-6">
                      {/* Profile Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold">Internet Identity</h3>
                          <p className="text-gray-600 text-sm font-mono">{userPrincipal}</p>
                        </div>
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                          <div className="text-blue-600 font-bold text-lg">Active</div>
                          <div className="text-blue-500 text-sm">Status</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                          <div className="text-green-600 font-bold text-lg">ICP</div>
                          <div className="text-green-500 text-sm">Network</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-2">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          View Transactions
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                          Copy Address
                        </button>
                        <button
                          onClick={onDisconnect}
                          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Disconnect Identity
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={onConnect}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                </svg>
                Connect Internet Identity
              </button>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="space-y-2">
              <button 
                onClick={() => { setCurrentView('welcome'); setIsMobileMenuOpen(false); }}
                className={`${currentView === 'welcome' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
              >
                🏠 Home
              </button>
              <button 
                onClick={() => { setCurrentView('chat'); setIsMobileMenuOpen(false); }}
                className={`${currentView === 'chat' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
              >
                💬 Chat
              </button>
              <button 
                onClick={() => { setCurrentView('memory'); setIsMobileMenuOpen(false); }}
                className={`${currentView === 'memory' ? 'bg-white/20 text-white' : 'text-blue-100 hover:bg-white/10 hover:text-white'} block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
              >
                🧠 Memory
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default WalletNav;
