# State Management Package

**Package ID:** S1  
**System:** State Management Architecture  
**Status:** Complete  
**Token Count:** ~26,000 tokens

---

## Package Contents

### Architecture Documentation
- `/architecture/State_Architecture_Overview.md` - Complete state management design
- `/architecture/State_Flow_Patterns.md` - Data flow and update patterns
- `/architecture/Firebase_Sync_Strategy.md` - State synchronization with Firebase

### Implementation Guides
- `/implementation/Redux_Setup_Guide.md` - Redux configuration and setup
- `/implementation/Slice_Creation_Guide.md` - Creating feature slices
- `/implementation/Selector_Patterns.md` - Efficient state selection
- `/implementation/Action_Patterns.md` - Action creators and thunks

### Reference Code
- `/reference/store/` - Complete Redux store configuration
- `/reference/slices/` - Feature slice implementations
- `/reference/hooks/` - Custom Redux hooks
- `/reference/middleware/` - Custom middleware implementations

---

## Quick Start

```javascript
// Import configured store
import { store } from '@/store';
import { Provider } from 'react-redux';

// Wrap app with provider
<Provider store={store}>
  <App />
</Provider>

// Use in components
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { gameActions, selectGameState } from '@/store/slices/gameSlice';

function GameComponent() {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(selectGameState);
  
  const handleAction = () => {
    dispatch(gameActions.updateScore({ points: 100 }));
  };
}
```

---

## State Structure

```typescript
interface RootState {
  // User & Auth
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  };
  
  // Player Progress
  player: {
    profile: PlayerProfile;
    progress: GameProgress;
    achievements: Achievement[];
    settings: PlayerSettings;
  };
  
  // Game States
  games: {
    welfare: WelfareGameState;
    crisis: CrisisGameState;
    puzzle: PuzzleGameState;
    memory: MemoryGameState;
  };
  
  // UI State
  ui: {
    theme: 'light' | 'dark';
    locale: 'sv' | 'en';
    modals: ModalState;
    notifications: Notification[];
  };
  
  // System
  system: {
    isOnline: boolean;
    syncStatus: SyncStatus;
    performance: PerformanceMetrics;
  };
}
```

---

## Key Features

### Three-Layer State Complexity
1. **UI State** - React component state for immediate UI
2. **Game Logic State** - Redux for game mechanics
3. **Persistent State** - Firebase for cross-device sync

### State Bridge Pattern
- Bidirectional sync between Redux and Firebase
- Optimistic updates with rollback
- Conflict resolution strategies
- Offline queue management

### Performance Optimizations
- Normalized state structure
- Memoized selectors with reselect
- Lazy-loaded slices
- Batched updates

---

## Core Concepts

### Feature Slices
Each major feature has its own slice:
- `authSlice` - Authentication state
- `playerSlice` - Player data and progress
- `gameSlice` - Active game state
- `uiSlice` - UI preferences
- `systemSlice` - System status

### Middleware Stack
1. **Firebase Sync** - Syncs state changes to Firestore
2. **Logger** - Development logging
3. **Error Handler** - Catches and reports errors
4. **Performance** - Monitors action performance

### Action Patterns
- Synchronous actions for UI updates
- Async thunks for API calls
- Action creators with payload validation
- Standardized error handling

---

## Firebase Integration

### Sync Strategy
```javascript
// Automatic sync on state changes
const firebaseSyncMiddleware = store => next => action => {
  const result = next(action);
  
  if (shouldSync(action)) {
    syncToFirebase(store.getState(), action);
  }
  
  return result;
};
```

### Offline Support
- Queue actions when offline
- Persist queue to localStorage
- Replay on reconnection
- Handle conflicts gracefully

---

## Best Practices

### State Design
- Keep state normalized and flat
- Derive computed values with selectors
- Separate UI state from domain state
- Use TypeScript for type safety

### Performance
- Use Redux Toolkit for optimized updates
- Implement selector memoization
- Lazy load feature slices
- Monitor bundle size

### Testing
- Unit test reducers and selectors
- Integration test middleware
- Mock Firebase in tests
- Test offline scenarios

---

## Common Patterns

### Loading States
```javascript
const [status, setStatus] = useState('idle');
// 'idle' | 'loading' | 'succeeded' | 'failed'
```

### Optimistic Updates
```javascript
// Update local state immediately
dispatch(updateLocal(data));
// Sync to server
try {
  await syncToServer(data);
} catch (error) {
  dispatch(rollback(data));
}
```

### Normalized Data
```javascript
{
  entities: {
    games: { [id]: game },
    players: { [id]: player }
  },
  ids: ['game1', 'game2']
}
```

---

## Migration Guide

From local state to Redux:
1. Identify shared state
2. Create feature slice
3. Move state to store
4. Replace useState with useSelector
5. Replace callbacks with dispatch

---

## Related Packages

- **S2**: Firebase Integration (sync strategies)
- **S3**: PixiJS Bridge (game state sync)
- **F1**: Core Framework (state consumers)
- **G1-G4**: Game Modules (game-specific state)