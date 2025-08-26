import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { FiTrendingUp, FiBarChart3, FiPieChart, FiCalendar, FiTarget, FiBrain, FiRefreshCw, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LearningInsightsDashboard = ({ userPrincipal }) => {
  const [insights, setInsights] = useState(null);
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('growth');

  useEffect(() => {
    if (userPrincipal) {
      loadInsights();
    }
  }, [userPrincipal, selectedTimeRange]);

  const loadInsights = async () => {
    try {
      setIsLoading(true);
      
      // Load memories for analysis
      const memoriesResult = await backend.get_user_memories();
      if ('Ok' in memoriesResult) {
        const memoriesData = memoriesResult.Ok;
        setMemories(memoriesData);
        
        // Generate insights from memories
        const generatedInsights = generateInsights(memoriesData);
        setInsights(generatedInsights);
      } else {
        toast.error('Failed to load learning insights');
      }
    } catch (error) {
      console.error('Error loading insights:', error);
      toast.error('Error loading learning insights');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (memoriesData) => {
    const now = Date.now() * 1000000; // Convert to nanoseconds
    const timeRanges = {
      '7d': 7 * 24 * 60 * 60 * 1000000000,
      '30d': 30 * 24 * 60 * 60 * 1000000000,
      '90d': 90 * 24 * 60 * 60 * 1000000000,
      '1y': 365 * 24 * 60 * 60 * 1000000000
    };
    
    const timeRange = timeRanges[selectedTimeRange];
    const cutoffTime = now - timeRange;
    
    // Filter memories by time range
    const recentMemories = memoriesData.filter(memory => memory.created_at >= cutoffTime);
    
    // Memory type distribution
    const typeDistribution = {};
    memoriesData.forEach(memory => {
      const type = memory.node_type;
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    // Tag analysis
    const tagFrequency = {};
    memoriesData.forEach(memory => {
      memory.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Growth trends
    const growthData = generateGrowthTrends(memoriesData, timeRange);
    
    // Importance analysis
    const importanceStats = {
      high: memoriesData.filter(m => m.importance_score >= 0.7).length,
      medium: memoriesData.filter(m => m.importance_score >= 0.4 && m.importance_score < 0.7).length,
      low: memoriesData.filter(m => m.importance_score < 0.4).length,
      average: memoriesData.reduce((sum, m) => sum + m.importance_score, 0) / memoriesData.length || 0
    };

    // Learning velocity (memories per day)
    const daysInRange = timeRange / (24 * 60 * 60 * 1000000000);
    const learningVelocity = recentMemories.length / daysInRange;

    // Knowledge diversity (unique tags)
    const uniqueTags = new Set();
    memoriesData.forEach(memory => {
      memory.tags.forEach(tag => uniqueTags.add(tag));
    });

    return {
      totalMemories: memoriesData.length,
      recentMemories: recentMemories.length,
      typeDistribution,
      tagFrequency,
      growthData,
      importanceStats,
      learningVelocity,
      knowledgeDiversity: uniqueTags.size,
      topTags: Object.entries(tagFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10),
      timeRange: selectedTimeRange
    };
  };

  const generateGrowthTrends = (memoriesData, timeRange) => {
    const now = Date.now() * 1000000;
    const periods = 12; // 12 data points
    const periodLength = timeRange / periods;
    
    const growthData = [];
    
    for (let i = 0; i < periods; i++) {
      const periodStart = now - timeRange + (i * periodLength);
      const periodEnd = periodStart + periodLength;
      
      const memoriesInPeriod = memoriesData.filter(memory => 
        memory.created_at >= periodStart && memory.created_at < periodEnd
      );
      
      growthData.push({
        period: i + 1,
        count: memoriesInPeriod.length,
        date: new Date((periodStart / 1000000)).toLocaleDateString()
      });
    }
    
    return growthData;
  };

  const exportInsights = () => {
    if (!insights) return;
    
    const exportData = {
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      summary: {
        totalMemories: insights.totalMemories,
        recentMemories: insights.recentMemories,
        learningVelocity: insights.learningVelocity.toFixed(2),
        knowledgeDiversity: insights.knowledgeDiversity,
        averageImportance: insights.importanceStats.average.toFixed(2)
      },
      typeDistribution: insights.typeDistribution,
      topTags: insights.topTags,
      growthTrends: insights.growthData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learning-insights-${selectedTimeRange}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Insights exported successfully');
  };

  const getInsightColor = (type) => {
    const colors = {
      'PersonalFact': '#10B981',
      'Preference': '#F59E0B',
      'Goal': '#EF4444',
      'Relationship': '#8B5CF6',
      'Skill': '#06B6D4',
      'Experience': '#F97316'
    };
    return colors[type] || '#6B7280';
  };

  if (isLoading) {
    return (
      <div className="learning-insights-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your learning patterns...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="learning-insights-dashboard empty">
        <div className="empty-state">
          <FiBrain className="empty-icon" />
          <h3>No learning data available</h3>
          <p>Start conversations to generate learning insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="learning-insights-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h2 className="dashboard-title">
            <FiBarChart3 className="title-icon" />
            Learning Insights
          </h2>
          <p className="dashboard-subtitle">
            Understand your knowledge growth and learning patterns
          </p>
        </div>
        
        <div className="dashboard-controls">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button
            className="refresh-btn"
            onClick={loadInsights}
            disabled={isLoading}
          >
            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
          </button>
          
          <button
            className="export-btn"
            onClick={exportInsights}
          >
            <FiDownload />
            Export
          </button>
        </div>
      </div>

      <div className="insights-grid">
        {/* Key Metrics */}
        <div className="insight-card metrics-overview">
          <h3 className="card-title">
            <FiTrendingUp />
            Key Metrics
          </h3>
          <div className="metrics-grid">
            <div className="metric">
              <div className="metric-value">{insights.totalMemories}</div>
              <div className="metric-label">Total Memories</div>
            </div>
            <div className="metric">
              <div className="metric-value">{insights.recentMemories}</div>
              <div className="metric-label">Recent ({selectedTimeRange})</div>
            </div>
            <div className="metric">
              <div className="metric-value">{insights.learningVelocity.toFixed(1)}</div>
              <div className="metric-label">Memories/Day</div>
            </div>
            <div className="metric">
              <div className="metric-value">{insights.knowledgeDiversity}</div>
              <div className="metric-label">Unique Topics</div>
            </div>
          </div>
        </div>

        {/* Memory Types Distribution */}
        <div className="insight-card type-distribution">
          <h3 className="card-title">
            <FiPieChart />
            Memory Types
          </h3>
          <div className="distribution-chart">
            {Object.entries(insights.typeDistribution).map(([type, count]) => {
              const percentage = (count / insights.totalMemories * 100).toFixed(1);
              return (
                <div key={type} className="distribution-item">
                  <div className="distribution-bar">
                    <div 
                      className="distribution-fill"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: getInsightColor(type)
                      }}
                    ></div>
                  </div>
                  <div className="distribution-info">
                    <span className="distribution-type">{type}</span>
                    <span className="distribution-count">{count} ({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Trends */}
        <div className="insight-card growth-trends">
          <h3 className="card-title">
            <FiCalendar />
            Growth Trends
          </h3>
          <div className="growth-chart">
            {insights.growthData.map((point, index) => {
              const maxCount = Math.max(...insights.growthData.map(p => p.count));
              const height = maxCount > 0 ? (point.count / maxCount) * 100 : 0;
              
              return (
                <div key={index} className="growth-bar-container">
                  <div 
                    className="growth-bar"
                    style={{ height: `${height}%` }}
                    title={`${point.date}: ${point.count} memories`}
                  ></div>
                  <div className="growth-label">{point.period}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Importance Analysis */}
        <div className="insight-card importance-analysis">
          <h3 className="card-title">
            <FiTarget />
            Importance Distribution
          </h3>
          <div className="importance-stats">
            <div className="importance-item high">
              <div className="importance-count">{insights.importanceStats.high}</div>
              <div className="importance-label">High Importance</div>
              <div className="importance-bar">
                <div 
                  className="importance-fill"
                  style={{ width: `${(insights.importanceStats.high / insights.totalMemories) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="importance-item medium">
              <div className="importance-count">{insights.importanceStats.medium}</div>
              <div className="importance-label">Medium Importance</div>
              <div className="importance-bar">
                <div 
                  className="importance-fill"
                  style={{ width: `${(insights.importanceStats.medium / insights.totalMemories) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="importance-item low">
              <div className="importance-count">{insights.importanceStats.low}</div>
              <div className="importance-label">Low Importance</div>
              <div className="importance-bar">
                <div 
                  className="importance-fill"
                  style={{ width: `${(insights.importanceStats.low / insights.totalMemories) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
          <div className="average-importance">
            Average Importance: {(insights.importanceStats.average * 100).toFixed(1)}%
          </div>
        </div>

        {/* Top Topics */}
        <div className="insight-card top-topics">
          <h3 className="card-title">
            <FiBrain />
            Top Topics
          </h3>
          <div className="topics-list">
            {insights.topTags.map(([tag, count], index) => (
              <div key={tag} className="topic-item">
                <div className="topic-rank">#{index + 1}</div>
                <div className="topic-info">
                  <div className="topic-name">{tag}</div>
                  <div className="topic-count">{count} memories</div>
                </div>
                <div className="topic-bar">
                  <div 
                    className="topic-fill"
                    style={{ width: `${(count / insights.topTags[0][1]) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Recommendations */}
        <div className="insight-card recommendations">
          <h3 className="card-title">
            <FiTarget />
            Recommendations
          </h3>
          <div className="recommendations-list">
            {insights.learningVelocity < 1 && (
              <div className="recommendation">
                <div className="recommendation-icon">📈</div>
                <div className="recommendation-text">
                  Consider having more conversations to increase your learning velocity
                </div>
              </div>
            )}
            {insights.knowledgeDiversity < 5 && (
              <div className="recommendation">
                <div className="recommendation-icon">🌍</div>
                <div className="recommendation-text">
                  Explore diverse topics to broaden your knowledge base
                </div>
              </div>
            )}
            {insights.importanceStats.average < 0.5 && (
              <div className="recommendation">
                <div className="recommendation-icon">⭐</div>
                <div className="recommendation-text">
                  Focus on more meaningful conversations to increase memory importance
                </div>
              </div>
            )}
            {insights.learningVelocity >= 2 && (
              <div className="recommendation positive">
                <div className="recommendation-icon">🎉</div>
                <div className="recommendation-text">
                  Great learning pace! You're building knowledge consistently
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningInsightsDashboard;
