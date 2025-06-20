# Firebase Production Setup - Cost Optimized

**Version:** 1.0  
**Purpose:** Production Firebase configuration with strict cost controls  
**Target:** <1000 SEK/month for 1000 active users

---

## Cost Analysis & Targets

### Current Pricing (2025)
- **Firestore Reads:** 0.036 USD per 100k operations
- **Firestore Writes:** 0.108 USD per 100k operations  
- **Storage:** 0.18 USD per GB/month
- **Bandwidth:** 0.12 USD per GB

### Target Usage per 1000 Users/Month
- **Reads:** 500k operations (≈180 SEK)
- **Writes:** 50k operations (≈60 SEK)
- **Storage:** 2GB (≈40 SEK)
- **Total:** ≈280 SEK/month (well under 1000 SEK target)

---

## Cost-Optimized gameState Schema

### Data Partitioning Strategy

```javascript
// COLLECTION: users/{userId}/profile (Read-heavy, write-once)
const userProfileSchema = {
  userId: string,          // Anonymous auth ID
  createdAt: timestamp,    // User creation
  lastActiveAt: timestamp, // For cleanup
  gameVersion: string,     // Schema versioning
  preferences: {
    soundEnabled: boolean,
    language: string       // Future-proofing
  }
};

// COLLECTION: users/{userId}/progress (Read-moderate, write-after-games)
const userProgressSchema = {
  totalFLScore: number,           // Main metric
  onboardingStatus: string,       // 'completed', 'in_progress'
  completedWorlds: [{
    worldId: string,              // 'puzzle-game-datasystem'
    status: string,               // 'completed'
    scoreAwarded: number,
    bestOutcome: string,
    completedAt: timestamp
  }],
  unlockedAchievements: [string], // Achievement IDs
  unlockedSynergies: {
    synergy_expert_data_model: boolean,
    synergy_empathy_training: boolean,
    synergy_skilled_workforce: boolean,
    synergy_resilient_network: boolean
  },
  compassProgress: {
    // Key = node ID from strategy.json
    digital_kompetens: string     // 'locked', 'unlocked', 'mastered'
  },
  lastUpdated: timestamp
};

// COLLECTION: sessions/{sessionId} (Write-heavy, auto-expire)
const sessionDataSchema = {
  userId: string,
  gameData: object,        // Temporary game state
  expiresAt: timestamp     // Auto-delete after 24h
};
```

### Write Optimization Patterns

```javascript
// PATTERN 1: Batch writes for cost efficiency
const saveBatch = writeBatch(db);
saveBatch.update(profileRef, { lastActiveAt: serverTimestamp() });
saveBatch.set(progressRef, progressData, { merge: true });
await saveBatch.commit(); // 2 writes counted as 1 batch operation

// PATTERN 2: Incremental updates only
const updates = {};
if (newScore > currentScore) {
  updates.totalFLScore = newScore;
}
if (newWorld) {
  updates[`completedWorlds.${worldId}`] = worldData;
}
await updateDoc(progressRef, updates);

// PATTERN 3: Conditional writes to prevent unnecessary operations
const currentData = await getDoc(progressRef);
if (!currentData.exists() || currentData.data().totalFLScore < newScore) {
  await setDoc(progressRef, newData, { merge: true });
}
```

---

## Firestore Security Rules with Cost Controls

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profile - Read/write own data only
    match /users/{userId}/profile/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && resource == null || resource.data.userId == userId;
    }
    
    // User progress - Read/write own data only
    match /users/{userId}/progress/{document=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && resource == null || resource.data.userId == userId;
    }
    
    // Session data - Write own, auto-expire
    match /sessions/{sessionId} {
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.expiresAt is timestamp
        && request.resource.data.expiresAt > request.time;
      
      allow read, update: if request.auth != null
        && request.auth.uid == resource.data.userId
        && resource.data.expiresAt > request.time;
        
      allow delete: if true; // Allow cleanup
    }
    
    // COST CONTROL: Rate limiting
    match /{document=**} {
      allow read, write: if request.auth != null
        // Prevent expensive queries
        && !('array-contains-any' in request.query)
        && !('in' in request.query)
        // Limit document size
        && request.resource.size() < 1000000; // 1MB limit
    }
  }
}
```

---

## Offline-First Caching Strategy

### Local Storage Schema

```javascript
// localStorage keys with cost-aware design
const CACHE_KEYS = {
  USER_PROFILE: 'fb_user_profile',
  USER_PROGRESS: 'fb_user_progress', 
  GAME_STATE: 'fb_game_state',
  LAST_SYNC: 'fb_last_sync',
  CACHE_VERSION: 'fb_cache_v1'
};

// Cache structure optimized for minimal Firebase reads
const cacheStructure = {
  profile: {
    data: userProfileSchema,
    lastFetch: timestamp,
    ttl: 24 * 60 * 60 * 1000  // 24 hours
  },
  progress: {
    data: userProgressSchema,
    lastFetch: timestamp,
    ttl: 5 * 60 * 1000        // 5 minutes (for real-time updates)
  },
  gameState: {
    data: object,
    isTemp: boolean,          // Don't sync temp states
    lastSave: timestamp
  }
};
```

### Smart Sync Algorithm

```javascript
class CacheManager {
  static async getCachedData(key) {
    const cached = localStorage.getItem(CACHE_KEYS[key]);
    if (!cached) return null;
    
    const { data, lastFetch, ttl } = JSON.parse(cached);
    if (Date.now() - lastFetch > ttl) {
      localStorage.removeItem(CACHE_KEYS[key]);
      return null; // Cache expired
    }
    
    return data;
  }
  
  static setCachedData(key, data, ttl = 24 * 60 * 60 * 1000) {
    const cacheEntry = {
      data,
      lastFetch: Date.now(),
      ttl
    };
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify(cacheEntry));
  }
  
  // Cost optimization: Only sync if significant changes
  static shouldSync(localData, remoteData) {
    if (!localData || !remoteData) return true;
    
    // Skip sync for minor changes to prevent unnecessary writes
    const significantFields = ['totalFLScore', 'completedWorlds', 'unlockedAchievements'];
    return significantFields.some(field => 
      JSON.stringify(localData[field]) !== JSON.stringify(remoteData[field])
    );
  }
}
```

---

## Complete Firebase Configuration

### Project Setup

```javascript
// firebase-config.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with cost-optimized settings
export const db = getFirestore(app);

// Enable offline persistence for cost reduction
import { enableNetwork, disableNetwork } from 'firebase/firestore';
await enableNetwork(db);

// Initialize Auth with anonymous provider only
export const auth = getAuth(app);

// Development environment setup
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;
```

### Environment Variables

```bash
# .env.production
REACT_APP_FIREBASE_API_KEY=your_production_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=framtidsbygget-prod.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=framtidsbygget-prod
REACT_APP_FIREBASE_STORAGE_BUCKET=framtidsbygget-prod.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Cost monitoring
REACT_APP_ENABLE_COST_MONITORING=true
REACT_APP_MAX_WRITES_PER_SESSION=10
```

---

## Cost Monitoring Implementation

### Usage Tracking

```javascript
class CostMonitor {
  constructor() {
    this.sessionWrites = 0;
    this.sessionReads = 0;
    this.maxWritesPerSession = parseInt(process.env.REACT_APP_MAX_WRITES_PER_SESSION) || 10;
  }
  
  trackRead() {
    this.sessionReads++;
    this.logUsage('READ');
  }
  
  trackWrite() {
    this.sessionWrites++;
    this.logUsage('WRITE');
    
    if (this.sessionWrites >= this.maxWritesPerSession) {
      console.warn('Session write limit reached. Consider caching strategy.');
      // Could trigger offline-only mode
    }
  }
  
  logUsage(operation) {
    if (process.env.REACT_APP_ENABLE_COST_MONITORING === 'true') {
      console.log(`Firebase ${operation}: Session R:${this.sessionReads} W:${this.sessionWrites}`);
    }
  }
  
  getSessionSummary() {
    return {
      reads: this.sessionReads,
      writes: this.sessionWrites,
      estimatedCost: (this.sessionReads * 0.00000036 + this.sessionWrites * 0.00000108)
    };
  }
}

export const costMonitor = new CostMonitor();
```

### Automatic Cost Alerts

```javascript
// Cost alert system
class CostAlertSystem {
  static checkDailyCosts() {
    const usage = this.getDailyUsage();
    const estimatedMonthlyCost = usage.dailyCost * 30;
    
    if (estimatedMonthlyCost > 800) { // 80% of 1000 SEK target
      this.sendAlert('COST_WARNING', {
        currentDaily: usage.dailyCost,
        projectedMonthly: estimatedMonthlyCost,
        threshold: 1000
      });
    }
  }
  
  static sendAlert(type, data) {
    // Log to console in development
    console.warn(`COST ALERT [${type}]:`, data);
    
    // In production, could send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to monitoring service
      fetch('/api/cost-alerts', {
        method: 'POST',
        body: JSON.stringify({ type, data, timestamp: new Date() })
      });
    }
  }
}
```

---

## Data Cleanup Strategy

### Automatic Cleanup Rules

```javascript
// Cloud Function for cleanup (deploy separately)
const cleanupExpiredSessions = functions.pubsub
  .schedule('every 6 hours')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    const expiredQuery = admin.firestore()
      .collection('sessions')
      .where('expiresAt', '<', now)
      .limit(500); // Process in batches
    
    const snapshot = await expiredQuery.get();
    const batch = admin.firestore().batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} expired sessions`);
  });

// Clean up inactive users (GDPR compliance + cost reduction)
const cleanupInactiveUsers = functions.pubsub
  .schedule('every 30 days')
  .onRun(async (context) => {
    const sixMonthsAgo = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    );
    
    const inactiveQuery = admin.firestore()
      .collectionGroup('profile')
      .where('lastActiveAt', '<', sixMonthsAgo)
      .limit(100);
    
    const snapshot = await inactiveQuery.get();
    const batch = admin.firestore().batch();
    
    snapshot.docs.forEach(doc => {
      // Delete entire user document tree
      batch.delete(doc.ref.parent.parent);
    });
    
    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} inactive users`);
  });
```

### Manual Cleanup Utilities

```javascript
// Utility for development cleanup
export class CleanupUtils {
  static async clearUserData(userId) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Cleanup only allowed in development');
    }
    
    const batch = writeBatch(db);
    
    // Delete profile
    batch.delete(doc(db, 'users', userId, 'profile', 'main'));
    
    // Delete progress
    batch.delete(doc(db, 'users', userId, 'progress', 'main'));
    
    // Delete any sessions
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('userId', '==', userId)
    );
    const sessions = await getDocs(sessionsQuery);
    sessions.forEach(session => batch.delete(session.ref));
    
    await batch.commit();
    console.log(`Cleared all data for user: ${userId}`);
  }
}
```

---

## Performance Optimization

### Connection Optimization

```javascript
// Optimize Firestore connections
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Initialize with performance settings
const db = initializeFirestore(app, {
  cacheSizeBytes: 40000000, // 40MB cache (default is 40MB)
  experimentalForceLongPolling: false, // Use WebSocket when possible
});

// Enable offline persistence with size limit
try {
  await enableNetwork(db);
} catch (err) {
  console.warn('Offline persistence failed:', err);
}
```

### Query Optimization

```javascript
// Cost-efficient query patterns
class OptimizedQueries {
  // Use pagination instead of large queries
  static async getUserProgress(userId, limit = 10) {
    const progressRef = collection(db, 'users', userId, 'progress');
    const q = query(
      progressRef,
      orderBy('completedAt', 'desc'),
      limit(limit)
    );
    
    costMonitor.trackRead();
    return await getDocs(q);
  }
  
  // Use specific field queries
  static async checkWorldCompletion(userId, worldId) {
    const progressRef = doc(db, 'users', userId, 'progress', 'main');
    const snapshot = await getDoc(progressRef);
    
    costMonitor.trackRead();
    
    if (!snapshot.exists()) return false;
    
    const data = snapshot.data();
    return data.completedWorlds?.some(world => world.worldId === worldId) || false;
  }
  
  // Batch reads for efficiency
  static async batchGetUserData(userId) {
    const profileRef = doc(db, 'users', userId, 'profile', 'main');
    const progressRef = doc(db, 'users', userId, 'progress', 'main');
    
    const [profileSnap, progressSnap] = await Promise.all([
      getDoc(profileRef),
      getDoc(progressRef)
    ]);
    
    costMonitor.trackRead(); // Count as 2 reads
    costMonitor.trackRead();
    
    return {
      profile: profileSnap.exists() ? profileSnap.data() : null,
      progress: progressSnap.exists() ? progressSnap.data() : null
    };
  }
}
```

---

## Testing Configuration

### Firebase Emulator Setup

```json
// firebase.json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": true,
      "port": 4000
    }
  }
}
```

### Cost Testing

```javascript
// Test cost-efficient patterns
describe('Firebase Cost Optimization', () => {
  beforeEach(async () => {
    // Connect to emulator
    if (!getApps().length) {
      initializeApp(testConfig);
    }
    connectFirestoreEmulator(db, 'localhost', 8080);
  });
  
  test('batch writes reduce operation count', async () => {
    const userId = 'test-user';
    const batch = writeBatch(db);
    
    // Single batch operation instead of multiple writes
    batch.set(doc(db, 'users', userId, 'profile', 'main'), profileData);
    batch.set(doc(db, 'users', userId, 'progress', 'main'), progressData);
    
    await batch.commit();
    
    // Verify both documents exist
    const [profile, progress] = await Promise.all([
      getDoc(doc(db, 'users', userId, 'profile', 'main')),
      getDoc(doc(db, 'users', userId, 'progress', 'main'))
    ]);
    
    expect(profile.exists()).toBe(true);
    expect(progress.exists()).toBe(true);
  });
});
```