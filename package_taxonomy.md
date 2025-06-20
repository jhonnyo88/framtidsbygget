# Package Taxonomy - Framtidsbygget

**Version:** 1.0  
**Purpose:** Optimal package structure for AI context window compatibility  
**Target:** All packages under 30k tokens for efficient AI development

---

## Package Overview

### 🎯 Design Principles
1. **Self-contained packages** - Each package includes all necessary dependencies
2. **Token efficiency** - Maximum 30k tokens per package (leaving room for AI responses)
3. **Logical boundaries** - Technology, complexity, and feature-based groupings
4. **Progressive complexity** - Build order follows natural learning curve

---

## System Packages

### Package S1: Project Foundation
**Size:** ~12k tokens  
**Purpose:** Essential project understanding and architecture

**Contents:**
```
- Technical_Masterplan_v4.md (3k tokens)
- Operational_Action_Plan.md (2.5k tokens)
- Master_UX_UI_Design_System.md (4k tokens)
- development-environment-setup.md (2.5k tokens)
```

**Dependencies:** None (entry point)  
**AI Context:** Always include for any development task

---

### Package S2: Design System Core
**Size:** ~8k tokens  
**Purpose:** Reusable UI components and patterns

**Contents:**
```
- Button component spec (1k tokens)
- Card component spec (1k tokens)
- Meter component spec (1.5k tokens)
- Icon system spec (1k tokens)
- CSS variables & typography (2k tokens)
- Component testing patterns (1.5k tokens)
```

**Dependencies:** S1 (Project Foundation)  
**AI Context:** Required for all UI development

---

### Package S3: State Management System
**Size:** ~15k tokens  
**Purpose:** Application state architecture and patterns

**Contents:**
```
- State_Management_Architecture.md (2.8k tokens)
- React_State_Patterns.md (3.5k tokens)
- Game_State_Bridge_API.md (2.5k tokens)
- State_Management_AI_Roadmap.md (4.8k tokens)
- Context setup patterns (1.4k tokens)
```

**Dependencies:** S1  
**AI Context:** Required before any stateful components

---

### Package S4: Firebase & Backend
**Size:** ~14k tokens  
**Purpose:** Data persistence and backend services

**Contents:**
```
- Firebase_Production_Setup.md (2.1k tokens)
- Firebase_Service_Implementation.md (2.5k tokens)
- Firebase_Integration_Spec.md (4.8k tokens)
- Firebase_AI_Integration_Guide.md (1.6k tokens)
- Cost optimization patterns (3k tokens)
```

**Dependencies:** S1, S3  
**AI Context:** Required for persistence features

---

### Package S5: PixiJS Core Infrastructure
**Size:** ~18k tokens  
**Purpose:** Game engine foundation and patterns

**Contents:**
```
- PixiJS_Implementation_Guide.md (2.5k tokens)
- PixiJS_Pattern_Library.md (4.2k tokens)
- React_PixiJS_Integration_Spec.md (2.4k tokens)
- GameCanvasWrapper implementation (3k tokens)
- PixiJS_Risk_Assessment_Matrix.md (2k tokens)
- Performance optimization patterns (3.9k tokens)
```

**Dependencies:** S1, S3  
**AI Context:** Required for all PixiJS games

---

## Framework Component Packages

### Package F1: Main Dashboard Framework
**Size:** ~12k tokens  
**Purpose:** Core application navigation and layout

**Contents:**
```
- UX_UI_Spec_2_1_Main_Dashboard.md (850 tokens)
- Framework_Components_Guide.md (2.8k tokens)
- MainDashboard implementation (2k tokens)
- Scoreboard component (1.5k tokens)
- MapView component (3k tokens)
- Integration patterns (1.85k tokens)
```

**Dependencies:** S1, S2, S3  
**AI Context:** First UI implementation target

---

### Package F2: Digital Compass Module
**Size:** ~8k tokens  
**Purpose:** Strategic overview visualization

**Contents:**
```
- UX_UI_Spec_2_2_Digital_Compass.md (800 tokens)
- D3.js integration patterns (2k tokens)
- Tree visualization implementation (3k tokens)
- Strategy.json data structure (1.2k tokens)
- Interaction patterns (1k tokens)
```

**Dependencies:** S1, S2, S3, F1  
**AI Context:** Advanced visualization component

---

### Package F3: User Journey Components
**Size:** ~10k tokens  
**Purpose:** Onboarding, results, and finale

**Contents:**
```
- UX_UI_Spec_2_3_Result_Progression.md (700 tokens)
- UX_UI_Spec_2_4_Onboarding.md (700 tokens)
- UX_UI_Spec_2_5_Finale.md (950 tokens)
- ResultModal implementation (2k tokens)
- OnboardingFlow logic (2.5k tokens)
- FinaleSequence animations (3.15k tokens)
```

**Dependencies:** S1, S2, S3  
**AI Context:** Polish and user experience

---

## Game Module Packages

### Package G1: Dialogue Game System (WelfareGame)
**Size:** ~10k tokens  
**Purpose:** Complete dialogue-based game implementation

**Contents:**
```
- UX_UI_Spec_3_2_Scenario_Game.md (1k tokens)
- GDD_Scenario_Game_Welfare_Dilemma.md (1.5k tokens)
- Dialogue_Engine_Core.md (1.7k tokens)
- WelfareGame_Integration.md (2k tokens)
- Dialogue_AI_Implementation_Guide.md (1.4k tokens)
- Character emotion system (1.2k tokens)
- Dialogue data structure (1.2k tokens)
```

**Dependencies:** S1, S2, S3  
**AI Context:** First game implementation (no PixiJS)

---

### Package G2: Puzzle Game Module
**Size:** ~12k tokens  
**Purpose:** First PixiJS game with drag-drop mechanics

**Contents:**
```
- UX_UI_Spec_3_1_Puzzle_Game.md (970 tokens)
- GDD_Puzzle_Game_Secure_Data_Systems.md (1.4k tokens)
- PuzzleGameModule implementation (3k tokens)
- Basic PixiJS patterns (subset) (3k tokens)
- Drag-drop implementation (2k tokens)
- Connection validation logic (1.63k tokens)
```

**Dependencies:** S1, S2, S3, S5  
**AI Context:** PixiJS introduction game

---

### Package G3: Card-Based Games Bundle
**Size:** ~14k tokens  
**Purpose:** Resource and strategy games without PixiJS

**Contents:**
```
- UX_UI_Spec_3_3_Resource_Game.md (1k tokens)
- UX_UI_Spec_3_5_Strategy_Game.md (1k tokens)
- GDD_Resource_Game_Competence_Journey.md (1.4k tokens)
- GDD_Strategy_Game_Ecosystem_Builder.md (1.5k tokens)
- Card component system (3k tokens)
- Resource management patterns (3k tokens)
- Turn-based game logic (3.1k tokens)
```

**Dependencies:** S1, S2, S3  
**AI Context:** Pure React game mechanics

---

### Package G4: Crisis Game Module
**Size:** ~16k tokens  
**Purpose:** Complex two-phase PixiJS game

**Contents:**
```
- UX_UI_Spec_3_4_Crisis_Game.md (1.2k tokens)
- GDD_Crisis_Game_Connectivity_Guardian.md (1.5k tokens)
- ConnectivityGameModule implementation (4k tokens)
- Advanced PixiJS patterns (4k tokens)
- Real-time crisis system (3k tokens)
- Performance optimization strategies (2.3k tokens)
```

**Dependencies:** S1, S2, S3, S5, G2  
**AI Context:** Most complex implementation

---

## Support Packages

### Package X1: Testing & Quality
**Size:** ~8k tokens  
**Purpose:** Testing patterns and quality assurance

**Contents:**
```
- Testing_Framework.md (2k tokens)
- Quality_Gates.md (1.5k tokens)
- Component test patterns (2k tokens)
- Integration test strategies (1.5k tokens)
- Performance benchmarks (1k tokens)
```

**Dependencies:** S1  
**AI Context:** Include with any implementation task

---

### Package X2: Data & Content
**Size:** ~10k tokens  
**Purpose:** Game content and localization

**Contents:**
```
- gameContent.js (3k tokens)
- achievementsData.js (1.5k tokens)
- localization.js (2k tokens)
- audioConfig.js (1k tokens)
- strategy.json (1k tokens)
- mockData.js (1.5k tokens)
```

**Dependencies:** None  
**AI Context:** Include when implementing specific games

---

### Package X3: AI Development Helpers
**Size:** ~12k tokens  
**Purpose:** AI-specific implementation guidance

**Contents:**
```
- AI_Development_Methodology.md (3.5k tokens)
- Component_Development_Sequence.md (2.9k tokens)
- Optimized_Prompt_Library.md (3k tokens)
- Common AI pitfalls and solutions (2.6k tokens)
```

**Dependencies:** S1  
**AI Context:** Reference for optimal AI workflows

---

## Dependency Graph

```
S1: Project Foundation
├── S2: Design System Core
├── S3: State Management System
│   ├── S4: Firebase & Backend
│   └── S5: PixiJS Core Infrastructure
├── F1: Main Dashboard Framework
│   └── F2: Digital Compass Module
├── F3: User Journey Components
├── G1: Dialogue Game System
├── G2: Puzzle Game Module (requires S5)
├── G3: Card-Based Games Bundle
├── G4: Crisis Game Module (requires S5, G2)
├── X1: Testing & Quality
├── X2: Data & Content
└── X3: AI Development Helpers
```

---

## Package Selection Strategy

### For New AI Session:
1. **Always include:** S1 (Project Foundation)
2. **For UI work:** Add S2 (Design System) + target package
3. **For games:** Add S3 (State Management) + specific game package
4. **For PixiJS games:** Add S5 (PixiJS Core) + game package
5. **For testing:** Add X1 (Testing & Quality)

### Optimal Combinations:

#### Starting a new component:
- S1 + S2 + S3 + F1 = ~27k tokens

#### Implementing a React game:
- S1 + S3 + G1 (or G3) = ~25k tokens

#### Implementing a PixiJS game:
- S1 + S3 + S5 + G2 = ~28k tokens

#### Complex implementation:
- S1 + S5 + G4 + X1 = ~26k tokens

---

## Future Scaling

When documentation expands beyond 400k tokens:

1. **Split large packages:**
   - S5 → S5a (Basic PixiJS) + S5b (Advanced PixiJS)
   - S3 → S3a (Core State) + S3b (Game State)

2. **Create micro-packages:**
   - Individual component specs (2-3k tokens)
   - Feature-specific bundles (5k tokens)

3. **Dynamic packaging:**
   - Build custom packages based on task requirements
   - Include only relevant subsections of large docs

---

## Implementation Notes

### Package Creation Process:
1. Extract relevant files into package directory
2. Create package manifest with dependencies
3. Generate token count verification
4. Test AI comprehension with package

### Quality Criteria:
- ✅ Self-contained documentation
- ✅ Under 30k token limit
- ✅ Clear dependency chain
- ✅ Logical grouping by technology/feature
- ✅ Progressive complexity ordering

---

*This taxonomy ensures efficient AI development with optimal context utilization.*