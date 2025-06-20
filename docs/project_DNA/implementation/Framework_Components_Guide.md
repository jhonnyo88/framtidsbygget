# Framework Components Implementation Guide

**Version:** 1.0  
**Purpose:** Essential implementation specs for core UI framework  
**Focus:** AI-implementable patterns with zero ambiguity

---

## Implementation Priority Order

```
1. Scoreboard (simplest, data display only)
2. MapView (SVG interactions, moderate complexity)
3. MainDashboard (combines 1+2, layout component)
```

---

## Scoreboard Component

### Requirements Summary
- **Type:** Pure presentational component (no local state)
- **Purpose:** Display player progress metrics
- **Complexity:** Low (9/10 AI success rate)
- **Dependencies:** Card, design system variables

### Props Interface
```typescript
interface ScoreboardProps {
  playerScore: {
    totalFL: number;           // Main score display
    gamesCompleted: number;    // Progress counter
    achievements: string[];    // Achievement badges
  };
}
```

### Implementation Pattern
```javascript
import React from 'react';
import Card from '../common/Card';
import './Scoreboard.css';

const Scoreboard = ({ playerScore }) => {
  const { totalFL = 0, gamesCompleted = 0, achievements = [] } = playerScore || {};
  
  return (
    <Card className="scoreboard">
      <h2 className="scoreboard__title">Din Progress</h2>
      
      <dl className="scoreboard__stats">
        <div className="scoreboard__stat">
          <dt className="scoreboard__label">
            <span className="material-symbols-outlined">stars</span>
            FL-poäng
          </dt>
          <dd className="scoreboard__value">
            {totalFL.toLocaleString('sv-SE')}
          </dd>
        </div>
        
        <div className="scoreboard__stat">
          <dt className="scoreboard__label">
            <span className="material-symbols-outlined">check_circle</span>
            Uppdrag
          </dt>
          <dd className="scoreboard__value">
            {gamesCompleted} av 5 slutförda
          </dd>
        </div>
      </dl>
      
      {achievements.length > 0 && (
        <div className="scoreboard__achievements">
          <h3 className="scoreboard__achievements-title">Utmärkelser</h3>
          <div className="scoreboard__badges">
            {achievements.slice(0, 3).map((achievement, index) => (
              <span key={index} className="scoreboard__badge">
                <span className="material-symbols-outlined">military_tech</span>
                {achievement}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default Scoreboard;
```

### CSS Implementation
```css
.scoreboard {
  padding: var(--space-l);
  height: fit-content;
}

.scoreboard__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-l) 0;
}

.scoreboard__stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  margin: 0;
}

.scoreboard__stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-s) 0;
  border-bottom: 1px solid var(--color-border);
}

.scoreboard__label {
  display: flex;
  align-items: center;
  gap: var(--space-s);
  font-size: var(--font-size-m);
  color: var(--color-text-secondary);
  margin: 0;
}

.scoreboard__value {
  font-size: var(--font-size-l);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.scoreboard__achievements {
  margin-top: var(--space-l);
  padding-top: var(--space-l);
  border-top: 1px solid var(--color-border);
}

.scoreboard__achievements-title {
  font-size: var(--font-size-m);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-s) 0;
}

.scoreboard__badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.scoreboard__badge {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-s);
  background: var(--color-brand-secondary);
  border-radius: var(--radius-s);
  font-size: var(--font-size-s);
  color: var(--color-text-primary);
}
```

### AI Implementation Steps
1. **Create component file:** `src/components/Scoreboard.jsx`
2. **Copy exact implementation** from above (no modifications needed)
3. **Create CSS file:** `src/components/Scoreboard.css`
4. **Validate with props:** Test with sample playerScore data
5. **Integration test:** Ensure Card component import works

### Validation Criteria
- [ ] Renders without crashing with empty/null props
- [ ] Numbers format correctly with Swedish locale
- [ ] Achievement badges display properly (max 3)
- [ ] Responsive layout works on mobile
- [ ] Uses design system variables consistently

---

## MapView Component

### Requirements Summary
- **Type:** Interactive SVG component with click handlers
- **Purpose:** Sweden map with clickable locations
- **Complexity:** Medium (8/10 AI success rate)
- **Dependencies:** SVG rendering, click handling

### Props Interface
```typescript
interface MapViewProps {
  completedGames: string[];                    // Completed world IDs
  currentLocation: string | null;              // Currently selected location
  onLocationSelect: (locationId: string) => void; // Click handler
}
```

### Location Data Structure
```javascript
const LOCATIONS = [
  {
    id: 'puzzle-game-datasystem',
    name: 'Säker Datasystem',
    x: 200,      // SVG coordinates
    y: 150,
    region: 'Stockholm'
  },
  {
    id: 'scenario-game-welfare',
    name: 'Välfärdens Dilemma',
    x: 180,
    y: 200,
    region: 'Göteborg'
  },
  {
    id: 'resource-game-competence',
    name: 'Kompetensresan',
    x: 220,
    y: 120,
    region: 'Malmö'
  },
  {
    id: 'crisis-game-connectivity',
    name: 'Konnektivitetsvakten',
    x: 160,
    y: 180,
    region: 'Uppsala'
  },
  {
    id: 'strategy-game-ecosystem',
    name: 'Ekosystembyggaren',
    x: 240,
    y: 160,
    region: 'Linköping'
  }
];
```

### Implementation Pattern
```javascript
import React, { useState } from 'react';
import './MapView.css';

const MapView = ({ completedGames = [], currentLocation, onLocationSelect }) => {
  const [hoveredLocation, setHoveredLocation] = useState(null);
  
  const isLocationCompleted = (locationId) => {
    return completedGames.includes(locationId);
  };
  
  const isLocationAccessible = (locationId) => {
    // First game is always accessible
    if (locationId === 'puzzle-game-datasystem') return true;
    
    // Other games unlock sequentially
    const gameOrder = [
      'puzzle-game-datasystem',
      'scenario-game-welfare', 
      'resource-game-competence',
      'crisis-game-connectivity',
      'strategy-game-ecosystem'
    ];
    
    const currentIndex = gameOrder.indexOf(locationId);
    if (currentIndex === -1) return false;
    
    // Check if previous game is completed
    return currentIndex === 0 || completedGames.includes(gameOrder[currentIndex - 1]);
  };
  
  const handleLocationClick = (location) => {
    if (isLocationAccessible(location.id)) {
      onLocationSelect(location.id);
    }
  };
  
  const getLocationStatus = (location) => {
    if (isLocationCompleted(location.id)) return 'completed';
    if (isLocationAccessible(location.id)) return 'accessible';
    return 'locked';
  };
  
  return (
    <div className="map-view">
      <svg 
        viewBox="0 0 400 300" 
        className="map-view__svg"
        role="img"
        aria-label="Interaktiv karta över Sverige med spelplatser"
      >
        {/* Background Sweden outline */}
        <path
          d="M50,50 L350,50 L350,250 L50,250 Z"
          className="map-view__background"
          fill="var(--color-surface-dark)"
          stroke="var(--color-border)"
          strokeWidth="2"
        />
        
        {/* Connection paths between completed locations */}
        {completedGames.length > 1 && (
          <g className="map-view__paths">
            {LOCATIONS.slice(0, completedGames.length - 1).map((location, index) => {
              const nextLocation = LOCATIONS[index + 1];
              if (!nextLocation) return null;
              
              return (
                <line
                  key={`path-${index}`}
                  x1={location.x}
                  y1={location.y}
                  x2={nextLocation.x}
                  y2={nextLocation.y}
                  className="map-view__path"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              );
            })}
          </g>
        )}
        
        {/* Location nodes */}
        <g className="map-view__locations">
          {LOCATIONS.map((location) => {
            const status = getLocationStatus(location);
            const isHovered = hoveredLocation === location.id;
            const isCurrent = currentLocation === location.id;
            
            return (
              <g
                key={location.id}
                transform={`translate(${location.x}, ${location.y})`}
                className={`map-view__location map-view__location--${status}`}
                onClick={() => handleLocationClick(location)}
                onMouseEnter={() => setHoveredLocation(location.id)}
                onMouseLeave={() => setHoveredLocation(null)}
                style={{ cursor: status === 'accessible' ? 'pointer' : 'default' }}
              >
                {/* Location circle */}
                <circle
                  r={isCurrent ? "20" : isHovered ? "18" : "15"}
                  className={`map-view__node map-view__node--${status}`}
                  fill={
                    status === 'completed' ? 'var(--color-state-success)' :
                    status === 'accessible' ? 'var(--color-brand-primary)' :
                    'var(--color-surface-dark)'
                  }
                  stroke={isCurrent ? 'var(--color-accent-warm)' : 'var(--color-border)'}
                  strokeWidth={isCurrent ? "4" : "2"}
                />
                
                {/* Status icon */}
                <text
                  className="map-view__icon"
                  textAnchor="middle"
                  dy="6"
                  fontSize="16"
                  fill="white"
                >
                  {status === 'completed' ? '✓' : 
                   status === 'accessible' ? '!' : 
                   '🔒'}
                </text>
                
                {/* Location label */}
                <text
                  className="map-view__label"
                  textAnchor="middle"
                  dy="35"
                  fontSize="12"
                  fill="var(--color-text-primary)"
                >
                  {location.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Tooltip for hovered location */}
      {hoveredLocation && (
        <div className="map-view__tooltip">
          {LOCATIONS.find(l => l.id === hoveredLocation)?.name}
        </div>
      )}
    </div>
  );
};

export default MapView;
```

### CSS Implementation
```css
.map-view {
  position: relative;
  width: 100%;
  height: 400px;
  background: var(--color-surface);
  border-radius: var(--radius-l);
  overflow: hidden;
}

.map-view__svg {
  width: 100%;
  height: 100%;
}

.map-view__location {
  transition: all 0.2s ease;
}

.map-view__location:hover .map-view__node {
  filter: brightness(1.1);
}

.map-view__node {
  transition: all 0.3s ease;
}

.map-view__node--completed {
  animation: pulse-success 2s ease-in-out infinite;
}

.map-view__node--accessible:hover {
  transform: scale(1.1);
}

.map-view__node--locked {
  opacity: 0.5;
}

.map-view__icon {
  pointer-events: none;
  font-weight: bold;
}

.map-view__label {
  pointer-events: none;
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-medium);
}

.map-view__path {
  animation: dash-flow 2s linear infinite;
}

.map-view__tooltip {
  position: absolute;
  top: 10px;
  left: 10px;
  background: var(--color-text-primary);
  color: var(--color-surface);
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-s);
  font-size: var(--font-size-s);
  pointer-events: none;
}

@keyframes pulse-success {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes dash-flow {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 10; }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .map-view {
    height: 300px;
  }
  
  .map-view__label {
    font-size: 10px;
  }
}
```

### AI Implementation Steps
1. **Create component file:** `src/components/MapView.jsx`
2. **Copy LOCATIONS constant** exactly as shown
3. **Implement component logic** with accessibility checking
4. **Add CSS animations** for completed states
5. **Test click handlers** with console.log first
6. **Validate responsiveness** on mobile

### Validation Criteria
- [ ] SVG renders correctly on all screen sizes
- [ ] Click handlers only work for accessible locations
- [ ] Completed locations show success animation
- [ ] Tooltip appears on hover
- [ ] Paths animate between completed locations
- [ ] Keyboard navigation works (tab/enter)

---

## MainDashboard Component

### Requirements Summary
- **Type:** Layout container component
- **Purpose:** Combine Scoreboard + MapView in responsive layout
- **Complexity:** Medium (9/10 AI success rate)
- **Dependencies:** Scoreboard, MapView, Button

### Props Interface
```typescript
interface MainDashboardProps {
  gameState: {
    completedGames: string[];
    playerScore: {
      totalFL: number;
      gamesCompleted: number;
      achievements: string[];
    };
    currentLocation: string | null;
  };
  onLocationSelect: (locationId: string) => void;
  onOpenKompassen: () => void;
}
```

### Implementation Pattern
```javascript
import React from 'react';
import Scoreboard from './Scoreboard';
import MapView from './MapView';
import Button from './common/Button';
import './MainDashboard.css';

const MainDashboard = ({ 
  gameState, 
  onLocationSelect, 
  onOpenKompassen 
}) => {
  const { 
    completedGames = [], 
    playerScore = {}, 
    currentLocation = null 
  } = gameState || {};
  
  return (
    <div className="main-dashboard">
      <header className="main-dashboard__header">
        <h1 className="main-dashboard__title">Framtidsbygget</h1>
        <p className="main-dashboard__subtitle">
          Din resa som digital strateg för Sverige
        </p>
      </header>
      
      <div className="main-dashboard__content">
        {/* Left column - Scoreboard */}
        <aside className="main-dashboard__sidebar">
          <Scoreboard playerScore={playerScore} />
          
          <div className="main-dashboard__actions">
            <Button
              variant="secondary"
              onClick={onOpenKompassen}
              className="main-dashboard__kompassen-button"
            >
              <span className="material-symbols-outlined">explore</span>
              Öppna Digitala Kompassen
            </Button>
          </div>
        </aside>
        
        {/* Right column - Map */}
        <main className="main-dashboard__main">
          <div className="main-dashboard__map-container">
            <h2 className="main-dashboard__map-title">
              Välj ditt nästa uppdrag
            </h2>
            <MapView
              completedGames={completedGames}
              currentLocation={currentLocation}
              onLocationSelect={onLocationSelect}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainDashboard;
```

### CSS Implementation
```css
.main-dashboard {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--space-l);
}

.main-dashboard__header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.main-dashboard__title {
  font-size: var(--font-size-xxl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-s) 0;
}

.main-dashboard__subtitle {
  font-size: var(--font-size-l);
  color: var(--color-text-secondary);
  margin: 0;
}

.main-dashboard__content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: var(--space-xl);
  max-width: 1200px;
  margin: 0 auto;
}

.main-dashboard__sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.main-dashboard__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.main-dashboard__kompassen-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
}

.main-dashboard__main {
  display: flex;
  flex-direction: column;
}

.main-dashboard__map-container {
  flex: 1;
}

.main-dashboard__map-title {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-l) 0;
  text-align: center;
}

/* Mobile responsiveness */
@media (max-width: 1024px) {
  .main-dashboard__content {
    grid-template-columns: 1fr;
    gap: var(--space-l);
  }
  
  .main-dashboard__sidebar {
    order: 2;
  }
  
  .main-dashboard__main {
    order: 1;
  }
}

@media (max-width: 768px) {
  .main-dashboard {
    padding: var(--space-m);
  }
  
  .main-dashboard__title {
    font-size: var(--font-size-xl);
  }
  
  .main-dashboard__subtitle {
    font-size: var(--font-size-m);
  }
}
```

### AI Implementation Steps
1. **Create component file:** `src/components/MainDashboard.jsx`
2. **Verify imports** for Scoreboard and MapView work
3. **Test responsive layout** at different screen sizes
4. **Validate prop passing** to child components
5. **Test button click handlers** with console.log
6. **Ensure accessibility** with proper heading hierarchy

### Validation Criteria
- [ ] Two-column layout works on desktop
- [ ] Single-column layout works on mobile
- [ ] All props pass correctly to child components
- [ ] Button click triggers onOpenKompassen callback
- [ ] Responsive design works smoothly
- [ ] Proper semantic HTML structure

---

## State Integration Pattern

### Context Setup
```javascript
// GameStateContext.js
import React, { createContext, useContext, useReducer } from 'react';

const GameStateContext = createContext();

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within GameStateProvider');
  }
  return context;
};

const gameStateReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_GAME_STATE':
      return { ...action.payload };
      
    case 'UPDATE_SCORE':
      return {
        ...state,
        playerScore: {
          ...state.playerScore,
          totalFL: state.playerScore.totalFL + action.payload.score
        }
      };
      
    case 'COMPLETE_GAME':
      return {
        ...state,
        completedGames: [...state.completedGames, action.payload.gameId],
        playerScore: {
          ...state.playerScore,
          gamesCompleted: state.playerScore.gamesCompleted + 1
        }
      };
      
    default:
      return state;
  }
};

export const GameStateProvider = ({ children }) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, {
    completedGames: [],
    playerScore: {
      totalFL: 0,
      gamesCompleted: 0,
      achievements: []
    },
    currentLocation: null
  });
  
  const actions = {
    loadGameState: (state) => dispatch({ type: 'LOAD_GAME_STATE', payload: state }),
    updateScore: (score) => dispatch({ type: 'UPDATE_SCORE', payload: { score } }),
    completeGame: (gameId) => dispatch({ type: 'COMPLETE_GAME', payload: { gameId } })
  };
  
  return (
    <GameStateContext.Provider value={{ gameState, actions }}>
      {children}
    </GameStateContext.Provider>
  );
};
```

### App.jsx Integration
```javascript
// App.jsx
import React, { useState } from 'react';
import { GameStateProvider } from './contexts/GameStateContext';
import MainDashboard from './components/MainDashboard';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  
  const handleLocationSelect = (locationId) => {
    console.log('Navigate to game:', locationId);
    // Navigate to game component
  };
  
  const handleOpenKompassen = () => {
    console.log('Open Digital Compass');
    // Open DigitalaKompassen component
  };
  
  return (
    <GameStateProvider>
      <div className="app">
        {currentView === 'dashboard' && (
          <MainDashboard
            onLocationSelect={handleLocationSelect}
            onOpenKompassen={handleOpenKompassen}
          />
        )}
      </div>
    </GameStateProvider>
  );
}

export default App;
```

---

## Testing Framework

### Component Testing Pattern
```javascript
// Scoreboard.test.js
import { render, screen } from '@testing-library/react';
import Scoreboard from './Scoreboard';

const mockPlayerScore = {
  totalFL: 1234,
  gamesCompleted: 3,
  achievements: ['Achievement 1', 'Achievement 2']
};

test('renders player score correctly', () => {
  render(<Scoreboard playerScore={mockPlayerScore} />);
  
  expect(screen.getByText('1,234')).toBeInTheDocument();
  expect(screen.getByText('3 av 5 slutförda')).toBeInTheDocument();
  expect(screen.getByText('Achievement 1')).toBeInTheDocument();
});

test('handles empty props gracefully', () => {
  render(<Scoreboard playerScore={null} />);
  
  expect(screen.getByText('0')).toBeInTheDocument();
  expect(screen.getByText('0 av 5 slutförda')).toBeInTheDocument();
});
```

### Integration Testing
```javascript
// MainDashboard.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import MainDashboard from './MainDashboard';

const mockGameState = {
  completedGames: ['puzzle-game-datasystem'],
  playerScore: {
    totalFL: 500,
    gamesCompleted: 1,
    achievements: []
  }
};

test('integrates scoreboard and map correctly', () => {
  const onLocationSelect = jest.fn();
  const onOpenKompassen = jest.fn();
  
  render(
    <MainDashboard
      gameState={mockGameState}
      onLocationSelect={onLocationSelect}
      onOpenKompassen={onOpenKompassen}
    />
  );
  
  // Scoreboard shows correct data
  expect(screen.getByText('500')).toBeInTheDocument();
  
  // Kompassen button works
  fireEvent.click(screen.getByText('Öppna Digitala Kompassen'));
  expect(onOpenKompassen).toHaveBeenCalled();
});
```

---

## Success Checklist

### Framework Components Complete
- [ ] Scoreboard renders with correct data formatting
- [ ] MapView shows interactive Sweden map
- [ ] MainDashboard combines both in responsive layout
- [ ] All components pass prop validation
- [ ] CSS follows design system variables
- [ ] Mobile responsiveness verified
- [ ] Accessibility features implemented
- [ ] Unit tests pass for all components
- [ ] Integration with state management works
- [ ] Click handlers function correctly

**Next Step:** Proceed to Game Modules Guide for minispel implementation