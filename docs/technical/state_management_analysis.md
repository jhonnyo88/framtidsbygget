# State Management Analysis for Framtidsbygget

## Overview
This document provides a comprehensive analysis of state management requirements extracted from the Master GDD. It covers the complete gameState structure, state transitions, persistence requirements, and performance considerations.

## Core State Structure

### Complete gameState Definition
```javascript
{
  // User identification
  "userId": "string",
  
  // Core progression tracking
  "totalFLScore": 0,
  
  // Onboarding state
  "onboardingStatus": "string", // 'not_started', 'in_progress', 'completed'
  
  // World completion tracking
  "completedWorlds": [
    {
      "worldId": "string", // e.g., 'pussel-spel-datasystem'
      "status": "string", // 'completed'
      "scoreAwarded": "number",
      "bestOutcome": "string" // e.g., 'Perfekt lösning', 'Konsensus'
    }
  ],
  
  // Achievement system
  "unlockedAchievements": ["string"],
  
  // Synergy unlocks
  "unlockedSynergies": {
    "synergy_expert_data_model": "boolean",
    "synergy_empathy_training": "boolean",
    "synergy_skilled_workforce": "boolean",
    "synergy_resilient_network": "boolean"
  },
  
  // Digital compass progression
  "compassProgress": {
    // Key is node-ID from strategy.json
    "digital_kompetens": "string" // 'locked', 'unlocked', 'mastered'
  },
  
  // Version tracking
  "gameVersion": "1.0.0"
}
```

### Data Types Summary
- **Strings**: userId, onboardingStatus, worldId, status, bestOutcome, compassProgress values
- **Numbers**: totalFLScore, scoreAwarded
- **Arrays**: completedWorlds, unlockedAchievements
- **Objects**: unlockedSynergies, compassProgress
- **Booleans**: Individual synergy unlock states

## State Transitions During Gameplay

### 1. Onboarding Flow States
```
'not_started' -> 'step_2' -> 'step_3' -> 'step_4' -> 'completed'
```
- Triggered by user interactions during onboarding
- Each transition requires Firebase save

### 2. World Completion Flow
```
1. User selects world -> activeGame = worldId
2. Game in progress -> temporary game state (not persisted)
3. Game completes -> result object generated
4. Result processed -> gameState updated:
   - completedWorlds array updated
   - totalFLScore incremented
   - Synergies checked and unlocked
   - Achievements checked and unlocked
   - compassProgress updated
5. Return to dashboard -> activeGame = null
```

### 3. Score Calculation State Updates
Each minigame returns a result object with different structures:

#### Säker Datasystem
```javascript
result = { success, budgetSpent, movesMade }
// Updates: totalFLScore, completedWorlds entry
```

#### Välfärdens Dilemma
```javascript
result = { success, finalAutonomy, finalSecurity, finalStaffWellbeing, outcome }
// Updates: totalFLScore, completedWorlds entry, possible synergy unlock
```

#### Kompetensresan
```javascript
result = { success, finalCompetence, finalBudget }
// Updates: totalFLScore, completedWorlds entry, possible synergy unlock
```

#### Konnektivitetsvakten
```javascript
result = { success, finalIndex, buildPhaseScore }
// Updates: totalFLScore, completedWorlds entry, possible synergy unlock
```

#### Ekosystembyggaren
```javascript
result = { success, finalMetrics }
// Updates: totalFLScore, completedWorlds entry
```

### 4. Synergy Unlock Conditions
```javascript
// Expert Data Model - Triggered after Säker Datasystem
if (worldId === 'pussel-spel-datasystem' && result.scoreAwarded > 1200)

// Empathy Training - Triggered after Välfärdens Dilemma
if (worldId === 'valfards-dilemma' && result.outcome === 'Konsensus')

// Skilled Workforce - Triggered after Kompetensresan
if (worldId === 'kompetensresan' && result.finalCompetence.specialist > 80)

// Resilient Network - Triggered after Konnektivitetsvakten
if (worldId === 'konnektivitetsvakten' && result.finalIndex > 90)
```

## Persistent vs Temporary State

### Persistent State (Firebase)
Everything in the main `gameState` object must be persisted:
- userId
- totalFLScore
- onboardingStatus
- completedWorlds array
- unlockedAchievements
- unlockedSynergies
- compassProgress
- gameVersion

### Temporary State (React Component State)
- `activeGame` - Current minigame being played
- Minigame internal state - Lives within each minigame component
- UI state - Hover effects, animations, modal visibility
- Finale sequence step tracking

### Persistence Points
1. **After onboarding step changes**
2. **After minigame completion** (handleGameComplete)
3. **After synergy unlocks**
4. **After achievement unlocks**
5. **After compass node updates**

## Score Calculation System

### FL-Points Calculation Functions

```javascript
// Säker Datasystem
TotalFLScoreAwarded = (success ? 1000 : 0) + 
                     ((initialBudget - budgetSpent) * 2) + 
                     (500 - (movesMade * 10))

// Välfärdens Dilemma
TotalFLScoreAwarded = (success ? 500 : 0) + 
                     (((finalAutonomy + finalSecurity + finalStaffWellbeing) / 3) * 10) + 
                     (outcome === 'Konsensus' ? 500 : 200)

// Kompetensresan
TotalFLScoreAwarded = (success ? 1000 : 0) + 
                     (finalCompetence.base + finalCompetence.broad + (finalCompetence.specialist * 1.5)) + 
                     (finalBudget * 0.5)

// Konnektivitetsvakten
TotalFLScoreAwarded = (success ? 800 : 0) + (finalIndex * 10) + buildPhaseScore

// Ekosystembyggaren
TotalFLScoreAwarded = (success ? 1200 : 0) + Object.values(finalMetrics).reduce((a, b) => a + b, 0)
```

## Achievement System Requirements
- Achievement unlocks are checked after each minigame completion
- Stored as an array of string IDs in `unlockedAchievements`
- Must support checking multiple conditions (score thresholds, specific outcomes, combinations)

## Save/Load Requirements

### Save Operations
```javascript
// Required save function signature
async function saveGameState(gameState) {
  // Save to Firebase under userId
  // Include timestamp
  // Handle errors gracefully
}
```

### Load Operations
```javascript
// Required load function signature
async function loadGameState(userId) {
  // Load from Firebase
  // Validate data structure
  // Handle missing/corrupted data
  // Return default state if no save exists
}
```

### Data Validation
- Verify gameVersion compatibility
- Ensure all required fields exist
- Validate data types
- Handle migration for future versions

## Critical State Dependencies

### Dependencies Map
1. **Synergies depend on**:
   - Specific world completion
   - Score thresholds or specific outcomes

2. **Compass progress depends on**:
   - World completions
   - Achievement unlocks
   - Total FL score thresholds

3. **Finale activation depends on**:
   - All 5 worlds completed
   - Minimum total FL score

4. **Visual map updates depend on**:
   - completedWorlds array
   - Specific world IDs

## Performance-Sensitive State Updates

### High-Frequency Updates (Optimize)
- Minigame internal state (moves, positions, timers)
- Animation states
- Hover/interaction states

### Low-Frequency Updates (Can be heavier)
- World completion processing
- Score calculations
- Firebase persistence
- Achievement/synergy checks

### Optimization Strategies
1. **Batch Firebase updates** - Don't save after every small change
2. **Memoize calculations** - Cache compass progress calculations
3. **Lazy load** - Only load strategy.json when compass is accessed
4. **Debounce saves** - Prevent rapid successive saves

## Firebase Persistence Points

### Critical Save Points
1. **Onboarding progression** - Each step completion
2. **World completion** - After handleGameComplete
3. **Manual save** - If user exits mid-game
4. **Auto-save** - Every 5 minutes during gameplay

### Firebase Structure
```
/users
  /{userId}
    /gameState
      - userId
      - totalFLScore
      - onboardingStatus
      - completedWorlds[]
      - unlockedAchievements[]
      - unlockedSynergies{}
      - compassProgress{}
      - gameVersion
      - lastSaved (timestamp)
```

## State Management Implementation Recommendations

### 1. Use React Context for Global State
- Create a GameStateContext provider
- Wrap entire app in provider
- Expose state and update functions

### 2. Separate Concerns
- `gameState` - Core persistent data
- `uiState` - Temporary UI state
- `gameConfig` - Static configuration

### 3. State Update Pattern
```javascript
const updateGameState = (updates) => {
  setGameState(prev => {
    const newState = { ...prev, ...updates };
    saveToFirebase(newState); // Debounced
    return newState;
  });
};
```

### 4. Error Handling
- Wrap all state updates in try-catch
- Provide fallback states
- Log errors for debugging
- Show user-friendly error messages

## Conclusion
The state management system for Framtidsbygget requires careful handling of persistent game progress data, real-time score calculations, and complex unlock conditions. The architecture should prioritize data integrity, performance for frequent updates, and seamless Firebase integration for save/load functionality.