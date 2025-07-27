import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import WalletNav from './components/WalletNav';
import Navigation from './components/Navigation';
import WelcomePage from './components/WelcomePage';
import ChatInterface from './components/ChatInterface';
import MemoryDashboard from './components/MemoryDashboard';

const App = () => {
  // View state
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'chat', 'memory'
  
  const [chat, setChat] = useState([
    {
      system: { 
        content: "🧠 Welcome to Universal AI Assistant! I'm your personal AI that learns and remembers everything about you. Unlike other AI assistants, I build a knowledge graph of your preferences, goals, and context, making our conversations more meaningful over time. What should I call you?",
        provider: "system"
      }
    }
  ]);
  
  // Universal AI Assistant state
  const [userPrincipal, setUserPrincipal] = useState(null);
  const [userKnowledgeGraph, setUserKnowledgeGraph] = useState(null);
  const [userDashboard, setUserDashboard] = useState(null);
  const [conversationContext, setConversationContext] = useState(null);
  
  // UI state
  const [selectedProvider, setSelectedProvider] = useState('gemini');
  const [assistantType, setAssistantType] = useState('casual');
  const [storeOnChain, setStoreOnChain] = useState(false);
  const [icpMode, setIcpMode] = useState(false);

  useEffect(() => {
    loadInitialData();
    checkExistingAuth();
  }, []);

  // Check if user is already authenticated with Internet Identity
  const checkExistingAuth = async () => {
    try {
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();
      
      if (await authClient.isAuthenticated()) {
        const identity = authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        
        console.log('User already authenticated:', principal);
        
        setUserPrincipal(principal);
        setIcpMode(true);
        
        // Load user data for existing session
        await loadUserKnowledgeGraph();
        await loadUserDashboard();
      }
    } catch (error) {
      console.error('Error checking existing authentication:', error);
    }
  };

  useEffect(() => {
    if (userPrincipal) {
      loadUserKnowledgeGraph();
      loadUserDashboard();
    }
  }, [userPrincipal]);

  const loadInitialData = async () => {
    try {
      const providers = await backend.get_available_providers();
      // Initialize any other data
    } catch (error) {
      console.log('Could not load initial data:', error);
    }
  };

  const loadUserKnowledgeGraph = async () => {
    if (!userPrincipal) return;
    
    try {
      const knowledgeGraph = await backend.get_user_knowledge_graph(userPrincipal);
      setUserKnowledgeGraph(knowledgeGraph);
    } catch (error) {
      console.log('Could not load knowledge graph:', error);
    }
  };

  const loadUserDashboard = async () => {
    if (!userPrincipal) return;
    
    try {
      const dashboardResult = await backend.get_user_dashboard(userPrincipal);
      if (dashboardResult.Ok) {
        setUserDashboard(dashboardResult.Ok);
      }
    } catch (error) {
      console.log('Could not load dashboard:', error);
    }
  };

  const handleConnect = async () => {
    try {
      // Import AuthClient dynamically to avoid SSR issues
      const { AuthClient } = await import('@dfinity/auth-client');
      
      const authClient = await AuthClient.create();
      
      await authClient.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          
          console.log('Successfully authenticated with Internet Identity');
          console.log('Principal ID:', principal);
          
          setUserPrincipal(principal);
          setIcpMode(true);
          
          // Load user data after successful authentication
          await loadUserKnowledgeGraph();
          await loadUserDashboard();
        },
        onError: (error) => {
          console.error('Internet Identity authentication failed:', error);
          alert('Authentication failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Failed to initialize Internet Identity:', error);
      alert('Failed to connect to Internet Identity. Please check your connection.');
    }
  };

  const handleDisconnect = async () => {
    try {
      // Import AuthClient to handle logout
      const { AuthClient } = await import('@dfinity/auth-client');
      const authClient = await AuthClient.create();
      
      // Logout from Internet Identity
      await authClient.logout();
      
      console.log('Successfully logged out from Internet Identity');
      
      // Clear all user state
      setUserPrincipal(null);
      setUserKnowledgeGraph(null);
      setUserDashboard(null);
      setIcpMode(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if logout fails
      setUserPrincipal(null);
      setUserKnowledgeGraph(null);
      setUserDashboard(null);
      setIcpMode(false);
    }
  };

  const handleGetStarted = () => {
    setCurrentView('chat');
  };

  const handleViewMemory = () => {
    setCurrentView('memory');
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  const handleBackToWelcome = () => {
    setCurrentView('welcome');
  };

  // Render unified layout with navigation
  const renderCurrentView = () => {
    switch (currentView) {
      case 'welcome':
        return (
          <WelcomePage 
            userPrincipal={userPrincipal}
            userDashboard={userDashboard}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onGetStarted={handleGetStarted}
            onViewMemory={handleViewMemory}
          />
        );
      case 'memory':
        return (
          <MemoryDashboard
            userPrincipal={userPrincipal}
            userKnowledgeGraph={userKnowledgeGraph}
            userDashboard={userDashboard}
            onBackToChat={handleBackToChat}
            onBackToWelcome={handleBackToWelcome}
            onRefresh={loadUserKnowledgeGraph}
          />
        );
      case 'chat':
      default:
        return (
          <ChatInterface 
            userPrincipal={userPrincipal}
            userKnowledgeGraph={userKnowledgeGraph}
            userDashboard={userDashboard}
            chat={chat}
            setChat={setChat}
            selectedProvider={selectedProvider}
            assistantType={assistantType}
            storeOnChain={storeOnChain}
            icpMode={icpMode}
            conversationContext={conversationContext}
            setConversationContext={setConversationContext}
            onBackToWelcome={handleBackToWelcome}
            onViewMemory={handleViewMemory}
            onDisconnect={handleDisconnect}
            onRefreshKnowledge={loadUserKnowledgeGraph}
          />
        );
    }
  };

  return (
    <div className="app-container">
      <WalletNav 
        userPrincipal={userPrincipal}
        currentView={currentView}
        setCurrentView={setCurrentView}
        userDashboard={userDashboard}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />
      <main className="main-content">
        {renderCurrentView()}
      </main>
      
      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          flex-direction: column;
        }

        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default App;