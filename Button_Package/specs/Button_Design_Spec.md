# Button Design Specification

**Component:** Button  
**Version:** 1.0  
**Status:** Core UI Component

---

## Visual Design

### Base Styles

All buttons share these foundational styles:

```css
/* Base button styles */
.button {
  /* Sizing */
  padding: var(--space-s) var(--space-l);  /* 8px 24px */
  border-radius: var(--space-s);           /* 8px */
  border: none;
  
  /* Typography */
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  
  /* Interaction */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  user-select: none;
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  position: relative;
  white-space: nowrap;
}
```

### Variants

#### Primary Button
Used for main actions like "Start Game", "Continue", "Save"

```css
.button--primary {
  background-color: var(--color-brand-primary);    /* #1976D2 */
  color: var(--color-text-on-primary);             /* white */
}

.button--primary:hover {
  filter: brightness(1.1);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.button--primary:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}
```

#### Secondary Button
Used for secondary actions like "Cancel", "Back", "View Details"

```css
.button--secondary {
  background-color: transparent;
  color: var(--color-brand-primary);
  border: 2px solid var(--color-brand-primary);
}

.button--secondary:hover {
  background-color: var(--color-brand-primary);
  color: var(--color-text-on-primary);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.button--secondary:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}
```

#### Danger Button
Used for destructive actions like "Delete", "Remove", "Reset"

```css
.button--danger {
  background-color: var(--color-state-danger);     /* #C62828 */
  color: var(--color-text-on-primary);             /* white */
}

.button--danger:hover {
  filter: brightness(1.1);
  box-shadow: 0px 4px 12px rgba(198, 40, 40, 0.2);
}

.button--danger:active {
  filter: brightness(0.9);
  transform: scale(0.98);
}
```

### Sizes

#### Small
Used in tight spaces, tables, or less prominent actions

```css
.button--small {
  padding: var(--space-xs) var(--space-m);  /* 4px 16px */
  font-size: 0.875rem;
  border-radius: 6px;
}
```

#### Medium (Default)
Standard button size for most uses

```css
.button--medium {
  /* Uses base styles */
  padding: var(--space-s) var(--space-l);  /* 8px 24px */
  font-size: 1rem;
}
```

#### Large
Used for prominent CTAs or mobile-first interfaces

```css
.button--large {
  padding: var(--space-m) var(--space-xl);  /* 16px 32px */
  font-size: 1.125rem;
  border-radius: 12px;
}
```

### States

#### Disabled State
Prevents interaction and indicates unavailability

```css
.button:disabled {
  background-color: #BDBDBD;
  color: #757575;
  cursor: not-allowed;
  pointer-events: none;
  opacity: 0.6;
}

.button--secondary:disabled {
  background-color: transparent;
  border-color: #BDBDBD;
  color: #757575;
}
```

#### Focus State
Keyboard navigation indicator

```css
.button:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}
```

#### Loading State (Future Enhancement)
Shows progress during async operations

```css
.button--loading {
  color: transparent;
  pointer-events: none;
}

.button--loading::after {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: button-spin 0.8s linear infinite;
}
```

### Icon Support

Buttons can include Material Symbols icons:

```css
.button__icon {
  font-family: 'Material Symbols Outlined';
  font-size: 1.2em;
  line-height: 1;
  font-weight: normal;
}

.button__icon--left {
  margin-right: var(--space-xs);
}

.button__icon--right {
  margin-left: var(--space-xs);
  order: 1;
}

/* Icon-only buttons need special sizing */
.button--icon-only {
  padding: var(--space-s);
  aspect-ratio: 1;
}

.button--icon-only.button--small {
  width: 32px;
  height: 32px;
}

.button--icon-only.button--medium {
  width: 40px;
  height: 40px;
}

.button--icon-only.button--large {
  width: 48px;
  height: 48px;
}
```

### Special Modifiers

#### Full Width
Stretches button to container width

```css
.button--full-width {
  width: 100%;
}
```

---

## Usage Examples

### In Main Dashboard
```jsx
<Button variant="secondary" icon="explore">
  Min Kompass
</Button>
```

### In Game Modules
```jsx
<Button variant="primary" size="large" onClick={startGame}>
  Starta Spelet
</Button>
```

### In Modals
```jsx
<Button variant="danger" onClick={confirmDelete}>
  Ta Bort
</Button>
<Button variant="secondary" onClick={cancel}>
  Avbryt
</Button>
```

### Mobile Context
```jsx
<Button variant="primary" size="large" fullWidth>
  Fortsätt
</Button>
```

---

## Design Rationale

1. **Consistent Padding:** Uses spacing system for predictable sizing
2. **Clear Hierarchy:** Primary/secondary/danger variants communicate importance
3. **Accessible States:** High contrast and clear focus indicators
4. **Flexible Icons:** Support for leading/trailing icons enhances usability
5. **Responsive Sizing:** Three sizes cover all use cases
6. **Smooth Transitions:** 0.2s timing creates polished feel without lag

---

## Implementation Notes

- Always use CSS variables for colors and spacing
- Ensure minimum touch target of 44x44px on mobile
- Test color contrast ratios (minimum 4.5:1)
- Verify keyboard navigation works properly
- Icon-only buttons must have aria-label