# AI Navigation Guide for Framtidsbygget

**Purpose:** Help AI developers select the right packages for each task  
**Total Repository Size:** ~150k tokens (growing to 400k+)  
**Context Window Limit:** 200k tokens  
**Last Updated:** 2025-01-20

---

## 🗺️ Quick Navigation

### By Task Type

| Task | Primary Packages | Token Cost | Secondary Packages |
|------|-----------------|------------|-------------------|
| **Create new component** | DS-001 to DS-006 | ~8-10k each | S1 (State), S2 (Firebase) |
| **Implement game feature** | G1-G4 (specific game) | ~25-30k | S1, S3, F2 |
| **Fix UI bugs** | F1 (Framework) + relevant DS | ~20-25k | S1 |
| **Add Firebase feature** | S2 (Firebase) | ~28k | S1, S5 |
| **State management** | S1 (State) | ~26k | S3 (Bridge) |
| **PixiJS integration** | S3 (PixiJS) | ~24k | G1-G4 |
| **Testing/Quality** | S4 (Testing) | ~22k | Relevant component |
| **Documentation** | X1 (Docs) | ~20k | Component packages |

### By Component Need

| Component | Package ID | Tokens | Dependencies |
|-----------|-----------|--------|--------------|
| Button | DS-001 | 8.5k | Design System core |
| Card | DS-002 | 8.2k | Design System core |
| Typography | DS-003 | 7.8k | Design System core |
| Icon | DS-004 | 7.5k | Material Symbols |
| Form Controls | DS-005 | 9.2k | Design System core |
| Layout | DS-006 | 8.8k | Design System core |

---

## 📦 Complete Package Directory

### System Packages (S1-S5)
Critical infrastructure - load these when working on core functionality

| ID | Name | Tokens | Purpose | Load When |
|----|------|--------|---------|-----------|
| **S1** | State Management | 26k | Redux, Firebase sync, patterns | Any state changes |
| **S2** | Firebase Integration | 28k | Auth, Firestore, cost control | Backend features |
| **S3** | PixiJS Bridge | 24k | GameCanvasWrapper, patterns | Game rendering |
| **S4** | Testing & Quality | 22k | Testing patterns, tools | Writing tests |
| **S5** | Development Tools | 20k | Build config, optimization | Build/deploy |

### Framework Packages (F1-F3)
UI structure - load for navigation and layout work

| ID | Name | Tokens | Purpose | Load When |
|----|------|--------|---------|-----------|
| **F1** | Core Framework | 25k | Dashboard, navigation, layout | UI structure changes |
| **F2** | Common Features | 22k | Modals, forms, shared UI | Common UI work |
| **F3** | Advanced UI | 23k | Animations, responsive, accessibility | Polish/UX work |

### Game Module Packages (G1-G4)
Game-specific - only load the relevant game

| ID | Name | Tokens | Purpose | Load When |
|----|------|--------|---------|-----------|
| **G1** | WelfareGame | 28k | Dialogue system, NPCs | Welfare features |
| **G2** | CrisisGame | 30k | Resource management | Crisis features |
| **G3** | PuzzleGame | 25k | Puzzle mechanics | Puzzle features |
| **G4** | MemoryGame | 22k | Memory mechanics | Memory features |

### Design System Packages (DS-001 to DS-006)
Component library - load as needed

| ID | Name | Tokens | Contains |
|----|------|--------|----------|
| **DS-001** | Button | 8.5k | All button variants |
| **DS-002** | Card | 8.2k | Card container system |
| **DS-003** | Typography | 7.8k | Text styles, headings |
| **DS-004** | Icon | 7.5k | Icon system, symbols |
| **DS-005** | Form Controls | 9.2k | Inputs, selects, etc |
| **DS-006** | Layout | 8.8k | Grid, spacing, containers |

### Extension Packages (X1-X3)
Supporting materials - load for specific needs

| ID | Name | Tokens | Purpose |
|----|------|--------|---------|
| **X1** | Documentation | 20k | Guides, patterns |
| **X2** | Migration | 18k | Legacy code guides |
| **X3** | External Integration | 15k | Third-party APIs |

---

## 🎯 Task-to-Package Mapping

### Frontend Development Tasks

```yaml
Create New Page:
  required: [F1, S1]
  optional: [DS-001 to DS-006 as needed]
  total: ~35-50k tokens

Add Game Feature:
  required: [G(n), S1, S3]
  optional: [F2, DS packages]
  total: ~60-80k tokens

Fix UI Bug:
  required: [F1, relevant DS package]
  optional: [S1 if state-related]
  total: ~30-40k tokens

Implement Animation:
  required: [F3, S3 for game animations]
  optional: [DS packages]
  total: ~35-45k tokens
```

### Backend/Integration Tasks

```yaml
Firebase Feature:
  required: [S2, S1]
  optional: [S4 for testing]
  total: ~50-70k tokens

Add Authentication:
  required: [S2, F1, F2]
  optional: [S1]
  total: ~60-75k tokens

Optimize Performance:
  required: [S5, S4]
  optional: [S1, S3]
  total: ~40-60k tokens
```

### Component Development

```yaml
New Component:
  required: [Relevant DS package, X1]
  optional: [S4 for tests]
  total: ~20-30k tokens

Update Component:
  required: [Specific DS package]
  optional: [S4, X1]
  total: ~15-25k tokens
```

---

## ⚠️ Context Size Management

### Token Budget Guidelines

**Available Context:** 200k tokens  
**Repository Overhead:** ~10k tokens  
**Conversation History:** ~20-40k tokens  
**Safe Working Space:** ~150k tokens

### Package Combination Limits

| Combination Type | Max Packages | Token Budget |
|-----------------|--------------|--------------|
| Full System Work | 3-4 packages | ~100k |
| Game Development | 2-3 packages | ~80k |
| Component Work | 4-5 packages | ~40k |
| Documentation | 5-6 packages | ~50k |

### ⚡ Optimal Combinations

**For Game Development:**
```
G(n) + S1 + S3 = ~75-80k tokens
Add F2 for UI = ~95-100k tokens
```

**For System Architecture:**
```
S1 + S2 + S4 = ~76k tokens
Add F1 for UI = ~101k tokens
```

**For Component Library:**
```
All DS packages = ~50k tokens
Add S4 for testing = ~72k tokens
```

---

## 📋 AI Developer Instructions

### 1. Task Analysis
Before loading packages, analyze:
- What is the primary task?
- Which game module (if any)?
- Frontend, backend, or both?
- New feature or bug fix?

### 2. Package Selection
```python
# Pseudo-code for package selection
if task.type == "game_feature":
    load_packages([f"G{game_number}", "S1", "S3"])
elif task.type == "component":
    load_packages([f"DS-{component_id}", "S4"])
elif task.type == "firebase":
    load_packages(["S2", "S1"])
elif task.type == "ui_structure":
    load_packages(["F1", "F2"] + needed_ds_packages)
```

### 3. Context Monitoring
- Track loaded token count
- Reserve 50k for conversation
- Unload packages when switching tasks
- Prioritize primary packages

### 4. Efficient Loading Patterns

**Sequential Loading:**
```
1. Load core package (e.g., G1)
2. Identify dependencies
3. Load only needed dependencies
4. Work iteratively
```

**Batch Loading:**
```
For related work, load all at once:
- All DS packages for component library work
- S1 + S2 + S4 for full-stack features
```

---

## 🔍 Quick Reference

### Most Used Combinations

| Task | Packages | Tokens |
|------|----------|--------|
| **Add dialogue to game** | G1 + S1 + F2 | ~76k |
| **Create form component** | DS-005 + S1 + S4 | ~57k |
| **Firebase integration** | S2 + S1 + F1 | ~79k |
| **Game UI update** | G(n) + F1 + DS packages | ~65k |
| **Testing setup** | S4 + S5 + relevant packages | ~60k |

### Emergency Combinations
When context is tight:

| Need | Minimal Package Set | Tokens |
|------|-------------------|--------|
| **Quick fix** | Single DS package | ~8k |
| **State debug** | S1 only | ~26k |
| **Firebase check** | S2 only | ~28k |
| **Game logic** | G(n) only | ~25-30k |

---

## 🚀 Pro Tips

1. **Start Minimal**: Load only what you need initially
2. **Use Package IDs**: Reference by ID for quick lookup
3. **Check Dependencies**: Some packages work better together
4. **Monitor Token Usage**: Keep mental count of loaded tokens
5. **Unload When Done**: Clear context when switching major tasks

### Context Overflow Protocol
If approaching token limit:
1. Save work state
2. Unload non-essential packages
3. Continue with minimal set
4. Document what was unloaded

---

## 📚 Package Dependency Graph

```
S1 (State) ← → S2 (Firebase)
     ↓              ↓
S3 (PixiJS) ← → G1-G4 (Games)
     ↓              ↓
F1 (Framework) ← → F2 (Common)
     ↓              ↓
DS-001-006 ← → F3 (Advanced)
```

**Read as:** Arrows indicate common co-loading patterns

---

## 🎮 Game-Specific Navigation

### WelfareGame Development
```yaml
Core: G1 (28k)
Usually needs: S1 (26k), F2 (22k)
Total: ~76k tokens
UI Components: DS-001, DS-002
```

### CrisisGame Development
```yaml
Core: G2 (30k)
Usually needs: S1 (26k), S3 (24k), F1 (25k)
Total: ~105k tokens (watch size!)
UI Components: DS-002, DS-005
```

### PuzzleGame Development
```yaml
Core: G3 (25k)
Usually needs: S3 (24k), F2 (22k)
Total: ~71k tokens
UI Components: DS-001, DS-006
```

### MemoryGame Development
```yaml
Core: G4 (22k)
Usually needs: S3 (24k), F1 (25k)
Total: ~71k tokens
UI Components: DS-002, DS-004
```

---

## 🔧 Maintenance Notes

- Package sizes may grow with updates
- Check token counts before major work
- New packages will be added to taxonomy
- Dependencies may change with refactoring

**Last Token Count:** 2025-01-20  
**Next Review:** When adding new packages