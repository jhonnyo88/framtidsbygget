# PixiJS Implementation Guide - Framtidsbygget

**Version:** 1.0  
**Status:** Production Implementation Guide  
**Purpose:** Complete implementation guide for AI developers to successfully build PixiJS games without prior PixiJS expertise

---

## Executive Summary

This guide provides a systematic approach to implementing PixiJS games within the Framtidsbygget React application. It is specifically designed for AI developers who may not have deep PixiJS knowledge but need to create robust, performant educational games.

## Table of Contents

1. [Risk Assessment Overview](#risk-assessment-overview)
2. [Game Module Technical Analysis](#game-module-technical-analysis)
3. [Integration Architecture](#integration-architecture)
4. [Performance Requirements](#performance-requirements)
5. [AI Development Guidelines](#ai-development-guidelines)
6. [Implementation Phases](#implementation-phases)
7. [Validation Framework](#validation-framework)

---

## Risk Assessment Overview

### Top 5 Critical Risks & Mitigation Roadmap

| Priority | Risk | Impact | Mitigation Strategy | Timeline |
|----------|------|--------|-------------------|----------|
| 1 | Memory Leaks | App crashes after 30min | Implement GameCanvasWrapper Pattern | Week 1 |
| 2 | State Sync Failures | Game state lost | Deploy StateBridge Pattern | Week 1 |
| 3 | Mobile Performance | Unplayable on tablets | Progressive Enhancement Pattern | Week 2 |
| 4 | AI Implementation Errors | 50% failure rate | Provide foolproof patterns | Week 1 |
| 5 | Asset Loading Failures | Black screens | Smart Asset Loader Pattern | Week 2 |

### Risk Mitigation Roadmap

```
Week 1: Foundation (Critical Risk Mitigation)
├── Day 1-2: Implement GameCanvasWrapper with full lifecycle management
├── Day 3-4: Deploy StateBridge for React-PixiJS sync
└── Day 5: Create AI-safe pattern templates

Week 2: Optimization & Enhancement
├── Day 1-2: Mobile performance patterns
├── Day 3-4: Asset loading system
└── Day 5: Integration testing

Week 3: Game-Specific Implementation
├── Day 1-2: Puzzle Game mechanics
├── Day 3-4: Crisis Game real-time features
└── Day 5: Cross-game integration
```

---

## Game Module Technical Analysis

### Complexity Breakdown by Game

#### 1. Puzzle Game (Säker Datasystem)
**Technical Complexity: Medium**

```javascript
// Core Technical Requirements
const puzzleGameRequirements = {
  interactions: {
    dragDrop: true,
    fixedPositions: true,
    connectionValidation: true,
    visualFeedback: true
  },
  
  stateManagement: {
    connections: Map,
    nodeStates: Object,
    budget: Number,
    moves: Number
  },
  
  performance: {
    maxNodes: 20,
    maxConnections: 30,
    targetFPS: 60
  }
};

// Key Implementation Challenges
const puzzleChallenges = [
  "Drag-drop with snap-to-grid positioning",
  "Connection path rendering with bezier curves",
  "Real-time validation feedback",
  "Undo/redo functionality"
];
```

#### 2. Crisis Game (Konnektivitetsvakten)
**Technical Complexity: High**

```javascript
// Core Technical Requirements
const crisisGameRequirements = {
  realTime: {
    updateFrequency: 60, // fps
    eventTriggers: true,
    visualEffects: true,
    stateStreaming: true
  },
  
  phases: {
    build: "Infrastructure placement",
    crisis: "Real-time crisis management"
  },
  
  effects: {
    particles: true,
    shaders: true,
    animations: true
  }
};

// Key Implementation Challenges
const crisisChallenges = [
  "Real-time state updates without lag",
  "Complex visual effects for crises",
  "Performance under stress (many events)",
  "Smooth phase transitions"
];
```

#### 3. Welfare Game (Välfärdens Dilemma)
**Technical Complexity: Low**

```javascript
// Primarily React-based with minimal PixiJS
const welfareGameRequirements = {
  pixi: {
    required: false,
    optional: "Character animations, emotion particles"
  },
  
  focus: "React components with state management"
};
```

#### 4. Competence Game (Kompetensresan)
**Technical Complexity: Medium**

```javascript
const competenceGameRequirements = {
  visualization: {
    charts: true,
    cardAnimations: true,
    progressBars: true
  },
  
  hybrid: "Mix of React UI and PixiJS visualization"
};
```

#### 5. Ecosystem Game (Ekosystembyggaren)
**Technical Complexity: High**

```javascript
const ecosystemGameRequirements = {
  visualization: {
    networkGraph: true,
    dynamicLayout: true,
    growthAnimations: true
  },
  
  performance: {
    maxCompanies: 100,
    maxConnections: 500
  }
};
```

### Common Patterns Across Games

```javascript
// Shared Technical Requirements
const sharedRequirements = {
  stateManagement: {
    pattern: "StateBridge",
    persistence: "Firebase",
    validation: "Automatic"
  },
  
  performance: {
    desktop: "60fps",
    mobile: "30fps minimum",
    memory: "< 200MB"
  },
  
  accessibility: {
    keyboard: "Full navigation",
    screenReader: "ARIA labels",
    colorBlind: "High contrast mode"
  }
};
```

---

## Integration Architecture

### React-PixiJS Bridge Specification

```
┌─────────────────────────────────────────────────────┐
│                  React Application                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │              App.jsx (State Hub)             │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                              │
│  ┌──────────────────▼──────────────────────────┐  │
│  │         GameModule (React Component)         │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │  UI Controls │ Score │ Timer │ Pause   │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │       GameCanvasWrapper (Bridge)        │ │  │
│  │  └──────────────┬─────────────────────────┘ │  │
│  └─────────────────┼───────────────────────────┘  │
└────────────────────┼───────────────────────────────┘
                     │
                     │ StateBridge Protocol
                     │
┌────────────────────▼───────────────────────────────┐
│                 PixiJS Application                  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐  │
│  │            BasePixiGame Class                │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │   Stage │ Renderer │ Ticker │ Loader   │ │  │
│  │  └────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │          Game-Specific Logic                 │  │
│  │  • PuzzleGamePixi                           │  │
│  │  • CrisisGamePixi                           │  │
│  │  • EcosystemGamePixi                        │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Critical Integration Points

#### 1. Initialization Sequence
```javascript
// CRITICAL: Exact initialization order
class GameInitializer {
  static async initializeGame(gameType, container, initialState) {
    // 1. Validate container exists
    if (!container || !container.offsetWidth) {
      throw new Error('Container must be mounted and visible');
    }
    
    // 2. Create PixiJS app with specific settings
    const app = new PIXI.Application({
      width: container.offsetWidth,
      height: container.offsetHeight,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      powerPreference: 'high-performance'
    });
    
    // 3. Add to DOM
    container.appendChild(app.view);
    
    // 4. Initialize game class
    const GameClass = GameRegistry[gameType];
    const game = new GameClass(app, initialState);
    
    // 5. Setup state bridge
    const bridge = new StateBridge(game, initialState);
    
    // 6. Start game loop
    game.start();
    
    return { app, game, bridge };
  }
}
```

#### 2. State Synchronization Points
```javascript
// Define exact sync points
const SYNC_POINTS = {
  PUZZLE_GAME: {
    immediate: ['connections', 'validation', 'budget'],
    batched: ['moves', 'time'],
    debounced: ['hover', 'preview']
  },
  
  CRISIS_GAME: {
    immediate: ['crisisEvents', 'infrastructure', 'health'],
    batched: ['score', 'resources'],
    realtime: ['damageEffects', 'repairs']
  }
};
```

#### 3. Event Flow Architecture
```javascript
// Bidirectional event system
class EventBridge {
  constructor() {
    this.reactToPixi = new EventEmitter();
    this.pixiToReact = new EventEmitter();
  }
  
  // React → PixiJS
  sendToPixi(event, data) {
    this.reactToPixi.emit(event, data);
  }
  
  // PixiJS → React
  sendToReact(event, data) {
    // Ensure we're in React's event loop
    requestAnimationFrame(() => {
      this.pixiToReact.emit(event, data);
    });
  }
}
```

---

## Performance Requirements

### Device-Specific Targets

| Device Category | Target FPS | Max Memory | Load Time | Bundle Size |
|----------------|------------|------------|-----------|-------------|
| Modern Desktop | 60 fps | 400 MB | < 3s | < 500 KB |
| Standard Desktop | 60 fps | 300 MB | < 5s | < 500 KB |
| Modern Tablet | 30-60 fps | 200 MB | < 5s | < 500 KB |
| Older Devices | 24-30 fps | 150 MB | < 8s | < 500 KB |

### Performance Optimization Strategies

```javascript
// Automatic quality adjustment
class PerformanceOptimizer {
  static profiles = {
    high: {
      antialias: true,
      resolution: 2,
      particles: 1000,
      effects: 'all'
    },
    medium: {
      antialias: true,
      resolution: 1,
      particles: 500,
      effects: 'essential'
    },
    low: {
      antialias: false,
      resolution: 1,
      particles: 100,
      effects: 'none'
    }
  };
  
  static detectOptimalProfile() {
    const fps = this.measureFPS();
    const memory = performance.memory?.usedJSHeapSize || 0;
    
    if (fps > 55 && memory < 200_000_000) return 'high';
    if (fps > 28 && memory < 300_000_000) return 'medium';
    return 'low';
  }
}
```

### Bundle Size Optimization

```javascript
// Dynamic imports for game modules
const GameLoader = {
  async loadGame(gameType) {
    switch(gameType) {
      case 'puzzle':
        return import(/* webpackChunkName: "puzzle" */ './games/PuzzleGame');
      case 'crisis':
        return import(/* webpackChunkName: "crisis" */ './games/CrisisGame');
      default:
        throw new Error(`Unknown game type: ${gameType}`);
    }
  }
};
```

---

## AI Development Guidelines

### How AI Should Approach PixiJS Implementation

#### 1. Start with Pattern Templates
```javascript
// AI INSTRUCTION: Always start with this base template
class YourGamePixi extends BasePixiGame {
  constructor(app, initialState) {
    super(app, initialState);
    // AI: Add your game-specific properties here
  }
  
  setup() {
    // AI: Initialize your game objects here
    // Use this.app.stage to add display objects
  }
  
  update(delta) {
    // AI: Add your game loop logic here
    // delta is time since last frame
  }
  
  cleanup() {
    // AI: Clean up resources here
    super.cleanup(); // Always call parent cleanup
  }
}
```

#### 2. Common AI Pitfalls & Solutions

| Common Mistake | Why It Happens | Correct Approach |
|----------------|----------------|------------------|
| Direct DOM manipulation | AI habits from React | Use PIXI display objects |
| Creating new apps | Misunderstanding lifecycle | Use provided app instance |
| Memory leaks | Not cleaning textures | Always call destroy() |
| State mutations | React patterns | Use immutable updates |

#### 3. AI-Safe Code Patterns

```javascript
// ❌ WRONG: AI might try this
onClick={() => {
  document.getElementById('game-score').innerText = score;
}}

// ✅ CORRECT: Use state bridge
onClick={() => {
  this.updateState({ score: newScore });
}}

// ❌ WRONG: Creating multiple apps
componentDidMount() {
  this.pixiApp = new PIXI.Application();
}

// ✅ CORRECT: Use GameCanvasWrapper
<GameCanvasWrapper 
  gameType="puzzle"
  onReady={(gameInstance) => {
    this.game = gameInstance;
  }}
/>
```

#### 4. Debugging Checklist for AI

```javascript
// Add this to every game for AI debugging
class AIDebugger {
  static checkCommonIssues(game) {
    const issues = [];
    
    // Check 1: Canvas mounted
    if (!game.app.view.parentElement) {
      issues.push('Canvas not attached to DOM');
    }
    
    // Check 2: Update loop running
    if (!game.app.ticker.started) {
      issues.push('Game loop not started');
    }
    
    // Check 3: Stage has children
    if (game.app.stage.children.length === 0) {
      issues.push('No display objects added to stage');
    }
    
    // Check 4: Memory usage
    const textureCount = Object.keys(PIXI.utils.TextureCache).length;
    if (textureCount > 100) {
      issues.push(`High texture count: ${textureCount}`);
    }
    
    return issues;
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**AI Success Target: 95%**

```javascript
// Validation command for AI
// Run: npm run test:phase1
const phase1Tasks = {
  day1: "Setup GameCanvasWrapper",
  day2: "Implement StateBridge",
  day3: "Create base game template",
  day4: "Add error handling",
  day5: "Integration tests"
};
```

### Phase 2: Game Mechanics (Week 2)
**AI Success Target: 85%**

```javascript
// Specific implementation order
const phase2Order = [
  "1. Puzzle Game - Drag & Drop",
  "2. Puzzle Game - Connection Validation",
  "3. Crisis Game - Build Phase",
  "4. Crisis Game - Crisis Events",
  "5. Cross-game state persistence"
];
```

### Phase 3: Polish & Optimization (Week 3)
**AI Success Target: 75%**

```javascript
const phase3Focus = {
  performance: "Mobile optimization",
  accessibility: "Keyboard navigation",
  polish: "Animations and transitions",
  testing: "User acceptance testing"
};
```

---

## Validation Framework

### Automated Validation for Each Phase

```javascript
// AI can run these to verify implementation
class PhaseValidator {
  static validatePhase1() {
    const tests = [
      this.testGameCanvasWrapper(),
      this.testStateBridge(),
      this.testErrorHandling(),
      this.testCleanup()
    ];
    
    return {
      passed: tests.every(t => t.passed),
      details: tests
    };
  }
  
  static testGameCanvasWrapper() {
    try {
      const wrapper = new GameCanvasWrapper({
        gameType: 'puzzle',
        containerRef: { current: document.createElement('div') }
      });
      
      return {
        name: 'GameCanvasWrapper Creation',
        passed: wrapper.pixiApp !== null,
        message: 'Wrapper initialized successfully'
      };
    } catch (error) {
      return {
        name: 'GameCanvasWrapper Creation',
        passed: false,
        message: error.message
      };
    }
  }
}

// Run validation
console.log('Phase 1 Validation:', PhaseValidator.validatePhase1());
```

### Success Metrics

```javascript
const SUCCESS_METRICS = {
  phase1: {
    testsPass: '100%',
    memoryLeaks: 0,
    errorRate: '< 1%',
    setupTime: '< 500ms'
  },
  
  phase2: {
    gameplayFps: '> 30',
    stateSync: '< 16ms',
    interactions: 'Responsive',
    validation: 'Accurate'
  },
  
  phase3: {
    mobilePerf: '> 24fps',
    accessibility: 'WCAG AA',
    userSatisfaction: '> 80%',
    bugCount: '< 5'
  }
};
```

---

## Appendix: Quick Reference

### Essential Imports
```javascript
import * as PIXI from 'pixi.js';
import { GameCanvasWrapper } from '@/components/games/GameCanvasWrapper';
import { BasePixiGame } from '@/lib/pixi/BasePixiGame';
import { StateBridge } from '@/lib/pixi/StateBridge';
```

### Game Type Registry
```javascript
export const GAME_TYPES = {
  PUZZLE: 'puzzle',
  CRISIS: 'crisis',
  WELFARE: 'welfare',
  COMPETENCE: 'competence',
  ECOSYSTEM: 'ecosystem'
};
```

### Debug Commands
```bash
# Check PixiJS integration
npm run debug:pixi

# Validate specific game
npm run validate:game puzzle

# Performance profiling
npm run profile:performance
```

---

*Last Updated: 2025-06-20*  
*Document Version: 1.0*  
*For AI Developers implementing Framtidsbygget*