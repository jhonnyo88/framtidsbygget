# Game State Bridge API - Framtidsbygget

**Version:** 1.0  
**Status:** Production API Specification  
**Purpose:** Complete API documentation for React-PixiJS state communication

---

## Executive Summary

The Game State Bridge provides a robust, bidirectional communication layer between React components and PixiJS game instances. This document specifies the exact API, event protocols, and integration patterns for seamless state synchronization.

## Table of Contents

1. [API Overview](#api-overview)
2. [React-PixiJS Communication Protocol](#react-pixijs-communication-protocol)
3. [Event System Architecture](#event-system-architecture)
4. [State Validation Framework](#state-validation-framework)
5. [Performance Optimization](#performance-optimization)
6. [Integration Examples](#integration-examples)

---

## API Overview

### Core Bridge Components

```typescript
// Type definitions for the bridge system
interface GameStateBridge {
  // Core methods
  initialize(gameInstance: BasePixiGame, initialState: GameState): void;
  updateFromReact(updates: Partial<GameState>): void;
  updateFromPixi(updates: Partial<GameState>): void;
  getState(): GameState;
  destroy(): void;
  
  // Event handling
  on(event: BridgeEvent, handler: EventHandler): UnsubscribeFn;
  emit(event: BridgeEvent, data?: any): void;
  
  // Performance
  getMetrics(): BridgeMetrics;
  enableDebugMode(): void;
}

interface BridgeConfig {
  batchUpdates: boolean;
  batchDelay: number;
  validateUpdates: boolean;
  debugMode: boolean;
  performanceTracking: boolean;
}

type BridgeEvent = 
  | 'state:updated'
  | 'state:synced'
  | 'validation:error'
  | 'performance:warning'
  | 'bridge:ready'
  | 'bridge:destroyed';
```

### Bridge Implementation

```javascript
/**
 * GameStateBridge.js - Production implementation
 */
import EventEmitter from 'eventemitter3';

class GameStateBridge extends EventEmitter {
  constructor(config = {}) {
    super();
    
    // Configuration
    this.config = {
      batchUpdates: true,
      batchDelay: 16, // One frame at 60fps
      validateUpdates: true,
      debugMode: false,
      performanceTracking: true,
      ...config
    };
    
    // State management
    this.reactState = {};
    this.pixiState = {};
    this.pendingUpdates = {
      fromReact: [],
      fromPixi: []
    };
    
    // References
    this.gameInstance = null;
    this.updateTimer = null;
    
    // Performance tracking
    this.metrics = {
      updateCount: 0,
      syncCount: 0,
      averageUpdateTime: 0,
      lastSyncTime: null,
      errors: 0
    };
    
    // Validation schemas
    this.validators = new Map();
    this.setupDefaultValidators();
  }
  
  /**
   * Initialize the bridge with a game instance
   */
  initialize(gameInstance, initialState = {}) {
    if (this.gameInstance) {
      console.warn('Bridge already initialized, destroying previous instance');
      this.destroy();
    }
    
    this.gameInstance = gameInstance;
    this.reactState = { ...initialState };
    this.pixiState = { ...initialState };
    
    // Setup game instance methods
    this.attachGameMethods();
    
    // Start update loop
    if (this.config.batchUpdates) {
      this.startBatchProcessor();
    }
    
    this.emit('bridge:ready', { gameInstance, initialState });
    
    if (this.config.debugMode) {
      console.log('[Bridge] Initialized with state:', initialState);
    }
  }
  
  /**
   * Attach bridge methods to game instance
   */
  attachGameMethods() {
    if (!this.gameInstance) return;
    
    // Provide state update method to game
    this.gameInstance.updateState = (updates) => {
      this.updateFromPixi(updates);
    };
    
    // Provide state getter
    this.gameInstance.getState = () => {
      return { ...this.pixiState };
    };
    
    // Listen to game events
    if (this.gameInstance.on) {
      this.gameInstance.on('stateChange', (updates) => {
        this.updateFromPixi(updates);
      });
      
      this.gameInstance.on('error', (error) => {
        this.handleError('game_error', error);
      });
    }
  }
  
  /**
   * Update state from React
   */
  updateFromReact(updates) {
    if (!updates || typeof updates !== 'object') {
      console.error('[Bridge] Invalid updates from React:', updates);
      return;
    }
    
    const startTime = performance.now();
    
    try {
      // Validate updates
      if (this.config.validateUpdates) {
        const validation = this.validateUpdates(updates, 'react');
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }
      
      // Add to pending updates
      if (this.config.batchUpdates) {
        this.pendingUpdates.fromReact.push({
          updates,
          timestamp: Date.now()
        });
      } else {
        this.applyUpdates(updates, 'react');
      }
      
      // Track metrics
      if (this.config.performanceTracking) {
        const duration = performance.now() - startTime;
        this.updateMetrics('update', duration);
      }
      
    } catch (error) {
      this.handleError('update_from_react', error);
    }
  }
  
  /**
   * Update state from PixiJS
   */
  updateFromPixi(updates) {
    if (!updates || typeof updates !== 'object') {
      console.error('[Bridge] Invalid updates from PixiJS:', updates);
      return;
    }
    
    const startTime = performance.now();
    
    try {
      // Validate updates
      if (this.config.validateUpdates) {
        const validation = this.validateUpdates(updates, 'pixi');
        if (!validation.valid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }
      }
      
      // Add to pending updates
      if (this.config.batchUpdates) {
        this.pendingUpdates.fromPixi.push({
          updates,
          timestamp: Date.now()
        });
      } else {
        this.applyUpdates(updates, 'pixi');
      }
      
      // Track metrics
      if (this.config.performanceTracking) {
        const duration = performance.now() - startTime;
        this.updateMetrics('update', duration);
      }
      
    } catch (error) {
      this.handleError('update_from_pixi', error);
    }
  }
  
  /**
   * Apply updates to state
   */
  applyUpdates(updates, source) {
    const previousState = source === 'react' ? { ...this.reactState } : { ...this.pixiState };
    
    // Update appropriate state
    if (source === 'react') {
      Object.assign(this.reactState, updates);
      // Sync to PixiJS
      if (this.gameInstance && this.gameInstance.onStateUpdate) {
        this.gameInstance.onStateUpdate(updates);
      }
    } else {
      Object.assign(this.pixiState, updates);
    }
    
    // Emit update event
    this.emit('state:updated', {
      source,
      updates,
      previousState,
      newState: source === 'react' ? this.reactState : this.pixiState
    });
    
    if (this.config.debugMode) {
      console.log(`[Bridge] State updated from ${source}:`, updates);
    }
  }
  
  /**
   * Batch processor for updates
   */
  startBatchProcessor() {
    const processBatch = () => {
      const hasReactUpdates = this.pendingUpdates.fromReact.length > 0;
      const hasPixiUpdates = this.pendingUpdates.fromPixi.length > 0;
      
      if (!hasReactUpdates && !hasPixiUpdates) {
        this.updateTimer = requestAnimationFrame(processBatch);
        return;
      }
      
      const startTime = performance.now();
      
      // Process React updates
      if (hasReactUpdates) {
        const reactBatch = this.mergeBatchedUpdates(this.pendingUpdates.fromReact);
        this.pendingUpdates.fromReact = [];
        this.applyUpdates(reactBatch, 'react');
      }
      
      // Process PixiJS updates
      if (hasPixiUpdates) {
        const pixiBatch = this.mergeBatchedUpdates(this.pendingUpdates.fromPixi);
        this.pendingUpdates.fromPixi = [];
        this.applyUpdates(pixiBatch, 'pixi');
      }
      
      // Sync states if needed
      this.synchronizeStates();
      
      // Track performance
      if (this.config.performanceTracking) {
        const duration = performance.now() - startTime;
        this.updateMetrics('batch', duration);
        
        if (duration > 16) { // Longer than one frame
          this.emit('performance:warning', {
            type: 'slow_batch',
            duration,
            reactUpdates: hasReactUpdates,
            pixiUpdates: hasPixiUpdates
          });
        }
      }
      
      this.updateTimer = requestAnimationFrame(processBatch);
    };
    
    this.updateTimer = requestAnimationFrame(processBatch);
  }
  
  /**
   * Merge batched updates
   */
  mergeBatchedUpdates(batch) {
    const merged = {};
    
    batch.forEach(({ updates }) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (Array.isArray(value) && Array.isArray(merged[key])) {
          // Merge arrays (remove duplicates)
          merged[key] = [...new Set([...merged[key], ...value])];
        } else if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          // Deep merge objects
          merged[key] = { ...(merged[key] || {}), ...value };
        } else {
          // Simple assignment
          merged[key] = value;
        }
      });
    });
    
    return merged;
  }
  
  /**
   * Synchronize React and PixiJS states
   */
  synchronizeStates() {
    const diffs = this.findStateDifferences();
    
    if (diffs.length === 0) {
      return; // States are in sync
    }
    
    // Resolve differences based on timestamp or priority
    diffs.forEach(({ key, reactValue, pixiValue }) => {
      // Default strategy: React wins for UI state, PixiJS wins for game state
      if (this.isUIState(key)) {
        this.pixiState[key] = reactValue;
        if (this.gameInstance?.onStateUpdate) {
          this.gameInstance.onStateUpdate({ [key]: reactValue });
        }
      } else {
        this.reactState[key] = pixiValue;
      }
    });
    
    this.emit('state:synced', {
      differences: diffs,
      reactState: this.reactState,
      pixiState: this.pixiState
    });
    
    this.metrics.syncCount++;
    this.metrics.lastSyncTime = Date.now();
  }
  
  /**
   * Find differences between states
   */
  findStateDifferences() {
    const diffs = [];
    const allKeys = new Set([
      ...Object.keys(this.reactState),
      ...Object.keys(this.pixiState)
    ]);
    
    allKeys.forEach(key => {
      const reactValue = this.reactState[key];
      const pixiValue = this.pixiState[key];
      
      if (!this.deepEqual(reactValue, pixiValue)) {
        diffs.push({ key, reactValue, pixiValue });
      }
    });
    
    return diffs;
  }
  
  /**
   * Deep equality check
   */
  deepEqual(a, b) {
    if (a === b) return true;
    
    if (a == null || b == null) return false;
    
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      return a.every((val, index) => this.deepEqual(val, b[index]));
    }
    
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      return keysA.every(key => this.deepEqual(a[key], b[key]));
    }
    
    return false;
  }
  
  /**
   * Determine if a state key is UI-related
   */
  isUIState(key) {
    const uiStateKeys = [
      'modalOpen',
      'currentView',
      'selectedItem',
      'hoverState',
      'formData',
      'uiPreferences'
    ];
    
    return uiStateKeys.includes(key);
  }
  
  /**
   * Get current state
   */
  getState() {
    // Return merged state with React taking precedence for UI
    return {
      ...this.pixiState,
      ...this.reactState
    };
  }
  
  /**
   * Setup default validators
   */
  setupDefaultValidators() {
    // Score validator
    this.validators.set('score', (value) => {
      return typeof value === 'number' && value >= 0 && value <= 50000;
    });
    
    // World ID validator
    this.validators.set('worldId', (value) => {
      const validWorlds = ['puzzle', 'welfare', 'competence', 'connectivity', 'ecosystem'];
      return validWorlds.includes(value);
    });
    
    // Array validators
    this.validators.set('completedWorlds', (value) => {
      return Array.isArray(value) && value.length <= 5;
    });
    
    // Progress validator
    this.validators.set('progress', (value) => {
      return typeof value === 'number' && value >= 0 && value <= 100;
    });
  }
  
  /**
   * Validate state updates
   */
  validateUpdates(updates, source) {
    const errors = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      const validator = this.validators.get(key);
      
      if (validator && !validator(value)) {
        errors.push(`Invalid value for ${key}: ${JSON.stringify(value)}`);
      }
    });
    
    if (errors.length > 0) {
      this.emit('validation:error', {
        source,
        updates,
        errors
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  /**
   * Add custom validator
   */
  addValidator(key, validator) {
    if (typeof validator !== 'function') {
      throw new Error('Validator must be a function');
    }
    
    this.validators.set(key, validator);
  }
  
  /**
   * Update performance metrics
   */
  updateMetrics(type, duration) {
    this.metrics.updateCount++;
    
    // Update average
    const prevAvg = this.metrics.averageUpdateTime;
    const count = this.metrics.updateCount;
    this.metrics.averageUpdateTime = (prevAvg * (count - 1) + duration) / count;
    
    // Check performance threshold
    if (duration > 50) { // 50ms is concerning
      console.warn(`[Bridge] Slow ${type} operation: ${duration.toFixed(2)}ms`);
    }
  }
  
  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: this.metrics.lastSyncTime 
        ? Date.now() - this.metrics.lastSyncTime 
        : 0,
      health: this.calculateHealth()
    };
  }
  
  /**
   * Calculate bridge health
   */
  calculateHealth() {
    const factors = {
      performance: this.metrics.averageUpdateTime < 16 ? 1 : 0.5,
      errors: this.metrics.errors === 0 ? 1 : 0.5,
      sync: this.metrics.syncCount > 0 ? 1 : 0.5
    };
    
    const health = Object.values(factors).reduce((sum, val) => sum + val, 0) / 
                   Object.keys(factors).length;
    
    return {
      score: health,
      status: health > 0.8 ? 'healthy' : health > 0.5 ? 'degraded' : 'unhealthy',
      factors
    };
  }
  
  /**
   * Handle errors
   */
  handleError(type, error) {
    this.metrics.errors++;
    
    const errorInfo = {
      type,
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      state: {
        react: { ...this.reactState },
        pixi: { ...this.pixiState }
      }
    };
    
    console.error(`[Bridge] Error (${type}):`, error);
    
    this.emit('error', errorInfo);
    
    // Attempt recovery
    if (type === 'update_from_react' || type === 'update_from_pixi') {
      // Clear pending updates to prevent cascading errors
      this.pendingUpdates.fromReact = [];
      this.pendingUpdates.fromPixi = [];
    }
  }
  
  /**
   * Enable debug mode
   */
  enableDebugMode() {
    this.config.debugMode = true;
    
    // Add debug listeners
    this.on('state:updated', (data) => {
      console.log('[Bridge Debug] State updated:', data);
    });
    
    this.on('state:synced', (data) => {
      console.log('[Bridge Debug] States synchronized:', data);
    });
    
    this.on('validation:error', (data) => {
      console.log('[Bridge Debug] Validation error:', data);
    });
    
    // Add debug methods
    window.__bridge_debug = {
      getState: () => this.getState(),
      getMetrics: () => this.getMetrics(),
      forceSync: () => this.synchronizeStates(),
      clearErrors: () => { this.metrics.errors = 0; }
    };
  }
  
  /**
   * Destroy the bridge
   */
  destroy() {
    // Stop batch processor
    if (this.updateTimer) {
      cancelAnimationFrame(this.updateTimer);
      this.updateTimer = null;
    }
    
    // Clean up game instance
    if (this.gameInstance) {
      this.gameInstance.updateState = null;
      this.gameInstance.getState = null;
      this.gameInstance = null;
    }
    
    // Clear pending updates
    this.pendingUpdates.fromReact = [];
    this.pendingUpdates.fromPixi = [];
    
    // Remove all listeners
    this.removeAllListeners();
    
    // Clear debug
    if (window.__bridge_debug) {
      delete window.__bridge_debug;
    }
    
    this.emit('bridge:destroyed');
  }
}

export default GameStateBridge;
```

---

## React-PixiJS Communication Protocol

### Message Format

```typescript
interface BridgeMessage {
  id: string;
  source: 'react' | 'pixi';
  type: 'update' | 'query' | 'command';
  payload: any;
  timestamp: number;
  priority: 'low' | 'normal' | 'high' | 'critical';
}
```

### Communication Patterns

```javascript
/**
 * Communication patterns for different scenarios
 */

// Pattern 1: Simple State Update
class SimpleStateUpdate {
  static fromReact(bridge, updates) {
    bridge.updateFromReact({
      score: 1500,
      level: 2
    });
  }
  
  static fromPixi(gameInstance, updates) {
    gameInstance.updateState({
      playerPosition: { x: 100, y: 200 },
      enemies: []
    });
  }
}

// Pattern 2: Batch Updates
class BatchedUpdates {
  static collectAndSend(bridge, updates) {
    // Collect multiple updates
    const batch = [];
    
    updates.forEach(update => {
      batch.push(update);
    });
    
    // Send as single update
    bridge.updateFromReact(
      batch.reduce((acc, update) => ({ ...acc, ...update }), {})
    );
  }
}

// Pattern 3: Validated Updates
class ValidatedUpdate {
  static send(bridge, updates) {
    // Add validators before sending
    bridge.addValidator('customField', (value) => {
      return typeof value === 'string' && value.length < 100;
    });
    
    try {
      bridge.updateFromReact(updates);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }
}

// Pattern 4: Priority Updates
class PriorityUpdate {
  static sendCritical(bridge, updates) {
    // Disable batching for critical updates
    const originalBatch = bridge.config.batchUpdates;
    bridge.config.batchUpdates = false;
    
    bridge.updateFromReact(updates);
    
    // Re-enable batching
    bridge.config.batchUpdates = originalBatch;
  }
}
```

---

## Event System Architecture

### Event Types and Handlers

```javascript
/**
 * Comprehensive event handling system
 */
class BridgeEventSystem {
  // Event definitions
  static EVENTS = {
    // State events
    STATE_UPDATED: 'state:updated',
    STATE_SYNCED: 'state:synced',
    STATE_CONFLICT: 'state:conflict',
    
    // Game events
    GAME_READY: 'game:ready',
    GAME_PAUSED: 'game:paused',
    GAME_RESUMED: 'game:resumed',
    GAME_COMPLETED: 'game:completed',
    
    // Performance events
    PERFORMANCE_WARNING: 'performance:warning',
    MEMORY_PRESSURE: 'memory:pressure',
    
    // Error events
    VALIDATION_ERROR: 'validation:error',
    SYNC_ERROR: 'sync:error',
    CRITICAL_ERROR: 'critical:error'
  };
  
  // Event handler registration
  static setupHandlers(bridge) {
    // State update handler
    bridge.on(this.EVENTS.STATE_UPDATED, ({ source, updates, newState }) => {
      console.log(`State updated from ${source}:`, updates);
      
      // Custom handling based on source
      if (source === 'pixi' && updates.gameComplete) {
        this.handleGameComplete(newState);
      }
    });
    
    // Sync handler
    bridge.on(this.EVENTS.STATE_SYNCED, ({ differences }) => {
      if (differences.length > 0) {
        console.log('State differences resolved:', differences);
      }
    });
    
    // Performance monitoring
    bridge.on(this.EVENTS.PERFORMANCE_WARNING, ({ type, duration }) => {
      console.warn(`Performance issue: ${type} took ${duration}ms`);
      
      // Adjust settings if needed
      if (duration > 100) {
        bridge.config.batchDelay = 32; // Reduce to 30fps
      }
    });
    
    // Error handling
    bridge.on(this.EVENTS.VALIDATION_ERROR, ({ errors, updates }) => {
      console.error('Validation errors:', errors);
      
      // Notify user
      this.showValidationError(errors);
    });
  }
  
  // Custom event emitters
  static emitGameEvent(bridge, eventType, data) {
    const gameEvents = [
      'game:started',
      'game:paused',
      'game:resumed',
      'game:completed',
      'game:failed'
    ];
    
    if (!gameEvents.includes(eventType)) {
      console.warn('Unknown game event:', eventType);
      return;
    }
    
    bridge.emit(eventType, {
      timestamp: Date.now(),
      gameState: bridge.getState(),
      ...data
    });
  }
  
  // Event logging
  static createEventLogger(bridge) {
    const eventLog = [];
    const maxLogSize = 1000;
    
    // Log all events
    const originalEmit = bridge.emit.bind(bridge);
    bridge.emit = (event, data) => {
      eventLog.push({
        event,
        data,
        timestamp: Date.now()
      });
      
      if (eventLog.length > maxLogSize) {
        eventLog.shift();
      }
      
      originalEmit(event, data);
    };
    
    // Provide access to logs
    return {
      getLog: () => [...eventLog],
      clearLog: () => { eventLog.length = 0; },
      findEvents: (eventType) => eventLog.filter(e => e.event === eventType)
    };
  }
}
```

### Event Flow Diagram

```javascript
/**
 * Visual representation of event flow
 */
const EventFlowDiagram = `
React Component          Bridge                    PixiJS Game
     │                     │                           │
     ├──updateState()─────→│                           │
     │                     ├──validate()               │
     │                     ├──batch()                  │
     │                     ├──────updatePixi()───────→│
     │                     │                           ├──render()
     │                     │                           ├──physics()
     │                     │←────stateChange()────────┤
     │                     ├──validate()               │
     │←───onStateUpdate()──┤                           │
     ├──render()           │                           │
     │                     │                           │
`;
```

---

## State Validation Framework

### Validation Schema Definition

```javascript
/**
 * Comprehensive validation system
 */
class StateValidation {
  // Game-specific schemas
  static SCHEMAS = {
    puzzle: {
      connections: {
        type: 'array',
        maxLength: 30,
        items: {
          type: 'object',
          properties: {
            from: { type: 'string', required: true },
            to: { type: 'string', required: true },
            valid: { type: 'boolean' }
          }
        }
      },
      budget: {
        type: 'number',
        min: 0,
        max: 10000
      },
      moves: {
        type: 'number',
        min: 0,
        integer: true
      }
    },
    
    crisis: {
      phase: {
        type: 'string',
        enum: ['build', 'crisis', 'complete']
      },
      crisisEvents: {
        type: 'array',
        maxLength: 10,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', required: true },
            type: { type: 'string', required: true },
            severity: { type: 'number', min: 1, max: 5 },
            location: { type: 'object', required: true }
          }
        }
      },
      societyIndex: {
        type: 'number',
        min: 0,
        max: 100
      }
    }
  };
  
  // Validation functions
  static validateGameState(gameType, state) {
    const schema = this.SCHEMAS[gameType];
    if (!schema) {
      return { valid: true }; // No schema, assume valid
    }
    
    const errors = [];
    
    Object.entries(schema).forEach(([field, rules]) => {
      const value = state[field];
      const fieldErrors = this.validateField(field, value, rules);
      errors.push(...fieldErrors);
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
  
  static validateField(fieldName, value, rules) {
    const errors = [];
    
    // Type validation
    if (rules.type && !this.validateType(value, rules.type)) {
      errors.push(`${fieldName}: Expected ${rules.type}, got ${typeof value}`);
    }
    
    // Required validation
    if (rules.required && (value === undefined || value === null)) {
      errors.push(`${fieldName}: Required field missing`);
    }
    
    // Number validations
    if (rules.type === 'number' && typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${fieldName}: Value ${value} below minimum ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${fieldName}: Value ${value} above maximum ${rules.max}`);
      }
      if (rules.integer && !Number.isInteger(value)) {
        errors.push(`${fieldName}: Expected integer, got ${value}`);
      }
    }
    
    // String validations
    if (rules.type === 'string' && typeof value === 'string') {
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`${fieldName}: Value "${value}" not in allowed values: ${rules.enum.join(', ')}`);
      }
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        errors.push(`${fieldName}: Value "${value}" doesn't match pattern ${rules.pattern}`);
      }
    }
    
    // Array validations
    if (rules.type === 'array' && Array.isArray(value)) {
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${fieldName}: Array length ${value.length} exceeds maximum ${rules.maxLength}`);
      }
      
      // Validate items
      if (rules.items) {
        value.forEach((item, index) => {
          const itemErrors = this.validateField(
            `${fieldName}[${index}]`,
            item,
            rules.items
          );
          errors.push(...itemErrors);
        });
      }
    }
    
    // Object validations
    if (rules.type === 'object' && typeof value === 'object' && value !== null) {
      if (rules.properties) {
        Object.entries(rules.properties).forEach(([prop, propRules]) => {
          const propErrors = this.validateField(
            `${fieldName}.${prop}`,
            value[prop],
            propRules
          );
          errors.push(...propErrors);
        });
      }
    }
    
    return errors;
  }
  
  static validateType(value, expectedType) {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      default:
        return true;
    }
  }
  
  // Custom validators
  static addCustomValidator(bridge, fieldName, validator) {
    bridge.addValidator(fieldName, validator);
  }
  
  // Validation middleware
  static createValidationMiddleware(bridge) {
    const originalUpdateFromReact = bridge.updateFromReact.bind(bridge);
    const originalUpdateFromPixi = bridge.updateFromPixi.bind(bridge);
    
    bridge.updateFromReact = (updates) => {
      const validation = this.validateUpdates(updates, 'react');
      if (!validation.valid) {
        bridge.emit('validation:error', validation);
        return;
      }
      originalUpdateFromReact(updates);
    };
    
    bridge.updateFromPixi = (updates) => {
      const validation = this.validateUpdates(updates, 'pixi');
      if (!validation.valid) {
        bridge.emit('validation:error', validation);
        return;
      }
      originalUpdateFromPixi(updates);
    };
  }
}
```

---

## Performance Optimization

### Update Batching Strategy

```javascript
/**
 * Advanced batching for optimal performance
 */
class BatchingStrategy {
  static createOptimizedBatcher(bridge) {
    let batchQueue = [];
    let rafId = null;
    let lastBatchTime = 0;
    
    const processBatch = (timestamp) => {
      const deltaTime = timestamp - lastBatchTime;
      
      // Adaptive batching based on performance
      const targetFPS = 60;
      const targetFrameTime = 1000 / targetFPS;
      const shouldProcess = deltaTime >= targetFrameTime || batchQueue.length > 50;
      
      if (shouldProcess && batchQueue.length > 0) {
        const startTime = performance.now();
        
        // Group updates by priority
        const priorityGroups = this.groupByPriority(batchQueue);
        
        // Process high priority immediately
        if (priorityGroups.critical.length > 0) {
          this.processPriorityGroup(bridge, priorityGroups.critical);
        }
        
        // Batch others
        if (priorityGroups.high.length > 0) {
          this.processPriorityGroup(bridge, priorityGroups.high);
        }
        
        // Defer low priority if frame budget exceeded
        const elapsed = performance.now() - startTime;
        if (elapsed < targetFrameTime * 0.5) {
          this.processPriorityGroup(bridge, priorityGroups.normal);
          this.processPriorityGroup(bridge, priorityGroups.low);
        } else {
          // Defer to next frame
          batchQueue = [...priorityGroups.normal, ...priorityGroups.low];
        }
        
        lastBatchTime = timestamp;
      }
      
      rafId = requestAnimationFrame(processBatch);
    };
    
    return {
      add: (update, priority = 'normal') => {
        batchQueue.push({ ...update, priority, timestamp: Date.now() });
      },
      
      start: () => {
        if (!rafId) {
          rafId = requestAnimationFrame(processBatch);
        }
      },
      
      stop: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      
      flush: () => {
        const allUpdates = [...batchQueue];
        batchQueue = [];
        allUpdates.forEach(update => {
          bridge.applyUpdates(update.updates, update.source);
        });
      }
    };
  }
  
  static groupByPriority(updates) {
    return {
      critical: updates.filter(u => u.priority === 'critical'),
      high: updates.filter(u => u.priority === 'high'),
      normal: updates.filter(u => u.priority === 'normal'),
      low: updates.filter(u => u.priority === 'low')
    };
  }
  
  static processPriorityGroup(bridge, updates) {
    if (updates.length === 0) return;
    
    const merged = updates.reduce((acc, update) => {
      return bridge.mergeBatchedUpdates([acc, update]);
    }, {});
    
    bridge.applyUpdates(merged, updates[0].source);
  }
}
```

### Memory Management

```javascript
/**
 * Memory-efficient state management
 */
class MemoryOptimization {
  static createMemoryEfficientBridge(config) {
    const bridge = new GameStateBridge({
      ...config,
      maxStateHistory: 10,
      enableCompression: true
    });
    
    // State history for debugging
    const stateHistory = [];
    
    // Override update methods to track history
    const originalApply = bridge.applyUpdates.bind(bridge);
    bridge.applyUpdates = (updates, source) => {
      // Store compressed snapshot
      if (stateHistory.length >= config.maxStateHistory) {
        stateHistory.shift();
      }
      
      stateHistory.push({
        timestamp: Date.now(),
        source,
        updates,
        stateSize: this.calculateStateSize(bridge.getState())
      });
      
      originalApply(updates, source);
      
      // Check memory usage
      this.checkMemoryPressure(bridge);
    };
    
    // Add memory management methods
    bridge.getMemoryUsage = () => {
      return {
        stateSize: this.calculateStateSize(bridge.getState()),
        historySize: stateHistory.reduce((sum, h) => sum + h.stateSize, 0),
        totalSize: this.calculateObjectSize(bridge)
      };
    };
    
    bridge.clearHistory = () => {
      stateHistory.length = 0;
    };
    
    return bridge;
  }
  
  static calculateStateSize(state) {
    return new Blob([JSON.stringify(state)]).size;
  }
  
  static calculateObjectSize(obj) {
    const seen = new WeakSet();
    
    const calculateSize = (o) => {
      if (o === null || typeof o !== 'object') {
        return 0;
      }
      
      if (seen.has(o)) {
        return 0;
      }
      seen.add(o);
      
      let size = 0;
      
      if (Array.isArray(o)) {
        size += o.length * 8; // Rough estimate
        o.forEach(item => size += calculateSize(item));
      } else {
        Object.keys(o).forEach(key => {
          size += key.length * 2; // UTF-16
          size += calculateSize(o[key]);
        });
      }
      
      return size;
    };
    
    return calculateSize(obj);
  }
  
  static checkMemoryPressure(bridge) {
    if (!performance.memory) return;
    
    const used = performance.memory.usedJSHeapSize;
    const limit = performance.memory.jsHeapSizeLimit;
    const usage = used / limit;
    
    if (usage > 0.9) {
      bridge.emit('memory:pressure', {
        level: 'critical',
        usage: usage * 100,
        recommendation: 'Clear state history and reduce update frequency'
      });
      
      // Auto cleanup
      bridge.clearHistory();
    } else if (usage > 0.7) {
      bridge.emit('memory:pressure', {
        level: 'warning',
        usage: usage * 100,
        recommendation: 'Monitor memory usage'
      });
    }
  }
}
```

---

## Integration Examples

### Basic React Component Integration

```javascript
/**
 * Example: Puzzle Game Component
 */
import React, { useEffect, useRef, useState } from 'react';
import GameStateBridge from '@/lib/GameStateBridge';
import { GameCanvasWrapper } from '@/components/games/GameCanvasWrapper';

const PuzzleGameComponent = () => {
  const [bridge, setBridge] = useState(null);
  const [gameState, setGameState] = useState({
    connections: [],
    budget: 1000,
    moves: 0,
    completed: false
  });
  
  useEffect(() => {
    // Create bridge instance
    const gameBridge = new GameStateBridge({
      batchUpdates: true,
      validateUpdates: true,
      debugMode: process.env.NODE_ENV === 'development'
    });
    
    // Setup event handlers
    gameBridge.on('state:updated', ({ source, updates }) => {
      if (source === 'pixi') {
        setGameState(prev => ({ ...prev, ...updates }));
      }
    });
    
    gameBridge.on('validation:error', ({ errors }) => {
      console.error('State validation failed:', errors);
    });
    
    gameBridge.on('performance:warning', ({ type, duration }) => {
      console.warn(`Performance issue: ${type} (${duration}ms)`);
    });
    
    setBridge(gameBridge);
    
    // Cleanup
    return () => {
      gameBridge.destroy();
    };
  }, []);
  
  const handleReset = () => {
    const resetState = {
      connections: [],
      budget: 1000,
      moves: 0,
      completed: false
    };
    
    setGameState(resetState);
    bridge?.updateFromReact(resetState);
  };
  
  const handleBudgetChange = (newBudget) => {
    const update = { budget: newBudget };
    setGameState(prev => ({ ...prev, ...update }));
    bridge?.updateFromReact(update);
  };
  
  return (
    <div className="puzzle-game">
      <div className="game-stats">
        <div>Budget: {gameState.budget} kr</div>
        <div>Moves: {gameState.moves}</div>
        <div>Connections: {gameState.connections.length}</div>
      </div>
      
      <GameCanvasWrapper
        gameType="puzzle"
        onReady={(gameInstance) => {
          bridge?.initialize(gameInstance, gameState);
        }}
      />
      
      <div className="game-controls">
        <button onClick={handleReset}>Reset Game</button>
        <button onClick={() => handleBudgetChange(gameState.budget + 100)}>
          Add Budget
        </button>
      </div>
      
      {gameState.completed && (
        <div className="completion-message">
          Congratulations! Puzzle completed!
        </div>
      )}
    </div>
  );
};
```

### Advanced PixiJS Game Integration

```javascript
/**
 * Example: PixiJS Game Class
 */
class PuzzleGamePixi extends BasePixiGame {
  constructor(app, initialState) {
    super(app, initialState);
    
    this.nodes = new Map();
    this.connections = [];
    
    // State is managed by bridge
    this.state = {
      connections: [],
      budget: 1000,
      moves: 0,
      completed: false
    };
  }
  
  setup() {
    this.createNodes();
    this.setupInteraction();
    
    // Apply initial state if provided
    if (this.initialState) {
      this.restoreState(this.initialState);
    }
  }
  
  createNodes() {
    const nodeData = [
      { id: 'source1', type: 'source', x: 100, y: 100 },
      { id: 'hub', type: 'hub', x: 300, y: 200 },
      { id: 'target1', type: 'target', x: 500, y: 100 }
    ];
    
    nodeData.forEach(data => {
      const node = new GameNode(data);
      node.on('connect', this.handleNodeConnect.bind(this));
      this.nodes.set(data.id, node);
      this.stage.addChild(node);
    });
  }
  
  handleNodeConnect(fromNode, toNode) {
    // Validate connection
    if (!this.isValidConnection(fromNode, toNode)) {
      this.updateState({ 
        error: 'Invalid connection',
        lastAction: 'connect_failed'
      });
      return;
    }
    
    // Update state through bridge
    const newConnections = [
      ...this.state.connections,
      { from: fromNode.id, to: toNode.id }
    ];
    
    const updates = {
      connections: newConnections,
      moves: this.state.moves + 1,
      budget: this.state.budget - 10 // Connection cost
    };
    
    // Update via bridge
    this.updateState(updates);
    
    // Check win condition
    if (this.checkWinCondition(newConnections)) {
      this.updateState({
        completed: true,
        score: this.calculateScore()
      });
      
      this.onComplete();
    }
  }
  
  onStateUpdate(updates) {
    // Handle state updates from React
    Object.assign(this.state, updates);
    
    // Update visuals
    if ('connections' in updates) {
      this.redrawConnections(updates.connections);
    }
    
    if ('budget' in updates) {
      this.updateBudgetDisplay(updates.budget);
    }
  }
  
  calculateScore() {
    const baseScore = 1000;
    const movesPenalty = this.state.moves * 10;
    const budgetBonus = this.state.budget;
    
    return Math.max(0, baseScore - movesPenalty + budgetBonus);
  }
}
```

### Testing Bridge Integration

```javascript
/**
 * Example: Bridge integration tests
 */
describe('GameStateBridge Integration', () => {
  let bridge;
  let mockGame;
  
  beforeEach(() => {
    bridge = new GameStateBridge({
      batchUpdates: false, // Immediate updates for testing
      validateUpdates: true
    });
    
    mockGame = {
      updateState: jest.fn(),
      getState: jest.fn(() => ({})),
      onStateUpdate: jest.fn()
    };
    
    bridge.initialize(mockGame, { score: 0 });
  });
  
  afterEach(() => {
    bridge.destroy();
  });
  
  test('React to PixiJS state flow', () => {
    const updates = { score: 100, level: 2 };
    
    bridge.updateFromReact(updates);
    
    expect(mockGame.onStateUpdate).toHaveBeenCalledWith(updates);
    expect(bridge.getState()).toMatchObject(updates);
  });
  
  test('PixiJS to React state flow', () => {
    const updates = { enemies: [], playerHealth: 80 };
    const stateHandler = jest.fn();
    
    bridge.on('state:updated', stateHandler);
    bridge.updateFromPixi(updates);
    
    expect(stateHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        source: 'pixi',
        updates
      })
    );
  });
  
  test('Validation prevents invalid updates', () => {
    bridge.addValidator('score', value => value >= 0);
    
    const errorHandler = jest.fn();
    bridge.on('validation:error', errorHandler);
    
    bridge.updateFromReact({ score: -100 });
    
    expect(errorHandler).toHaveBeenCalled();
    expect(bridge.getState().score).toBe(0); // Unchanged
  });
  
  test('Performance monitoring', async () => {
    const perfHandler = jest.fn();
    bridge.on('performance:warning', perfHandler);
    
    // Simulate slow update
    bridge.updateFromReact = () => {
      const start = Date.now();
      while (Date.now() - start < 100) {} // Block for 100ms
    };
    
    bridge.updateFromReact({ test: true });
    
    expect(perfHandler).toHaveBeenCalled();
  });
});
```

---

## Best Practices

### Do's ✅
- Initialize bridge after game instance is ready
- Use validators for critical state fields
- Handle all bridge events appropriately
- Clean up bridge on component unmount
- Use batching for frequent updates

### Don'ts ❌
- Don't update state directly - always use bridge
- Don't ignore validation errors
- Don't create multiple bridges for same game
- Don't forget to destroy bridge
- Don't disable batching unless necessary

---

*Last Updated: 2025-06-20*  
*API Version: 1.0*  
*Optimized for Framtidsbygget Platform*