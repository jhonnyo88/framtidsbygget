# Firebase Integration Package

**Package ID:** S2  
**System:** Firebase Backend Integration  
**Status:** Complete  
**Token Count:** ~28,000 tokens

---

## Package Contents

### Architecture Documentation
- `/architecture/Firebase_Architecture.md` - Complete Firebase setup and structure
- `/architecture/Cost_Control_Strategy.md` - Keep costs under 1000 SEK/month
- `/architecture/Security_Rules.md` - Firestore and Auth security rules

### Implementation Guides
- `/implementation/Firebase_Setup.md` - Project initialization guide
- `/implementation/Auth_Implementation.md` - Anonymous authentication flow
- `/implementation/Firestore_Patterns.md` - Database design patterns
- `/implementation/Offline_Strategy.md` - Offline-first architecture

### Reference Code
- `/reference/firebase/` - Firebase configuration and initialization
- `/reference/services/` - Service layer implementations
- `/reference/hooks/` - React hooks for Firebase
- `/reference/schemas/` - Firestore document schemas

---

## Quick Start

```javascript
// Initialize Firebase
import { initializeFirebase } from '@/firebase/config';
const app = initializeFirebase();

// Use authentication
import { useAuth } from '@/hooks/useAuth';
function App() {
  const { user, signInAnonymously } = useAuth();
  
  if (!user) {
    return <button onClick={signInAnonymously}>Start Playing</button>;
  }
  
  return <Game userId={user.uid} />;
}

// Use Firestore
import { usePlayerData } from '@/hooks/usePlayerData';
function GameProgress() {
  const { progress, updateProgress } = usePlayerData();
  return <div>Score: {progress.score}</div>;
}
```

---

## Key Features

### Cost-Optimized Architecture
- **Target**: <1000 SEK/month for 1000 active users
- **Optimizations**:
  - Batched writes (reduce write operations by 70%)
  - Local caching (reduce reads by 80%)
  - Efficient data structures
  - Smart sync strategies

### Anonymous Authentication
- No registration required
- Seamless account creation
- Optional account linking later
- GDPR compliant

### Offline-First Design
- Full offline gameplay
- Queue syncs when online
- Conflict resolution
- Progressive enhancement

---

## Firestore Schema

```typescript
// User Document
interface UserDoc {
  uid: string;
  createdAt: Timestamp;
  lastActive: Timestamp;
  settings: {
    language: 'sv' | 'en';
    soundEnabled: boolean;
    theme: 'light' | 'dark';
  };
}

// Player Progress
interface PlayerProgress {
  uid: string;
  games: {
    welfare: GameProgress;
    crisis: GameProgress;
    puzzle: GameProgress;
    memory: GameProgress;
  };
  totalScore: number;
  achievements: string[]; // Achievement IDs
  statistics: PlayerStats;
}

// Game Session
interface GameSession {
  sessionId: string;
  userId: string;
  gameType: GameType;
  startTime: Timestamp;
  endTime?: Timestamp;
  score: number;
  data: any; // Game-specific data
}
```

---

## Cost Control Strategies

### Write Optimization
```javascript
// Batch multiple updates
const batch = writeBatch(db);
batch.update(userRef, { lastActive: now });
batch.update(progressRef, { score: newScore });
await batch.commit(); // 1 write operation instead of 2

// Debounced saves
const debouncedSave = debounce(async (data) => {
  await saveProgress(data);
}, 5000); // Save at most every 5 seconds
```

### Read Optimization
```javascript
// Enable offline persistence
enableIndexedDbPersistence(db);

// Use cache-first strategy
const docRef = doc(db, 'users', userId);
const docSnap = await getDoc(docRef, {
  source: 'cache' // Try cache first
});
```

### Data Structure Optimization
```javascript
// Bad: Nested arrays (expensive to update)
{
  achievements: [
    { id: 'ach1', unlockedAt: '...', data: {...} }
  ]
}

// Good: Flat structure
{
  achievements: ['ach1', 'ach2'], // Just IDs
  achievementData: { // Separate subcollection if needed
    ach1: { unlockedAt: '...' }
  }
}
```

---

## Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Player progress - same rule
    match /progress/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Leaderboards - public read, no write
    match /leaderboards/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## Service Layer

### Auth Service
```javascript
class AuthService {
  async signInAnonymously() {
    try {
      const result = await signInAnonymously(auth);
      await this.initializeUserData(result.user);
      return result.user;
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    }
  }
  
  async initializeUserData(user) {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      settings: DEFAULT_SETTINGS
    }, { merge: true });
  }
}
```

### Data Service
```javascript
class DataService {
  constructor() {
    this.cache = new Map();
    this.syncQueue = [];
  }
  
  async saveProgress(userId, data) {
    // Update local cache immediately
    this.cache.set(`progress_${userId}`, data);
    
    // Queue for sync
    this.syncQueue.push({ userId, data });
    
    // Sync if online
    if (navigator.onLine) {
      await this.processQueue();
    }
  }
  
  async processQueue() {
    const batch = writeBatch(db);
    
    for (const item of this.syncQueue) {
      const ref = doc(db, 'progress', item.userId);
      batch.set(ref, item.data, { merge: true });
    }
    
    await batch.commit();
    this.syncQueue = [];
  }
}
```

---

## React Hooks

### useAuth Hook
```javascript
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);
  
  const signIn = useCallback(async () => {
    const result = await signInAnonymously(auth);
    return result.user;
  }, []);
  
  return { user, loading, signIn };
}
```

### useFirestore Hook
```javascript
export function useFirestore(path, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const ref = doc(db, ...path.split('/'));
    
    const unsubscribe = onSnapshot(
      ref,
      { includeMetadataChanges: options.includeMetadata },
      (snapshot) => {
        setData(snapshot.data());
        setLoading(false);
      },
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    
    return unsubscribe;
  }, [path]);
  
  return { data, loading, error };
}
```

---

## Performance Monitoring

```javascript
// Monitor Firebase usage
const monitorUsage = async () => {
  const stats = {
    reads: 0,
    writes: 0,
    deletes: 0,
    bandwidth: 0
  };
  
  // Intercept operations
  const originalGet = getDoc;
  getDoc = async (...args) => {
    stats.reads++;
    return originalGet(...args);
  };
  
  // Report daily
  setInterval(() => {
    console.log('Firebase usage:', stats);
    // Send to analytics
  }, 24 * 60 * 60 * 1000);
};
```

---

## Best Practices

1. **Always batch writes** when updating multiple documents
2. **Use transactions** for atomic updates
3. **Enable offline persistence** for better UX
4. **Implement retry logic** for failed operations
5. **Monitor usage** to stay within budget
6. **Cache aggressively** to reduce reads
7. **Structure data** for minimal updates

---

## Related Packages

- **S1**: State Management (Redux integration)
- **S4**: Testing (Firebase testing strategies)
- **F1**: Core Framework (Firebase consumers)
- **G1-G4**: Game Modules (game-specific data)