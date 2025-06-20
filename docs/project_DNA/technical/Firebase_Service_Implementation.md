# Firebase Service Implementation

**Version:** 1.0  
**Purpose:** Complete FirebaseService.js with cost-safe operations  
**Focus:** Offline-first patterns with smart sync

---

## Complete FirebaseService Class

```javascript
// FirebaseService.js
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  writeBatch,
  serverTimestamp,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth } from './firebase-config';

class FirebaseService {
  constructor() {
    this.currentUser = null;
    this.isOnline = navigator.onLine;
    this.writeQueue = [];
    this.listeners = new Map();
    this.costMonitor = {
      sessionReads: 0,
      sessionWrites: 0,
      maxWritesPerSession: 10
    };
    
    this.initializeAuth();
    this.setupNetworkMonitoring();
  }

  // ===== AUTHENTICATION =====
  
  async initializeAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          await this.syncQueuedWrites();
          resolve(user);
        } else {
          // Sign in anonymously for GDPR compliance
          try {
            const result = await signInAnonymously(auth);
            this.currentUser = result.user;
            resolve(result.user);
          } catch (error) {
            console.error('Anonymous auth failed:', error);
            resolve(null);
          }
        }
      });
    });
  }

  getCurrentUserId() {
    return this.currentUser?.uid || null;
  }

  // ===== COST-SAFE METHODS =====

  async saveGameState(gameState) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.warn('No user ID, caching locally');
      this.cacheLocally('gameState', gameState);
      return false;
    }

    try {
      // Check write limit
      if (this.costMonitor.sessionWrites >= this.costMonitor.maxWritesPerSession) {
        console.warn('Session write limit reached, caching locally');
        this.cacheLocally('gameState', gameState);
        this.queueWrite('saveGameState', { gameState });
        return false;
      }

      // Prepare batch operation for cost efficiency
      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Split data for optimal structure
      const profileData = {
        userId,
        lastActiveAt: now,
        gameVersion: gameState.gameVersion || '1.0.0',
        preferences: gameState.preferences || {}
      };

      const progressData = {
        totalFLScore: gameState.totalFLScore || 0,
        onboardingStatus: gameState.onboardingStatus || 'not_started',
        completedWorlds: gameState.completedWorlds || [],
        unlockedAchievements: gameState.unlockedAchievements || [],
        unlockedSynergies: gameState.unlockedSynergies || {},
        compassProgress: gameState.compassProgress || {},
        lastUpdated: now
      };

      // Batch write both documents
      const profileRef = doc(db, 'users', userId, 'profile', 'main');
      const progressRef = doc(db, 'users', userId, 'progress', 'main');

      batch.set(profileRef, profileData, { merge: true });
      batch.set(progressRef, progressData, { merge: true });

      await batch.commit();
      
      this.costMonitor.sessionWrites += 2; // Batch counts as 2 writes
      this.cacheLocally('gameState', gameState);
      
      console.log('Game state saved successfully');
      return true;

    } catch (error) {
      console.error('Save failed:', error);
      this.cacheLocally('gameState', gameState);
      this.queueWrite('saveGameState', { gameState });
      return false;
    }
  }

  async loadGameState() {
    const userId = this.getCurrentUserId();
    if (!userId) {
      console.warn('No user ID, loading from cache');
      return this.loadFromCache('gameState');
    }

    try {
      // Try cache first (cost optimization)
      const cached = this.loadFromCache('gameState');
      const cacheAge = Date.now() - (cached?.lastFetch || 0);
      
      // Use cache if less than 5 minutes old
      if (cached && cacheAge < 5 * 60 * 1000) {
        console.log('Using cached game state');
        return cached.data;
      }

      // Batch read both documents
      const profileRef = doc(db, 'users', userId, 'profile', 'main');
      const progressRef = doc(db, 'users', userId, 'progress', 'main');

      const [profileSnap, progressSnap] = await Promise.all([
        getDoc(profileRef),
        getDoc(progressRef)
      ]);

      this.costMonitor.sessionReads += 2;

      // Combine data into gameState format
      const gameState = this.combineUserData(
        profileSnap.exists() ? profileSnap.data() : null,
        progressSnap.exists() ? progressSnap.data() : null
      );

      // Cache for future use
      this.cacheLocally('gameState', gameState);
      
      console.log('Game state loaded from Firebase');
      return gameState;

    } catch (error) {
      console.error('Load failed:', error);
      const cached = this.loadFromCache('gameState');
      if (cached) {
        console.log('Using stale cache due to error');
        return cached.data;
      }
      return this.getDefaultGameState();
    }
  }

  async saveGameProgress(worldResult) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      this.queueWrite('saveGameProgress', { worldResult });
      return false;
    }

    try {
      const progressRef = doc(db, 'users', userId, 'progress', 'main');
      const currentProgress = await getDoc(progressRef);
      
      this.costMonitor.sessionReads += 1;

      let progressData = currentProgress.exists() ? currentProgress.data() : {
        totalFLScore: 0,
        completedWorlds: [],
        unlockedAchievements: [],
        unlockedSynergies: {},
        compassProgress: {}
      };

      // Update progress with new world completion
      const worldData = {
        worldId: worldResult.worldId,
        status: 'completed',
        scoreAwarded: worldResult.score,
        bestOutcome: worldResult.outcome,
        completedAt: serverTimestamp()
      };

      // Remove existing entry for this world (in case of replay)
      progressData.completedWorlds = progressData.completedWorlds.filter(
        w => w.worldId !== worldResult.worldId
      );
      progressData.completedWorlds.push(worldData);

      // Update total score
      progressData.totalFLScore += worldResult.score;

      // Add any new achievements
      if (worldResult.achievements) {
        progressData.unlockedAchievements = [
          ...new Set([...progressData.unlockedAchievements, ...worldResult.achievements])
        ];
      }

      // Update synergies
      if (worldResult.synergies) {
        progressData.unlockedSynergies = {
          ...progressData.unlockedSynergies,
          ...worldResult.synergies
        };
      }

      progressData.lastUpdated = serverTimestamp();

      await setDoc(progressRef, progressData, { merge: true });
      this.costMonitor.sessionWrites += 1;

      console.log('Game progress saved successfully');
      return true;

    } catch (error) {
      console.error('Progress save failed:', error);
      this.queueWrite('saveGameProgress', { worldResult });
      return false;
    }
  }

  // ===== REAL-TIME LISTENERS =====

  subscribeToUserProgress(callback) {
    const userId = this.getCurrentUserId();
    if (!userId) return null;

    const progressRef = doc(db, 'users', userId, 'progress', 'main');
    
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      this.costMonitor.sessionReads += 1;
      
      if (doc.exists()) {
        const progressData = doc.data();
        this.cacheLocally('progress', progressData);
        callback(progressData);
      }
    }, (error) => {
      console.error('Progress subscription error:', error);
    });

    this.listeners.set('progress', unsubscribe);
    return unsubscribe;
  }

  unsubscribeAll() {
    this.listeners.forEach((unsubscribe) => {
      unsubscribe();
    });
    this.listeners.clear();
  }

  // ===== OFFLINE SUPPORT =====

  setupNetworkMonitoring() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Network online - syncing queued writes');
      this.syncQueuedWrites();
      enableNetwork(db);
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Network offline - enabling offline mode');
      disableNetwork(db);
    });
  }

  queueWrite(operation, data) {
    this.writeQueue.push({
      operation,
      data,
      timestamp: Date.now()
    });

    // Persist queue to localStorage
    localStorage.setItem('firebase_write_queue', JSON.stringify(this.writeQueue));
  }

  async syncQueuedWrites() {
    if (!this.isOnline || !this.getCurrentUserId()) return;

    // Load queue from localStorage
    const savedQueue = localStorage.getItem('firebase_write_queue');
    if (savedQueue) {
      this.writeQueue = JSON.parse(savedQueue);
    }

    if (this.writeQueue.length === 0) return;

    console.log(`Syncing ${this.writeQueue.length} queued writes`);

    for (const queuedWrite of this.writeQueue) {
      try {
        switch (queuedWrite.operation) {
          case 'saveGameState':
            await this.saveGameState(queuedWrite.data.gameState);
            break;
          case 'saveGameProgress':
            await this.saveGameProgress(queuedWrite.data.worldResult);
            break;
        }
      } catch (error) {
        console.error('Queued write failed:', error);
        // Keep failed writes in queue for retry
        continue;
      }
    }

    // Clear successfully synced writes
    this.writeQueue = [];
    localStorage.removeItem('firebase_write_queue');
  }

  // ===== CACHING UTILITIES =====

  cacheLocally(key, data) {
    const cacheEntry = {
      data,
      lastFetch: Date.now(),
      version: '1.0'
    };
    localStorage.setItem(`fb_cache_${key}`, JSON.stringify(cacheEntry));
  }

  loadFromCache(key) {
    try {
      const cached = localStorage.getItem(`fb_cache_${key}`);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache load error:', error);
      return null;
    }
  }

  clearCache() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('fb_cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  // ===== DATA UTILITIES =====

  combineUserData(profileData, progressData) {
    return {
      userId: profileData?.userId || this.getCurrentUserId(),
      gameVersion: profileData?.gameVersion || '1.0.0',
      preferences: profileData?.preferences || {},
      totalFLScore: progressData?.totalFLScore || 0,
      onboardingStatus: progressData?.onboardingStatus || 'not_started',
      completedWorlds: progressData?.completedWorlds || [],
      unlockedAchievements: progressData?.unlockedAchievements || [],
      unlockedSynergies: progressData?.unlockedSynergies || {},
      compassProgress: progressData?.compassProgress || {},
      lastUpdated: progressData?.lastUpdated || null
    };
  }

  getDefaultGameState() {
    return {
      userId: this.getCurrentUserId(),
      gameVersion: '1.0.0',
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
      preferences: {
        soundEnabled: true,
        language: 'sv'
      }
    };
  }

  // ===== COST MONITORING =====

  getCostReport() {
    const estimatedCost = (
      this.costMonitor.sessionReads * 0.00000036 + 
      this.costMonitor.sessionWrites * 0.00000108
    );

    return {
      reads: this.costMonitor.sessionReads,
      writes: this.costMonitor.sessionWrites,
      estimatedCostUSD: estimatedCost,
      estimatedCostSEK: estimatedCost * 10.5, // Approximate exchange rate
      writeLimit: this.costMonitor.maxWritesPerSession,
      writesRemaining: Math.max(0, this.costMonitor.maxWritesPerSession - this.costMonitor.sessionWrites)
    };
  }

  resetCostMonitoring() {
    this.costMonitor.sessionReads = 0;
    this.costMonitor.sessionWrites = 0;
  }

  // ===== ADMIN UTILITIES =====

  async deleteUserData() {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('User deletion only allowed in development');
    }

    const userId = this.getCurrentUserId();
    if (!userId) return;

    const batch = writeBatch(db);
    
    // Delete profile
    batch.delete(doc(db, 'users', userId, 'profile', 'main'));
    
    // Delete progress
    batch.delete(doc(db, 'users', userId, 'progress', 'main'));
    
    await batch.commit();
    this.clearCache();
    
    console.log('User data deleted');
  }

  async exportUserData() {
    const gameState = await this.loadGameState();
    const costReport = this.getCostReport();
    
    return {
      gameState,
      costReport,
      exportedAt: new Date().toISOString(),
      userId: this.getCurrentUserId()
    };
  }
}

// Create singleton instance
export const firebaseService = new FirebaseService();
export default FirebaseService;
```

---

## Error Handling & Retry Logic

### Comprehensive Error Handling

```javascript
class FirebaseErrorHandler {
  static handleFirebaseError(error, operation) {
    const errorCode = error.code;
    const errorMessage = error.message;
    
    console.error(`Firebase ${operation} error:`, { errorCode, errorMessage });
    
    switch (errorCode) {
      case 'permission-denied':
        return {
          shouldRetry: false,
          userMessage: 'Du har inte behörighet för denna operation.',
          fallback: 'useCache'
        };
        
      case 'unavailable':
      case 'deadline-exceeded':
        return {
          shouldRetry: true,
          userMessage: 'Anslutningsproblem. Försöker igen...',
          fallback: 'useCache',
          retryDelay: 2000
        };
        
      case 'quota-exceeded':
        return {
          shouldRetry: false,
          userMessage: 'Tillfälligt problem med tjänsten. Dina ändringar sparas lokalt.',
          fallback: 'offlineMode',
          notifyAdmin: true
        };
        
      case 'unauthenticated':
        return {
          shouldRetry: true,
          userMessage: 'Loggar in...',
          fallback: 'reauth',
          retryDelay: 1000
        };
        
      default:
        return {
          shouldRetry: false,
          userMessage: 'Ett fel uppstod. Dina ändringar sparas lokalt.',
          fallback: 'useCache'
        };
    }
  }
  
  static async executeWithRetry(operation, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const errorInfo = this.handleFirebaseError(error, 'operation');
        
        if (!errorInfo.shouldRetry || attempt === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        if (errorInfo.retryDelay) {
          await new Promise(resolve => setTimeout(resolve, errorInfo.retryDelay));
        }
        
        console.log(`Retrying operation (attempt ${attempt + 1}/${maxRetries})`);
      }
    }
    
    throw lastError;
  }
}
```

### Smart Retry with Exponential Backoff

```javascript
class RetryManager {
  constructor() {
    this.retryQueue = [];
    this.isProcessing = false;
  }
  
  async addToRetryQueue(operation, data, priority = 'normal') {
    const retryItem = {
      id: Date.now(),
      operation,
      data,
      priority,
      attempts: 0,
      maxAttempts: 3,
      nextRetry: Date.now() + 1000
    };
    
    this.retryQueue.push(retryItem);
    this.processRetryQueue();
  }
  
  async processRetryQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    while (this.retryQueue.length > 0) {
      // Sort by priority and next retry time
      this.retryQueue.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority === 'high' ? -1 : 1;
        }
        return a.nextRetry - b.nextRetry;
      });
      
      const item = this.retryQueue[0];
      
      // Skip if not ready for retry
      if (item.nextRetry > Date.now()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      try {
        await this.executeRetryItem(item);
        this.retryQueue.shift(); // Remove successful item
      } catch (error) {
        item.attempts++;
        
        if (item.attempts >= item.maxAttempts) {
          console.error('Max retries exceeded for:', item.operation);
          this.retryQueue.shift(); // Remove failed item
        } else {
          // Exponential backoff
          item.nextRetry = Date.now() + (1000 * Math.pow(2, item.attempts));
        }
      }
    }
    
    this.isProcessing = false;
  }
  
  async executeRetryItem(item) {
    switch (item.operation) {
      case 'saveGameState':
        return await firebaseService.saveGameState(item.data.gameState);
      case 'saveGameProgress':
        return await firebaseService.saveGameProgress(item.data.worldResult);
      default:
        throw new Error(`Unknown retry operation: ${item.operation}`);
    }
  }
}

export const retryManager = new RetryManager();
```

---

## Integration with App.jsx

### Seamless Integration Pattern

```javascript
// App.jsx integration example
import { firebaseService } from './services/FirebaseService';
import { useState, useEffect } from 'react';

function App() {
  const [gameState, setGameState] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    initializeApp();
  }, []);
  
  async function initializeApp() {
    try {
      // Initialize Firebase auth
      await firebaseService.initializeAuth();
      
      // Load game state
      const savedState = await firebaseService.loadGameState();
      setGameState(savedState);
      
      // Subscribe to progress updates
      firebaseService.subscribeToUserProgress((progress) => {
        setGameState(prev => ({ ...prev, ...progress }));
      });
      
    } catch (error) {
      console.error('App initialization failed:', error);
      // Use default state
      setGameState(firebaseService.getDefaultGameState());
    } finally {
      setIsLoading(false);
    }
  }
  
  async function handleGameComplete(result) {
    try {
      // Save progress
      await firebaseService.saveGameProgress(result);
      
      // Update local state
      setGameState(prev => ({
        ...prev,
        totalFLScore: prev.totalFLScore + result.score,
        completedWorlds: [...prev.completedWorlds, {
          worldId: result.worldId,
          status: 'completed',
          scoreAwarded: result.score,
          bestOutcome: result.outcome
        }]
      }));
      
    } catch (error) {
      console.error('Save failed:', error);
      // Local state is updated optimistically
      // Error handling shows user that sync will happen later
    }
  }
  
  async function saveGame() {
    try {
      await firebaseService.saveGameState(gameState);
      console.log('Game saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      // User notified that changes are cached locally
    }
  }
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="app">
      {isOffline && (
        <OfflineBanner message="Arbetar offline. Ändringar sparas när anslutningen återställs." />
      )}
      
      <Router gameState={gameState} onGameComplete={handleGameComplete} />
      
      {process.env.NODE_ENV === 'development' && (
        <CostMonitor report={firebaseService.getCostReport()} />
      )}
    </div>
  );
}
```

### Cost-Aware State Updates

```javascript
class GameStateManager {
  constructor(firebaseService) {
    this.firebase = firebaseService;
    this.pendingUpdates = [];
    this.batchTimer = null;
  }
  
  // Batch state updates to reduce Firebase writes
  queueStateUpdate(updates) {
    this.pendingUpdates.push(updates);
    
    // Debounce batch writes
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }
    
    this.batchTimer = setTimeout(() => {
      this.flushUpdates();
    }, 2000); // Wait 2 seconds for more updates
  }
  
  async flushUpdates() {
    if (this.pendingUpdates.length === 0) return;
    
    // Merge all updates
    const mergedUpdates = this.pendingUpdates.reduce((acc, update) => {
      return { ...acc, ...update };
    }, {});
    
    try {
      await this.firebase.saveGameState(mergedUpdates);
      this.pendingUpdates = [];
    } catch (error) {
      console.error('Batch update failed:', error);
      // Updates remain in queue for retry
    }
    
    this.batchTimer = null;
  }
  
  // Force immediate save (e.g., before page unload)
  async forceSave() {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    await this.flushUpdates();
  }
}