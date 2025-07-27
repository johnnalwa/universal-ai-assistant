import React, { useState, useRef, useEffect } from 'react';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';

const ChatInterface = ({ 
  userPrincipal, 
  onBackToWelcome,
  initialChat = [],
  selectedProvider = 'gemini',
  assistantType = 'casual',
  storeOnChain = false,
  icpMode = false
}) => {
  const [chat, setChat] = useState(initialChat.length > 0 ? initialChat : [
    {
      system: { 
        content: "🌐 Welcome to your ICP-Native Universal AI Assistant! I'm powered by the Internet Computer with Internet Identity authentication, cycles-based payments, and on-chain storage. Your original chatting experience is preserved while adding Web3 capabilities. What would you like to explore today?",
        provider: "system"
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message to chat
    setChat(prev => [...prev, { user: { content: userMessage } }]);

    try {
      let response;
      if (icpMode) {
        // Use ICP-native prompt function with provider selection
        response = await backend.icp_ai_prompt(
          userMessage,
          selectedProvider ? [selectedProvider] : [],
          assistantType ? [assistantType] : [],
          storeOnChain ? [storeOnChain] : []
        );
      } else {
        // Use original prompt function
        response = await backend.prompt(userMessage);
      }

      if (response.Ok) {
        setChat(prev => [...prev, { 
          assistant: { 
            content: response.Ok,
            provider: selectedProvider || "gemini"
          }
        }]);
      } else {
        setChat(prev => [...prev, { 
          assistant: { 
            content: `Error: ${response.Err}`,
            provider: "error"
          }
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChat(prev => [...prev, { 
        assistant: { 
          content: `Error: Failed to send message. ${error.message}`,
          provider: "error"
        }
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="chat-header">
        <div className="header-content">
          <div className="header-controls">
            <button
              onClick={onBackToWelcome}
              className="back-button"
            >
              <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="back-text">Back</span>
            </button>
          </div>
          
          <div className="header-branding">
            <div className="brand-logo">
              <span className="brand-icon">🧠</span>
              <div className="brand-text">
                <h1 className="brand-title">Universal AI Assistant</h1>
                <p className="brand-subtitle">
                  {icpMode ? `ICP Mode • ${selectedProvider}` : 'Classic Mode'} • Your Personal AI That Remembers
                </p>
              </div>
            </div>
          </div>

          <div className="header-status">
            {userPrincipal && (
              <div className="connection-status">
                <div className="status-dot"></div>
                <span className="status-text">Connected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div 
          ref={chatBoxRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {chat.map((message, index) => (
            <div key={index} className="animate-fadeIn">
              {message.user && (
                <div className="flex items-start space-x-4 justify-end max-w-4xl ml-auto">
                  <div className="flex-1 min-w-0 flex justify-end">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md px-6 py-4 shadow-lg max-w-2xl">
                      <p className="text-base leading-relaxed font-medium">{message.user.content}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {message.assistant && (
                <div className="flex items-start space-x-4 max-w-4xl">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                      <div className="prose prose-sm max-w-none">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium text-base">
                          {message.assistant.content.split('\n').map((line, lineIndex) => {
                            // Handle bullet points
                            if (line.trim().startsWith('•') || line.trim().startsWith('*')) {
                              return (
                                <div key={lineIndex} className="flex items-start space-x-2 my-2">
                                  <span className="text-blue-500 font-bold mt-1">•</span>
                                  <span className="flex-1">{line.replace(/^[•*]\s*/, '')}</span>
                                </div>
                              );
                            }
                            // Handle numbered lists
                            if (/^\d+\./.test(line.trim())) {
                              return (
                                <div key={lineIndex} className="flex items-start space-x-2 my-2">
                                  <span className="text-purple-600 font-semibold">{line.match(/^\d+\./)[0]}</span>
                                  <span className="flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
                                </div>
                              );
                            }
                            // Handle headers (lines with **text**)
                            if (line.includes('**')) {
                              const parts = line.split('**');
                              return (
                                <div key={lineIndex} className="my-3">
                                  {parts.map((part, partIndex) => 
                                    partIndex % 2 === 1 ? 
                                      <span key={partIndex} className="font-bold text-gray-900 text-lg">{part}</span> : 
                                      <span key={partIndex}>{part}</span>
                                  )}
                                </div>
                              );
                            }
                            // Regular lines
                            return line.trim() ? (
                              <p key={lineIndex} className="my-2 leading-relaxed">{line}</p>
                            ) : (
                              <div key={lineIndex} className="my-2"></div>
                            );
                          })}
                        </div>
                      </div>
                      {message.assistant.provider && (
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-gray-600">Powered by {message.assistant.provider}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {message.system && (
                <div className="flex justify-center">
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl px-4 py-2 max-w-2xl">
                    <p className="text-sm text-gray-700 text-center">{message.system.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start space-x-4 max-w-4xl">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl rounded-tl-md px-6 py-4 shadow-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        
        .chat-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        
        .header-controls {
          flex: 1;
        }
        
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-2px);
        }
        
        .back-icon {
          width: 1.25rem;
          height: 1.25rem;
        }
        
        .back-text {
          font-weight: 500;
        }
        
        .header-branding {
          flex: 2;
          display: flex;
          justify-content: center;
        }
        
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .brand-icon {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
        
        .brand-text {
          text-align: center;
        }
        
        .brand-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(45deg, #fff, #f0f9ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .brand-subtitle {
          font-size: 0.875rem;
          margin: 0.25rem 0 0 0;
          opacity: 0.9;
          color: #e0e7ff;
        }
        
        .header-status {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }
        
        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          backdrop-filter: blur(10px);
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #10b981;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        .status-text {
          font-size: 0.875rem;
          font-weight: 500;
          color: #e0e7ff;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .header-controls,
          .header-status {
            flex: none;
          }
          
          .brand-title {
            font-size: 1.25rem;
          }
          
          .brand-subtitle {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
