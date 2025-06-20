# UI State Management Analysis

**Document:** Technical Analysis - UI State Management Requirements  
**Version:** 1.0  
**Status:** Initial Analysis  
**Created:** 2025-06-20

---

## Executive Summary

This document provides a comprehensive analysis of UI state management requirements based on the UX/UI specifications for Framtidsbygget. It identifies component-specific state needs, state flow patterns, and provides recommendations for local vs global state decisions to ensure optimal UI responsiveness and performance.

## State Categories Overview

### 1. Application-Level Global State
States that need to be shared across multiple components and persist throughout the session.

### 2. Component-Level Local State
States that are specific to individual components and don't need external access.

### 3. UI-Specific Transient State
States that handle animations, transitions, and temporary UI behaviors.

---

## Component-Specific State Requirements

### MainDashboard Component

#### Global State Dependencies
- `gameState` - Read-only access required
  - `totalFLScore`
  - `completedWorlds`
  - `unlockedSynergies`
  - `onboardingStatus`
- `gameWorlds` - Array of world objects with status

#### Local State Needs
- None identified - Pure presentation component

#### State Update Patterns
- Reactive updates when `gameState` changes
- No direct state mutations

### Scoreboard Component

#### Global State Dependencies
- `gameState.totalFLScore` - For displaying FL points
- `gameState.completedWorlds` - For progress tracking
- `gameState.unlockedSynergies` - For synergy list

#### Local State Needs
- `animatedScore` - For score animation during updates
- `isAnimating` - Animation state flag

#### State Update Patterns
```javascript
// Score animation pattern
useEffect(() => {
  if (totalFLScore !== animatedScore) {
    setIsAnimating(true);
    // Animate from current to new value over 1.5s
    animateValue(animatedScore, totalFLScore, 1500);
  }
}, [totalFLScore]);
```

### MapView Component

#### Global State Dependencies
- `gameWorlds` - World status and positioning
- `completedWorlds` - For path animation triggers

#### Local State Needs
- `hoveredWorldId` - For tooltip display
- `animatingPaths` - Set of currently animating path IDs
- `completedPaths` - Set of fully animated paths

#### State Update Patterns
```javascript
// Path animation trigger pattern
useEffect(() => {
  const newlyCompleted = gameWorlds.filter(
    world => world.status === 'completed' && 
    !completedPaths.has(world.id)
  );
  
  newlyCompleted.forEach(world => {
    setAnimatingPaths(prev => new Set([...prev, world.id]));
    // After 1.5s, move to completed
    setTimeout(() => {
      setAnimatingPaths(prev => {
        const next = new Set(prev);
        next.delete(world.id);
        return next;
      });
      setCompletedPaths(prev => new Set([...prev, world.id]));
    }, 1500);
  });
}, [gameWorlds]);
```

### ResultModal Component

#### Global State Dependencies
- `result` object from completed minigame
  - `success`
  - `scoreAwarded`
  - `outcome`
  - `unlockedSynergies`
  - `unlockedCompassNode`

#### Local State Needs
- `isVisible` - Modal visibility state
- `animationPhase` - 'entering' | 'visible' | 'exiting'
- `displayedScore` - For score count-up animation
- `scoreAnimationComplete` - Boolean flag

#### State Update Patterns
```javascript
// Modal animation lifecycle
const [animationPhase, setAnimationPhase] = useState('entering');

useEffect(() => {
  if (isVisible) {
    setAnimationPhase('entering');
    setTimeout(() => setAnimationPhase('visible'), 300);
  }
}, [isVisible]);

// Score count-up animation
useEffect(() => {
  if (result && animationPhase === 'visible') {
    animateScore(0, result.scoreAwarded, 1500);
  }
}, [result, animationPhase]);
```

### OnboardingFlow State Machine

#### Global State Dependencies
- `gameState.onboardingStatus` - Primary state driver
- `gameWorlds` - For step 4 world highlighting

#### Local State Needs
- `currentStep` - Derived from onboardingStatus
- `spotlightTarget` - DOM element reference for highlighting
- `tooltipPosition` - Calculated tooltip coordinates

#### State Update Patterns
```javascript
// State machine pattern
const onboardingSteps = {
  'not_started': {
    component: WelcomeModal,
    nextStatus: 'step_2_compass',
    spotlightTarget: null
  },
  'step_2_compass': {
    component: null,
    nextStatus: 'step_3_node',
    spotlightTarget: 'compass-button'
  },
  'step_3_node': {
    component: null,
    nextStatus: 'step_4_mission',
    spotlightTarget: 'root-node'
  },
  'step_4_mission': {
    component: null,
    nextStatus: 'completed',
    spotlightTarget: 'first-unlocked-world'
  }
};
```

---

## State Flow Between Components

### 1. Game Completion Flow
```
Minigame → App.jsx → ResultModal → MainDashboard
         ↓         ↓              ↓
    result obj  gameState    showModal=false
                 update      & state refresh
```

### 2. World Selection Flow
```
MapView → App.jsx → Minigame Component
       ↓         ↓
  onSelectWorld  activeWorld state
```

### 3. Onboarding Navigation Flow
```
App.jsx → OnboardingOverlay → Component Actions → App.jsx
       ↓                    ↓                   ↓
  status check          highlight/block    status update
```

### 4. Score Update Animation Flow
```
ResultModal → App.jsx → Scoreboard
          ↓         ↓            ↓
    scoreAwarded  totalFLScore  animate display
```

---

## Modal and Navigation State Management

### Modal States Required

#### ResultModal
- **Trigger:** `showResultModal` boolean in App.jsx
- **Data:** `currentResult` object
- **Lifecycle:** Show → Animate In → Display → User Action → Animate Out → Hide

#### Onboarding Modals
- **Trigger:** `onboardingStatus === 'not_started'`
- **Data:** Static content
- **Lifecycle:** Auto-show → User Action → Hide & Update Status

### Navigation State Requirements

#### Active View State
```javascript
// App.jsx level state
const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'compass' | 'minigame'
const [activeMinigame, setActiveMinigame] = useState(null);
```

#### Navigation History
- Not required based on current specifications
- Direct navigation only (no back button functionality)

---

## Animation and Transition State Needs

### Score Animations
- **Component:** Scoreboard, ResultModal
- **State:** Current displayed value, target value, animation duration
- **Pattern:** RequestAnimationFrame or CSS transitions

### Path Drawing Animations
- **Component:** MapView
- **State:** Animation progress per path, completion status
- **Pattern:** CSS stroke-dashoffset animation

### Modal Transitions
- **Component:** ResultModal, Onboarding modals
- **State:** Animation phase, transform values
- **Pattern:** CSS transitions with React lifecycle

### Pulse Animations
- **Component:** MapView nodes, Compass button
- **State:** None (pure CSS animation)
- **Pattern:** CSS @keyframes

---

## Error and Loading States

### Identified Error States
1. **Minigame Load Failure**
   - State: `minigameLoadError` in App.jsx
   - Recovery: Show error message, return to dashboard

2. **State Update Failure**
   - State: `stateUpdateError` in App.jsx
   - Recovery: Retry mechanism, preserve previous state

### Loading States
1. **Initial App Load**
   - State: `isAppLoading` in App.jsx
   - Display: Loading spinner overlay

2. **Minigame Loading**
   - State: `isMinigameLoading` in App.jsx
   - Display: Progress indicator

3. **Asset Loading** (maps, icons)
   - State: `assetsLoaded` in App.jsx
   - Display: Skeleton screens

---

## State Dependencies Between Components

### Direct Dependencies
```
App.jsx (gameState) → MainDashboard → Scoreboard
                   ↓                ↓
                   → ResultModal    → MapView
```

### Cascading Updates
1. **Score Update Chain**
   - Minigame completes → App updates totalFLScore → Scoreboard animates → MapView updates node

2. **Unlock Chain**
   - Mission complete → Synergies unlock → Next world unlocks → Map updates

3. **Onboarding Chain**
   - Status update → Overlay changes → Component highlighting → User action enables

---

## Performance-Critical UI State Updates

### High-Frequency Updates
1. **Score Count Animation**
   - Optimization: Use RAF, batch DOM updates
   - State: Keep in local component state

2. **Hover States**
   - Optimization: Use CSS :hover when possible
   - State: Local state only when needed for tooltips

### Resource-Intensive Operations
1. **SVG Path Animations**
   - Optimization: Use CSS animations, not JS
   - State: Track completion, not progress

2. **Modal Backdrop Blur**
   - Optimization: Use CSS backdrop-filter
   - State: Simple boolean toggle

---

## Recommendations

### Global State (App.jsx or Context)
```javascript
const globalState = {
  // Core game state
  gameState: {
    totalFLScore: number,
    completedWorlds: string[],
    unlockedSynergies: object,
    onboardingStatus: string
  },
  
  // World data
  gameWorlds: WorldObject[],
  
  // Navigation
  activeView: string,
  activeMinigame: string | null,
  
  // Modal control
  showResultModal: boolean,
  currentResult: ResultObject | null,
  
  // System states
  isLoading: boolean,
  error: Error | null
};
```

### Local State Guidelines

1. **Animation States** - Keep local to component
2. **Hover/Focus States** - Local unless needed for tooltips
3. **Form Input States** - Local to form component
4. **Temporary UI States** - Local to component

### State Update Best Practices

1. **Batch Related Updates**
   ```javascript
   // Good - Single state update
   setGameState(prev => ({
     ...prev,
     totalFLScore: prev.totalFLScore + scoreAwarded,
     completedWorlds: [...prev.completedWorlds, worldId]
   }));
   ```

2. **Optimize Re-renders**
   - Use React.memo for pure presentation components
   - Split state objects to minimize update scope

3. **Animation Performance**
   - Prefer CSS animations over JS
   - Use RAF for score counting
   - Debounce rapid state changes

### Component Communication Patterns

1. **Upward Communication**
   - Callbacks passed as props
   - Event naming: `onActionVerb` (onSelectWorld, onGameComplete)

2. **Downward Communication**
   - Props for data and state
   - Minimize prop drilling with Context for deep trees

3. **Sibling Communication**
   - Through parent state only
   - No direct component references

---

## Implementation Priority

### Phase 1: Core State Structure
1. Implement global state container in App.jsx
2. Set up basic navigation state
3. Create ResultModal state flow

### Phase 2: Animation States
1. Implement score animation states
2. Add path drawing animation logic
3. Create modal transition states

### Phase 3: Onboarding State Machine
1. Implement onboarding status tracking
2. Create spotlight and overlay states
3. Add step transition logic

### Phase 4: Optimization
1. Add error boundaries
2. Implement loading states
3. Optimize re-render performance

---

## Conclusion

The UI state management architecture should prioritize clear separation between global application state and local component state. Animation and transition states should remain local to components to prevent unnecessary re-renders. The onboarding flow requires a well-defined state machine pattern, while the main game flow benefits from a centralized state management approach in App.jsx. Performance optimizations should focus on animation-heavy components like Scoreboard and MapView.