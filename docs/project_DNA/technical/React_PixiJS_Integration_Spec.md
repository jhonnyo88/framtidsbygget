# React-PixiJS Integration Specification - Framtidsbygget

**Version:** 1.0  
**Status:** Technical Contract Document  
**Purpose:** Complete specification for React-PixiJS integration architecture

---

## Executive Summary

This document defines the technical contract for integrating PixiJS games within the React-based Framtidsbygget educational platform. It serves as the authoritative reference for all integration patterns, data flow protocols, and lifecycle management requirements.

## Table of Contents

1. [GameCanvasWrapper Technical Contract](#gamecanvaswrapper-technical-contract)
2. [State Synchronization Protocol](#state-synchronization-protocol)
3. [Event Handling Architecture](#event-handling-architecture)
4. [Lifecycle Management](#lifecycle-management)
5. [Mobile Optimization Requirements](#mobile-optimization-requirements)
6. [Performance Contracts](#performance-contracts)
7. [Error Boundaries](#error-boundaries)

---

## GameCanvasWrapper Technical Contract

### Component Interface
```typescript
interface GameCanvasWrapperProps {
  // Required
  gameType: 'puzzle' | 'crisis' | 'competence' | 'ecosystem';
  
  // Optional with defaults
  initialState?: GameState;
  width?: number;  // Default: 100% of parent
  height?: number; // Default: 600px
  
  // Callbacks
  onReady?: (gameInstance: BasePixiGame) => void;
  onStateChange?: (newState: Partial<GameState>) => void;
  onError?: (error: GameError) => void;
  onSave?: (state: GameState) => void;
  onPerformanceWarning?: (metrics: PerformanceMetrics) => void;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
  
  // Advanced
  performanceProfile?: 'auto' | 'high' | 'medium' | 'low';
  fallbackComponent?: React.ReactElement;
  debugMode?: boolean;
}
```

### Required Behaviors

#### 1. Mounting Behavior
```javascript
// SPECIFICATION: GameCanvasWrapper mounting sequence
class GameCanvasWrapper {
  componentDidMount() {
    // 1. Validate container dimensions
    assert(this.canvasRef.current.offsetWidth > 0, "Container must have width");
    assert(this.canvasRef.current.offsetHeight > 0, "Container must have height");
    
    // 2. Create PIXI application
    // Must happen synchronously to avoid race conditions
    this.createPixiApp();
    
    // 3. Load game module
    // Can be async but must handle unmount during load
    this.loadGameModule().then(() => {
      if (!this.mounted) return;
      
      // 4. Initialize game
      this.initializeGame();
      
      // 5. Notify parent
      this.props.onReady?.(this.gameInstance);
    });
  }
}
```

#### 2. Unmounting Behavior
```javascript
// SPECIFICATION: Cleanup must be comprehensive
componentWillUnmount() {
  this.mounted = false;
  
  // Order is critical:
  // 1. Stop all active processes
  this.pauseGame();
  
  // 2. Save state
  this.saveProgress();
  
  // 3. Remove event listeners
  this.removeEventListeners();
  
  // 4. Destroy game instance
  this.gameInstance?.destroy();
  
  // 5. Destroy PIXI app
  this.pixiApp?.destroy(true, {
    children: true,
    texture: true,
    baseTexture: true
  });
  
  // 6. Clear DOM
  this.canvasRef.current.innerHTML = '';
}
```

### Canvas Sizing Contract

```javascript
// SPECIFICATION: Responsive canvas sizing
const CanvasSizing = {
  // Default dimensions
  defaults: {
    minWidth: 320,
    maxWidth: 1920,
    minHeight: 480,
    maxHeight: 1080,
    aspectRatio: 4/3
  },
  
  // Calculation method
  calculateDimensions(container) {
    const { offsetWidth, offsetHeight } = container;
    
    // Respect container bounds
    let width = Math.min(offsetWidth, this.defaults.maxWidth);
    let height = Math.min(offsetHeight, this.defaults.maxHeight);
    
    // Maintain aspect ratio if needed
    if (this.maintainAspectRatio) {
      const containerRatio = width / height;
      if (containerRatio > this.defaults.aspectRatio) {
        width = height * this.defaults.aspectRatio;
      } else {
        height = width / this.defaults.aspectRatio;
      }
    }
    
    return {
      width: Math.max(width, this.defaults.minWidth),
      height: Math.max(height, this.defaults.minHeight)
    };
  }
};
```

---

## State Synchronization Protocol

### State Flow Specification
```
React State (Source of Truth)
     ↓ Props
GameCanvasWrapper
     ↓ StateBridge
PixiJS Game Instance
     ↓ Events
StateBridge
     ↓ Callbacks
React State (Updates)
```

### State Update Contract

```typescript
interface StateUpdateProtocol {
  // From React to PixiJS
  updatePixiState(updates: Partial<GameState>): void;
  
  // From PixiJS to React
  handlePixiUpdate(updates: Partial<GameState>): void;
  
  // Validation
  validateUpdate(updates: unknown): Partial<GameState>;
  
  // Batching
  batchUpdates: boolean;
  batchDelay: number; // milliseconds
}
```

### Synchronization Rules

#### 1. Immediate Updates (No Batching)
```javascript
const IMMEDIATE_KEYS = [
  'gameOver',
  'paused',
  'score',        // User-visible score
  'criticalError'
];

// These updates bypass batching
if (IMMEDIATE_KEYS.includes(updateKey)) {
  this.applyImmediately(update);
}
```

#### 2. Batched Updates (Performance)
```javascript
const BATCHED_KEYS = [
  'mousePosition',
  'hoverState',
  'animationFrame',
  'particleCount'
];

// These updates are batched per frame
if (BATCHED_KEYS.includes(updateKey)) {
  this.batchUpdate(update);
}
```

#### 3. Validated Updates (Data Integrity)
```javascript
const VALIDATED_SCHEMA = {
  puzzle: {
    connections: (val) => Array.isArray(val) && val.every(isValidConnection),
    budget: (val) => typeof val === 'number' && val >= 0,
    moves: (val) => Number.isInteger(val) && val >= 0
  }
};

// All updates must pass validation
const validated = this.validateAgainstSchema(update, VALIDATED_SCHEMA);
```

---

## Event Handling Architecture

### Event Flow Specification

```javascript
// SPECIFICATION: Bidirectional event system
class EventProtocol {
  // React → PixiJS Events
  static REACT_TO_PIXI = {
    'user.action': 'pixi.execute',
    'state.reset': 'pixi.reset',
    'game.pause': 'pixi.pause',
    'game.resume': 'pixi.resume'
  };
  
  // PixiJS → React Events
  static PIXI_TO_REACT = {
    'game.stateChange': 'react.updateState',
    'game.complete': 'react.onComplete',
    'game.error': 'react.onError',
    'game.achievement': 'react.onAchievement'
  };
}
```

### Input Handling Contract

```javascript
// SPECIFICATION: Unified input handling
class InputHandler {
  constructor(pixiApp) {
    this.app = pixiApp;
    this.inputQueue = [];
    
    // Normalize all input types
    this.setupMouseHandlers();
    this.setupTouchHandlers();
    this.setupKeyboardHandlers();
  }
  
  // Mouse and touch events are normalized
  normalizePointerEvent(event) {
    const rect = this.app.view.getBoundingClientRect();
    return {
      type: event.type,
      x: (event.clientX - rect.left) / rect.width * this.app.screen.width,
      y: (event.clientY - rect.top) / rect.height * this.app.screen.height,
      pressure: event.pressure || 1,
      pointerId: event.pointerId || 0
    };
  }
  
  // Keyboard events include game context
  normalizeKeyboardEvent(event) {
    return {
      type: event.type,
      key: event.key,
      code: event.code,
      gameContext: this.getCurrentGameContext(),
      prevented: false
    };
  }
}
```

### Custom Event Specifications

```javascript
// SPECIFICATION: Custom events for game communication
const CUSTOM_EVENTS = {
  // Game state events
  GAME_STATE_CHANGED: 'framtidsbygget:stateChanged',
  GAME_SCORE_UPDATED: 'framtidsbygget:scoreUpdated',
  GAME_COMPLETED: 'framtidsbygget:gameCompleted',
  
  // Achievement events
  ACHIEVEMENT_UNLOCKED: 'framtidsbygget:achievementUnlocked',
  SYNERGY_DISCOVERED: 'framtidsbygget:synergyDiscovered',
  
  // Performance events
  PERFORMANCE_WARNING: 'framtidsbygget:performanceWarning',
  MEMORY_PRESSURE: 'framtidsbygget:memoryPressure',
  
  // Error events
  CRITICAL_ERROR: 'framtidsbygget:criticalError',
  RECOVERABLE_ERROR: 'framtidsbygget:recoverableError'
};

// Event payload specifications
interface GameEventPayload {
  timestamp: number;
  gameType: string;
  gameId: string;
  data: unknown;
  metadata?: {
    userId?: string;
    sessionId: string;
    platform: string;
  };
}
```

---

## Lifecycle Management

### Game Lifecycle States

```typescript
enum GameLifecycleState {
  UNINITIALIZED = 'uninitialized',
  LOADING = 'loading',
  READY = 'ready',
  PLAYING = 'playing',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ERROR = 'error',
  DESTROYED = 'destroyed'
}
```

### State Transition Rules

```javascript
// SPECIFICATION: Valid state transitions
const VALID_TRANSITIONS = {
  [GameLifecycleState.UNINITIALIZED]: [GameLifecycleState.LOADING],
  [GameLifecycleState.LOADING]: [GameLifecycleState.READY, GameLifecycleState.ERROR],
  [GameLifecycleState.READY]: [GameLifecycleState.PLAYING],
  [GameLifecycleState.PLAYING]: [GameLifecycleState.PAUSED, GameLifecycleState.COMPLETED, GameLifecycleState.ERROR],
  [GameLifecycleState.PAUSED]: [GameLifecycleState.PLAYING, GameLifecycleState.DESTROYED],
  [GameLifecycleState.COMPLETED]: [GameLifecycleState.DESTROYED],
  [GameLifecycleState.ERROR]: [GameLifecycleState.DESTROYED]
};

// Validate transitions
function canTransition(from: GameLifecycleState, to: GameLifecycleState): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) || false;
}
```

### Memory Management Contract

```javascript
// SPECIFICATION: Memory lifecycle hooks
class MemoryManagement {
  // Called when memory pressure detected
  onMemoryPressure(severity: 'low' | 'medium' | 'high') {
    switch(severity) {
      case 'low':
        this.reduceParticleCount();
        this.disableNonEssentialEffects();
        break;
      case 'medium':
        this.unloadUnusedTextures();
        this.reduceRenderResolution();
        break;
      case 'high':
        this.enterMinimalMode();
        this.notifyUser();
        break;
    }
  }
  
  // Texture management
  unloadUnusedTextures() {
    const textureCache = PIXI.utils.TextureCache;
    const unusedTextures = this.findUnusedTextures();
    
    unusedTextures.forEach(key => {
      const texture = textureCache[key];
      texture.destroy(true);
      delete textureCache[key];
    });
  }
  
  // Monitor memory usage
  getMemoryMetrics() {
    return {
      textureCount: Object.keys(PIXI.utils.TextureCache).length,
      displayObjects: this.countDisplayObjects(),
      estimatedMemory: this.estimateMemoryUsage(),
      available: performance.memory?.jsHeapSizeLimit
    };
  }
}
```

---

## Mobile Optimization Requirements

### Touch Handling Specification

```javascript
// SPECIFICATION: Touch event handling
class TouchSpecification {
  static TOUCH_REQUIREMENTS = {
    minTouchSize: 44, // pixels (WCAG standard)
    doubleTapDelay: 300, // milliseconds
    longPressDelay: 500, // milliseconds
    swipeThreshold: 50, // pixels
    pinchThreshold: 0.1 // scale factor
  };
  
  // Touch target sizing
  static ensureTouchTargets(displayObject) {
    const bounds = displayObject.getBounds();
    const width = bounds.width;
    const height = bounds.height;
    
    if (width < this.TOUCH_REQUIREMENTS.minTouchSize || 
        height < this.TOUCH_REQUIREMENTS.minTouchSize) {
      // Add invisible hit area
      displayObject.hitArea = new PIXI.Rectangle(
        -(this.TOUCH_REQUIREMENTS.minTouchSize - width) / 2,
        -(this.TOUCH_REQUIREMENTS.minTouchSize - height) / 2,
        this.TOUCH_REQUIREMENTS.minTouchSize,
        this.TOUCH_REQUIREMENTS.minTouchSize
      );
    }
  }
}
```

### Responsive Scaling Contract

```javascript
// SPECIFICATION: Device-aware scaling
class ResponsiveScaling {
  static getOptimalScale(deviceProfile) {
    const profiles = {
      desktop: { scale: 1, dpi: 1 },
      tablet: { scale: 0.85, dpi: 2 },
      mobile: { scale: 0.7, dpi: 3 }
    };
    
    return profiles[deviceProfile] || profiles.desktop;
  }
  
  static applyScaling(app, profile) {
    const { scale, dpi } = this.getOptimalScale(profile);
    
    // Scale stage
    app.stage.scale.set(scale);
    
    // Adjust resolution
    app.renderer.resolution = Math.min(dpi, window.devicePixelRatio || 1);
    
    // Update projection
    app.renderer.resize(
      app.screen.width,
      app.screen.height
    );
  }
}
```

---

## Performance Contracts

### Performance Requirements

```javascript
// SPECIFICATION: Performance thresholds
const PERFORMANCE_REQUIREMENTS = {
  desktop: {
    targetFPS: 60,
    minFPS: 45,
    maxMemory: 400 * 1024 * 1024, // 400MB
    maxLoadTime: 3000 // 3 seconds
  },
  tablet: {
    targetFPS: 30,
    minFPS: 24,
    maxMemory: 200 * 1024 * 1024, // 200MB
    maxLoadTime: 5000 // 5 seconds
  },
  mobile: {
    targetFPS: 30,
    minFPS: 20,
    maxMemory: 150 * 1024 * 1024, // 150MB
    maxLoadTime: 8000 // 8 seconds
  }
};
```

### Performance Monitoring Contract

```javascript
// SPECIFICATION: Continuous performance monitoring
class PerformanceMonitor {
  constructor(app, requirements) {
    this.app = app;
    this.requirements = requirements;
    this.metrics = {
      fps: [],
      memory: [],
      drawCalls: []
    };
  }
  
  startMonitoring() {
    // FPS monitoring
    this.app.ticker.add(() => {
      const fps = this.app.ticker.FPS;
      this.metrics.fps.push(fps);
      
      // Keep last 60 frames
      if (this.metrics.fps.length > 60) {
        this.metrics.fps.shift();
      }
      
      // Check thresholds
      const avgFPS = this.getAverageFPS();
      if (avgFPS < this.requirements.minFPS) {
        this.handlePerformanceIssue('fps', avgFPS);
      }
    });
    
    // Memory monitoring (every 5 seconds)
    setInterval(() => {
      if (performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        this.metrics.memory.push(used);
        
        if (used > this.requirements.maxMemory) {
          this.handlePerformanceIssue('memory', used);
        }
      }
    }, 5000);
  }
  
  handlePerformanceIssue(type, value) {
    const event = new CustomEvent(CUSTOM_EVENTS.PERFORMANCE_WARNING, {
      detail: {
        type,
        value,
        threshold: this.requirements[type],
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }
}
```

---

## Error Boundaries

### Error Handling Contract

```javascript
// SPECIFICATION: Comprehensive error handling
class GameErrorBoundary {
  static ERROR_TYPES = {
    INITIALIZATION: 'initialization_error',
    RUNTIME: 'runtime_error',
    RESOURCE: 'resource_error',
    STATE: 'state_error',
    NETWORK: 'network_error'
  };
  
  static ERROR_SEVERITY = {
    LOW: 'low',      // Log only
    MEDIUM: 'medium', // Show warning
    HIGH: 'high',    // Pause game
    CRITICAL: 'critical' // Fallback mode
  };
  
  static handleError(error, context) {
    const errorInfo = this.classifyError(error);
    
    switch(errorInfo.severity) {
      case this.ERROR_SEVERITY.LOW:
        console.warn('[Game Error]', errorInfo);
        break;
        
      case this.ERROR_SEVERITY.MEDIUM:
        this.showWarningToUser(errorInfo);
        break;
        
      case this.ERROR_SEVERITY.HIGH:
        this.pauseGameWithError(errorInfo);
        break;
        
      case this.ERROR_SEVERITY.CRITICAL:
        this.enterFallbackMode(errorInfo);
        break;
    }
    
    // Always report to monitoring
    this.reportError(errorInfo);
  }
  
  static classifyError(error) {
    // WebGL context loss
    if (error.message?.includes('WebGL')) {
      return {
        type: this.ERROR_TYPES.RUNTIME,
        severity: this.ERROR_SEVERITY.HIGH,
        recoverable: true,
        action: 'restore_context'
      };
    }
    
    // Resource loading failure
    if (error.message?.includes('404') || error.message?.includes('load')) {
      return {
        type: this.ERROR_TYPES.RESOURCE,
        severity: this.ERROR_SEVERITY.MEDIUM,
        recoverable: true,
        action: 'retry_load'
      };
    }
    
    // State corruption
    if (error.message?.includes('state') || error.message?.includes('undefined')) {
      return {
        type: this.ERROR_TYPES.STATE,
        severity: this.ERROR_SEVERITY.HIGH,
        recoverable: false,
        action: 'reset_state'
      };
    }
    
    // Default
    return {
      type: this.ERROR_TYPES.RUNTIME,
      severity: this.ERROR_SEVERITY.MEDIUM,
      recoverable: true,
      action: 'log_continue'
    };
  }
}
```

### Recovery Strategies

```javascript
// SPECIFICATION: Error recovery procedures
const RECOVERY_STRATEGIES = {
  restore_context: async (game) => {
    // Attempt to restore WebGL context
    await game.renderer.reset();
    await game.reloadTextures();
    game.resume();
  },
  
  retry_load: async (game, resource) => {
    // Retry with exponential backoff
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await game.loadResource(resource);
        return true;
      } catch (e) {
        attempts++;
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    }
    return false;
  },
  
  reset_state: (game) => {
    // Reset to last known good state
    const checkpoint = game.getLastCheckpoint();
    game.restoreFromCheckpoint(checkpoint);
  },
  
  fallback_mode: (game) => {
    // Switch to static/simplified version
    game.enterStaticMode();
  }
};
```

---

## Appendix: Integration Checklist

### Pre-Integration Checklist
- [ ] React 18+ installed
- [ ] PixiJS 7+ installed
- [ ] TypeScript configured (optional but recommended)
- [ ] Build system supports dynamic imports
- [ ] Performance monitoring tools available

### Integration Steps
1. [ ] Implement GameCanvasWrapper
2. [ ] Setup StateBridge
3. [ ] Configure error boundaries
4. [ ] Add performance monitoring
5. [ ] Test on target devices
6. [ ] Verify memory management
7. [ ] Validate accessibility

### Post-Integration Validation
- [ ] All lifecycle transitions work correctly
- [ ] State synchronization is bidirectional
- [ ] No memory leaks after extended play
- [ ] Performance meets requirements
- [ ] Mobile touch targets are adequate
- [ ] Error recovery works as specified

---

*Last Updated: 2025-06-20*  
*Specification Version: 1.0*  
*For Framtidsbygget Educational Platform*