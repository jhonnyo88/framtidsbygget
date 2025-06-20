# React State Patterns - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready Implementation Patterns  
**Purpose:** Reusable state management patterns for AI implementation

---

## Executive Summary

This document provides copy-paste ready React state patterns specifically designed for Framtidsbygget's educational gaming platform. All patterns are optimized for AI implementation with extensive error handling and clear documentation.

## Table of Contents

1. [Context + Reducer Implementation](#context-reducer-implementation)
2. [Custom Hooks Library](#custom-hooks-library)
3. [Component Integration Templates](#component-integration-templates)
4. [State Testing Framework](#state-testing-framework)
5. [Debugging Guidelines](#debugging-guidelines)

---

## Context + Reducer Implementation

### Complete Global State Setup

```javascript
/**
 * gameReducer.js - Central state management
 * AI INSTRUCTIONS: This is the single source of truth for game state
 */
import { validateGameState, createInitialState } from './stateUtils';

// Action Types
export const ActionTypes = {
  // Navigation
  NAVIGATE: 'NAVIGATE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  
  // Game Progress
  START_GAME: 'START_GAME',
  UPDATE_GAME_STATE: 'UPDATE_GAME_STATE',
  COMPLETE_GAME: 'COMPLETE_GAME',
  
  // Scoring
  ADD_FL_SCORE: 'ADD_FL_SCORE',
  UPDATE_BEST_SCORE: 'UPDATE_BEST_SCORE',
  
  // Achievements
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  UPDATE_ACHIEVEMENT_PROGRESS: 'UPDATE_ACHIEVEMENT_PROGRESS',
  
  // Synergies
  UNLOCK_SYNERGY: 'UNLOCK_SYNERGY',
  UPDATE_SYNERGY_PROGRESS: 'UPDATE_SYNERGY_PROGRESS',
  
  // Compass
  UNLOCK_COMPASS_NODE: 'UNLOCK_COMPASS_NODE',
  MASTER_COMPASS_NODE: 'MASTER_COMPASS_NODE',
  
  // Preferences
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // Session
  UPDATE_SESSION: 'UPDATE_SESSION',
  SYNC_TO_FIREBASE: 'SYNC_TO_FIREBASE',
  RESTORE_FROM_FIREBASE: 'RESTORE_FROM_FIREBASE',
  
  // Error Handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State Factory
export const createInitialGameState = (userId = null) => ({
  // User Identity
  userId: userId || `anonymous_${Date.now()}`,
  createdAt: Date.now(),
  lastUpdated: Date.now(),
  version: '1.0.0',
  
  // Player Progress
  totalFLScore: 0,
  completedWorlds: [],
  currentWorld: null,
  
  // Onboarding
  onboardingStatus: {
    completed: false,
    currentStep: 'not_started',
    skipped: false,
    lastShown: null
  },
  
  // Achievements
  unlockedAchievements: [],
  achievementProgress: {},
  
  // Synergies
  unlockedSynergies: {
    dataFlowMastery: false,
    empathyExcellence: false,
    adaptiveCapability: false,
    resilientInfrastructure: false
  },
  synergyProgress: {},
  
  // Compass
  compassProgress: {},
  compassStats: {
    totalNodes: 25,
    unlockedNodes: 0,
    masteredNodes: 0,
    lastUpdated: null
  },
  
  // World Progress
  worldProgress: {
    puzzle: createWorldProgress('puzzle'),
    welfare: createWorldProgress('welfare'),
    competence: createWorldProgress('competence'),
    connectivity: createWorldProgress('connectivity'),
    ecosystem: createWorldProgress('ecosystem')
  },
  
  // UI State
  preferences: {
    soundEnabled: true,
    musicVolume: 0.7,
    effectsVolume: 0.8,
    language: 'sv',
    reducedMotion: false,
    highContrast: false
  },
  
  // Session
  session: {
    startTime: Date.now(),
    lastActivity: Date.now(),
    currentView: 'dashboard',
    modalStack: [],
    pendingSaves: [],
    errors: []
  }
});

// Helper function for world progress
function createWorldProgress(worldId) {
  return {
    completed: false,
    bestScore: 0,
    attempts: 0,
    lastPlayed: null,
    achievements: [],
    saveState: null
  };
}

// Main Reducer
export const gameReducer = (state, action) => {
  console.log('[GameReducer]', action.type, action.payload);
  
  try {
    switch (action.type) {
      // Navigation Actions
      case ActionTypes.NAVIGATE:
        return {
          ...state,
          session: {
            ...state.session,
            currentView: action.payload.view,
            lastActivity: Date.now()
          }
        };
        
      case ActionTypes.OPEN_MODAL:
        return {
          ...state,
          session: {
            ...state.session,
            modalStack: [...state.session.modalStack, action.payload.modalId],
            lastActivity: Date.now()
          }
        };
        
      case ActionTypes.CLOSE_MODAL:
        return {
          ...state,
          session: {
            ...state.session,
            modalStack: state.session.modalStack.slice(0, -1),
            lastActivity: Date.now()
          }
        };
      
      // Game Progress Actions
      case ActionTypes.START_GAME:
        return {
          ...state,
          currentWorld: action.payload.worldId,
          session: {
            ...state.session,
            currentView: 'game',
            lastActivity: Date.now()
          }
        };
        
      case ActionTypes.UPDATE_GAME_STATE:
        const { worldId, gameState } = action.payload;
        return {
          ...state,
          worldProgress: {
            ...state.worldProgress,
            [worldId]: {
              ...state.worldProgress[worldId],
              saveState: gameState,
              lastPlayed: Date.now()
            }
          },
          lastUpdated: Date.now()
        };
        
      case ActionTypes.COMPLETE_GAME:
        return handleGameCompletion(state, action.payload);
      
      // Score Actions
      case ActionTypes.ADD_FL_SCORE:
        return {
          ...state,
          totalFLScore: state.totalFLScore + action.payload.amount,
          lastUpdated: Date.now()
        };
        
      case ActionTypes.UPDATE_BEST_SCORE:
        const { worldId: world, score } = action.payload;
        return {
          ...state,
          worldProgress: {
            ...state.worldProgress,
            [world]: {
              ...state.worldProgress[world],
              bestScore: Math.max(state.worldProgress[world].bestScore, score)
            }
          },
          lastUpdated: Date.now()
        };
      
      // Achievement Actions
      case ActionTypes.UNLOCK_ACHIEVEMENT:
        if (state.unlockedAchievements.includes(action.payload.achievementId)) {
          return state; // Already unlocked
        }
        return {
          ...state,
          unlockedAchievements: [...state.unlockedAchievements, action.payload.achievementId],
          lastUpdated: Date.now()
        };
        
      case ActionTypes.UPDATE_ACHIEVEMENT_PROGRESS:
        const { achievementId, progress } = action.payload;
        return {
          ...state,
          achievementProgress: {
            ...state.achievementProgress,
            [achievementId]: {
              progress,
              maxProgress: action.payload.maxProgress || 100,
              lastUpdated: Date.now()
            }
          }
        };
      
      // Synergy Actions
      case ActionTypes.UNLOCK_SYNERGY:
        const { synergyId } = action.payload;
        return {
          ...state,
          unlockedSynergies: {
            ...state.unlockedSynergies,
            [synergyId]: true
          },
          lastUpdated: Date.now()
        };
      
      // Compass Actions
      case ActionTypes.UNLOCK_COMPASS_NODE:
        return updateCompassNode(state, action.payload.nodeId, 'unlocked');
        
      case ActionTypes.MASTER_COMPASS_NODE:
        return updateCompassNode(state, action.payload.nodeId, 'mastered');
      
      // Preference Actions
      case ActionTypes.UPDATE_PREFERENCES:
        return {
          ...state,
          preferences: {
            ...state.preferences,
            ...action.payload
          }
        };
      
      // Session Actions
      case ActionTypes.UPDATE_SESSION:
        return {
          ...state,
          session: {
            ...state.session,
            ...action.payload,
            lastActivity: Date.now()
          }
        };
      
      // Firebase Sync
      case ActionTypes.RESTORE_FROM_FIREBASE:
        return {
          ...state,
          ...action.payload,
          session: state.session // Keep current session
        };
      
      // Error Handling
      case ActionTypes.SET_ERROR:
        return {
          ...state,
          session: {
            ...state.session,
            errors: [...state.session.errors, {
              id: Date.now(),
              message: action.payload.message,
              code: action.payload.code,
              timestamp: Date.now()
            }]
          }
        };
        
      case ActionTypes.CLEAR_ERROR:
        return {
          ...state,
          session: {
            ...state.session,
            errors: state.session.errors.filter(e => e.id !== action.payload.errorId)
          }
        };
      
      default:
        console.warn('[GameReducer] Unknown action:', action.type);
        return state;
    }
  } catch (error) {
    console.error('[GameReducer] Error processing action:', error);
    return {
      ...state,
      session: {
        ...state.session,
        errors: [...state.session.errors, {
          id: Date.now(),
          message: `Reducer error: ${error.message}`,
          code: 'REDUCER_ERROR',
          timestamp: Date.now()
        }]
      }
    };
  }
};

// Helper Functions
function handleGameCompletion(state, completionData) {
  const { worldId, score, outcome, metrics } = completionData;
  
  // Update completed worlds
  const completedWorlds = state.completedWorlds.includes(worldId)
    ? state.completedWorlds
    : [...state.completedWorlds, worldId];
  
  // Update world progress
  const worldProgress = {
    ...state.worldProgress,
    [worldId]: {
      ...state.worldProgress[worldId],
      completed: true,
      bestScore: Math.max(state.worldProgress[worldId].bestScore, score),
      attempts: state.worldProgress[worldId].attempts + 1,
      lastPlayed: Date.now(),
      saveState: null // Clear save state after completion
    }
  };
  
  // Calculate new total score
  const totalFLScore = state.totalFLScore + score;
  
  return {
    ...state,
    totalFLScore,
    completedWorlds,
    worldProgress,
    currentWorld: null,
    lastUpdated: Date.now(),
    session: {
      ...state.session,
      currentView: 'result',
      lastActivity: Date.now()
    }
  };
}

function updateCompassNode(state, nodeId, status) {
  const previousStatus = state.compassProgress[nodeId] || 'locked';
  
  if (previousStatus === status) return state; // No change
  
  const compassProgress = {
    ...state.compassProgress,
    [nodeId]: status
  };
  
  // Update stats
  const unlockedNodes = Object.values(compassProgress).filter(s => s !== 'locked').length;
  const masteredNodes = Object.values(compassProgress).filter(s => s === 'mastered').length;
  
  return {
    ...state,
    compassProgress,
    compassStats: {
      ...state.compassStats,
      unlockedNodes,
      masteredNodes,
      lastUpdated: Date.now()
    },
    lastUpdated: Date.now()
  };
}
```

### Context Provider Implementation

```javascript
/**
 * GameStateProvider.jsx - Context provider with performance optimizations
 * AI INSTRUCTIONS: Wrap your app with this provider
 */
import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react';
import { gameReducer, createInitialGameState, ActionTypes } from './gameReducer';
import { useFirebaseSync } from './hooks/useFirebaseSync';
import { useAutoSave } from './hooks/useAutoSave';
import { useErrorRecovery } from './hooks/useErrorRecovery';

// Create contexts
const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);
const GameSelectorsContext = createContext(null);

// Custom error for context usage
class ContextError extends Error {
  constructor(contextName) {
    super(`use${contextName} must be used within GameStateProvider`);
    this.name = 'ContextError';
  }
}

// Main Provider Component
export const GameStateProvider = ({ children, userId = null }) => {
  // Initialize state
  const [state, dispatch] = useReducer(
    gameReducer,
    userId,
    (id) => createInitialGameState(id)
  );
  
  // Enhanced dispatch with logging
  const enhancedDispatch = useCallback((action) => {
    console.log('[GameState] Dispatching:', action.type, action.payload);
    
    // Add timestamp to all actions
    const enhancedAction = {
      ...action,
      timestamp: Date.now()
    };
    
    dispatch(enhancedAction);
  }, []);
  
  // Memoized selectors for performance
  const selectors = useMemo(() => ({
    // Progress selectors
    getWorldStatus: (worldId) => {
      const progress = state.worldProgress[worldId];
      return {
        isCompleted: progress?.completed || false,
        isLocked: !isWorldAvailable(worldId, state),
        bestScore: progress?.bestScore || 0,
        attempts: progress?.attempts || 0,
        hasPlayed: progress?.attempts > 0
      };
    },
    
    // Score selectors
    getTotalProgress: () => {
      const completed = state.completedWorlds.length;
      const total = 5;
      return {
        completed,
        total,
        percentage: (completed / total) * 100,
        isComplete: completed === total
      };
    },
    
    // Achievement selectors
    getAchievementProgress: (achievementId) => {
      return state.achievementProgress[achievementId] || {
        progress: 0,
        maxProgress: 100,
        percentage: 0
      };
    },
    
    // UI selectors
    getCurrentModal: () => {
      const stack = state.session.modalStack;
      return stack.length > 0 ? stack[stack.length - 1] : null;
    },
    
    hasErrors: () => state.session.errors.length > 0,
    
    getLatestError: () => {
      const errors = state.session.errors;
      return errors.length > 0 ? errors[errors.length - 1] : null;
    }
  }), [state]);
  
  // Firebase sync
  useFirebaseSync(state, enhancedDispatch);
  
  // Auto-save
  useAutoSave(state);
  
  // Error recovery
  useErrorRecovery(state, enhancedDispatch);
  
  // Performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[GameState] State size:', 
        new Blob([JSON.stringify(state)]).size / 1024, 'KB'
      );
    }
  }, [state]);
  
  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={enhancedDispatch}>
        <GameSelectorsContext.Provider value={selectors}>
          {children}
        </GameSelectorsContext.Provider>
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
};

// Hook exports
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) throw new ContextError('GameState');
  return context;
};

export const useGameDispatch = () => {
  const context = useContext(GameDispatchContext);
  if (!context) throw new ContextError('GameDispatch');
  return context;
};

export const useGameSelectors = () => {
  const context = useContext(GameSelectorsContext);
  if (!context) throw new ContextError('GameSelectors');
  return context;
};

// Combined hook for convenience
export const useGame = () => {
  const state = useGameState();
  const dispatch = useGameDispatch();
  const selectors = useGameSelectors();
  
  return { state, dispatch, selectors };
};

// Utility function
function isWorldAvailable(worldId, state) {
  // All worlds are available from start in Framtidsbygget
  return true;
}
```

---

## Custom Hooks Library

### Game Progress Hooks

```javascript
/**
 * useGameProgress.js - Hooks for game progress management
 */
import { useCallback } from 'react';
import { useGame } from '../GameStateProvider';
import { ActionTypes } from '../gameReducer';

export const useGameProgress = (worldId) => {
  const { state, dispatch, selectors } = useGame();
  
  const worldStatus = selectors.getWorldStatus(worldId);
  const worldProgress = state.worldProgress[worldId];
  
  const startGame = useCallback(() => {
    dispatch({
      type: ActionTypes.START_GAME,
      payload: { worldId }
    });
  }, [dispatch, worldId]);
  
  const updateGameState = useCallback((gameState) => {
    dispatch({
      type: ActionTypes.UPDATE_GAME_STATE,
      payload: { worldId, gameState }
    });
  }, [dispatch, worldId]);
  
  const completeGame = useCallback((result) => {
    dispatch({
      type: ActionTypes.COMPLETE_GAME,
      payload: {
        worldId,
        score: result.score,
        outcome: result.outcome,
        metrics: result.metrics
      }
    });
  }, [dispatch, worldId]);
  
  return {
    ...worldStatus,
    progress: worldProgress,
    startGame,
    updateGameState,
    completeGame
  };
};

// Hook for tracking overall progress
export const useOverallProgress = () => {
  const { state, selectors } = useGame();
  
  const progress = selectors.getTotalProgress();
  const nextWorld = useMemo(() => {
    // Suggest next world based on completion
    const worlds = ['puzzle', 'welfare', 'competence', 'connectivity', 'ecosystem'];
    return worlds.find(w => !state.completedWorlds.includes(w)) || null;
  }, [state.completedWorlds]);
  
  return {
    ...progress,
    nextWorld,
    canAccessFinale: progress.isComplete,
    totalScore: state.totalFLScore
  };
};
```

### Animation Hooks

```javascript
/**
 * useAnimations.js - Reusable animation hooks
 */
import { useState, useEffect, useRef, useCallback } from 'react';

// Score counter animation
export const useScoreAnimation = (targetScore, duration = 1000) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (targetScore === displayScore) return;
    
    setIsAnimating(true);
    const startScore = displayScore;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentScore = Math.floor(
        startScore + (targetScore - startScore) * easeOutCubic
      );
      
      setDisplayScore(currentScore);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetScore, duration]);
  
  return { displayScore, isAnimating };
};

// Modal animation states
export const useModalAnimation = (isOpen) => {
  const [animationState, setAnimationState] = useState('closed');
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready
      requestAnimationFrame(() => {
        setAnimationState('opening');
        setTimeout(() => setAnimationState('open'), 300);
      });
    } else if (animationState !== 'closed') {
      setAnimationState('closing');
      setTimeout(() => {
        setAnimationState('closed');
        setShouldRender(false);
      }, 300);
    }
  }, [isOpen]);
  
  return { animationState, shouldRender };
};

// Progress bar animation
export const useProgressAnimation = (progress, duration = 500) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const progressRef = useRef(displayProgress);
  
  useEffect(() => {
    const startProgress = progressRef.current;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const animProgress = Math.min(elapsed / duration, 1);
      
      const currentProgress = startProgress + 
        (progress - startProgress) * animProgress;
      
      setDisplayProgress(currentProgress);
      progressRef.current = currentProgress;
      
      if (animProgress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [progress, duration]);
  
  return displayProgress;
};
```

### Modal Management Hooks

```javascript
/**
 * useModals.js - Modal state management
 */
import { useCallback } from 'react';
import { useGame } from '../GameStateProvider';
import { ActionTypes } from '../gameReducer';

export const useModal = (modalId) => {
  const { state, dispatch, selectors } = useGame();
  
  const isOpen = selectors.getCurrentModal() === modalId;
  
  const open = useCallback(() => {
    dispatch({
      type: ActionTypes.OPEN_MODAL,
      payload: { modalId }
    });
  }, [dispatch, modalId]);
  
  const close = useCallback(() => {
    if (isOpen) {
      dispatch({ type: ActionTypes.CLOSE_MODAL });
    }
  }, [dispatch, isOpen]);
  
  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);
  
  return { isOpen, open, close, toggle };
};

// Global modal management
export const useModalManager = () => {
  const { state, dispatch } = useGame();
  const modalStack = state.session.modalStack;
  
  const openModal = useCallback((modalId) => {
    dispatch({
      type: ActionTypes.OPEN_MODAL,
      payload: { modalId }
    });
  }, [dispatch]);
  
  const closeModal = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_MODAL });
  }, [dispatch]);
  
  const closeAllModals = useCallback(() => {
    // Close all modals in the stack
    modalStack.forEach(() => {
      dispatch({ type: ActionTypes.CLOSE_MODAL });
    });
  }, [dispatch, modalStack]);
  
  return {
    currentModal: modalStack[modalStack.length - 1] || null,
    modalStack,
    openModal,
    closeModal,
    closeAllModals,
    hasOpenModals: modalStack.length > 0
  };
};
```

### Preference Hooks

```javascript
/**
 * usePreferences.js - User preference management
 */
import { useCallback, useEffect } from 'react';
import { useGame } from '../GameStateProvider';
import { ActionTypes } from '../gameReducer';

export const usePreferences = () => {
  const { state, dispatch } = useGame();
  const preferences = state.preferences;
  
  const updatePreference = useCallback((key, value) => {
    dispatch({
      type: ActionTypes.UPDATE_PREFERENCES,
      payload: { [key]: value }
    });
  }, [dispatch]);
  
  const updatePreferences = useCallback((updates) => {
    dispatch({
      type: ActionTypes.UPDATE_PREFERENCES,
      payload: updates
    });
  }, [dispatch]);
  
  // Sound preference shortcuts
  const toggleSound = useCallback(() => {
    updatePreference('soundEnabled', !preferences.soundEnabled);
  }, [updatePreference, preferences.soundEnabled]);
  
  const setVolume = useCallback((volumeType, value) => {
    updatePreference(volumeType, Math.max(0, Math.min(1, value)));
  }, [updatePreference]);
  
  // Accessibility shortcuts
  const toggleReducedMotion = useCallback(() => {
    updatePreference('reducedMotion', !preferences.reducedMotion);
  }, [updatePreference, preferences.reducedMotion]);
  
  const toggleHighContrast = useCallback(() => {
    updatePreference('highContrast', !preferences.highContrast);
  }, [updatePreference, preferences.highContrast]);
  
  // Apply preferences to DOM
  useEffect(() => {
    document.body.classList.toggle('reduced-motion', preferences.reducedMotion);
    document.body.classList.toggle('high-contrast', preferences.highContrast);
  }, [preferences.reducedMotion, preferences.highContrast]);
  
  return {
    preferences,
    updatePreference,
    updatePreferences,
    toggleSound,
    setVolume,
    toggleReducedMotion,
    toggleHighContrast
  };
};

// Language preference hook
export const useLanguage = () => {
  const { preferences, updatePreference } = usePreferences();
  
  const setLanguage = useCallback((language) => {
    updatePreference('language', language);
    // Update i18n instance if needed
    // i18n.setLanguage(language);
  }, [updatePreference]);
  
  return {
    currentLanguage: preferences.language,
    setLanguage,
    isSwedish: preferences.language === 'sv',
    isEnglish: preferences.language === 'en'
  };
};
```

---

## Component Integration Templates

### Game Module Template

```javascript
/**
 * GameModuleTemplate.jsx - Template for integrating game modules
 * AI INSTRUCTIONS: Copy this template for each game module
 */
import React, { useState, useEffect } from 'react';
import { GameCanvasWrapper } from '@/components/games/GameCanvasWrapper';
import { useGameProgress } from '@/hooks/useGameProgress';
import { useModal } from '@/hooks/useModal';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const GameModuleTemplate = ({ worldId, gameType }) => {
  // State management
  const {
    progress,
    isCompleted,
    bestScore,
    startGame,
    updateGameState,
    completeGame
  } = useGameProgress(worldId);
  
  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [gameInstance, setGameInstance] = useState(null);
  const pauseModal = useModal('pause');
  
  // Start game on mount
  useEffect(() => {
    startGame();
    
    return () => {
      // Cleanup on unmount
      if (gameInstance) {
        gameInstance.pause();
      }
    };
  }, [startGame]);
  
  // Handle game ready
  const handleGameReady = (instance) => {
    setGameInstance(instance);
    setIsLoading(false);
  };
  
  // Handle state updates from PixiJS
  const handleStateChange = (updates) => {
    updateGameState(updates);
  };
  
  // Handle game completion
  const handleGameComplete = (result) => {
    completeGame(result);
    // Will automatically navigate to results
  };
  
  // Handle pause
  const handlePause = () => {
    if (gameInstance) {
      gameInstance.pause();
      pauseModal.open();
    }
  };
  
  return (
    <ErrorBoundary fallback={<GameErrorFallback />}>
      <div className="game-module">
        <div className="game-header">
          <button onClick={handlePause} className="pause-button">
            Pausa
          </button>
          <div className="score-display">
            Bästa: {bestScore} FL-poäng
          </div>
        </div>
        
        {isLoading && <LoadingScreen />}
        
        <GameCanvasWrapper
          gameType={gameType}
          initialState={progress?.saveState}
          onReady={handleGameReady}
          onStateChange={handleStateChange}
          onComplete={handleGameComplete}
          onError={(error) => console.error('Game error:', error)}
          className="game-canvas"
          style={{ opacity: isLoading ? 0 : 1 }}
        />
        
        {pauseModal.isOpen && (
          <PauseModal
            onResume={() => {
              gameInstance?.resume();
              pauseModal.close();
            }}
            onQuit={() => {
              // Navigate back to dashboard
              window.location.href = '/';
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default GameModuleTemplate;
```

### Dashboard Integration Template

```javascript
/**
 * DashboardTemplate.jsx - Template for dashboard components
 */
import React from 'react';
import { useOverallProgress } from '@/hooks/useOverallProgress';
import { useModalManager } from '@/hooks/useModals';
import { useNavigate } from 'react-router-dom';

const DashboardTemplate = () => {
  const navigate = useNavigate();
  const progress = useOverallProgress();
  const { openModal } = useModalManager();
  
  const handleWorldSelect = (worldId) => {
    navigate(`/game/${worldId}`);
  };
  
  const handleCompassOpen = () => {
    openModal('compass');
  };
  
  const handleAchievementsOpen = () => {
    openModal('achievements');
  };
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Framtidsbygget</h1>
        <div className="score-summary">
          <span className="total-score">{progress.totalScore}</span>
          <span className="score-label">FL-poäng</span>
        </div>
      </header>
      
      <main className="dashboard-content">
        <section className="progress-overview">
          <h2>Din Resa</h2>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
          <p>{progress.completed} av {progress.total} uppdrag slutförda</p>
        </section>
        
        <section className="world-selection">
          <h2>Välj Uppdrag</h2>
          <div className="world-grid">
            {WORLDS.map(world => (
              <WorldCard
                key={world.id}
                world={world}
                isCompleted={progress.completedWorlds.includes(world.id)}
                onClick={() => handleWorldSelect(world.id)}
              />
            ))}
          </div>
        </section>
        
        <section className="quick-actions">
          <button onClick={handleCompassOpen}>
            Öppna Digitala Kompassen
          </button>
          <button onClick={handleAchievementsOpen}>
            Visa Utmärkelser
          </button>
          {progress.canAccessFinale && (
            <button onClick={() => navigate('/finale')} className="finale-button">
              Starta Finalen!
            </button>
          )}
        </section>
      </main>
    </div>
  );
};
```

### Modal Integration Template

```javascript
/**
 * ModalTemplate.jsx - Template for modal components
 */
import React from 'react';
import { useModal } from '@/hooks/useModal';
import { useModalAnimation } from '@/hooks/useAnimations';

const ModalTemplate = ({ modalId, title, children }) => {
  const { isOpen, close } = useModal(modalId);
  const { animationState, shouldRender } = useModalAnimation(isOpen);
  
  if (!shouldRender) return null;
  
  return (
    <div 
      className={`modal-backdrop modal-${animationState}`}
      onClick={close}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{title}</h2>
          <button 
            className="modal-close"
            onClick={close}
            aria-label="Stäng"
          >
            ×
          </button>
        </header>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

// Example usage
const AchievementsModal = () => {
  const { state } = useGameState();
  
  return (
    <ModalTemplate modalId="achievements" title="Dina Utmärkelser">
      <div className="achievements-grid">
        {state.unlockedAchievements.map(achievementId => (
          <AchievementCard
            key={achievementId}
            achievementId={achievementId}
          />
        ))}
      </div>
    </ModalTemplate>
  );
};
```

---

## State Testing Framework

### Unit Test Patterns

```javascript
/**
 * gameReducer.test.js - Reducer unit tests
 */
import { gameReducer, ActionTypes, createInitialGameState } from '../gameReducer';

describe('gameReducer', () => {
  let initialState;
  
  beforeEach(() => {
    initialState = createInitialGameState('test-user');
  });
  
  describe('Navigation Actions', () => {
    test('NAVIGATE updates current view', () => {
      const action = {
        type: ActionTypes.NAVIGATE,
        payload: { view: 'game' }
      };
      
      const newState = gameReducer(initialState, action);
      
      expect(newState.session.currentView).toBe('game');
      expect(newState.session.lastActivity).toBeGreaterThan(initialState.session.lastActivity);
    });
    
    test('OPEN_MODAL adds to modal stack', () => {
      const action = {
        type: ActionTypes.OPEN_MODAL,
        payload: { modalId: 'achievements' }
      };
      
      const newState = gameReducer(initialState, action);
      
      expect(newState.session.modalStack).toContain('achievements');
      expect(newState.session.modalStack).toHaveLength(1);
    });
    
    test('CLOSE_MODAL removes from modal stack', () => {
      const stateWithModal = {
        ...initialState,
        session: {
          ...initialState.session,
          modalStack: ['achievements', 'settings']
        }
      };
      
      const action = { type: ActionTypes.CLOSE_MODAL };
      const newState = gameReducer(stateWithModal, action);
      
      expect(newState.session.modalStack).toEqual(['achievements']);
    });
  });
  
  describe('Game Progress Actions', () => {
    test('COMPLETE_GAME updates all relevant state', () => {
      const action = {
        type: ActionTypes.COMPLETE_GAME,
        payload: {
          worldId: 'puzzle',
          score: 1500,
          outcome: 'perfect',
          metrics: { budget: 100, moves: 5 }
        }
      };
      
      const newState = gameReducer(initialState, action);
      
      expect(newState.completedWorlds).toContain('puzzle');
      expect(newState.worldProgress.puzzle.completed).toBe(true);
      expect(newState.worldProgress.puzzle.bestScore).toBe(1500);
      expect(newState.totalFLScore).toBe(1500);
      expect(newState.currentWorld).toBeNull();
    });
    
    test('COMPLETE_GAME does not duplicate completed worlds', () => {
      const stateWithCompleted = {
        ...initialState,
        completedWorlds: ['puzzle'],
        worldProgress: {
          ...initialState.worldProgress,
          puzzle: {
            ...initialState.worldProgress.puzzle,
            completed: true,
            bestScore: 1000
          }
        }
      };
      
      const action = {
        type: ActionTypes.COMPLETE_GAME,
        payload: {
          worldId: 'puzzle',
          score: 1500,
          outcome: 'perfect',
          metrics: {}
        }
      };
      
      const newState = gameReducer(stateWithCompleted, action);
      
      expect(newState.completedWorlds).toHaveLength(1);
      expect(newState.worldProgress.puzzle.bestScore).toBe(1500);
    });
  });
  
  describe('Error Handling', () => {
    test('Invalid action type returns current state', () => {
      const action = { type: 'INVALID_ACTION' };
      const newState = gameReducer(initialState, action);
      
      expect(newState).toBe(initialState);
    });
    
    test('Reducer errors are caught and logged', () => {
      const action = {
        type: ActionTypes.ADD_FL_SCORE,
        payload: { amount: 'invalid' } // Should be number
      };
      
      const newState = gameReducer(initialState, action);
      
      expect(newState.session.errors).toHaveLength(1);
      expect(newState.session.errors[0].code).toBe('REDUCER_ERROR');
    });
  });
});
```

### Hook Testing Patterns

```javascript
/**
 * hooks.test.js - Custom hook tests
 */
import { renderHook, act } from '@testing-library/react-hooks';
import { GameStateProvider } from '../GameStateProvider';
import { useGameProgress } from '../hooks/useGameProgress';
import { useScoreAnimation } from '../hooks/useAnimations';

// Wrapper for hooks that need context
const wrapper = ({ children }) => (
  <GameStateProvider userId="test-user">
    {children}
  </GameStateProvider>
);

describe('useGameProgress', () => {
  test('provides world progress data', () => {
    const { result } = renderHook(
      () => useGameProgress('puzzle'),
      { wrapper }
    );
    
    expect(result.current.isCompleted).toBe(false);
    expect(result.current.bestScore).toBe(0);
    expect(result.current.attempts).toBe(0);
  });
  
  test('startGame updates current world', () => {
    const { result } = renderHook(
      () => useGameProgress('puzzle'),
      { wrapper }
    );
    
    act(() => {
      result.current.startGame();
    });
    
    // Would need to also test the context state
    expect(result.current).toBeDefined();
  });
  
  test('completeGame updates progress', async () => {
    const { result } = renderHook(
      () => useGameProgress('puzzle'),
      { wrapper }
    );
    
    await act(async () => {
      result.current.completeGame({
        score: 1500,
        outcome: 'perfect',
        metrics: {}
      });
    });
    
    // Re-render to get updated state
    expect(result.current.isCompleted).toBe(true);
  });
});

describe('useScoreAnimation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });
  
  test('animates score from 0 to target', () => {
    const { result } = renderHook(() => 
      useScoreAnimation(1000, 1000)
    );
    
    expect(result.current.displayScore).toBe(0);
    expect(result.current.isAnimating).toBe(true);
    
    // Fast-forward animation
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current.displayScore).toBeGreaterThan(0);
    expect(result.current.displayScore).toBeLessThan(1000);
    
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    expect(result.current.displayScore).toBe(1000);
    expect(result.current.isAnimating).toBe(false);
  });
});
```

### Integration Test Patterns

```javascript
/**
 * integration.test.js - Full flow tests
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameStateProvider } from '../GameStateProvider';
import Dashboard from '../components/Dashboard';
import PuzzleGameModule from '../components/games/PuzzleGameModule';

// Mock PixiJS for testing
jest.mock('@/components/games/GameCanvasWrapper', () => ({
  GameCanvasWrapper: ({ onReady, onComplete }) => {
    React.useEffect(() => {
      onReady({ pause: jest.fn(), resume: jest.fn() });
    }, [onReady]);
    
    return (
      <div data-testid="game-canvas">
        <button onClick={() => onComplete({ score: 1500 })}>
          Complete Game
        </button>
      </div>
    );
  }
}));

describe('Game Flow Integration', () => {
  test('Complete game flow from dashboard to results', async () => {
    const user = userEvent.setup();
    
    render(
      <GameStateProvider userId="test-user">
        <Dashboard />
      </GameStateProvider>
    );
    
    // Start from dashboard
    expect(screen.getByText('Framtidsbygget')).toBeInTheDocument();
    expect(screen.getByText('0 FL-poäng')).toBeInTheDocument();
    
    // Select puzzle game
    const puzzleCard = screen.getByText('Säker Datasystem');
    await user.click(puzzleCard);
    
    // Game should start
    await waitFor(() => {
      expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
    });
    
    // Complete the game
    const completeButton = screen.getByText('Complete Game');
    await user.click(completeButton);
    
    // Should show results
    await waitFor(() => {
      expect(screen.getByText('1500 FL-poäng')).toBeInTheDocument();
    });
  });
});
```

---

## Debugging Guidelines

### State Debugging Tools

```javascript
/**
 * StateDebugger.jsx - Development tool for state inspection
 */
import React, { useState } from 'react';
import { useGameState } from '../GameStateProvider';

const StateDebugger = () => {
  const state = useGameState();
  const [expandedSections, setExpandedSections] = useState({});
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <div className="state-debugger">
      <h3>State Debugger</h3>
      
      <section>
        <button onClick={() => toggleSection('user')}>
          User State {expandedSections.user ? '−' : '+'}
        </button>
        {expandedSections.user && (
          <pre>{JSON.stringify({
            userId: state.userId,
            totalFLScore: state.totalFLScore,
            completedWorlds: state.completedWorlds
          }, null, 2)}</pre>
        )}
      </section>
      
      <section>
        <button onClick={() => toggleSection('progress')}>
          Progress State {expandedSections.progress ? '−' : '+'}
        </button>
        {expandedSections.progress && (
          <pre>{JSON.stringify(state.worldProgress, null, 2)}</pre>
        )}
      </section>
      
      <section>
        <button onClick={() => toggleSection('session')}>
          Session State {expandedSections.session ? '−' : '+'}
        </button>
        {expandedSections.session && (
          <pre>{JSON.stringify(state.session, null, 2)}</pre>
        )}
      </section>
      
      <section>
        <button onClick={() => downloadState(state)}>
          Download State Snapshot
        </button>
      </section>
    </div>
  );
};

function downloadState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `game-state-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
```

### Redux DevTools Integration

```javascript
/**
 * devtools.js - Redux DevTools integration for debugging
 */
export const connectToDevTools = (reducer, initialState) => {
  if (typeof window === 'undefined' || !window.__REDUX_DEVTOOLS_EXTENSION__) {
    return reducer;
  }
  
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
    name: 'Framtidsbygget Game State',
    features: {
      pause: true,
      lock: true,
      persist: true,
      export: true,
      import: 'custom',
      jump: true,
      skip: false,
      reorder: false,
      dispatch: true,
      test: true
    }
  });
  
  return (state, action) => {
    const newState = reducer(state, action);
    
    devTools.send(action, newState);
    
    return newState;
  };
};
```

### Common Issues & Solutions

```javascript
/**
 * troubleshooting.js - Common state management issues
 */

// Issue: State updates not reflecting in UI
export const debugStateUpdates = () => {
  console.group('State Update Debugging');
  console.log('1. Check if component is wrapped in GameStateProvider');
  console.log('2. Verify useGameState hook is called inside provider');
  console.log('3. Check if state path is correct');
  console.log('4. Enable React DevTools Profiler to check re-renders');
  console.groupEnd();
};

// Issue: Performance problems with frequent updates
export const debugPerformance = () => {
  // Add performance marks
  performance.mark('state-update-start');
  
  // After update
  performance.mark('state-update-end');
  performance.measure(
    'state-update',
    'state-update-start',
    'state-update-end'
  );
  
  const measure = performance.getEntriesByName('state-update')[0];
  console.log(`State update took: ${measure.duration}ms`);
};

// Issue: Memory leaks
export const detectMemoryLeaks = () => {
  const checkInterval = setInterval(() => {
    if (performance.memory) {
      const mb = performance.memory.usedJSHeapSize / 1048576;
      console.log(`Memory usage: ${mb.toFixed(2)} MB`);
      
      if (mb > 500) {
        console.warn('High memory usage detected!');
      }
    }
  }, 5000);
  
  return () => clearInterval(checkInterval);
};
```

---

## Best Practices Summary

### Do's
- ✅ Use provided hooks instead of direct context access
- ✅ Batch related state updates
- ✅ Memoize expensive calculations
- ✅ Test state logic separately from components
- ✅ Use TypeScript for state type safety

### Don'ts
- ❌ Don't mutate state directly
- ❌ Don't store derived state
- ❌ Don't put non-serializable values in state
- ❌ Don't trigger effects in reducers
- ❌ Don't forget cleanup in useEffect

---

*Last Updated: 2025-06-20*  
*Pattern Library Version: 1.0*  
*Optimized for AI Implementation*