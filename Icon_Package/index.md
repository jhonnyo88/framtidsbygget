# Icon Component Package

**Package ID:** DS-004  
**Component:** Icon System  
**Status:** Complete  
**Token Count:** ~7,500 tokens

---

## Package Contents

### Specifications
- `/specs/Icon_System_Spec.md` - Icon system design and usage guidelines
- `/specs/Icon_Library.md` - Available icons and categories

### Implementation Guides
- `/guides/Icon_Implementation.md` - Component implementation guide
- `/guides/Icon_Usage_Patterns.md` - Common icon patterns

### Reference Implementation
- `/reference/Icon.jsx` - Icon component with Material Symbols
- `/reference/Icon.module.css` - Icon styling and animations

---

## Quick Start

```jsx
import Icon from '@/components/common/Icon';

// Basic icon
<Icon name="home" />

// Sized icon
<Icon name="settings" size="large" />

// Colored icon
<Icon name="error" color="danger" />

// Interactive icon button
<Icon name="close" interactive onClick={handleClose} />

// Animated icon
<Icon name="refresh" spinning />
```

---

## Key Features

- **Material Symbols Integration**: 2000+ icons from Google
- **Multiple Sizes**: small (16px) to xlarge (48px)
- **Semantic Colors**: Matches design system color palette
- **Interactive States**: Hover, focus, and click feedback
- **Animations**: Spin, pulse, and custom animations
- **Accessibility**: Proper ARIA labels and roles

---

## Icon Categories

### Navigation
- `home`, `arrow_back`, `arrow_forward`, `menu`, `close`
- `expand_more`, `expand_less`, `chevron_left`, `chevron_right`

### Game Actions
- `play_arrow`, `pause`, `stop`, `replay`, `skip_next`
- `emoji_events` (trophy), `stars`, `flag`

### UI Controls
- `settings`, `search`, `filter_list`, `sort`
- `add`, `remove`, `edit`, `delete`, `save`

### Status
- `check_circle`, `error`, `warning`, `info`
- `pending`, `schedule`, `update`

### Social
- `person`, `group`, `share`, `thumb_up`
- `chat_bubble`, `notifications`

---

## Dependencies

### Internal Dependencies
- Design System colors and spacing
- CSS variables for theming

### External Dependencies
- React 18+
- Material Symbols font
- CSS Modules
- PropTypes

---

## API Overview

```jsx
<Icon
  name="icon_name"        // Material Symbol name
  size="medium"           // small | medium | large | xlarge
  color="default"         // default | primary | secondary | success | error | warning
  interactive={false}     // Enable hover/click states
  spinning={false}        // Spin animation
  pulse={false}          // Pulse animation
  className=""           // Additional CSS classes
  onClick={function}     // Click handler (makes interactive)
  ariaLabel=""          // Custom accessibility label
/>
```

### Props
- `name` (required): Material Symbols icon name
- `size`: Icon size variant
- `color`: Semantic color from design system
- `interactive`: Enable interactive states
- `spinning`: Continuous rotation animation
- `pulse`: Pulsing scale animation
- `onClick`: Click handler
- `ariaLabel`: Override default accessibility label

---

## Size Scale

| Size | Pixels | Usage |
|------|--------|-------|
| small | 16px | Inline text, compact UI |
| medium | 24px | Default, buttons, cards |
| large | 32px | Headers, primary actions |
| xlarge | 48px | Hero sections, empty states |

---

## Implementation Phases

### Phase 1: Core Component
- Basic icon rendering
- Size variants
- Material Symbols integration

### Phase 2: Interactivity
- Click handlers
- Hover states
- Focus management

### Phase 3: Animations
- Spin animation
- Pulse animation
- Custom keyframes

---

## Best Practices

### Icon Selection
- Use filled variants for primary actions
- Use outlined variants for secondary UI
- Maintain consistent style throughout

### Accessibility
- Always provide aria-label for icon-only buttons
- Use descriptive labels, not just icon names
- Hide decorative icons from screen readers

### Performance
- Load Material Symbols font efficiently
- Use CSS animations over JavaScript
- Minimize icon font subset if possible

---

## Related Components

- **Button**: Integrates icons for actions
- **Navigation**: Uses icons for menu items
- **Card**: Icons in headers and actions
- **Form**: Icons for input feedback