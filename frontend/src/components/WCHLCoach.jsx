import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import '../styles/wchl-coach.css';

const WCHLCoach = ({ userPrincipal, onBackToChat, onBackToWelcome }) => {
  const [projectStats, setProjectStats] = useState({
    milestonesCompleted: 0,
    deadlinesMet: 0,
    totalProjects: 0,
    successRate: 0
  });
  const [shippingTip, setShippingTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);
  const [projectType, setProjectType] = useState('Web App');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [focusArea, setFocusArea] = useState('MVP Development');
  const [currentProject, setCurrentProject] = useState({
    name: '',
    deadline: '',
    status: 'Planning',
    progress: 0
  });
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Define MVP scope', completed: false, category: 'Planning' },
    { id: 2, task: 'Set up development environment', completed: false, category: 'Setup' },
    { id: 3, task: 'Create wireframes/mockups', completed: false, category: 'Design' },
    { id: 4, task: 'Implement core features', completed: false, category: 'Development' },
    { id: 5, task: 'Write tests', completed: false, category: 'Testing' },
    { id: 6, task: 'Deploy to staging', completed: false, category: 'Deployment' },
    { id: 7, task: 'Prepare demo script', completed: false, category: 'Presentation' },
    { id: 8, task: 'Create pitch deck', completed: false, category: 'Presentation' },
    { id: 9, task: 'Practice demo', completed: false, category: 'Presentation' },
    { id: 10, task: 'Deploy to production', completed: false, category: 'Launch' }
  ]);
  const [demoScript, setDemoScript] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  useEffect(() => {
    // Load project stats from localStorage
    const savedStats = localStorage.getItem(`project_stats_${userPrincipal}`);
    if (savedStats) {
      setProjectStats(JSON.parse(savedStats));
    }
    
    // Load current project
    const savedProject = localStorage.getItem(`current_project_${userPrincipal}`);
    if (savedProject) {
      setCurrentProject(JSON.parse(savedProject));
    }
    
    // Load checklist
    const savedChecklist = localStorage.getItem(`project_checklist_${userPrincipal}`);
    if (savedChecklist) {
      setChecklist(JSON.parse(savedChecklist));
    }
  }, [userPrincipal]);

  const generateShippingTip = async () => {
    setIsLoadingTip(true);
    try {
      const completedTasks = checklist.filter(item => item.completed).length;
      const progress = Math.round((completedTasks / checklist.length) * 100);
      
      const prompt = `As a project shipping coach, provide a specific tip for a ${experienceLevel} level developer working on a ${projectType} project. They are ${progress}% complete and focusing on ${focusArea}. Current project status: ${currentProject.status}. Give actionable advice to help them ship successfully.`;
      
      const response = await backend.memory_mind_prompt(prompt, null, false);
      
      if (typeof response === 'string') {
        setShippingTip(response);
      } else {
        setShippingTip('Focus on shipping the MVP first. Perfect is the enemy of done - get your core features working and iterate based on user feedback.');
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
      const prompt = `Create a demo script for a ${projectType} called "${currentProject.name || 'My Project'}". The demo should be 2-3 minutes long and include: 1) Hook/Problem statement, 2) Solution overview, 3) Key features demonstration, 4) Call to action. Make it engaging and professional.`;
      
      const response = await backend.memory_mind_prompt(prompt, null, false);
      
      if (typeof response === 'string') {
        setDemoScript(response);
      } else {
        setDemoScript('Demo Script Template:\n\n1. Hook: "Imagine if..."\n2. Problem: "Currently, users struggle with..."\n3. Solution: "Our app solves this by..."\n4. Demo: Show 2-3 key features\n5. Impact: "This means users can..."\n6. Call to Action: "Try it at..."');
      }
    } catch (error) {
      console.error('Error generating demo script:', error);
      setDemoScript('Demo Script Template:\n\n1. Start with a compelling hook\n2. Clearly state the problem\n3. Show your solution in action\n4. Highlight key benefits\n5. End with a strong call to action');
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
    localStorage.setItem(`project_stats_${userPrincipal}`, JSON.stringify(newStats));
  };

  const toggleChecklistItem = (id) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updatedChecklist);
    localStorage.setItem(`project_checklist_${userPrincipal}`, JSON.stringify(updatedChecklist));
    
    // Update progress
    const completedTasks = updatedChecklist.filter(item => item.completed).length;
    const newProgress = Math.round((completedTasks / updatedChecklist.length) * 100);
    const updatedProject = { ...currentProject, progress: newProgress };
    setCurrentProject(updatedProject);
    localStorage.setItem(`current_project_${userPrincipal}`, JSON.stringify(updatedProject));
  };

  const updateCurrentProject = (field, value) => {
    const updatedProject = { ...currentProject, [field]: value };
    setCurrentProject(updatedProject);
    localStorage.setItem(`current_project_${userPrincipal}`, JSON.stringify(updatedProject));
  };

  const resetProgress = () => {
    const resetChecklist = checklist.map(item => ({ ...item, completed: false }));
    setChecklist(resetChecklist);
    setCurrentProject({ name: '', deadline: '', status: 'Planning', progress: 0 });
    localStorage.removeItem(`project_checklist_${userPrincipal}`);
    localStorage.removeItem(`current_project_${userPrincipal}`);
  };

  return (
    <div className="wchl-coach-container">
      {/* Header */}
      <div className="coach-header">
        <div className="header-nav">
          <button onClick={onBackToChat} className="nav-btn">
            ← Back to Chat
          </button>
          <button onClick={onBackToWelcome} className="nav-btn">
            🏠 Home
          </button>
        </div>
        <h1 className="coach-title">
          🚀 Project Shipping Coach
        </h1>
        <div className="coach-subtitle">
          Your Personal Development & Launch Assistant
        </div>
      </div>

      {/* Current Project */}
      <div className="coach-content">
        <div className="project-profile-section">
          <h2>Current Project</h2>
          <div className="project-form">
            <div className="form-row">
              <div className="control-group">
                <label>Project Name:</label>
                <input 
                  type="text"
                  value={currentProject.name} 
                  onChange={(e) => updateCurrentProject('name', e.target.value)}
                  placeholder="Enter your project name"
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
                  <option value="Web App">Web App</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="API/Backend">API/Backend</option>
                  <option value="Desktop App">Desktop App</option>
                  <option value="Library/Package">Library/Package</option>
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
                  <option value="User Testing">User Testing</option>
                  <option value="Performance Optimization">Performance Optimization</option>
                  <option value="Deployment">Deployment</option>
                  <option value="Marketing Prep">Marketing Prep</option>
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
                <button onClick={() => updateProjectStats('milestonesCompleted', 1)} className="stat-btn">+</button>
                <button onClick={() => updateProjectStats('milestonesCompleted', -1)} className="stat-btn">-</button>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{projectStats.deadlinesMet}</div>
              <div className="stat-label">Deadlines Met</div>
              <div className="stat-controls">
                <button onClick={() => updateProjectStats('deadlinesMet', 1)} className="stat-btn">+</button>
                <button onClick={() => updateProjectStats('deadlinesMet', -1)} className="stat-btn">-</button>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{projectStats.totalProjects}</div>
              <div className="stat-label">Total Projects</div>
              <div className="stat-controls">
                <button onClick={() => updateProjectStats('totalProjects', 1)} className="stat-btn">+</button>
                <button onClick={() => updateProjectStats('totalProjects', -1)} className="stat-btn">-</button>
              </div>
            </div>
            <div className="stat-card highlight">
              <div className="stat-value">{projectStats.successRate}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Shipping Checklist */}
        <div className="checklist-section">
          <h2>Shipping Checklist</h2>
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
            Reset Progress
          </button>
        </div>

        {/* Shipping Tips */}
        <div className="tips-section">
          <h2>Personalized Shipping Advice</h2>
          <div className="tip-card">
            {shippingTip ? (
              <div className="tip-content">
                <div className="tip-icon">🚀</div>
                <div className="tip-text">{shippingTip}</div>
              </div>
            ) : (
              <div className="tip-placeholder">
                <div className="tip-icon">💡</div>
                <div className="tip-text">Click "Get Shipping Tip" for personalized development advice!</div>
              </div>
            )}
            <button 
              onClick={generateShippingTip} 
              disabled={isLoadingTip}
              className="tip-btn"
            >
              {isLoadingTip ? 'Generating...' : 'Get Shipping Tip'}
            </button>
          </div>
        </div>

        {/* Demo Script Generator */}
        <div className="demo-section">
          <h2>Demo Script Generator</h2>
          <div className="demo-card">
            {demoScript ? (
              <div className="demo-content">
                <div className="demo-header">
                  <div className="demo-icon">🎬</div>
                  <div className="demo-title">Your Demo Script</div>
                </div>
                <div className="demo-script">
                  {demoScript.split('\n').map((line, index) => (
                    <p key={index} className="script-line">{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="demo-placeholder">
                <div className="demo-icon">🎯</div>
                <div className="demo-text">Generate a professional demo script for your project!</div>
              </div>
            )}
            <button 
              onClick={generateDemoScript} 
              disabled={isGeneratingScript || !currentProject.name}
              className="demo-btn"
            >
              {isGeneratingScript ? 'Generating Script...' : 'Generate Demo Script'}
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
              <div className="action-icon">📋</div>
              <div className="action-title">Weekly Standup</div>
              <div className="action-description">
                Review progress, identify blockers, and set goals for the upcoming week.
              </div>
              <button className="action-btn">Start Standup</button>
            </div>
            <div className="action-card">
              <div className="action-icon">🎯</div>
              <div className="action-title">Goal Check-in</div>
              <div className="action-description">
                Assess your project goals and adjust timeline based on current progress.
              </div>
              <button className="action-btn">Check Goals</button>
            </div>
            <div className="action-card">
              <div className="action-icon">🚀</div>
              <div className="action-title">Launch Prep</div>
              <div className="action-description">
                Final checklist and preparation steps before going live with your project.
              </div>
              <button className="action-btn">Prep Launch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WCHLCoach;  
