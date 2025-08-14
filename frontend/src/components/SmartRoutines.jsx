import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const SmartRoutines = ({ userPrincipal, isOpen, onClose }) => {
  const [routines, setRoutines] = useState([]);
  const [activeRoutine, setActiveRoutine] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [routineResults, setRoutineResults] = useState(null);

  const routineTemplates = [
    {
      id: 'weekly-goals',
      name: 'Weekly Goals Check-In',
      icon: '🎯',
      description: 'Review last week\'s progress and set goals for the upcoming week',
      duration: '10-15 minutes',
      questions: [
        'What were your main accomplishments last week?',
        'Which goals did you not achieve and why?',
        'What are your top 3 priorities for this week?',
        'What potential blockers do you foresee?',
        'How will you measure success this week?'
      ]
    },
    {
      id: 'project-standup',
      name: 'Project Standup',
      icon: '📋',
      description: 'Daily/weekly project progress review and planning',
      duration: '5-10 minutes',
      questions: [
        'What did you complete since the last standup?',
        'What are you working on today/this week?',
        'Are there any blockers or challenges?',
        'Do you need help from anyone?',
        'What\'s your confidence level in meeting upcoming deadlines?'
      ]
    },
    {
      id: 'learning-reflection',
      name: 'Learning Reflection',
      icon: '🧠',
      description: 'Reflect on recent learning and identify knowledge gaps',
      duration: '15-20 minutes',
      questions: [
        'What new skills or knowledge did you gain recently?',
        'What concepts are you struggling to understand?',
        'How have you applied your recent learning?',
        'What would you like to learn next?',
        'What learning resources have been most effective for you?'
      ]
    },
    {
      id: 'productivity-audit',
      name: 'Productivity Audit',
      icon: '⚡',
      description: 'Analyze your productivity patterns and optimize workflows',
      duration: '10-15 minutes',
      questions: [
        'When were you most productive this week?',
        'What activities consumed time without adding value?',
        'Which tools or processes helped you work efficiently?',
        'What distractions affected your focus?',
        'How can you optimize your workflow for next week?'
      ]
    }
  ];

  useEffect(() => {
    if (isOpen && userPrincipal) {
      loadRoutineHistory();
    }
  }, [isOpen, userPrincipal]);

  const loadRoutineHistory = () => {
    const savedRoutines = localStorage.getItem(`smart_routines_${userPrincipal}`);
    if (savedRoutines) {
      setRoutines(JSON.parse(savedRoutines));
    }
  };

  const startRoutine = (template) => {
    setActiveRoutine({
      ...template,
      startedAt: new Date().toISOString(),
      responses: {},
      currentQuestion: 0
    });
  };

  const handleResponse = (questionIndex, response) => {
    setActiveRoutine(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionIndex]: response
      }
    }));
  };

  const nextQuestion = () => {
    if (activeRoutine.currentQuestion < activeRoutine.questions.length - 1) {
      setActiveRoutine(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    } else {
      completeRoutine();
    }
  };

  const completeRoutine = async () => {
    setIsRunning(true);
    try {
      const completedRoutine = {
        ...activeRoutine,
        completedAt: new Date().toISOString(),
        id: `routine_${Date.now()}`
      };

      // Generate AI insights based on responses
      const responsesText = Object.values(activeRoutine.responses).join('\n\n');
      const prompt = `Based on this ${activeRoutine.name} session, provide 3 key insights and 2 actionable recommendations:\n\n${responsesText}`;
      
      let aiInsights = '';
      try {
        const response = await backend.memory_mind_prompt(prompt, null, false);
        aiInsights = typeof response === 'string' ? response : 'Great job completing this routine! Keep up the consistent reflection and planning.';
      } catch (error) {
        aiInsights = 'Routine completed successfully. Regular reflection like this helps maintain focus and momentum.';
      }

      completedRoutine.aiInsights = aiInsights;

      // Save to history
      const updatedRoutines = [completedRoutine, ...routines];
      setRoutines(updatedRoutines);
      localStorage.setItem(`smart_routines_${userPrincipal}`, JSON.stringify(updatedRoutines));

      setRoutineResults(completedRoutine);
      setActiveRoutine(null);
    } catch (error) {
      console.error('Error completing routine:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const closeResults = () => {
    setRoutineResults(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content smart-routines-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔄 Smart Routines</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="modal-body">
          {!activeRoutine && !routineResults && (
            <>
              <p className="modal-description">
                One-click templates for regular check-ins and reflections. The AI analyzes your responses and provides insights.
              </p>

              {/* Routine Templates */}
              <div className="routines-grid">
                {routineTemplates.map(template => (
                  <div key={template.id} className="routine-card">
                    <div className="routine-header">
                      <div className="routine-icon">{template.icon}</div>
                      <div className="routine-info">
                        <h3 className="routine-name">{template.name}</h3>
                        <div className="routine-duration">{template.duration}</div>
                      </div>
                    </div>
                    <p className="routine-description">{template.description}</p>
                    <div className="routine-questions">
                      <strong>Questions ({template.questions.length}):</strong>
                      <ul>
                        {template.questions.slice(0, 2).map((question, index) => (
                          <li key={index}>{question}</li>
                        ))}
                        {template.questions.length > 2 && (
                          <li>+ {template.questions.length - 2} more...</li>
                        )}
                      </ul>
                    </div>
                    <button
                      onClick={() => startRoutine(template)}
                      className="start-routine-btn"
                    >
                      Start Routine
                    </button>
                  </div>
                ))}
              </div>

              {/* Recent Routines */}
              {routines.length > 0 && (
                <div className="routine-history">
                  <h3>Recent Routines</h3>
                  <div className="history-list">
                    {routines.slice(0, 5).map(routine => (
                      <div key={routine.id} className="history-item">
                        <div className="history-header">
                          <span className="history-icon">{routine.icon}</span>
                          <span className="history-name">{routine.name}</span>
                          <span className="history-date">
                            {new Date(routine.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {routine.aiInsights && (
                          <div className="history-insights">
                            <strong>AI Insights:</strong>
                            <p>{routine.aiInsights.substring(0, 100)}...</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Active Routine */}
          {activeRoutine && (
            <div className="active-routine">
              <div className="routine-progress">
                <div className="progress-header">
                  <h3>{activeRoutine.icon} {activeRoutine.name}</h3>
                  <span className="progress-indicator">
                    {activeRoutine.currentQuestion + 1} / {activeRoutine.questions.length}
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((activeRoutine.currentQuestion + 1) / activeRoutine.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="question-section">
                <h4 className="question">
                  {activeRoutine.questions[activeRoutine.currentQuestion]}
                </h4>
                <textarea
                  value={activeRoutine.responses[activeRoutine.currentQuestion] || ''}
                  onChange={(e) => handleResponse(activeRoutine.currentQuestion, e.target.value)}
                  placeholder="Share your thoughts..."
                  className="response-textarea"
                  rows="4"
                />
              </div>

              <div className="routine-actions">
                <button
                  onClick={() => setActiveRoutine(null)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={!activeRoutine.responses[activeRoutine.currentQuestion]?.trim()}
                  className="next-btn"
                >
                  {activeRoutine.currentQuestion === activeRoutine.questions.length - 1 
                    ? 'Complete Routine' 
                    : 'Next Question'
                  }
                </button>
              </div>
            </div>
          )}

          {/* Routine Results */}
          {routineResults && (
            <div className="routine-results">
              <div className="results-header">
                <h3>✅ Routine Completed!</h3>
                <p>{routineResults.name} - {new Date(routineResults.completedAt).toLocaleString()}</p>
              </div>

              <div className="ai-insights-section">
                <h4>🤖 AI Insights & Recommendations</h4>
                <div className="insights-content">
                  {routineResults.aiInsights.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="results-actions">
                <button onClick={closeResults} className="close-results-btn">
                  Close
                </button>
                <button 
                  onClick={() => {
                    closeResults();
                    onClose();
                  }} 
                  className="back-to-chat-btn"
                >
                  Back to Chat
                </button>
              </div>
            </div>
          )}

          {isRunning && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Analyzing your responses...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartRoutines;
