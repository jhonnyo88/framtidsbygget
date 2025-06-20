# Button Integration Patterns

**Component:** Button  
**Purpose:** How to integrate Button in various contexts

---

## Import Pattern

Standard import for all uses:

```javascript
import Button from '@/components/common/Button';
// or
import { Button } from '@/components/common';
```

---

## Layout Patterns

### Button Groups

Horizontal button group with proper spacing:

```jsx
// ButtonGroup.jsx
const ButtonGroup = ({ children, align = 'right' }) => {
  return (
    <div className={`button-group button-group--${align}`}>
      {children}
    </div>
  );
};

// Usage
<ButtonGroup align="right">
  <Button variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
  <Button variant="primary" onClick={handleSave}>
    Save
  </Button>
</ButtonGroup>
```

CSS for button groups:

```css
.button-group {
  display: flex;
  gap: var(--space-m);
  flex-wrap: wrap;
}

.button-group--left {
  justify-content: flex-start;
}

.button-group--center {
  justify-content: center;
}

.button-group--right {
  justify-content: flex-end;
}

.button-group--space-between {
  justify-content: space-between;
}
```

### Modal Actions

Standard modal footer pattern:

```jsx
const ModalFooter = ({ onCancel, onConfirm, confirmText = 'Confirm' }) => {
  return (
    <footer className="modal__footer">
      <ButtonGroup align="right">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      </ButtonGroup>
    </footer>
  );
};
```

### Form Actions

Form submission pattern with loading state:

```jsx
const FormActions = ({ onSubmit, onReset, isSubmitting, isDirty }) => {
  return (
    <div className="form__actions">
      <Button
        variant="secondary"
        onClick={onReset}
        disabled={!isDirty || isSubmitting}
      >
        Reset
      </Button>
      <Button
        variant="primary"
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isDirty}
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
};
```

---

## State Management Patterns

### Loading State Wrapper

Higher-order component for loading states:

```jsx
const ButtonWithLoading = ({ loading, children, ...props }) => {
  return (
    <Button 
      {...props} 
      disabled={props.disabled || loading}
      aria-busy={loading}
    >
      {loading ? 'Loading...' : children}
    </Button>
  );
};

// Usage
<ButtonWithLoading 
  loading={isLoading} 
  variant="primary" 
  onClick={fetchData}
>
  Load Data
</ButtonWithLoading>
```

### Confirmation Pattern

Two-step confirmation for dangerous actions:

```jsx
const ConfirmButton = ({ onConfirm, children, confirmText = 'Are you sure?' }) => {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
    } else {
      onConfirm();
      setConfirming(false);
    }
  };

  return (
    <Button 
      variant={confirming ? 'danger' : 'secondary'}
      onClick={handleClick}
    >
      {confirming ? confirmText : children}
    </Button>
  );
};
```

---

## Navigation Patterns

### Router Integration

With React Router:

```jsx
import { useNavigate } from 'react-router-dom';

const NavigationButton = ({ to, children, ...props }) => {
  const navigate = useNavigate();
  
  return (
    <Button onClick={() => navigate(to)} {...props}>
      {children}
    </Button>
  );
};

// Usage
<NavigationButton to="/games/puzzle" variant="primary">
  Start Puzzle Game
</NavigationButton>
```

### Back Button Pattern

Consistent back navigation:

```jsx
const BackButton = ({ fallbackPath = '/' }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };
  
  return (
    <Button 
      variant="secondary" 
      icon="arrow_back" 
      onClick={handleBack}
    >
      Back
    </Button>
  );
};
```

---

## Responsive Patterns

### Mobile-First Button Stack

Responsive button layout:

```jsx
const ResponsiveButtonGroup = ({ children }) => {
  return (
    <div className="responsive-button-group">
      {children}
    </div>
  );
};
```

```css
.responsive-button-group {
  display: flex;
  gap: var(--space-m);
}

@media (max-width: 768px) {
  .responsive-button-group {
    flex-direction: column;
  }
  
  .responsive-button-group > * {
    width: 100%;
  }
}
```

### Floating Action Button

Mobile-specific pattern:

```jsx
const FloatingActionButton = ({ icon, onClick, ariaLabel }) => {
  return (
    <div className="fab-container">
      <Button
        variant="primary"
        icon={icon}
        onClick={onClick}
        aria-label={ariaLabel}
        className="fab"
      />
    </div>
  );
};
```

```css
.fab-container {
  position: fixed;
  bottom: var(--space-l);
  right: var(--space-l);
  z-index: 1000;
}

.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

---

## Accessibility Patterns

### Keyboard Navigation

Button group with arrow key navigation:

```jsx
const AccessibleButtonGroup = ({ children }) => {
  const buttonsRef = useRef([]);
  const [focusIndex, setFocusIndex] = useState(0);

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % children.length;
      buttonsRef.current[nextIndex]?.focus();
      setFocusIndex(nextIndex);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + children.length) % children.length;
      buttonsRef.current[prevIndex]?.focus();
      setFocusIndex(prevIndex);
    }
  };

  return (
    <div role="group" className="button-group">
      {React.Children.map(children, (child, index) => 
        React.cloneElement(child, {
          ref: el => buttonsRef.current[index] = el,
          onKeyDown: e => handleKeyDown(e, index),
          tabIndex: index === focusIndex ? 0 : -1
        })
      )}
    </div>
  );
};
```

### Loading Announcement

Screen reader friendly loading:

```jsx
const AccessibleLoadingButton = ({ onClick, children }) => {
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const handleClick = async () => {
    setLoading(true);
    setAnnouncement('Loading, please wait...');
    
    try {
      await onClick();
      setAnnouncement('Action completed successfully');
    } catch (error) {
      setAnnouncement('Action failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        disabled={loading}
        aria-busy={loading}
      >
        {loading ? 'Loading...' : children}
      </Button>
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </>
  );
};
```

---

## Performance Patterns

### Memoized Button

For lists and frequent re-renders:

```jsx
const MemoizedButton = React.memo(Button, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.children === nextProps.children &&
    prevProps.variant === nextProps.variant &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.onClick === nextProps.onClick
  );
});

// Usage in list
{items.map(item => (
  <MemoizedButton
    key={item.id}
    onClick={() => handleItemClick(item.id)}
  >
    {item.name}
  </MemoizedButton>
))}
```

### Debounced Click Handler

Prevent double-clicks:

```jsx
const useDebouncedClick = (callback, delay = 300) => {
  const [isDebouncing, setIsDebouncing] = useState(false);

  const debouncedCallback = useCallback((...args) => {
    if (!isDebouncing) {
      setIsDebouncing(true);
      callback(...args);
      setTimeout(() => setIsDebouncing(false), delay);
    }
  }, [callback, delay, isDebouncing]);

  return [debouncedCallback, isDebouncing];
};

// Usage
const SaveButton = () => {
  const [handleSave, isSaving] = useDebouncedClick(async () => {
    await saveData();
  }, 1000);

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? 'Saving...' : 'Save'}
    </Button>
  );
};
```