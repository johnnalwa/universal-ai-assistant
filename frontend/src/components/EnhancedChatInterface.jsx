import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { backend } from 'declarations/backend';

const EnhancedChatInterface = ({ 
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
  const [isTyping, setIsTyping] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

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
    setIsTyping(true);

    // Add user message to chat immediately for better UX
    setChat(prev => [...prev, { user: { content: userMessage, timestamp: Date.now() } }]);
    setIsLoading(true);

    try {
      let response;
      if (icpMode) {
        response = await backend.icp_ai_prompt(
          userMessage,
          selectedProvider ? [selectedProvider] : [],
          assistantType ? [assistantType] : [],
          storeOnChain ? [storeOnChain] : []
        );
      } else {
        response = await backend.memory_mind_prompt(userMessage, null, [true]);
      }

      if (response && response.Ok) {
        // Simulate typing effect
        setTimeout(() => {
          setChat(prev => [...prev, { system: { content: response.Ok, provider: selectedProvider, timestamp: Date.now() } }]);
          setIsTyping(false);
        }, 1000);
      } else {
        setChat(prev => [...prev, { system: { content: "Error: " + response?.Err || "Failed to get response", provider: "system" } }]);
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setChat(prev => [...prev, { system: { content: "Error: " + error.message, provider: "system" } }]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="enhanced-chat-container">
      <div className="chat-header">
        <div className="chat-info">
          <h2>AI Assistant</h2>
          <div className="status-indicator">
            <div className={`status-dot ${isTyping ? 'typing' : 'online'}`}></div>
            <span>{isTyping ? 'AI is typing...' : 'Online'}</span>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Clear chat" onClick={() => setChat([])}>
            🗑️
          </button>
          <button className="action-btn" title="Settings" onClick={() => {}}>
            ⚙️
          </button>
        </div>
      </div>

      <div className="chat-messages" ref={chatBoxRef}>
        {chat.map((message, index) => (
          <div key={index} className={`message ${message.user ? 'user-message' : 'system-message'}`}>
            <div className="message-content">
              <div className="message-text">
                <ReactMarkdown>
                  {message.user?.content || message.system?.content}
                </ReactMarkdown>
              </div>
              <div className="message-meta">
                <span className="message-time">
                  {formatMessageTime(message.user?.timestamp || message.system?.timestamp)}
                </span>
                {message.system?.provider && (
                  <span className="message-provider">
                    via {message.system.provider}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message system-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Shift+Enter for new line)"
              rows="1"
              className="chat-input"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
