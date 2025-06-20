# Typography Patterns

**Component:** Typography System  
**Purpose:** Common patterns and best practices

---

## Content Structure Patterns

### Page Header Pattern
Standard page header with subtitle

```jsx
const PageHeader = ({ title, subtitle, actions }) => {
  return (
    <header className="page-header">
      <div className="page-header__content">
        <Heading level={1}>{title}</Heading>
        {subtitle && (
          <Body size="large" variant="secondary">
            {subtitle}
          </Body>
        )}
      </div>
      {actions && (
        <div className="page-header__actions">
          {actions}
        </div>
      )}
    </header>
  );
};

// Usage
<PageHeader
  title="Dina Uppdrag"
  subtitle="Välj ett uppdrag för att fortsätta"
  actions={<Button variant="primary">Nytt Uppdrag</Button>}
/>
```

### Section Header Pattern
Consistent section headers throughout app

```jsx
const SectionHeader = ({ title, description, level = 2 }) => {
  return (
    <div className="section-header">
      <Heading level={level}>{title}</Heading>
      {description && (
        <Body variant="secondary">{description}</Body>
      )}
    </div>
  );
};
```

### Article Pattern
Long-form content structure

```jsx
const Article = ({ title, metadata, content }) => {
  return (
    <article className="article">
      <header className="article__header">
        <Heading level={1}>{title}</Heading>
        <div className="article__meta">
          <Caption>{metadata.author}</Caption>
          <Caption>·</Caption>
          <Caption>{metadata.date}</Caption>
          <Caption>·</Caption>
          <Caption>{metadata.readTime} min läsning</Caption>
        </div>
      </header>
      
      <div className="article__content">
        {content}
      </div>
    </article>
  );
};
```

---

## List Patterns

### Definition List Pattern
For game stats and specifications

```jsx
const DefinitionList = ({ items }) => {
  return (
    <dl className="definition-list">
      {items.map(({ term, definition }) => (
        <div key={term} className="definition-item">
          <dt>
            <Body weight="medium" as="span">
              {term}
            </Body>
          </dt>
          <dd>
            <Body variant="secondary" as="span">
              {definition}
            </Body>
          </dd>
        </div>
      ))}
    </dl>
  );
};

// Usage
<DefinitionList
  items={[
    { term: "Svårighetsgrad", definition: "Medel" },
    { term: "Uppskattad tid", definition: "15-20 minuter" },
    { term: "Poäng", definition: "100-500" }
  ]}
/>
```

### Ordered List Pattern
Step-by-step instructions

```jsx
const StepList = ({ steps }) => {
  return (
    <ol className="step-list">
      {steps.map((step, index) => (
        <li key={index} className="step-item">
          <Body weight="semibold" as="span">
            Steg {index + 1}: {step.title}
          </Body>
          <Body size="small">{step.description}</Body>
        </li>
      ))}
    </ol>
  );
};
```

---

## Form Typography Patterns

### Form Field Pattern
Consistent form field labeling

```jsx
const FormField = ({ 
  label, 
  required, 
  error, 
  help, 
  children 
}) => {
  return (
    <div className="form-field">
      <label className="form-field__label">
        <Body weight="medium" as="span">
          {label}
          {required && (
            <Caption variant="error" as="span"> *</Caption>
          )}
        </Body>
      </label>
      
      {children}
      
      {help && !error && (
        <Caption variant="secondary" className="form-field__help">
          {help}
        </Caption>
      )}
      
      {error && (
        <Caption variant="error" role="alert" className="form-field__error">
          {error}
        </Caption>
      )}
    </div>
  );
};
```

### Form Section Pattern
Grouped form fields

```jsx
const FormSection = ({ title, description, children }) => {
  return (
    <fieldset className="form-section">
      <legend>
        <Heading level={4} as="span">{title}</Heading>
        {description && (
          <Body size="small" variant="secondary">
            {description}
          </Body>
        )}
      </legend>
      {children}
    </fieldset>
  );
};
```

---

## Status & Feedback Patterns

### Status Message Pattern
Inline status messages

```jsx
const StatusMessage = ({ type, title, message }) => {
  return (
    <div className={`status-message status-message--${type}`} role="status">
      <Body weight="semibold" variant={type}>
        {title}
      </Body>
      {message && (
        <Body size="small" variant={type}>
          {message}
        </Body>
      )}
    </div>
  );
};

// Usage
<StatusMessage
  type="success"
  title="Ändringar sparade"
  message="Dina inställningar har uppdaterats"
/>
```

### Loading State Pattern
Loading indicators with text

```jsx
const LoadingState = ({ message = "Laddar..." }) => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <Body variant="secondary">{message}</Body>
    </div>
  );
};
```

---

## Card Content Patterns

### Stat Card Pattern
Display metrics and statistics

```jsx
const StatCard = ({ label, value, change, trend }) => {
  return (
    <Card variant="flat" className="stat-card">
      <Card.Content>
        <Caption uppercase variant="secondary">
          {label}
        </Caption>
        <Heading level={3}>{value}</Heading>
        {change && (
          <Caption variant={trend === 'up' ? 'success' : 'error'}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </Caption>
        )}
      </Card.Content>
    </Card>
  );
};
```

### Info Card Pattern
Information display cards

```jsx
const InfoCard = ({ icon, title, description, link }) => {
  return (
    <Card variant="outlined" interactive>
      <Card.Content>
        <div className="info-card__header">
          {icon && <Icon name={icon} />}
          <Heading level={4}>{title}</Heading>
        </div>
        <Body size="small" variant="secondary">
          {description}
        </Body>
        {link && (
          <Caption>
            <a href={link.href}>{link.text} →</a>
          </Caption>
        )}
      </Card.Content>
    </Card>
  );
};
```

---

## Navigation Patterns

### Breadcrumb Pattern
Navigation breadcrumbs

```jsx
const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Caption as="div">
        {items.map((item, index) => (
          <React.Fragment key={item.label}>
            {index > 0 && <span> / </span>}
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </Caption>
    </nav>
  );
};
```

### Tab Navigation Pattern
Typography in tab interfaces

```jsx
const TabNav = ({ tabs, activeTab, onChange }) => {
  return (
    <nav className="tab-nav" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab-nav__tab ${
            activeTab === tab.id ? 'tab-nav__tab--active' : ''
          }`}
        >
          <Body 
            weight={activeTab === tab.id ? 'semibold' : 'regular'}
            as="span"
          >
            {tab.label}
          </Body>
          {tab.count && (
            <Caption as="span" variant="secondary">
              ({tab.count})
            </Caption>
          )}
        </button>
      ))}
    </nav>
  );
};
```

---

## Responsive Patterns

### Mobile-First Text
Responsive text sizing

```jsx
const ResponsiveHero = ({ title, subtitle }) => {
  return (
    <div className="hero">
      <Heading 
        level={1} 
        variant="display"
        className="hero__title"
      >
        {title}
      </Heading>
      <Body 
        size="large"
        variant="secondary"
        className="hero__subtitle"
      >
        {subtitle}
      </Body>
    </div>
  );
};
```

```css
/* Fluid typography for hero */
.hero__title {
  font-size: clamp(32px, 5vw, 48px);
}

.hero__subtitle {
  font-size: clamp(16px, 2.5vw, 20px);
}
```

### Truncation Pattern
Text overflow handling

```jsx
const TruncatedText = ({ text, maxLines = 2 }) => {
  return (
    <Body 
      className={`truncate-${maxLines}`}
      title={text}
    >
      {text}
    </Body>
  );
};
```

```css
.truncate-1 {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncate-2,
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.truncate-3 {
  -webkit-line-clamp: 3;
}
```

---

## Accessibility Patterns

### Visually Hidden Pattern
Screen reader only content

```jsx
const VisuallyHidden = ({ children }) => {
  return (
    <span className="sr-only">
      {children}
    </span>
  );
};

// Usage
<Button>
  <Icon name="edit" />
  <VisuallyHidden>Redigera profil</VisuallyHidden>
</Button>
```

### Announcement Pattern
Live region announcements

```jsx
const LiveAnnouncement = ({ message, priority = 'polite' }) => {
  return (
    <div 
      role="status" 
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      <Body>{message}</Body>
    </div>
  );
};
```

### Skip Link Pattern
Navigation skip links

```jsx
const SkipLink = () => {
  return (
    <a href="#main" className="skip-link">
      <Body weight="medium">Hoppa till huvudinnehåll</Body>
    </a>
  );
};
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
  padding: var(--space-s) var(--space-m);
  z-index: 100;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

---

## Performance Patterns

### Lazy Loading Pattern
Progressive text loading

```jsx
const LazyText = ({ text, placeholder = "Laddar..." }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate async load
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Body>
      {isLoaded ? text : placeholder}
    </Body>
  );
};
```

### Memoized Typography
For expensive renders

```jsx
const MemoizedHeading = React.memo(({ children, ...props }) => {
  return <Heading {...props}>{children}</Heading>;
});

// Use in lists
{items.map(item => (
  <MemoizedHeading key={item.id} level={3}>
    {item.title}
  </MemoizedHeading>
))}
```