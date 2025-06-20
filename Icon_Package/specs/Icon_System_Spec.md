# Icon System Specification

**System:** Framtidsbygget Icon System  
**Library:** Material Symbols  
**Version:** 1.0

---

## Design Principles

### Visual Consistency
- Use Material Symbols Outlined as default style
- Filled variants for emphasis and primary actions
- Consistent 24px grid alignment
- 2px stroke width for outlined icons

### Semantic Usage
- Icons complement text, not replace it
- Clear metaphors aligned with Swedish culture
- Consistent meaning across the application
- Game-appropriate iconography

---

## Icon Grid & Sizing

### Base Grid
All icons designed on 24x24px grid with 2px padding:

```
┌─────────────────────┐
│  ┌─────────────┐  │ 2px padding
│  │             │  │
│  │    Icon     │  │ 20px icon area
│  │   Content   │  │
│  │             │  │
│  └─────────────┘  │
└─────────────────────┘
```

### Size Variants

| Size | Icon | Touch Target | Usage |
|------|------|--------------|-------|
| small | 16px | 32px | Inline text, dense UI |
| medium | 24px | 40px | Default size |
| large | 32px | 48px | Primary actions |
| xlarge | 48px | 64px | Hero sections |

### Optical Sizing
Material Symbols support optical sizing (opsz):
- Small: 20
- Medium: 24  
- Large: 40
- XLarge: 48

---

## Color System

### Semantic Colors

| Token | Usage | Light Mode | Dark Mode |
|-------|-------|------------|-----------|
| `default` | Standard icons | #666666 | #A0A0A0 |
| `primary` | Primary actions | #1976D2 | #64B5F6 |
| `secondary` | Secondary actions | #666666 | #A0A0A0 |
| `success` | Success states | #2E7D32 | #66BB6A |
| `error` | Error states | #C62828 | #EF5350 |
| `warning` | Warning states | #F57C00 | #FFA726 |
| `info` | Information | #0288D1 | #29B6F6 |
| `on-primary` | On brand color | #FFFFFF | #1A1A1A |

### Interactive States

```css
/* Hover */
opacity: 0.8;
transform: scale(1.1);

/* Active */
opacity: 0.6;
transform: scale(0.95);

/* Disabled */
opacity: 0.38;
cursor: not-allowed;

/* Focus */
outline: 2px solid primary;
outline-offset: 2px;
```

---

## Icon Categories

### Navigation Icons
Core navigation and directional indicators

| Icon | Name | Usage |
|------|------|-------|
| 🏠 | `home` | Home/Dashboard |
| ← | `arrow_back` | Back navigation |
| → | `arrow_forward` | Forward navigation |
| ☰ | `menu` | Menu toggle |
| ✕ | `close` | Close/Dismiss |
| ˅ | `expand_more` | Expand/Show more |
| ˄ | `expand_less` | Collapse/Show less |

### Action Icons
Interactive elements and user actions

| Icon | Name | Usage |
|------|------|-------|
| ▶ | `play_arrow` | Start/Play |
| ⏸ | `pause` | Pause |
| ⏹ | `stop` | Stop |
| ↻ | `replay` | Restart/Retry |
| + | `add` | Add/Create |
| − | `remove` | Remove/Subtract |
| ✎ | `edit` | Edit/Modify |
| 🗑 | `delete` | Delete/Remove |

### Status Icons
State indicators and feedback

| Icon | Name | Usage |
|------|------|-------|
| ✓ | `check_circle` | Success/Complete |
| ⚠ | `warning` | Warning/Caution |
| ✕ | `error` | Error/Failed |
| ℹ | `info` | Information |
| ⏱ | `schedule` | Scheduled/Time |
| ⟳ | `update` | Update/Refresh |

### Game Icons
Game-specific and achievement icons

| Icon | Name | Usage |
|------|------|-------|
| 🏆 | `emoji_events` | Achievement/Trophy |
| ⭐ | `stars` | Rating/Favorite |
| 🎯 | `target` | Goal/Objective |
| 🎮 | `sports_esports` | Game controller |
| 🧩 | `extension` | Puzzle piece |
| 💡 | `lightbulb` | Hint/Idea |

### Social Icons
User and communication icons

| Icon | Name | Usage |
|------|------|-------|
| 👤 | `person` | User/Profile |
| 👥 | `group` | Team/Multiple users |
| 💬 | `chat_bubble` | Chat/Message |
| 🔔 | `notifications` | Notifications |
| 📤 | `share` | Share content |
| 👍 | `thumb_up` | Like/Approve |

---

## Animation Specifications

### Spin Animation
Continuous rotation for loading states

```css
@keyframes icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.icon--spinning {
  animation: icon-spin 2s linear infinite;
}
```

### Pulse Animation
Scale pulsing for attention

```css
@keyframes icon-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.icon--pulse {
  animation: icon-pulse 2s ease-in-out infinite;
}
```

### Transition Specifications
All icons should have smooth transitions:

```css
.icon {
  transition: all 0.2s ease-in-out;
}
```

---

## Accessibility Guidelines

### ARIA Labels
- Icon-only buttons MUST have aria-label
- Decorative icons use aria-hidden="true"
- Status icons include role="img"

### Screen Reader Text
```jsx
// Icon with text
<button>
  <Icon name="save" />
  <span>Spara</span>
</button>

// Icon-only button
<button aria-label="Spara dokument">
  <Icon name="save" />
</button>

// Decorative icon
<div>
  <Icon name="star" aria-hidden="true" />
  <span>Premium</span>
</div>
```

### Keyboard Navigation
- Interactive icons must be keyboard accessible
- Focus indicators clearly visible
- Tab order follows visual layout

---

## Implementation Guidelines

### Font Loading
```css
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
```

### Font Settings
```css
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,      /* 0 = outlined, 1 = filled */
    'wght' 400,    /* Weight: 100-700 */
    'GRAD' 0,      /* Grade: -50 to 200 */
    'opsz' 24;     /* Optical size: 20-48 */
}
```

### Performance Optimization
- Subset font to only used icons
- Preload critical icons
- Use CSS containment
- Minimize DOM updates

---

## Usage Patterns

### Icon + Text Button
```jsx
<Button>
  <Icon name="save" />
  Spara
</Button>
```

### Icon-Only Button
```jsx
<Button variant="secondary" aria-label="Inställningar">
  <Icon name="settings" />
</Button>
```

### Status with Icon
```jsx
<div className="status">
  <Icon name="check_circle" color="success" />
  <span>Uppdraget slutfört</span>
</div>
```

### Loading State
```jsx
<div className="loading">
  <Icon name="refresh" spinning />
  <span>Laddar...</span>
</div>
```

---

## Swedish Localization

### Cultural Considerations
- Avoid icons with specific cultural meanings
- Test icons with Swedish users
- Consider local alternatives for ambiguous icons

### Common Localizations
| Global | Swedish Context |
|--------|----------------|
| 💰 | Use for "kronor" not dollars |
| 📅 | Week starts on Monday |
| 🏥 | Healthcare (välfärd) context |

---

## Quality Checklist

- [ ] Icons align to pixel grid
- [ ] Consistent stroke width
- [ ] Proper color contrast
- [ ] Smooth animations
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Touch targets appropriate
- [ ] Performance optimized