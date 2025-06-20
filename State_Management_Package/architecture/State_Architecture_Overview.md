# State Architecture Overview

**System:** Framtidsbygget State Management  
**Pattern:** Redux + Firebase Sync  
**Complexity:** Three-Layer Architecture

---

## Architecture Principles

### 1. Three-Layer State Complexity

```
┌─────────────────────────────────────────┐
│         UI State (React)                │
│  • Component state (useState)           │
│  • Immediate UI feedback                │
│  • Form inputs, toggles                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Game Logic State (Redux)          │
│  • Game mechanics and rules             │
│  • Player progress and scores           │
│  • Session data                         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    Persistent State (Firebase)          │
│  • Cross-device synchronization         │
│  • Long-term player data                │
│  • Achievements and history             │
└─────────────────────────────────────────┘
```

### 2. State Flow Patterns

**Unidirectional Data Flow:**
```
User Action → Dispatch → Reducer → State Update → UI Update
                ↓
            Middleware → Firebase Sync → Other Devices
```

**State Bridge Pattern:**
```javascript
// Bidirectional sync between Redux and Firebase
Redux State ←→ State Bridge ←→ Firebase
              ↑
              │
         Conflict Resolution
```

---

## State Structure Design

### Root State Shape
```typescript
interface RootState {
  // Domain States
  auth: AuthState;
  player: PlayerState;
  games: GamesState;
  
  // UI States
  ui: UIState;
  router: RouterState;
  
  // System States
  system: SystemState;
  firebase: FirebaseState;
}
```

### Normalized State Pattern
```javascript
// Bad - Nested and duplicated
{
  games: [
    {
      id: '1',
      players: [
        { id: 'p1', name: 'Anna', score: 100 }
      ]
    }
  ]
}

// Good - Normalized
{
  games: {
    byId: {
      '1': { id: '1', playerIds: ['p1'] }
    },
    allIds: ['1']
  },
  players: {
    byId: {
      'p1': { id: 'p1', name: 'Anna', score: 100 }
    },
    allIds: ['p1']
  }
}
```

---

## Feature Slice Architecture

### Slice Structure
```javascript
// gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async actions
export const loadGame = createAsyncThunk(
  'game/load',
  async (gameId) => {
    const response = await gameAPI.load(gameId);
    return response.data;
  }
);

// Slice definition
const gameSlice = createSlice({
  name: 'game',
  initialState: {
    currentGame: null,
    status: 'idle',
    error: null
  },
  reducers: {
    // Synchronous actions
    updateScore: (state, action) => {
      state.currentGame.score += action.payload;
    },
    resetGame: (state) => {
      state.currentGame = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    // Handle async actions
    builder
      .addCase(loadGame.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadGame.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentGame = action.payload;
      })
      .addCase(loadGame.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

// Export actions and reducer
export const { updateScore, resetGame } = gameSlice.actions;
export default gameSlice.reducer;

// Selectors
export const selectCurrentGame = (state) => state.game.currentGame;
export const selectGameStatus = (state) => state.game.status;
```

---

## Middleware Architecture

### Firebase Sync Middleware
```javascript
const firebaseSyncMiddleware = (store) => {
  // Initialize Firebase listeners
  initializeListeners(store);
  
  return (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    
    // Sync specific actions to Firebase
    if (shouldSyncAction(action)) {
      syncToFirebase(state, action);
    }
    
    return result;
  };
};

function shouldSyncAction(action) {
  const syncActions = [
    'player/updateProgress',
    'game/completeLevel',
    'achievement/unlock'
  ];
  
  return syncActions.includes(action.type);
}
```

### Performance Monitoring
```javascript
const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();
  const result = next(action);
  const duration = performance.now() - start;
  
  if (duration > 16) { // Longer than one frame
    console.warn(`Slow action ${action.type}: ${duration}ms`);
  }
  
  return result;
};
```

---

## State Synchronization

### Optimistic Updates
```javascript
const optimisticUpdate = createAsyncThunk(
  'game/optimisticSave',
  async (gameData, { dispatch, rejectWithValue }) => {
    // Optimistically update local state
    dispatch(updateLocal(gameData));
    
    try {
      // Attempt server sync
      await firebase.save(gameData);
      return gameData;
    } catch (error) {
      // Rollback on failure
      dispatch(rollback());
      return rejectWithValue(error);
    }
  }
);
```

### Conflict Resolution
```javascript
const resolveConflict = (local, remote) => {
  // Last-write-wins strategy
  if (remote.updatedAt > local.updatedAt) {
    return remote;
  }
  
  // Merge strategies for specific fields
  return {
    ...local,
    score: Math.max(local.score, remote.score),
    achievements: [...new Set([...local.achievements, ...remote.achievements])],
    updatedAt: Date.now()
  };
};
```

---

## Performance Patterns

### Memoized Selectors
```javascript
import { createSelector } from '@reduxjs/toolkit';

// Basic selector
const selectGames = (state) => state.games.byId;
const selectGameIds = (state) => state.games.allIds;

// Memoized computed selector
export const selectSortedGames = createSelector(
  [selectGames, selectGameIds],
  (games, ids) => {
    return ids
      .map(id => games[id])
      .sort((a, b) => b.score - a.score);
  }
);
```

### Lazy State Loading
```javascript
// Load slices on demand
const injectReducer = (key, reducer) => {
  if (!store.asyncReducers[key]) {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createRootReducer(store.asyncReducers));
  }
};

// Usage in route
const GameRoute = lazy(() => {
  injectReducer('game', gameReducer);
  return import('./GameRoute');
});
```

---

## Testing Strategies

### Unit Testing Reducers
```javascript
describe('gameSlice', () => {
  it('should handle updateScore', () => {
    const initialState = { score: 0 };
    const action = gameActions.updateScore(10);
    const newState = gameReducer(initialState, action);
    expect(newState.score).toBe(10);
  });
});
```

### Integration Testing
```javascript
it('should sync to Firebase on game completion', async () => {
  const store = configureStore({ reducer: rootReducer });
  const mockFirebase = jest.fn();
  
  store.dispatch(gameActions.complete());
  
  await waitFor(() => {
    expect(mockFirebase).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'completed' })
    );
  });
});
```

---

## Best Practices

1. **Keep State Minimal**: Only store what you can't derive
2. **Normalize Complex Data**: Prevent duplication and nesting
3. **Use TypeScript**: Type your state and actions
4. **Separate Concerns**: UI state vs domain state
5. **Test Thoroughly**: Unit and integration tests
6. **Monitor Performance**: Use Redux DevTools
7. **Document Patterns**: Maintain consistency across team