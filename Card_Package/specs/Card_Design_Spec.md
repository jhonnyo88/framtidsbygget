# Card Design Specification

**Component:** Card  
**Type:** Container Component  
**Design System:** Framtidsbygget

---

## Visual Design

### Structure
```
┌─────────────────────────────┐
│ Header (optional)           │
│ ─────────────────────────── │
│                             │
│ Content                     │
│ (flexible height)           │
│                             │
│ ─────────────────────────── │
│ Footer (optional)           │
└─────────────────────────────┘
```

### Spacing
- **Card padding**: 0 (content controls its own padding)
- **Header padding**: `var(--space-m) var(--space-l)`
- **Content padding**: `var(--space-l)`
- **Footer padding**: `var(--space-m) var(--space-l)`
- **Section gap**: Sections connect seamlessly

### Dimensions
- **Min width**: 280px (mobile friendly)
- **Max width**: Controlled by container
- **Min height**: Content-driven
- **Border radius**: `var(--space-m)` (12px)

---

## Variants

### Flat (Default)
- **Background**: `var(--color-surface-primary)`
- **Border**: None
- **Shadow**: None
- **Use case**: Minimal emphasis, grouped content

### Elevated
- **Background**: `var(--color-surface-primary)`
- **Border**: None
- **Shadow**: `var(--shadow-medium)`
- **Use case**: Important content, interactive elements

### Outlined
- **Background**: `var(--color-surface-primary)`
- **Border**: `1px solid var(--color-border-subtle)`
- **Shadow**: None
- **Use case**: Defined boundaries, form sections

---

## Interactive States

### Hover (when interactive)
- **Elevated**: Shadow increases to `var(--shadow-large)`
- **Flat**: Subtle background color change
- **Outlined**: Border color darkens slightly
- **Transform**: `translateY(-2px)` for elevated
- **Transition**: `all 0.2s ease-in-out`

### Active/Pressed
- **Transform**: `scale(0.98)`
- **Shadow**: Reduced for elevated variant

### Disabled
- **Opacity**: 0.6
- **Cursor**: `not-allowed`
- **Interactive states**: Disabled

### Focus
- **Outline**: `2px solid var(--color-brand-primary)`
- **Outline offset**: `2px`
- **Visible only**: On keyboard navigation

---

## Typography

### Header
- **Title**: 
  - Font size: `1.125rem` (18px)
  - Font weight: 600
  - Color: `var(--color-text-primary)`
- **Subtitle** (if used):
  - Font size: `0.875rem` (14px)
  - Font weight: 400
  - Color: `var(--color-text-secondary)`

### Content
- Inherits from parent context
- Default line-height: 1.5
- Color: `var(--color-text-primary)`

### Footer
- Font size: `0.875rem` (14px)
- Color: `var(--color-text-secondary)`
- Often contains buttons or metadata

---

## Color Schemes

### Light Theme
- **Background**: `#FFFFFF`
- **Border**: `#E0E0E0`
- **Header border**: `#F5F5F5`
- **Hover background**: `#FAFAFA`

### Dark Theme (future)
- **Background**: `#1E1E1E`
- **Border**: `#333333`
- **Header border**: `#2A2A2A`
- **Hover background**: `#252525`

### Game-Specific Variants
- **Welfare**: Soft blue tint
- **Crisis**: Red accent border
- **Puzzle**: Purple accent
- **Memory**: Green accent

---

## Subcomponent Specifications

### Card.Header
- **Display**: Flex container
- **Alignment**: Space-between (title and actions)
- **Border bottom**: Subtle divider
- **Min height**: 56px

### Card.Content
- **Display**: Block
- **Overflow**: Auto (with max-height option)
- **Flexibility**: Grows to fit content

### Card.Footer
- **Display**: Flex container
- **Alignment**: Flex-end (right-aligned by default)
- **Border top**: Subtle divider
- **Min height**: 56px

---

## Responsive Behavior

### Mobile (< 768px)
- **Full width**: Cards expand to container
- **Reduced padding**: Header/Footer use `--space-m`
- **Stack behavior**: Footer actions stack vertically
- **Touch targets**: Minimum 44px for interactive elements

### Tablet (768px - 1024px)
- **Flexible width**: Cards in grid layouts
- **Standard padding**: As specified

### Desktop (> 1024px)
- **Fixed widths**: In grid systems
- **Hover states**: Fully enabled
- **Multi-column**: Support for card grids

---

## Animation Specifications

### Entrance Animation
```css
@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
- **Duration**: 0.3s
- **Easing**: ease-out
- **Stagger**: 0.05s delay between cards in lists

### Interactive Transitions
- **Hover**: 0.2s ease-in-out
- **Active**: 0.1s ease-out
- **Focus**: Instant (no transition)

---

## Accessibility Requirements

### Semantic Structure
- Use appropriate heading levels in Card.Header
- Maintain logical reading order
- Group related content with proper ARIA labels

### Keyboard Navigation
- Cards with onClick are focusable
- Enter/Space triggers click handler
- Tab order follows visual layout

### Screen Reader Support
- Announce card role when interactive
- Read header before content
- Indicate expanded/collapsed states

### Color Contrast
- All text meets WCAG AA standards
- Interactive states visible without color
- Focus indicators clearly visible

---

## Content Guidelines

### Header Content
- **Title**: Concise, action-oriented (2-5 words)
- **Subtitle**: Additional context if needed
- **Actions**: Maximum 2 icon buttons

### Body Content
- **Text**: Clear hierarchy with headings
- **Images**: Responsive with proper alt text
- **Lists**: Properly structured with bullets/numbers
- **Forms**: Logical grouping of inputs

### Footer Content
- **Actions**: Primary action on the right
- **Metadata**: Timestamps, counts on the left
- **Status**: Badges or pills for states

---

## Special Considerations

### Performance
- Use CSS containment for large card lists
- Lazy load images within cards
- Virtualize long card lists

### Empty States
- Provide meaningful empty state messages
- Include action to populate content
- Maintain minimum height for consistency

### Loading States
- Show skeleton screens while loading
- Maintain card dimensions during load
- Progressive content revelation

### Error States
- Clear error messaging within card
- Retry actions in footer
- Non-destructive error display