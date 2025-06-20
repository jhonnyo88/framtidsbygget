# State Management Architecture - Framtidsbygget

**Version:** 1.0  
**Status:** Production State Architecture  
**Purpose:** Complete state management specification for the three-layer state complexity

---

## Executive Summary

Framtidsbygget requires sophisticated state management to handle the complex interactions between React UI, PixiJS games, and Firebase persistence. This document provides the definitive architecture for managing state across all three layers with optimal performance and reliability.

## Table of Contents

1. [State Architecture Overview](#state-architecture-overview)
2. [Global State Specification](#global-state-specification)
3. [State Flow Diagrams](#state-flow-diagrams)
4. [Component State Strategy](#component-state-strategy)
5. [Performance Optimization](#performance-optimization)
6. [Error Recovery Patterns](#error-recovery-patterns)
7. [Implementation Guidelines](#implementation-guidelines)

---

## State Architecture Overview

### Three-Layer State Model

```
┌─────────────────────────────────────────────────────────┐
│                   Layer 1: React UI State                │
│  • Component state (modals, forms, animations)          │
│  • Navigation state (current view, breadcrumbs)         │
│  • UI preferences (theme, language, sound)              │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│              Layer 2: Game Logic State                   │
│  • PixiJS sprite positions and properties               │
│  • Game rules and win conditions                        │
│  • Real-time gameplay state                             │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│           Layer 3: Persistent Player State              │
│  • Player progress (FL-points, achievements)            │
│  • Unlocked content (synergies, compass nodes)          │
│  • Save game data (Firebase Firestore)                  │
└─────────────────────────────────────────────────────────┘
```

### State Synchronization Points

| Sync Point | Direction | Frequency | Priority |
|------------|-----------|-----------|----------|
| Game Start | React → PixiJS | Once | Critical |
| Score Update | PixiJS → React | Per action | High |
| Game Complete | PixiJS → React → Firebase | Once | Critical |
| Achievement Unlock | React → Firebase | As needed | Medium |
| Auto-save | React → Firebase | Every 60s | Low |

---

## Global State Specification

### Complete GameState Structure

```typescript
interface GameState {
  // User Identity
  userId: string;
  createdAt: number;
  lastUpdated: number;
  version: string;
  
  // Player Progress
  totalFLScore: number;
  completedWorlds: WorldId[];
  currentWorld: WorldId | null;
  
  // Onboarding Status
  onboardingStatus: {
    completed: boolean;
    currentStep: 'not_started' | 'step_1' | 'step_2' | 'step_3' | 'step_4' | 'completed';
    skipped: boolean;
    lastShown: number;
  };
  
  // Achievement System
  unlockedAchievements: AchievementId[];
  achievementProgress: {
    [achievementId: string]: {
      progress: number;
      maxProgress: number;
      lastUpdated: number;
    };
  };
  
  // Synergy System
  unlockedSynergies: {
    dataFlowMastery: boolean;
    empathyExcellence: boolean;
    adaptiveCapability: boolean;
    resilientInfrastructure: boolean;
  };
  synergyProgress: {
    [synergyId: string]: {
      requirement: number;
      current: number;
    };
  };
  
  // Digital Compass Progress
  compassProgress: {
    [nodeId: string]: 'locked' | 'unlocked' | 'mastered';
  };
  compassStats: {
    totalNodes: number;
    unlockedNodes: number;
    masteredNodes: number;
    lastUpdated: number;
  };
  
  // World-Specific Progress
  worldProgress: {
    [worldId: string]: {
      completed: boolean;
      bestScore: number;
      attempts: number;
      lastPlayed: number;
      achievements: string[];
      saveState?: any; // Game-specific save data
    };
  };
  
  // UI Preferences (Local only)
  preferences: {
    soundEnabled: boolean;
    musicVolume: number;
    effectsVolume: number;
    language: 'sv' | 'en';
    reducedMotion: boolean;
    highContrast: boolean;
  };
  
  // Session Data (Temporary)
  session: {
    startTime: number;
    lastActivity: number;
    currentView: string;
    modalStack: string[];
    pendingSaves: any[];
  };
}
```

### State Update Actions

```typescript
type StateAction = 
  // Navigation Actions
  | { type: 'NAVIGATE'; payload: { view: string } }
  | { type: 'OPEN_MODAL'; payload: { modalId: string } }
  | { type: 'CLOSE_MODAL' }
  
  // Game Progress Actions
  | { type: 'START_GAME'; payload: { worldId: string } }
  | { type: 'UPDATE_GAME_STATE'; payload: { worldId: string; gameState: any } }
  | { type: 'COMPLETE_GAME'; payload: GameCompletionData }
  
  // Score Actions
  | { type: 'ADD_FL_SCORE'; payload: { amount: number; source: string } }
  | { type: 'UPDATE_BEST_SCORE'; payload: { worldId: string; score: number } }
  
  // Achievement Actions
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'UPDATE_ACHIEVEMENT_PROGRESS'; payload: { achievementId: string; progress: number } }
  
  // Synergy Actions
  | { type: 'UNLOCK_SYNERGY'; payload: { synergyId: string } }
  | { type: 'UPDATE_SYNERGY_PROGRESS'; payload: { synergyId: string; progress: number } }
  
  // Compass Actions
  | { type: 'UNLOCK_COMPASS_NODE'; payload: { nodeId: string } }
  | { type: 'MASTER_COMPASS_NODE'; payload: { nodeId: string } }
  
  // Preference Actions
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<Preferences> }
  
  // Session Actions
  | { type: 'UPDATE_SESSION'; payload: Partial<SessionData> }
  | { type: 'SYNC_TO_FIREBASE'; payload: { fields: string[] } }
  | { type: 'RESTORE_FROM_FIREBASE'; payload: GameState };
```

---

## State Flow Diagrams

### User Journey State Flow

```
START
  │
  ├─→ [New User] → Onboarding Flow
  │                    │
  │                    ├─→ Step 1: Welcome
  │                    ├─→ Step 2: Compass Intro
  │                    ├─→ Step 3: Mission Intro
  │                    ├─→ Step 4: Score Intro
  │                    └─→ Complete → Dashboard
  │
  └─→ [Returning User] → Dashboard
                           │
                           ├─→ Select World → Start Game
                           │                      │
                           │                      ├─→ Game Playing
                           │                      │        │
                           │                      │        └─→ Game Complete
                           │                      │                 │
                           │                      │                 ├─→ Calculate Score
                           │                      │                 ├─→ Check Achievements
                           │                      │                 ├─→ Update Progress
                           │                      │                 ├─→ Save to Firebase
                           │                      │                 └─→ Show Results
                           │                      │
                           │                      └─→ Game Paused/Quit → Dashboard
                           │
                           ├─→ View Compass → Explore Nodes
                           ├─→ View Achievements → Track Progress
                           └─→ Access Finale (if all complete)
```

### Game State Synchronization Flow

```
React Component                StateBridge              PixiJS Game
      │                            │                         │
      ├──startGame(worldId)───────→│                         │
      │                            ├──initialize(state)──────→│
      │                            │                         │
      │                            │←─────gameReady──────────┤
      │←────onGameReady────────────┤                         │
      │                            │                         │
      │                            │←───updateState(move)────┤
      │←──onStateChange(move)──────┤                         │
      │                            │                         │
      │──pauseGame()──────────────→│                         │
      │                            ├────pauseGame()─────────→│
      │                            │                         │
      │                            │←──updateState(paused)───┤
      │←─onStateChange(paused)─────┤                         │
      │                            │                         │
      │                            │←─gameComplete(result)───┤
      │←─onGameComplete(result)────┤                         │
      │                            │                         │
      └──cleanup()─────────────────┴─────destroy()─────────→│
```

---

## Component State Strategy

### State Locality Decision Matrix

| State Type | Local | Context | Redux | Firebase | Example |
|------------|-------|---------|-------|----------|---------|
| Form Input | ✓ | | | | Text fields, selections |
| Animation | ✓ | | | | Transitions, counters |
| Modal Open | | ✓ | | | Dialog visibility |
| Game Progress | | | ✓ | ✓ | Scores, completion |
| User Preferences | | ✓ | | ✓ | Sound, language |
| Session Data | | ✓ | | | Current view, temp data |

### Component-Specific State Guidelines

#### MainDashboard
```javascript
// No local state - pure presentation
const MainDashboard = ({ gameState, onWorldSelect }) => {
  // All data from props
  return <Dashboard {...gameState} />;
};
```

#### GameModule with Local State
```javascript
const PuzzleGameModule = () => {
  // Local UI state only
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Game state from context
  const { gameState, updateGameState } = useGameContext();
  
  // PixiJS game state managed by GameCanvasWrapper
  return (
    <GameCanvasWrapper
      gameType="puzzle"
      initialState={gameState.worldProgress.puzzle}
      onReady={() => setIsLoading(false)}
      onError={setError}
      onStateChange={(updates) => {
        updateGameState('puzzle', updates);
      }}
    />
  );
};
```

#### ResultModal with Animation State
```javascript
const ResultModal = ({ result, onClose }) => {
  // Local animation state
  const [animationPhase, setAnimationPhase] = useState('entering');
  const [displayScore, setDisplayScore] = useState(0);
  
  // Animated score counter
  useEffect(() => {
    if (animationPhase === 'scoring') {
      animateScore(0, result.score, setDisplayScore);
    }
  }, [animationPhase, result.score]);
  
  // No global state updates here - handled by parent
  return <Modal>{/* UI */}</Modal>;
};
```

---

## Performance Optimization

### State Update Batching

```javascript
// Batch multiple state updates
const completeGame = useCallback((gameResult) => {
  // Use React 18 automatic batching
  updateGameState(state => ({
    ...state,
    totalFLScore: state.totalFLScore + gameResult.score,
    completedWorlds: [...state.completedWorlds, gameResult.worldId],
    worldProgress: {
      ...state.worldProgress,
      [gameResult.worldId]: {
        completed: true,
        bestScore: Math.max(
          state.worldProgress[gameResult.worldId]?.bestScore || 0,
          gameResult.score
        ),
        lastPlayed: Date.now()
      }
    }
  }));
  
  // Check achievements asynchronously
  requestIdleCallback(() => {
    checkAchievements(gameResult);
  });
}, []);
```

### Memoization Strategy

```javascript
// Expensive calculations memoized
const gameProgress = useMemo(() => {
  const completed = gameState.completedWorlds.length;
  const total = 5;
  const percentage = (completed / total) * 100;
  
  return {
    completed,
    total,
    percentage,
    nextWorld: getNextAvailableWorld(gameState)
  };
}, [gameState.completedWorlds]);

// Selector patterns for derived state
const useWorldStatus = (worldId) => {
  return useGameState(state => {
    const progress = state.worldProgress[worldId];
    return {
      isCompleted: progress?.completed || false,
      bestScore: progress?.bestScore || 0,
      isLocked: !isWorldAvailable(worldId, state),
      attempts: progress?.attempts || 0
    };
  });
};
```

### Debounced Firebase Saves

```javascript
// Auto-save with debouncing
const useAutoSave = (gameState) => {
  const saveToFirebase = useMemo(
    () => debounce(async (state) => {
      try {
        await firebase.updateGameState(state.userId, {
          totalFLScore: state.totalFLScore,
          completedWorlds: state.completedWorlds,
          worldProgress: state.worldProgress,
          compassProgress: state.compassProgress,
          lastUpdated: Date.now()
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Queue for retry
        queueFailedSave(state);
      }
    }, 5000), // 5 second debounce
    []
  );
  
  useEffect(() => {
    saveToFirebase(gameState);
  }, [gameState, saveToFirebase]);
};
```

### React Re-render Optimization

```javascript
// Split contexts to minimize re-renders
const GameStateProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  
  // Separate providers for different update frequencies
  return (
    <GameProgressContext.Provider value={gameState.progress}>
      <GamePreferencesContext.Provider value={gameState.preferences}>
        <GameSessionContext.Provider value={gameState.session}>
          <GameDispatchContext.Provider value={dispatch}>
            {children}
          </GameDispatchContext.Provider>
        </GameSessionContext.Provider>
      </GamePreferencesContext.Provider>
    </GameProgressContext.Provider>
  );
};

// Components subscribe only to needed slices
const ScoreDisplay = () => {
  const { totalFLScore } = useGameProgress(); // Only re-renders on score change
  return <div>{totalFLScore}</div>;
};
```

---

## Error Recovery Patterns

### State Corruption Recovery

```javascript
// State validation and recovery
const validateGameState = (state) => {
  const errors = [];
  
  // Check required fields
  if (!state.userId) errors.push('Missing userId');
  if (typeof state.totalFLScore !== 'number') errors.push('Invalid score');
  if (!Array.isArray(state.completedWorlds)) errors.push('Invalid worlds array');
  
  // Check data integrity
  if (state.totalFLScore < 0) errors.push('Negative score');
  if (state.completedWorlds.length > 5) errors.push('Too many completed worlds');
  
  return { valid: errors.length === 0, errors };
};

const recoverCorruptedState = async (corruptedState) => {
  console.error('State corruption detected:', corruptedState);
  
  try {
    // Try to restore from Firebase
    const cloudState = await firebase.getGameState(corruptedState.userId);
    if (cloudState && validateGameState(cloudState).valid) {
      return cloudState;
    }
  } catch (error) {
    console.error('Failed to restore from cloud:', error);
  }
  
  // Fall back to safe defaults
  return createInitialState(corruptedState.userId);
};
```

### Network Failure Handling

```javascript
// Offline queue for Firebase operations
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }
  
  add(operation) {
    this.queue.push({
      id: Date.now(),
      operation,
      retries: 0,
      maxRetries: 3
    });
    
    this.process();
  }
  
  async process() {
    if (this.processing || !navigator.onLine) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const item = this.queue[0];
      
      try {
        await item.operation();
        this.queue.shift(); // Remove successful operation
      } catch (error) {
        item.retries++;
        
        if (item.retries >= item.maxRetries) {
          console.error('Operation failed after retries:', item);
          this.queue.shift();
          // Notify user of permanent failure
          showErrorNotification('Some changes could not be saved');
        } else {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, item.retries) * 1000)
          );
        }
      }
    }
    
    this.processing = false;
  }
}

const offlineQueue = new OfflineQueue();

// Monitor network status
window.addEventListener('online', () => {
  offlineQueue.process();
});
```

### Game State Recovery

```javascript
// Checkpoint system for game state
class GameStateCheckpoint {
  constructor() {
    this.checkpoints = new Map();
    this.maxCheckpoints = 5;
  }
  
  save(gameId, state) {
    const checkpoint = {
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      gameId
    };
    
    this.checkpoints.set(gameId, checkpoint);
    
    // Limit checkpoint storage
    if (this.checkpoints.size > this.maxCheckpoints) {
      const oldest = Array.from(this.checkpoints.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)[0];
      this.checkpoints.delete(oldest[0]);
    }
  }
  
  restore(gameId) {
    const checkpoint = this.checkpoints.get(gameId);
    if (!checkpoint) return null;
    
    // Validate checkpoint age (max 30 minutes)
    if (Date.now() - checkpoint.timestamp > 30 * 60 * 1000) {
      this.checkpoints.delete(gameId);
      return null;
    }
    
    return checkpoint.state;
  }
  
  clear(gameId) {
    this.checkpoints.delete(gameId);
  }
}

// Use in game error boundary
class GameErrorBoundary extends React.Component {
  state = { hasError: false, recovered: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Game crashed:', error, errorInfo);
    
    // Try to recover from checkpoint
    const checkpoint = gameStateCheckpoint.restore(this.props.gameId);
    if (checkpoint) {
      this.setState({ recovered: true });
      this.props.onRecover(checkpoint);
    }
  }
  
  render() {
    if (this.state.hasError && !this.state.recovered) {
      return <GameCrashFallback onRetry={this.props.onRetry} />;
    }
    
    return this.props.children;
  }
}
```

---

## Implementation Guidelines

### Phase 1: Core State Structure (Days 1-2)
1. Implement global state reducer
2. Create context providers
3. Setup initial state structure
4. Add state persistence hooks

### Phase 2: Game Integration (Days 3-4)
1. Implement StateBridge for React-PixiJS communication
2. Create game-specific state handlers
3. Add checkpoint system
4. Test state synchronization

### Phase 3: Firebase Integration (Days 5-6)
1. Implement Firebase service layer
2. Add offline queue system
3. Create sync strategies
4. Setup cost monitoring

### Phase 4: Performance & Polish (Days 7-8)
1. Add memoization and selectors
2. Implement debounced saves
3. Optimize re-render patterns
4. Add error boundaries

### Validation Checklist
- [ ] State updates complete in < 16ms
- [ ] No unnecessary re-renders during gameplay
- [ ] Firebase writes < 10 per session
- [ ] Offline mode fully functional
- [ ] State recovery from corruption works
- [ ] Memory usage stable over time
- [ ] All error cases handled gracefully

---

## Appendix: Quick Reference

### Essential Imports
```javascript
import { createContext, useContext, useReducer, useMemo } from 'react';
import { gameReducer, initialState } from '@/state/gameReducer';
import { GameStateProvider } from '@/state/GameStateProvider';
import { useGameState, useGameDispatch } from '@/state/hooks';
import { FirebaseSync } from '@/services/FirebaseSync';
import { StateBridge } from '@/state/StateBridge';
```

### State Update Examples
```javascript
// Update score
dispatch({ type: 'ADD_FL_SCORE', payload: { amount: 150, source: 'puzzle' } });

// Complete game
dispatch({ type: 'COMPLETE_GAME', payload: gameResult });

// Unlock achievement
dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: { achievementId: 'first_win' } });

// Sync to Firebase
dispatch({ type: 'SYNC_TO_FIREBASE', payload: { fields: ['totalFLScore', 'completedWorlds'] } });
```

---

*Last Updated: 2025-06-20*  
*Architecture Version: 1.0*  
*Optimized for Framtidsbygget Educational Platform*