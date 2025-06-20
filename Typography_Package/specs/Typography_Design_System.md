# Typography Design System

**System:** Framtidsbygget Typography  
**Version:** 1.0  
**Language:** Swedish-optimized

---

## Type Scale

### Desktop Scale (≥768px)

| Token | Size | Line Height | Weight | Tracking | Usage |
|-------|------|-------------|--------|----------|-------|
| `--font-size-display` | 48px | 1.2 | 700 | -0.02em | Hero headings |
| `--font-size-h1` | 40px | 1.2 | 700 | -0.02em | Page titles |
| `--font-size-h2` | 32px | 1.3 | 600 | -0.01em | Section headers |
| `--font-size-h3` | 24px | 1.4 | 600 | -0.01em | Subsections |
| `--font-size-h4` | 20px | 1.4 | 600 | 0 | Card titles |
| `--font-size-h5` | 18px | 1.5 | 500 | 0 | Labels |
| `--font-size-body-lg` | 18px | 1.6 | 400 | 0 | Intro paragraphs |
| `--font-size-body` | 16px | 1.6 | 400 | 0 | Body text |
| `--font-size-body-sm` | 14px | 1.5 | 400 | 0 | Secondary text |
| `--font-size-caption` | 12px | 1.4 | 400 | 0.02em | Metadata |

### Mobile Scale (<768px)

| Token | Size | Adjustment | Line Height |
|-------|------|------------|-------------|
| `--font-size-display` | 40px | -8px | 1.2 |
| `--font-size-h1` | 32px | -8px | 1.25 |
| `--font-size-h2` | 28px | -4px | 1.3 |
| `--font-size-h3` | 22px | -2px | 1.4 |
| `--font-size-h4` | 18px | -2px | 1.4 |
| `--font-size-h5` | 16px | -2px | 1.5 |
| Others | Same | No change | Same |

---

## Font Stack

### Primary Font
```css
--font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 
  'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
  'Helvetica Neue', sans-serif;
```

### Monospace Font
```css
--font-family-mono: 'JetBrains Mono', 'Roboto Mono', 
  'SF Mono', Monaco, Consolas, 'Courier New', monospace;
```

### Swedish Character Support
All fonts must support:
- Swedish characters: å, ä, ö, Å, Ä, Ö
- Extended Latin: é, ü, etc.
- Proper kerning for Swedish letter pairs

---

## Font Weights

| Token | Weight | Usage |
|-------|--------|-------|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasis, buttons |
| `--font-weight-semibold` | 600 | Subheadings |
| `--font-weight-bold` | 700 | Main headings |

---

## Color System

### Text Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--color-text-primary` | #1A1A1A | #F5F5F5 | Main text |
| `--color-text-secondary` | #666666 | #A0A0A0 | Secondary info |
| `--color-text-tertiary` | #999999 | #808080 | Disabled/hints |
| `--color-text-on-primary` | #FFFFFF | #1A1A1A | On brand color |
| `--color-text-error` | #C62828 | #EF5350 | Error messages |
| `--color-text-success` | #2E7D32 | #66BB6A | Success messages |
| `--color-text-warning` | #F57C00 | #FFA726 | Warnings |
| `--color-text-info` | #0288D1 | #29B6F6 | Information |

### Contrast Requirements
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- All combinations WCAG AA compliant

---

## Spacing & Rhythm

### Vertical Rhythm
Base unit: 8px grid

| Element | Margin Top | Margin Bottom |
|---------|------------|---------------|
| H1 | 32px | 16px |
| H2 | 24px | 16px |
| H3 | 24px | 12px |
| H4-H5 | 16px | 8px |
| Paragraph | 0 | 16px |
| List | 0 | 16px |

### Text Block Width
- Optimal: 65-75 characters
- Maximum: 90 characters
- Minimum: 45 characters

---

## Component Specifications

### Heading Component

**Props:**
- `level`: 1-5 (required)
- `variant`: "default" | "display"
- `align`: "left" | "center" | "right"
- `truncate`: boolean
- `className`: string
- `as`: Custom element

**Behavior:**
- Renders semantic heading (h1-h5)
- Display variant for hero sections
- Automatic responsive sizing
- Preserves semantic hierarchy

### Body Component

**Props:**
- `size`: "small" | "medium" | "large"
- `weight`: "regular" | "medium" | "semibold"
- `variant`: Color variants
- `align`: Text alignment
- `truncate`: boolean
- `className`: string
- `as`: "p" | "span" | "div"

**Behavior:**
- Default renders as `<p>`
- Inline option with span
- Color variants for semantic meaning

### Caption Component

**Props:**
- `variant`: Color variants
- `uppercase`: boolean
- `className`: string

**Behavior:**
- Always renders as `<span>`
- Smaller size for metadata
- Often used with time/date

---

## Responsive Behavior

### Fluid Typography
Between 375px and 768px viewports:
```css
font-size: clamp(
  var(--mobile-size),
  calc(var(--mobile-size) + (var(--desktop-size) - var(--mobile-size)) * 
    ((100vw - 375px) / (768 - 375))),
  var(--desktop-size)
);
```

### Line Length Control
```css
.typography-container {
  max-width: 65ch;
  margin: 0 auto;
}
```

### Mobile Adjustments
- Tighter line heights
- Reduced margins
- Smaller heading sizes
- Same body text size

---

## Accessibility

### Semantic HTML
- Use proper heading hierarchy
- Don't skip heading levels
- One H1 per page
- Meaningful heading text

### Screen Reader Support
- Hidden text with `.sr-only`
- Proper language attributes
- Clear link text
- Avoid "click here"

### Keyboard Navigation
- Focus visible on interactive text
- Skip links for navigation
- Proper tab order

---

## Swedish Language Considerations

### Line Breaking
```css
.swedish-text {
  word-break: break-word;
  hyphens: auto;
  lang: sv;
}
```

### Common Swedish Patterns
- Compound words: Handle long combinations
- Letter spacing: Slightly tighter for Swedish
- Paragraph spacing: Slightly increased

### Typography Testing
Test with Swedish phrases:
- "Välkommen till Framtidsbygget"
- "Utforska välfärdssystemet"
- "Krishanteringsförmåga"

---

## Implementation Guidelines

### Performance
- Use system fonts fallback
- Subset web fonts for Swedish
- Preload critical fonts
- Avoid FOIT/FOUT

### Maintainability
- Use CSS custom properties
- Component-based approach
- Consistent naming
- Documentation

### Quality Checks
- Cross-browser testing
- Mobile device testing
- Screen reader testing
- Swedish content testing