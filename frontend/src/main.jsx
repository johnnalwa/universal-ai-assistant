import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import botImg from '/bot.svg';
import userImg from '/user.svg';
import '/index.css';

const App = () => {
  const [chat, setChat] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

  // Load chat from localStorage on initial render
  useEffect(() => {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      setChat(JSON.parse(savedChat));
    } else {
      setChat([
        {
          system: { content: "I'm a sovereign AI agent living on the Internet Computer. Ask me anything." }
        }
      ]);
    }
  }, []);

  // Save chat to localStorage whenever it changes
  useEffect(() => {
    if (chat.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chat));
    }
  }, [chat]);

  const formatDate = (date) => {
    const h = '0' + date.getHours();
    const m = '0' + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

  const askAgent = async (userMessage) => {
    try {
      // Extract just the user's message content
      const promptText = userMessage.user.content;
      
      // Call the new backend.prompt() function
      const response = await backend.prompt(promptText);
      
      // Handle the Result type from Rust
      let responseText;
      if (response.Ok) {
        responseText = response.Ok;
      } else if (response.Err) {
        responseText = `Error: ${response.Err}`;
      } else {
        responseText = 'Unexpected response format';
      }
      
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop(); // Remove "Thinking..." message
        newChat.push({ system: { content: responseText } });
        return newChat;
      });
    } catch (e) {
      console.log('Error calling backend:', e);
      const eStr = String(e);
      const match = eStr.match(/(SysTransient|CanisterReject), \\+"([^\\"]+)/);
      const errorMessage = match ? match[2] : `Error: ${eStr}`;
      
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop(); // Remove "Thinking..." message
        newChat.push({ system: { content: errorMessage } });
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

    // Pass the user message directly to askAgent
        askAgent(userMessage);
  };

  const clearChat = () => {
    localStorage.removeItem('chatHistory');
    setChat([
      {
        system: { content: "I'm a sovereign AI agent living on the Internet Computer. Ask me anything." }
      }
    ]);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <header className="bg-gray-900 shadow-md p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Universal AI Assistant</h1>
                <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">Powered by Gemini & Internet Computer</p>
          <button 
            onClick={clearChat} 
            className="bg-red-600 hover:bg-red-700 rounded-full py-1 px-4 text-sm font-semibold transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6" ref={chatBoxRef}>
        <div className="flex flex-col space-y-4">
          {chat.map((message, index) => {
            const isUser = 'user' in message;
            const text = isUser ? message.user.content : message.system.content;

            return (
              <div key={index} className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                  <img src={botImg} alt="bot" className="w-8 h-8 rounded-full bg-gray-700 p-1" />
                )}
                <div
                  className={`max-w-xl rounded-lg px-4 py-2 shadow-lg ${isUser ? 'bg-indigo-600' : 'bg-gray-700'}`}>
                  <p className="text-sm">{text}</p>
                </div>
                {isUser && (
                  <img src={userImg} alt="user" className="w-8 h-8 rounded-full bg-gray-700 p-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <footer className="bg-gray-900 p-4">
        <form className="flex items-center space-x-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 rounded-full py-2 px-6 font-semibold transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
