# Typography Implementation Guide

**Component:** Typography System  
**Version:** 1.0  
**Complexity:** Low

---

## Step-by-Step Implementation

### Step 1: Create Base Typography Components

Start with the core typography components:

```jsx
// Typography.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styles from './Typography.module.css';

// Heading Component
export const Heading = ({
  level,
  variant = 'default',
  align = 'left',
  truncate = false,
  className = '',
  as,
  children,
  ...restProps
}) => {
  // Determine element to render
  const Tag = as || `h${level}`;
  
  // Build class names
  const headingClasses = [
    styles.heading,
    styles[`heading--h${level}`],
    variant === 'display' && styles['heading--display'],
    styles[`heading--align-${align}`],
    truncate && styles['heading--truncate'],
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={headingClasses} {...restProps}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
  variant: PropTypes.oneOf(['default', 'display']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  truncate: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired
};

// Body Component
export const Body = ({
  size = 'medium',
  weight = 'regular',
  variant = 'default',
  align = 'left',
  truncate = false,
  className = '',
  as = 'p',
  children,
  ...restProps
}) => {
  const Tag = as;
  
  const bodyClasses = [
    styles.body,
    styles[`body--${size}`],
    styles[`body--${weight}`],
    styles[`body--${variant}`],
    styles[`body--align-${align}`],
    truncate && styles['body--truncate'],
    className
  ].filter(Boolean).join(' ');

  return (
    <Tag className={bodyClasses} {...restProps}>
      {children}
    </Tag>
  );
};

Body.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  weight: PropTypes.oneOf(['regular', 'medium', 'semibold']),
  variant: PropTypes.oneOf(['default', 'secondary', 'error', 'success', 'warning']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  truncate: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired
};

// Caption Component
export const Caption = ({
  variant = 'default',
  uppercase = false,
  className = '',
  children,
  ...restProps
}) => {
  const captionClasses = [
    styles.caption,
    styles[`caption--${variant}`],
    uppercase && styles['caption--uppercase'],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={captionClasses} {...restProps}>
      {children}
    </span>
  );
};

Caption.propTypes = {
  variant: PropTypes.oneOf(['default', 'secondary', 'error', 'success', 'warning']),
  uppercase: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};
```

### Step 2: Create CSS Module

Implement the complete typography styles:

```css
/* Typography.module.css */

/* Base styles */
.heading,
.body,
.caption {
  margin: 0;
  padding: 0;
  font-family: var(--font-family-base);
  color: var(--color-text-primary);
}

/* Heading styles */
.heading {
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.heading--h1 {
  font-size: var(--font-size-h1);
  margin-top: var(--space-xl);
  margin-bottom: var(--space-l);
}

.heading--h2 {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  line-height: 1.3;
  letter-spacing: -0.01em;
  margin-top: var(--space-l);
  margin-bottom: var(--space-m);
}

.heading--h3 {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  letter-spacing: -0.01em;
  margin-top: var(--space-l);
  margin-bottom: var(--space-s);
}

.heading--h4 {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  margin-top: var(--space-m);
  margin-bottom: var(--space-xs);
}

.heading--h5 {
  font-size: var(--font-size-h5);
  font-weight: var(--font-weight-medium);
  line-height: 1.5;
  margin-top: var(--space-m);
  margin-bottom: var(--space-xs);
}

/* Display variant */
.heading--display {
  font-size: var(--font-size-display);
  letter-spacing: -0.03em;
}

/* Body styles */
.body {
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  margin-bottom: var(--space-m);
}

.body--small {
  font-size: var(--font-size-body-sm);
  line-height: 1.5;
}

.body--medium {
  font-size: var(--font-size-body);
}

.body--large {
  font-size: var(--font-size-body-lg);
}

/* Body weights */
.body--medium {
  font-weight: var(--font-weight-medium);
}

.body--semibold {
  font-weight: var(--font-weight-semibold);
}

/* Caption styles */
.caption {
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-regular);
  line-height: 1.4;
  letter-spacing: 0.02em;
}

.caption--uppercase {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Color variants */
.body--secondary,
.caption--secondary {
  color: var(--color-text-secondary);
}

.heading--error,
.body--error,
.caption--error {
  color: var(--color-text-error);
}

.heading--success,
.body--success,
.caption--success {
  color: var(--color-text-success);
}

.body--warning,
.caption--warning {
  color: var(--color-text-warning);
}

/* Alignment */
.heading--align-left,
.body--align-left {
  text-align: left;
}

.heading--align-center,
.body--align-center {
  text-align: center;
}

.heading--align-right,
.body--align-right {
  text-align: right;
}

/* Truncation */
.heading--truncate,
.body--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .heading--h1 {
    font-size: 32px;
    margin-top: var(--space-l);
    margin-bottom: var(--space-m);
  }
  
  .heading--h2 {
    font-size: 28px;
  }
  
  .heading--h3 {
    font-size: 22px;
  }
  
  .heading--h4 {
    font-size: 18px;
  }
  
  .heading--h5 {
    font-size: 16px;
  }
  
  .heading--display {
    font-size: 40px;
  }
  
  /* Tighter spacing on mobile */
  .body {
    margin-bottom: var(--space-s);
  }
}

/* Swedish language optimizations */
:lang(sv) .heading,
:lang(sv) .body,
:lang(sv) .caption {
  hyphens: auto;
  word-break: break-word;
}

/* Accessibility improvements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Dark mode support (future) */
@media (prefers-color-scheme: dark) {
  .heading,
  .body,
  .caption {
    color: var(--color-text-primary-dark);
  }
  
  .body--secondary,
  .caption--secondary {
    color: var(--color-text-secondary-dark);
  }
}

/* Print styles */
@media print {
  .heading,
  .body {
    color: #000;
  }
  
  .heading {
    page-break-after: avoid;
  }
  
  .body {
    orphans: 3;
    widows: 3;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .heading,
  .body,
  .caption {
    font-weight: 500;
  }
  
  .heading {
    font-weight: 700;
  }
}
```

### Step 3: Create CSS Variables

Define the design tokens:

```css
/* In global styles or theme file */
:root {
  /* Font sizes */
  --font-size-display: 48px;
  --font-size-h1: 40px;
  --font-size-h2: 32px;
  --font-size-h3: 24px;
  --font-size-h4: 20px;
  --font-size-h5: 18px;
  --font-size-body-lg: 18px;
  --font-size-body: 16px;
  --font-size-body-sm: 14px;
  --font-size-caption: 12px;
  
  /* Font weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Font families */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Roboto Mono', monospace;
}
```

### Step 4: Create Export File

Set up clean exports:

```javascript
// index.js
export { Heading, Body, Caption } from './Typography';
```

### Step 5: Usage Examples

Basic implementation patterns:

```jsx
// Page header
<header>
  <Heading level={1}>Framtidsbygget</Heading>
  <Body size="large" variant="secondary">
    En interaktiv upplevelse
  </Body>
</header>

// Card with typography
<Card>
  <Card.Header>
    <Heading level={3}>Uppdrag: Välfärd</Heading>
  </Card.Header>
  <Card.Content>
    <Body>
      Utforska välfärdssystemets komplexitet genom 
      interaktiva dialoger och beslut.
    </Body>
    <Caption variant="secondary">
      Uppskattad tid: 15 minuter
    </Caption>
  </Card.Content>
</Card>

// Form labels
<form>
  <label>
    <Body weight="medium" as="span">
      Användarnamn
    </Body>
    <input type="text" />
    <Caption variant="error">
      {error && error.message}
    </Caption>
  </label>
</form>
```

---

## Testing Implementation

Create comprehensive tests:

```javascript
// Typography.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heading, Body, Caption } from './Typography';

describe('Typography Components', () => {
  describe('Heading', () => {
    it('renders correct heading level', () => {
      const { container } = render(
        <Heading level={1}>Test Heading</Heading>
      );
      expect(container.querySelector('h1')).toBeInTheDocument();
    });
    
    it('applies display variant', () => {
      render(
        <Heading level={1} variant="display">
          Display Heading
        </Heading>
      );
      const heading = screen.getByText('Display Heading');
      expect(heading).toHaveClass('heading--display');
    });
    
    it('supports custom element', () => {
      const { container } = render(
        <Heading level={2} as="div">
          Div Heading
        </Heading>
      );
      expect(container.querySelector('div')).toBeInTheDocument();
    });
  });
  
  describe('Body', () => {
    it('renders with default props', () => {
      render(<Body>Test paragraph</Body>);
      const paragraph = screen.getByText('Test paragraph');
      expect(paragraph.tagName).toBe('P');
    });
    
    it('applies size variants', () => {
      render(<Body size="large">Large text</Body>);
      const text = screen.getByText('Large text');
      expect(text).toHaveClass('body--large');
    });
  });
  
  describe('Caption', () => {
    it('renders as span', () => {
      render(<Caption>Test caption</Caption>);
      const caption = screen.getByText('Test caption');
      expect(caption.tagName).toBe('SPAN');
    });
    
    it('applies uppercase modifier', () => {
      render(<Caption uppercase>Uppercase</Caption>);
      const caption = screen.getByText('Uppercase');
      expect(caption).toHaveClass('caption--uppercase');
    });
  });
});
```

---

## Common Implementation Pitfalls

1. **Skipping heading levels**
   - Always maintain proper hierarchy
   - Use `as` prop for visual changes

2. **Hardcoding font sizes**
   - Use CSS variables consistently
   - Avoid inline styles

3. **Missing responsive styles**
   - Test on mobile devices
   - Use fluid typography

4. **Poor contrast ratios**
   - Test all color combinations
   - Use automated tools

5. **Forgetting Swedish support**
   - Test with Swedish content
   - Enable proper hyphenation