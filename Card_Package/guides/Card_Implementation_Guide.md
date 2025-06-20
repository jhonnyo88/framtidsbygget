# Card Implementation Guide

**Component:** Card  
**Version:** 1.0  
**Complexity:** Medium

---

## Step-by-Step Implementation

### Step 1: Create Base Card Component

Start with the main Card component structure:

```jsx
// Card.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'flat',
  interactive = false,
  disabled = false,
  className = '',
  onClick,
  as: Component = 'div',
  ...restProps
}) => {
  // Build dynamic classes
  const cardClasses = [
    styles.card,
    styles[`card--${variant}`],
    interactive && styles['card--interactive'],
    disabled && styles['card--disabled'],
    onClick && !disabled && styles['card--clickable'],
    className
  ].filter(Boolean).join(' ');

  // Handle click events
  const handleClick = (e) => {
    if (!disabled && onClick) {
      onClick(e);
    }
  };

  return (
    <Component
      className={cardClasses}
      onClick={handleClick}
      tabIndex={onClick && !disabled ? 0 : undefined}
      role={onClick && !disabled ? 'button' : undefined}
      aria-disabled={disabled}
      {...restProps}
    >
      {children}
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['flat', 'elevated', 'outlined']),
  interactive: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  as: PropTypes.elementType
};

export default Card;
```

### Step 2: Create Subcomponents

Implement Header, Content, and Footer subcomponents:

```jsx
// CardSubcomponents.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.module.css';

// Card Header Component
export const CardHeader = ({ children, className = '', ...props }) => {
  const headerClasses = [styles.card__header, className]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClasses} {...props}>
      {children}
    </header>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Card Content Component
export const CardContent = ({ children, className = '', ...props }) => {
  const contentClasses = [styles.card__content, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={contentClasses} {...props}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

// Card Footer Component
export const CardFooter = ({ children, className = '', align = 'right', ...props }) => {
  const footerClasses = [
    styles.card__footer,
    styles[`card__footer--${align}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <footer className={footerClasses} {...props}>
      {children}
    </footer>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'space-between'])
};
```

### Step 3: Attach Subcomponents to Card

Connect subcomponents as static properties:

```jsx
// In Card.jsx, after the Card component definition
import { CardHeader, CardContent, CardFooter } from './CardSubcomponents';

// Attach subcomponents
Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
```

### Step 4: Create CSS Module

Implement complete styling with all variants:

```css
/* Card.module.css */

/* Base card styles */
.card {
  /* Layout */
  display: flex;
  flex-direction: column;
  position: relative;
  
  /* Dimensions */
  min-width: 280px;
  min-height: min-content;
  width: 100%;
  
  /* Visual */
  background-color: var(--color-surface-primary);
  border-radius: var(--space-m);
  overflow: hidden;
  
  /* Animation */
  transition: all 0.2s ease-in-out;
}

/* Variant: Flat (default) */
.card--flat {
  /* No additional styles needed for flat */
}

/* Variant: Elevated */
.card--elevated {
  box-shadow: var(--shadow-medium);
}

.card--elevated:hover:not(.card--disabled) {
  box-shadow: var(--shadow-large);
  transform: translateY(-2px);
}

/* Variant: Outlined */
.card--outlined {
  border: 1px solid var(--color-border-subtle);
}

.card--outlined:hover:not(.card--disabled) {
  border-color: var(--color-border-default);
}

/* Interactive states */
.card--interactive {
  cursor: pointer;
  user-select: none;
}

.card--interactive:hover:not(.card--disabled) {
  background-color: var(--color-surface-hover);
}

.card--interactive:active:not(.card--disabled) {
  transform: scale(0.98);
}

/* Clickable cards (with onClick) */
.card--clickable {
  cursor: pointer;
}

.card--clickable:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}

/* Disabled state */
.card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

/* Card sections */
.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-m) var(--space-l);
  border-bottom: 1px solid var(--color-border-subtle);
  min-height: 56px;
}

.card__content {
  flex: 1;
  padding: var(--space-l);
}

.card__footer {
  display: flex;
  align-items: center;
  padding: var(--space-m) var(--space-l);
  border-top: 1px solid var(--color-border-subtle);
  min-height: 56px;
  gap: var(--space-m);
}

/* Footer alignment */
.card__footer--left {
  justify-content: flex-start;
}

.card__footer--center {
  justify-content: center;
}

.card__footer--right {
  justify-content: flex-end;
}

.card__footer--space-between {
  justify-content: space-between;
}

/* Remove borders for seamless look */
.card--flat .card__header,
.card--flat .card__footer {
  border-color: transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    min-width: 100%;
  }
  
  .card__header,
  .card__footer {
    padding: var(--space-m);
  }
  
  .card__content {
    padding: var(--space-m);
  }
  
  /* Stack footer items on mobile */
  .card__footer {
    flex-wrap: wrap;
  }
}

/* Animation for card entrance */
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

.card {
  animation: cardFadeIn 0.3s ease-out;
}

/* Loading state styles */
.card--loading .card__content {
  position: relative;
  min-height: 120px;
}

.card--loading .card__content::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Special card types */
.card--error {
  border-color: var(--color-state-danger);
}

.card--success {
  border-color: var(--color-state-success);
}

.card--warning {
  border-color: var(--color-state-warning);
}

/* Content overflow handling */
.card__content--scrollable {
  max-height: 400px;
  overflow-y: auto;
}

/* Print styles */
@media print {
  .card {
    box-shadow: none;
    border: 1px solid #000;
    break-inside: avoid;
  }
}
```

### Step 5: Create Index Export

Set up clean exports:

```javascript
// index.js
export { default } from './Card';
export { CardHeader, CardContent, CardFooter } from './CardSubcomponents';
```

### Step 6: Usage Examples

Basic implementation patterns:

```jsx
// Simple card
<Card>
  <Card.Content>
    <p>Simple card content</p>
  </Card.Content>
</Card>

// Full-featured card
<Card variant="elevated" interactive onClick={handleCardClick}>
  <Card.Header>
    <h3>Card Title</h3>
    <IconButton icon="more_vert" />
  </Card.Header>
  <Card.Content>
    <p>Card content goes here...</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Confirm</Button>
  </Card.Footer>
</Card>

// Custom styling
<Card className="custom-card" variant="outlined">
  <Card.Content>
    <div className="custom-content">
      {/* Custom content */}
    </div>
  </Card.Content>
</Card>
```

---

## Testing Implementation

Create comprehensive tests:

```javascript
// Card.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  it('renders with content', () => {
    render(
      <Card>
        <Card.Content>Test content</Card.Content>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies variant classes', () => {
    const { rerender, container } = render(
      <Card variant="elevated">
        <Card.Content>Content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toHaveClass('card--elevated');
    
    rerender(
      <Card variant="outlined">
        <Card.Content>Content</Card.Content>
      </Card>
    );
    expect(container.firstChild).toHaveClass('card--outlined');
  });

  it('handles click events when interactive', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick}>
        <Card.Content>Clickable</Card.Content>
      </Card>
    );
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('prevents clicks when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Card onClick={handleClick} disabled>
        <Card.Content>Disabled</Card.Content>
      </Card>
    );
    
    fireEvent.click(screen.getByText('Disabled').parentElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders all subcomponents correctly', () => {
    render(
      <Card>
        <Card.Header>Header</Card.Header>
        <Card.Content>Content</Card.Content>
        <Card.Footer>Footer</Card.Footer>
      </Card>
    );
    
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('supports custom component types', () => {
    render(
      <Card as="article">
        <Card.Content>Article card</Card.Content>
      </Card>
    );
    
    expect(screen.getByText('Article card').parentElement.parentElement.tagName)
      .toBe('ARTICLE');
  });
});
```

---

## Common Implementation Pitfalls

1. **Forgetting keyboard navigation**
   - Add tabIndex and role for clickable cards
   - Handle Enter/Space key events

2. **Missing ARIA attributes**
   - Add aria-disabled for disabled state
   - Use proper roles for interactive cards

3. **Not handling edge cases**
   - Empty content states
   - Very long content overflow
   - Missing subcomponents

4. **Performance issues**
   - Not memoizing in lists
   - Heavy re-renders on hover
   - Missing CSS containment

5. **Responsive problems**
   - Fixed widths on mobile
   - Touch targets too small
   - Content overflow issues