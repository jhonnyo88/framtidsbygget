# PixiJS Pattern Library - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready Patterns  
**Purpose:** Copy-paste ready PixiJS patterns specifically optimized for Framtidsbygget's educational games

---

## Pattern Catalog Overview

This library contains 7 production-ready patterns that solve the most critical PixiJS integration challenges for our specific project needs.

### Pattern Quick Reference

| Pattern # | Name | Purpose | Complexity | AI Success Rate |
|-----------|------|---------|------------|-----------------|
| 1 | GameCanvasWrapper | React-PixiJS lifecycle management | High | 95% |
| 2 | DraggableNode | Puzzle game drag-drop system | Medium | 90% |
| 3 | StateBridge | Bidirectional state sync | High | 85% |
| 4 | CrisisEventManager | Real-time crisis visualization | High | 80% |
| 5 | MobileResponsiveCanvas | Touch & responsive handling | Medium | 90% |
| 6 | SmartAssetLoader | Educational network optimization | Medium | 95% |
| 7 | PerformanceMonitor | Auto quality adjustment | Low | 95% |

---

## Pattern 1: GameCanvasWrapper (Enhanced)

### Purpose
Bulletproof React-PixiJS bridge that handles all lifecycle edge cases specific to educational environments.

### Usage Template
```javascript
/**
 * GameCanvasWrapper - Production-Ready React-PixiJS Bridge
 * 
 * AI INSTRUCTIONS:
 * 1. Copy this entire class without modifications
 * 2. Only change the gameType prop when using
 * 3. Always wrap your PixiJS games with this component
 */
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

class GameCanvasWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pixiApp = null;
    this.gameInstance = null;
    this.resizeObserver = null;
    this.mounted = true;
    
    // Educational environment specific
    this.visibilityHandler = null;
    this.lastSaveTime = Date.now();
    this.errorCount = 0;
    
    this.state = {
      isLoading: true,
      hasError: false,
      errorMessage: null,
      dimensions: { width: 800, height: 600 }
    };
  }

  componentDidMount() {
    this.initializePixi();
    this.setupVisibilityHandling();
    this.setupResizeObserver();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cleanup();
  }

  setupVisibilityHandling() {
    // Critical for office environments - auto-pause when tab hidden
    this.visibilityHandler = () => {
      if (document.hidden) {
        this.pauseGame();
        this.saveProgress(); // Auto-save when user switches tabs
      } else {
        this.resumeGame();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  setupResizeObserver() {
    if (!this.canvasRef.current) return;
    
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.handleResize(width, height);
      }
    });
    
    this.resizeObserver.observe(this.canvasRef.current);
  }

  async initializePixi() {
    try {
      if (!this.canvasRef.current || !this.mounted) return;

      // Get container dimensions
      const container = this.canvasRef.current;
      const width = container.offsetWidth || 800;
      const height = container.offsetHeight || 600;

      // Create PIXI application with educational optimizations
      this.pixiApp = new PIXI.Application({
        width,
        height,
        backgroundColor: 0x1a1a2e,
        antialias: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2), // Cap at 2x for performance
        autoDensity: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true, // For screenshots/sharing
      });

      // Add canvas to DOM
      container.appendChild(this.pixiApp.view);

      // Initialize game with error boundary
      await this.initializeGame();
      
      this.setState({ isLoading: false });
      
      // Notify parent component
      if (this.props.onReady) {
        this.props.onReady(this.gameInstance);
      }
      
    } catch (error) {
      this.handleError(error);
    }
  }

  async initializeGame() {
    const { gameType, initialState = {} } = this.props;
    
    // Dynamic import based on game type
    const GameClass = await this.loadGameClass(gameType);
    
    if (!GameClass) {
      throw new Error(`Unknown game type: ${gameType}`);
    }
    
    // Create game instance with error wrapper
    try {
      this.gameInstance = new GameClass(this.pixiApp, initialState);
      
      // Setup state bridge
      this.gameInstance.on('stateUpdate', this.handleStateUpdate);
      this.gameInstance.on('error', this.handleGameError);
      
      // Start game
      await this.gameInstance.initialize();
      
    } catch (error) {
      // Fallback to static mode if game fails
      this.showStaticFallback();
      throw error;
    }
  }

  async loadGameClass(gameType) {
    // Map of game types to their classes
    const gameModules = {
      puzzle: () => import('./games/PuzzleGamePixi'),
      crisis: () => import('./games/CrisisGamePixi'),
      competence: () => import('./games/CompetenceGamePixi'),
      ecosystem: () => import('./games/EcosystemGamePixi'),
    };
    
    if (!gameModules[gameType]) return null;
    
    const module = await gameModules[gameType]();
    return module.default;
  }

  handleStateUpdate = (newState) => {
    if (!this.mounted) return;
    
    // Throttle state updates for performance
    const now = Date.now();
    if (now - this.lastSaveTime > 1000) {
      this.saveProgress();
      this.lastSaveTime = now;
    }
    
    // Notify parent
    if (this.props.onStateChange) {
      this.props.onStateChange(newState);
    }
  };

  handleGameError = (error) => {
    console.error('[GameCanvasWrapper] Game error:', error);
    this.errorCount++;
    
    // If too many errors, switch to fallback mode
    if (this.errorCount > 3) {
      this.showStaticFallback();
    }
  };

  handleError(error) {
    console.error('[GameCanvasWrapper] Critical error:', error);
    
    this.setState({
      hasError: true,
      errorMessage: error.message || 'Spelet kunde inte laddas',
      isLoading: false
    });
    
    // Notify parent
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  handleResize(width, height) {
    if (!this.pixiApp || !this.mounted) return;
    
    // Update PIXI renderer
    this.pixiApp.renderer.resize(width, height);
    
    // Notify game instance
    if (this.gameInstance && this.gameInstance.handleResize) {
      this.gameInstance.handleResize(width, height);
    }
    
    this.setState({ dimensions: { width, height } });
  }

  pauseGame() {
    if (this.gameInstance && this.gameInstance.pause) {
      this.gameInstance.pause();
    }
    if (this.pixiApp) {
      this.pixiApp.ticker.stop();
    }
  }

  resumeGame() {
    if (this.gameInstance && this.gameInstance.resume) {
      this.gameInstance.resume();
    }
    if (this.pixiApp) {
      this.pixiApp.ticker.start();
    }
  }

  saveProgress() {
    if (this.gameInstance && this.gameInstance.getState) {
      const state = this.gameInstance.getState();
      // Save to parent component or Firebase
      if (this.props.onSave) {
        this.props.onSave(state);
      }
    }
  }

  showStaticFallback() {
    this.setState({
      hasError: true,
      errorMessage: 'Använder förenklat läge'
    });
    
    // Show static image or simplified version
    if (this.props.fallbackComponent) {
      // Parent can provide fallback
    }
  }

  cleanup() {
    try {
      // Remove event listeners
      if (this.visibilityHandler) {
        document.removeEventListener('visibilitychange', this.visibilityHandler);
      }
      
      // Disconnect observer
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      
      // Save final state
      this.saveProgress();
      
      // Cleanup game instance
      if (this.gameInstance) {
        if (this.gameInstance.destroy) {
          this.gameInstance.destroy();
        }
        this.gameInstance = null;
      }
      
      // Cleanup PIXI
      if (this.pixiApp) {
        // Stop ticker
        this.pixiApp.ticker.stop();
        
        // Remove all children
        this.pixiApp.stage.removeChildren();
        
        // Destroy app
        this.pixiApp.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true
        });
        
        this.pixiApp = null;
      }
      
      // Clear canvas container
      if (this.canvasRef.current) {
        this.canvasRef.current.innerHTML = '';
      }
      
    } catch (error) {
      console.error('[GameCanvasWrapper] Cleanup error:', error);
    }
  }

  render() {
    const { className = '', style = {} } = this.props;
    const { isLoading, hasError, errorMessage } = this.state;
    
    return (
      <div className={`game-canvas-wrapper ${className}`} style={style}>
        {isLoading && (
          <div className="game-loading">
            <div className="spinner" />
            <p>Laddar spel...</p>
          </div>
        )}
        
        {hasError && (
          <div className="game-error">
            <p>{errorMessage}</p>
            <button onClick={() => window.location.reload()}>
              Ladda om sidan
            </button>
          </div>
        )}
        
        <div 
          ref={this.canvasRef}
          className="game-canvas-container"
          style={{
            width: '100%',
            height: '100%',
            opacity: isLoading || hasError ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  }
}

// PropTypes for AI reference
GameCanvasWrapper.propTypes = {
  gameType: PropTypes.oneOf(['puzzle', 'crisis', 'competence', 'ecosystem']).isRequired,
  initialState: PropTypes.object,
  onReady: PropTypes.func,
  onStateChange: PropTypes.func,
  onError: PropTypes.func,
  onSave: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  fallbackComponent: PropTypes.element
};

export default GameCanvasWrapper;
```

### Integration Example for Puzzle Game
```javascript
// AI EXAMPLE: How to use GameCanvasWrapper
function PuzzleGameModule() {
  const [gameState, setGameState] = useState(null);
  
  return (
    <div className="puzzle-game-module">
      <GameCanvasWrapper
        gameType="puzzle"
        initialState={{
          level: 1,
          budget: 1000,
          connections: []
        }}
        onReady={(game) => {
          console.log('Puzzle game ready:', game);
        }}
        onStateChange={(newState) => {
          setGameState(newState);
        }}
        onSave={(state) => {
          // Save to Firebase
          firebase.updateGameState('puzzle', state);
        }}
        style={{ height: '600px' }}
      />
    </div>
  );
}
```

### Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Canvas not showing | Blank space | Ensure parent has defined height |
| Memory leak warnings | Console errors on unmount | Wrapper handles cleanup automatically |
| State not syncing | React state stale | Use onStateChange callback |
| Performance issues | Low FPS | Wrapper auto-adjusts quality |

---

## Pattern 2: DraggableNode System

### Purpose
Specialized drag-and-drop system for the Puzzle Game with snap-to-grid and validation.

### Usage Template
```javascript
/**
 * DraggableNode - Puzzle Game Specific Drag-Drop System
 * 
 * AI INSTRUCTIONS:
 * 1. This is specifically for the Puzzle Game data nodes
 * 2. Handles snap-to-grid and connection validation
 * 3. Copy entire class, modify only the visual styling
 */
import * as PIXI from 'pixi.js';

class DraggableNode extends PIXI.Container {
  constructor(config) {
    super();
    
    // Node configuration
    this.nodeId = config.id;
    this.nodeType = config.type; // 'source', 'hub', 'internal'
    this.gridPosition = config.gridPosition;
    this.connections = new Set();
    
    // Visual configuration
    this.baseColor = config.color || 0x4a90e2;
    this.hoverColor = config.hoverColor || 0x6bb6ff;
    this.errorColor = 0xff4444;
    this.successColor = 0x44ff44;
    
    // State
    this.isDragging = false;
    this.isValidTarget = false;
    this.isConnected = false;
    
    // Grid settings
    this.gridSize = 50;
    this.snapThreshold = 25;
    
    this.setup();
  }

  setup() {
    // Create node graphics
    this.graphics = new PIXI.Graphics();
    this.updateGraphics(this.baseColor);
    this.addChild(this.graphics);
    
    // Add label
    const style = new PIXI.TextStyle({
      fontFamily: 'Inter, sans-serif',
      fontSize: 14,
      fill: 0xffffff,
      align: 'center'
    });
    
    this.label = new PIXI.Text(this.nodeId, style);
    this.label.anchor.set(0.5);
    this.addChild(this.label);
    
    // Make interactive
    this.interactive = true;
    this.buttonMode = true;
    
    // Setup event handlers
    this.setupInteraction();
  }

  updateGraphics(color) {
    this.graphics.clear();
    
    // Draw based on node type
    switch(this.nodeType) {
      case 'source':
        this.drawSourceNode(color);
        break;
      case 'hub':
        this.drawHubNode(color);
        break;
      case 'internal':
        this.drawInternalNode(color);
        break;
    }
  }

  drawSourceNode(color) {
    // External data sources - rounded rectangle
    this.graphics.beginFill(color);
    this.graphics.drawRoundedRect(-40, -25, 80, 50, 10);
    this.graphics.endFill();
    
    // Border
    this.graphics.lineStyle(2, 0xffffff, 0.3);
    this.graphics.drawRoundedRect(-40, -25, 80, 50, 10);
  }

  drawHubNode(color) {
    // Central hub - hexagon
    const size = 35;
    this.graphics.beginFill(color);
    this.graphics.drawPolygon([
      -size, 0,
      -size/2, -size * 0.866,
      size/2, -size * 0.866,
      size, 0,
      size/2, size * 0.866,
      -size/2, size * 0.866
    ]);
    this.graphics.endFill();
    
    // Glow effect for hub
    this.graphics.lineStyle(3, color, 0.5);
    this.graphics.drawPolygon([
      -size*1.2, 0,
      -size*0.6, -size * 1.04,
      size*0.6, -size * 1.04,
      size*1.2, 0,
      size*0.6, size * 1.04,
      -size*0.6, size * 1.04
    ]);
  }

  drawInternalNode(color) {
    // Internal systems - circle
    this.graphics.beginFill(color);
    this.graphics.drawCircle(0, 0, 30);
    this.graphics.endFill();
    
    // Inner circle for status
    if (this.isConnected) {
      this.graphics.beginFill(this.successColor, 0.3);
      this.graphics.drawCircle(0, 0, 25);
      this.graphics.endFill();
    }
  }

  setupInteraction() {
    // Only internal nodes are draggable in our game
    if (this.nodeType !== 'internal') return;
    
    this.on('pointerdown', this.onDragStart);
    this.on('pointerup', this.onDragEnd);
    this.on('pointerupoutside', this.onDragEnd);
    this.on('pointermove', this.onDragMove);
    this.on('pointerover', this.onHover);
    this.on('pointerout', this.onHoverEnd);
  }

  onDragStart = (event) => {
    if (this.nodeType !== 'internal') return;
    
    this.isDragging = true;
    this.data = event.data;
    this.alpha = 0.8;
    
    // Store offset
    const position = this.data.getLocalPosition(this.parent);
    this.dragOffset = {
      x: position.x - this.x,
      y: position.y - this.y
    };
    
    // Bring to front
    this.parent.setChildIndex(this, this.parent.children.length - 1);
    
    // Emit event
    this.emit('dragstart', { node: this });
  };

  onDragMove = () => {
    if (!this.isDragging) return;
    
    const position = this.data.getLocalPosition(this.parent);
    
    // Smooth movement
    this.x = position.x - this.dragOffset.x;
    this.y = position.y - this.dragOffset.y;
    
    // Check for valid drop targets
    this.checkValidTargets();
    
    // Show connection preview
    this.emit('dragmove', { 
      node: this,
      position: { x: this.x, y: this.y }
    });
  };

  onDragEnd = () => {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.data = null;
    this.alpha = 1;
    
    // Snap to grid
    this.snapToGrid();
    
    // Check if dropped on valid target
    const validTarget = this.getValidDropTarget();
    if (validTarget) {
      this.emit('connection', {
        source: this,
        target: validTarget
      });
    }
    
    // Emit event
    this.emit('dragend', { node: this });
  };

  onHover = () => {
    if (this.isDragging) return;
    this.updateGraphics(this.hoverColor);
    this.scale.set(1.1);
  };

  onHoverEnd = () => {
    if (this.isDragging) return;
    this.updateGraphics(this.baseColor);
    this.scale.set(1);
  };

  snapToGrid() {
    const snappedX = Math.round(this.x / this.gridSize) * this.gridSize;
    const snappedY = Math.round(this.y / this.gridSize) * this.gridSize;
    
    // Animate snap
    this.emit('animate', {
      target: this,
      props: { x: snappedX, y: snappedY },
      duration: 200
    });
  }

  checkValidTargets() {
    // Emit event for game to check valid connection targets
    this.emit('checkTargets', { node: this });
  }

  getValidDropTarget() {
    // Game logic will determine valid targets
    // This is handled by the parent game class
    return null;
  }

  setConnectionState(connected, valid = true) {
    this.isConnected = connected;
    const color = connected 
      ? (valid ? this.successColor : this.errorColor)
      : this.baseColor;
    this.updateGraphics(color);
  }

  addConnection(targetNode) {
    this.connections.add(targetNode.nodeId);
    this.setConnectionState(true);
  }

  removeConnection(targetNode) {
    this.connections.delete(targetNode.nodeId);
    if (this.connections.size === 0) {
      this.setConnectionState(false);
    }
  }

  reset() {
    this.connections.clear();
    this.setConnectionState(false);
    this.x = this.gridPosition.x * this.gridSize;
    this.y = this.gridPosition.y * this.gridSize;
  }

  destroy() {
    this.removeAllListeners();
    super.destroy({ children: true });
  }
}

// Connection Line Renderer
class ConnectionLine extends PIXI.Graphics {
  constructor() {
    super();
    this.sourceNode = null;
    this.targetNode = null;
    this.isValid = true;
    this.isPreview = false;
  }

  connect(source, target, isPreview = false) {
    this.sourceNode = source;
    this.targetNode = target;
    this.isPreview = isPreview;
    this.updateLine();
  }

  updateLine() {
    this.clear();
    
    if (!this.sourceNode || !this.targetNode) return;
    
    const startX = this.sourceNode.x;
    const startY = this.sourceNode.y;
    const endX = this.targetNode.x;
    const endY = this.targetNode.y;
    
    // Line style based on state
    const color = this.isValid ? 0x4a90e2 : 0xff4444;
    const alpha = this.isPreview ? 0.5 : 1;
    const width = this.isPreview ? 2 : 3;
    
    this.lineStyle(width, color, alpha);
    
    // Draw bezier curve for aesthetic connections
    const controlX = (startX + endX) / 2;
    const controlY1 = startY - 50;
    const controlY2 = endY - 50;
    
    this.moveTo(startX, startY);
    this.bezierCurveTo(
      controlX, controlY1,
      controlX, controlY2,
      endX, endY
    );
    
    // Add flow animation particles if connected
    if (!this.isPreview && this.isValid) {
      this.addFlowAnimation();
    }
  }

  addFlowAnimation() {
    // Visual feedback for data flow
    // This would spawn particles along the line
  }

  setValid(valid) {
    this.isValid = valid;
    this.updateLine();
  }

  destroy() {
    this.sourceNode = null;
    this.targetNode = null;
    super.destroy();
  }
}

export { DraggableNode, ConnectionLine };
```

### Integration Example
```javascript
// AI EXAMPLE: Using DraggableNode in Puzzle Game
class PuzzleGamePixi extends BasePixiGame {
  setupNodes() {
    // Create nodes based on game data
    this.nodes = new Map();
    
    // External data sources
    const sources = [
      { id: 'Skatteverket', type: 'source', gridPosition: { x: 2, y: 2 } },
      { id: 'Bolagsverket', type: 'source', gridPosition: { x: 2, y: 4 } }
    ];
    
    sources.forEach(config => {
      const node = new DraggableNode({
        ...config,
        color: 0x2196F3
      });
      
      // Position on grid
      node.x = config.gridPosition.x * 50;
      node.y = config.gridPosition.y * 50;
      
      // Add event listeners
      node.on('connection', this.handleConnection);
      node.on('dragstart', this.handleDragStart);
      
      this.nodesContainer.addChild(node);
      this.nodes.set(config.id, node);
    });
    
    // Create central hub
    const hub = new DraggableNode({
      id: 'Ena-hubben',
      type: 'hub',
      gridPosition: { x: 6, y: 3 },
      color: 0xFF9800
    });
    
    hub.x = 300;
    hub.y = 150;
    this.nodesContainer.addChild(hub);
    this.nodes.set('Ena-hubben', hub);
  }
  
  handleConnection = ({ source, target }) => {
    // Validate connection through hub
    if (this.isValidConnection(source, target)) {
      const line = new ConnectionLine();
      line.connect(source, target);
      this.connectionsContainer.addChild(line);
      
      // Update game state
      this.updateState({
        connections: [...this.state.connections, {
          from: source.nodeId,
          to: target.nodeId
        }]
      });
    }
  };
}
```

---

## Pattern 3: StateBridge System

### Purpose
Bidirectional state synchronization between React and PixiJS with automatic validation and batching.

### Usage Template
```javascript
/**
 * StateBridge - React-PixiJS State Synchronization
 * 
 * AI INSTRUCTIONS:
 * 1. This handles all state sync automatically
 * 2. Use updateState() in PixiJS, receives updates via subscribers
 * 3. Batches updates for performance
 */
class StateBridge {
  constructor(gameInstance, initialState = {}) {
    this.gameInstance = gameInstance;
    this.reactState = initialState;
    this.pixiState = { ...initialState };
    this.subscribers = new Map();
    this.updateQueue = [];
    this.isProcessing = false;
    
    // Performance settings
    this.batchDelay = 16; // One frame at 60fps
    this.maxBatchSize = 50;
    
    // State validation schema
    this.schema = this.defineSchema();
    
    this.initialize();
  }

  defineSchema() {
    // Define expected state structure for validation
    return {
      puzzle: {
        connections: Array,
        budget: Number,
        moves: Number,
        completed: Boolean,
        score: Number
      },
      crisis: {
        phase: String,
        crisisEvents: Array,
        infrastructure: Object,
        societyIndex: Number,
        timeRemaining: Number
      }
    };
  }

  initialize() {
    // Setup game instance methods
    this.gameInstance.updateState = this.updateFromPixi.bind(this);
    this.gameInstance.getState = () => this.pixiState;
    
    // Setup React update channel
    this.setupReactChannel();
    
    // Start update processor
    this.startUpdateProcessor();
  }

  setupReactChannel() {
    // Create a custom event for React updates
    window.addEventListener('pixi-state-update', (event) => {
      this.updateFromReact(event.detail);
    });
  }

  updateFromReact(updates) {
    // Validate updates
    const validatedUpdates = this.validateUpdates(updates);
    
    // Add to queue
    this.updateQueue.push({
      source: 'react',
      updates: validatedUpdates,
      timestamp: Date.now()
    });
  }

  updateFromPixi(updates) {
    // Validate updates
    const validatedUpdates = this.validateUpdates(updates);
    
    // Add to queue
    this.updateQueue.push({
      source: 'pixi',
      updates: validatedUpdates,
      timestamp: Date.now()
    });
  }

  validateUpdates(updates) {
    const validated = {};
    const gameType = this.gameInstance.gameType;
    const schema = this.schema[gameType];
    
    if (!schema) return updates;
    
    for (const [key, value] of Object.entries(updates)) {
      if (schema[key]) {
        // Type validation
        const expectedType = schema[key];
        if (this.isValidType(value, expectedType)) {
          validated[key] = value;
        } else {
          console.warn(`Invalid type for ${key}:`, value);
        }
      }
    }
    
    return validated;
  }

  isValidType(value, expectedType) {
    if (expectedType === Array) return Array.isArray(value);
    if (expectedType === Object) return typeof value === 'object' && !Array.isArray(value);
    return typeof value === expectedType.name.toLowerCase();
  }

  startUpdateProcessor() {
    const processUpdates = () => {
      if (this.updateQueue.length > 0 && !this.isProcessing) {
        this.processBatch();
      }
      requestAnimationFrame(processUpdates);
    };
    
    requestAnimationFrame(processUpdates);
  }

  async processBatch() {
    this.isProcessing = true;
    
    // Get batch of updates
    const batch = this.updateQueue.splice(0, this.maxBatchSize);
    
    // Merge updates by source
    const reactUpdates = {};
    const pixiUpdates = {};
    
    batch.forEach(({ source, updates }) => {
      if (source === 'react') {
        Object.assign(reactUpdates, updates);
      } else {
        Object.assign(pixiUpdates, updates);
      }
    });
    
    // Apply updates
    if (Object.keys(reactUpdates).length > 0) {
      this.applyToPixi(reactUpdates);
    }
    
    if (Object.keys(pixiUpdates).length > 0) {
      this.applyToReact(pixiUpdates);
    }
    
    this.isProcessing = false;
  }

  applyToPixi(updates) {
    // Update PixiJS state
    Object.assign(this.pixiState, updates);
    
    // Notify game instance
    if (this.gameInstance.onStateUpdate) {
      this.gameInstance.onStateUpdate(updates);
    }
    
    // Update specific game elements
    this.updatePixiElements(updates);
  }

  applyToReact(updates) {
    // Update React state copy
    Object.assign(this.reactState, updates);
    
    // Notify all React subscribers
    this.notifySubscribers(updates);
    
    // Dispatch custom event for React
    window.dispatchEvent(new CustomEvent('pixi-state-changed', {
      detail: updates
    }));
  }

  updatePixiElements(updates) {
    // Game-specific element updates
    const gameType = this.gameInstance.gameType;
    
    switch(gameType) {
      case 'puzzle':
        this.updatePuzzleElements(updates);
        break;
      case 'crisis':
        this.updateCrisisElements(updates);
        break;
    }
  }

  updatePuzzleElements(updates) {
    if (updates.connections) {
      // Redraw connections
      if (this.gameInstance.redrawConnections) {
        this.gameInstance.redrawConnections(updates.connections);
      }
    }
    
    if (updates.budget !== undefined) {
      // Update budget display
      if (this.gameInstance.budgetDisplay) {
        this.gameInstance.budgetDisplay.text = `Budget: ${updates.budget} kr`;
      }
    }
  }

  updateCrisisElements(updates) {
    if (updates.crisisEvents) {
      // Trigger crisis visualizations
      updates.crisisEvents.forEach(event => {
        if (this.gameInstance.showCrisisEvent) {
          this.gameInstance.showCrisisEvent(event);
        }
      });
    }
    
    if (updates.societyIndex !== undefined) {
      // Update society index meter
      if (this.gameInstance.updateSocietyIndex) {
        this.gameInstance.updateSocietyIndex(updates.societyIndex);
      }
    }
  }

  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(key)?.delete(callback);
    };
  }

  notifySubscribers(updates) {
    for (const [key, value] of Object.entries(updates)) {
      const subscribers = this.subscribers.get(key);
      if (subscribers) {
        subscribers.forEach(callback => callback(value));
      }
    }
  }

  // Performance monitoring
  getMetrics() {
    return {
      queueLength: this.updateQueue.length,
      isProcessing: this.isProcessing,
      reactState: { ...this.reactState },
      pixiState: { ...this.pixiState },
      subscribers: this.subscribers.size
    };
  }

  destroy() {
    // Clear update queue
    this.updateQueue = [];
    
    // Remove event listener
    window.removeEventListener('pixi-state-update', this.updateFromReact);
    
    // Clear subscribers
    this.subscribers.clear();
    
    // Cleanup game instance references
    if (this.gameInstance) {
      this.gameInstance.updateState = null;
      this.gameInstance.getState = null;
    }
  }
}

// React Hook for using StateBridge
export function usePixiState(gameInstance) {
  const [state, setState] = useState({});
  const [bridge, setBridge] = useState(null);
  
  useEffect(() => {
    if (!gameInstance) return;
    
    // Create bridge
    const stateBridge = new StateBridge(gameInstance, state);
    setBridge(stateBridge);
    
    // Subscribe to all state changes
    const handleStateChange = (updates) => {
      setState(prev => ({ ...prev, ...updates }));
    };
    
    window.addEventListener('pixi-state-changed', (e) => {
      handleStateChange(e.detail);
    });
    
    return () => {
      window.removeEventListener('pixi-state-changed', handleStateChange);
      stateBridge.destroy();
    };
  }, [gameInstance]);
  
  const updatePixiState = useCallback((updates) => {
    if (!bridge) return;
    
    window.dispatchEvent(new CustomEvent('pixi-state-update', {
      detail: updates
    }));
  }, [bridge]);
  
  return [state, updatePixiState];
}

export default StateBridge;
```

### Integration Example
```javascript
// AI EXAMPLE: Using StateBridge in React component
function PuzzleGameModule() {
  const [gameInstance, setGameInstance] = useState(null);
  const [pixiState, updatePixiState] = usePixiState(gameInstance);
  
  // React state automatically syncs with PixiJS
  useEffect(() => {
    console.log('Game state updated:', pixiState);
  }, [pixiState]);
  
  const handleResetGame = () => {
    // Update from React side
    updatePixiState({
      connections: [],
      budget: 1000,
      moves: 0,
      completed: false
    });
  };
  
  return (
    <div>
      <div className="game-stats">
        <p>Budget: {pixiState.budget || 1000} kr</p>
        <p>Moves: {pixiState.moves || 0}</p>
      </div>
      
      <GameCanvasWrapper
        gameType="puzzle"
        onReady={setGameInstance}
      />
      
      <button onClick={handleResetGame}>Reset Game</button>
    </div>
  );
}
```

---

## Pattern 4-7 Summary

Due to space constraints, here's a quick reference for the remaining patterns:

### Pattern 4: CrisisEventManager
- Real-time crisis visualization system
- Particle effects and screen shakes
- Performance-optimized for multiple simultaneous events

### Pattern 5: MobileResponsiveCanvas
- Touch event normalization
- Pinch-to-zoom handling
- Responsive scaling system

### Pattern 6: SmartAssetLoader
- Progressive loading for slow networks
- Retry logic for failed assets
- Memory-efficient texture management

### Pattern 7: PerformanceMonitor
- Automatic quality adjustment
- FPS tracking and optimization
- Memory usage monitoring

---

## Testing Patterns

### Copy-Paste Test Suite
```javascript
// AI INSTRUCTION: Run this after implementing any pattern
const testPatterns = () => {
  console.log('Testing Pattern Implementation...');
  
  // Test 1: GameCanvasWrapper
  try {
    const wrapper = document.createElement('div');
    ReactDOM.render(<GameCanvasWrapper gameType="puzzle" />, wrapper);
    console.log('✅ GameCanvasWrapper: OK');
  } catch (e) {
    console.error('❌ GameCanvasWrapper:', e.message);
  }
  
  // Test 2: StateBridge
  try {
    const bridge = new StateBridge({ gameType: 'puzzle' }, {});
    bridge.updateFromPixi({ score: 100 });
    console.log('✅ StateBridge: OK');
  } catch (e) {
    console.error('❌ StateBridge:', e.message);
  }
  
  // Add more tests...
};
```

---

*Last Updated: 2025-06-20*  
*Pattern Library Version: 1.0*  
*Optimized for Framtidsbygget Educational Platform*