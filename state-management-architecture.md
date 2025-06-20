# State Management Architecture - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready  
**Syfte:** Komplett arkitektur för state management i React-applikationen "Framtidsbygget"

---

## State Management Philosophy

### Central State Conductor Pattern
Framtidsbygget använder **App.jsx som central dirigent** för all state management enligt Technical_Masterplan_v4.md. Detta säkerställer:

- **Single Source of Truth**: All spelardata finns i ett centralt `gameState` objekt
- **Predictable Data Flow**: Data flödar ned via props, ändringar rapporteras upp via callbacks
- **Firebase Sync**: All persistence hanteras centralt i App.jsx
- **Isolation**: Minispel hanterar endast lokalt state, rapporterar resultat uppåt

### State Hierarchy

```
App.jsx (Global State)
├── gameState (persistent)
├── appState (session)
└── uiState (transient)
    │
    ├── MainDashboard.jsx (derived state)
    ├── DigitalaKompassen.jsx (derived state)  
    └── [MinispelModul].jsx (local state only)
```

---

## Global State Structure

### Complete gameState Definition

Baserat på Master_GDD_Complete_Specification.md:

```javascript
/**
 * gameState - Master state objekt för all spelardata
 * Måste synkas med Firebase och följa GDD-specifikationen exakt
 */
const initialGameState = {
  // Player Identity
  userId: null,                    // Firebase Auth UID (anonymous)
  
  // Core Progress Metrics  
  totalFLScore: 0,                // Total Förändringsledarpoäng
  onboardingStatus: 'not_started', // 'not_started' | 'step_2' | 'step_3' | 'step_4' | 'completed'
  
  // World Completion Tracking
  completedWorlds: [
    // {
    //   worldId: 'pussel-spel-datasystem',
    //   status: 'completed',
    //   scoreAwarded: 1250,
    //   bestOutcome: 'Perfekt lösning',
    //   completedAt: firebase.Timestamp,
    //   gameVersion: '1.0.0'
    // }
  ],
  
  // Achievement System
  unlockedAchievements: [],        // Array of achievement IDs
  
  // Synergy System (from Master GDD)
  unlockedSynergies: {
    synergy_expert_data_model: false,    // Unlocked via Pusselspelet high score
    synergy_empathy_training: false,     // Unlocked via Välfärdens Dilemma konsensus  
    synergy_skilled_workforce: false,    // Unlocked via Kompetensresan specialist > 80
    synergy_resilient_network: false     // Unlocked via Konnektivitetsvakten index > 90
  },
  
  // Digital Compass Progress
  compassProgress: {
    // Key = node ID from strategy.json, Value = progress level
    // 'locked' | 'unlocked' | 'mastered'
  },
  
  // Metadata
  lastUpdated: null,               // Firebase timestamp
  gameVersion: '1.0.0',           
  sessionCount: 1,                // Number of game sessions
  
  // Privacy & Analytics (GDPR compliant)
  analyticsOptIn: false,          // User consent for analytics
  createdAt: null                 // Account creation timestamp
};
```

### Session State (appState)

Transient state som inte sparas till Firebase:

```javascript
const initialAppState = {
  // Navigation State
  currentView: 'onboarding',      // 'onboarding' | 'dashboard' | 'compass' | 'game' | 'finale'
  activeGame: null,               // worldId när spel är aktivt
  previousView: null,             // För navigation history
  
  // Loading States  
  isLoading: false,               // Global loading state
  isSaving: false,                // Firebase save in progress
  
  // Error Handling
  error: null,                    // Current error message
  networkStatus: 'online',        // 'online' | 'offline' | 'connecting'
  
  // Game Session
  sessionStartTime: null,         // När denna session började
  unsavedChanges: false,          // Indikerar om det finns osparad data
  
  // UI Feedback
  showResultModal: false,         // Visa resultat efter minispel
  lastGameResult: null,           // Senaste spel-resultat för modal
  showAchievementToast: false,    // Achievement unlocked notification
  pendingAchievements: []         // Achievements att visa
};
```

### UI State (uiState)

Tillfälligt UI-state för interaktioner:

```javascript
const initialUIState = {
  // Modal States
  modals: {
    settings: false,
    help: false,
    achievements: false,
    compass: false
  },
  
  // Animation States
  animations: {
    scoreCountUp: false,
    mapUpdate: false,
    achievementPulse: false
  },
  
  // Form States
  onboardingStep: 1,
  
  // Mobile Responsive
  screenSize: 'desktop',          // 'mobile' | 'tablet' | 'desktop'
  sidebarOpen: false,             // Mobile navigation
  
  // Accessibility
  highContrast: false,
  reducedMotion: false,
  
  // Debug (development only)
  debugPanel: false,
  showPerformanceMetrics: false
};
```

---

## State Management Implementation

### App.jsx - Central State Manager

Complete implementation av huvudkomponenten:

```javascript
import React, { useState, useEffect, useCallback, useRef } from 'react';
import FirebaseService from './firebase/FirebaseService.js';
import PixiErrorBoundary from './components/errors/PixiErrorBoundary.jsx';
import MainDashboard from './components/dashboard/MainDashboard.jsx';
import OnboardingFlow from './components/onboarding/OnboardingFlow.jsx';
import DigitalaKompassen from './components/compass/DigitalaKompassen.jsx';
import GameWrapper from './components/games/GameWrapper.jsx';
import FinaleSequence from './components/finale/FinaleSequence.jsx';
import ResultModal from './components/modals/ResultModal.jsx';
import ErrorBoundary from './components/errors/ErrorBoundary.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';

/**
 * App.jsx - Central State Conductor för Framtidsbygget
 * 
 * Ansvarar för:
 * - Global state management (gameState, appState, uiState)
 * - Firebase synchronization
 * - Navigation between views
 * - Minispel lifecycle management
 * - FL-poäng beräkning och synergier
 */
const App = () => {
  // ============ STATE DECLARATIONS ============
  
  // Global game state (persistent)
  const [gameState, setGameState] = useState(null);
  
  // Session state (transient)
  const [appState, setAppState] = useState({
    currentView: 'loading',
    activeGame: null,
    previousView: null,
    isLoading: true,
    isSaving: false,
    error: null,
    networkStatus: 'online',
    sessionStartTime: Date.now(),
    unsavedChanges: false,
    showResultModal: false,
    lastGameResult: null,
    showAchievementToast: false,
    pendingAchievements: []
  });
  
  // UI state (transient)
  const [uiState, setUIState] = useState({
    modals: {
      settings: false,
      help: false,
      achievements: false,
      compass: false
    },
    animations: {
      scoreCountUp: false,
      mapUpdate: false,
      achievementPulse: false
    },
    onboardingStep: 1,
    screenSize: 'desktop',
    sidebarOpen: false,
    highContrast: false,
    reducedMotion: false,
    debugPanel: false,
    showPerformanceMetrics: false
  });

  // Refs for cleanup and performance
  const saveTimeoutRef = useRef(null);
  const analyticsTimeoutRef = useRef(null);

  // ============ INITIALIZATION ============

  useEffect(() => {
    initializeApp();
    setupEventListeners();
    
    return () => {
      cleanup();
    };
  }, []);

  const initializeApp = async () => {
    try {
      setAppState(prev => ({ ...prev, isLoading: true, error: null }));

      // Initialize Firebase authentication
      await FirebaseService.initAuth();
      
      // Load player data
      const playerData = await FirebaseService.loadPlayerData();
      
      // Set initial game state
      setGameState(playerData);
      
      // Determine initial view based on onboarding status
      const initialView = playerData.onboardingStatus === 'completed' ? 'dashboard' : 'onboarding';
      
      setAppState(prev => ({
        ...prev,
        currentView: initialView,
        isLoading: false,
        sessionStartTime: Date.now()
      }));

      // Log session start
      await logAnalyticsEvent('session_start', {
        onboardingStatus: playerData.onboardingStatus,
        totalFLScore: playerData.totalFLScore,
        completedWorlds: playerData.completedWorlds.length
      });

    } catch (error) {
      console.error('App initialization error:', error);
      setAppState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load game. Please refresh the page.'
      }));
    }
  };

  const setupEventListeners = () => {
    // Network status monitoring
    const handleOnline = () => setAppState(prev => ({ ...prev, networkStatus: 'online' }));
    const handleOffline = () => setAppState(prev => ({ ...prev, networkStatus: 'offline' }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Screen size detection
    const handleResize = () => {
      const width = window.innerWidth;
      let screenSize = 'desktop';
      if (width < 768) screenSize = 'mobile';
      else if (width < 1024) screenSize = 'tablet';
      
      setUIState(prev => ({ ...prev, screenSize }));
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  };

  // ============ GAME STATE MANAGEMENT ============

  const updateGameState = useCallback((updates, saveToFirebase = true) => {
    setGameState(prevState => {
      const newState = { ...prevState, ...updates };
      
      if (saveToFirebase) {
        // Debounced save to Firebase
        debouncedSave(newState);
        setAppState(prev => ({ ...prev, unsavedChanges: true }));
      }
      
      return newState;
    });
  }, []);

  const debouncedSave = useCallback((stateToSave) => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setAppState(prev => ({ ...prev, isSaving: true }));
        await FirebaseService.savePlayerData(stateToSave);
        setAppState(prev => ({ ...prev, isSaving: false, unsavedChanges: false }));
      } catch (error) {
        console.error('Save failed:', error);
        setAppState(prev => ({ 
          ...prev, 
          isSaving: false, 
          error: 'Failed to save progress. Your changes may be lost.' 
        }));
      }
    }, 1000); // 1 second debounce
  }, []);

  // ============ NAVIGATION MANAGEMENT ============

  const navigateTo = useCallback((view, options = {}) => {
    setAppState(prev => ({
      ...prev,
      previousView: prev.currentView,
      currentView: view,
      ...options
    }));
  }, []);

  const navigateBack = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      currentView: prev.previousView || 'dashboard',
      previousView: null
    }));
  }, []);

  // ============ ONBOARDING MANAGEMENT ============

  const advanceOnboarding = useCallback((nextStep) => {
    const updates = { onboardingStatus: nextStep };
    
    if (nextStep === 'completed') {
      updates.sessionCount = gameState.sessionCount + 1;
      navigateTo('dashboard');
      
      logAnalyticsEvent('onboarding_completed', {
        totalTime: Date.now() - appState.sessionStartTime
      });
    }
    
    updateGameState(updates);
  }, [gameState?.sessionCount, appState.sessionStartTime, navigateTo, updateGameState]);

  // ============ MINISPEL MANAGEMENT ============

  const handleSelectWorld = useCallback((worldId) => {
    // Check if world is already completed
    const isCompleted = gameState.completedWorlds.some(w => w.worldId === worldId);
    
    if (isCompleted) {
      // Show confirmation for replay
      if (window.confirm('Du har redan spelat detta spel. Vill du spela igen? (Detta påverkar inte dina poäng)')) {
        startGame(worldId, true);
      }
    } else {
      startGame(worldId, false);
    }
  }, [gameState?.completedWorlds]);

  const startGame = useCallback((worldId, isReplay) => {
    setAppState(prev => ({
      ...prev,
      activeGame: worldId,
      currentView: 'game'
    }));

    logAnalyticsEvent('game_start', {
      worldId,
      isReplay,
      currentFLScore: gameState.totalFLScore
    });
  }, [gameState?.totalFLScore]);

  const handleGameComplete = useCallback((result) => {
    const worldId = appState.activeGame;
    
    if (!worldId || !result) {
      console.error('Invalid game completion:', { worldId, result });
      return;
    }

    try {
      // Calculate FL-poäng according to GDD specification
      const scoreAwarded = calculateFLScore(worldId, result);
      
      // Create completion record
      const completionRecord = {
        worldId,
        status: 'completed',
        scoreAwarded,
        bestOutcome: result.outcome || (result.success ? 'Framgång' : 'Misslyckande'),
        completedAt: new Date().toISOString(),
        gameVersion: '1.0.0'
      };

      // Check if this is a new completion or replay
      const existingCompletion = gameState.completedWorlds.find(w => w.worldId === worldId);
      let updatedWorlds;
      let totalScoreUpdate = 0;

      if (existingCompletion) {
        // Replay - update if better score
        if (scoreAwarded > existingCompletion.scoreAwarded) {
          updatedWorlds = gameState.completedWorlds.map(w => 
            w.worldId === worldId ? completionRecord : w
          );
          totalScoreUpdate = scoreAwarded - existingCompletion.scoreAwarded;
        } else {
          updatedWorlds = gameState.completedWorlds;
          // No score update for worse performance
        }
      } else {
        // New completion
        updatedWorlds = [...gameState.completedWorlds, completionRecord];
        totalScoreUpdate = scoreAwarded;
      }

      // Check and unlock synergies
      const unlockedSynergies = checkAndUnlockSynergies(worldId, result, gameState.unlockedSynergies);
      
      // Check and unlock achievements
      const newAchievements = checkAchievements(gameState, completionRecord);

      // Update game state
      const updates = {
        completedWorlds: updatedWorlds,
        totalFLScore: gameState.totalFLScore + totalScoreUpdate,
        unlockedSynergies,
        unlockedAchievements: [...gameState.unlockedAchievements, ...newAchievements],
        lastUpdated: new Date().toISOString()
      };

      updateGameState(updates);

      // Update compass progress
      updateCompassProgress(worldId, result);

      // Show result modal
      setAppState(prev => ({
        ...prev,
        activeGame: null,
        currentView: 'dashboard',
        showResultModal: true,
        lastGameResult: {
          ...result,
          scoreAwarded,
          newAchievements,
          unlockedSynergies: Object.keys(unlockedSynergies).filter(key => 
            unlockedSynergies[key] && !gameState.unlockedSynergies[key]
          )
        }
      }));

      // Log completion
      logAnalyticsEvent('game_complete', {
        worldId,
        scoreAwarded,
        totalScore: gameState.totalFLScore + totalScoreUpdate,
        success: result.success,
        newAchievements: newAchievements.length,
        synergyUnlocked: Object.keys(unlockedSynergies).some(key => 
          unlockedSynergies[key] && !gameState.unlockedSynergies[key]
        )
      });

      // Check if all worlds completed for finale
      if (updatedWorlds.length === 5) {
        setTimeout(() => {
          navigateTo('finale');
        }, 3000); // Show result modal first
      }

    } catch (error) {
      console.error('Error processing game completion:', error);
      setAppState(prev => ({
        ...prev,
        error: 'Failed to process game results. Please try again.'
      }));
    }
  }, [appState.activeGame, gameState, updateGameState, navigateTo]);

  // ============ SCORING LOGIC ============

  const calculateFLScore = useCallback((worldId, result) => {
    // Implementation according to Master_GDD_Complete_Specification.md
    
    switch (worldId) {
      case 'pussel-spel-datasystem':
        return (result.success ? 1000 : 0) + 
               ((result.initialBudget - result.budgetSpent) * 2) + 
               (500 - (result.movesMade * 10));
               
      case 'valfards-dilemma':
        return (result.success ? 500 : 0) + 
               (((result.finalAutonomy + result.finalSecurity + result.finalStaffWellbeing) / 3) * 10) + 
               (result.outcome === 'Konsensus' ? 500 : 200);
               
      case 'kompetensresan':
        return (result.success ? 1000 : 0) + 
               (result.finalCompetence.base + result.finalCompetence.broad + (result.finalCompetence.specialist * 1.5)) + 
               (result.finalBudget * 0.5);
               
      case 'konnektivitetsvakten':
        return (result.success ? 800 : 0) + (result.finalIndex * 10) + result.buildPhaseScore;
        
      case 'ekosystembyggaren':
        return (result.success ? 1200 : 0) + Object.values(result.finalMetrics).reduce((a, b) => a + b, 0);
        
      default:
        console.warn(`Unknown worldId for score calculation: ${worldId}`);
        return 0;
    }
  }, []);

  const checkAndUnlockSynergies = useCallback((worldId, result, currentSynergies) => {
    const newSynergies = { ...currentSynergies };
    
    // Synergy unlock logic from Master GDD
    if (worldId === 'pussel-spel-datasystem' && calculateFLScore(worldId, result) > 1200) {
      newSynergies.synergy_expert_data_model = true;
    }
    
    if (worldId === 'valfards-dilemma' && result.outcome === 'Konsensus') {
      newSynergies.synergy_empathy_training = true;
    }
    
    if (worldId === 'kompetensresan' && result.finalCompetence?.specialist > 80) {
      newSynergies.synergy_skilled_workforce = true;
    }
    
    if (worldId === 'konnektivitetsvakten' && result.finalIndex > 90) {
      newSynergies.synergy_resilient_network = true;
    }
    
    return newSynergies;
  }, [calculateFLScore]);

  const checkAchievements = useCallback((currentGameState, completionRecord) => {
    const newAchievements = [];
    
    // Example achievement logic
    if (completionRecord.scoreAwarded > 1500 && !currentGameState.unlockedAchievements.includes('high_scorer')) {
      newAchievements.push('high_scorer');
    }
    
    if (currentGameState.completedWorlds.length === 0 && !currentGameState.unlockedAchievements.includes('first_victory')) {
      newAchievements.push('first_victory');
    }
    
    return newAchievements;
  }, []);

  const updateCompassProgress = useCallback((worldId, result) => {
    // Update Digital Compass nodes based on game completion
    const compassUpdates = {};
    
    // Example compass progression logic
    switch (worldId) {
      case 'pussel-spel-datasystem':
        compassUpdates.digital_kompetens = result.success ? 'mastered' : 'unlocked';
        compassUpdates.data_governance = 'unlocked';
        break;
      case 'valfards-dilemma':
        compassUpdates.ai_integration = result.success ? 'mastered' : 'unlocked';
        break;
      // Add more cases for other worlds
    }
    
    const updatedProgress = { ...gameState.compassProgress, ...compassUpdates };
    updateGameState({ compassProgress: updatedProgress }, false); // Update immediately, will be saved with main state
  }, [gameState?.compassProgress, updateGameState]);

  // ============ UTILITY FUNCTIONS ============

  const logAnalyticsEvent = useCallback(async (eventType, eventData = {}) => {
    if (!gameState?.analyticsOptIn) return;
    
    try {
      await FirebaseService.logGameEvent(eventType, {
        ...eventData,
        sessionId: appState.sessionStartTime,
        screenSize: uiState.screenSize,
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Analytics logging failed:', error);
      // Don't throw - analytics should never break gameplay
    }
  }, [gameState?.analyticsOptIn, appState.sessionStartTime, uiState.screenSize]);

  const cleanup = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (analyticsTimeoutRef.current) {
      clearTimeout(analyticsTimeoutRef.current);
    }
  }, []);

  // ============ UI EVENT HANDLERS ============

  const handleModalToggle = useCallback((modalName, isOpen) => {
    setUIState(prev => ({
      ...prev,
      modals: {
        ...prev.modals,
        [modalName]: isOpen
      }
    }));
  }, []);

  const handleCloseResultModal = useCallback(() => {
    setAppState(prev => ({
      ...prev,
      showResultModal: false,
      lastGameResult: null
    }));
  }, []);

  const handleError = useCallback((error) => {
    setAppState(prev => ({
      ...prev,
      error: error.message || 'An unexpected error occurred'
    }));
  }, []);

  // ============ RENDER LOGIC ============

  // Loading screen
  if (appState.isLoading || !gameState) {
    return <LoadingScreen message="Laddar Framtidsbygget..." />;
  }

  // Global error state
  if (appState.error) {
    return (
      <div className="app-error">
        <h2>Ett fel uppstod</h2>
        <p>{appState.error}</p>
        <button onClick={() => window.location.reload()}>
          Ladda om sidan
        </button>
      </div>
    );
  }

  // Main application render
  return (
    <ErrorBoundary onError={handleError}>
      <div className="app" data-screen-size={uiState.screenSize}>
        
        {/* Main Content */}
        {appState.currentView === 'onboarding' && (
          <OnboardingFlow
            gameState={gameState}
            onAdvanceOnboarding={advanceOnboarding}
            onComplete={() => navigateTo('dashboard')}
          />
        )}

        {appState.currentView === 'dashboard' && (
          <MainDashboard
            gameState={gameState}
            onSelectWorld={handleSelectWorld}
            onOpenCompass={() => navigateTo('compass')}
            onOpenSettings={() => handleModalToggle('settings', true)}
            networkStatus={appState.networkStatus}
            isSaving={appState.isSaving}
          />
        )}

        {appState.currentView === 'compass' && (
          <DigitalaKompassen
            compassProgress={gameState.compassProgress}
            unlockedSynergies={gameState.unlockedSynergies}
            onClose={navigateBack}
            onNodeClick={(nodeId) => console.log('Compass node clicked:', nodeId)}
          />
        )}

        {appState.currentView === 'game' && appState.activeGame && (
          <PixiErrorBoundary>
            <GameWrapper
              worldId={appState.activeGame}
              gameState={gameState}
              onGameComplete={handleGameComplete}
              onExit={navigateBack}
            />
          </PixiErrorBoundary>
        )}

        {appState.currentView === 'finale' && (
          <FinaleSequence
            gameState={gameState}
            onComplete={() => navigateTo('dashboard')}
            onRestart={() => {
              // Reset for new game
              setGameState(prev => ({
                ...prev,
                completedWorlds: [],
                totalFLScore: 0,
                unlockedAchievements: [],
                unlockedSynergies: {
                  synergy_expert_data_model: false,
                  synergy_empathy_training: false,
                  synergy_skilled_workforce: false,
                  synergy_resilient_network: false
                },
                compassProgress: {}
              }));
              navigateTo('dashboard');
            }}
          />
        )}

        {/* Modals */}
        {appState.showResultModal && appState.lastGameResult && (
          <ResultModal
            result={appState.lastGameResult}
            onClose={handleCloseResultModal}
          />
        )}

        {/* Network status indicator */}
        {appState.networkStatus === 'offline' && (
          <div className="network-status offline">
            Offline - ändringar sparas när anslutningen återställs
          </div>
        )}

        {/* Saving indicator */}
        {appState.isSaving && (
          <div className="saving-indicator">
            Sparar...
          </div>
        )}

      </div>
    </ErrorBoundary>
  );
};

export default App;
```

---

## State Hook Patterns

### Custom Hooks for State Management

Create reusable hooks för vanliga state patterns:

```javascript
// hooks/useGameState.js
import { useState, useCallback } from 'react';

/**
 * useGameState - Hook för lokal spelstate i minispel
 * Standardiserat pattern för alla minispel
 */
export const useGameState = (initialState, onComplete) => {
  const [state, setState] = useState(initialState);
  const [isComplete, setIsComplete] = useState(false);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const completeGame = useCallback((result) => {
    if (!isComplete) {
      setIsComplete(true);
      onComplete(result);
    }
  }, [isComplete, onComplete]);

  const resetGame = useCallback(() => {
    setState(initialState);
    setIsComplete(false);
  }, [initialState]);

  return {
    state,
    updateState,
    completeGame,
    resetGame,
    isComplete
  };
};

// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * useLocalStorage - Persistent local state för UI preferences
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setStoredValue];
};

// hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * useDebounce - Debounce state changes för performance
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

---

## Minispel State Patterns

### Standard Minispel Template

Template för alla minispel state management:

```javascript
// components/games/BaseGameComponent.jsx
import React from 'react';
import { useGameState } from '../../hooks/useGameState.js';

/**
 * BaseGameComponent - Template för alla minispel komponenter
 * Standardiserad struktur för state management
 */
const BaseGameComponent = ({ 
  initialData, 
  onGameComplete, 
  onExit,
  synergyBonuses = {} 
}) => {
  // Standard game state structure
  const initialGameState = {
    // Core game data
    isStarted: false,
    isPaused: false,
    isComplete: false,
    
    // Game metrics
    score: 0,
    moves: 0,
    timeElapsed: 0,
    
    // Game-specific state
    ...getGameSpecificInitialState(initialData),
    
    // Synergy bonuses
    activeBonuses: synergyBonuses
  };

  const {
    state: gameState,
    updateState: updateGameState,
    completeGame,
    resetGame
  } = useGameState(initialGameState, onGameComplete);

  // Game-specific logic goes here
  
  return (
    <div className="base-game-component">
      {/* Game UI implementation */}
    </div>
  );
};

// Example: PuzzleGameModule implementation
const PuzzleGameModule = ({ initialData, onGameComplete, onExit, synergyBonuses }) => {
  const initialGameState = {
    isStarted: false,
    isPaused: false,
    isComplete: false,
    
    // Puzzle-specific state
    budget: initialData.initialBudget || 10000,
    moves: 0,
    puzzlePieces: [],
    correctPlacements: 0,
    
    // Timer
    startTime: null,
    timeElapsed: 0,
    
    // Synergy bonuses
    activeBonuses: synergyBonuses
  };

  const {
    state: gameState,
    updateState: updateGameState,
    completeGame
  } = useGameState(initialGameState, (result) => {
    // Process result according to GDD specification
    const processedResult = {
      success: result.correctPlacements === gameState.puzzlePieces.length,
      budgetSpent: initialData.initialBudget - result.budget,
      movesMade: result.moves,
      timeSpent: result.timeElapsed,
      ...result
    };
    
    onGameComplete(processedResult);
  });

  // Specific game logic
  const handlePieceMove = useCallback((pieceId, newPosition) => {
    updateGameState({
      moves: gameState.moves + 1,
      budget: Math.max(0, gameState.budget - 10) // Cost per move
    });
    
    // Check if puzzle is complete
    checkPuzzleCompletion();
  }, [gameState.moves, gameState.budget, updateGameState]);

  const checkPuzzleCompletion = useCallback(() => {
    const correctCount = countCorrectPlacements();
    const isComplete = correctCount === gameState.puzzlePieces.length;
    
    if (isComplete) {
      const result = {
        correctPlacements: correctCount,
        budget: gameState.budget,
        moves: gameState.moves,
        timeElapsed: Date.now() - gameState.startTime
      };
      
      completeGame(result);
    }
  }, [gameState, completeGame]);

  // Component render logic
  return (
    <div className="puzzle-game-module">
      {/* Puzzle game UI */}
    </div>
  );
};

export default PuzzleGameModule;
```

---

## Error State Management

### Error Handling Patterns

```javascript
// components/errors/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to monitoring service
    if (this.props.onError) {
      this.props.onError(error);
    }

    // Log to Firebase Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
        custom_map: {
          component_stack: errorInfo.componentStack
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🛠️ Något gick fel</h2>
            <p>Ett tekniskt problem uppstod. Vi arbetar på att lösa det.</p>
            
            <div className="error-actions">
              <button 
                onClick={() => window.location.reload()}
                className="primary-button"
              >
                Ladda om sidan
              </button>
              
              <button 
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="secondary-button"
              >
                Försök igen
              </button>
            </div>

            {import.meta.env.VITE_NODE_ENV === 'development' && (
              <details className="error-details">
                <summary>Teknisk information (utvecklingsläge)</summary>
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

export default ErrorBoundary;
```

---

## Performance Optimization

### State Update Optimization

```javascript
// utils/stateOptimization.js

/**
 * State optimization utilities för performance
 */

// Memoization för dyra beräkningar
export const memoize = (fn) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  };
};

// Batch state updates för bättre performance
export class StateManager {
  constructor() {
    this.pendingUpdates = new Map();
    this.updateTimeoutId = null;
  }

  batchUpdate(component, updates) {
    // Merge with existing pending updates
    const existing = this.pendingUpdates.get(component) || {};
    this.pendingUpdates.set(component, { ...existing, ...updates });

    // Clear existing timeout
    if (this.updateTimeoutId) {
      clearTimeout(this.updateTimeoutId);
    }

    // Schedule batch update
    this.updateTimeoutId = setTimeout(() => {
      this.flushUpdates();
    }, 16); // Next frame
  }

  flushUpdates() {
    this.pendingUpdates.forEach((updates, component) => {
      if (component && typeof component.setState === 'function') {
        component.setState(updates);
      }
    });

    this.pendingUpdates.clear();
    this.updateTimeoutId = null;
  }
}

// Selektiv re-rendering för stora state objekt
export const createSelector = (stateSelector, equalityFn = Object.is) => {
  let lastState = {};
  let lastResult = null;

  return (state) => {
    const currentState = stateSelector(state);
    
    if (!equalityFn(currentState, lastState)) {
      lastState = currentState;
      lastResult = currentState;
    }
    
    return lastResult;
  };
};

// Deep comparison för objekt
export const deepEqual = (a, b) => {
  if (a === b) return true;
  
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b;
  }
  
  if (a === null || a === undefined || b === null || b === undefined) {
    return false;
  }
  
  if (a.prototype !== b.prototype) return false;
  
  let keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  
  return keys.every(k => deepEqual(a[k], b[k]));
};
```

---

## Testing State Management

### State Testing Utilities

```javascript
// utils/testUtils.js
import { render } from '@testing-library/react';
import React from 'react';

/**
 * Test utilities för state management komponenter
 */

// Mock Firebase Service för testing
export const mockFirebaseService = {
  initAuth: jest.fn().mockResolvedValue({}),
  loadPlayerData: jest.fn().mockResolvedValue({
    userId: 'test-user',
    totalFLScore: 0,
    onboardingStatus: 'not_started',
    completedWorlds: [],
    unlockedAchievements: [],
    unlockedSynergies: {
      synergy_expert_data_model: false,
      synergy_empathy_training: false,
      synergy_skilled_workforce: false,
      synergy_resilient_network: false
    },
    compassProgress: {},
    lastUpdated: null,
    gameVersion: '1.0.0',
    sessionCount: 1,
    analyticsOptIn: false,
    createdAt: null
  }),
  savePlayerData: jest.fn().mockResolvedValue(true),
  logGameEvent: jest.fn().mockResolvedValue(true)
};

// Test wrapper för komponenter som behöver gameState
export const GameStateProvider = ({ children, initialGameState = mockFirebaseService.loadPlayerData() }) => {
  const [gameState, setGameState] = React.useState(initialGameState);
  
  const updateGameState = React.useCallback((updates) => {
    setGameState(prev => ({ ...prev, ...updates }));
  }, []);

  return React.cloneElement(children, {
    gameState,
    updateGameState
  });
};

// Custom render för komponenter med state context
export const renderWithGameState = (ui, options = {}) => {
  const { initialGameState, ...renderOptions } = options;
  
  return render(
    <GameStateProvider initialGameState={initialGameState}>
      {ui}
    </GameStateProvider>,
    renderOptions
  );
};

// State assertion helpers
export const expectStateUpdate = (component, expectedState) => {
  expect(component.state).toMatchObject(expectedState);
};

export const expectGameStateUpdate = (mockUpdateFunction, expectedUpdates) => {
  expect(mockUpdateFunction).toHaveBeenCalledWith(
    expect.objectContaining(expectedUpdates)
  );
};
```

---

## State Architecture Checklist

### Implementation Checklist

- [ ] App.jsx implementerad som central state conductor
- [ ] gameState struktur följer Master GDD specifikation exakt
- [ ] Firebase synkronisering implementerad med debouncing
- [ ] Error boundaries för alla huvudvyer
- [ ] Minispel state patterns standardiserade
- [ ] Custom hooks för återanvändbar state logik
- [ ] Performance optimization med memoization
- [ ] Testing utilities för state management
- [ ] Offline state handling implementerad
- [ ] Analytics event tracking integrerat

### Performance Checklist

- [ ] State updates är batchade för bättre performance
- [ ] Onödiga re-renders minimerade med React.memo
- [ ] Stora state objekt använder selektiv uppdatering
- [ ] Memory leaks förhindrade med proper cleanup
- [ ] Debounced Firebase saves implementerade
- [ ] State persistence optimerad för snabba laddtider

### Security & Privacy Checklist

- [ ] Sensitive data never logged till console
- [ ] Analytics endast med user consent
- [ ] Local storage används säkert för preferences
- [ ] State sanitization för all user input
- [ ] Error states läcker ingen sensitive information

---

**State Management Complete:** Arkitekturen är nu redo för implementation med full skalbarhet, performance och säkerhet.