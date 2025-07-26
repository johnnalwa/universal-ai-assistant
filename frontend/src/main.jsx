import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';
import '/index.css';

const App = () => {
  const [chat, setChat] = useState([
    {
      system: { content: "🤖 Welcome to Universal AI Assistant! I'm your intelligent companion powered by the Internet Computer. I can help you with questions, tasks, creative projects, and much more. What would you like to explore today?" }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const formatDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const askAgent = async (userInput) => {
    try {
      const response = await backend.prompt(userInput);
      if ('Ok' in response) {
        setChat((prevChat) => {
          const newChat = [...prevChat];
          newChat.pop();
          newChat.push({ system: { content: response.Ok } });
          return newChat;
        });
      } else if ('Err' in response) {
        alert(response.Err);
        setChat((prevChat) => {
          const newChat = [...prevChat];
          newChat.pop();
          return newChat;
        });
      }
    } catch (e) {
      console.log(e);
      const eStr = String(e);
      const match = eStr.match(/(SysTransient|CanisterReject), \\+"([^\\"]+)/);
      if (match) {
        alert(match[2]);
      } else {
        alert('An error occurred while communicating with the backend.');
      }
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        return newChat;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      user: { content: inputValue }
    };
    const thinkingMessage = {
      system: { content: 'Thinking ...' }
    };
    setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
    setInputValue('');
    setIsLoading(true);

    askAgent(inputValue);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      {/* Header */}
      <div className="mx-auto mb-6 max-w-4xl">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Universal AI Assistant
          </h1>
          <p className="text-gray-600 text-lg">
            Your intelligent companion powered by Internet Computer
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="mx-auto flex h-[75vh] w-full max-w-4xl flex-col rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl border border-white/20">
        <div className="chat-scrollbar flex-1 overflow-y-auto rounded-t-2xl bg-gradient-to-b from-gray-50/50 to-white/30 p-6" ref={chatBoxRef}>
          {chat.map((message, index) => {
            const isUser = 'user' in message;
            const img = isUser ? userImg : botImg;
            const name = isUser ? 'You' : 'AI Assistant';
            const text = isUser ? message.user.content : message.system.content;
            const isThinking = text === 'Thinking ...';

            return (
              <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}>
                {!isUser && (
                  <div className="mr-3 flex-shrink-0">
                    <div
                      className="h-12 w-12 rounded-full border-2 border-indigo-200 shadow-md transition-transform hover:scale-105"
                      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                    ></div>
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isUser 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' 
                    : 'bg-white border border-gray-100'
                }`}>
                  <div className={`mb-2 flex items-center justify-between text-sm font-medium ${
                    isUser ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {!isUser && <span className="text-lg">🤖</span>}
                      {isUser && <span className="text-lg">👤</span>}
                      {name}
                    </div>
                    <div className="text-xs opacity-75">{formatDate(new Date())}</div>
                  </div>
                  <div className={`leading-relaxed ${
                    isUser ? 'text-white' : 'text-gray-800'
                  }`}>
                    {isThinking ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-indigo-600 font-medium">Thinking...</span>
                      </div>
                    ) : (
                      text
                    )}
                  </div>
                </div>
                {isUser && (
                  <div className="ml-3 flex-shrink-0">
                    <div
                      className="h-12 w-12 rounded-full border-2 border-purple-200 shadow-md transition-transform hover:scale-105"
                      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover' }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Input Form */}
        <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm rounded-b-2xl p-6">
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full rounded-xl border-2 border-gray-200 bg-white/90 px-6 py-4 text-lg placeholder-gray-400 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50"
                placeholder="Ask me anything... I'm here to help! 💭"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className={`rounded-xl px-8 py-4 font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:scale-100 disabled:opacity-50 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
              disabled={isLoading || !inputValue.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send</span>
                  <span className="text-lg">🚀</span>
                </div>
              )}
            </button>
          </form>
          
          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setInputValue('What can you help me with?')}
              className="rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-100 transition-colors"
              disabled={isLoading}
            >
              💡 What can you do?
            </button>
            <button
              onClick={() => setInputValue('Help me brainstorm ideas')}
              className="rounded-full bg-purple-50 px-4 py-2 text-sm text-purple-600 hover:bg-purple-100 transition-colors"
              disabled={isLoading}
            >
              🧠 Brainstorm
            </button>
            <button
              onClick={() => setInputValue('Explain something complex in simple terms')}
              className="rounded-full bg-green-50 px-4 py-2 text-sm text-green-600 hover:bg-green-100 transition-colors"
              disabled={isLoading}
            >
              📚 Explain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
