# Dialogue Engine Core - WelfareGameModule

**Version:** 1.0  
**Purpose:** Core implementation for WelfareGame dialogue system  
**Focus:** Copy-paste ready code for AI implementation

---

## React Component Structure

### Main Dialogue Component

```javascript
import React, { useState, useEffect } from 'react';
import './WelfareGameModule.css';

const DialogueEngine = ({ 
  dialogueData, 
  initialMeters,
  initialBudget,
  onMeterChange,
  onBudgetChange,
  onDialogueComplete 
}) => {
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const currentNode = dialogueData[currentNodeId];
  
  const handleChoice = (choice) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Apply effects
    if (choice.effects) {
      onMeterChange(choice.effects);
    }
    if (choice.budgetChange) {
      onBudgetChange(choice.budgetChange);
    }
    
    // Move to next node
    setTimeout(() => {
      setCurrentNodeId(choice.nextNode);
      setIsAnimating(false);
      
      // Check if dialogue complete
      if (!dialogueData[choice.nextNode]) {
        onDialogueComplete(choice.outcome);
      }
    }, 500);
  };
  
  return (
    <div className="dialogue-engine">
      <div className="dialogue-speaker">
        {currentNode.character.toUpperCase()} SÄGER:
      </div>
      <div className="dialogue-text">
        {currentNode.text}
      </div>
      {currentNode.choices && (
        <div className="dialogue-choices">
          {currentNode.choices.map((choice, index) => (
            <button
              key={index}
              className="dialogue-choice-button"
              onClick={() => handleChoice(choice)}
              disabled={isAnimating}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

### Character Avatar Component

```javascript
const CharacterAvatar = ({ character, emotion, isTalking }) => {
  const emotionClass = `emotion-${emotion}`;
  const talkingClass = isTalking ? 'is-talking' : '';
  
  return (
    <div className={`character-avatar ${emotionClass} ${talkingClass}`}>
      <span className="character-icon material-symbols-outlined">
        account_circle
      </span>
      <p className="character-name">{character}</p>
    </div>
  );
};
```

### Value Meter Component

```javascript
const ValueMeter = ({ label, value, color, icon }) => {
  return (
    <div className="value-meter">
      <span className="meter-label">{label}</span>
      <div className="meter-container">
        <div 
          className="meter-fill"
          style={{ 
            width: `${value}%`,
            backgroundColor: color,
            transition: 'width 0.5s ease-out'
          }}
        />
      </div>
      <span className="meter-value">{value}%</span>
    </div>
  );
};
```

---

## JSON Schema for Dialogue Data

### Complete Dialogue Structure

```javascript
const dialogueData = {
  "1": {
    "character": "Karin",
    "text": "Jag har läst på. Jag vill att vi aktiverar allt. Falldetektion, GPS-spårning om han går ut, och larm om han inte rört sig i vardagsrummet på en timme. Säkerheten måste gå först.",
    "emotion": "orolig",
    "choices": null,
    "nextNode": 2
  },
  "2": {
    "character": "Arne",
    "text": "GPS-spårning?! Ska ni ha en elektronisk fotboja på mig? Jag är ingen fånge! Jag vill bara ha en knapp att trycka på om jag ramlar. Inget annat.",
    "emotion": "irriterad",
    "choices": null,
    "nextNode": 3
  },
  "3": {
    "character": "Spelaren",
    "text": "",
    "emotion": "neutral",
    "choices": [
      {
        "text": "Karin, jag förstår din oro. Låt oss börja med de viktigaste säkerhetsfunktionerna.",
        "effects": { "autonomy": -10, "security": 15, "staffWellbeing": 0 },
        "nextNode": 4,
        "outcome": null
      },
      {
        "text": "Arne, din självständighet är viktigast. Vi utgår från dina önskemål och ser vad vi kan lägga till.",
        "effects": { "autonomy": 15, "security": -10, "staffWellbeing": 0 },
        "nextNode": 5,
        "outcome": null
      },
      {
        "text": "Låt oss titta på funktionerna en och en och se om vi kan hitta en kompromiss som känns bra för er båda.",
        "effects": { "autonomy": 0, "security": 0, "staffWellbeing": 5 },
        "nextNode": 6,
        "outcome": null
      }
    ]
  },
  // Continue pattern for all dialogue nodes...
  "final_consensus": {
    "character": "Narrator",
    "text": "Efter en lång diskussion har ni kommit fram till en lösning som alla kan acceptera. Arne får behålla sin självständighet, Karin känner sig trygg, och Lasse ser fram emot ett system som faktiskt underlättar hans arbete.",
    "emotion": "neutral",
    "choices": [{
      "text": "Avsluta mötet",
      "effects": null,
      "nextNode": null,
      "outcome": "consensus"
    }]
  }
};
```

### Node Type Definition

```typescript
interface DialogueNode {
  character: "Arne" | "Karin" | "Lasse" | "Spelaren" | "Narrator";
  text: string;
  emotion: "neutral" | "orolig" | "irriterad" | "glad";
  choices: Choice[] | null;
  nextNode?: number | string;
}

interface Choice {
  text: string;
  effects: {
    autonomy: number;      // -20 to +20
    security: number;      // -20 to +20
    staffWellbeing: number; // -20 to +20
  };
  budgetChange?: number;   // Optional budget cost
  nextNode: number | string;
  outcome: "consensus" | "compromise" | "failure" | null;
}
```

---

## Effect Calculation Logic

### Meter Update Function

```javascript
const applyMeterEffects = (currentMeters, effects) => {
  const newMeters = { ...currentMeters };
  
  // Apply effects with bounds checking
  Object.keys(effects).forEach(key => {
    if (newMeters[key] !== undefined) {
      newMeters[key] = Math.max(0, Math.min(100, 
        newMeters[key] + effects[key]
      ));
    }
  });
  
  return newMeters;
};
```

### Game State Checker

```javascript
const checkGameState = (meters, budget) => {
  // Check for failure conditions
  if (meters.autonomy < 20 || meters.security < 20 || meters.staffWellbeing < 20) {
    return {
      gameOver: true,
      success: false,
      reason: "critical_meter",
      message: "Implementeringsstopp: Balansen mellan intressenternas behov förlorades."
    };
  }
  
  if (budget < 0) {
    return {
      gameOver: true,
      success: false,
      reason: "budget_exceeded",
      message: "Budgeten överskreds. Projektet pausas."
    };
  }
  
  // Check for win conditions (handled by dialogue outcomes)
  return { gameOver: false };
};
```

### Score Calculation

```javascript
const calculateScore = (meters, budget, outcome) => {
  let baseScore = 0;
  
  // Base score from outcome
  switch(outcome) {
    case "consensus":
      baseScore = 1000;
      break;
    case "compromise":
      baseScore = 600;
      break;
    default:
      baseScore = 0;
  }
  
  // Bonus for high meters
  const meterBonus = Object.values(meters).reduce((sum, value) => {
    if (value >= 70) return sum + 100;
    if (value >= 50) return sum + 50;
    return sum;
  }, 0);
  
  // Budget efficiency bonus
  const budgetBonus = budget > 0 ? Math.floor(budget / 100) * 10 : 0;
  
  return baseScore + meterBonus + budgetBonus;
};
```

---

## Character State Management

### Character Emotion Mapping

```javascript
const getCharacterEmotion = (character, meters, lastChoice) => {
  switch(character) {
    case "Arne":
      if (meters.autonomy < 30) return "irriterad";
      if (meters.autonomy > 70) return "glad";
      return "neutral";
      
    case "Karin":
      if (meters.security < 40) return "orolig";
      if (meters.security > 80) return "glad";
      return "neutral";
      
    case "Lasse":
      if (meters.staffWellbeing < 30) return "irriterad";
      if (meters.staffWellbeing > 60) return "glad";
      return "neutral";
      
    default:
      return "neutral";
  }
};
```

### Dynamic Response System

```javascript
const getDynamicResponse = (character, currentMeters) => {
  const responses = {
    Arne: {
      low_autonomy: "Jag känner mig som en fånge i mitt eget hem!",
      high_autonomy: "Det här låter faktiskt vettigt. Jag kan fortfarande vara mig själv.",
      neutral: "Jag lyssnar, men jag vill inte ha för mycket övervakning."
    },
    Karin: {
      low_security: "Men tänk om något händer och ingen märker det?!",
      high_security: "Jag känner mig mycket lugnare nu när vi har dessa säkerhetsfunktioner.",
      neutral: "Jag vill bara att pappa ska vara trygg."
    },
    Lasse: {
      low_staff: "Det här kommer bara skapa mer jobb för oss!",
      high_staff: "Om systemet fungerar så här kan det faktiskt underlätta vårt arbete.",
      neutral: "Vi får se hur det fungerar i praktiken."
    }
  };
  
  // Select appropriate response based on meter values
  if (character === "Arne") {
    if (currentMeters.autonomy < 30) return responses.Arne.low_autonomy;
    if (currentMeters.autonomy > 70) return responses.Arne.high_autonomy;
  }
  // Continue for other characters...
  
  return responses[character]?.neutral || "";
};
```

---

## CSS Structure

```css
.dialogue-engine {
  padding: var(--space-xl);
  background: var(--color-surface);
  border-radius: var(--radius-l);
  box-shadow: var(--shadow-m);
}

.dialogue-speaker {
  font-family: var(--font-family-base);
  font-size: var(--font-size-s);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-s);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dialogue-text {
  font-family: var(--font-family-base);
  font-size: var(--font-size-l);
  line-height: 1.6;
  color: var(--color-text-primary);
  margin-bottom: var(--space-xl);
}

.dialogue-choices {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.dialogue-choice-button {
  width: 100%;
  padding: var(--space-m) var(--space-l);
  background: var(--color-brand-primary);
  color: white;
  border: none;
  border-radius: var(--radius-m);
  font-size: var(--font-size-m);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dialogue-choice-button:hover:not(:disabled) {
  background: var(--color-brand-primary-dark);
  transform: translateY(-2px);
}

.dialogue-choice-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Character avatars */
.character-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-s);
  transition: all 0.3s ease;
}

.character-icon {
  font-size: 96px;
  padding: var(--space-m);
  border-radius: 50%;
  background: var(--color-brand-secondary);
  transition: all 0.3s ease;
}

.character-avatar.emotion-orolig .character-icon {
  background: rgba(237, 108, 2, 0.2);
}

.character-avatar.emotion-irriterad .character-icon {
  background: rgba(198, 40, 40, 0.2);
}

.character-avatar.is-talking {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(46, 125, 50, 0); }
}

/* Value meters */
.value-meter {
  display: flex;
  align-items: center;
  gap: var(--space-m);
}

.meter-container {
  flex: 1;
  height: 24px;
  background: var(--color-surface-dark);
  border-radius: var(--radius-s);
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: width 0.5s ease-out;
}
```