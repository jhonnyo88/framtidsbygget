# WelfareGame Package

**Package ID:** G1  
**Game Module:** Welfare System Dialogue Game  
**Status:** Complete  
**Token Count:** ~28,000 tokens

---

## Package Contents

### Game Architecture
- `/architecture/WelfareGame_Design.md` - Complete game design document
- `/architecture/Dialogue_System.md` - Dialogue tree architecture
- `/architecture/NPC_System.md` - Character system design
- `/architecture/Scoring_Logic.md` - Point calculation and outcomes

### Implementation
- `/components/WelfareGameModule/` - Main game component
- `/components/DialogueInterface/` - Dialogue UI system
- `/components/NPCDisplay/` - Character display components
- `/components/OutcomeDisplay/` - Results visualization

### Game Data
- `/data/dialogues/` - Dialogue trees and conversations
- `/data/npcs/` - NPC definitions and personalities
- `/data/scenarios/` - Game scenarios and missions
- `/data/outcomes/` - Outcome calculations

### State Management
- `/state/welfareGameSlice.js` - Redux slice for game state
- `/state/dialogueSelectors.js` - Dialogue state selectors
- `/state/welfareActions.js` - Game-specific actions

---

## Quick Start

```jsx
import { WelfareGameModule } from '@/games/welfare';
import { useWelfareGame } from '@/games/welfare/hooks';

function WelfareGameScreen() {
  const { 
    currentScenario,
    currentNPC,
    dialogueOptions,
    selectOption,
    gameProgress
  } = useWelfareGame();
  
  return (
    <WelfareGameModule
      scenario={currentScenario}
      npc={currentNPC}
      options={dialogueOptions}
      onOptionSelect={selectOption}
      progress={gameProgress}
    />
  );
}
```

---

## Game Overview

### Core Concept
Players explore the Swedish welfare system through meaningful dialogues with diverse NPCs, making decisions that affect individual lives and society.

### Learning Objectives
- Understand welfare system complexity
- Explore different perspectives
- Make ethical decisions
- See consequences of policies

### Game Flow
1. **Scenario Selection** - Choose a welfare challenge
2. **Meet NPCs** - Interact with affected individuals
3. **Dialogue Choices** - Make thoughtful decisions
4. **See Outcomes** - Understand consequences
5. **Reflection** - Review choices and learn

---

## Dialogue System

### Tree Structure
```javascript
const dialogueTree = {
  id: "welfare_housing_01",
  npc: "anna_socialworker",
  initialNode: "greeting",
  nodes: {
    greeting: {
      text: "Hej! Jag är Anna, socialarbetare. Vi har en familj som riskerar vräkning...",
      emotion: "concerned",
      choices: [
        {
          text: "Berätta mer om situationen",
          next: "explain_situation",
          points: { empathy: 10 }
        },
        {
          text: "Vad kan kommunen göra?",
          next: "municipal_options",
          points: { practical: 10 }
        }
      ]
    },
    explain_situation: {
      text: "Familjen har fyra barn och föräldrarna förlorade jobbet under pandemin...",
      emotion: "sad",
      choices: [
        {
          text: "Vi måste prioritera barnens behov",
          next: "children_first",
          points: { empathy: 20, policy: -10 }
        },
        {
          text: "Finns det stöd för arbetslösa?",
          next: "unemployment_support",
          points: { practical: 15 }
        }
      ]
    }
  }
};
```

### Dynamic Responses
NPCs respond based on:
- Player's previous choices
- Current relationship score
- Scenario context
- Character personality

---

## NPC System

### Character Types
```javascript
const npcTypes = {
  SOCIAL_WORKER: {
    perspectives: ['empathy', 'policy', 'resources'],
    concerns: ['individual_welfare', 'system_efficiency']
  },
  CITIZEN: {
    perspectives: ['personal_need', 'fairness', 'dignity'],
    concerns: ['immediate_help', 'long_term_stability']
  },
  POLITICIAN: {
    perspectives: ['budget', 'public_opinion', 'ideology'],
    concerns: ['cost_efficiency', 'voter_satisfaction']
  },
  HEALTHCARE_WORKER: {
    perspectives: ['patient_care', 'workload', 'resources'],
    concerns: ['quality_of_care', 'staff_wellbeing']
  }
};
```

### Example NPCs
```javascript
const npcs = {
  anna_socialworker: {
    name: "Anna Andersson",
    role: "Socialarbetare",
    age: 35,
    personality: {
      empathy: 0.9,
      pragmatism: 0.6,
      idealism: 0.7
    },
    background: "10 års erfarenhet inom socialtjänsten",
    avatar: "anna_portrait.png"
  },
  erik_pensioner: {
    name: "Erik Lindqvist", 
    role: "Pensionär",
    age: 78,
    personality: {
      dignity: 0.9,
      independence: 0.8,
      trust_in_system: 0.5
    },
    background: "Arbetade som snickare i 45 år",
    avatar: "erik_portrait.png"
  }
};
```

---

## Scenarios

### Housing Crisis
**Theme**: Affordable housing and homelessness
**NPCs**: Social worker, homeless family, housing official
**Decisions**: Emergency housing, long-term solutions, resource allocation

### Healthcare Access
**Theme**: Equal access to healthcare
**NPCs**: Doctor, patient, hospital administrator  
**Decisions**: Prioritization, resource distribution, wait times

### Elder Care
**Theme**: Dignity in aging
**NPCs**: Elder, care worker, family member
**Decisions**: Home care vs facilities, quality vs cost

### Education Equality
**Theme**: Equal opportunities for all children
**NPCs**: Teacher, parent, school principal
**Decisions**: Resource allocation, support systems

---

## Scoring System

### Point Categories
```javascript
const scoringCategories = {
  empathy: {
    max: 100,
    description: "Förståelse för individuella behov"
  },
  efficiency: {
    max: 100,
    description: "Resurseffektivitet"
  },
  equity: {
    max: 100,
    description: "Rättvisa och jämlikhet"
  },
  sustainability: {
    max: 100,
    description: "Långsiktig hållbarhet"
  }
};
```

### Outcome Calculation
```javascript
calculateOutcome(choices) {
  const weights = {
    empathy: 0.3,
    efficiency: 0.25,
    equity: 0.25,
    sustainability: 0.2
  };
  
  let totalScore = 0;
  let outcomes = {};
  
  Object.keys(weights).forEach(category => {
    const categoryScore = choices.reduce((sum, choice) => 
      sum + (choice.points[category] || 0), 0
    );
    
    outcomes[category] = {
      score: categoryScore,
      percentage: (categoryScore / scoringCategories[category].max) * 100
    };
    
    totalScore += categoryScore * weights[category];
  });
  
  return {
    totalScore,
    outcomes,
    rating: getRating(totalScore)
  };
}
```

---

## UI Components

### Dialogue Interface
```jsx
const DialogueInterface = ({ 
  npc, 
  dialogue, 
  choices, 
  onSelect 
}) => (
  <div className="dialogue-container">
    <NPCDisplay npc={npc} emotion={dialogue.emotion} />
    
    <div className="dialogue-bubble">
      <p className="dialogue-text">{dialogue.text}</p>
    </div>
    
    <div className="choices-container">
      {choices.map((choice, index) => (
        <button
          key={index}
          className="dialogue-choice"
          onClick={() => onSelect(choice)}
        >
          {choice.text}
        </button>
      ))}
    </div>
  </div>
);
```

### Progress Tracker
```jsx
const ProgressTracker = ({ scenario, progress }) => (
  <div className="progress-tracker">
    <h3>{scenario.title}</h3>
    <ProgressBar value={progress.completion} max={100} />
    
    <div className="score-indicators">
      {Object.entries(progress.scores).map(([category, score]) => (
        <ScoreIndicator
          key={category}
          label={category}
          value={score}
          max={100}
        />
      ))}
    </div>
  </div>
);
```

---

## State Management

### Redux Slice
```javascript
const welfareGameSlice = createSlice({
  name: 'welfareGame',
  initialState: {
    currentScenario: null,
    currentDialogue: null,
    npcRelationships: {},
    choices: [],
    scores: {
      empathy: 0,
      efficiency: 0,
      equity: 0,
      sustainability: 0
    },
    gamePhase: 'SCENARIO_SELECT' // SCENARIO_SELECT | DIALOGUE | OUTCOME
  },
  reducers: {
    startScenario: (state, action) => {
      state.currentScenario = action.payload;
      state.gamePhase = 'DIALOGUE';
      state.choices = [];
    },
    selectDialogueOption: (state, action) => {
      const choice = action.payload;
      state.choices.push(choice);
      
      // Update scores
      Object.entries(choice.points || {}).forEach(([category, points]) => {
        if (state.scores[category] !== undefined) {
          state.scores[category] += points;
        }
      });
      
      // Update NPC relationship
      if (choice.npcImpact) {
        const npcId = state.currentDialogue.npcId;
        state.npcRelationships[npcId] = 
          (state.npcRelationships[npcId] || 0) + choice.npcImpact;
      }
    },
    completeScenario: (state) => {
      state.gamePhase = 'OUTCOME';
    }
  }
});
```

---

## Audio & Visuals

### Character Portraits
- Hand-drawn style
- Expressive emotions
- Diverse representation
- Professional appearance

### UI Theme
- Soft, welcoming colors
- Clear typography
- Accessible design
- Swedish aesthetic

### Sound Design
- Gentle background music
- Subtle UI sounds
- Optional voice acting
- Emotional audio cues

---

## Localization

### Swedish Primary
```javascript
const translations = {
  sv: {
    game_title: "Välfärdsspelet",
    start_game: "Börja spela",
    select_scenario: "Välj scenario",
    your_score: "Ditt resultat",
    play_again: "Spela igen"
  },
  en: {
    game_title: "The Welfare Game",
    start_game: "Start game",
    select_scenario: "Select scenario",
    your_score: "Your score",
    play_again: "Play again"
  }
};
```

---

## Best Practices

1. **Respectful Portrayal**: Handle sensitive topics with care
2. **Balanced Perspectives**: Show multiple valid viewpoints
3. **Educational Focus**: Prioritize learning over winning
4. **Accessibility**: Full keyboard and screen reader support
5. **Save Progress**: Allow players to continue later
6. **Feedback**: Clear consequences for choices
7. **Replayability**: Different paths and outcomes

---

## Related Packages

- **S1**: State Management (game state)
- **S2**: Firebase (save progress)
- **F1**: Core Framework (UI components)
- **F2**: Common Features (dialogue UI)