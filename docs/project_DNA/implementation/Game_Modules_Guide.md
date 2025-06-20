# Game Modules Implementation Guide

**Version:** 1.0  
**Purpose:** Condensed implementation specs for all 5 minispel  
**Focus:** Essential patterns för AI development success

---

## Implementation Priority Order

```
1. WelfareGameModule (dialogue-based, no PixiJS - simplest)
2. PuzzleGameModule (PixiJS introduction, drag-drop)
3. CompetenceGameModule (card-based interactions)
4. EcosystemGameModule (strategic building)
5. ConnectivityGameModule (most complex PixiJS)
```

---

## WelfareGameModule (Dialogue System)

### Requirements Summary
- **Type:** Pure React dialogue game
- **Purpose:** 3-character conversation with meter management
- **Complexity:** Medium (7/10 AI success rate)
- **Dependencies:** Dialogue Engine Core, character state management

### Props Interface
```typescript
interface WelfareGameModuleProps {
  onGameComplete: (result: GameResult) => void;
  initialBudget?: number;
}

interface GameResult {
  success: boolean;
  score: number;
  outcome: string;
  worldId: 'scenario-game-welfare';
}
```

### Implementation Pattern
```javascript
import React, { useState, useEffect } from 'react';
import { dialogueData } from './data/welfareDialogueData';
import ValueMeter from '../common/ValueMeter';
import CharacterAvatar from '../common/CharacterAvatar';
import DialogueBox from '../common/DialogueBox';
import './WelfareGameModule.css';

const WelfareGameModule = ({ onGameComplete, initialBudget = 50000 }) => {
  // Game state
  const [gamePhase, setGamePhase] = useState('intro'); // 'intro' | 'dialogue' | 'end'
  const [currentNodeId, setCurrentNodeId] = useState(1);
  
  // Core meters
  const [meters, setMeters] = useState({
    autonomy: 50,
    security: 50, 
    staffWellbeing: 50
  });
  
  const [budget, setBudget] = useState(initialBudget);
  
  const handleChoice = (choice) => {
    // Apply meter effects
    if (choice.effects) {
      setMeters(prev => ({
        autonomy: Math.max(0, Math.min(100, prev.autonomy + (choice.effects.autonomy || 0))),
        security: Math.max(0, Math.min(100, prev.security + (choice.effects.security || 0))),
        staffWellbeing: Math.max(0, Math.min(100, prev.staffWellbeing + (choice.effects.staffWellbeing || 0)))
      }));
    }
    
    // Apply budget changes
    if (choice.budgetChange) {
      setBudget(prev => prev + choice.budgetChange);
    }
    
    // Move to next dialogue node
    setCurrentNodeId(choice.nextNode);
    
    // Check game end conditions
    checkGameState();
  };
  
  const checkGameState = () => {
    // Failure conditions
    if (meters.autonomy < 20 || meters.security < 20 || meters.staffWellbeing < 20) {
      endGame(false, 'Implementeringsstopp: Balansen mellan intressenternas behov förlorades.');
      return;
    }
    
    if (budget < 0) {
      endGame(false, 'Budgeten överskreds. Projektet pausas.');
      return;
    }
  };
  
  const endGame = (success, outcome) => {
    const score = calculateScore(success, meters, budget);
    
    onGameComplete({
      success,
      score,
      outcome,
      worldId: 'scenario-game-welfare'
    });
  };
  
  const calculateScore = (success, finalMeters, finalBudget) => {
    if (!success) return 0;
    
    const baseScore = 500;
    const meterAverage = (finalMeters.autonomy + finalMeters.security + finalMeters.staffWellbeing) / 3;
    const meterBonus = Math.floor(meterAverage * 10);
    const budgetBonus = Math.floor(finalBudget / 1000) * 5;
    
    return baseScore + meterBonus + budgetBonus;
  };
  
  // Character emotion calculation
  const getCharacterEmotions = () => ({
    Arne: meters.autonomy < 30 ? 'irriterad' : meters.autonomy > 70 ? 'glad' : 'neutral',
    Karin: meters.security < 40 ? 'orolig' : meters.security > 80 ? 'glad' : 'neutral',
    Lasse: meters.staffWellbeing < 30 ? 'irriterad' : meters.staffWellbeing > 60 ? 'glad' : 'neutral'
  });
  
  if (gamePhase === 'intro') {
    return (
      <div className="welfare-game">
        <IntroScreen onStart={() => setGamePhase('dialogue')} />
      </div>
    );
  }
  
  const currentNode = dialogueData[currentNodeId];
  const emotions = getCharacterEmotions();
  
  return (
    <div className="welfare-game">
      {/* HUD with meters */}
      <div className="welfare-game__hud">
        <ValueMeter label="Arnes Autonomi" value={meters.autonomy} color="var(--color-state-success)" />
        <ValueMeter label="Trygghet & Säkerhet" value={meters.security} color="var(--color-brand-primary)" />
        <ValueMeter label="Personalens Välmående" value={meters.staffWellbeing} color="var(--color-accent-warm)" />
        <div className="welfare-game__budget">Budget: {budget.toLocaleString('sv-SE')} kr</div>
      </div>
      
      {/* Character stage */}
      <div className="welfare-game__stage">
        <CharacterAvatar 
          character="Arne" 
          emotion={emotions.Arne} 
          isTalking={currentNode?.character === 'Arne'} 
        />
        <CharacterAvatar 
          character="Karin" 
          emotion={emotions.Karin} 
          isTalking={currentNode?.character === 'Karin'} 
        />
        <CharacterAvatar 
          character="Lasse" 
          emotion={emotions.Lasse} 
          isTalking={currentNode?.character === 'Lasse'} 
        />
      </div>
      
      {/* Dialogue area */}
      <div className="welfare-game__dialogue">
        <DialogueBox 
          currentNode={currentNode}
          onChoice={handleChoice}
        />
      </div>
    </div>
  );
};

export default WelfareGameModule;
```

### Key Implementation Notes
- **Use Dialogue Engine Core** från technical specs
- **Real-time meter updates** with bounds checking (0-100)
- **Character emotions** update based on meter values
- **Budget tracking** with failure conditions
- **Success calculation** based on balanced outcomes

---

## PuzzleGameModule (PixiJS Introduction)

### Requirements Summary
- **Type:** PixiJS drag-drop puzzle
- **Purpose:** Network connection puzzle with validation
- **Complexity:** High (8/10 AI success rate)
- **Dependencies:** GameCanvasWrapper, PixiJS patterns

### Props Interface
```typescript
interface PuzzleGameModuleProps {
  onGameComplete: (result: GameResult) => void;
  initialBudget?: number;
}
```

### Implementation Pattern
```javascript
import React, { useState, useRef } from 'react';
import GameCanvasWrapper from '../common/GameCanvasWrapper';
import PuzzlePixiGame from './PuzzlePixiGame';
import './PuzzleGameModule.css';

const PuzzleGameModule = ({ onGameComplete, initialBudget = 100000 }) => {
  const [gameState, setGameState] = useState({
    budget: initialBudget,
    connections: [],
    isComplete: false
  });
  
  const pixiCallbacks = useRef({
    onConnectionMade: (connection) => {
      setGameState(prev => ({
        ...prev,
        connections: [...prev.connections, connection],
        budget: prev.budget - connection.cost
      }));
    },
    
    onGameComplete: (success, finalState) => {
      const score = calculatePuzzleScore(success, finalState);
      
      onGameComplete({
        success,
        score,
        outcome: success ? 'Säker anslutning etablerad' : 'Anslutning misslyckades',
        worldId: 'puzzle-game-datasystem'
      });
    }
  });
  
  const calculatePuzzleScore = (success, finalState) => {
    if (!success) return 0;
    
    const baseScore = 1000;
    const budgetBonus = (finalState.budget / initialBudget) * 500;
    const efficiencyBonus = Math.max(0, 500 - (finalState.connections.length * 50));
    
    return Math.floor(baseScore + budgetBonus + efficiencyBonus);
  };
  
  return (
    <div className="puzzle-game">
      <div className="puzzle-game__hud">
        <div className="puzzle-game__budget">
          Budget: {gameState.budget.toLocaleString('sv-SE')} kr
        </div>
        <div className="puzzle-game__instruction">
          Dra anslutningar från källor, via Ena-hubben, till interna system
        </div>
      </div>
      
      <div className="puzzle-game__canvas">
        <GameCanvasWrapper
          gameClass={PuzzlePixiGame}
          gameState={gameState}
          callbacks={pixiCallbacks.current}
          width={800}
          height={600}
        />
      </div>
    </div>
  );
};

export default PuzzleGameModule;
```

### PixiJS Game Class Pattern
```javascript
// PuzzlePixiGame.js
import * as PIXI from 'pixi.js';

class PuzzlePixiGame {
  constructor(app, gameState, callbacks) {
    this.app = app;
    this.gameState = gameState;
    this.callbacks = callbacks;
    
    this.nodes = new Map();
    this.connections = [];
    this.dragState = null;
    
    this.setupGame();
  }
  
  setupGame() {
    // Create node positions
    const nodeData = [
      { id: 'source1', type: 'source', x: 100, y: 200, label: 'Försäkringskassan' },
      { id: 'hub', type: 'hub', x: 400, y: 300, label: 'Ena-hubben' },
      { id: 'internal1', type: 'internal', x: 700, y: 200, label: 'Intranät' }
    ];
    
    nodeData.forEach(data => this.createNode(data));
    this.setupInteractions();
  }
  
  createNode(data) {
    const container = new PIXI.Container();
    
    // Node circle
    const circle = new PIXI.Graphics();
    circle.beginFill(this.getNodeColor(data.type));
    circle.drawCircle(0, 0, 30);
    circle.endFill();
    
    // Node label
    const label = new PIXI.Text(data.label, {
      fontSize: 14,
      fill: 'white'
    });
    label.anchor.set(0.5);
    label.y = 50;
    
    container.addChild(circle, label);
    container.x = data.x;
    container.y = data.y;
    container.interactive = true;
    container.buttonMode = true;
    
    this.app.stage.addChild(container);
    this.nodes.set(data.id, { container, data });
  }
  
  getNodeColor(type) {
    const colors = {
      source: 0x4CAF50,
      hub: 0x2196F3,
      internal: 0xFF9800
    };
    return colors[type] || 0x999999;
  }
  
  setupInteractions() {
    this.nodes.forEach((node, id) => {
      node.container.on('pointerdown', () => this.startConnection(id));
      node.container.on('pointerup', () => this.endConnection(id));
    });
  }
  
  startConnection(nodeId) {
    this.dragState = { fromNode: nodeId };
  }
  
  endConnection(nodeId) {
    if (this.dragState && this.dragState.fromNode !== nodeId) {
      this.createConnection(this.dragState.fromNode, nodeId);
    }
    this.dragState = null;
  }
  
  createConnection(fromId, toId) {
    // Validate connection logic
    if (this.isValidConnection(fromId, toId)) {
      const connection = {
        from: fromId,
        to: toId,
        cost: 10000
      };
      
      this.drawConnection(fromId, toId);
      this.callbacks.onConnectionMade(connection);
      
      // Check win condition
      if (this.checkWinCondition()) {
        this.callbacks.onGameComplete(true, this.gameState);
      }
    }
  }
  
  isValidConnection(fromId, toId) {
    // Must connect through hub
    if (fromId.includes('source') && toId.includes('internal')) {
      return false; // Direct connection not allowed
    }
    return true;
  }
  
  drawConnection(fromId, toId) {
    const fromNode = this.nodes.get(fromId);
    const toNode = this.nodes.get(toId);
    
    const line = new PIXI.Graphics();
    line.lineStyle(3, 0x00FF00);
    line.moveTo(fromNode.container.x, fromNode.container.y);
    line.lineTo(toNode.container.x, toNode.container.y);
    
    this.app.stage.addChild(line);
    this.connections.push(line);
  }
  
  checkWinCondition() {
    // Check if all required connections are made
    return this.connections.length >= 2; // Simplified win condition
  }
  
  destroy() {
    this.nodes.clear();
    this.connections.forEach(line => line.destroy());
    this.connections = [];
  }
}

export default PuzzlePixiGame;
```

### Key Implementation Notes
- **Use GameCanvasWrapper** för PixiJS integration
- **Drag-drop interactions** with validation
- **Visual feedback** för valid/invalid connections
- **Win condition checking** after each connection
- **Budget management** with connection costs

---

## CompetenceGameModule (Card-Based)

### Requirements Summary
- **Type:** Pure React card management game
- **Purpose:** Staff competency building with resource allocation
- **Complexity:** Medium (7/10 AI success rate)
- **Dependencies:** Card components, drag-drop library

### Implementation Pattern
```javascript
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import './CompetenceGameModule.css';

const CompetenceGameModule = ({ onGameComplete, initialBudget = 200000 }) => {
  const [gameState, setGameState] = useState({
    budget: initialBudget,
    competences: {
      base: 20,
      broad: 15,
      specialist: 10
    },
    availableCards: generateCards(),
    playedCards: []
  });
  
  const handleCardPlay = (card) => {
    if (gameState.budget >= card.cost) {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - card.cost,
        competences: {
          base: prev.competences.base + (card.effects.base || 0),
          broad: prev.competences.broad + (card.effects.broad || 0),
          specialist: prev.competences.specialist + (card.effects.specialist || 0)
        },
        playedCards: [...prev.playedCards, card],
        availableCards: prev.availableCards.filter(c => c.id !== card.id)
      }));
      
      checkWinCondition();
    }
  };
  
  const checkWinCondition = () => {
    const total = Object.values(gameState.competences).reduce((sum, val) => sum + val, 0);
    if (total >= 100) {
      const score = calculateScore();
      onGameComplete({
        success: true,
        score,
        outcome: 'Kompetens måluppfylld',
        worldId: 'resource-game-competence'
      });
    }
  };
  
  const calculateScore = () => {
    const { base, broad, specialist } = gameState.competences;
    const baseScore = 1000;
    const competenceScore = base + broad + (specialist * 1.5);
    const budgetBonus = (gameState.budget / initialBudget) * 300;
    
    return Math.floor(baseScore + competenceScore + budgetBonus);
  };
  
  return (
    <div className="competence-game">
      <div className="competence-game__hud">
        <div className="competence-meters">
          <CompetenceMeter label="Grundkompetens" value={gameState.competences.base} />
          <CompetenceMeter label="Bredd" value={gameState.competences.broad} />
          <CompetenceMeter label="Specialist" value={gameState.competences.specialist} />
        </div>
        <div className="budget-display">
          Budget: {gameState.budget.toLocaleString('sv-SE')} kr
        </div>
      </div>
      
      <div className="competence-game__cards">
        <h3>Tillgängliga åtgärder</h3>
        <div className="card-grid">
          {gameState.availableCards.map(card => (
            <CompetenceCard 
              key={card.id}
              card={card}
              onPlay={handleCardPlay}
              canAfford={gameState.budget >= card.cost}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const generateCards = () => [
  {
    id: 'training1',
    title: 'Digital Grundutbildning',
    cost: 50000,
    effects: { base: 15, broad: 5 },
    description: 'Grundläggande digital kompetens för alla anställda'
  },
  {
    id: 'specialist1', 
    title: 'AI-specialist Rekrytering',
    cost: 80000,
    effects: { specialist: 20 },
    description: 'Anställ erfaren AI-specialist'
  }
  // ... more cards
];
```

---

## EcosystemGameModule (Strategic Building)

### Requirements Summary
- **Type:** Turn-based strategy with resource management
- **Purpose:** Build sustainable digital ecosystem
- **Complexity:** High (6/10 AI success rate)
- **Dependencies:** Strategic thinking, multi-turn planning

### Implementation Pattern
```javascript
import React, { useState } from 'react';
import EcosystemBoard from './EcosystemBoard';
import ResourcePanel from './ResourcePanel';
import './EcosystemGameModule.css';

const EcosystemGameModule = ({ onGameComplete }) => {
  const [gameState, setGameState] = useState({
    turn: 1,
    maxTurns: 10,
    resources: {
      budget: 500000,
      influence: 50,
      sustainability: 30
    },
    buildings: [],
    ecosystemScore: 0
  });
  
  const handleBuildingPlace = (building, position) => {
    if (canAffordBuilding(building)) {
      setGameState(prev => ({
        ...prev,
        resources: {
          budget: prev.resources.budget - building.cost,
          influence: prev.resources.influence + building.effects.influence,
          sustainability: prev.resources.sustainability + building.effects.sustainability
        },
        buildings: [...prev.buildings, { ...building, position }],
        ecosystemScore: calculateEcosystemScore([...prev.buildings, building])
      }));
      
      nextTurn();
    }
  };
  
  const nextTurn = () => {
    const newTurn = gameState.turn + 1;
    
    if (newTurn > gameState.maxTurns) {
      endGame();
    } else {
      setGameState(prev => ({ ...prev, turn: newTurn }));
    }
  };
  
  const endGame = () => {
    const success = gameState.ecosystemScore >= 100;
    const score = calculateFinalScore(success);
    
    onGameComplete({
      success,
      score,
      outcome: success ? 'Hållbart ekosystem skapat' : 'Ekosystem ej hållbart',
      worldId: 'strategy-game-ecosystem'
    });
  };
  
  return (
    <div className="ecosystem-game">
      <div className="ecosystem-game__hud">
        <div className="turn-counter">Tur {gameState.turn}/{gameState.maxTurns}</div>
        <ResourcePanel resources={gameState.resources} />
        <div className="ecosystem-score">Ekosystem: {gameState.ecosystemScore}/100</div>
      </div>
      
      <EcosystemBoard 
        buildings={gameState.buildings}
        onBuildingPlace={handleBuildingPlace}
      />
    </div>
  );
};
```

---

## ConnectivityGameModule (Most Complex PixiJS)

### Requirements Summary
- **Type:** Two-phase PixiJS crisis management game
- **Purpose:** Network building + real-time crisis defense
- **Complexity:** Very High (5/10 AI success rate)
- **Dependencies:** Advanced PixiJS, real-time systems, complex state

### Implementation Pattern
```javascript
import React, { useState, useRef } from 'react';
import GameCanvasWrapper from '../common/GameCanvasWrapper';
import ConnectivityPixiGame from './ConnectivityPixiGame';
import CrisisHUD from './CrisisHUD';
import BuildHUD from './BuildHUD';
import './ConnectivityGameModule.css';

const ConnectivityGameModule = ({ onGameComplete, initialBudget = 300000 }) => {
  const [gamePhase, setGamePhase] = useState('build'); // 'build' | 'crisis' | 'end'
  const [gameState, setGameState] = useState({
    budget: initialBudget,
    infrastructure: {
      nodes: generateInitialNodes(),
      connections: []
    },
    crisisState: {
      timer: 300, // 5 minutes
      communityIndex: 100,
      activeCrises: []
    }
  });
  
  const pixiCallbacks = useRef({
    onInfrastructureBuild: (item) => {
      setGameState(prev => ({
        ...prev,
        budget: prev.budget - item.cost,
        infrastructure: {
          ...prev.infrastructure,
          [item.type === 'connection' ? 'connections' : 'nodes']: [
            ...prev.infrastructure[item.type === 'connection' ? 'connections' : 'nodes'],
            item
          ]
        }
      }));
    },
    
    onCrisisEvent: (crisis) => {
      setGameState(prev => ({
        ...prev,
        crisisState: {
          ...prev.crisisState,
          activeCrises: [...prev.crisisState.activeCrises, crisis]
        }
      }));
    },
    
    onGameComplete: (success, finalIndex) => {
      const score = calculateConnectivityScore(success, finalIndex);
      
      onGameComplete({
        success,
        score,
        outcome: success ? 'Kris övervunnen' : 'Systemkollaps',
        worldId: 'crisis-game-connectivity'
      });
    }
  });
  
  const startCrisisPhase = () => {
    setGamePhase('crisis');
    // Start crisis timer and events in PixiJS
  };
  
  return (
    <div className="connectivity-game">
      {gamePhase === 'build' && (
        <BuildHUD 
          budget={gameState.budget}
          onStartCrisis={startCrisisPhase}
        />
      )}
      
      {gamePhase === 'crisis' && (
        <CrisisHUD 
          timer={gameState.crisisState.timer}
          communityIndex={gameState.crisisState.communityIndex}
          activeCrises={gameState.crisisState.activeCrises}
        />
      )}
      
      <div className="connectivity-game__canvas">
        <GameCanvasWrapper
          gameClass={ConnectivityPixiGame}
          gameState={gameState}
          gamePhase={gamePhase}
          callbacks={pixiCallbacks.current}
          width={1000}
          height={700}
        />
      </div>
    </div>
  );
};

const generateInitialNodes = () => [
  { id: 'city1', type: 'city', x: 200, y: 150, status: 'offline' },
  { id: 'hospital1', type: 'hospital', x: 400, y: 200, status: 'offline' },
  { id: 'power1', type: 'power', x: 600, y: 150, status: 'offline' }
];
```

### Key Implementation Notes
- **Two distinct game phases** with different mechanics
- **Real-time crisis management** with timer system
- **Complex state synchronization** between React and PixiJS
- **Performance-critical rendering** with many simultaneous effects
- **Highest AI challenge** - save for last in development sequence

---

## Common Patterns Across All Games

### Game Result Interface
```typescript
interface GameResult {
  success: boolean;
  score: number;
  outcome: string;
  worldId: string;
  achievements?: string[];
  metrics?: Record<string, number>;
}
```

### onGameComplete Pattern
```javascript
const handleGameComplete = (result) => {
  // Always include worldId for tracking
  const completeResult = {
    ...result,
    worldId: 'game-specific-id',
    completedAt: new Date().toISOString()
  };
  
  onGameComplete(completeResult);
};
```

### Score Calculation Pattern
```javascript
const calculateScore = (success, gameSpecificMetrics) => {
  if (!success) return 0;
  
  let score = BASE_SCORE;
  
  // Add game-specific bonuses
  score += calculateGameBonus(gameSpecificMetrics);
  
  // Add efficiency bonus
  score += calculateEfficiencyBonus(gameSpecificMetrics);
  
  return Math.floor(score);
};
```

### Error Boundary Pattern
```javascript
class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Game module error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="game-error">
          <h2>Något gick fel</h2>
          <p>Ladda om sidan för att försöka igen.</p>
          <Button onClick={() => window.location.reload()}>
            Ladda om
          </Button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

---

## Testing Strategy

### Game Module Testing Pattern
```javascript
// GameModule.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WelfareGameModule from './WelfareGameModule';

const mockOnGameComplete = jest.fn();

test('completes game with valid choices', async () => {
  render(<WelfareGameModule onGameComplete={mockOnGameComplete} />);
  
  // Start game
  fireEvent.click(screen.getByText('Starta mötet'));
  
  // Make balanced choices
  await waitFor(() => {
    const choiceButton = screen.getByText(/kompromiss/i);
    fireEvent.click(choiceButton);
  });
  
  // Continue until completion...
  
  expect(mockOnGameComplete).toHaveBeenCalledWith({
    success: true,
    score: expect.any(Number),
    outcome: expect.any(String),
    worldId: 'scenario-game-welfare'
  });
});

test('handles failure conditions correctly', async () => {
  render(<WelfareGameModule onGameComplete={mockOnGameComplete} />);
  
  // Make choices that lead to failure...
  
  expect(mockOnGameComplete).toHaveBeenCalledWith({
    success: false,
    score: 0,
    outcome: expect.stringContaining('Implementeringsstopp'),
    worldId: 'scenario-game-welfare'
  });
});
```

---

## Performance Considerations

### PixiJS Games Optimization
```javascript
// Optimization patterns for PixiJS games
class OptimizedPixiGame {
  constructor(app, gameState, callbacks) {
    this.app = app;
    this.objectPool = new Map(); // Reuse sprites
    this.updateQueue = []; // Batch updates
    
    // Performance monitoring
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
  }
  
  update(deltaTime) {
    this.frameCount++;
    
    // Monitor FPS
    if (this.frameCount % 60 === 0) {
      const now = performance.now();
      const fps = 1000 / (now - this.lastFrameTime) * 60;
      
      if (fps < 30) {
        console.warn('Performance warning: FPS dropped below 30');
        this.optimizeRendering();
      }
      
      this.lastFrameTime = now;
    }
    
    // Process update queue
    this.processUpdateQueue();
  }
  
  optimizeRendering() {
    // Reduce visual effects
    // Pool unused objects
    // Simplify animations
  }
}
```

---

## Success Checklist

### All Game Modules Complete
- [ ] WelfareGameModule: Dialogue system working with meter updates
- [ ] PuzzleGameModule: PixiJS drag-drop with validation
- [ ] CompetenceGameModule: Card-based resource management
- [ ] EcosystemGameModule: Strategic building mechanics
- [ ] ConnectivityGameModule: Two-phase crisis management
- [ ] All games return proper GameResult format
- [ ] Error boundaries implemented for each game
- [ ] Performance targets met (60fps for PixiJS games)
- [ ] Testing coverage for core game mechanics
- [ ] Integration with main game state works

**Next Step:** Proceed to Component Development Sequence for build order optimization