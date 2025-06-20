# Typography Usage Examples

**Component:** Typography System  
**Context:** Framtidsbygget Game UI

---

## Dashboard Typography

### Main Dashboard Header
Hero section with display heading

```jsx
// MainDashboard.jsx
<header className="dashboard-header">
  <Heading level={1} variant="display" align="center">
    Framtidsbygget
  </Heading>
  <Body size="large" variant="secondary" align="center">
    Bygg framtidens samhälle genom strategiska val och samarbete
  </Body>
</header>
```

### Section Headers
Consistent hierarchy throughout

```jsx
// Dashboard sections
<section>
  <Heading level={2}>Dina Uppdrag</Heading>
  <Body variant="secondary">
    Välj ett uppdrag för att fortsätta din resa
  </Body>
  
  <div className="mission-grid">
    <Card>
      <Card.Header>
        <Heading level={4}>Välfärdsspelet</Heading>
      </Card.Header>
      <Card.Content>
        <Body size="small">
          Utforska välfärdssystemet genom dialog
        </Body>
      </Card.Content>
    </Card>
  </div>
</section>
```

---

## Game Module Typography

### WelfareGame Dialogue

```jsx
// DialogueInterface.jsx
<div className="dialogue-container">
  <div className="npc-info">
    <Heading level={5} as="h3">Anna Andersson</Heading>
    <Caption variant="secondary">Socialarbetare</Caption>
  </div>
  
  <div className="dialogue-text">
    <Body>
      "Vi behöver hitta en balans mellan individuella behov 
      och samhällets resurser. Vad tycker du är viktigast?"
    </Body>
  </div>
  
  <Caption>Klicka för att välja ditt svar</Caption>
</div>
```

### Crisis Management UI

```jsx
// CrisisGameHUD.jsx
<div className="crisis-header">
  <Heading level={2} variant="display">
    Krisfas Aktiv
  </Heading>
  <Body size="large" weight="semibold" variant="error">
    Sjukvården är överbelastad!
  </Body>
  
  <div className="resource-stats">
    <div className="stat">
      <Caption uppercase>Kapacitet</Caption>
      <Heading level={4}>85%</Heading>
    </div>
    <div className="stat">
      <Caption uppercase>Budget</Caption>
      <Heading level={4}>2.3M kr</Heading>
    </div>
  </div>
</div>
```

---

## Form Typography

### Settings Form

```jsx
// SettingsPanel.jsx
<form className="settings-form">
  <Heading level={3}>Spelinställningar</Heading>
  
  <fieldset>
    <legend>
      <Heading level={5} as="span">Ljud & Musik</Heading>
    </legend>
    
    <label>
      <Body weight="medium">Huvudvolym</Body>
      <Caption>Justerar alla ljudeffekter</Caption>
      <input type="range" />
    </label>
  </fieldset>
  
  <Caption variant="secondary">
    Ändringar sparas automatiskt
  </Caption>
</form>
```

### Login Screen

```jsx
// AuthScreen.jsx
<div className="auth-container">
  <Heading level={1} align="center">
    Välkommen tillbaka!
  </Heading>
  
  <Body align="center" variant="secondary">
    Fortsätt din resa i Framtidsbygget
  </Body>
  
  <form>
    <label>
      <Body weight="medium">Användarnamn</Body>
      <input type="text" />
    </label>
    
    <Caption variant="error" role="alert">
      {error && "Felaktigt användarnamn eller lösenord"}
    </Caption>
  </form>
</div>
```

---

## Information Displays

### Tutorial Cards

```jsx
// TutorialCard.jsx
<Card variant="elevated">
  <Card.Header>
    <Heading level={4}>Hur man spelar</Heading>
  </Card.Header>
  <Card.Content>
    <Body>
      I Framtidsbygget fattar du beslut som påverkar 
      samhällets utveckling. Varje val har konsekvenser.
    </Body>
    
    <ol>
      <li>
        <Body weight="medium">Välj uppdrag</Body>
        <Body size="small" variant="secondary">
          Börja med ett uppdrag från kartan
        </Body>
      </li>
      <li>
        <Body weight="medium">Fatta beslut</Body>
        <Body size="small" variant="secondary">
          Överväg noga - allt påverkar slutresultatet
        </Body>
      </li>
    </ol>
  </Card.Content>
</Card>
```

### Achievement Display

```jsx
// AchievementModal.jsx
<div className="achievement-unlock">
  <Heading level={2} variant="display" align="center">
    Prestation Upplåst!
  </Heading>
  
  <Heading level={3} align="center">
    Samhällsbyggare
  </Heading>
  
  <Body align="center">
    Du har framgångsrikt balanserat välfärd och ekonomi 
    i ditt första uppdrag.
  </Body>
  
  <div className="achievement-meta">
    <Caption>Upplåst: {new Date().toLocaleDateString('sv-SE')}</Caption>
    <Caption>Sällsynt (12% av spelare)</Caption>
  </div>
</div>
```

---

## Navigation Typography

### Main Navigation

```jsx
// Navigation.jsx
<nav className="main-nav">
  <Heading level={5} as="span" className="nav-brand">
    Framtidsbygget
  </Heading>
  
  <ul className="nav-links">
    <li>
      <Body as="span" weight="medium">Översikt</Body>
    </li>
    <li>
      <Body as="span" weight="medium">Uppdrag</Body>
      <Caption as="span" variant="error">3 nya</Caption>
    </li>
  </ul>
</nav>
```

### Breadcrumbs

```jsx
// Breadcrumbs.jsx
<nav aria-label="Breadcrumb">
  <Caption as="span">
    <Link>Start</Link> / 
    <Link>Uppdrag</Link> / 
    <span>Välfärdsspelet</span>
  </Caption>
</nav>
```

---

## Status Messages

### Loading States

```jsx
// LoadingMessage.jsx
<div className="loading-container">
  <Heading level={3} align="center">
    Laddar spelet...
  </Heading>
  <Body variant="secondary" align="center">
    Förbereder din spelupplevelse
  </Body>
  <Caption align="center">Detta kan ta några sekunder</Caption>
</div>
```

### Error Messages

```jsx
// ErrorBoundary.jsx
<div className="error-message" role="alert">
  <Heading level={2} variant="error">
    Något gick fel
  </Heading>
  <Body variant="error">
    Vi kunde inte ladda spelets resurser. 
    Kontrollera din internetanslutning och försök igen.
  </Body>
  <Caption>Felkod: GAME_LOAD_ERROR</Caption>
</div>
```

### Success Feedback

```jsx
// SuccessNotification.jsx
<div className="success-notification" role="status">
  <Body weight="semibold" variant="success">
    ✓ Framsteg sparat
  </Body>
  <Caption variant="success">
    Senast sparad: {timestamp}
  </Caption>
</div>
```

---

## Mobile-Specific Typography

### Compact Card Headers

```jsx
// MobileCard.jsx
<Card className="mobile-card">
  <Card.Header>
    <div className="compact-header">
      <Heading level={5}>Uppdrag</Heading>
      <Caption>5 min</Caption>
    </div>
  </Card.Header>
</Card>
```

### Touch-Friendly Labels

```jsx
// MobileControls.jsx
<button className="touch-button">
  <Body weight="medium" size="small">
    Starta Uppdrag
  </Body>
  <Caption>Nivå 3 • Medel</Caption>
</button>
```

---

## Accessibility Examples

### Screen Reader Only Text

```jsx
// AccessibleStats.jsx
<div className="player-stats">
  <span className="sr-only">
    <Body>Din spelstatistik:</Body>
  </span>
  <Heading level={4}>
    <span className="sr-only">Poäng:</span>
    1,250
  </Heading>
  <Caption>
    <span className="sr-only">Ranking:</span>
    Top 10%
  </Caption>
</div>
```

### Descriptive Links

```jsx
// AccessibleLinks.jsx
<Body>
  Läs mer om 
  <a href="/guide">
    <span className="sr-only">Framtidsbygget</span>
    spelguiden
  </a> 
  för detaljerade instruktioner.
</Body>
```

---

## Common Patterns

### Metadata Display
```jsx
<div className="metadata">
  <Caption>
    {category} · {duration} · {difficulty}
  </Caption>
</div>
```

### Status Indicators
```jsx
<div className="status">
  <Caption variant={statusVariant} uppercase>
    {statusText}
  </Caption>
</div>
```

### Time Display
```jsx
<Caption>
  {formatRelativeTime(timestamp)}
</Caption>
```