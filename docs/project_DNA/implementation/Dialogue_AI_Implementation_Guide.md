# Dialogue AI Implementation Guide

**Version:** 1.0  
**Purpose:** Step-by-step workflow for AI implementing WelfareGame dialogue  
**Focus:** Zero ambiguity, copy-paste ready patterns

---

## Implementation Workflow

### Step 1: Create Base Files

```bash
# Create the required files
src/components/games/WelfareGameModule.jsx
src/components/games/WelfareGameModule.css
src/components/games/dialogueData.js
```

### Step 2: Implement Dialogue Data

Create `dialogueData.js` with this exact structure:

```javascript
export const dialogueData = {
  // Opening sequence
  "1": {
    "character": "Narrator",
    "text": "Mötet börjar. Alla har samlats för att diskutera det nya trygghetslarmet.",
    "emotion": "neutral",
    "choices": null,
    "nextNode": 2
  },
  "2": {
    "character": "Karin",
    "text": "Jag har läst på. Jag vill att vi aktiverar allt. Falldetektion, GPS-spårning om han går ut, och larm om han inte rört sig i vardagsrummet på en timme. Säkerheten måste gå först.",
    "emotion": "orolig",
    "choices": null,
    "nextNode": 3
  },
  "3": {
    "character": "Arne", 
    "text": "GPS-spårning?! Ska ni ha en elektronisk fotboja på mig? Jag är ingen fånge! Jag vill bara ha en knapp att trycka på om jag ramlar. Inget annat.",
    "emotion": "irriterad",
    "choices": null,
    "nextNode": 4
  },
  "4": {
    "character": "Spelaren",
    "text": "",
    "emotion": "neutral",
    "choices": [
      {
        "text": "Karin, jag förstår din oro. Låt oss börja med de viktigaste säkerhetsfunktionerna.",
        "effects": { "autonomy": -10, "security": 15, "staffWellbeing": 0 },
        "nextNode": "security_path_1"
      },
      {
        "text": "Arne, din självständighet är viktigast. Vi utgår från dina önskemål och ser vad vi kan lägga till.",
        "effects": { "autonomy": 15, "security": -10, "staffWellbeing": 0 },
        "nextNode": "autonomy_path_1"
      },
      {
        "text": "Låt oss titta på funktionerna en och en och se om vi kan hitta en kompromiss som känns bra för er båda.",
        "effects": { "autonomy": 0, "security": 0, "staffWellbeing": 5 },
        "nextNode": "balanced_path_1"
      }
    ]
  },
  
  // Add all dialogue paths...
  // Each path should have 5-7 nodes before reaching an outcome
  
  // Example end node
  "consensus_end": {
    "character": "Narrator",
    "text": "Efter en konstruktiv diskussion har ni kommit överens om en lösning som balanserar allas behov.",
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

### Step 3: Implement Sub-Components

Create these helper components FIRST:

```javascript
// ValueMeter.jsx
const ValueMeter = ({ label, value, color }) => {
  return (
    <div className="value-meter">
      <span className="meter-label">{label}</span>
      <div className="meter-container">
        <div 
          className="meter-fill"
          style={{ 
            width: `${value}%`,
            backgroundColor: color
          }}
        />
      </div>
      <span className="meter-value">{value}%</span>
    </div>
  );
};

// CharacterAvatar.jsx  
const CharacterAvatar = ({ character, emotion, isTalking }) => {
  return (
    <div className={`character-avatar emotion-${emotion} ${isTalking ? 'is-talking' : ''}`}>
      <span className="material-symbols-outlined character-icon">
        account_circle
      </span>
      <p className="character-name">{character}</p>
    </div>
  );
};
```

### Step 4: Build Main Component

Use this EXACT structure for WelfareGameModule:

```javascript
import React, { useState } from 'react';
import { dialogueData } from './dialogueData';
import './WelfareGameModule.css';

const WelfareGameModule = ({ onGameComplete, initialBudget = 50000 }) => {
  // Initialize ALL state at once
  const [gamePhase, setGamePhase] = useState('intro');
  const [currentNodeId, setCurrentNodeId] = useState(1);
  const [meters, setMeters] = useState({
    autonomy: 50,
    security: 50,
    staffWellbeing: 50
  });
  const [budget, setBudget] = useState(initialBudget);
  
  // CRITICAL: Always check bounds when updating meters
  const updateMeters = (effects) => {
    setMeters(prev => ({
      autonomy: Math.max(0, Math.min(100, prev.autonomy + (effects.autonomy || 0))),
      security: Math.max(0, Math.min(100, prev.security + (effects.security || 0))),
      staffWellbeing: Math.max(0, Math.min(100, prev.staffWellbeing + (effects.staffWellbeing || 0)))
    }));
  };
  
  // Continue with implementation...
};
```

---

## Common Pitfalls & Solutions

### Pitfall 1: State Updates Not Reflecting

```javascript
// ❌ WRONG - Direct state mutation
meters.autonomy += effects.autonomy;

// ✅ CORRECT - Immutable update
setMeters(prev => ({
  ...prev,
  autonomy: prev.autonomy + effects.autonomy
}));
```

### Pitfall 2: Missing Null Checks

```javascript
// ❌ WRONG - Will crash if node doesn't exist
const text = dialogueData[nodeId].text;

// ✅ CORRECT - Safe access
const currentNode = dialogueData[nodeId];
const text = currentNode?.text || '';
```

### Pitfall 3: Infinite Loops in Effects

```javascript
// ❌ WRONG - Updates in render
if (meters.autonomy < 20) {
  endGame(); // This will cause infinite loop
}

// ✅ CORRECT - Updates in useEffect
useEffect(() => {
  if (meters.autonomy < 20) {
    endGame();
  }
}, [meters.autonomy]);
```

### Pitfall 4: Forgetting Animation States

```javascript
// ✅ CORRECT - Prevent multiple clicks during animation
const [isAnimating, setIsAnimating] = useState(false);

const handleChoice = (choice) => {
  if (isAnimating) return; // Prevent double-clicks
  
  setIsAnimating(true);
  // ... handle choice
  setTimeout(() => setIsAnimating(false), 500);
};
```

---

## Testing Validation

### Manual Test Checklist

```markdown
## Pre-Implementation Tests
- [ ] All imports resolve correctly
- [ ] CSS variables are defined
- [ ] dialogueData.js has valid JSON structure

## Gameplay Tests  
- [ ] Intro screen displays and "Start" button works
- [ ] All 3 character avatars render
- [ ] Meters display and update smoothly
- [ ] Dialogue choices appear and are clickable
- [ ] Character emotions change based on meter values
- [ ] Game ends when any meter < 20
- [ ] Game ends when budget < 0
- [ ] Consensus/compromise endings trigger correctly

## Edge Case Tests
- [ ] Rapid clicking doesn't break state
- [ ] Meters stay within 0-100 bounds
- [ ] Missing dialogue nodes don't crash
- [ ] onGameComplete is called exactly once
```

### Automated Test Pattern

```javascript
// WelfareGameModule.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import WelfareGameModule from './WelfareGameModule';

test('game completes successfully with consensus', async () => {
  const onComplete = jest.fn();
  const { getByText } = render(
    <WelfareGameModule onGameComplete={onComplete} />
  );
  
  // Start game
  fireEvent.click(getByText('Starta mötet'));
  
  // Make balanced choices
  await waitFor(() => {
    fireEvent.click(getByText(/kompromiss/i));
  });
  
  // Continue making balanced choices...
  
  // Verify completion
  expect(onComplete).toHaveBeenCalledWith({
    success: true,
    score: expect.any(Number),
    outcome: expect.stringContaining('Konsensus')
  });
});
```

---

## Final Implementation Checklist

```markdown
## File Structure
- [ ] WelfareGameModule.jsx created
- [ ] WelfareGameModule.css created  
- [ ] dialogueData.js created with full dialogue tree

## Core Functionality
- [ ] Three game phases work (intro → dialogue → end)
- [ ] Meters update correctly with bounds checking
- [ ] Character emotions reflect meter values
- [ ] Dialogue progression works smoothly
- [ ] Win/lose conditions trigger appropriately

## Integration
- [ ] onGameComplete called with correct data
- [ ] initialBudget prop works if provided
- [ ] No console errors during gameplay
- [ ] Mobile responsive (test at 375px width)

## Polish
- [ ] Animations are smooth (60fps)
- [ ] No UI flashing or jank
- [ ] All text is readable
- [ ] Buttons have hover states
```

## Copy-Paste Import Block

```javascript
// Add to top of WelfareGameModule.jsx
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { dialogueData } from './dialogueData';
import './WelfareGameModule.css';
```