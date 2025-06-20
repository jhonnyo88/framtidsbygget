# Firebase Setup Guide - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready  
**Syfte:** Komplett konfigurationsguide för Firebase-backend som stöder React-spelet "Framtidsbygget"

---

## Firebase Services Required

### Firestore Database
- **Syfte:** Player progress, game state, session persistence
- **Mode:** Native mode (not Datastore compatibility)
- **Location:** europe-west1 (Stockholm region for GDPR compliance)

### Authentication
- **Syfte:** Anonymous authentication for session persistence
- **Provider:** Anonymous authentication enabled
- **Session Management:** Auto-persist across browser sessions

### Hosting
- **Syfte:** Production deployment av React app
- **Configuration:** Single-page application med client-side routing

### Analytics (Optional)
- **Syfte:** User behavior tracking for educational impact analysis
- **Privacy:** GDPR-compliant, anonymized data only

---

## Firestore Schema Specification

### Collection: `players`

Baserat på Master GDD gameState-specifikationen:

```javascript
{
  // Primary Keys
  userId: string,               // Firebase Auth UID (anonymous)
  
  // Core Progress
  totalFLScore: number,         // Total Förändringsledarpoäng
  onboardingStatus: string,     // 'not_started' | 'step_2' | 'step_3' | 'step_4' | 'completed'
  
  // World Completion Data
  completedWorlds: [
    {
      worldId: string,          // 'pussel-spel-datasystem' | 'valfards-dilemma' | 'kompetensresan' | 'konnektivitetsvakten' | 'ekosystembyggaren'
      status: string,           // 'completed'
      scoreAwarded: number,     // FL-poäng från detta world
      bestOutcome: string,      // 'Perfekt lösning' | 'Konsensus' | 'Kompetensmästaren' etc.
      completedAt: timestamp,   // Firestore timestamp
      gameVersion: string       // "1.0.0" för versionsspårning
    }
  ],
  
  // Achievement System
  unlockedAchievements: [string], // Array av achievement IDs
  
  // Synergy System (from Master GDD)
  unlockedSynergies: {
    synergy_expert_data_model: boolean,    // Unlocked via Pusselspelet high score
    synergy_empathy_training: boolean,     // Unlocked via Välfärdens Dilemma konsensus
    synergy_skilled_workforce: boolean,    // Unlocked via Kompetensresan specialist > 80
    synergy_resilient_network: boolean     // Unlocked via Konnektivitetsvakten index > 90
  },
  
  // Digital Compass Progress
  compassProgress: {
    // Key = node ID from strategy.json, Value = progress level
    "digital_kompetens": string,           // 'locked' | 'unlocked' | 'mastered'
    "ai_integration": string,
    "cybersecurity_framework": string,
    "data_governance": string
    // ... additional nodes as defined in strategy.json
  },
  
  // Metadata
  lastUpdated: timestamp,       // Auto-updated on each save
  gameVersion: string,          // "1.0.0"
  sessionCount: number,         // Number of game sessions
  
  // Privacy & Analytics (GDPR compliant)
  analyticsOptIn: boolean,      // User consent for analytics
  createdAt: timestamp          // Account creation time
}
```

### Collection: `game_analytics` (Optional)

```javascript
{
  sessionId: string,            // UUID for session
  userId: string,               // Reference to player document
  eventType: string,            // 'game_start' | 'world_complete' | 'session_end'
  eventData: object,            // Event-specific data
  timestamp: timestamp,
  gameVersion: string
}
```

---

## Environment Setup

### Development Environment

Skapa `.env.local` fil i root directory:

```bash
# Firebase Configuration (Development)
VITE_FIREBASE_API_KEY=your_dev_api_key
VITE_FIREBASE_AUTH_DOMAIN=framtidsbygget-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=framtidsbygget-dev
VITE_FIREBASE_STORAGE_BUCKET=framtidsbygget-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Environment Flags
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

### Production Environment

Skapa `.env.production` fil:

```bash
# Firebase Configuration (Production)
VITE_FIREBASE_API_KEY=your_prod_api_key
VITE_FIREBASE_AUTH_DOMAIN=framtidsbygget.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=framtidsbygget
VITE_FIREBASE_STORAGE_BUCKET=framtidsbygget.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Environment Flags
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

### Firebase Configuration File

Skapa `src/firebase/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (production only)
export let analytics = null;
if (import.meta.env.VITE_ENABLE_ANALYTICS === 'true') {
  isSupported().then(yes => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

// Development Emulators
if (import.meta.env.VITE_NODE_ENV === 'development') {
  // Connect to Firestore emulator
  if (!db._delegate._databaseId.database.includes('localhost')) {
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
  
  // Connect to Auth emulator
  if (!auth.config.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099');
  }
}

export default app;
```

---

## Firestore Security Rules

### Production Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players collection - users can only access their own data
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Validate data structure on writes
      allow write: if request.auth != null 
        && request.auth.uid == userId
        && validatePlayerData(request.resource.data);
    }
    
    // Analytics collection - authenticated users can write their own data
    match /game_analytics/{document} {
      allow create: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
      allow read: if false; // No reads allowed for privacy
    }
    
    // Public read-only collections (for game data)
    match /strategy_data/{document} {
      allow read: if true;
      allow write: if false;
    }
  }
  
  // Data validation function
  function validatePlayerData(data) {
    return data.keys().hasAll(['userId', 'totalFLScore', 'onboardingStatus', 'gameVersion'])
      && data.totalFLScore is number
      && data.totalFLScore >= 0
      && data.onboardingStatus in ['not_started', 'step_2', 'step_3', 'step_4', 'completed']
      && data.gameVersion is string;
  }
}
```

### Development Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for development
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Firebase Service Implementation

### FirebaseService.js

Skapa `src/firebase/FirebaseService.js`:

```javascript
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, auth, analytics } from './firebase.js';

class FirebaseService {
  constructor() {
    this.currentUser = null;
    this.initAuth();
  }
  
  // Authentication Methods
  async initAuth() {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          this.currentUser = user;
          resolve(user);
        } else {
          // Auto sign-in anonymously
          const userCredential = await signInAnonymously(auth);
          this.currentUser = userCredential.user;
          resolve(userCredential.user);
        }
      });
    });
  }
  
  // Player Data Methods
  async loadPlayerData() {
    if (!this.currentUser) await this.initAuth();
    
    try {
      const playerDoc = doc(db, 'players', this.currentUser.uid);
      const docSnap = await getDoc(playerDoc);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // Create new player document with default gameState
        const defaultGameState = this.getDefaultGameState();
        await this.savePlayerData(defaultGameState);
        return defaultGameState;
      }
    } catch (error) {
      console.error('Error loading player data:', error);
      throw error;
    }
  }
  
  async savePlayerData(gameState) {
    if (!this.currentUser) await this.initAuth();
    
    try {
      const playerDoc = doc(db, 'players', this.currentUser.uid);
      const dataToSave = {
        ...gameState,
        userId: this.currentUser.uid,
        lastUpdated: serverTimestamp(),
        gameVersion: "1.0.0"
      };
      
      await setDoc(playerDoc, dataToSave, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving player data:', error);
      throw error;
    }
  }
  
  // Analytics Methods (GDPR Compliant)
  async logGameEvent(eventType, eventData = {}) {
    if (!analytics || !this.currentUser) return;
    
    try {
      await addDoc(collection(db, 'game_analytics'), {
        sessionId: this.generateSessionId(),
        userId: this.currentUser.uid,
        eventType,
        eventData,
        timestamp: serverTimestamp(),
        gameVersion: "1.0.0"
      });
    } catch (error) {
      console.error('Error logging analytics:', error);
      // Don't throw - analytics errors shouldn't break gameplay
    }
  }
  
  // Utility Methods
  getDefaultGameState() {
    return {
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
      sessionCount: 1,
      analyticsOptIn: false,
      createdAt: serverTimestamp()
    };
  }
  
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Export singleton instance
export default new FirebaseService();
```

---

## Development vs Production Configuration

### Local Development with Emulators

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Initialize Firebase project:**
```bash
firebase init firestore
firebase init hosting
```

3. **Start emulators for development:**
```bash
firebase emulators:start --only firestore,auth
```

4. **Development workflow:**
- Firestore Emulator: `http://localhost:4000`
- Auth Emulator: `http://localhost:9099`
- App connects automatically when `VITE_NODE_ENV=development`

### Production Deployment

1. **Build production app:**
```bash
npm run build
```

2. **Deploy to Firebase Hosting:**
```bash
firebase deploy --only hosting
```

3. **Deploy security rules:**
```bash
firebase deploy --only firestore:rules
```

---

## Error Handling & Offline Support

### Connection State Monitoring

```javascript
import { enableNetwork, disableNetwork } from 'firebase/firestore';

class ConnectionManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      enableNetwork(db);
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      disableNetwork(db);
    });
  }
}
```

### Error Recovery Patterns

```javascript
// Retry mechanism for critical operations
async function withRetry(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}
```

---

## GDPR Compliance & Privacy

### Data Minimization
- Endast anonymous authentication
- Inga personuppgifter lagras
- Opt-in för analytics

### Data Retention
- Game progress: Permanent (until user deletes)
- Analytics: 26 månader auto-delete
- Session data: 90 dagar auto-delete

### User Rights Implementation
```javascript
// Data export function
async function exportUserData(userId) {
  const playerDoc = await getDoc(doc(db, 'players', userId));
  return playerDoc.data();
}

// Data deletion function
async function deleteUserData(userId) {
  await deleteDoc(doc(db, 'players', userId));
  // Also delete associated analytics data
}
```

---

## Performance Optimization

### Firestore Best Practices
- Använd transactions för atomic updates
- Batch writes för multiple operations
- Index optimization för queries
- Offline persistence aktiverad

### Caching Strategy
- Local storage för icke-kritisk data
- Firestore cache för offline support
- Service worker för app-shell caching

---

## Monitoring & Debugging

### Firebase Console Monitoring
- Real-time database metrics
- Authentication analytics
- Hosting performance metrics
- Security rules simulator

### Debug Utilities
```javascript
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  // Enable Firestore logging
  import('firebase/firestore').then(({ enableFirestoreLogging }) => {
    enableFirestoreLogging(true);
  });
}
```

---

## Backup & Recovery

### Automated Backups
- Daily Firestore exports via Cloud Functions
- Cross-region backup storage
- Version-controlled backup retention

### Recovery Procedures
1. Identifiera data loss scope
2. Stoppa skrivoperationer
3. Restore från senaste backup
4. Verifiera data integrity
5. Återstarta applikationen

---

## Security Checklist

- [ ] Firestore security rules implementerade och testade
- [ ] Environment variables konfigurerade för alla miljöer
- [ ] Anonymous authentication aktiverad
- [ ] API keys begränsade till specific domains
- [ ] CORS policies konfigurerade
- [ ] Security headers implementerade
- [ ] Rate limiting aktiverat
- [ ] Error logging utan sensitive data

---

**Setup Complete:** Din Firebase-backend är nu redo för produktion med full säkerhet, performance och GDPR-compliance.