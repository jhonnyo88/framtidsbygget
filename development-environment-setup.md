# Development Environment Setup - Framtidsbygget

**Version:** 1.0  
**Status:** Production-Ready  
**Syfte:** Komplett utvecklingsmiljö setup för React-applikationen "Framtidsbygget"

---

## Prerequisites & System Requirements

### Required Software

| Tool | Version | Purpose | Installation |
|------|---------|---------|-------------|
| **Node.js** | 18.0+ | JavaScript runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.0+ | Package manager | Included with Node.js |
| **Git** | 2.30+ | Version control | [git-scm.com](https://git-scm.com/) |
| **Firebase CLI** | 11.0+ | Firebase deployment | `npm install -g firebase-tools` |
| **Visual Studio Code** | Latest | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |

### Optional but Recommended

| Tool | Purpose | Installation |
|------|---------|-------------|
| **Figma** | Design collaboration | [figma.com](https://figma.com/) |
| **Postman** | API testing | [postman.com](https://postman.com/) |
| **Chrome DevTools** | Debugging | Included with Chrome |

### System Specifications

- **RAM:** Minimum 8GB (16GB recommended for PixiJS development)
- **Storage:** 5GB free space for project and dependencies
- **Network:** Stable internet connection for Firebase sync
- **OS:** Windows 10+, macOS 10.15+, or Linux Ubuntu 18.04+

---

## Project Structure

### Complete Folder Architecture

```
framtidsbygget/
├── public/                          # Static assets
│   ├── index.html                   # Main HTML template
│   ├── favicon.ico                  # App icon
│   ├── manifest.json                # PWA manifest
│   └── assets/                      # Game assets
│       ├── images/                  # Image files
│       │   ├── backgrounds/         # Background images
│       │   ├── sprites/             # Game sprites
│       │   ├── ui/                  # UI elements
│       │   └── icons/               # Icon files
│       ├── audio/                   # Sound files
│       │   ├── sfx/                 # Sound effects
│       │   └── music/               # Background music
│       └── data/                    # Game data files
│           ├── strategy.json        # Digital Compass data
│           └── manifests/           # Asset manifests
├── src/                             # Source code
│   ├── components/                  # React components
│   │   ├── ui/                      # Basic UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Meter.jsx
│   │   │   └── LoadingScreen.jsx
│   │   ├── dashboard/               # Main dashboard
│   │   │   ├── MainDashboard.jsx
│   │   │   ├── Scoreboard.jsx
│   │   │   └── MapView.jsx
│   │   ├── games/                   # Minispel components
│   │   │   ├── GameWrapper.jsx
│   │   │   ├── GameCanvasWrapper.jsx
│   │   │   ├── PuzzleGameModule.jsx
│   │   │   ├── WelfareGameModule.jsx
│   │   │   ├── CompetenceGameModule.jsx
│   │   │   ├── ConnectivityGameModule.jsx
│   │   │   └── EcosystemGameModule.jsx
│   │   ├── compass/                 # Digital Compass
│   │   │   └── DigitalaKompassen.jsx
│   │   ├── onboarding/              # Onboarding flow
│   │   │   └── OnboardingFlow.jsx
│   │   ├── finale/                  # Game finale
│   │   │   └── FinaleSequence.jsx
│   │   ├── modals/                  # Modal components
│   │   │   └── ResultModal.jsx
│   │   └── errors/                  # Error handling
│   │       ├── ErrorBoundary.jsx
│   │       └── PixiErrorBoundary.jsx
│   ├── firebase/                    # Firebase integration
│   │   ├── firebase.js              # Firebase configuration
│   │   └── FirebaseService.js       # Firebase service layer
│   ├── pixi/                        # PixiJS game classes
│   │   ├── BasePixiGame.js          # Base game class
│   │   ├── PuzzleGamePixi.js        # Puzzle game implementation
│   │   ├── ConnectivityGamePixi.js  # Connectivity game
│   │   └── EcosystemGamePixi.js     # Ecosystem game
│   ├── hooks/                       # Custom React hooks
│   │   ├── useGameState.js          # Game state management
│   │   ├── useLocalStorage.js       # Local storage persistence
│   │   └── useDebounce.js           # Debounced state updates
│   ├── utils/                       # Utility functions
│   │   ├── AssetLoader.js           # Asset management
│   │   ├── PixiPerformanceManager.js # Performance optimization
│   │   ├── PixiDebugUtils.js        # Debug utilities
│   │   └── stateOptimization.js     # State optimization
│   ├── styles/                      # CSS files
│   │   ├── main.css                 # Global styles
│   │   ├── components.css           # Component styles
│   │   ├── GameCanvas.css           # Game canvas styles
│   │   └── responsive.css           # Responsive design
│   ├── constants/                   # App constants
│   │   ├── gameConfig.js            # Game configuration
│   │   └── apiEndpoints.js          # API endpoints
│   ├── App.jsx                      # Main App component
│   └── main.jsx                     # Entry point
├── tests/                           # Test files
│   ├── components/                  # Component tests
│   ├── utils/                       # Utility tests
│   ├── integration/                 # Integration tests
│   └── setup.js                     # Test setup
├── docs/                            # Documentation
│   ├── project_DNA/                 # Project specification
│   ├── api/                         # API documentation
│   └── deployment/                  # Deployment guides
├── .storybook/                      # Storybook configuration
│   ├── main.js                      # Storybook config
│   └── preview.js                   # Global decorators
├── .env.local                       # Local environment variables
├── .env.development                 # Development environment
├── .env.production                  # Production environment
├── .gitignore                       # Git ignore rules
├── package.json                     # Project dependencies
├── vite.config.js                   # Vite configuration
├── firebase.json                    # Firebase configuration
├── .firebaserc                      # Firebase project settings
└── README.md                        # Project documentation
```

---

## Initial Project Setup

### Step 1: Clone and Initialize Project

```bash
# Clone repository
git clone https://github.com/your-username/framtidsbygget.git
cd framtidsbygget

# Install dependencies
npm install

# Initialize Firebase
firebase init

# Create environment files
touch .env.local .env.development .env.production
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install react react-dom

# Development tools
npm install -D vite @vitejs/plugin-react

# UI and styling
npm install react-router-dom clsx

# Game development
npm install pixi.js @pixi/react

# Firebase
npm install firebase

# Testing
npm install -D jest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event

# Storybook
npx storybook@latest init

# Linting and formatting
npm install -D eslint prettier eslint-plugin-react
npm install -D eslint-plugin-react-hooks @typescript-eslint/eslint-plugin

# Performance and monitoring
npm install web-vitals

# Development utilities
npm install -D concurrently npm-run-all
```

### Step 3: Create package.json Scripts

```json
{
  "name": "framtidsbygget",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "preview": "vite preview",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "firebase:emulators": "firebase emulators:start --only firestore,auth",
    "firebase:deploy": "firebase deploy",
    "format": "prettier --write src/**/*.{js,jsx,css,md}",
    "format:check": "prettier --check src/**/*.{js,jsx,css,md}",
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html",
    "dev:full": "concurrently \"npm run firebase:emulators\" \"npm run dev\"",
    "clean": "rm -rf dist .firebase node_modules/.cache",
    "postinstall": "husky install"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "firebase": "^9.17.0",
    "pixi.js": "^7.2.0",
    "@pixi/react": "^7.1.0",
    "clsx": "^1.2.1",
    "web-vitals": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0",
    "jest": "^29.4.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "eslint": "^8.35.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^2.8.4",
    "@storybook/react": "^6.5.16",
    "@storybook/addon-essentials": "^6.5.16",
    "concurrently": "^7.6.0",
    "husky": "^8.0.3"
  }
}
```

---

## Configuration Files

### Vite Configuration (vite.config.js)

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          pixi: ['pixi.js', '@pixi/react']
        }
      }
    }
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'public/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@styles': resolve(__dirname, 'src/styles')
    }
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
  },
  
  // CSS configuration
  css: {
    devSourcemap: true
  },
  
  // Optimization
  optimizeDeps: {
    include: ['pixi.js', 'firebase/app', 'firebase/firestore', 'firebase/auth']
  }
});
```

### ESLint Configuration (.eslintrc.js)

```javascript
module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    '@vitejs/plugin-react/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: '18.2'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    // React specific rules
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    
    // General rules
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Code quality
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    
    // Best practices
    'no-magic-numbers': ['warn', { ignore: [0, 1, -1] }],
    'complexity': ['warn', 10],
    'max-lines-per-function': ['warn', 100]
  }
};
```

### Prettier Configuration (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false
}
```

### Jest Configuration (jest.config.js)

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.stories.{js,jsx}',
    '!src/**/*.test.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx}',
    '<rootDir>/src/**/*.test.{js,jsx}'
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ]
};
```

### Test Setup (tests/setup.js)

```javascript
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Firebase
jest.mock('../src/firebase/firebase.js', () => ({
  db: {},
  auth: {},
  analytics: null
}));

// Mock PixiJS for testing
jest.mock('pixi.js', () => ({
  Application: jest.fn(() => ({
    view: document.createElement('canvas'),
    stage: {
      addChild: jest.fn(),
      removeChild: jest.fn(),
      children: []
    },
    destroy: jest.fn()
  })),
  Container: jest.fn(() => ({
    addChild: jest.fn(),
    removeChild: jest.fn(),
    removeChildren: jest.fn(),
    children: []
  })),
  Sprite: jest.fn(() => ({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    interactive: false,
    on: jest.fn(),
    removeAllListeners: jest.fn()
  })),
  Text: jest.fn(() => ({
    text: '',
    x: 0,
    y: 0
  })),
  Texture: {
    from: jest.fn(() => ({}))
  },
  Loader: {
    shared: {
      add: jest.fn().mockReturnThis(),
      load: jest.fn(callback => callback({}, {}))
    }
  }
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn()
}));

// Mock performance.memory for testing
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000
  },
  writable: true
});

// Suppress console errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

---

## Environment Variables

### Development Environment (.env.development)

```bash
# Vite Environment Variables (prefixed with VITE_)
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_ANALYTICS=false

# Firebase Configuration (Development)
VITE_FIREBASE_API_KEY=your_dev_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=framtidsbygget-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=framtidsbygget-dev
VITE_FIREBASE_STORAGE_BUCKET=framtidsbygget-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_dev_app_id

# Development Features
VITE_ENABLE_STORYBOOK=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_SHOW_DEBUG_OVERLAY=true

# Game Configuration
VITE_GAME_VERSION=1.0.0-dev
VITE_ENABLE_CHEATS=true
VITE_SKIP_ONBOARDING=false

# Performance Settings
VITE_PIXI_ANTIALIAS=true
VITE_PIXI_POWER_PREFERENCE=high-performance
VITE_ENABLE_ASSET_PRELOADING=false
```

### Production Environment (.env.production)

```bash
# Vite Environment Variables
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_ANALYTICS=true

# Firebase Configuration (Production)
VITE_FIREBASE_API_KEY=your_prod_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=framtidsbygget.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=framtidsbygget
VITE_FIREBASE_STORAGE_BUCKET=framtidsbygget.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_prod_app_id

# Production Features
VITE_ENABLE_STORYBOOK=false
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_SHOW_DEBUG_OVERLAY=false

# Game Configuration
VITE_GAME_VERSION=1.0.0
VITE_ENABLE_CHEATS=false
VITE_SKIP_ONBOARDING=false

# Performance Settings
VITE_PIXI_ANTIALIAS=false
VITE_PIXI_POWER_PREFERENCE=default
VITE_ENABLE_ASSET_PRELOADING=true
```

### Local Development (.env.local)

```bash
# Local overrides (not committed to git)
VITE_LOCAL_DEVELOPMENT=true

# Firebase Emulator Settings
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIRESTORE_EMULATOR_HOST=localhost
VITE_FIRESTORE_EMULATOR_PORT=8080
VITE_AUTH_EMULATOR_HOST=localhost
VITE_AUTH_EMULATOR_PORT=9099

# Local Development Features
VITE_ENABLE_HOT_RELOAD=true
VITE_ENABLE_REACT_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=true

# Developer Preferences
VITE_DEVELOPER_NAME=your_name
VITE_ENABLE_EXPERIMENTAL_FEATURES=true
```

---

## Firebase Configuration

### Firebase Setup (firebase.json)

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|jsx)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  }
}
```

### Firestore Security Rules (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Development rules - allow all operations
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Firebase Project Configuration (.firebaserc)

```json
{
  "projects": {
    "default": "framtidsbygget-dev",
    "development": "framtidsbygget-dev",
    "production": "framtidsbygget"
  },
  "targets": {
    "framtidsbygget": {
      "hosting": {
        "app": ["framtidsbygget"]
      }
    }
  }
}
```

---

## Development Workflow

### Daily Development Process

1. **Start Development Session**
   ```bash
   # Start Firebase emulators
   npm run firebase:emulators
   
   # In another terminal, start dev server
   npm run dev
   
   # Optional: Start Storybook for component development
   npm run storybook
   ```

2. **Code Development**
   - Write components following patterns in state-management-architecture.md
   - Test components in Storybook
   - Write unit tests for new functionality
   - Use ESLint and Prettier for code quality

3. **Testing Workflow**
   ```bash
   # Run all tests
   npm test
   
   # Run tests in watch mode
   npm run test:watch
   
   # Run tests with coverage
   npm run test:coverage
   
   # Lint and format code
   npm run lint:fix
   npm run format
   ```

4. **Git Workflow**
   ```bash
   # Create feature branch
   git checkout -b feature/new-component
   
   # Stage and commit changes
   git add .
   git commit -m "Add new component with tests"
   
   # Push to remote
   git push origin feature/new-component
   ```

### Component Development Process

1. **Create Component Structure**
   ```bash
   # Create component files
   mkdir src/components/new-component
   touch src/components/new-component/NewComponent.jsx
   touch src/components/new-component/NewComponent.test.js
   touch src/components/new-component/NewComponent.stories.js
   touch src/components/new-component/index.js
   ```

2. **Follow Component Template**
   ```javascript
   // Component implementation
   import React from 'react';
   import './NewComponent.css';
   
   const NewComponent = ({ prop1, prop2, ...props }) => {
     return (
       <div className="new-component" {...props}>
         {/* Component content */}
       </div>
     );
   };
   
   export default NewComponent;
   ```

3. **Write Tests**
   ```javascript
   import { render, screen } from '@testing-library/react';
   import NewComponent from './NewComponent';
   
   describe('NewComponent', () => {
     it('renders without crashing', () => {
       render(<NewComponent />);
       expect(screen.getByRole('...').toBeInTheDocument();
     });
   });
   ```

4. **Create Storybook Stories**
   ```javascript
   export default {
     title: 'Components/NewComponent',
     component: NewComponent,
   };
   
   export const Default = {
     args: {
       prop1: 'value1',
       prop2: 'value2'
     }
   };
   ```

---

## Debugging & Development Tools

### Browser DevTools Setup

1. **React Developer Tools**
   - Install React DevTools browser extension
   - Enable Profiler for performance debugging
   - Use Components tab to inspect React tree

2. **PixiJS DevTools**
   ```javascript
   // Add to development build
   if (import.meta.env.VITE_DEBUG_MODE === 'true') {
     // Enable PixiJS debugging
     window.PIXI = PIXI;
     window.__PIXI_INSPECTOR_GLOBAL_HOOK__ = true;
   }
   ```

3. **Performance Monitoring**
   ```javascript
   // Add performance monitoring
   if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true') {
     import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
       getCLS(console.log);
       getFID(console.log);
       getFCP(console.log);
       getLCP(console.log);
       getTTFB(console.log);
     });
   }
   ```

### Debug Configuration

Create `src/utils/debugConfig.js`:

```javascript
/**
 * Debug configuration för development
 */

export const debugConfig = {
  enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
  showPerformanceMetrics: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  enablePixiDebug: import.meta.env.VITE_DEBUG_MODE === 'true',
  logLevel: import.meta.env.VITE_DEBUG_MODE === 'true' ? 'debug' : 'warn'
};

export const debugLog = (message, data = null, level = 'log') => {
  if (!debugConfig.enabled) return;
  
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  if (data) {
    console[level](logMessage, data);
  } else {
    console[level](logMessage);
  }
};

export const debugTime = (label) => {
  if (!debugConfig.enabled) return;
  console.time(label);
};

export const debugTimeEnd = (label) => {
  if (!debugConfig.enabled) return;
  console.timeEnd(label);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  if (!debugConfig.showPerformanceMetrics) return fn();
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  debugLog(`Performance: ${name} took ${end - start} milliseconds`);
  return result;
};
```

---

## Storybook Configuration

### Main Configuration (.storybook/main.js)

```javascript
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  features: {
    storyStoreV7: true
  },
  viteFinal: async (config) => {
    // Customize Vite config for Storybook
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': '/src',
          '@components': '/src/components',
          '@utils': '/src/utils',
          '@hooks': '/src/hooks',
          '@styles': '/src/styles'
        }
      }
    };
  }
};
```

### Preview Configuration (.storybook/preview.js)

```javascript
import '../src/styles/main.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px'
        }
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px'
        }
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1200px',
          height: '800px'
        }
      }
    }
  }
};

// Global decorators
export const decorators = [
  (Story) => (
    <div style={{ margin: '1rem' }}>
      <Story />
    </div>
  )
];
```

---

## Deployment Configuration

### Build Process

```bash
# Development build
npm run build

# Production build with environment
NODE_ENV=production npm run build

# Preview production build
npm run preview

# Deploy to Firebase
npm run firebase:deploy
```

### Deployment Checklist

- [ ] All tests passing
- [ ] Linting errors resolved
- [ ] Environment variables configured
- [ ] Firebase project configured
- [ ] Build optimizations applied
- [ ] Performance metrics acceptable
- [ ] Accessibility requirements met
- [ ] Cross-browser compatibility tested

### CI/CD Configuration (GitHub Actions)

Create `.github/workflows/main.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Build application
      run: npm run build
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: framtidsbygget
```

---

## Performance Optimization

### Build Optimization

```javascript
// vite.config.js optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore'],
          'pixi-vendor': ['pixi.js'],
          'utils': ['src/utils/AssetLoader.js', 'src/utils/PixiPerformanceManager.js']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### Asset Optimization

```bash
# Image optimization
npm install -D imagemin imagemin-webp imagemin-pngquant

# Audio optimization
npm install -D audiosprite

# Bundle analysis
npm install -D webpack-bundle-analyzer
```

---

## Troubleshooting Guide

### Common Issues

1. **Firebase Connection Issues**
   ```bash
   # Check Firebase CLI version
   firebase --version
   
   # Login to Firebase
   firebase login
   
   # Verify project
   firebase projects:list
   ```

2. **PixiJS Memory Leaks**
   ```javascript
   // Always destroy PixiJS applications
   useEffect(() => {
     return () => {
       if (pixiApp) {
         pixiApp.destroy(true, { children: true, texture: true });
       }
     };
   }, []);
   ```

3. **Build Errors**
   ```bash
   # Clear cache
   npm run clean
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   
   # Check for conflicting dependencies
   npm ls
   ```

4. **Hot Reload Issues**
   ```bash
   # Restart dev server
   npm run dev
   
   # Clear browser cache
   # Use incognito mode for testing
   ```

### Performance Issues

1. **Slow Development Server**
   - Reduce bundle size with lazy loading
   - Use development-specific optimizations
   - Disable source maps temporarily

2. **Test Performance**
   - Run tests in parallel: `npm test -- --maxWorkers=4`
   - Use test patterns: `npm test -- --testPathPattern=components`

3. **Build Performance**
   - Use build cache
   - Optimize dependencies
   - Consider using SWC instead of Babel

---

## Development Environment Checklist

### Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Git configured with user credentials
- [ ] Firebase CLI installed and authenticated
- [ ] VSCode with recommended extensions
- [ ] Environment variables configured
- [ ] Firebase project created and configured
- [ ] All dependencies installed successfully
- [ ] Tests running successfully
- [ ] Development server starting without errors
- [ ] Storybook loading correctly
- [ ] Firebase emulators working

### Daily Workflow Checklist

- [ ] Pull latest changes from main branch
- [ ] Start Firebase emulators
- [ ] Start development server
- [ ] Run existing tests to ensure nothing broken
- [ ] Write new code following established patterns
- [ ] Write tests for new functionality
- [ ] Test components in Storybook
- [ ] Run linting and formatting
- [ ] Commit changes with descriptive messages
- [ ] Push changes to feature branch

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code coverage above 70%
- [ ] No linting errors
- [ ] No console errors in production build
- [ ] Performance budgets met
- [ ] Accessibility requirements satisfied
- [ ] Cross-browser compatibility verified
- [ ] Firebase security rules updated
- [ ] Environment variables configured for production

---

**Development Environment Complete:** Utvecklingsmiljön är nu fullständigt konfigurerad för effektiv utveckling av Framtidsbygget med full tooling, testing och deployment pipeline.