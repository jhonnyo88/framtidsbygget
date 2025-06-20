# Card Integration Patterns

**Component:** Card  
**Purpose:** How to integrate Card in various contexts

---

## Import Pattern

Standard import for all uses:

```javascript
import Card from '@/components/common/Card';
// or with subcomponents
import Card, { CardHeader, CardContent, CardFooter } from '@/components/common/Card';
```

---

## Layout Patterns

### Card Grid System

Responsive grid for multiple cards:

```jsx
// CardGrid.jsx
const CardGrid = ({ children, columns = 'auto' }) => {
  const gridClasses = [
    'card-grid',
    `card-grid--${columns}`
  ].join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Usage
<CardGrid columns="3">
  {items.map(item => (
    <Card key={item.id} variant="elevated">
      <Card.Content>{item.content}</Card.Content>
    </Card>
  ))}
</CardGrid>
```

CSS for grid system:

```css
.card-grid {
  display: grid;
  gap: var(--space-l);
}

.card-grid--auto {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.card-grid--2 {
  grid-template-columns: repeat(2, 1fr);
}

.card-grid--3 {
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 768px) {
  .card-grid--2,
  .card-grid--3 {
    grid-template-columns: 1fr;
  }
}
```

### Card Stack Pattern

Vertical card arrangement:

```jsx
// CardStack.jsx
const CardStack = ({ children, spacing = 'medium' }) => {
  return (
    <div className={`card-stack card-stack--${spacing}`}>
      {children}
    </div>
  );
};
```

```css
.card-stack {
  display: flex;
  flex-direction: column;
}

.card-stack--small { gap: var(--space-s); }
.card-stack--medium { gap: var(--space-m); }
.card-stack--large { gap: var(--space-l); }
```

### Carousel Pattern

Horizontal scrolling cards:

```jsx
// CardCarousel.jsx
const CardCarousel = ({ cards }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="card-carousel">
      <button 
        className="carousel-control carousel-control--left"
        onClick={() => scroll('left')}
        aria-label="Scroll left"
      >
        <Icon name="chevron_left" />
      </button>
      
      <div className="card-carousel__track" ref={scrollRef}>
        {cards.map(card => (
          <Card key={card.id} variant="elevated" className="carousel-card">
            {card.content}
          </Card>
        ))}
      </div>
      
      <button 
        className="carousel-control carousel-control--right"
        onClick={() => scroll('right')}
        aria-label="Scroll right"
      >
        <Icon name="chevron_right" />
      </button>
    </div>
  );
};
```

---

## State Management Patterns

### Expandable Card

Cards that reveal more content:

```jsx
const ExpandableCard = ({ title, preview, fullContent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card variant="outlined">
      <Card.Header>
        <h3>{title}</h3>
        <Button
          variant="secondary"
          size="small"
          icon={isExpanded ? 'expand_less' : 'expand_more'}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        />
      </Card.Header>
      <Card.Content>
        {isExpanded ? fullContent : preview}
      </Card.Content>
    </Card>
  );
};
```

### Selectable Cards

Multi-select pattern:

```jsx
const SelectableCardList = ({ items, onSelectionChange }) => {
  const [selected, setSelected] = useState(new Set());

  const toggleSelection = (itemId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelected(newSelected);
    onSelectionChange(Array.from(newSelected));
  };

  return (
    <div className="selectable-card-list">
      {items.map(item => (
        <Card
          key={item.id}
          variant={selected.has(item.id) ? 'elevated' : 'outlined'}
          interactive
          onClick={() => toggleSelection(item.id)}
          className={selected.has(item.id) ? 'card--selected' : ''}
          role="checkbox"
          aria-checked={selected.has(item.id)}
        >
          <Card.Content>
            <div className="selectable-content">
              <Checkbox checked={selected.has(item.id)} />
              {item.content}
            </div>
          </Card.Content>
        </Card>
      ))}
    </div>
  );
};
```

### Loading State Pattern

Skeleton cards while loading:

```jsx
const CardWithLoading = ({ isLoading, children, ...props }) => {
  if (isLoading) {
    return (
      <Card {...props} className="card--loading">
        <Card.Header>
          <Skeleton width="60%" height={24} />
        </Card.Header>
        <Card.Content>
          <Skeleton count={3} />
        </Card.Content>
      </Card>
    );
  }

  return <Card {...props}>{children}</Card>;
};
```

---

## Animation Patterns

### Flip Card

Card that flips to reveal back:

```jsx
const FlipCard = ({ front, back }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flip-card--flipped' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card__inner">
        <div className="flip-card__front">
          <Card variant="elevated">
            {front}
          </Card>
        </div>
        <div className="flip-card__back">
          <Card variant="elevated">
            {back}
          </Card>
        </div>
      </div>
    </div>
  );
};
```

```css
.flip-card {
  perspective: 1000px;
  cursor: pointer;
}

.flip-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card--flipped .flip-card__inner {
  transform: rotateY(180deg);
}

.flip-card__front,
.flip-card__back {
  position: absolute;
  width: 100%;
  backface-visibility: hidden;
}

.flip-card__back {
  transform: rotateY(180deg);
}
```

### Stagger Animation

Animate cards in sequence:

```jsx
const StaggeredCards = ({ cards }) => {
  return (
    <div className="staggered-cards">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          variant="elevated"
          className="staggered-card"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {card.content}
        </Card>
      ))}
    </div>
  );
};
```

```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.staggered-card {
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
}
```

---

## Responsive Patterns

### Adaptive Card Layout

Different layouts for different screens:

```jsx
const AdaptiveCard = ({ data }) => {
  const [isMobile] = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <Card variant="flat" fullWidth>
        <Card.Content>
          <div className="mobile-layout">
            {/* Simplified mobile content */}
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <Card.Header>{data.title}</Card.Header>
      <Card.Content>
        <div className="desktop-layout">
          {/* Full desktop content */}
        </div>
      </Card.Content>
      <Card.Footer>{/* Desktop actions */}</Card.Footer>
    </Card>
  );
};
```

### Collapsible Card Grid

Responsive grid that collapses:

```jsx
const CollapsibleCardGrid = ({ cards, collapsedCount = 3 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCards = isExpanded ? cards : cards.slice(0, collapsedCount);

  return (
    <div className="collapsible-grid">
      <CardGrid>
        {displayCards.map(card => (
          <Card key={card.id} variant="outlined">
            {card.content}
          </Card>
        ))}
      </CardGrid>
      
      {cards.length > collapsedCount && (
        <Button
          variant="secondary"
          fullWidth
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : `Show ${cards.length - collapsedCount} More`}
        </Button>
      )}
    </div>
  );
};
```

---

## Performance Patterns

### Virtualized Card List

For large lists of cards:

```jsx
import { FixedSizeList } from 'react-window';

const VirtualizedCardList = ({ cards }) => {
  const CardRenderer = ({ index, style }) => (
    <div style={style}>
      <Card variant="flat" className="virtual-card">
        <Card.Content>
          {cards[index].content}
        </Card.Content>
      </Card>
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={cards.length}
      itemSize={200}
      width="100%"
    >
      {CardRenderer}
    </FixedSizeList>
  );
};
```

### Lazy Loading Cards

Load cards as needed:

```jsx
const LazyCard = ({ loadContent, placeholder }) => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !content) {
          setIsLoading(true);
          const loaded = await loadContent();
          setContent(loaded);
          setIsLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [content, loadContent]);

  return (
    <div ref={cardRef}>
      <CardWithLoading isLoading={isLoading}>
        {content || placeholder}
      </CardWithLoading>
    </div>
  );
};
```

---

## Accessibility Patterns

### Keyboard Navigable Card Grid

Cards with proper keyboard support:

```jsx
const KeyboardNavigableGrid = ({ cards }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef(null);

  const handleKeyDown = (e) => {
    const columns = 3; // Adjust based on your grid
    let newIndex = focusedIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(focusedIndex + 1, cards.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(focusedIndex - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(focusedIndex + columns, cards.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(focusedIndex - columns, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    setFocusedIndex(newIndex);
    
    // Focus the card
    const cards = gridRef.current.querySelectorAll('[role="button"]');
    cards[newIndex]?.focus();
  };

  return (
    <div 
      ref={gridRef}
      className="keyboard-grid"
      onKeyDown={handleKeyDown}
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          variant="outlined"
          interactive
          tabIndex={index === focusedIndex ? 0 : -1}
          onClick={() => card.onClick()}
        >
          {card.content}
        </Card>
      ))}
    </div>
  );
};
```

### Screen Reader Friendly Cards

Proper ARIA labels and structure:

```jsx
const AccessibleCard = ({ title, description, actions, metadata }) => {
  return (
    <Card variant="elevated" as="article" aria-labelledby={`card-title-${title}`}>
      <Card.Header>
        <h3 id={`card-title-${title}`}>{title}</h3>
        {metadata && (
          <span className="sr-only">
            {`Published ${metadata.date} by ${metadata.author}`}
          </span>
        )}
      </Card.Header>
      <Card.Content>
        <p>{description}</p>
      </Card.Content>
      {actions && (
        <Card.Footer>
          <nav aria-label="Card actions">
            {actions}
          </nav>
        </Card.Footer>
      )}
    </Card>
  );
};
```