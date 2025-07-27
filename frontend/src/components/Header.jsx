import React, { useState, useEffect, useRef } from 'react';

const Header = ({ userPrincipal, onConnect, onDisconnect }) => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
    };

    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Universal AI Assistant</h1>
              <p className="text-blue-100 text-sm">Powered by Internet Computer</p>
            </div>
          </div>

          {/* Identity Section */}
          <div className="relative flex items-center space-x-4">
            {userPrincipal ? (
              <>
                <button
                  onClick={() => setShowProfilePopup(!showProfilePopup)}
                  className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white/30 hover:ring-white/50 transition-all"
                  title="Profile"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Profile Popup */}
                {showProfilePopup && (
                  <div ref={popupRef} className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-80 z-50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Connected Identity</h3>
                        <p className="text-sm text-green-600">✓ Authenticated</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Principal ID:</label>
                        <p className="text-sm font-mono bg-gray-100 p-2 rounded mt-1 break-all">
                          {userPrincipal}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2 pt-3 border-t">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(userPrincipal);
                            alert('Principal ID copied to clipboard!');
                          }}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Copy ID
                        </button>
                        <button
                          onClick={() => {
                            onDisconnect();
                            setShowProfilePopup(false);
                          }}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={onConnect}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors shadow-md"
              >
                Connect Identity
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
