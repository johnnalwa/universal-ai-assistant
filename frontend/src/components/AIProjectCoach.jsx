import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { 
  FiArrowLeft, 
  FiHome, 
  FiZap, 
  FiTarget, 
  FiCheckCircle, 
  FiPlus, 
  FiMinus,
  FiRefreshCw,
  FiClipboard,
  FiVideo,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi';
import '../styles/wchl-coach.css';

const AIProjectCoach = ({ userPrincipal, onBackToChat, onBackToWelcome }) => {
  const [projectStats, setProjectStats] = useState({
    milestonesCompleted: 0,
    deadlinesMet: 0,
    totalProjects: 0,
    successRate: 0
  });
  const [shippingTip, setShippingTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [projectType, setProjectType] = useState('AI Assistant');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [focusArea, setFocusArea] = useState('MVP Development');
  const [currentProject, setCurrentProject] = useState({
    name: '',
    deadline: '',
    status: 'Planning',
    progress: 0
  });
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Define AI assistant scope and capabilities', completed: false, category: 'Planning' },
    { id: 2, task: 'Set up development environment (React + ICP)', completed: false, category: 'Setup' },
    { id: 3, task: 'Design conversation flow and UI mockups', completed: false, category: 'Design' },
    { id: 4, task: 'Implement core AI integration features', completed: false, category: 'Development' },
    { id: 5, task: 'Add memory persistence and knowledge graphs', completed: false, category: 'Development' },
    { id: 6, task: 'Write comprehensive tests', completed: false, category: 'Testing' },
    { id: 7, task: 'Deploy to ICP testnet', completed: false, category: 'Deployment' },
    { id: 8, task: 'Create product demo and pitch', completed: false, category: 'Presentation' },
    { id: 9, task: 'Practice demo presentation', completed: false, category: 'Presentation' },
    { id: 10, task: 'Launch on ICP mainnet', completed: false, category: 'Launch' }
  ]);
  const [demoScript, setDemoScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  useEffect(() => {
    // Load project stats from localStorage
    const savedStats = localStorage.getItem(`ai_project_stats_${userPrincipal}`);
    if (savedStats) {
      setProjectStats(JSON.parse(savedStats));
    }
    
    // Load current project
    const savedProject = localStorage.getItem(`current_ai_project_${userPrincipal}`);
    if (savedProject) {
      setCurrentProject(JSON.parse(savedProject));
    }
    
    // Load checklist
    const savedChecklist = localStorage.getItem(`ai_project_checklist_${userPrincipal}`);
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, [userPrincipal]);

  const generateShippingTip = async () => {
    setIsLoadingTip(true);
    try {
      const completedTasks = checklist.filter(item => item.completed).length;
      const progress = Math.round((completedTasks / checklist.length) * 100);
      
      const prompt = `As an AI project development coach, provide a specific tip for a ${experienceLevel} level developer working on a ${projectType} project. They are ${progress}% complete and focusing on ${focusArea}. Current project status: ${currentProject.status}. Give actionable advice to help them ship successfully on the Internet Computer Protocol.`;
      
      const response = await backend.memory_mind_prompt(prompt, null, false);
      
      if (typeof response === 'string') {
        setShippingTip(response);
      } else {
        setShippingTip('Focus on shipping the MVP first. Perfect is the enemy of done - get your core AI features working and iterate based on user feedback.');
      }
    } catch (error) {
      console.error('Error generating shipping tip:', error);
      setShippingTip('Remember: Ship early, ship often. Every day you don\'t ship is a day you\'re not learning from real users!');
    } finally {
      setIsLoadingTip(false);
    }
  };

  const generateDemoScript = async () => {
    setIsGeneratingScript(true);
    try {
      const prompt = `Create a demo script for an ${projectType} called "${currentProject.name || 'My AI Assistant'}". The demo should be 2-3 minutes long and include: 1) Hook/Problem statement, 2) Solution overview, 3) Key AI features demonstration, 4) ICP blockchain benefits, 5) Call to action. Make it engaging and professional for a tech audience.`;
      
      const response = await backend.memory_mind_prompt(prompt, null, false);
      
      if (typeof response === 'string') {
        setDemoScript(response);
      } else {
        setDemoScript('Demo Script Template:\n\n1. Hook: "Imagine an AI that truly knows you..."\n2. Problem: "Current AI assistants forget everything between sessions"\n3. Solution: "Our AI builds a permanent knowledge graph of you"\n4. Demo: Show memory persistence and personalization\n5. Impact: "This means truly personalized AI assistance"\n6. Call to Action: "Try it on the Internet Computer..."');
      }
    } catch (error) {
      console.error('Error generating demo script:', error);
      setDemoScript('Demo Script Template:\n\n1. Start with a compelling AI hook\n2. Clearly state the memory/personalization problem\n3. Show your AI solution in action\n4. Highlight ICP blockchain benefits\n5. End with a strong call to action');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const updateProjectStats = (stat, value) => {
    const newStats = { ...projectStats, [stat]: Math.max(0, projectStats[stat] + value) };
    if (newStats.totalProjects > 0) {
      newStats.successRate = Math.round((newStats.deadlinesMet / newStats.totalProjects) * 100);
    }
    setProjectStats(newStats);
    localStorage.setItem(`ai_project_stats_${userPrincipal}`, JSON.stringify(newStats));
  };

  const toggleChecklistItem = (id) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    localStorage.setItem(`ai_project_checklist_${userPrincipal}`, JSON.stringify(updatedChecklist));
    
    // Update progress
    const completedTasks = updatedChecklist.filter(item => item.completed).length;
    const newProgress = Math.round((completedTasks / updatedChecklist.length) * 100);
    const updatedProject = { ...currentProject, progress: newProgress };
    setCurrentProject(updatedProject);
    localStorage.setItem(`current_ai_project_${userPrincipal}`, JSON.stringify(updatedProject));
  };

  const updateCurrentProject = (field, value) => {
    const updatedProject = { ...currentProject, [field]: value };
    setCurrentProject(updatedProject);
    localStorage.setItem(`current_ai_project_${userPrincipal}`, JSON.stringify(updatedProject));
  };

  const resetProgress = () => {
    const resetChecklist = checklist.map(item => ({ ...item, completed: false }));
    setChecklist(resetChecklist);
    setCurrentProject({ name: '', deadline: '', status: 'Planning', progress: 0 });
    localStorage.removeItem(`ai_project_checklist_${userPrincipal}`);
    localStorage.removeItem(`current_ai_project_${userPrincipal}`);
  };

  return (
    <div className="wchl-coach-container">
      {/* Header */}
      <div className="coach-header">
        <div className="header-nav">
          <button onClick={onBackToChat} className="nav-btn">
            <FiArrowLeft /> Back to Chat
          </button>
          <button onClick={onBackToWelcome} className="nav-btn">
            <FiHome /> Home
          </button>
        </div>
        <h1 className="coach-title">
          <FiZap /> AI Project Coach
        </h1>
        <div className="coach-subtitle">
          Your Personal AI Development & Launch Assistant
        </div>
      </div>

      {/* Current Project */}
      <div className="coach-content">
        <div className="project-profile-section">
          <h2>Current AI Project</h2>
          <div className="project-form">
            <div className="form-row">
              <div className="control-group">
                <label>Project Name:</label>
                <input 
                  type="text"
                  value={currentProject.name} 
                  onChange={(e) => updateCurrentProject('name', e.target.value)}
                  placeholder="Enter your AI project name"
                  className="coach-input"
                />
              </div>
              <div className="control-group">
                <label>Deadline:</label>
                <input 
                  type="date"
                  value={currentProject.deadline} 
                  onChange={(e) => updateCurrentProject('deadline', e.target.value)}
                  className="coach-input"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="control-group">
                <label>Project Type:</label>
                <select 
                  value={projectType} 
                  onChange={(e) => setProjectType(e.target.value)}
                  className="coach-select"
                >
                  <option value="AI Assistant">AI Assistant</option>
                  <option value="AI Chatbot">AI Chatbot</option>
                  <option value="Knowledge Graph AI">Knowledge Graph AI</option>
                  <option value="AI Analytics Tool">AI Analytics Tool</option>
                  <option value="AI Content Generator">AI Content Generator</option>
                </select>
              </div>
              <div className="control-group">
                <label>Experience Level:</label>
                <select 
                  value={experienceLevel} 
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="coach-select"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="control-group">
                <label>Current Focus:</label>
                <select 
                  value={focusArea} 
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="coach-select"
                >
                  <option value="MVP Development">MVP Development</option>
                  <option value="AI Model Integration">AI Model Integration</option>
                  <option value="Memory & Persistence">Memory & Persistence</option>
                  <option value="ICP Deployment">ICP Deployment</option>
                  <option value="User Testing">User Testing</option>
                </select>
              </div>
              <div className="control-group">
                <label>Status:</label>
                <select 
                  value={currentProject.status} 
                  onChange={(e) => updateCurrentProject('status', e.target.value)}
                  className="coach-select"
                >
                  <option value="Planning">Planning</option>
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="Deployment">Deployment</option>
                  <option value="Launched">Launched</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-header">
              <span>Project Progress</span>
              <span>{currentProject.progress}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${currentProject.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="stats-section">
          <h2>Development Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{projectStats.milestonesCompleted}</div>
              <div className="stat-label">Milestones</div>
              <div className="stat-controls">
                <button onClick={() => updateProjectStats('milestonesCompleted', 1)} className="stat-btn">
                  <FiPlus />
                </button>
                <button onClick={() => updateProjectStats('milestonesCompleted', -1)} className="stat-btn">
                  <FiMinus />
                </button>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{projectStats.deadlinesMet}</div>
              <div className="stat-label">Deadlines Met</div>
              <div className="stat-controls">
                <button onClick={() => updateProjectStats('deadlinesMet', 1)} className="stat-btn">
                  <FiPlus />
                </button>
                <button onClick={() => updateProjectStats('deadlinesMet', -1)} className="stat-btn">
                  <FiMinus />
                </button>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{projectStats.totalProjects}</div>
              <div className="stat-label">Total Projects</div>
              <div className="stat-controls">
                <button onClick={() => updateProjectStats('totalProjects', 1)} className="stat-btn">
                  <FiPlus />
                </button>
                <button onClick={() => updateProjectStats('totalProjects', -1)} className="stat-btn">
                  <FiMinus />
                </button>
              </div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-value">{projectStats.successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* AI Project Checklist */}
        <div className="checklist-section">
          <h2>AI Development Checklist</h2>
          <div className="checklist-categories">
            {['Planning', 'Setup', 'Design', 'Development', 'Testing', 'Deployment', 'Presentation', 'Launch'].map(category => {
              const categoryItems = checklist.filter(item => item.category === category);
              const completedInCategory = categoryItems.filter(item => item.completed).length;
              
              return (
                <div key={category} className="category-group">
                  <div className="category-header">
                    <span className="category-name">{category}</span>
                    <span className="category-progress">({completedInCategory}/{categoryItems.length})</span>
                  </div>
                  <div className="category-items">
                    {categoryItems.map(item => (
                      <div key={item.id} className="checklist-item">
                        <input 
                          type="checkbox" 
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(item.id)}
                          className="checklist-checkbox"
                        />
                        <label className={`checklist-label ${item.completed ? 'completed' : ''}`}>
                          {item.task}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={resetProgress} className="reset-btn">
            <FiRefreshCw /> Reset Progress
          </button>
        </div>

        {/* AI Development Tips */}
        <div className="tips-section">
          <h2>Personalized AI Development Advice</h2>
          <div className="tip-card">
            {shippingTip ? (
              <div className="tip-content">
                <div className="tip-icon"><FiZap /></div>
                <div className="tip-text">{shippingTip}</div>
              </div>
            ) : (
              <div className="tip-placeholder">
                <div className="tip-icon"><FiInfo /></div>
                <div className="tip-text">Click "Get Development Tip" for personalized AI project advice!</div>
              </div>
            )}
            <button 
              onClick={generateShippingTip} 
              disabled={isLoadingTip}
              className="tip-btn"
            >
              {isLoadingTip ? 'Generating...' : 'Get Development Tip'}
            </button>
          </div>
        </div>

        {/* Demo Script Generator */}
        <div className="demo-section">
          <h2>AI Demo Script Generator</h2>
          <div className="demo-card">
            {demoScript ? (
              <div className="demo-content">
                <div className="demo-header">
                  <div className="demo-icon"><FiVideo /></div>
                  <div className="demo-title">Your AI Demo Script</div>
                </div>
                <div className="demo-script">
                  {demoScript.split('\n').map((line, index) => (
                    <p key={index} className="script-line">{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="demo-placeholder">
                <div className="demo-icon"><FiTarget /></div>
                <div className="demo-text">Generate a professional AI demo script for your project!</div>
              </div>
            )}
            <button 
              onClick={generateDemoScript} 
              disabled={isGeneratingScript || !currentProject.name}
              className="demo-btn"
            >
              {isGeneratingScript ? 'Generating Script...' : 'Generate AI Demo Script'}
            </button>
            {!currentProject.name && (
              <p className="demo-hint">Enter a project name above to generate a demo script</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon"><FiClipboard /></div>
              <div className="action-title">Weekly AI Standup</div>
              <div className="action-description">
                Review AI model performance, identify blockers, and set goals for the upcoming week.
              </div>
              <button className="action-btn">Start Standup</button>
            </div>
            <div className="action-card">
              <div className="action-icon"><FiTarget /></div>
              <div className="action-title">AI Goal Check-in</div>
              <div className="action-description">
                Assess your AI project goals and adjust timeline based on current progress.
              </div>
              <button className="action-btn">Check Goals</button>
            </div>
            <div className="action-card">
              <div className="action-icon"><FiTrendingUp /></div>
              <div className="action-title">ICP Launch Prep</div>
              <div className="action-description">
                Final checklist and preparation steps before deploying your AI to Internet Computer.
              </div>
              <button className="action-btn">Prep Launch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIProjectCoach;
