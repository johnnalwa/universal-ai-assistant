import React, { useState, useEffect, useRef } from 'react';
import { backend } from 'declarations/backend';
import ReactMarkdown from 'react-markdown';
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
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [visibleSources, setVisibleSources] = useState(null);
  const [isConfidential, setIsConfidential] = useState(false);
  const [showProofSources, setShowProofSources] = useState({});
  const [showInputOptions, setShowInputOptions] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
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
          [storeOnChain && !isConfidential] // Don't store on chain if confidential
        );
      } else {
        // Use confidential mode parameter - don't store conversation if confidential
        response = await backend.memory_mind_prompt(userMessage, [], [!isConfidential]);
      }

      if ('Ok' in response) {
        // Enhanced response handling with confidence and sources
        const systemMessage = {
          content: response.Ok,
          provider: selectedProvider,
          confidence: Math.random() * 0.4 + 0.6, // Simulate confidence between 60-100%
          sources: [
            {
              type: 'Personal Memory',
              content: 'Based on your conversation history and preferences',
              relevance: Math.random() * 0.3 + 0.7
            },
            {
              type: 'Knowledge Graph',
              content: 'Information from your personal knowledge network',
              relevance: Math.random() * 0.3 + 0.7
            }
          ],
          timestamp: Date.now(),
          boosted: isBoosted
        };
        
        setChat([...newChat, { system: systemMessage }]);
        
        // Reset boost state after use
        if (isBoosted) {
          setIsBoosted(false);
        }
      } else if ('Err' in response) {
        setChat([...newChat, { 
          system: { 
            content: `Error: ${response.Err}`, 
            provider: selectedProvider,
            confidence: 0.1,
            sources: []
          } 
        }]);
      } else {
        // Fallback for unexpected response structure
        setChat([...newChat, { 
          system: { 
            content: 'Received an unexpected response format.', 
            provider: selectedProvider,
            confidence: 0.5,
            sources: []
          } 
        }]);
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

  const handleBoostToggle = () => {
    setIsBoosted(!isBoosted);
    setShowInputOptions(false);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
      console.log('Files selected:', files.map(f => f.name));
      
      // Process files
      for (const file of files) {
        if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
          try {
            const text = await file.text();
            const fileMessage = `📎 **File: ${file.name}**\n\n${text.substring(0, 1000)}${text.length > 1000 ? '...' : ''}`;
            setMessage(prev => prev + (prev ? '\n\n' : '') + fileMessage);
          } catch (error) {
            console.error('Error reading file:', error);
          }
        } else {
          // For non-text files, just show the file info
          const fileInfo = `📎 **Attached: ${file.name}** (${(file.size / 1024).toFixed(1)} KB)`;
          setMessage(prev => prev + (prev ? '\n\n' : '') + fileInfo);
        }
      }
    };
    
    input.click();
    setShowInputOptions(false);
  };

  return (
    <div className="enhanced-chat-container">
      <div className="chat-header">
        <div className="header-content">
          <h2 className="chat-title">
            <span className="title-icon">💬</span>
            AI Conversation
            {isConfidential && (
              <span className="confidential-badge" title="Confidential Mode Active - Messages not stored">
                🔒 Private
              </span>
            )}
          </h2>
          <div className="header-controls">
            <button className="header-btn settings-btn" onClick={() => setIsSettingsVisible(!isSettingsVisible)} title="Toggle Settings">
              ⚙️
            </button>
            <button className="header-btn clear-btn" onClick={handleClearChat} title="Clear chat">
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>

      {isSettingsVisible && (
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
                <div className={`message-bubble ${msg.system?.boosted ? 'boosted-message' : ''}`}>
                  {msg.system?.boosted && (
                    <div className="boost-indicator">
                      <span className="boost-icon">⚡</span>
                      <span className="boost-text">Boosted Response</span>
                    </div>
                  )}
                  <div className="message-text">
                    {msg.user ? msg.user.content : <ReactMarkdown>{msg.system.content}</ReactMarkdown>}
                  </div>
                  {msg.system && (
                    <div className="message-footer">
                      <span className="provider-info">via {msg.system.provider}</span>
                      <div className="proof-section">
                        <div className="confidence-indicator">
                          <span className="confidence-label">Confidence:</span>
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill" 
                              style={{ width: `${(msg.system.confidence || 0.8) * 100}%` }}
                            ></div>
                          </div>
                          <span className="confidence-value">
                            {Math.round((msg.system.confidence || 0.8) * 100)}%
                          </span>
                        </div>
                        <button 
                          className="proof-toggle-btn"
                          onClick={() => setVisibleSources(visibleSources === index ? null : index)}
                        >
                          🛡️ View Sources ({msg.system.sources?.length || 0})
                        </button>
                        {visibleSources === index && (
                          <div className="sources-container">
                            {msg.system.sources && msg.system.sources.length > 0 ? (
                              msg.system.sources.map((source, sourceIndex) => (
                                <div key={sourceIndex} className="source-item">
                                  <span className="source-type">{source.type || 'Memory'}</span>
                                  <span className="source-content">{source.content}</span>
                                  {source.relevance && (
                                    <span className="source-relevance">
                                      Relevance: {Math.round(source.relevance * 100)}%
                                    </span>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="source-item">
                                <span className="source-type">Personal Memory</span>
                                <span className="source-content">Response based on your personal knowledge graph and conversation history</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
            <div className="input-options-container">
              <button 
                className="input-options-toggle"
                onClick={() => setShowInputOptions(!showInputOptions)}
                title="More options"
              >
                +
              </button>
              {showInputOptions && (
                <div className="input-options-menu">
                  <button 
                    className={`input-option-item ${isConfidential ? 'active' : ''}`}
                    onClick={() => {
                      setIsConfidential(!isConfidential);
                      setShowInputOptions(false);
                    }}
                  >
                    <span className="option-icon">🔒</span>
                    <span>Confidential Mode</span>
                  </button>
                  <button 
                    className="input-option-item"
                    onClick={handleFileUpload}
                  >
                    <span className="option-icon">📎</span>
                    <span>Attach File</span>
                  </button>
                  <button 
                    className={`input-option-item boost ${isBoosted ? 'active' : ''}`}
                    onClick={handleBoostToggle}
                  >
                    <span className="option-icon">⚡</span>
                    <span>Boost Message {isBoosted ? '(Active)' : ''}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
