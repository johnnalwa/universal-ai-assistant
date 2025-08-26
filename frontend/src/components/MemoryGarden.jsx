import React, { useState, useEffect, useRef } from 'react';
import { backend } from 'declarations/backend';
import { FiSearch, FiFilter, FiZoomIn, FiZoomOut, FiRefreshCw, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MemoryGarden = ({ userPrincipal }) => {
  const [memories, setMemories] = useState([]);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('network'); // 'network', 'timeline', 'clusters'
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    if (userPrincipal) {
      loadMemories();
    }
  }, [userPrincipal]);

  useEffect(() => {
    filterMemories();
  }, [memories, searchTerm, selectedNodeType]);

  useEffect(() => {
    if (filteredMemories.length > 0) {
      generateVisualization();
    }
  }, [filteredMemories, viewMode, zoomLevel]);

  const loadMemories = async () => {
    try {
      setIsLoading(true);
      const result = await backend.get_user_memories();
      if ('Ok' in result) {
        setMemories(result.Ok);
      } else {
        toast.error('Failed to load memories');
      }
    } catch (error) {
      console.error('Error loading memories:', error);
      toast.error('Error loading memories');
    } finally {
      setIsLoading(false);
    }
  };

  const filterMemories = () => {
    let filtered = memories;

    if (searchTerm) {
      filtered = filtered.filter(memory => 
        memory.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedNodeType !== 'all') {
      filtered = filtered.filter(memory => 
        memory.node_type.toLowerCase() === selectedNodeType.toLowerCase()
      );
    }

    setFilteredMemories(filtered);
  };

  const generateVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (viewMode === 'network') {
      drawNetworkView(ctx, canvas);
    } else if (viewMode === 'timeline') {
      drawTimelineView(ctx, canvas);
    } else if (viewMode === 'clusters') {
      drawClusterView(ctx, canvas);
    }
  };

  const drawNetworkView = (ctx, canvas) => {
    const centerX = canvas.width / (2 * window.devicePixelRatio);
    const centerY = canvas.height / (2 * window.devicePixelRatio);
    const radius = Math.min(centerX, centerY) * 0.8 * zoomLevel;

    // Generate node positions in a circular layout
    const nodePositions = filteredMemories.map((memory, index) => {
      const angle = (index / filteredMemories.length) * 2 * Math.PI;
      const nodeRadius = radius * (0.3 + memory.importance_score * 0.7);
      return {
        x: centerX + Math.cos(angle) * nodeRadius,
        y: centerY + Math.sin(angle) * nodeRadius,
        memory,
        radius: 5 + memory.importance_score * 15
      };
    });

    setNodes(nodePositions);

    // Draw connections between related memories
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        const node1 = nodePositions[i];
        const node2 = nodePositions[j];
        
        // Check if memories are related (share tags or similar content)
        const sharedTags = node1.memory.tags.filter(tag => 
          node2.memory.tags.includes(tag)
        ).length;
        
        if (sharedTags > 0) {
          ctx.beginPath();
          ctx.moveTo(node1.x, node1.y);
          ctx.lineTo(node2.x, node2.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodePositions.forEach(node => {
      const { x, y, memory, radius } = node;
      
      // Node color based on type
      const colors = {
        'PersonalFact': '#10B981',
        'Preference': '#F59E0B',
        'Goal': '#EF4444',
        'Relationship': '#8B5CF6',
        'Skill': '#06B6D4',
        'Experience': '#F97316'
      };
      
      const color = colors[memory.node_type] || '#6B7280';
      
      // Draw node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node border
      ctx.strokeStyle = selectedMemory?.id === memory.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = selectedMemory?.id === memory.id ? 3 : 1;
      ctx.stroke();
      
      // Draw importance indicator
      if (memory.importance_score > 0.7) {
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(x + radius * 0.7, y - radius * 0.7, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const drawTimelineView = (ctx, canvas) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const margin = 50;
    
    // Sort memories by timestamp
    const sortedMemories = [...filteredMemories].sort((a, b) => a.created_at - b.created_at);
    
    if (sortedMemories.length === 0) return;
    
    const minTime = sortedMemories[0].created_at;
    const maxTime = sortedMemories[sortedMemories.length - 1].created_at;
    const timeRange = maxTime - minTime || 1;
    
    // Draw timeline axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Draw memory nodes on timeline
    sortedMemories.forEach((memory, index) => {
      const x = margin + ((memory.created_at - minTime) / timeRange) * (width - 2 * margin);
      const y = height - margin - 20 - (index % 5) * 40;
      
      const colors = {
        'PersonalFact': '#10B981',
        'Preference': '#F59E0B',
        'Goal': '#EF4444',
        'Relationship': '#8B5CF6',
        'Skill': '#06B6D4',
        'Experience': '#F97316'
      };
      
      const color = colors[memory.node_type] || '#6B7280';
      const radius = 5 + memory.importance_score * 10;
      
      // Draw node
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw connection to timeline
      ctx.strokeStyle = 'rgba(156, 163, 175, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, height - margin);
      ctx.stroke();
    });
  };

  const drawClusterView = (ctx, canvas) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    
    // Group memories by tags
    const clusters = {};
    filteredMemories.forEach(memory => {
      memory.tags.forEach(tag => {
        if (!clusters[tag]) {
          clusters[tag] = [];
        }
        clusters[tag].push(memory);
      });
    });
    
    const clusterKeys = Object.keys(clusters);
    const clusterCount = clusterKeys.length;
    
    clusterKeys.forEach((tag, clusterIndex) => {
      const clusterMemories = clusters[tag];
      const clusterCenterX = (width / (clusterCount + 1)) * (clusterIndex + 1);
      const clusterCenterY = height / 2;
      const clusterRadius = Math.min(width, height) / (clusterCount + 2) * 0.8;
      
      // Draw cluster background
      ctx.fillStyle = 'rgba(139, 92, 246, 0.1)';
      ctx.beginPath();
      ctx.arc(clusterCenterX, clusterCenterY, clusterRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw cluster label
      ctx.fillStyle = '#374151';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(tag, clusterCenterX, clusterCenterY - clusterRadius - 10);
      
      // Draw memories in cluster
      clusterMemories.forEach((memory, memoryIndex) => {
        const angle = (memoryIndex / clusterMemories.length) * 2 * Math.PI;
        const memoryRadius = clusterRadius * 0.6;
        const x = clusterCenterX + Math.cos(angle) * memoryRadius;
        const y = clusterCenterY + Math.sin(angle) * memoryRadius;
        
        const colors = {
          'PersonalFact': '#10B981',
          'Preference': '#F59E0B',
          'Goal': '#EF4444',
          'Relationship': '#8B5CF6',
          'Skill': '#06B6D4',
          'Experience': '#F97316'
        };
        
        const color = colors[memory.node_type] || '#6B7280';
        const nodeRadius = 4 + memory.importance_score * 8;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fill();
      });
    });
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.radius;
    });
    
    if (clickedNode) {
      setSelectedMemory(clickedNode.memory);
    } else {
      setSelectedMemory(null);
    }
  };

  const nodeTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'personalfact', label: 'Personal Facts' },
    { value: 'preference', label: 'Preferences' },
    { value: 'goal', label: 'Goals' },
    { value: 'relationship', label: 'Relationships' },
    { value: 'skill', label: 'Skills' },
    { value: 'experience', label: 'Experiences' }
  ];

  return (
    <div className="memory-garden">
      <div className="garden-header">
        <div className="header-content">
          <h2 className="garden-title">
            <span className="title-icon">🌱</span>
            Memory Garden
          </h2>
          <p className="garden-subtitle">
            Explore your personal knowledge graph
          </p>
        </div>
        
        <div className="garden-controls">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
            className="filter-select"
          >
            {nodeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <div className="view-mode-buttons">
            <button
              className={`view-btn ${viewMode === 'network' ? 'active' : ''}`}
              onClick={() => setViewMode('network')}
              title="Network View"
            >
              🕸️
            </button>
            <button
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="Timeline View"
            >
              📅
            </button>
            <button
              className={`view-btn ${viewMode === 'clusters' ? 'active' : ''}`}
              onClick={() => setViewMode('clusters')}
              title="Cluster View"
            >
              🎯
            </button>
          </div>
          
          <div className="zoom-controls">
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
              title="Zoom Out"
            >
              <FiZoomOut />
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button
              className="zoom-btn"
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.2))}
              title="Zoom In"
            >
              <FiZoomIn />
            </button>
          </div>
          
          <button
            className="refresh-btn"
            onClick={loadMemories}
            disabled={isLoading}
            title="Refresh"
          >
            <FiRefreshCw className={isLoading ? 'spinning' : ''} />
          </button>
        </div>
      </div>
      
      <div className="garden-content">
        <div className="visualization-container">
          <canvas
            ref={canvasRef}
            className="memory-canvas"
            onClick={handleCanvasClick}
          />
          
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading your memory garden...</p>
            </div>
          )}
          
          {!isLoading && filteredMemories.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h3>Your memory garden is growing</h3>
              <p>Start conversations to plant new memories in your garden</p>
            </div>
          )}
        </div>
        
        {selectedMemory && (
          <div className="memory-details-panel">
            <div className="panel-header">
              <h3>Memory Details</h3>
              <button
                className="close-btn"
                onClick={() => setSelectedMemory(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="memory-info">
              <div className="memory-type">
                <span className="type-label">Type:</span>
                <span className={`type-badge ${selectedMemory.node_type.toLowerCase()}`}>
                  {selectedMemory.node_type}
                </span>
              </div>
              
              <div className="memory-content">
                <span className="content-label">Content:</span>
                <p className="content-text">{selectedMemory.content}</p>
              </div>
              
              <div className="memory-importance">
                <span className="importance-label">Importance:</span>
                <div className="importance-bar">
                  <div 
                    className="importance-fill"
                    style={{ width: `${selectedMemory.importance_score * 100}%` }}
                  ></div>
                </div>
                <span className="importance-value">
                  {Math.round(selectedMemory.importance_score * 100)}%
                </span>
              </div>
              
              {selectedMemory.tags && selectedMemory.tags.length > 0 && (
                <div className="memory-tags">
                  <span className="tags-label">Tags:</span>
                  <div className="tags-container">
                    {selectedMemory.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="memory-stats">
                <div className="stat">
                  <span className="stat-label">Access Count:</span>
                  <span className="stat-value">{selectedMemory.access_count || 0}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Created:</span>
                  <span className="stat-value">
                    {new Date(selectedMemory.created_at / 1000000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="garden-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color personal-fact"></div>
            <span>Personal Facts</span>
          </div>
          <div className="legend-item">
            <div className="legend-color preference"></div>
            <span>Preferences</span>
          </div>
          <div className="legend-item">
            <div className="legend-color goal"></div>
            <span>Goals</span>
          </div>
          <div className="legend-item">
            <div className="legend-color relationship"></div>
            <span>Relationships</span>
          </div>
          <div className="legend-item">
            <div className="legend-color skill"></div>
            <span>Skills</span>
          </div>
          <div className="legend-item">
            <div className="legend-color experience"></div>
            <span>Experiences</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGarden;
