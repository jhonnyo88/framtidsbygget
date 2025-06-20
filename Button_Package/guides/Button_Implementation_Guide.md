# Button Implementation Guide

**Component:** Button  
**Version:** 1.0  
**Complexity:** Low

---

## Step-by-Step Implementation

### Step 1: Create Component Structure

Create the base Button component with TypeScript/PropTypes:

```jsx
// Button.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  onClick,
  ...restProps
}) => {
  // Component implementation
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func
};

export default Button;
```

### Step 2: Build Class Name Logic

Implement dynamic class assignment:

```jsx
const Button = ({ /* props */ }) => {
  // Build class names based on props
  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    fullWidth && styles['button--full-width'],
    disabled && styles['button--disabled'],
    !children && icon && styles['button--icon-only'],
    className
  ].filter(Boolean).join(' ');

  // Check if we have icon-only button
  const isIconOnly = !children && icon;

  return (
    // Button JSX
  );
};
```

### Step 3: Implement Icon Support

Add Material Symbols icon rendering:

```jsx
const renderIcon = () => {
  if (!icon) return null;
  
  const iconClasses = [
    'material-symbols-outlined',
    styles.button__icon,
    children && iconPosition === 'left' && styles['button__icon--left'],
    children && iconPosition === 'right' && styles['button__icon--right']
  ].filter(Boolean).join(' ');

  return <span className={iconClasses}>{icon}</span>;
};
```

### Step 4: Complete Button Render

Combine all elements:

```jsx
const Button = ({ /* props */ }) => {
  // ... previous code ...

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      aria-label={isIconOnly ? `${icon} button` : undefined}
      {...restProps}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span className={styles.button__text}>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};
```

### Step 5: Create CSS Module

Implement complete styling:

```css
/* Button.module.css */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');

/* Base button styles */
.button {
  /* Resets */
  appearance: none;
  border: none;
  background: none;
  margin: 0;
  
  /* Layout */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-s);
  
  /* Sizing */
  padding: var(--space-s) var(--space-l);
  border-radius: var(--space-s);
  
  /* Typography */
  font-family: var(--font-family-base);
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Focus styles for accessibility */
.button:focus-visible {
  outline: 2px solid var(--color-brand-primary);
  outline-offset: 2px;
}

/* Prevent text selection on double-click */
.button__text {
  pointer-events: none;
}

/* Icon styles */
.button__icon {
  font-family: 'Material Symbols Outlined';
  font-size: 1.2em;
  line-height: 1;
  font-weight: normal;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Variants - Primary */
.button--primary {
  background-color: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}

.button--primary:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.button--primary:active:not(:disabled) {
  filter: brightness(0.9);
  transform: scale(0.98);
}

/* Variants - Secondary */
.button--secondary {
  background-color: transparent;
  color: var(--color-brand-primary);
  box-shadow: inset 0 0 0 2px var(--color-brand-primary);
}

.button--secondary:hover:not(:disabled) {
  background-color: var(--color-brand-primary);
  color: var(--color-text-on-primary);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.button--secondary:active:not(:disabled) {
  filter: brightness(0.9);
  transform: scale(0.98);
}

/* Variants - Danger */
.button--danger {
  background-color: var(--color-state-danger);
  color: var(--color-text-on-primary);
}

.button--danger:hover:not(:disabled) {
  filter: brightness(1.1);
  box-shadow: 0px 4px 12px rgba(198, 40, 40, 0.2);
}

.button--danger:active:not(:disabled) {
  filter: brightness(0.9);
  transform: scale(0.98);
}

/* Sizes */
.button--small {
  padding: var(--space-xs) var(--space-m);
  font-size: 0.875rem;
  border-radius: 6px;
}

.button--large {
  padding: var(--space-m) var(--space-xl);
  font-size: 1.125rem;
  border-radius: 12px;
}

/* States - Disabled */
.button:disabled {
  background-color: #BDBDBD;
  color: #757575;
  cursor: not-allowed;
  box-shadow: none;
}

.button--secondary:disabled {
  background-color: transparent;
  box-shadow: inset 0 0 0 2px #BDBDBD;
}

/* Modifiers */
.button--full-width {
  width: 100%;
}

.button--icon-only {
  padding: var(--space-s);
  aspect-ratio: 1;
}

.button--icon-only.button--small {
  width: 32px;
  height: 32px;
  padding: 0;
}

.button--icon-only.button--medium {
  width: 40px;
  height: 40px;
  padding: 0;
}

.button--icon-only.button--large {
  width: 48px;
  height: 48px;
  padding: 0;
}

/* Icon positioning */
.button__icon--left {
  margin-right: var(--space-xs);
}

.button__icon--right {
  margin-left: var(--space-xs);
  order: 1;
}

/* Mobile considerations */
@media (max-width: 768px) {
  .button {
    min-height: 44px; /* Touch target */
  }
}
```

### Step 6: Export Component

Create index file for clean imports:

```javascript
// index.js
export { default } from './Button';
```

### Step 7: Usage Examples

Basic usage patterns:

```jsx
// Primary button
<Button onClick={handleClick}>
  Click Me
</Button>

// Secondary with icon
<Button variant="secondary" icon="explore">
  Open Compass
</Button>

// Large danger button
<Button variant="danger" size="large" onClick={handleDelete}>
  Delete Progress
</Button>

// Icon-only button
<Button 
  icon="settings" 
  variant="secondary"
  aria-label="Open settings"
  onClick={openSettings}
/>

// Full width on mobile
<Button fullWidth variant="primary" size="large">
  Continue
</Button>

// Disabled state
<Button disabled onClick={handleSave}>
  Save (Disabled)
</Button>
```

---

## Testing Implementation

Create comprehensive tests:

```javascript
// Button.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with text content', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--primary');
    
    rerender(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');
  });

  it('disables interaction when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders icon when provided', () => {
    render(<Button icon="explore">With Icon</Button>);
    expect(screen.getByText('explore')).toHaveClass('material-symbols-outlined');
  });

  it('handles icon-only buttons with aria-label', () => {
    render(<Button icon="settings" />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'settings button');
  });
});
```

---

## Common Implementation Mistakes

1. **Forgetting aria-label for icon-only buttons**
   - Always provide accessible labels

2. **Not preventing event propagation on disabled**
   - Use pointer-events: none in CSS

3. **Missing keyboard navigation support**
   - Ensure focus states are visible

4. **Incorrect icon font loading**
   - Import Material Symbols in global CSS

5. **Not handling all prop combinations**
   - Test variant + size + state combinations