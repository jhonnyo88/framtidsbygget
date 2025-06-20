# Firebase Integration Specification - Framtidsbygget

**Version:** 1.0  
**Status:** Production Firebase Architecture  
**Purpose:** Complete specification for Firebase integration with cost optimization

---

## Executive Summary

This document specifies the Firebase integration architecture for Framtidsbygget, focusing on offline-first functionality, cost optimization, and GDPR compliance. The implementation ensures reliable data persistence while minimizing Firebase usage costs.

## Table of Contents

1. [Data Synchronization Architecture](#data-synchronization-architecture)
2. [Cost Optimization Patterns](#cost-optimization-patterns)
3. [Conflict Resolution System](#conflict-resolution-system)
4. [Security & Privacy Rules](#security-privacy-rules)
5. [Performance Monitoring](#performance-monitoring)
6. [Implementation Guide](#implementation-guide)

---

## Data Synchronization Architecture

### Offline-First Design

```
┌─────────────────────────────────────────────────────────┐
│                   Local State (Primary)                  │
│  • IndexedDB for offline persistence                    │
│  • React state for active session                       │
│  • Optimistic updates for instant feedback              │
└───────────────────────┬─────────────────────────────────┘
                        │
                   Sync Engine
                        │
┌───────────────────────▼─────────────────────────────────┐
│               Firebase Cloud (Secondary)                 │
│  • Firestore for persistent storage                     │
│  • Anonymous authentication                             │
│  • Minimal write operations                             │
└─────────────────────────────────────────────────────────┘
```

### Sync Strategy

```javascript
/**
 * SyncEngine.js - Intelligent sync management
 */
class SyncEngine {
  constructor() {
    this.syncQueue = [];
    this.lastSync = null;
    this.syncInterval = 60000; // 1 minute
    this.batchSize = 10;
    this.isOnline = navigator.onLine;
    
    this.setupEventListeners();
  }
  
  // Sync strategies based on data importance
  static SYNC_PRIORITIES = {
    CRITICAL: 0,    // Immediate sync (game completion)
    HIGH: 1,        // Next batch (achievements)
    MEDIUM: 2,      // Regular sync (progress updates)
    LOW: 3          // Lazy sync (preferences)
  };
  
  // Queue management
  queueUpdate(data, priority = SyncEngine.SYNC_PRIORITIES.MEDIUM) {
    const update = {
      id: `${Date.now()}_${Math.random()}`,
      data,
      priority,
      timestamp: Date.now(),
      retries: 0
    };
    
    this.syncQueue.push(update);
    this.syncQueue.sort((a, b) => a.priority - b.priority);
    
    if (priority === SyncEngine.SYNC_PRIORITIES.CRITICAL) {
      this.syncImmediate();
    }
  }
  
  // Batch sync for efficiency
  async syncBatch() {
    if (!this.isOnline || this.syncQueue.length === 0) return;
    
    const batch = this.syncQueue.splice(0, this.batchSize);
    
    try {
      await this.executeBatchSync(batch);
      this.lastSync = Date.now();
    } catch (error) {
      console.error('Batch sync failed:', error);
      // Return items to queue with increased retry count
      batch.forEach(item => {
        item.retries++;
        if (item.retries < 3) {
          this.syncQueue.unshift(item);
        }
      });
    }
  }
  
  async executeBatchSync(batch) {
    const db = firebase.firestore();
    const batchWrite = db.batch();
    
    batch.forEach(({ data }) => {
      const docRef = db.collection('gameStates').doc(data.userId);
      batchWrite.set(docRef, data, { merge: true });
    });
    
    await batchWrite.commit();
  }
  
  // Network monitoring
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncBatch();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Periodic sync
    setInterval(() => {
      if (this.isOnline) {
        this.syncBatch();
      }
    }, this.syncInterval);
    
    // Sync on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.isOnline) {
        this.syncBatch();
      }
    });
  }
  
  // Immediate sync for critical data
  async syncImmediate() {
    if (!this.isOnline) return;
    
    const criticalUpdates = this.syncQueue.filter(
      u => u.priority === SyncEngine.SYNC_PRIORITIES.CRITICAL
    );
    
    if (criticalUpdates.length === 0) return;
    
    try {
      await this.executeBatchSync(criticalUpdates);
      // Remove synced items from queue
      this.syncQueue = this.syncQueue.filter(
        u => u.priority !== SyncEngine.SYNC_PRIORITIES.CRITICAL
      );
    } catch (error) {
      console.error('Critical sync failed:', error);
    }
  }
}
```

### Local Storage Layer

```javascript
/**
 * LocalStorage.js - IndexedDB wrapper for offline persistence
 */
import { openDB } from 'idb';

class LocalStorage {
  constructor() {
    this.dbName = 'FramtidsbyggetDB';
    this.version = 1;
    this.db = null;
  }
  
  async init() {
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db) {
        // Game state store
        if (!db.objectStoreNames.contains('gameState')) {
          const gameStore = db.createObjectStore('gameState', { 
            keyPath: 'userId' 
          });
          gameStore.createIndex('lastUpdated', 'lastUpdated');
        }
        
        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id' 
          });
          syncStore.createIndex('priority', 'priority');
          syncStore.createIndex('timestamp', 'timestamp');
        }
        
        // Cache store for assets
        if (!db.objectStoreNames.contains('assetCache')) {
          const cacheStore = db.createObjectStore('assetCache', { 
            keyPath: 'url' 
          });
          cacheStore.createIndex('expires', 'expires');
        }
      }
    });
  }
  
  // Save game state locally
  async saveGameState(state) {
    const tx = this.db.transaction('gameState', 'readwrite');
    await tx.objectStore('gameState').put({
      ...state,
      _localTimestamp: Date.now()
    });
    await tx.complete;
  }
  
  // Get game state
  async getGameState(userId) {
    const state = await this.db.get('gameState', userId);
    return state || null;
  }
  
  // Queue sync operation
  async queueSync(operation) {
    const tx = this.db.transaction('syncQueue', 'readwrite');
    await tx.objectStore('syncQueue').add(operation);
    await tx.complete;
  }
  
  // Get pending sync operations
  async getPendingSyncs() {
    const tx = this.db.transaction('syncQueue', 'readonly');
    const index = tx.objectStore('syncQueue').index('priority');
    return await index.getAll();
  }
  
  // Clear synced operations
  async clearSyncedOperations(ids) {
    const tx = this.db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    
    for (const id of ids) {
      await store.delete(id);
    }
    
    await tx.complete;
  }
  
  // Asset caching
  async cacheAsset(url, data, ttl = 86400000) { // 24 hour default
    const tx = this.db.transaction('assetCache', 'readwrite');
    await tx.objectStore('assetCache').put({
      url,
      data,
      expires: Date.now() + ttl,
      size: new Blob([data]).size
    });
    await tx.complete;
  }
  
  async getCachedAsset(url) {
    const asset = await this.db.get('assetCache', url);
    
    if (!asset) return null;
    
    // Check expiration
    if (asset.expires < Date.now()) {
      await this.removeCachedAsset(url);
      return null;
    }
    
    return asset.data;
  }
  
  // Cleanup expired cache
  async cleanupCache() {
    const tx = this.db.transaction('assetCache', 'readwrite');
    const index = tx.objectStore('assetCache').index('expires');
    const expiredKeys = await index.getAllKeys(IDBKeyRange.upperBound(Date.now()));
    
    for (const key of expiredKeys) {
      await tx.objectStore('assetCache').delete(key);
    }
    
    await tx.complete;
  }
  
  // Storage quota management
  async getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentage: (estimate.usage / estimate.quota) * 100
      };
    }
    return null;
  }
}

export const localStorage = new LocalStorage();
```

---

## Cost Optimization Patterns

### Write Minimization Strategy

```javascript
/**
 * FirebaseOptimizer.js - Cost-efficient Firebase operations
 */
class FirebaseOptimizer {
  constructor() {
    this.writeBuffer = new Map();
    this.writeDelay = 5000; // 5 seconds
    this.maxWrites = 10; // Per user per session
    this.currentWrites = 0;
  }
  
  // Debounced writes
  scheduleWrite(userId, data) {
    // Clear existing timeout
    if (this.writeBuffer.has(userId)) {
      clearTimeout(this.writeBuffer.get(userId).timeout);
    }
    
    // Merge with existing data
    const existing = this.writeBuffer.get(userId)?.data || {};
    const merged = this.mergeData(existing, data);
    
    // Schedule write
    const timeout = setTimeout(() => {
      this.executeWrite(userId, merged);
      this.writeBuffer.delete(userId);
    }, this.writeDelay);
    
    this.writeBuffer.set(userId, { data: merged, timeout });
  }
  
  // Smart data merging
  mergeData(existing, updates) {
    return {
      ...existing,
      ...updates,
      // Special handling for arrays
      completedWorlds: updates.completedWorlds || existing.completedWorlds,
      unlockedAchievements: this.mergeArrays(
        existing.unlockedAchievements,
        updates.unlockedAchievements
      ),
      // Only update changed world progress
      worldProgress: this.mergeWorldProgress(
        existing.worldProgress,
        updates.worldProgress
      ),
      lastUpdated: Date.now()
    };
  }
  
  mergeArrays(existing = [], updates = []) {
    return [...new Set([...existing, ...updates])];
  }
  
  mergeWorldProgress(existing = {}, updates = {}) {
    const merged = { ...existing };
    
    for (const [worldId, progress] of Object.entries(updates)) {
      if (this.hasProgressChanged(existing[worldId], progress)) {
        merged[worldId] = progress;
      }
    }
    
    return merged;
  }
  
  hasProgressChanged(oldProgress, newProgress) {
    if (!oldProgress) return true;
    
    return (
      oldProgress.completed !== newProgress.completed ||
      oldProgress.bestScore !== newProgress.bestScore ||
      oldProgress.attempts !== newProgress.attempts
    );
  }
  
  // Execute write with cost tracking
  async executeWrite(userId, data) {
    if (this.currentWrites >= this.maxWrites) {
      console.warn('Write limit reached for session');
      return;
    }
    
    try {
      // Calculate write size
      const writeSize = this.calculateWriteSize(data);
      
      // Only write if under 1MB (Firestore document limit)
      if (writeSize > 1048576) {
        console.error('Document too large:', writeSize);
        data = this.compressData(data);
      }
      
      await firebase.firestore()
        .collection('gameStates')
        .doc(userId)
        .set(data, { merge: true });
      
      this.currentWrites++;
      
      // Track costs
      this.trackWrite(writeSize);
      
    } catch (error) {
      console.error('Firebase write failed:', error);
      throw error;
    }
  }
  
  calculateWriteSize(data) {
    return new Blob([JSON.stringify(data)]).size;
  }
  
  // Remove unnecessary data
  compressData(data) {
    const compressed = { ...data };
    
    // Remove temporary data
    delete compressed.session;
    delete compressed.preferences; // Store locally only
    
    // Compress world progress
    compressed.worldProgress = Object.entries(compressed.worldProgress)
      .reduce((acc, [worldId, progress]) => {
        if (progress.completed || progress.attempts > 0) {
          acc[worldId] = {
            completed: progress.completed,
            bestScore: progress.bestScore,
            attempts: progress.attempts
          };
        }
        return acc;
      }, {});
    
    return compressed;
  }
  
  // Cost tracking
  trackWrite(size) {
    const writes = JSON.parse(localStorage.getItem('firebase_writes') || '[]');
    writes.push({
      timestamp: Date.now(),
      size,
      cost: this.estimateCost(size)
    });
    
    // Keep last 100 writes
    if (writes.length > 100) {
      writes.shift();
    }
    
    localStorage.setItem('firebase_writes', JSON.stringify(writes));
  }
  
  estimateCost(size) {
    // Firestore pricing (approximate)
    const writeCost = 0.00018; // Per 100k writes
    const storageCost = 0.00000018; // Per GB per day
    
    return {
      write: writeCost / 100000,
      storage: (size / 1073741824) * storageCost
    };
  }
}
```

### Read Optimization

```javascript
/**
 * FirebaseReader.js - Optimized read operations
 */
class FirebaseReader {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 300000; // 5 minutes
    this.listeners = new Map();
  }
  
  // Cached reads
  async getGameState(userId, forceRefresh = false) {
    const cacheKey = `gameState_${userId}`;
    
    // Check cache first
    if (!forceRefresh && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached.expires > Date.now()) {
        return cached.data;
      }
    }
    
    try {
      // Read from Firebase
      const doc = await firebase.firestore()
        .collection('gameStates')
        .doc(userId)
        .get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      
      // Update cache
      this.cache.set(cacheKey, {
        data,
        expires: Date.now() + this.cacheTimeout
      });
      
      return data;
      
    } catch (error) {
      console.error('Firebase read failed:', error);
      
      // Fall back to local storage
      const localData = await localStorage.getGameState(userId);
      return localData;
    }
  }
  
  // Selective field reads
  async getGameStateFields(userId, fields) {
    try {
      const doc = await firebase.firestore()
        .collection('gameStates')
        .doc(userId)
        .get();
      
      if (!doc.exists) return null;
      
      const data = doc.data();
      const result = {};
      
      // Only return requested fields
      fields.forEach(field => {
        if (field in data) {
          result[field] = data[field];
        }
      });
      
      return result;
      
    } catch (error) {
      console.error('Selective read failed:', error);
      return null;
    }
  }
  
  // Real-time listener with unsubscribe
  subscribeToGameState(userId, callback) {
    // Avoid duplicate listeners
    if (this.listeners.has(userId)) {
      this.listeners.get(userId)();
    }
    
    const unsubscribe = firebase.firestore()
      .collection('gameStates')
      .doc(userId)
      .onSnapshot(
        { includeMetadataChanges: false }, // Reduce noise
        (doc) => {
          if (doc.exists) {
            callback(doc.data());
          }
        },
        (error) => {
          console.error('Listener error:', error);
          // Fallback to polling
          this.startPolling(userId, callback);
        }
      );
    
    this.listeners.set(userId, unsubscribe);
    
    return () => {
      unsubscribe();
      this.listeners.delete(userId);
    };
  }
  
  // Polling fallback for listener failures
  startPolling(userId, callback) {
    const pollInterval = setInterval(async () => {
      const data = await this.getGameState(userId, true);
      if (data) {
        callback(data);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(pollInterval);
  }
  
  // Batch reads for leaderboard
  async getBatchGameStates(userIds) {
    const BATCH_SIZE = 10; // Firestore limit
    const results = [];
    
    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);
      
      const docs = await firebase.firestore()
        .collection('gameStates')
        .where(firebase.firestore.FieldPath.documentId(), 'in', batch)
        .get();
      
      docs.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
    }
    
    return results;
  }
}
```

---

## Conflict Resolution System

### Merge Strategy

```javascript
/**
 * ConflictResolver.js - Automatic conflict resolution
 */
class ConflictResolver {
  // Merge strategies for different data types
  static STRATEGIES = {
    HIGHEST_WINS: 'highest_wins',      // For scores
    LATEST_WINS: 'latest_wins',        // For timestamps
    UNION: 'union',                    // For arrays
    DEEP_MERGE: 'deep_merge',          // For objects
    LOCAL_WINS: 'local_wins',          // For preferences
    REMOTE_WINS: 'remote_wins'         // For critical data
  };
  
  // Field-specific strategies
  static FIELD_STRATEGIES = {
    totalFLScore: ConflictResolver.STRATEGIES.HIGHEST_WINS,
    completedWorlds: ConflictResolver.STRATEGIES.UNION,
    unlockedAchievements: ConflictResolver.STRATEGIES.UNION,
    worldProgress: ConflictResolver.STRATEGIES.DEEP_MERGE,
    preferences: ConflictResolver.STRATEGIES.LOCAL_WINS,
    lastUpdated: ConflictResolver.STRATEGIES.LATEST_WINS
  };
  
  // Main merge function
  static async mergeStates(localState, remoteState) {
    console.log('Resolving conflicts between states');
    
    const merged = {};
    const conflicts = [];
    
    // Get all unique keys
    const allKeys = new Set([
      ...Object.keys(localState),
      ...Object.keys(remoteState)
    ]);
    
    for (const key of allKeys) {
      const localValue = localState[key];
      const remoteValue = remoteState[key];
      
      // No conflict if only one side has value
      if (localValue === undefined) {
        merged[key] = remoteValue;
        continue;
      }
      if (remoteValue === undefined) {
        merged[key] = localValue;
        continue;
      }
      
      // Apply merge strategy
      const strategy = this.FIELD_STRATEGIES[key] || this.STRATEGIES.LATEST_WINS;
      const result = this.applyStrategy(strategy, localValue, remoteValue, key);
      
      if (result.conflict) {
        conflicts.push({
          field: key,
          local: localValue,
          remote: remoteValue,
          resolved: result.value
        });
      }
      
      merged[key] = result.value;
    }
    
    // Log conflicts for debugging
    if (conflicts.length > 0) {
      console.log('Conflicts resolved:', conflicts);
    }
    
    return {
      merged,
      conflicts,
      hasConflicts: conflicts.length > 0
    };
  }
  
  static applyStrategy(strategy, localValue, remoteValue, fieldName) {
    switch (strategy) {
      case this.STRATEGIES.HIGHEST_WINS:
        return {
          value: Math.max(localValue, remoteValue),
          conflict: localValue !== remoteValue
        };
        
      case this.STRATEGIES.LATEST_WINS:
        return {
          value: localValue > remoteValue ? localValue : remoteValue,
          conflict: localValue !== remoteValue
        };
        
      case this.STRATEGIES.UNION:
        if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
          return {
            value: [...new Set([...localValue, ...remoteValue])],
            conflict: localValue.length !== remoteValue.length
          };
        }
        return { value: remoteValue, conflict: true };
        
      case this.STRATEGIES.DEEP_MERGE:
        if (typeof localValue === 'object' && typeof remoteValue === 'object') {
          return {
            value: this.deepMerge(localValue, remoteValue),
            conflict: JSON.stringify(localValue) !== JSON.stringify(remoteValue)
          };
        }
        return { value: remoteValue, conflict: true };
        
      case this.STRATEGIES.LOCAL_WINS:
        return {
          value: localValue,
          conflict: localValue !== remoteValue
        };
        
      case this.STRATEGIES.REMOTE_WINS:
        return {
          value: remoteValue,
          conflict: localValue !== remoteValue
        };
        
      default:
        return { value: remoteValue, conflict: true };
    }
  }
  
  static deepMerge(obj1, obj2) {
    const result = { ...obj1 };
    
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
          result[key] = this.deepMerge(obj1[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      }
    }
    
    return result;
  }
  
  // Special handling for world progress
  static mergeWorldProgress(local, remote) {
    const merged = {};
    
    const allWorlds = new Set([
      ...Object.keys(local || {}),
      ...Object.keys(remote || {})
    ]);
    
    for (const worldId of allWorlds) {
      const localProgress = local?.[worldId] || {};
      const remoteProgress = remote?.[worldId] || {};
      
      merged[worldId] = {
        completed: localProgress.completed || remoteProgress.completed,
        bestScore: Math.max(
          localProgress.bestScore || 0,
          remoteProgress.bestScore || 0
        ),
        attempts: Math.max(
          localProgress.attempts || 0,
          remoteProgress.attempts || 0
        ),
        lastPlayed: Math.max(
          localProgress.lastPlayed || 0,
          remoteProgress.lastPlayed || 0
        ),
        achievements: [...new Set([
          ...(localProgress.achievements || []),
          ...(remoteProgress.achievements || [])
        ])]
      };
    }
    
    return merged;
  }
}
```

### Sync Coordination

```javascript
/**
 * SyncCoordinator.js - Manages sync operations
 */
class SyncCoordinator {
  constructor() {
    this.isSyncing = false;
    this.syncPromise = null;
    this.lastSyncTime = null;
    this.syncListeners = new Set();
  }
  
  async syncGameState(userId) {
    // Prevent concurrent syncs
    if (this.isSyncing) {
      return this.syncPromise;
    }
    
    this.isSyncing = true;
    this.notifyListeners('sync:start');
    
    this.syncPromise = this.performSync(userId)
      .finally(() => {
        this.isSyncing = false;
        this.lastSyncTime = Date.now();
        this.notifyListeners('sync:complete');
      });
    
    return this.syncPromise;
  }
  
  async performSync(userId) {
    try {
      // 1. Get local state
      const localState = await localStorage.getGameState(userId);
      if (!localState) {
        throw new Error('No local state found');
      }
      
      // 2. Get remote state
      const reader = new FirebaseReader();
      const remoteState = await reader.getGameState(userId);
      
      // 3. If no remote state, upload local
      if (!remoteState) {
        await this.uploadState(userId, localState);
        return { status: 'uploaded', state: localState };
      }
      
      // 4. Compare timestamps
      if (localState.lastUpdated === remoteState.lastUpdated) {
        return { status: 'no_changes', state: localState };
      }
      
      // 5. Resolve conflicts
      const resolution = await ConflictResolver.mergeStates(
        localState,
        remoteState
      );
      
      // 6. Save merged state
      await localStorage.saveGameState(resolution.merged);
      await this.uploadState(userId, resolution.merged);
      
      return {
        status: 'merged',
        state: resolution.merged,
        conflicts: resolution.conflicts
      };
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.notifyListeners('sync:error', error);
      throw error;
    }
  }
  
  async uploadState(userId, state) {
    const optimizer = new FirebaseOptimizer();
    await optimizer.executeWrite(userId, state);
  }
  
  // Listener management
  addSyncListener(callback) {
    this.syncListeners.add(callback);
    return () => this.syncListeners.delete(callback);
  }
  
  notifyListeners(event, data = null) {
    this.syncListeners.forEach(callback => {
      callback({ event, data, timestamp: Date.now() });
    });
  }
  
  // Auto-sync setup
  enableAutoSync(userId, interval = 60000) {
    // Initial sync
    this.syncGameState(userId);
    
    // Periodic sync
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        this.syncGameState(userId);
      }
    }, interval);
    
    // Sync on important events
    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine) {
        this.syncGameState(userId);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup function
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }
}
```

---

## Security & Privacy Rules

### Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    function isValidGameState() {
      let fields = request.resource.data;
      return fields.keys().hasAll(['userId', 'lastUpdated', 'version']) &&
             fields.totalFLScore >= 0 &&
             fields.totalFLScore <= 50000 && // Max possible score
             fields.completedWorlds.size() <= 5; // Max worlds
    }
    
    function hasNotExceededWriteLimit() {
      // Limit writes per day
      return request.auth.token.writes_today == null || 
             request.auth.token.writes_today < 100;
    }
    
    // Game states collection
    match /gameStates/{userId} {
      allow read: if isOwner(userId);
      
      allow create: if isOwner(userId) && 
                       isValidGameState() &&
                       hasNotExceededWriteLimit();
      
      allow update: if isOwner(userId) && 
                       isValidGameState() &&
                       hasNotExceededWriteLimit() &&
                       request.resource.data.lastUpdated > resource.data.lastUpdated;
      
      allow delete: if false; // Never allow deletion
    }
    
    // Anonymous user metadata (for analytics only)
    match /analytics/{document} {
      allow read: if false; // Admin only
      allow write: if isAuthenticated() && 
                      request.resource.data.keys().hasOnly([
                        'timestamp', 'event', 'worldId', 'score'
                      ]);
    }
    
    // Leaderboard (public, anonymized)
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if false; // Cloud function only
    }
  }
}
```

### Privacy Compliance

```javascript
/**
 * PrivacyManager.js - GDPR compliance
 */
class PrivacyManager {
  constructor() {
    this.consentKey = 'framtidsbygget_privacy_consent';
    this.analyticsEnabled = false;
  }
  
  // Check consent status
  hasConsent() {
    const consent = localStorage.getItem(this.consentKey);
    return consent === 'granted';
  }
  
  // Request consent
  async requestConsent() {
    // This would show a consent dialog
    // For now, we assume implicit consent for anonymous users
    return true;
  }
  
  // Data minimization
  sanitizeGameState(state) {
    const sanitized = { ...state };
    
    // Remove any PII if it exists
    delete sanitized.email;
    delete sanitized.name;
    delete sanitized.phoneNumber;
    
    // Anonymize userId if needed
    if (sanitized.userId && sanitized.userId.includes('@')) {
      sanitized.userId = this.hashUserId(sanitized.userId);
    }
    
    return sanitized;
  }
  
  hashUserId(userId) {
    // Simple hash for demonstration
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `anon_${Math.abs(hash)}`;
  }
  
  // Export user data (GDPR requirement)
  async exportUserData(userId) {
    const data = {
      gameState: await localStorage.getGameState(userId),
      syncQueue: await localStorage.getPendingSyncs(),
      preferences: JSON.parse(localStorage.getItem('preferences') || '{}'),
      exportDate: new Date().toISOString()
    };
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `framtidsbygget_data_${userId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  }
  
  // Delete user data (GDPR requirement)
  async deleteUserData(userId) {
    // Local deletion
    await localStorage.db.delete('gameState', userId);
    
    // Clear sync queue
    const syncs = await localStorage.getPendingSyncs();
    const userSyncs = syncs.filter(s => s.data.userId === userId);
    await localStorage.clearSyncedOperations(userSyncs.map(s => s.id));
    
    // Firebase deletion
    try {
      await firebase.firestore()
        .collection('gameStates')
        .doc(userId)
        .delete();
    } catch (error) {
      console.error('Failed to delete from Firebase:', error);
    }
    
    // Clear all local storage
    localStorage.removeItem(this.consentKey);
    localStorage.removeItem('preferences');
    
    return true;
  }
  
  // Analytics opt-out
  setAnalyticsEnabled(enabled) {
    this.analyticsEnabled = enabled;
    
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: enabled ? 'granted' : 'denied'
      });
    }
  }
}
```

---

## Performance Monitoring

### Cost Tracking

```javascript
/**
 * CostMonitor.js - Real-time cost tracking
 */
class CostMonitor {
  constructor() {
    this.metrics = {
      reads: 0,
      writes: 0,
      deletes: 0,
      storage: 0,
      bandwidth: 0
    };
    
    this.costs = {
      read: 0.00006,      // Per document
      write: 0.00018,     // Per document
      delete: 0.00002,    // Per document
      storage: 0.00018,   // Per GB per month
      bandwidth: 0.12     // Per GB
    };
    
    this.loadMetrics();
  }
  
  // Track operations
  trackOperation(type, size = 0) {
    this.metrics[type]++;
    
    if (size > 0) {
      this.metrics.bandwidth += size / 1073741824; // Convert to GB
    }
    
    this.saveMetrics();
    this.checkThresholds();
  }
  
  // Calculate current costs
  calculateCosts() {
    const costs = {
      reads: this.metrics.reads * this.costs.read,
      writes: this.metrics.writes * this.costs.write,
      deletes: this.metrics.deletes * this.costs.delete,
      bandwidth: this.metrics.bandwidth * this.costs.bandwidth,
      storage: (this.metrics.storage / 1073741824) * this.costs.storage
    };
    
    costs.total = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    return costs;
  }
  
  // Alert thresholds
  checkThresholds() {
    const costs = this.calculateCosts();
    
    // Daily budget alert
    if (costs.total > 1.0) { // $1 per day
      console.warn('Daily Firebase budget exceeded:', costs);
      this.notifyAdmin('budget_exceeded', costs);
    }
    
    // Write rate limiting
    if (this.metrics.writes > 1000) {
      console.warn('High write volume detected');
      this.enableRateLimiting();
    }
  }
  
  // Save metrics locally
  saveMetrics() {
    const today = new Date().toDateString();
    const key = `firebase_metrics_${today}`;
    
    localStorage.setItem(key, JSON.stringify({
      metrics: this.metrics,
      timestamp: Date.now()
    }));
  }
  
  loadMetrics() {
    const today = new Date().toDateString();
    const key = `firebase_metrics_${today}`;
    
    const saved = localStorage.getItem(key);
    if (saved) {
      const data = JSON.parse(saved);
      this.metrics = data.metrics;
    }
  }
  
  // Monthly report
  generateMonthlyReport() {
    const reports = [];
    const now = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = `firebase_metrics_${date.toDateString()}`;
      
      const data = localStorage.getItem(key);
      if (data) {
        reports.push(JSON.parse(data));
      }
    }
    
    return {
      period: '30 days',
      totalCost: reports.reduce((sum, r) => {
        const dayMetrics = new CostMonitor();
        dayMetrics.metrics = r.metrics;
        return sum + dayMetrics.calculateCosts().total;
      }, 0),
      breakdown: this.aggregateMetrics(reports),
      peakDay: this.findPeakUsage(reports)
    };
  }
  
  enableRateLimiting() {
    // Implement write throttling
    window.FIREBASE_RATE_LIMITED = true;
    setTimeout(() => {
      window.FIREBASE_RATE_LIMITED = false;
    }, 300000); // 5 minutes
  }
}
```

### Performance Analytics

```javascript
/**
 * PerformanceAnalytics.js - Track sync performance
 */
class PerformanceAnalytics {
  constructor() {
    this.timings = [];
    this.maxTimings = 100;
  }
  
  // Measure sync operations
  async measureSync(operation) {
    const start = performance.now();
    const startMark = `sync_${Date.now()}_start`;
    const endMark = `sync_${Date.now()}_end`;
    
    performance.mark(startMark);
    
    try {
      const result = await operation();
      
      performance.mark(endMark);
      performance.measure('sync_operation', startMark, endMark);
      
      const duration = performance.now() - start;
      
      this.recordTiming({
        type: 'sync',
        duration,
        success: true,
        timestamp: Date.now()
      });
      
      return result;
      
    } catch (error) {
      const duration = performance.now() - start;
      
      this.recordTiming({
        type: 'sync',
        duration,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  recordTiming(timing) {
    this.timings.push(timing);
    
    if (this.timings.length > this.maxTimings) {
      this.timings.shift();
    }
    
    this.analyzePerformance();
  }
  
  analyzePerformance() {
    const recent = this.timings.slice(-20);
    
    const avgDuration = recent.reduce((sum, t) => sum + t.duration, 0) / recent.length;
    const successRate = recent.filter(t => t.success).length / recent.length;
    
    if (avgDuration > 5000) { // 5 seconds
      console.warn('Slow sync performance detected:', avgDuration);
    }
    
    if (successRate < 0.8) {
      console.warn('Low sync success rate:', successRate);
    }
    
    return {
      averageDuration: avgDuration,
      successRate,
      recentFailures: recent.filter(t => !t.success)
    };
  }
  
  // Network quality detection
  async checkNetworkQuality() {
    const testSize = 10240; // 10KB test payload
    const testData = new ArrayBuffer(testSize);
    
    const start = performance.now();
    
    try {
      await fetch('/api/network-test', {
        method: 'POST',
        body: testData
      });
      
      const duration = performance.now() - start;
      const speed = (testSize / 1024) / (duration / 1000); // KB/s
      
      return {
        latency: duration,
        bandwidth: speed,
        quality: speed > 100 ? 'good' : speed > 50 ? 'fair' : 'poor'
      };
      
    } catch (error) {
      return {
        latency: Infinity,
        bandwidth: 0,
        quality: 'offline'
      };
    }
  }
}
```

---

## Implementation Guide

### Quick Start

```javascript
/**
 * FirebaseService.js - Main service class
 */
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

class FirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.auth = null;
    this.userId = null;
    
    // Services
    this.syncEngine = new SyncEngine();
    this.syncCoordinator = new SyncCoordinator();
    this.costMonitor = new CostMonitor();
    this.privacyManager = new PrivacyManager();
  }
  
  async initialize() {
    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    
    // Initialize local storage
    await localStorage.init();
    
    // Anonymous auth
    await this.authenticateUser();
    
    // Start services
    this.startServices();
  }
  
  async authenticateUser() {
    try {
      const credential = await signInAnonymously(this.auth);
      this.userId = credential.user.uid;
      
      console.log('Authenticated as:', this.userId);
      
    } catch (error) {
      console.error('Authentication failed:', error);
      // Use local-only mode
      this.userId = `local_${Date.now()}`;
    }
  }
  
  startServices() {
    // Enable auto-sync
    this.syncCoordinator.enableAutoSync(this.userId);
    
    // Monitor costs
    this.costMonitor.trackOperation('read');
  }
  
  // Public API
  async saveGameState(state) {
    // Save locally first
    await localStorage.saveGameState(state);
    
    // Queue for sync
    this.syncEngine.queueUpdate(
      state,
      SyncEngine.SYNC_PRIORITIES.MEDIUM
    );
  }
  
  async getGameState() {
    // Try local first
    const localState = await localStorage.getGameState(this.userId);
    if (localState) return localState;
    
    // Fall back to Firebase
    const reader = new FirebaseReader();
    return await reader.getGameState(this.userId);
  }
  
  async forceSync() {
    return await this.syncCoordinator.syncGameState(this.userId);
  }
}

// Singleton instance
export const firebaseService = new FirebaseService();

// React hook
export const useFirebase = () => {
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    firebaseService.initialize().then(() => {
      setInitialized(true);
    });
  }, []);
  
  return {
    initialized,
    saveState: firebaseService.saveGameState.bind(firebaseService),
    getState: firebaseService.getGameState.bind(firebaseService),
    forceSync: firebaseService.forceSync.bind(firebaseService)
  };
};
```

---

*Last Updated: 2025-06-20*  
*Integration Version: 1.0*  
*Optimized for Educational Platform Use*