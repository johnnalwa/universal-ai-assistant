import React, { useState, useEffect, useRef } from 'react';
import { backend } from 'declarations/backend';
import '../styles/enhanced-chat.css';

const EnhancedChatInterface = ({ 
  chat, 
  setChat, 
  selectedProvider, 
  setSelectedProvider,
  assistantType, 
  setAssistantType,
  storeOnChain, 
  setStoreOnChain,
  userPrincipal,
  icpMode,
  setIcpMode
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);

    const newChat = [...chat, { user: { content: userMessage } }];
    setChat(newChat);

    try {
      let response;
      if (icpMode) {
        response = await backend.icp_ai_prompt(
          userMessage, 
          [selectedProvider], 
          [assistantType], 
          [storeOnChain]
        );
      } else {
        response = await backend.memory_mind_prompt(userMessage, [], [true]);
      }

      if ('Ok' in response) {
        setChat([...newChat, { system: { content: response.Ok, provider: selectedProvider } }]);
      } else if ('Err' in response) {
        setChat([...newChat, { system: { content: `Error: ${response.Err}`, provider: selectedProvider } }]);
      } else {
        // Fallback for unexpected response structure
        setChat([...newChat, { system: { content: 'Received an unexpected response format.', provider: selectedProvider } }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChat([...newChat, { system: { content: `Error: ${error.message}`, provider: selectedProvider } }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleClearChat = () => {
    setChat([
      {
        system: {
          content: "🧠 I'm ready to continue our conversation! How can I help you today?",
          provider: selectedProvider
        }
      }
    ]);
  };

  return (
    <div className="enhanced-chat-container">
      <div className="chat-header">
        <div className="header-content">
          <h2 className="chat-title">
            <span className="title-icon">💬</span>
            AI Conversation
          </h2>
          <div className="header-controls">
            <button className="header-btn settings-btn" onClick={() => setIsSettingsOpen(!isSettingsOpen)} title="Toggle Settings">
              ⚙️
            </button>
            <button className="header-btn clear-btn" onClick={handleClearChat} title="Clear chat">
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="chat-settings">
        <div className="settings-grid">
          <div className="setting-group">
            <label>AI Provider</label>
            <select 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="setting-select"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai">OpenAI GPT</option>
              <option value="claude">Anthropic Claude</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Assistant Style</label>
            <select 
              value={assistantType} 
              onChange={(e) => setAssistantType(e.target.value)}
              className="setting-select"
            >
              <option value="casual">Casual</option>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          <div className="setting-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={icpMode}
                onChange={(e) => setIcpMode(e.target.checked)}
              />
              <span>ICP Mode</span>
            </label>
          </div>

          {icpMode && (
            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={storeOnChain}
                  onChange={(e) => setStoreOnChain(e.target.checked)}
                />
                <span>Store on-chain</span>
              </label>
            </div>
          )}
        </div>
      </div>
      )}

      <div className="messages-container">
        <div className="messages-scroll">
          {chat.map((msg, index) => (
            <div key={index} className={`message ${msg.user ? 'user-message' : 'system-message'}`}>
              <div className="message-avatar">
                {msg.user ? '👤' : '🧠'}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <div className="message-text">
                    {msg.user?.content || msg.system?.content}
                  </div>
                  {msg.system?.provider && (
                    <div className="message-meta">
                      via {msg.system.provider}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message system-message">
              <div className="message-avatar">🧠</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <form onSubmit={handleSendMessage} className="input-form">
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
              disabled={isLoading}
              className="message-input"
              rows={1}
            />
            <button 
              type="submit" 
              disabled={!message.trim() || isLoading}
              className="send-btn"
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
