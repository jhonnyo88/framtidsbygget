# PixiJS Integration Guide - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready Implementation Guide  
**Syfte:** Komplett guide för PixiJS-integration i Framtidsbygget med projektspecifika patterns och lösningar

---

## Översikt

Detta dokument innehåller all kritisk kunskap för att framgångsrikt integrera PixiJS med React i Framtidsbygget. Dokumentet är skrivet för AI-utvecklare utan djup PixiJS-erfarenhet och innehåller:

- Projektspecifika implementation patterns
- Copy-paste ready kod optimerad för våra spel
- Vanliga fallgropar och hur man undviker dem
- Performance optimization strategier
- Testing och debugging guidelines

## Innehållsförteckning

1. [Arkitektur Översikt](#arkitektur-översikt)
2. [GameCanvasWrapper - Hjärtat i Integrationen](#gamecanvaswrapper)
3. [State Management mellan React och PixiJS](#state-management)
4. [Game-Specifika Patterns](#game-specifika-patterns)
5. [Performance och Optimering](#performance)
6. [Mobile och Touch Support](#mobile-support)
7. [Asset Management](#asset-management)
8. [Error Handling och Debugging](#error-handling)
9. [Testing Strategier](#testing)
10. [Deployment Considerations](#deployment)

---

## Arkitektur Översikt

### React-PixiJS Integration Stack

```
┌─────────────────────────────────────────┐
│          React Application              │
│  ┌───────────────────────────────────┐  │
│  │         App.jsx (State)           │  │
│  └─────────────┬─────────────────────┘  │
│                │                        │
│  ┌─────────────▼─────────────────────┐  │
│  │      GameCanvasWrapper.jsx        │  │ ← Critical Bridge Component
│  └─────────────┬─────────────────────┘  │
│                │                        │
│  ┌─────────────▼─────────────────────┐  │
│  │        StateBridge System         │  │ ← State Synchronization
│  └─────────────┬─────────────────────┘  │
└────────────────┼────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│          PixiJS Game Classes           │
│  ┌───────────────────────────────────┐  │
│  │      BasePixiGame (Abstract)      │  │
│  └─────────────┬─────────────────────┘  │
│                │                        │
│  ┌─────────────▼─────────────────────┐  │
│  │   Game-Specific Implementations   │  │
│  │  - PuzzleGamePixi                 │  │
│  │  - ConnectivityGamePixi           │  │
│  │  - (Other games...)               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Kritiska Integration Points

1. **Lifecycle Management**: GameCanvasWrapper hanterar skapande och förstöring av PixiJS-instanser
2. **State Synchronization**: StateBridge säkerställer att React state och PixiJS game state är synkade
3. **Event Handling**: Unified input system för både mouse och touch
4. **Asset Loading**: Smart loading system för educational networks
5. **Performance Monitoring**: Automatisk quality degradation för slow devices

---

## GameCanvasWrapper

GameCanvasWrapper är den mest kritiska komponenten i hela PixiJS-integrationen. Den MÅSTE implementeras exakt enligt denna specifikation för att undvika memory leaks och andra problem.

### Implementation

```javascript
/**
 * GameCanvasWrapper - Bulletproof React-PixiJS Bridge för Framtidsbygget
 * 
 * KRITISKT: Denna komponent hanterar hela lifecycle för PixiJS-spel
 * Fel här propagerar till alla spel!
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';

class GameCanvasWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.pixiApp = null;
    this.gameInstance = null;
    this.resizeObserver = null;
    this.mounted = false;
    
    this.state = {
      isLoading: true,
      error: null,
      dimensions: { width: 800, height: 600 }
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.initializePixiApp();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.cleanup(); // KRITISKT: Måste köras för att undvika memory leaks
  }

  async initializePixiApp() {
    try {
      // Get container dimensions
      const container = this.canvasRef.current?.parentElement;
      if (!container) throw new Error('Container not found');
      
      const { width, height } = this.calculateDimensions(container);
      
      // Create PixiJS Application with optimal settings för educational games
      this.pixiApp = new PIXI.Application({
        width,
        height,
        backgroundColor: this.props.backgroundColor || 0xf0f4f8,
        antialias: true, // Viktigt för text readability
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true, // Prevents context loss
        clearBeforeRender: true
      });

      // Set up ticker för smooth animations
      this.pixiApp.ticker.maxFPS = 60;
      
      // Mount canvas
      if (this.mounted && this.canvasRef.current) {
        this.canvasRef.current.appendChild(this.pixiApp.view);
        
        // Set up responsive sizing
        this.setupResponsiveHandling();
        
        // Initialize game
        await this.initializeGame();
      }
    } catch (error) {
      console.error('PixiJS initialization failed:', error);
      this.setState({ error: error.message, isLoading: false });
    }
  }

  async initializeGame() {
    try {
      const { pixiGameClass, initialData, onGameComplete } = this.props;
      
      // VIKTIGT: Skicka med dimensions och device info
      this.gameInstance = new pixiGameClass(
        this.pixiApp,
        {
          ...initialData,
          dimensions: this.state.dimensions,
          isMobile: this.isMobileDevice()
        },
        this.handleGameComplete.bind(this)
      );
      
      // Set up state sync bridge
      this.gameInstance.onStateChange = this.handleGameStateChange.bind(this);
      
      // Start game
      await this.gameInstance.start();
      
      if (this.mounted) {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Game initialization failed:', error);
      this.setState({ error: error.message, isLoading: false });
    }
  }

  setupResponsiveHandling() {
    // ResizeObserver för responsive canvas
    this.resizeObserver = new ResizeObserver((entries) => {
      if (!this.mounted) return;
      
      for (let entry of entries) {
        const { width, height } = this.calculateDimensions(entry.target);
        this.handleResize(width, height);
      }
    });
    
    if (this.canvasRef.current?.parentElement) {
      this.resizeObserver.observe(this.canvasRef.current.parentElement);
    }
    
    // Orientation change för mobile
    window.addEventListener('orientationchange', this.handleOrientationChange);
  }

  calculateDimensions(container) {
    const maxWidth = this.props.maxWidth || 1200;
    const maxHeight = this.props.maxHeight || 800;
    const aspectRatio = this.props.aspectRatio || 4/3;
    
    let width = Math.min(container.clientWidth, maxWidth);
    let height = width / aspectRatio;
    
    if (height > container.clientHeight) {
      height = Math.min(container.clientHeight, maxHeight);
      width = height * aspectRatio;
    }
    
    return { width: Math.floor(width), height: Math.floor(height) };
  }

  handleResize = (width, height) => {
    if (!this.pixiApp || !this.mounted) return;
    
    // Throttle resize events för performance
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.pixiApp.renderer.resize(width, height);
      this.setState({ dimensions: { width, height } });
      
      // Notify game instance
      if (this.gameInstance?.handleResize) {
        this.gameInstance.handleResize(width, height);
      }
    }, 100);
  };

  handleOrientationChange = () => {
    // Force recalculation efter orientation change
    setTimeout(() => {
      const container = this.canvasRef.current?.parentElement;
      if (container) {
        const { width, height } = this.calculateDimensions(container);
        this.handleResize(width, height);
      }
    }, 500);
  };

  handleGameComplete = (result) => {
    // Ensure cleanup happens before callback
    this.cleanup();
    
    if (this.props.onGameComplete) {
      this.props.onGameComplete(result);
    }
  };

  handleGameStateChange = (partialState) => {
    // Bridge för syncing PixiJS state till React
    if (this.props.onStateChange) {
      this.props.onStateChange(partialState);
    }
  };

  cleanup() {
    // KRITISK CLEANUP SEQUENCE - MÅSTE FÖLJA DENNA ORDNING!
    
    // 1. Stop resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    
    // 2. Remove event listeners
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    clearTimeout(this.resizeTimeout);
    
    // 3. Destroy game instance
    if (this.gameInstance) {
      try {
        if (typeof this.gameInstance.destroy === 'function') {
          this.gameInstance.destroy();
        }
      } catch (error) {
        console.error('Game cleanup error:', error);
      }
      this.gameInstance = null;
    }
    
    // 4. Destroy PixiJS application
    if (this.pixiApp) {
      try {
        // Stop ticker
        this.pixiApp.ticker.stop();
        
        // Destroy all children
        this.pixiApp.stage.removeChildren();
        
        // Destroy app with all options
        this.pixiApp.destroy(true, {
          children: true,
          texture: true,
          baseTexture: true
        });
      } catch (error) {
        console.error('PixiJS cleanup error:', error);
      }
      this.pixiApp = null;
    }
    
    // 5. Clear canvas
    if (this.canvasRef.current) {
      this.canvasRef.current.innerHTML = '';
    }
  }

  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  render() {
    const { isLoading, error } = this.state;
    
    return (
      <div className="game-canvas-wrapper">
        {error && (
          <div className="game-error">
            <h3>Spelet kunde inte laddas</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Försök igen
            </button>
          </div>
        )}
        
        {isLoading && (
          <div className="game-loading">
            <div className="spinner"></div>
            <p>Laddar spel...</p>
          </div>
        )}
        
        <div 
          ref={this.canvasRef} 
          className="game-canvas-container"
          style={{ 
            width: '100%', 
            height: '100%',
            display: isLoading || error ? 'none' : 'block'
          }}
        />
      </div>
    );
  }
}

export default GameCanvasWrapper;
```

### Användning i React Component

```javascript
// I din game component (t.ex. PuzzleGameView.jsx)
import GameCanvasWrapper from './GameCanvasWrapper';
import PuzzleGamePixi from '../pixi/PuzzleGamePixi';
import gameContent from '../data/gameContent';

function PuzzleGameView({ onGameComplete, gameState }) {
  const handleStateChange = useCallback((pixiState) => {
    // Update React state based on PixiJS game state
    console.log('Game state updated:', pixiState);
  }, []);

  return (
    <div className="puzzle-game-view">
      <GameCanvasWrapper
        pixiGameClass={PuzzleGamePixi}
        initialData={{
          budget: gameContent.puzzleGame.gameConfig.initialBudget,
          dataSources: gameContent.puzzleGame.gameElements.dataSources,
          synergyBonuses: gameState.unlockedSynergies
        }}
        onGameComplete={onGameComplete}
        onStateChange={handleStateChange}
        maxWidth={1200}
        maxHeight={800}
        aspectRatio={4/3}
        backgroundColor={0xf0f4f8}
      />
    </div>
  );
}
```

### Kritiska Punkter

1. **ALLTID** anropa cleanup() i componentWillUnmount
2. **ALLTID** kontrollera mounted flag innan state updates
3. **ALLTID** destroy alla PIXI objects explicit
4. **ALDRIG** lita på garbage collection för PIXI objects
5. **ALDRIG** skapa nya PIXI Applications utan att destroy gamla

---

## State Management

### StateBridge Pattern

StateBridge säkerställer synkronisering mellan PixiJS game state och React state utan performance problem.

```javascript
/**
 * StateBridge - Synkroniserar PixiJS game state med React
 * Använder batching för att undvika excessive re-renders
 */
export class StateBridge {
  constructor() {
    this.bridges = new Map();
    this.updateQueue = [];
    this.batchTimeout = null;
  }
  
  createBridge(gameId, reactSetState, pixiGameInstance) {
    const bridge = {
      gameId,
      reactSetState,
      pixiGameInstance,
      lastState: {},
      updateBuffer: {}
    };
    
    this.bridges.set(gameId, bridge);
    
    // Return update function för PixiJS att anropa
    return (updates) => this.queueUpdate(gameId, updates);
  }
  
  queueUpdate(gameId, updates) {
    const bridge = this.bridges.get(gameId);
    if (!bridge) return;
    
    // Merge updates into buffer
    Object.assign(bridge.updateBuffer, updates);
    
    // Batch updates för performance (60fps)
    if (!this.batchTimeout) {
      this.batchTimeout = setTimeout(() => this.flushUpdates(), 16);
    }
  }
  
  flushUpdates() {
    this.bridges.forEach(bridge => {
      if (Object.keys(bridge.updateBuffer).length > 0) {
        // Deep comparison för att undvika onödiga renders
        const hasChanges = this.hasDeepChanges(bridge.lastState, bridge.updateBuffer);
        
        if (hasChanges) {
          bridge.reactSetState(prevState => ({
            ...prevState,
            gameState: {
              ...prevState.gameState,
              ...bridge.updateBuffer
            }
          }));
          
          bridge.lastState = { ...bridge.lastState, ...bridge.updateBuffer };
        }
        
        bridge.updateBuffer = {};
      }
    });
    
    this.batchTimeout = null;
  }
  
  hasDeepChanges(oldState, newState) {
    for (const key in newState) {
      if (JSON.stringify(oldState[key]) !== JSON.stringify(newState[key])) {
        return true;
      }
    }
    return false;
  }
  
  destroyBridge(gameId) {
    this.bridges.delete(gameId);
  }
}

// Singleton instance
export const stateBridge = new StateBridge();
```

### Användning i Game Class

```javascript
// I din PixiJS game class
class PuzzleGamePixi extends BasePixiGame {
  constructor(pixiApp, initialData, onCompleteCallback) {
    super(pixiApp, initialData, onCompleteCallback);
    
    // Create state bridge
    this.stateBridge = initialData.stateBridge;
  }
  
  updateGameState() {
    // Update React state via bridge
    this.stateBridge({
      connections: this.connections.length,
      budget: this.currentBudget,
      moveCount: this.moves,
      isComplete: this.checkWinCondition()
    });
  }
  
  onConnectionMade(source, target) {
    this.connections.push({ source, target });
    this.moves++;
    this.currentBudget -= 10;
    
    // Sync to React
    this.updateGameState();
  }
}
```

---

## Game-Specifika Patterns

### Pattern 1: Drag & Drop System (Puzzle Game)

```javascript
/**
 * DraggableNode - Snap-to-grid drag system för Puzzle Game
 * Hanterar både mouse och touch med validation
 */
class DraggableNode extends PIXI.Container {
  constructor(config) {
    super();
    
    this.config = {
      id: config.id,
      gridSize: config.gridSize || 50,
      snapToGrid: config.snapToGrid !== false,
      bounds: config.bounds || null,
      validTargets: config.validTargets || [],
      onDragStart: config.onDragStart || (() => {}),
      onDragMove: config.onDragMove || (() => {}),
      onDragEnd: config.onDragEnd || (() => {}),
      onValidDrop: config.onValidDrop || (() => {}),
      onInvalidDrop: config.onInvalidDrop || (() => {})
    };
    
    this.isDragging = false;
    this.dragData = null;
    this.startPosition = { x: this.x, y: this.y };
    this.visualElements = {};
    
    this.setup();
  }
  
  setup() {
    // Create visual representation
    this.createVisuals();
    
    // Make interactive - VIKTIGT: Använd pointer events för touch support
    this.interactive = true;
    this.buttonMode = true;
    
    // Set up event handlers för både mouse och touch
    this.on('pointerdown', this.onDragStart)
        .on('pointerup', this.onDragEnd)
        .on('pointerupoutside', this.onDragEnd)
        .on('pointermove', this.onDragMove);
  }
  
  createVisuals() {
    // Background
    const bg = new PIXI.Graphics();
    bg.beginFill(0x3498db, 1);
    bg.drawRoundedRect(-40, -40, 80, 80, 10);
    bg.endFill();
    this.visualElements.background = bg;
    this.addChild(bg);
    
    // Icon/Label
    const style = new PIXI.TextStyle({
      fontFamily: 'Work Sans', // Använd projektets font
      fontSize: 14,
      fill: 0xffffff,
      align: 'center'
    });
    const label = new PIXI.Text(this.config.label || this.config.id, style);
    label.anchor.set(0.5);
    this.visualElements.label = label;
    this.addChild(label);
    
    // Drag feedback shadow
    const shadow = new PIXI.Graphics();
    shadow.beginFill(0x000000, 0.2);
    shadow.drawRoundedRect(-42, -42, 84, 84, 10);
    shadow.endFill();
    shadow.visible = false;
    this.visualElements.shadow = shadow;
    this.addChildAt(shadow, 0);
  }
  
  onDragStart = (event) => {
    if (this.isDragging) return;
    
    this.isDragging = true;
    this.dragData = event.data;
    this.startPosition = { x: this.x, y: this.y };
    
    // Visual feedback
    this.alpha = 0.8;
    this.scale.set(1.05);
    this.visualElements.shadow.visible = true;
    
    // Bring to front
    if (this.parent) {
      this.parent.setChildIndex(this, this.parent.children.length - 1);
    }
    
    // Callback
    this.config.onDragStart(this);
    
    // Store offset för smooth dragging
    const newPosition = this.dragData.getLocalPosition(this.parent);
    this.dragOffset = {
      x: newPosition.x - this.x,
      y: newPosition.y - this.y
    };
  };
  
  onDragMove = (event) => {
    if (!this.isDragging || !this.dragData) return;
    
    const newPosition = this.dragData.getLocalPosition(this.parent);
    let targetX = newPosition.x - this.dragOffset.x;
    let targetY = newPosition.y - this.dragOffset.y;
    
    // Apply bounds om specified
    if (this.config.bounds) {
      targetX = Math.max(this.config.bounds.left, 
                Math.min(targetX, this.config.bounds.right));
      targetY = Math.max(this.config.bounds.top, 
                Math.min(targetY, this.config.bounds.bottom));
    }
    
    // Smooth movement
    this.x = targetX;
    this.y = targetY;
    
    // Visual feedback för valid drop zones
    this.checkDropZones();
    
    // Callback
    this.config.onDragMove(this, targetX, targetY);
  };
  
  onDragEnd = (event) => {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.dragData = null;
    
    // Snap to grid om enabled
    if (this.config.snapToGrid) {
      this.x = Math.round(this.x / this.config.gridSize) * this.config.gridSize;
      this.y = Math.round(this.y / this.config.gridSize) * this.config.gridSize;
    }
    
    // Check om dropped på valid target
    const validDrop = this.validateDrop();
    
    if (validDrop) {
      // Successful drop
      this.config.onValidDrop(this, validDrop);
    } else {
      // Invalid drop - animate back
      this.animateBack();
      this.config.onInvalidDrop(this);
    }
    
    // Reset visual state
    this.alpha = 1;
    this.scale.set(1);
    this.visualElements.shadow.visible = false;
    
    // Callback
    this.config.onDragEnd(this);
  };
  
  checkDropZones() {
    // Visual feedback för nearby valid targets
    if (!this.config.validTargets.length) return;
    
    this.config.validTargets.forEach(target => {
      const distance = this.getDistance(target);
      if (distance < 100) {
        // Highlight valid target
        target.alpha = 0.8;
        target.scale.set(1.1);
      } else {
        // Reset target
        target.alpha = 1;
        target.scale.set(1);
      }
    });
  }
  
  validateDrop() {
    if (!this.config.validTargets.length) return true;
    
    // Find closest valid target
    let closestTarget = null;
    let minDistance = Infinity;
    
    this.config.validTargets.forEach(target => {
      const distance = this.getDistance(target);
      if (distance < minDistance && distance < 50) { // 50px tolerance
        minDistance = distance;
        closestTarget = target;
      }
    });
    
    return closestTarget;
  }
  
  animateBack() {
    // Smooth animation tillbaka till start position
    const duration = 300;
    const startTime = Date.now();
    const startX = this.x;
    const startY = this.y;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeOutQuad(progress);
      
      this.x = startX + (this.startPosition.x - startX) * eased;
      this.y = startY + (this.startPosition.y - startY) * eased;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }
  
  getDistance(target) {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  easeOutQuad(t) {
    return t * (2 - t);
  }
  
  destroy() {
    // VIKTIGT: Clean up event listeners
    this.removeAllListeners();
    super.destroy({ children: true });
  }
}
```

### Pattern 2: Connection Line System (Puzzle Game)

```javascript
/**
 * ConnectionManager - Hanterar visuella kopplingar mellan noder
 */
class ConnectionManager extends PIXI.Container {
  constructor(gameRef) {
    super();
    this.game = gameRef;
    this.connections = [];
    this.connectionGraphics = new PIXI.Graphics();
    this.addChild(this.connectionGraphics);
    
    // Animation ticker
    this.animationTime = 0;
  }
  
  addConnection(source, target, type = 'data') {
    const connection = {
      id: `${source.id}_${target.id}`,
      source,
      target,
      type,
      isValid: this.validateConnection(source, target),
      animationOffset: Math.random() * Math.PI * 2
    };
    
    this.connections.push(connection);
    this.redrawConnections();
    
    return connection;
  }
  
  validateConnection(source, target) {
    // Exempel validation för Puzzle Game
    if (source.type === 'source' && target.type === 'hub') return true;
    if (source.type === 'hub' && target.type === 'internal') return true;
    return false;
  }
  
  redrawConnections() {
    this.connectionGraphics.clear();
    
    this.connections.forEach(conn => {
      this.drawConnection(conn);
    });
  }
  
  drawConnection(conn) {
    const g = this.connectionGraphics;
    
    // Bestäm färg baserat på typ och validitet
    const color = conn.isValid ? 0x2ECC71 : 0xE74C3C;
    const lineWidth = 3;
    
    // Beräkna control points för bezier curve
    const dx = conn.target.x - conn.source.x;
    const dy = conn.target.y - conn.source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const cp1x = conn.source.x + dx * 0.3;
    const cp1y = conn.source.y;
    const cp2x = conn.target.x - dx * 0.3;
    const cp2y = conn.target.y;
    
    // Rita connection
    g.lineStyle(lineWidth, color, 0.8);
    g.moveTo(conn.source.x, conn.source.y);
    g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, conn.target.x, conn.target.y);
    
    // Animerad "data flow" effekt
    if (conn.isValid) {
      const flowSpeed = 0.001;
      const flowPosition = (this.animationTime * flowSpeed + conn.animationOffset) % 1;
      
      // Rita flow dots
      for (let i = 0; i < 3; i++) {
        const t = (flowPosition + i * 0.1) % 1;
        const point = this.getPointOnBezier(
          conn.source, { x: cp1x, y: cp1y },
          { x: cp2x, y: cp2y }, conn.target, t
        );
        
        g.beginFill(0xFFFFFF, 0.8);
        g.drawCircle(point.x, point.y, 3);
        g.endFill();
      }
    }
  }
  
  getPointOnBezier(p0, p1, p2, p3, t) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    
    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;
    
    return { x, y };
  }
  
  update(deltaTime) {
    this.animationTime += deltaTime;
    this.redrawConnections();
  }
  
  removeConnection(connectionId) {
    this.connections = this.connections.filter(c => c.id !== connectionId);
    this.redrawConnections();
  }
  
  destroy() {
    this.connections = [];
    this.connectionGraphics.clear();
    super.destroy({ children: true });
  }
}
```

### Pattern 3: Crisis Event System (Connectivity Game)

```javascript
/**
 * CrisisEventManager - Real-time crisis spawning och spreading
 * Optimerad för educational environment performance
 */
class CrisisEventManager extends PIXI.Container {
  constructor(gameRef, config) {
    super();
    
    this.game = gameRef;
    this.config = {
      maxConcurrentCrises: config.maxConcurrentCrises || 3,
      spreadSpeed: config.spreadSpeed || 1,
      visualQuality: config.visualQuality || 'medium',
      ...config
    };
    
    this.activeCrises = new Map();
    this.crisisPool = []; // Object pooling för performance
    this.particleContainers = new Map();
    this.ticker = null;
    
    this.setup();
  }
  
  setup() {
    // Create particle containers för performance
    this.setupParticleContainers();
    
    // Crisis effect layers
    this.effectLayer = new PIXI.Container();
    this.crisisLayer = new PIXI.Container();
    this.uiLayer = new PIXI.Container();
    
    this.addChild(this.effectLayer);
    this.addChild(this.crisisLayer);
    this.addChild(this.uiLayer);
    
    // Start update ticker
    this.ticker = this.game.app.ticker.add(this.update, this);
  }
  
  setupParticleContainers() {
    // Optimized containers för olika crisis types
    const particleTypes = ['storm', 'cyber', 'fire'];
    
    particleTypes.forEach(type => {
      // ParticleContainer är mycket snabbare än vanlig Container
      const container = new PIXI.ParticleContainer(1000, {
        scale: true,
        position: true,
        rotation: true,
        alpha: true,
        tint: true
      });
      this.particleContainers.set(type, container);
      this.effectLayer.addChild(container);
    });
  }
  
  spawnCrisis(type, location, severity) {
    if (this.activeCrises.size >= this.config.maxConcurrentCrises) {
      console.warn('Max concurrent crises reached');
      return null;
    }
    
    // Get or create crisis instance från pool
    const crisis = this.getCrisisFromPool(type);
    crisis.init({
      id: `crisis_${Date.now()}`,
      type,
      location,
      severity,
      startTime: Date.now(),
      spreadRadius: 0,
      affectedNodes: new Set([location.id]),
      isContained: false
    });
    
    // Add to active crises
    this.activeCrises.set(crisis.id, crisis);
    this.crisisLayer.addChild(crisis);
    
    // Create visual effects
    this.createCrisisEffects(crisis);
    
    // Notify game
    this.game.onCrisisSpawned?.(crisis);
    
    return crisis;
  }
  
  getCrisisFromPool(type) {
    // Object pooling för bättre performance
    const pooled = this.crisisPool.find(c => c.type === type && !c.active);
    if (pooled) {
      pooled.active = true;
      return pooled;
    }
    
    // Create new crisis instance
    const CrisisClass = this.getCrisisClass(type);
    const crisis = new CrisisClass(this);
    this.crisisPool.push(crisis);
    return crisis;
  }
  
  createStormEffect(crisis) {
    const particleContainer = this.particleContainers.get('storm');
    
    // Create wind particles
    for (let i = 0; i < 50; i++) {
      const particle = new PIXI.Sprite(PIXI.Texture.WHITE);
      particle.width = 2;
      particle.height = 20;
      particle.alpha = 0.3;
      particle.tint = 0x4a5568;
      particle.anchor.set(0.5);
      
      // Position around crisis center
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 100;
      particle.x = crisis.location.x + Math.cos(angle) * distance;
      particle.y = crisis.location.y + Math.sin(angle) * distance;
      particle.rotation = angle;
      
      // Store particle data för animation
      particle.velocity = {
        x: Math.cos(angle) * 2,
        y: Math.sin(angle) * 2
      };
      particle.crisis = crisis;
      
      particleContainer.addChild(particle);
    }
  }
  
  update(deltaTime) {
    // Update all active crises
    this.activeCrises.forEach(crisis => {
      this.updateCrisis(crisis, deltaTime);
      this.updateCrisisEffects(crisis, deltaTime);
      
      // Check if crisis should spread
      if (!crisis.isContained) {
        this.spreadCrisis(crisis, deltaTime);
      }
    });
    
    // Update particles
    this.updateParticles(deltaTime);
  }
  
  containCrisis(crisisId) {
    const crisis = this.activeCrises.get(crisisId);
    if (!crisis) return false;
    
    crisis.isContained = true;
    crisis.alpha = 0.5;
    
    // Visual feedback
    const containEffect = new PIXI.Graphics();
    containEffect.lineStyle(3, 0x00ff00, 1);
    containEffect.drawCircle(crisis.location.x, crisis.location.y, crisis.spreadRadius);
    this.effectLayer.addChild(containEffect);
    
    // Fade out effect
    const fadeOut = setInterval(() => {
      containEffect.alpha -= 0.05;
      if (containEffect.alpha <= 0) {
        this.effectLayer.removeChild(containEffect);
        clearInterval(fadeOut);
      }
    }, 50);
    
    return true;
  }
  
  destroy() {
    if (this.ticker) {
      this.game.app.ticker.remove(this.ticker);
    }
    
    this.activeCrises.clear();
    this.crisisPool.forEach(crisis => crisis.destroy());
    
    super.destroy({ children: true });
  }
}
```

---

## Performance

### Performance Monitor Implementation

```javascript
/**
 * PerformanceMonitor - Övervakar FPS och memory för educational environments
 * Auto-degraderar kvalitet vid dålig performance
 */
export class PerformanceMonitor {
  constructor(pixiApp, thresholds = {}) {
    this.app = pixiApp;
    this.thresholds = {
      minFPS: thresholds.minFPS || 30,
      maxMemory: thresholds.maxMemory || 200, // MB
      ...thresholds
    };
    
    this.metrics = {
      fps: 60,
      memory: 0,
      drawCalls: 0,
      textureCount: 0
    };
    
    this.degradationLevel = 0;
    this.callbacks = new Map();
    
    this.setup();
  }
  
  setup() {
    // FPS monitoring
    let lastTime = performance.now();
    let frames = 0;
    
    this.app.ticker.add(() => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        this.metrics.fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        
        this.checkPerformance();
      }
    });
    
    // Memory monitoring (om available)
    if (performance.memory) {
      setInterval(() => {
        this.metrics.memory = Math.round(performance.memory.usedJSHeapSize / 1048576);
      }, 2000);
    }
  }
  
  checkPerformance() {
    const { fps, memory } = this.metrics;
    
    // Auto-degrade quality om performance är poor
    if (fps < this.thresholds.minFPS) {
      this.degradeQuality();
    } else if (fps > this.thresholds.minFPS + 10 && this.degradationLevel > 0) {
      this.improveQuality();
    }
    
    // Notify listeners
    this.callbacks.forEach(callback => callback(this.metrics));
  }
  
  degradeQuality() {
    this.degradationLevel++;
    
    switch (this.degradationLevel) {
      case 1:
        // Reduce particle count
        PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(16, PIXI.settings.SPRITE_MAX_TEXTURES);
        console.log('Performance: Reducing texture batch size');
        break;
      case 2:
        // Disable anti-aliasing
        this.app.renderer.options.antialias = false;
        console.log('Performance: Disabling anti-aliasing');
        break;
      case 3:
        // Reduce resolution
        this.app.renderer.resolution = 1;
        console.log('Performance: Reducing resolution');
        break;
    }
  }
  
  improveQuality() {
    this.degradationLevel = Math.max(0, this.degradationLevel - 1);
    // Gradually restore quality settings
  }
  
  onMetricsUpdate(callback) {
    const id = Symbol();
    this.callbacks.set(id, callback);
    return () => this.callbacks.delete(id);
  }
  
  getReport() {
    return {
      ...this.metrics,
      degradationLevel: this.degradationLevel,
      timestamp: Date.now()
    };
  }
}
```

### Performance Best Practices

1. **Object Pooling**
   ```javascript
   // Återanvänd sprites istället för att skapa nya
   class SpritePool {
     constructor(textureId, initialSize = 10) {
       this.textureId = textureId;
       this.available = [];
       this.inUse = new Set();
       
       // Pre-create sprites
       for (let i = 0; i < initialSize; i++) {
         this.available.push(this.createSprite());
       }
     }
     
     getSprite() {
       let sprite = this.available.pop();
       if (!sprite) {
         sprite = this.createSprite();
       }
       this.inUse.add(sprite);
       return sprite;
     }
     
     returnSprite(sprite) {
       if (this.inUse.has(sprite)) {
         this.inUse.delete(sprite);
         sprite.visible = false;
         this.available.push(sprite);
       }
     }
     
     createSprite() {
       return new PIXI.Sprite(PIXI.Texture.from(this.textureId));
     }
   }
   ```

2. **Texture Atlases**
   ```javascript
   // Ladda flera textures som en atlas för bättre performance
   const loader = new PIXI.Loader();
   loader.add('gameAtlas', 'assets/game-atlas.json');
   loader.load((loader, resources) => {
     const textures = resources.gameAtlas.textures;
     // Använd textures från atlas
   });
   ```

3. **Culling**
   ```javascript
   // Rendera bara objekt som syns på skärmen
   container.children.forEach(child => {
     const bounds = child.getBounds();
     const screen = app.screen;
     
     child.visible = bounds.x < screen.width && 
                    bounds.x + bounds.width > 0 &&
                    bounds.y < screen.height && 
                    bounds.y + bounds.height > 0;
   });
   ```

---

## Mobile Support

### Mobile Input Handler

```javascript
/**
 * MobileInputHandler - Unified touch/mouse input för educational tablets
 * Hanterar både single touch och multi-touch
 */
export class MobileInputHandler {
  constructor(pixiApp) {
    this.app = pixiApp;
    this.touches = new Map();
    this.mouseData = null;
    this.inputMode = this.detectInputMode();
    
    this.setup();
  }
  
  detectInputMode() {
    const hasTouch = 'ontouchstart' in window;
    const hasMouse = matchMedia('(pointer:fine)').matches;
    
    return {
      touch: hasTouch,
      mouse: hasMouse,
      hybrid: hasTouch && hasMouse // Laptop med touchscreen
    };
  }
  
  setup() {
    // Unified pointer events
    this.app.stage.interactive = true;
    this.app.stage.hitArea = this.app.screen;
    
    // Prevent default touch behaviors
    this.app.view.style.touchAction = 'none';
    
    // iOS bounce prevention
    document.body.addEventListener('touchmove', this.preventDefault, { passive: false });
  }
  
  preventDefault(e) {
    if (e.target.closest('.game-canvas-container')) {
      e.preventDefault();
    }
  }
  
  makeInteractive(displayObject, options = {}) {
    displayObject.interactive = true;
    displayObject.buttonMode = !this.inputMode.touch; // Cursor bara för mouse
    
    const handlers = {
      tap: null,
      dragStart: null,
      dragMove: null,
      dragEnd: null
    };
    
    // Single touch/click
    if (options.onTap) {
      handlers.tap = (e) => {
        const point = e.data.global;
        options.onTap(point, e);
      };
      displayObject.on('pointertap', handlers.tap);
    }
    
    // Drag handling
    if (options.onDragStart || options.onDragMove || options.onDragEnd) {
      let dragging = false;
      let dragData = null;
      
      handlers.dragStart = (e) => {
        dragging = true;
        dragData = e.data;
        if (options.onDragStart) {
          options.onDragStart(e.data.global, e);
        }
      };
      
      handlers.dragMove = (e) => {
        if (dragging && dragData) {
          if (options.onDragMove) {
            options.onDragMove(dragData.global, e);
          }
        }
      };
      
      handlers.dragEnd = (e) => {
        if (dragging) {
          dragging = false;
          if (options.onDragEnd) {
            options.onDragEnd(e.data.global, e);
          }
          dragData = null;
        }
      };
      
      displayObject
        .on('pointerdown', handlers.dragStart)
        .on('pointermove', handlers.dragMove)
        .on('pointerup', handlers.dragEnd)
        .on('pointerupoutside', handlers.dragEnd);
    }
    
    // Store handlers för cleanup
    displayObject._inputHandlers = handlers;
    
    return displayObject;
  }
  
  removeInteractive(displayObject) {
    if (displayObject._inputHandlers) {
      const handlers = displayObject._inputHandlers;
      
      Object.entries(handlers).forEach(([event, handler]) => {
        if (handler) {
          displayObject.off(event, handler);
        }
      });
      
      delete displayObject._inputHandlers;
    }
    
    displayObject.interactive = false;
    displayObject.buttonMode = false;
  }
  
  destroy() {
    document.body.removeEventListener('touchmove', this.preventDefault);
    this.touches.clear();
  }
}
```

### Responsive Scaling

```javascript
/**
 * ResponsiveScaler - Hanterar skalning för olika skärmstorlekar
 */
export class ResponsiveScaler {
  constructor(pixiApp, baseWidth = 1200, baseHeight = 800) {
    this.app = pixiApp;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.currentScale = 1;
    
    this.setup();
  }
  
  setup() {
    // Initial scale
    this.updateScale();
    
    // Listen för resize
    window.addEventListener('resize', this.updateScale.bind(this));
  }
  
  updateScale() {
    const parent = this.app.view.parentElement;
    if (!parent) return;
    
    const availableWidth = parent.clientWidth;
    const availableHeight = parent.clientHeight;
    
    // Calculate scale för att fit container
    const scaleX = availableWidth / this.baseWidth;
    const scaleY = availableHeight / this.baseHeight;
    
    // Use minimum scale för att maintain aspect ratio
    this.currentScale = Math.min(scaleX, scaleY);
    
    // Apply scale
    this.app.stage.scale.set(this.currentScale);
    
    // Center stage
    this.app.stage.x = (availableWidth - this.baseWidth * this.currentScale) / 2;
    this.app.stage.y = (availableHeight - this.baseHeight * this.currentScale) / 2;
    
    // Update renderer size
    this.app.renderer.resize(availableWidth, availableHeight);
  }
  
  screenToWorld(screenX, screenY) {
    // Convert screen coordinates till world coordinates
    return {
      x: (screenX - this.app.stage.x) / this.currentScale,
      y: (screenY - this.app.stage.y) / this.currentScale
    };
  }
  
  worldToScreen(worldX, worldY) {
    // Convert world coordinates till screen coordinates
    return {
      x: worldX * this.currentScale + this.app.stage.x,
      y: worldY * this.currentScale + this.app.stage.y
    };
  }
}
```

---

## Asset Management

### Smart Asset Loader

```javascript
/**
 * SmartAssetLoader - Optimerad asset loading för slow educational networks
 * Includes retry logic, caching, och progress tracking
 */
export class SmartAssetLoader {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.cache = new Map();
    this.loadingPromises = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }
  
  async loadGameAssets(gameId, manifest) {
    const cacheKey = `game_${gameId}`;
    
    // Return cached om available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    // Return ongoing load om in progress
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }
    
    // Start loading
    const loadPromise = this.loadAssetBatch(manifest, gameId);
    this.loadingPromises.set(cacheKey, loadPromise);
    
    try {
      const assets = await loadPromise;
      this.cache.set(cacheKey, assets);
      this.loadingPromises.delete(cacheKey);
      return assets;
    } catch (error) {
      this.loadingPromises.delete(cacheKey);
      throw error;
    }
  }
  
  async loadAssetBatch(manifest, gameId) {
    const loader = new PIXI.Loader();
    const assets = {};
    
    // Add progress tracking
    const progressCallback = (loader, resource) => {
      const percent = Math.round(loader.progress);
      this.onProgress?.(gameId, percent);
    };
    
    loader.onProgress.add(progressCallback);
    
    // Sort by priority
    const sortedManifest = this.sortByPriority(manifest);
    
    // Add to loader med retry logic
    for (const asset of sortedManifest) {
      loader.add(asset.name, this.baseUrl + asset.url, {
        crossOrigin: true,
        loadType: PIXI.LoaderResource.LOAD_TYPE.XHR,
        xhrType: this.getXhrType(asset.url),
        metadata: { retries: 0 }
      });
    }
    
    // Handle errors med retry
    loader.onError.add((error, loader, resource) => {
      if (resource.metadata.retries < this.retryAttempts) {
        resource.metadata.retries++;
        console.log(`Retrying asset ${resource.name} (attempt ${resource.metadata.retries})`);
        
        setTimeout(() => {
          resource.load();
        }, this.retryDelay * resource.metadata.retries);
      }
    });
    
    return new Promise((resolve, reject) => {
      loader.load((loader, resources) => {
        // Check för errors
        const errors = Object.values(resources).filter(r => r.error);
        if (errors.length > 0) {
          reject(new Error(`Failed to load ${errors.length} assets`));
          return;
        }
        
        // Process resources
        Object.entries(resources).forEach(([name, resource]) => {
          if (resource.texture) {
            assets[name] = resource.texture;
          } else if (resource.data) {
            assets[name] = resource.data;
          }
        });
        
        resolve(assets);
      });
    });
  }
  
  sortByPriority(manifest) {
    return manifest.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority] || 3;
      const bPriority = priorityOrder[b.priority] || 3;
      return aPriority - bPriority;
    });
  }
  
  getXhrType(url) {
    const ext = url.split('.').pop().toLowerCase();
    const types = {
      'png': PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB,
      'jpg': PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB,
      'jpeg': PIXI.LoaderResource.XHR_RESPONSE_TYPE.BLOB,
      'json': PIXI.LoaderResource.XHR_RESPONSE_TYPE.JSON,
      'xml': PIXI.LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT
    };
    return types[ext] || PIXI.LoaderResource.XHR_RESPONSE_TYPE.TEXT;
  }
  
  preloadNextGame(gameId, manifest) {
    // Preload i background med low priority
    requestIdleCallback(() => {
      this.loadGameAssets(gameId, manifest).catch(err => {
        console.warn(`Background preload failed för ${gameId}:`, err);
      });
    });
  }
  
  clearCache(gameId = null) {
    if (gameId) {
      const cacheKey = `game_${gameId}`;
      const assets = this.cache.get(cacheKey);
      if (assets) {
        // Destroy textures för att free memory
        Object.values(assets).forEach(asset => {
          if (asset.destroy) asset.destroy(true);
        });
        this.cache.delete(cacheKey);
      }
    } else {
      // Clear all
      this.cache.forEach((assets, key) => {
        Object.values(assets).forEach(asset => {
          if (asset.destroy) asset.destroy(true);
        });
      });
      this.cache.clear();
    }
  }
}
```

### Asset Manifest Example

```javascript
// Example manifest för Puzzle Game
export const puzzleGameManifest = [
  {
    name: 'background',
    url: '/puzzle/background.png',
    priority: 'high'
  },
  {
    name: 'nodeSprite',
    url: '/puzzle/node-sprite.png',
    priority: 'critical'
  },
  {
    name: 'hubSprite',
    url: '/puzzle/hub-sprite.png',
    priority: 'critical'
  },
  {
    name: 'connectionSuccess',
    url: '/puzzle/sounds/connection-success.mp3',
    priority: 'medium'
  },
  {
    name: 'gameData',
    url: '/puzzle/data/nodes.json',
    priority: 'critical'
  }
];

// Usage
const assetLoader = new SmartAssetLoader('/assets/games');
const assets = await assetLoader.loadGameAssets('puzzle', puzzleGameManifest);
```

---

## Error Handling

### PixiJS Error Boundary

```javascript
/**
 * PixiErrorBoundary - Specialized error boundary för PixiJS components
 * Fångar och hanterar PixiJS-specifika errors
 */
class PixiErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PixiJS Error Boundary caught:', error, errorInfo);
    
    this.setState(prevState => ({
      error: error,
      errorInfo: errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log to monitoring service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        error_type: 'pixi_error'
      });
    }
    
    // Auto-retry logic för transient errors
    if (this.state.errorCount < 3 && this.isTransientError(error)) {
      setTimeout(() => {
        this.setState({ hasError: false, error: null, errorInfo: null });
      }, 2000);
    }
  }
  
  isTransientError(error) {
    const transientMessages = [
      'WebGL context lost',
      'Failed to create texture',
      'Resource loading failed'
    ];
    
    return transientMessages.some(msg => 
      error.message.includes(msg)
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="pixi-error-boundary">
          <div className="error-content">
            <h2>🎮 Spelet kunde inte laddas</h2>
            <p>Ett tekniskt fel uppstod. Försök att ladda om sidan.</p>
            
            {this.state.errorCount < 3 && (
              <p className="retry-message">Försöker igen automatiskt...</p>
            )}
            
            <button 
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              Ladda om sidan
            </button>
            
            {import.meta.env.VITE_NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Teknisk information</summary>
                <pre>{this.state.error && this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Common PixiJS Errors och Solutions

```javascript
/**
 * PixiJS Error Handler - Vanliga fel och lösningar
 */
export const pixiErrorHandler = {
  handleError(error, context) {
    console.error(`PixiJS Error in ${context}:`, error);
    
    // WebGL Context Lost
    if (error.message.includes('WebGL context lost')) {
      this.handleContextLost();
      return;
    }
    
    // Texture Loading Failed
    if (error.message.includes('Failed to load texture')) {
      this.handleTextureError(error);
      return;
    }
    
    // Memory Issues
    if (error.message.includes('out of memory')) {
      this.handleMemoryError();
      return;
    }
    
    // Generic handler
    this.handleGenericError(error, context);
  },
  
  handleContextLost() {
    console.log('WebGL context lost - attempting recovery');
    
    // Clear all PIXI caches
    PIXI.utils.clearTextureCache();
    
    // Reload page efter delay
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  },
  
  handleTextureError(error) {
    console.log('Texture loading failed:', error);
    
    // Use fallback texture
    const fallbackTexture = PIXI.Texture.from('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    return fallbackTexture;
  },
  
  handleMemoryError() {
    console.log('Memory error - clearing caches');
    
    // Clear texture cache
    PIXI.utils.clearTextureCache();
    
    // Force garbage collection om available
    if (window.gc) {
      window.gc();
    }
  },
  
  handleGenericError(error, context) {
    // Log för debugging
    console.error('Unhandled PixiJS error:', {
      error,
      context,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }
};
```

---

## Testing

### Testing PixiJS Components

```javascript
/**
 * PixiJS Test Utilities
 */
import { render, waitFor } from '@testing-library/react';
import * as PIXI from 'pixi.js';

// Mock PIXI för testing
jest.mock('pixi.js', () => ({
  Application: jest.fn(() => ({
    view: document.createElement('canvas'),
    stage: {
      addChild: jest.fn(),
      removeChild: jest.fn(),
      children: []
    },
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      stop: jest.fn()
    },
    renderer: {
      resize: jest.fn(),
      resolution: 1
    },
    destroy: jest.fn()
  })),
  Container: jest.fn(() => ({
    addChild: jest.fn(),
    removeChild: jest.fn(),
    removeChildren: jest.fn(),
    children: []
  })),
  Graphics: jest.fn(() => ({
    beginFill: jest.fn(),
    drawRect: jest.fn(),
    endFill: jest.fn(),
    clear: jest.fn()
  })),
  Text: jest.fn(() => ({
    text: '',
    style: {}
  })),
  Sprite: jest.fn(() => ({
    x: 0,
    y: 0,
    anchor: { set: jest.fn() }
  })),
  Texture: {
    from: jest.fn(() => ({})),
    WHITE: {}
  },
  Loader: jest.fn(() => ({
    add: jest.fn().mockReturnThis(),
    load: jest.fn(cb => cb({}, {})),
    onProgress: { add: jest.fn() },
    onError: { add: jest.fn() }
  })),
  utils: {
    clearTextureCache: jest.fn()
  }
}));

// Test helper functions
export const pixiTestUtils = {
  async renderPixiComponent(Component, props = {}) {
    const result = render(<Component {...props} />);
    
    // Wait för PIXI initialization
    await waitFor(() => {
      expect(PIXI.Application).toHaveBeenCalled();
    });
    
    return result;
  },
  
  createMockPixiApp() {
    return new PIXI.Application();
  },
  
  createMockGameInstance(overrides = {}) {
    return {
      start: jest.fn().mockResolvedValue(true),
      destroy: jest.fn(),
      update: jest.fn(),
      handleResize: jest.fn(),
      onStateChange: jest.fn(),
      ...overrides
    };
  },
  
  expectCleanup(wrapper) {
    const { unmount } = wrapper;
    unmount();
    
    // Verify cleanup was called
    expect(PIXI.Application.mock.results[0].value.destroy).toHaveBeenCalled();
  }
};

// Example test
describe('GameCanvasWrapper', () => {
  it('should initialize PixiJS application', async () => {
    const mockGameClass = jest.fn(() => pixiTestUtils.createMockGameInstance());
    
    await pixiTestUtils.renderPixiComponent(GameCanvasWrapper, {
      pixiGameClass: mockGameClass,
      initialData: { test: true },
      onGameComplete: jest.fn()
    });
    
    expect(PIXI.Application).toHaveBeenCalledWith(
      expect.objectContaining({
        antialias: true,
        resolution: expect.any(Number)
      })
    );
    
    expect(mockGameClass).toHaveBeenCalled();
  });
  
  it('should cleanup on unmount', async () => {
    const mockGameClass = jest.fn(() => pixiTestUtils.createMockGameInstance());
    
    const wrapper = await pixiTestUtils.renderPixiComponent(GameCanvasWrapper, {
      pixiGameClass: mockGameClass
    });
    
    pixiTestUtils.expectCleanup(wrapper);
  });
});
```

### Integration Testing

```javascript
/**
 * Integration test för complete game flow
 */
describe('Puzzle Game Integration', () => {
  let gameWrapper;
  let mockOnComplete;
  
  beforeEach(async () => {
    mockOnComplete = jest.fn();
    
    gameWrapper = await pixiTestUtils.renderPixiComponent(GameCanvasWrapper, {
      pixiGameClass: PuzzleGamePixi,
      initialData: {
        budget: 100,
        dataSources: mockGameContent.puzzleGame.dataSources
      },
      onGameComplete: mockOnComplete
    });
  });
  
  afterEach(() => {
    gameWrapper.unmount();
  });
  
  it('should complete game flow', async () => {
    // Get game instance
    const gameInstance = PuzzleGamePixi.mock.results[0].value;
    
    // Simulate game completion
    gameInstance.completeGame({
      success: true,
      budgetSpent: 50,
      movesMade: 10
    });
    
    // Verify completion callback
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          budgetSpent: 50,
          movesMade: 10
        })
      );
    });
  });
});
```

---

## Deployment

### Production Build Optimization

```javascript
// vite.config.js additions för PixiJS
export default defineConfig({
  // ... other config
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate PixiJS för caching
          'pixi': ['pixi.js'],
          'game-engine': [
            '/src/pixi/BasePixiGame.js',
            '/src/pixi/GameCanvasWrapper.jsx'
          ]
        }
      }
    }
  },
  
  // PixiJS specific optimizations
  optimizeDeps: {
    include: ['pixi.js'],
    esbuildOptions: {
      target: 'es2020'
    }
  }
});
```

### Production Checklist

1. **Asset Optimization**
   - [ ] All images compressed och i rätt format (WebP/PNG)
   - [ ] Texture atlases created för sprite batching
   - [ ] Audio files compressed och i web-friendly format
   - [ ] Asset manifests med correct priorities

2. **Performance Verification**
   - [ ] Test på low-end devices (30+ FPS)
   - [ ] Memory usage under 200MB
   - [ ] No memory leaks efter extended play
   - [ ] Smooth transitions mellan games

3. **Error Handling**
   - [ ] All error boundaries implemented
   - [ ] Fallback UI för WebGL failures
   - [ ] Graceful degradation för slow devices
   - [ ] Error logging till monitoring service

4. **Browser Compatibility**
   - [ ] Chrome/Edge (latest 2 versions)
   - [ ] Firefox (latest 2 versions)
   - [ ] Safari (latest 2 versions)
   - [ ] Mobile browsers (iOS Safari, Chrome Android)

---

## Troubleshooting Guide

### Vanliga Problem och Lösningar

1. **"WebGL context lost" errors**
   - Orsak: GPU driver crash eller memory issues
   - Lösning: Implement context restoration, clear caches

2. **Memory leaks vid game switching**
   - Orsak: PIXI objects not properly destroyed
   - Lösning: Verify cleanup() sequence, use Chrome DevTools

3. **Poor performance på mobile**
   - Orsak: Too many draw calls eller large textures
   - Lösning: Use texture atlases, reduce particle counts

4. **Touch input not working**
   - Orsak: Wrong event types eller CSS touch-action
   - Lösning: Use pointer events, set touch-action: none

5. **Assets failing to load**
   - Orsak: CORS issues eller network problems
   - Lösning: Configure CORS headers, implement retry logic

### Debug Tools

```javascript
// Enable PIXI debugging i development
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  // Expose PIXI globally
  window.PIXI = PIXI;
  
  // Enable PIXI dev tools
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__ = {
    register: (pixi) => {
      console.log('PIXI DevTools enabled');
    }
  };
  
  // Add FPS meter
  const stats = new Stats();
  document.body.appendChild(stats.dom);
  requestAnimationFrame(function loop() {
    stats.update();
    requestAnimationFrame(loop);
  });
}
```

---

## Sammanfattning

Denna guide innehåller all kritisk kunskap för att framgångsrikt integrera PixiJS i Framtidsbygget. Genom att följa dessa patterns och best practices kan AI-utvecklare implementera komplexa spelmekaniker utan djup PixiJS-kunskap.

**Kom ihåg:**
- ALLTID följ cleanup sequence i GameCanvasWrapper
- ALLTID använd StateBridge för state sync
- ALLTID test på actual devices, inte bara desktop
- ALDRIG skip error handling - educational environments är oförutsägbara

För ytterligare hjälp, se [PixiJS Risk Analysis](./pixi-risk-analysis.md) och [Game Implementation Patterns](./game-implementation-patterns.md).