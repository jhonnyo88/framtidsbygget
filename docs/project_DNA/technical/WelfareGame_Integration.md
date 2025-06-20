# WelfareGame Integration

**Version:** 1.0  
**Purpose:** Exact integration specifications for WelfareGameModule  
**Focus:** State synchronization and game flow control

---

## Complete WelfareGameModule Implementation

```javascript
import React, { useState, useEffect } from 'react';
import DialogueEngine from './DialogueEngine';
import CharacterAvatar from './CharacterAvatar';
import ValueMeter from './ValueMeter';
import Card from '../common/Card';
import Button from '../common/Button';
import { dialogueData } from './dialogueData';
import './WelfareGameModule.css';

const WelfareGameModule = ({ onGameComplete, initialBudget = 50000 }) => {
  // Game state
  const [gamePhase, setGamePhase] = useState('intro'); // 'intro' | 'dialogue' | 'end'
  const [currentNodeId, setCurrentNodeId] = useState(1);
  
  // Meters
  const [meters, setMeters] = useState({
    autonomy: 50,
    security: 50,
    staffWellbeing: 50
  });
  
  // Budget
  const [budget, setBudget] = useState(initialBudget);
  
  // Game result
  const [gameResult, setGameResult] = useState(null);
  
  // Start game
  const handleStartGame = () => {
    setGamePhase('dialogue');
  };
  
  // Handle meter changes from dialogue
  const handleMeterChange = (effects) => {
    setMeters(prev => {
      const newMeters = {
        autonomy: Math.max(0, Math.min(100, prev.autonomy + (effects.autonomy || 0))),
        security: Math.max(0, Math.min(100, prev.security + (effects.security || 0))),
        staffWellbeing: Math.max(0, Math.min(100, prev.staffWellbeing + (effects.staffWellbeing || 0)))
      };
      
      // Check game state after meter change
      checkGameState(newMeters, budget);
      
      return newMeters;
    });
  };
  
  // Handle budget changes
  const handleBudgetChange = (change) => {
    setBudget(prev => {
      const newBudget = prev + change;
      
      // Check game state after budget change
      checkGameState(meters, newBudget);
      
      return newBudget;
    });
  };
  
  // Check win/lose conditions
  const checkGameState = (currentMeters, currentBudget) => {
    // Check failure conditions
    if (currentMeters.autonomy < 20 || 
        currentMeters.security < 20 || 
        currentMeters.staffWellbeing < 20) {
      endGame(false, 'meter_critical', 'Implementeringsstopp: Balansen mellan intressenternas behov förlorades.');
      return;
    }
    
    if (currentBudget < 0) {
      endGame(false, 'budget_exceeded', 'Budgeten överskreds. Projektet pausas.');
      return;
    }
  };
  
  // Handle dialogue completion
  const handleDialogueComplete = (outcome) => {
    switch(outcome) {
      case 'consensus':
        endGame(true, 'consensus', 'Konsensus uppnådd! Alla parter är nöjda med lösningen.');
        break;
      case 'compromise':
        endGame(true, 'compromise', 'Kompromiss uppnådd. Lösningen fungerar, men är inte optimal.');
        break;
      default:
        endGame(false, 'no_agreement', 'Mötet avslutades utan överenskommelse.');
    }
  };
  
  // End game
  const endGame = (success, outcome, message) => {
    const score = calculateScore(meters, budget, outcome);
    
    setGameResult({
      success,
      outcome,
      message,
      score
    });
    
    setGamePhase('end');
    
    // Report to parent
    onGameComplete({
      success,
      score,
      budgetChange: budget - initialBudget,
      outcome: message
    });
  };
  
  // Calculate score
  const calculateScore = (finalMeters, finalBudget, outcome) => {
    let score = 0;
    
    // Base score from outcome
    if (outcome === 'consensus') score += 1000;
    else if (outcome === 'compromise') score += 600;
    
    // Meter bonuses
    Object.values(finalMeters).forEach(value => {
      if (value >= 70) score += 100;
      else if (value >= 50) score += 50;
    });
    
    // Budget efficiency
    if (finalBudget > 0) {
      score += Math.floor(finalBudget / 1000) * 10;
    }
    
    return score;
  };
  
  // Get current character emotions
  const getCharacterEmotions = () => {
    return {
      Arne: meters.autonomy < 30 ? 'irriterad' : meters.autonomy > 70 ? 'glad' : 'neutral',
      Karin: meters.security < 40 ? 'orolig' : meters.security > 80 ? 'glad' : 'neutral',
      Lasse: meters.staffWellbeing < 30 ? 'irriterad' : meters.staffWellbeing > 60 ? 'glad' : 'neutral'
    };
  };
  
  // Render based on game phase
  if (gamePhase === 'intro') {
    return (
      <div className="welfare-game">
        <Card className="intro-card">
          <h1>Dilemmat med det smarta trygghetslarmet</h1>
          <p className="intro-text">
            Du är inkallad som digital strateg för att leda ett möte mellan 
            omsorgstagaren Arne, hans oroliga dotter Karin, och den stressade 
            hemtjänstpersonalen Lasse. Ditt uppdrag: Hitta en konfiguration av 
            det nya trygghetslarmet som alla kan acceptera. Dina val påverkar 
            balansen mellan deras behov.
          </p>
          <Button variant="primary" onClick={handleStartGame}>
            Starta mötet
          </Button>
        </Card>
      </div>
    );
  }
  
  if (gamePhase === 'end') {
    return (
      <div className="welfare-game">
        <Card className="result-card">
          <h1>{gameResult.success ? 'Mötet avslutat' : 'Mötet avbrutet'}</h1>
          <p className="result-message">{gameResult.message}</p>
          <div className="result-stats">
            <p>Slutpoäng: {gameResult.score}</p>
            <p>Autonomi: {meters.autonomy}%</p>
            <p>Säkerhet: {meters.security}%</p>
            <p>Personal: {meters.staffWellbeing}%</p>
            <p>Budget: {budget} kr</p>
          </div>
        </Card>
      </div>
    );
  }
  
  // Main game view
  const currentNode = dialogueData[currentNodeId];
  const emotions = getCharacterEmotions();
  const currentSpeaker = currentNode?.character;
  
  return (
    <div className="welfare-game">
      {/* HUD Section */}
      <div className="game-hud">
        <ValueMeter 
          label="Arnes Autonomi"
          value={meters.autonomy}
          color="var(--color-state-success)"
          icon="person"
        />
        <ValueMeter 
          label="Trygghet & Säkerhet"
          value={meters.security}
          color="var(--color-brand-primary)"
          icon="shield"
        />
        <ValueMeter 
          label="Personalens Välmående"
          value={meters.staffWellbeing}
          color="var(--color-accent-warm)"
          icon="groups"
        />
        <div className="budget-display">
          Budget: {budget.toLocaleString('sv-SE')} kr
        </div>
      </div>
      
      {/* Stage Section */}
      <div className="game-stage">
        <CharacterAvatar 
          character="Arne"
          emotion={emotions.Arne}
          isTalking={currentSpeaker === 'Arne'}
        />
        <CharacterAvatar 
          character="Karin"
          emotion={emotions.Karin}
          isTalking={currentSpeaker === 'Karin'}
        />
        <CharacterAvatar 
          character="Lasse"
          emotion={emotions.Lasse}
          isTalking={currentSpeaker === 'Lasse'}
        />
      </div>
      
      {/* Dialogue Section */}
      <div className="game-dialogue">
        <DialogueEngine
          dialogueData={dialogueData}
          currentNodeId={currentNodeId}
          onNodeChange={setCurrentNodeId}
          onMeterChange={handleMeterChange}
          onBudgetChange={handleBudgetChange}
          onDialogueComplete={handleDialogueComplete}
        />
      </div>
    </div>
  );
};

export default WelfareGameModule;
```

---

## State Synchronization Pattern

### Dialogue to Game State Flow

```javascript
// 1. Dialogue choice triggers effect
const dialogueChoice = {
  text: "Activate fall detection",
  effects: { autonomy: -10, security: +15 },
  budgetChange: -5000
};

// 2. DialogueEngine calls parent handlers
onMeterChange(choice.effects);
onBudgetChange(choice.budgetChange);

// 3. WelfareGameModule updates state
setMeters(prev => applyEffects(prev, effects));
setBudget(prev => prev + budgetChange);

// 4. State changes trigger re-render
// - Meters animate to new values
// - Character emotions update
// - Budget display updates

// 5. Check game conditions
checkGameState(newMeters, newBudget);
```

### Props Interface

```typescript
interface WelfareGameModuleProps {
  onGameComplete: (result: GameResult) => void;
  initialBudget?: number;
}

interface GameResult {
  success: boolean;
  score: number;
  budgetChange: number;
  outcome: string;
}
```

---

## Win/Lose Condition Logic

### Condition Checking Flow

```javascript
const gameConditionChecker = {
  // Called after every state change
  check: (meters, budget, dialogueOutcome) => {
    // Priority 1: Check critical failures
    if (isCriticalFailure(meters, budget)) {
      return { end: true, ...getCriticalFailureResult() };
    }
    
    // Priority 2: Check dialogue outcome
    if (dialogueOutcome) {
      return { end: true, ...getDialogueOutcomeResult(dialogueOutcome) };
    }
    
    // Priority 3: Continue game
    return { end: false };
  },
  
  isCriticalFailure: (meters, budget) => {
    return meters.autonomy < 20 || 
           meters.security < 20 || 
           meters.staffWellbeing < 20 ||
           budget < 0;
  }
};
```

### Outcome Definitions

```javascript
const GAME_OUTCOMES = {
  // Success outcomes
  CONSENSUS: {
    success: true,
    baseScore: 1000,
    message: "Konsensus uppnådd! Alla parter är nöjda med lösningen.",
    achievement: "Dialogledaren"
  },
  COMPROMISE: {
    success: true,
    baseScore: 600,
    message: "Kompromiss uppnådd. Lösningen fungerar, men är inte optimal.",
    achievement: null
  },
  
  // Failure outcomes
  METER_CRITICAL: {
    success: false,
    baseScore: 0,
    message: "Implementeringsstopp: Balansen mellan intressenternas behov förlorades.",
    achievement: null
  },
  BUDGET_EXCEEDED: {
    success: false,
    baseScore: 0,
    message: "Budgeten överskreds. Projektet pausas.",
    achievement: null
  }
};
```

---

## Complete CSS Implementation

```css
.welfare-game {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  padding: var(--space-l);
  gap: var(--space-l);
}

/* HUD Section */
.game-hud {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-m);
  background: var(--color-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-s);
}

.budget-display {
  margin-left: auto;
  font-size: var(--font-size-l);
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
}

/* Stage Section */
.game-stage {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-xxl);
  padding: var(--space-xl) 0;
  min-height: 200px;
}

/* Dialogue Section */
.game-dialogue {
  flex: 1;
  display: flex;
  align-items: flex-end;
}

/* Intro/Result Cards */
.intro-card,
.result-card {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: var(--space-xxl);
}

.intro-text {
  font-size: var(--font-size-l);
  line-height: 1.6;
  margin: var(--space-xl) 0;
  color: var(--color-text-secondary);
}

.result-message {
  font-size: var(--font-size-xl);
  margin: var(--space-l) 0;
  font-weight: 500;
}

.result-stats {
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-m);
  text-align: left;
}

.result-stats p {
  margin: 0;
  font-size: var(--font-size-m);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .game-hud {
    flex-wrap: wrap;
  }
  
  .game-stage {
    gap: var(--space-l);
  }
  
  .character-icon {
    font-size: 64px;
  }
}
```