# Optimized Prompt Library - Framtidsbygget

**Version:** 1.0  
**Status:** Component-Specific AI Prompts  
**Purpose:** Provide battle-tested, optimized prompts for each component type to maximize AI success rate

---

## Table of Contents

1. [Component-Specific Prompts](#component-specific-prompts)
2. [Game Module Prompts](#game-module-prompts)
3. [Integration Prompts](#integration-prompts)
4. [Validation Prompts](#validation-prompts)
5. [Template Prompts](#template-prompts)

---

## Component-Specific Prompts

### MainDashboard.jsx (Success Rate: 9/10)

```markdown
# PROMPT: MainDashboard Component Implementation

## ROLE
You are implementing MainDashboard.jsx for Framtidsbygget, an educational React game teaching digital transformation.

## EXACT SPECIFICATIONS
- Component Type: Framework/Container Component
- Dependencies: React, MapView, Scoreboard, Button from design system
- State Requirements: Receives gameState via props
- Props Interface:
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
    onLocationSelect: (location: string) => void;
    onOpenKompassen: () => void;
  }
  ```
- Performance Targets: 60fps, <100ms interaction response

## INTEGRATION CONTEXT
- Parent Component: App.jsx
- Child Components: 
  - MapView (receives completedGames, currentLocation, onLocationSelect)
  - Scoreboard (receives playerScore)
- State Management: Read-only consumer of gameState
- Event Flow: User clicks map location → onLocationSelect → App.jsx handles

## IMPLEMENTATION REQUIREMENTS
1. Create a responsive flex layout with MapView (70%) and Scoreboard (30%)
2. Add "Öppna Digitala Kompassen" button below map
3. Ensure proper spacing using CSS variables
4. Handle loading states gracefully
5. Implement error boundaries

## VALIDATION CRITERIA
- [ ] Renders without crashing with empty gameState
- [ ] MapView and Scoreboard receive correct props
- [ ] Button click triggers onOpenKompassen
- [ ] Layout responsive on mobile (320px+)
- [ ] Performance: <16ms render time

## CODE STRUCTURE
```javascript
import React from 'react';
import MapView from './MapView';
import Scoreboard from './Scoreboard';
import Button from './common/Button';
import './MainDashboard.css';

const MainDashboard = ({ gameState, onLocationSelect, onOpenKompassen }) => {
  // Component implementation here
};

export default MainDashboard;
```
```

### Scoreboard.jsx (Success Rate: 9/10)

```markdown
# PROMPT: Scoreboard Component Implementation

## ROLE
You are implementing Scoreboard.jsx, a pure presentational component for Framtidsbygget.

## EXACT SPECIFICATIONS
- Component Type: Presentational/Display Component
- Dependencies: React, Card from design system, icons
- State Requirements: None (stateless)
- Props Interface:
  ```typescript
  interface ScoreboardProps {
    playerScore: {
      totalFL: number;
      gamesCompleted: number;
      achievements: string[];
    };
  }
  ```
- Performance Targets: Minimal re-renders, memoized

## VISUAL DESIGN
- Layout: Vertical stack in Card component
- Styling: Use className="scoreboard"
- Content:
  1. Title: "Din Progress"
  2. FL-poäng display with icon
  3. Games completed counter
  4. Achievement badges (if any)
- Typography: Use CSS variables for consistent sizing

## IMPLEMENTATION REQUIREMENTS
1. Display totalFL with thousands separator (1,234)
2. Show "X av 5 uppdrag slutförda"
3. Render achievement icons in a grid
4. Use semantic HTML (dl/dt/dd for stats)
5. Apply React.memo for optimization

## VALIDATION CRITERIA
- [ ] Handles undefined/null playerScore gracefully
- [ ] Numbers formatted correctly
- [ ] Achievement grid wraps properly
- [ ] Accessible markup (ARIA labels)
- [ ] Zero unnecessary re-renders

## EXAMPLE OUTPUT
```jsx
<Card className="scoreboard">
  <h2>Din Progress</h2>
  <dl className="scoreboard__stats">
    <dt><Icon name="stars" /> FL-poäng</dt>
    <dd>1,234</dd>
    <dt><Icon name="check_circle" /> Uppdrag</dt>
    <dd>3 av 5 slutförda</dd>
  </dl>
</Card>
```
```

### MapView.jsx (Success Rate: 8/10)

```markdown
# PROMPT: MapView SVG Component Implementation

## ROLE
You are implementing MapView.jsx, an interactive SVG map component for Framtidsbygget.

## EXACT SPECIFICATIONS
- Component Type: Interactive SVG Component
- Dependencies: React, useState, useEffect
- State Requirements: 
  - hoveredLocation: string | null
  - animationProgress: Map<string, number>
- Props Interface:
  ```typescript
  interface MapViewProps {
    completedGames: string[];
    currentLocation: string | null;
    onLocationSelect: (location: string) => void;
  }
  ```
- Performance Targets: 60fps animations, <50ms hover response

## SVG STRUCTURE
```svg
<svg viewBox="0 0 800 600" className="map-view">
  <!-- Background -->
  <rect className="map-view__background" />
  
  <!-- Paths between locations -->
  <g className="map-view__paths">
    {paths.map(path => <path key={path.id} />)}
  </g>
  
  <!-- Location nodes -->
  <g className="map-view__locations">
    {locations.map(loc => (
      <g key={loc.id} transform={`translate(${loc.x}, ${loc.y})`}>
        <circle className="location-node" />
        <text className="location-label">{loc.name}</text>
      </g>
    ))}
  </g>
</svg>
```

## ANIMATION REQUIREMENTS
1. Completed paths: Animate stroke-dasharray from 0 to full
2. Hover effects: Scale location nodes 1.1x
3. Current location: Pulsing animation
4. Use CSS animations, not JS for performance

## INTERACTION LOGIC
```javascript
const handleLocationClick = (locationId) => {
  if (isLocationAccessible(locationId)) {
    onLocationSelect(locationId);
  }
};

const isLocationAccessible = (locationId) => {
  // Check if location is unlocked based on completedGames
};
```

## VALIDATION CRITERIA
- [ ] SVG scales responsively
- [ ] Animations run at 60fps
- [ ] Touch targets minimum 44x44px
- [ ] Keyboard navigation support
- [ ] ARIA labels for accessibility
```

### DigitalaKompassen.jsx (Success Rate: 7/10)

```markdown
# PROMPT: Digital Compass D3 Tree Component

## ROLE
You are implementing DigitalaKompassen.jsx using react-d3-tree for Framtidsbygget.

## EXACT SPECIFICATIONS
- Component Type: Complex Visualization Component  
- Dependencies: React, react-d3-tree, Card
- External Data: strategy.json (hierarchical structure)
- State Requirements:
  - treeData: object (from strategy.json)
  - selectedNode: string | null
  - treeTranslate: {x: number, y: number}
- Props Interface:
  ```typescript
  interface DigitalaKompassenProps {
    completedStrategies: string[];
    onNodeSelect?: (nodeId: string) => void;
    onClose: () => void;
  }
  ```

## D3 TREE CONFIGURATION
```javascript
const treeConfig = {
  orientation: 'vertical',
  pathFunc: 'step', // Right-angle connectors
  nodeSize: { x: 200, y: 100 },
  separation: { siblings: 1.5, nonSiblings: 2 },
  transitionDuration: 500,
  translate: { x: 400, y: 50 },
  zoom: 0.8,
  scaleExtent: { min: 0.5, max: 2 },
  enableLegacyTransitions: false
};
```

## CUSTOM NODE RENDERING
```javascript
const renderCustomNode = ({ nodeDatum, toggleNode }) => (
  <g>
    <circle 
      r="30" 
      className={`node ${completedStrategies.includes(nodeDatum.id) ? 'completed' : ''}`}
      onClick={toggleNode}
    />
    <text className="node-label" dy=".35em">
      {nodeDatum.title}
    </text>
  </g>
);
```

## DATA LOADING PATTERN
```javascript
useEffect(() => {
  fetch('/data/strategy.json')
    .then(res => res.json())
    .then(data => setTreeData(transformToD3Format(data)))
    .catch(err => setError(err));
}, []);
```

## VALIDATION CRITERIA
- [ ] Tree renders with correct hierarchy
- [ ] Completed nodes show visual distinction
- [ ] Pan/zoom controls work smoothly
- [ ] Node clicks trigger callbacks
- [ ] Handles loading/error states
```

---

## Game Module Prompts

### PuzzleGameModule.jsx (Success Rate: 8/10)

```markdown
# PROMPT: Puzzle Game Module - Secure Data Systems

## ROLE
You are implementing PuzzleGameModule.jsx, a drag-and-drop puzzle game for Framtidsbygget.

## EXACT SPECIFICATIONS
- Component Type: Interactive Game Module
- Dependencies: React, DnD library, SVG for connections
- Game State:
  ```typescript
  interface PuzzleGameState {
    nodes: Array<{
      id: string;
      name: string;
      type: 'source' | 'internal';
      dataType: 'person' | 'org';
      isLegacy: boolean;
      isModernized: boolean;
      requirements: string[];
      position: {x: number, y: number};
    }>;
    connections: Array<{
      id: string;
      fromNode: string;
      toNode: string;
      status: 'valid' | 'invalid_firewall';
    }>;
    budget: number;
    dragState: {
      fromNode: string;
      mousePosition: {x: number, y: number};
    } | null;
  }
  ```

## GAME BOARD LAYOUT
```javascript
const GameBoard = () => (
  <div className="puzzle-game__board">
    <div className="puzzle-game__column source-column">
      {sourceNodes.map(node => <DataNode key={node.id} {...node} />)}
    </div>
    <div className="puzzle-game__column infrastructure-column">
      <EnaHub />
      <Firewall />
    </div>
    <div className="puzzle-game__column internal-column">
      {internalNodes.map(node => <DataNode key={node.id} {...node} />)}
    </div>
    <ConnectionLayer connections={connections} dragState={dragState} />
  </div>
);
```

## DRAG-DROP IMPLEMENTATION
```javascript
const handleNodeDragStart = (nodeId, event) => {
  // Check if node is modernized
  const node = nodes.find(n => n.id === nodeId);
  if (node.isLegacy && !node.isModernized) {
    showModal('modernize', node);
    return;
  }
  
  setDragState({
    fromNode: nodeId,
    mousePosition: { x: event.clientX, y: event.clientY }
  });
};

const handleNodeDrop = (targetNodeId) => {
  if (!dragState) return;
  
  // Validate connection through Ena hub
  if (!isValidPath(dragState.fromNode, targetNodeId)) {
    showError('Connections must go through Ena hub');
    return;
  }
  
  // Check firewall crossing
  const crossesFirewall = checkFirewallCrossing(dragState.fromNode, targetNodeId);
  
  addConnection({
    fromNode: dragState.fromNode,
    toNode: targetNodeId,
    status: crossesFirewall ? 'invalid_firewall' : 'valid'
  });
  
  setDragState(null);
  checkWinCondition();
};
```

## WIN CONDITION CHECK
```javascript
const checkWinCondition = () => {
  const internalNodes = nodes.filter(n => n.type === 'internal');
  const allRequirementsMet = internalNodes.every(node => {
    return node.requirements.every(req => 
      isRequirementMet(node.id, req, connections)
    );
  });
  
  if (allRequirementsMet) {
    onGameComplete({
      success: true,
      score: calculateScore(budget, connections),
      timeSpent: Date.now() - startTime
    });
  }
};
```

## VALIDATION CRITERIA
- [ ] Drag-drop works on desktop and touch
- [ ] Connection validation enforces rules
- [ ] Visual feedback for valid/invalid drops
- [ ] Budget updates correctly
- [ ] Win condition triggers properly
```

### ConnectivityGameModule.jsx (Success Rate: 5/10) ⚠️

```markdown
# PROMPT: Crisis Management Game - CRITICAL COMPLEXITY

## ROLE
You are implementing ConnectivityGameModule.jsx, the most complex game module using PixiJS.

## CRITICAL CONTEXT
This is a TWO-PHASE game with different mechanics:
1. BUILD PHASE: Place infrastructure on a map
2. CRISIS PHASE: Real-time defense against attacks

## EXACT SPECIFICATIONS
- Component Type: PixiJS Game with React wrapper
- Dependencies: React, PixiJS, GameCanvasWrapper
- Complex State:
  ```typescript
  interface ConnectivityGameState {
    gamePhase: 'build' | 'crisis' | 'end';
    
    // Build phase state
    mapInfrastructure: {
      nodes: Array<{
        id: string;
        position: {x: number, y: number};
        type: 'city' | 'hospital' | 'power';
        status: 'offline' | 'online' | 'damaged' | 'infected';
        isRobust: boolean;
      }>;
      connections: Array<{
        from: string;
        to: string;
        type: 'fiber' | '5g';
      }>;
    };
    budget: number;
    buildTool: 'fiber' | '5g_mast' | 'robustness' | null;
    
    // Crisis phase state
    crisisState: {
      timer: number; // 300 seconds countdown
      communityIndex: number; // 100 to 0
      activeCrises: Array<{
        id: string;
        type: 'storm' | 'cyberattack' | 'powerout';
        affectedNodes: string[];
        startTime: number;
      }>;
      repairTeams: Array<{
        targetNode: string;
        progress: number;
      }>;
    };
  }
  ```

## REACT-PIXIJS BRIDGE PATTERN
```javascript
const ConnectivityGameModule = ({ initialBudget, onGameComplete }) => {
  const [gameState, setGameState] = useState(initialState);
  const pixiCallbacksRef = useRef({});
  
  // Bridge callbacks from PixiJS to React
  pixiCallbacksRef.current = {
    onNodeClick: (nodeId) => {
      if (gameState.gamePhase === 'build') {
        handleBuildAction(nodeId);
      } else if (gameState.gamePhase === 'crisis') {
        handleRepairAction(nodeId);
      }
    },
    onConnectionDraw: (from, to) => {
      if (gameState.budget >= CONNECTION_COST) {
        addConnection(from, to);
        setBudget(prev => prev - CONNECTION_COST);
      }
    }
  };
  
  return (
    <div className="connectivity-game">
      <GameCanvasWrapper
        gameState={gameState}
        callbacks={pixiCallbacksRef.current}
        onMount={initializePixiGame}
      />
      {gameState.gamePhase === 'build' && <BuildHUD />}
      {gameState.gamePhase === 'crisis' && <CrisisHUD />}
    </div>
  );
};
```

## PIXIJS GAME IMPLEMENTATION
```javascript
class ConnectivityPixiGame {
  constructor(app, callbacks) {
    this.app = app;
    this.callbacks = callbacks;
    this.nodeSprites = new Map();
    this.connectionGraphics = new PIXI.Graphics();
    this.crisisEffects = [];
    
    this.setupMap();
    this.setupInteraction();
  }
  
  updateState(gameState) {
    // Update node visuals based on status
    gameState.mapInfrastructure.nodes.forEach(node => {
      const sprite = this.nodeSprites.get(node.id);
      if (sprite) {
        sprite.tint = this.getNodeColor(node.status);
        if (node.status === 'damaged') {
          this.addDamageEffect(sprite);
        }
      }
    });
    
    // Handle crisis effects
    if (gameState.gamePhase === 'crisis') {
      this.updateCrisisEffects(gameState.crisisState);
    }
  }
  
  getNodeColor(status) {
    const colors = {
      online: 0x2E7D32,
      offline: 0x5A5A5A,
      damaged: 0xC62828,
      infected: 0x8E24AA
    };
    return colors[status];
  }
}
```

## CRISIS PHASE LOGIC
```javascript
const runCrisisPhase = () => {
  const crisisInterval = setInterval(() => {
    setGameState(prev => {
      // Countdown timer
      const newTimer = prev.crisisState.timer - 1;
      if (newTimer <= 0) {
        clearInterval(crisisInterval);
        onGameComplete({ success: true, score: calculateScore() });
        return prev;
      }
      
      // Random crisis generation
      const newCrises = maybeGenerateCrisis(prev);
      
      // Update community index
      const damagedNodes = prev.mapInfrastructure.nodes
        .filter(n => n.status === 'damaged' || n.status === 'infected');
      const newIndex = 100 - (damagedNodes.length * 10);
      
      if (newIndex < 50) {
        clearInterval(crisisInterval);
        onGameComplete({ success: false, reason: 'Community index too low' });
      }
      
      return {
        ...prev,
        crisisState: {
          ...prev.crisisState,
          timer: newTimer,
          communityIndex: newIndex,
          activeCrises: [...prev.crisisState.activeCrises, ...newCrises]
        }
      };
    });
  }, 1000);
};
```

## CRITICAL IMPLEMENTATION NOTES
1. MEMORY MANAGEMENT: Destroy all PIXI objects on unmount
2. PERFORMANCE: Use object pooling for crisis effects
3. STATE SYNC: Never mutate PixiJS state directly
4. TOUCH SUPPORT: Implement both mouse and touch events
5. ERROR BOUNDARIES: Wrap in error boundary component

## VALIDATION CRITERIA
- [ ] Build phase: Can place/connect nodes
- [ ] Crisis phase: Real-time updates work
- [ ] No memory leaks on component unmount
- [ ] 60fps during crisis animations
- [ ] State sync never causes race conditions
```

---

## Integration Prompts

### GameCanvasWrapper Integration

```markdown
# PROMPT: GameCanvasWrapper - React-PixiJS Bridge

## ROLE
You are implementing GameCanvasWrapper.jsx, the critical bridge between React and PixiJS.

## EXACT SPECIFICATIONS
- Purpose: Provide a reusable wrapper for PixiJS games in React
- Key Challenge: Bidirectional state synchronization
- Performance Target: Zero unnecessary re-renders

## IMPLEMENTATION PATTERN
```javascript
import React, { useEffect, useRef, memo } from 'react';
import * as PIXI from 'pixi.js';

const GameCanvasWrapper = memo(({ 
  gameState, 
  callbacks, 
  gameClass,
  width = 800,
  height = 600 
}) => {
  const mountRef = useRef(null);
  const pixiAppRef = useRef(null);
  const gameInstanceRef = useRef(null);
  
  // Initialize PixiJS only once
  useEffect(() => {
    if (!mountRef.current) return;
    
    const app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x1a1a1a,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    
    mountRef.current.appendChild(app.view);
    pixiAppRef.current = app;
    
    // Create game instance
    gameInstanceRef.current = new gameClass(app, callbacks);
    
    // Cleanup
    return () => {
      gameInstanceRef.current?.destroy();
      app.destroy(true, { children: true, texture: true, baseTexture: true });
      pixiAppRef.current = null;
      gameInstanceRef.current = null;
    };
  }, []); // Empty deps - only run once
  
  // Update game state without re-rendering
  useEffect(() => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.updateState(gameState);
    }
  }, [gameState]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const parent = mountRef.current?.parentElement;
      if (parent && pixiAppRef.current) {
        const { width, height } = parent.getBoundingClientRect();
        pixiAppRef.current.renderer.resize(width, height);
        gameInstanceRef.current?.handleResize(width, height);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div ref={mountRef} className="game-canvas-wrapper" />;
});

export default GameCanvasWrapper;
```

## CRITICAL PATTERNS
1. Use refs to avoid re-renders
2. Separate initialization from updates
3. Proper cleanup to prevent memory leaks
4. Handle resize events gracefully
5. Memoize component to prevent parent re-renders
```

### State Bridge Pattern

```markdown
# PROMPT: State Bridge Implementation

## ROLE
Implement bidirectional state synchronization between React and game engines.

## PATTERN
```javascript
class StateBridge {
  constructor() {
    this.reactToGame = new Map();
    this.gameToReact = new Map();
    this.pendingUpdates = [];
    this.updateScheduled = false;
  }
  
  // React → Game (immediate)
  updateGameState(key, value) {
    const handler = this.reactToGame.get(key);
    if (handler) {
      handler(value);
    }
  }
  
  // Game → React (batched)
  queueReactUpdate(update) {
    this.pendingUpdates.push(update);
    
    if (!this.updateScheduled) {
      this.updateScheduled = true;
      requestAnimationFrame(() => {
        this.flushUpdates();
      });
    }
  }
  
  flushUpdates() {
    const updates = [...this.pendingUpdates];
    this.pendingUpdates = [];
    this.updateScheduled = false;
    
    updates.forEach(({ key, value }) => {
      const handler = this.gameToReact.get(key);
      if (handler) {
        handler(value);
      }
    });
  }
  
  registerReactToGame(key, handler) {
    this.reactToGame.set(key, handler);
  }
  
  registerGameToReact(key, handler) {
    this.gameToReact.set(key, handler);
  }
  
  destroy() {
    this.reactToGame.clear();
    this.gameToReact.clear();
    this.pendingUpdates = [];
  }
}
```
```

---

## Validation Prompts

### Component Validation Suite

```markdown
# PROMPT: Create Comprehensive Test Suite

## ROLE
Create exhaustive tests for [ComponentName] ensuring 100% reliability.

## TEST CATEGORIES

### 1. Render Tests
```javascript
describe('Component Rendering', () => {
  it('renders without crashing with minimal props', () => {
    render(<Component />);
  });
  
  it('renders all required elements', () => {
    const { getByRole, getByText } = render(<Component {...defaultProps} />);
    expect(getByRole('heading')).toBeInTheDocument();
    expect(getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles missing props gracefully', () => {
    const { container } = render(<Component />);
    expect(container.firstChild).not.toBeNull();
  });
});
```

### 2. State Tests
```javascript
describe('State Management', () => {
  it('initializes with correct default state', () => {
    const { getByTestId } = render(<Component />);
    expect(getByTestId('counter')).toHaveTextContent('0');
  });
  
  it('updates state on user interaction', async () => {
    const { getByRole } = render(<Component />);
    const button = getByRole('button');
    
    await userEvent.click(button);
    
    await waitFor(() => {
      expect(getByTestId('counter')).toHaveTextContent('1');
    });
  });
});
```

### 3. Integration Tests
```javascript
describe('Integration', () => {
  it('communicates with parent via callbacks', () => {
    const onComplete = jest.fn();
    const { getByRole } = render(<Component onComplete={onComplete} />);
    
    fireEvent.click(getByRole('button', { name: 'Complete' }));
    
    expect(onComplete).toHaveBeenCalledWith({
      success: true,
      score: expect.any(Number)
    });
  });
});
```

### 4. Performance Tests
```javascript
describe('Performance', () => {
  it('renders within performance budget', () => {
    const start = performance.now();
    render(<Component {...largeDataSet} />);
    const end = performance.now();
    
    expect(end - start).toBeLessThan(16); // 60fps
  });
  
  it('memoizes expensive calculations', () => {
    const calculateSpy = jest.spyOn(utils, 'expensiveCalculation');
    const { rerender } = render(<Component data={data} />);
    
    rerender(<Component data={data} />);
    
    expect(calculateSpy).toHaveBeenCalledTimes(1);
  });
});
```
```

### Game Module Validation

```markdown
# PROMPT: Game Module Test Suite

## ROLE
Create game-specific tests ensuring gameplay mechanics work correctly.

## GAME MECHANICS TESTS

```javascript
describe('Game Mechanics', () => {
  let gameInstance;
  
  beforeEach(() => {
    gameInstance = new GameModule();
  });
  
  describe('Win Conditions', () => {
    it('triggers win when all objectives complete', () => {
      const onComplete = jest.fn();
      gameInstance.onComplete = onComplete;
      
      // Complete all objectives
      gameInstance.completeObjective('obj1');
      gameInstance.completeObjective('obj2');
      gameInstance.completeObjective('obj3');
      
      expect(onComplete).toHaveBeenCalledWith({
        success: true,
        score: expect.any(Number)
      });
    });
  });
  
  describe('Game Rules', () => {
    it('enforces connection through hub', () => {
      const result = gameInstance.validateConnection('source1', 'internal1');
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Must connect through hub');
    });
    
    it('detects firewall crossing', () => {
      const connection = {
        from: 'personalData',
        to: 'internalSystem',
        path: ['node1', 'firewall', 'node2']
      };
      
      expect(gameInstance.checkFirewallViolation(connection)).toBe(true);
    });
  });
});
```
```

---

## Template Prompts

### New Component Template

```markdown
# PROMPT: Create New Component - [ComponentName]

## QUICK START
Copy this template and fill in the [...] placeholders.

## ROLE
You are implementing [ComponentName].jsx for Framtidsbygget, which [purpose].

## SPECIFICATIONS
- Type: [Presentational/Container/Game]
- Dependencies: [List all]
- State: [Describe or "None"]
- Props: 
  ```typescript
  interface [ComponentName]Props {
    [prop: type];
  }
  ```

## REQUIREMENTS
1. [First requirement]
2. [Second requirement]
3. [Performance: target]

## EXAMPLE CODE
```javascript
// Provide a minimal example showing structure
```

## VALIDATION
- [ ] [Test criteria 1]
- [ ] [Test criteria 2]
```

### Bug Fix Template

```markdown
# PROMPT: Fix [Issue Description]

## CONTEXT
Component: [ComponentName]
File: [filepath]
Issue: [Describe the bug]

## CURRENT BEHAVIOR
[What happens now]

## EXPECTED BEHAVIOR  
[What should happen]

## REPRODUCTION STEPS
1. [Step 1]
2. [Step 2]

## CONSTRAINTS
- Do not modify [what to preserve]
- Maintain compatibility with [dependencies]
- Performance must stay within [target]

## VALIDATION
After fix, these tests must pass:
- [Test 1]
- [Test 2]
```

### Optimization Template

```markdown
# PROMPT: Optimize [ComponentName] Performance

## CURRENT METRICS
- Render time: [X]ms
- Re-renders: [Y] per interaction
- Memory: [Z]MB

## TARGET METRICS
- Render time: <[X]ms
- Re-renders: <[Y]
- Memory: <[Z]MB

## OPTIMIZATION OPPORTUNITIES
1. [Memoization candidates]
2. [Calculation optimizations]
3. [Render optimizations]

## CONSTRAINTS
- Maintain all current functionality
- Keep code readable
- No breaking changes to API

## VALIDATION
Run performance tests:
```bash
npm run test:performance -- ComponentName
```
```

---

## Usage Guidelines

### When to Use Each Prompt Type

1. **Component-Specific**: For new component development
2. **Game Module**: For game mechanics implementation
3. **Integration**: For connecting systems
4. **Validation**: For test creation
5. **Template**: For common scenarios

### Best Practices

1. **Always include**:
   - Exact file paths
   - TypeScript interfaces
   - Performance targets
   - Validation criteria

2. **Never assume**:
   - Library availability
   - Implementation details
   - Performance capabilities

3. **Iterate based on results**:
   - Track success rates
   - Update prompts with lessons learned
   - Share successful patterns

---

*Last Updated: 2025-06-20*  
*Library Version: 1.0*  
*Optimized for Claude and GPT-4 models*