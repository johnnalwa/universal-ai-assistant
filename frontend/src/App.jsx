import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import TopNavbar from './components/TopNavbar';
import Sidebar from './components/Sidebar';
import MobileMenuBar from './components/MobileMenuBar';
import WelcomePage from './components/WelcomePage';
import EnhancedChatInterface from './components/EnhancedChatInterface';
import MemoryDashboard from './components/MemoryDashboard';
import AIProjectCoach from './components/AIProjectCoach';
import ConsentLinks from './components/ConsentLinks';
import SmartRoutines from './components/SmartRoutines';
import MilestoneCapsules from './components/MilestoneCapsules';

const App = () => {
  // View state
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome', 'chat', 'memory', 'coach'
  
  // Modal states for new features
  const [showConsentLinks, setShowConsentLinks] = useState(false);
  const [showSmartRoutines, setShowSmartRoutines] = useState(false);
  const [showMilestoneCapsules, setShowMilestoneCapsules] = useState(false);
  
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
        setIsAuthenticated(true);
        
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
      console.log('User principal changed, loading user data:', userPrincipal);
      loadUserKnowledgeGraph();
      loadUserDashboard();
      loadUserConversations();
    } else {
      console.log('No user principal, clearing conversation context');
      setConversationContext(null);
    }
  }, [userPrincipal]);

  useEffect(() => {
    if (userPrincipal && isAuthenticated) {
      const refreshInterval = setInterval(() => {
        console.log('Periodic conversation refresh');
        loadUserConversations();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(refreshInterval);
    }
  }, [userPrincipal, isAuthenticated]);

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

  const loadUserConversations = async () => {
    if (!userPrincipal) return;
    
    console.log('Loading conversations for user:', userPrincipal);
    
    try {
      const conversations = await backend.get_user_conversations(userPrincipal);
      console.log('Raw conversations from backend:', conversations);
      
      if (conversations && conversations.length > 0) {
        // Enhanced conversation mapping with better error handling
        const formattedChat = [];
        
        // Always start with welcome message for context
        formattedChat.push({
          system: { 
            content: "🧠 Welcome back! I remember our previous conversations. How can I help you today?",
            provider: "system"
          }
        });
        
        // Process each conversation message
        conversations.forEach((msg, index) => {
          try {
            console.log(`Processing message ${index}:`, msg);
            
            // Handle different message structures
            if (msg.role && msg.content) {
              const role = msg.role === 'assistant' ? 'system' : 'user';
              const messageObj = {
                [role]: { 
                  content: msg.content, 
                  provider: msg.provider || 'system',
                  timestamp: msg.timestamp,
                  confidence: msg.response_strategy?.confidence || null,
                  sources: msg.referenced_memories || []
                }
              };
              formattedChat.push(messageObj);
            }
          } catch (msgError) {
            console.error(`Error processing message ${index}:`, msgError, msg);
          }
        });
        
        console.log('Formatted chat for frontend:', formattedChat);
        setChat(formattedChat);
        
        // Update conversation context for better continuity
        setConversationContext({
          lastLoadTime: Date.now(),
          messageCount: conversations.length,
          hasHistory: true
        });
        
      } else {
        console.log('No conversations found, showing welcome message');
        // Keep the initial welcome message for new users
        setChat([{
          system: { 
            content: "🧠 Welcome to Universal AI Assistant! I'm your personal AI that learns and remembers everything about you. Unlike other AI assistants, I build a knowledge graph of your preferences, goals, and context, making our conversations more meaningful over time. What should I call you?",
            provider: "system"
          }
        }]);
        
        setConversationContext({
          lastLoadTime: Date.now(),
          messageCount: 0,
          hasHistory: false
        });
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      
      // Fallback to welcome message on error
      setChat([{
        system: { 
          content: "🧠 Welcome to Universal AI Assistant! I had trouble loading our previous conversations, but I'm ready to help you now. What should I call you?",
          provider: "system"
        }
      }]);
      
      setConversationContext({
        lastLoadTime: Date.now(),
        messageCount: 0,
        hasHistory: false,
        loadError: error.message
      });
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
          setIsAuthenticated(true);
          
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
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if logout fails
      setUserPrincipal(null);
      setUserKnowledgeGraph(null);
      setUserDashboard(null);
      setIcpMode(false);
      setIsAuthenticated(false);
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

  const handleLogin = () => {
    handleConnect();
  };

  const handleLogout = () => {
    handleDisconnect();
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="app">
      <TopNavbar
        userPrincipal={userPrincipal}
        userDashboard={userDashboard}
        isAuthenticated={isAuthenticated}
        onLogin={handleConnect}
        onLogout={handleDisconnect}
        onMobileMenuToggle={toggleMobileSidebar}
      />
      
      <MobileMenuBar 
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isMobileSidebarOpen}
        onClose={closeMobileSidebar}
        userPrincipal={userPrincipal}
        isAuthenticated={isAuthenticated}
        onLogin={handleConnect}
        onLogout={handleDisconnect}
      />
      
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userPrincipal={userPrincipal}
        userDashboard={userDashboard}
        isAuthenticated={isAuthenticated}
        onLogin={handleConnect}
        onLogout={handleDisconnect}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
      />
      
      <main className="main-content">
        <div className="content-wrapper">
          {currentView === 'welcome' && 
            <WelcomePage 
              onConnect={handleConnect}
              onGetStarted={handleGetStarted}
              onViewMemory={handleViewMemory}
            />
          }
          {currentView === 'chat' && (
            <EnhancedChatInterface
              chat={chat}
              setChat={setChat}
              selectedProvider={selectedProvider}
              setSelectedProvider={setSelectedProvider}
              assistantType={assistantType}
              setAssistantType={setAssistantType}
              storeOnChain={storeOnChain}
              setStoreOnChain={setStoreOnChain}
              userPrincipal={userPrincipal}
              icpMode={icpMode}
              setIcpMode={setIcpMode}
            />
          )}
          {currentView === 'memory' && (
            <MemoryDashboard
              userPrincipal={userPrincipal}
              userKnowledgeGraph={userKnowledgeGraph}
              userDashboard={userDashboard}
              onBackToChat={() => setCurrentView('chat')}
              onBackToWelcome={() => setCurrentView('welcome')}
              onRefresh={loadInitialData}
              onOpenConsentLinks={() => setShowConsentLinks(true)}
              onOpenSmartRoutines={() => setShowSmartRoutines(true)}
              onOpenMilestoneCapsules={() => setShowMilestoneCapsules(true)}
            />
          )}
          {currentView === 'coach' && (
            <AIProjectCoach
              userPrincipal={userPrincipal}
              onBackToChat={() => setCurrentView('chat')}
              onBackToWelcome={() => setCurrentView('welcome')}
            />
          )}
        </div>
      </main>

      {/* Modal Components */}
      <ConsentLinks
        userPrincipal={userPrincipal}
        isOpen={showConsentLinks}
        onClose={() => setShowConsentLinks(false)}
      />
      
      <SmartRoutines
        userPrincipal={userPrincipal}
        isOpen={showSmartRoutines}
        onClose={() => setShowSmartRoutines(false)}
      />
      
      <MilestoneCapsules
        userPrincipal={userPrincipal}
        isOpen={showMilestoneCapsules}
        onClose={() => setShowMilestoneCapsules(false)}
      />
    </div>
  );
};

export default App;