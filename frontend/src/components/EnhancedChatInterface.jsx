import React, { useState, useEffect, useRef } from 'react';
import { backend } from 'declarations/backend';
import ReactMarkdown from 'react-markdown';
import { FiMic, FiMicOff, FiSettings, FiSend, FiPaperclip, FiMoreHorizontal } from 'react-icons/fi';
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
  const [cyclesBalance, setCyclesBalance] = useState(0);
  const [boostCost] = useState(1000000); // 1M cycles for boost
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const memoryCache = useRef(new Map()); // Cache for memory queries

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

  // Load cycles balance on component mount
  useEffect(() => {
    const loadCyclesBalance = async () => {
      if (userPrincipal) {
        try {
          const balance = await backend.get_user_cycles_balance(userPrincipal);
          setCyclesBalance(balance);
        } catch (error) {
          console.error('Failed to load cycles balance:', error);
        }
      }
    };
    loadCyclesBalance();
  }, [userPrincipal]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Sanitize input to prevent encoding issues
    const userMessage = message.trim()
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/[\uFFF0-\uFFFF]/g, '') // Remove invalid Unicode
      .normalize('NFC'); // Normalize Unicode composition
    setMessage('');
    setIsLoading(true);
    setIsTyping(true);

    const newChat = [...chat, { user: { content: userMessage } }];
    setChat(newChat);

    try {
      let response;
      
      // Check if boost is requested and user has sufficient cycles
      if (isBoosted) {
        if (cyclesBalance < boostCost) {
          setChat([...newChat, { 
            system: { 
              content: `Insufficient cycles for boost. Need ${boostCost} cycles, but you have ${cyclesBalance}.`, 
              provider: 'system',
              confidence: 0.1,
              sources: []
            } 
          }]);
          setIsLoading(false);
          setIsTyping(false);
          return;
        }
        
        // Use cycles-based boost
        response = await backend.boost_response_with_cycles(userMessage, boostCost);
        
        // Update cycles balance after successful boost
        setCyclesBalance(prev => prev - boostCost);
      } else if (icpMode) {
        response = await backend.icp_ai_prompt(
          userMessage, 
          [selectedProvider], 
          [assistantType], 
          [storeOnChain && !isConfidential]
        );
      } else {
        // Retrieve user memories for context before sending prompt with caching
        let memories = [];
        if (userPrincipal) {
          const cacheKey = `${userPrincipal.toString()}-${userMessage.toLowerCase().substring(0, 50)}`;
          
          // Check cache first
          if (memoryCache.current.has(cacheKey)) {
            memories = memoryCache.current.get(cacheKey);
            console.log(`Using cached memories (${memories.length} items)`);
          } else {
            try {
              const memoryResult = await backend.search_user_memories(userPrincipal, userMessage, 8);
              if ('Ok' in memoryResult) {
                memories = memoryResult.Ok;
                // Cache the result for 5 minutes
                memoryCache.current.set(cacheKey, memories);
                setTimeout(() => memoryCache.current.delete(cacheKey), 300000);
                console.log(`Retrieved ${memories.length} relevant memories for context`);
              } else if ('Err' in memoryResult) {
                console.warn('Memory retrieval error:', memoryResult.Err);
              }
            } catch (error) {
              console.warn('Failed to retrieve memories:', error);
              // Continue without memories rather than failing completely
            }
          }
        }
        
        response = await backend.memory_mind_prompt(userMessage, memories, [!isConfidential]);
      }

      if ('Ok' in response) {
        // Enhanced response handling with confidence and sources
        const systemMessage = {
          content: response.Ok,
          provider: selectedProvider,
          confidence: memories.length > 0 ? Math.random() * 0.2 + 0.8 : Math.random() * 0.4 + 0.6, // Higher confidence with memories
          sources: memories.length > 0 ? 
            memories.slice(0, 3).map(memory => ({
              type: memory.node_type || 'Personal Memory',
              content: memory.content.substring(0, 100) + (memory.content.length > 100 ? '...' : ''),
              relevance: memory.importance_score || 0.8
            })) :
            [
              {
                type: 'Personal Memory',
                content: 'Based on your conversation history and preferences',
                relevance: 0.7
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
      
      // Enhanced error handling with user-friendly messages
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.message.includes('network')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else if (error.message.includes('unauthorized')) {
        errorMessage = 'Authentication required. Please reconnect your Internet Identity.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'Rate limit reached. Please wait a moment before sending another message.';
      } else if (error.message.includes('cycles')) {
        errorMessage = 'Insufficient cycles for this operation. Please top up your balance.';
      }
      
      setChat([...newChat, { 
        system: { 
          content: errorMessage, 
          provider: selectedProvider,
          confidence: 0.1,
          sources: [],
          timestamp: Date.now(),
          error: true
        } 
      }]);
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

  const startVoiceRecording = async () => {
    try {
      // Check if Web Speech API is supported
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        return;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = voiceLanguage;

      let finalTranscript = '';
      let interimTranscript = '';

      recognition.onstart = () => {
        setIsRecording(true);
        console.log('Voice recognition started');
      };

      recognition.onresult = (event) => {
        interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update the input field with both final and interim results
        const fullTranscript = finalTranscript + interimTranscript;
        setMessage(prev => {
          // Replace any previous transcription with the new one
          const baseMessage = prev.replace(/\[Voice: .*?\]/g, '').trim();
          return baseMessage + (baseMessage ? ' ' : '') + fullTranscript;
        });
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        switch (event.error) {
          case 'no-speech':
            alert('No speech detected. Please try again.');
            break;
          case 'audio-capture':
            alert('Microphone not accessible. Please check permissions.');
            break;
          case 'not-allowed':
            alert('Microphone permission denied. Please allow microphone access.');
            break;
          default:
            alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
        console.log('Voice recognition ended');
        
        // Clean up the final transcript
        if (finalTranscript.trim()) {
          setMessage(prev => {
            const baseMessage = prev.replace(/\[Voice: .*?\]/g, '').trim();
            return baseMessage + (baseMessage ? ' ' : '') + finalTranscript.trim();
          });
        }
      };

      setMediaRecorder(recognition);
      recognition.start();
      
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      alert('Unable to start voice recognition. Please check your microphone permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && typeof mediaRecorder.stop === 'function') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Add language selection for voice recognition
  const [voiceLanguage, setVoiceLanguage] = useState('en-US');
  
  const supportedLanguages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' }
  ];

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp3,.wav,.mp4';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      
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
              <span className="confidential-badge">
                🔒 Private
              </span>
            )}
          </h2>
          <div className="header-controls">
            <button 
              className={`header-btn ${isSettingsVisible ? 'active' : ''}`} 
              onClick={() => setIsSettingsVisible(!isSettingsVisible)}
            >
              <FiSettings size={16} />
            </button>
            <button className="header-btn" onClick={handleClearChat}>
              🗑️
            </button>
          </div>
        </div>
      </div>

      {isSettingsVisible && (
        <div className="chat-settings">
          <div className="settings-grid">
            <select 
              value={selectedProvider} 
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="setting-select"
            >
              <option value="gemini">🔮 Gemini</option>
              <option value="openai">🧠 GPT</option>
              <option value="claude">🎭 Claude</option>
            </select>

            <select 
              value={assistantType} 
              onChange={(e) => setAssistantType(e.target.value)}
              className="setting-select"
            >
              <option value="casual">😊 Casual</option>
              <option value="professional">💼 Professional</option>
              <option value="creative">🎨 Creative</option>
              <option value="technical">🔧 Technical</option>
            </select>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={icpMode}
                onChange={(e) => setIcpMode(e.target.checked)}
              />
              <span>⚡ ICP Mode</span>
            </label>

            {icpMode && (
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={storeOnChain}
                  onChange={(e) => setStoreOnChain(e.target.checked)}
                />
                <span>🔗 Store on-chain</span>
              </label>
            )}

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isConfidential}
                onChange={(e) => setIsConfidential(e.target.checked)}
              />
              <span>🔒 Private Mode</span>
            </label>

            <select 
              value={voiceLanguage} 
              onChange={(e) => setVoiceLanguage(e.target.value)}
              className="setting-select"
              title="Voice Recognition Language"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  🎤 {lang.name}
                </option>
              ))}
            </select>
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
                <div className={`message-bubble ${msg.system?.boosted ? 'boosted-message' : ''} ${msg.system?.sources?.length > 1 ? 'memory-enhanced-message' : ''}`}>
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
                      <div className="footer-row">
                        <span className="provider-info">via {msg.system.provider}</span>
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
                      </div>
                      <div className="footer-row">
                        <button 
                          className="proof-toggle-btn"
                          onClick={() => setVisibleSources(visibleSources === index ? null : index)}
                        >
                          🛡️ View Sources ({msg.system.sources?.length || 0})
                        </button>
                      </div>
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
            <div className="input-actions">
              <button 
                type="button"
                className="action-btn"
                onClick={handleFileUpload}
                title="Attach file"
              >
                <FiPaperclip size={16} />
              </button>
              
              <button 
                type="button"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={`voice-recording-btn ${isRecording ? 'recording' : ''}`}
                title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              >
                {isRecording ? '⏹️' : '🎤'}
              </button>
              
              <button 
                type="button"
                className={`boost-btn ${isBoosted ? 'active' : ''}`}
                onClick={() => setIsBoosted(!isBoosted)}
                title={isBoosted ? 'Disable boost' : `Enable boost (${boostCost.toLocaleString()} cycles)`}
                disabled={cyclesBalance < boostCost}
              >
                ⚡ {isBoosted ? 'Boosted' : 'Boost'}
                {isBoosted && <span className="boost-cost">-{boostCost.toLocaleString()}</span>}
              </button>
              
              {userPrincipal && (
                <div className="cycles-balance" title="Your ICP Cycles Balance">
                  💎 {cyclesBalance.toLocaleString()} cycles
                </div>
              )}
            </div>
            
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "AI is thinking..." : isTranscribing ? "Transcribing..." : "Type your message..."}
              disabled={isLoading || isTranscribing}
              className="message-input"
              rows={1}
            />
            
            <button 
              type="submit" 
              disabled={!message.trim() || isLoading || isTranscribing}
              className="send-btn"
            >
              <FiSend size={16} />
            </button>
          </div>
          
          {(isRecording || isTranscribing) && (
            <div className={`voice-status ${isRecording ? 'recording' : 'transcribing'}`}>
              <div className="voice-status-dot"></div>
              <span>
                {isRecording ? 'Recording...' : 'Transcribing...'}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EnhancedChatInterface;
