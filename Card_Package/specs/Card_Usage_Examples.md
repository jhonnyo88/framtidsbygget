# Card Usage Examples

**Component:** Card  
**Purpose:** Real-world usage contexts from Framtidsbygget

---

## Dashboard Cards

### Game Module Selection Card
Interactive cards for choosing games

```jsx
// In MainDashboard.jsx
<Card 
  variant="elevated" 
  interactive
  onClick={() => navigateToGame('welfare')}
  className="game-module-card"
>
  <Card.Header>
    <h3>Välfärdsspelet</h3>
    <Icon name="psychology" />
  </Card.Header>
  <Card.Content>
    <p>Utforska välfärdssystemet genom interaktiva dialoger och beslut.</p>
    <div className="card-stats">
      <span>🎯 3 uppdrag</span>
      <span>⏱️ 15-20 min</span>
    </div>
  </Card.Content>
  <Card.Footer>
    <span className="progress">2/3 klarade</span>
    <Button variant="primary" size="small">
      Fortsätt
    </Button>
  </Card.Footer>
</Card>
```

### Player Statistics Card
Display progress and achievements

```jsx
// In PlayerProgress.jsx
<Card variant="flat" className="stats-card">
  <Card.Header>
    <h3>Min Framsteg</h3>
  </Card.Header>
  <Card.Content>
    <div className="stat-grid">
      <div className="stat">
        <span className="stat-value">12</span>
        <span className="stat-label">Uppdrag Klarade</span>
      </div>
      <div className="stat">
        <span className="stat-value">85%</span>
        <span className="stat-label">Komplettering</span>
      </div>
      <div className="stat">
        <span className="stat-value">3</span>
        <span className="stat-label">Achievements</span>
      </div>
    </div>
  </Card.Content>
</Card>
```

---

## Game Module Cards

### WelfareGame Dialogue Card
NPC conversation display

```jsx
// In WelfareGameModule.jsx
<Card variant="outlined" className="dialogue-card">
  <Card.Header>
    <div className="npc-header">
      <img src={npc.avatar} alt={npc.name} />
      <div>
        <h4>{npc.name}</h4>
        <span className="npc-role">{npc.role}</span>
      </div>
    </div>
  </Card.Header>
  <Card.Content>
    <p className="dialogue-text">{currentDialogue.text}</p>
    {currentDialogue.emotion && (
      <span className="emotion-indicator">{currentDialogue.emotion}</span>
    )}
  </Card.Content>
  {showChoices && (
    <Card.Footer>
      <div className="dialogue-choices">
        {choices.map(choice => (
          <Button 
            key={choice.id}
            variant="secondary"
            fullWidth
            onClick={() => selectChoice(choice)}
          >
            {choice.text}
          </Button>
        ))}
      </div>
    </Card.Footer>
  )}
</Card>
```

### Crisis Management Resource Card
Resource allocation interface

```jsx
// In CrisisGameModule.jsx
<Card variant="elevated" className="resource-card">
  <Card.Header>
    <h4>Sjukvård</h4>
    <Icon name="local_hospital" />
  </Card.Header>
  <Card.Content>
    <div className="resource-stats">
      <ProgressBar 
        label="Kapacitet" 
        value={resources.healthcare.capacity} 
        max={100}
        variant="primary"
      />
      <ProgressBar 
        label="Personal" 
        value={resources.healthcare.staff} 
        max={100}
        variant="secondary"
      />
    </div>
    <div className="resource-cost">
      <Icon name="attach_money" />
      <span>{resources.healthcare.cost} kr/dag</span>
    </div>
  </Card.Content>
  <Card.Footer>
    <Button 
      variant="secondary" 
      size="small"
      onClick={() => adjustResource('healthcare', -10)}
    >
      Minska
    </Button>
    <Button 
      variant="primary" 
      size="small"
      onClick={() => adjustResource('healthcare', 10)}
    >
      Öka
    </Button>
  </Card.Footer>
</Card>
```

---

## Information Display Cards

### Tutorial Card
Onboarding and help content

```jsx
// In TutorialOverlay.jsx
<Card variant="elevated" className="tutorial-card">
  <Card.Header>
    <h3>Hur man spelar</h3>
    <Button 
      variant="secondary" 
      size="small" 
      icon="close"
      onClick={closeTutorial}
      aria-label="Stäng tutorial"
    />
  </Card.Header>
  <Card.Content>
    <ol className="tutorial-steps">
      <li>Välj ett uppdrag från kartan</li>
      <li>Läs instruktionerna noggrant</li>
      <li>Fatta beslut baserat på information</li>
      <li>Se resultatet av dina val</li>
    </ol>
    <div className="tutorial-tip">
      <Icon name="lightbulb" />
      <p>Tips: Tänk på långsiktiga konsekvenser!</p>
    </div>
  </Card.Content>
  <Card.Footer>
    <Button variant="secondary" onClick={previousTip}>
      Föregående
    </Button>
    <Button variant="primary" onClick={nextTip}>
      Nästa
    </Button>
  </Card.Footer>
</Card>
```

### Achievement Card
Celebration and progress display

```jsx
// In AchievementModal.jsx
<Card 
  variant="elevated" 
  className="achievement-card animated"
  role="alert"
  aria-live="assertive"
>
  <Card.Content>
    <div className="achievement-icon">
      <Icon name="emoji_events" size="large" />
    </div>
    <h3>Prestation Upplåst!</h3>
    <h4>{achievement.title}</h4>
    <p>{achievement.description}</p>
    <div className="achievement-rewards">
      <span>+{achievement.points} poäng</span>
      {achievement.badge && <Badge src={achievement.badge} />}
    </div>
  </Card.Content>
  <Card.Footer>
    <Button variant="secondary" onClick={dismiss}>
      Senare
    </Button>
    <Button variant="primary" onClick={share}>
      Dela
    </Button>
  </Card.Footer>
</Card>
```

---

## List and Grid Layouts

### Leaderboard Card Items
Competitive display

```jsx
// In Leaderboard.jsx
{players.map((player, index) => (
  <Card 
    key={player.id}
    variant="flat" 
    className="leaderboard-item"
  >
    <Card.Content>
      <div className="leaderboard-row">
        <span className="rank">{index + 1}</span>
        <Avatar src={player.avatar} name={player.name} />
        <div className="player-info">
          <h4>{player.name}</h4>
          <span className="player-level">Nivå {player.level}</span>
        </div>
        <div className="player-score">
          <span className="score">{player.score}</span>
          <span className="label">poäng</span>
        </div>
      </div>
    </Card.Content>
  </Card>
))}
```

### Mission Selection Grid
Available quests display

```jsx
// In MissionSelect.jsx
<div className="mission-grid">
  {missions.map(mission => (
    <Card
      key={mission.id}
      variant={mission.completed ? "flat" : "outlined"}
      interactive={!mission.completed}
      onClick={() => !mission.completed && selectMission(mission.id)}
      className="mission-card"
    >
      <Card.Header>
        <h4>{mission.title}</h4>
        {mission.completed && <Icon name="check_circle" />}
      </Card.Header>
      <Card.Content>
        <p>{mission.description}</p>
        <div className="mission-meta">
          <span className="difficulty">{mission.difficulty}</span>
          <span className="duration">{mission.estimatedTime}</span>
        </div>
      </Card.Content>
      {!mission.completed && (
        <Card.Footer>
          <span className="reward">+{mission.points} poäng</span>
          <Button variant="primary" size="small">
            Starta
          </Button>
        </Card.Footer>
      )}
    </Card>
  ))}
</div>
```

---

## Special Use Cases

### Loading State Card
Skeleton screen for async content

```jsx
// In LoadingCard.jsx
<Card variant="flat" className="loading-card">
  <Card.Header>
    <Skeleton width="60%" height={24} />
  </Card.Header>
  <Card.Content>
    <Skeleton count={3} />
    <Skeleton width="80%" />
  </Card.Content>
  <Card.Footer>
    <Skeleton width={100} height={36} />
  </Card.Footer>
</Card>
```

### Empty State Card
When no content is available

```jsx
// In EmptyState.jsx
<Card variant="outlined" className="empty-state">
  <Card.Content>
    <div className="empty-illustration">
      <Icon name="inbox" size="xlarge" />
    </div>
    <h3>Inga uppdrag tillgängliga</h3>
    <p>Kom tillbaka senare för nya utmaningar!</p>
    <Button variant="primary" onClick={checkForUpdates}>
      Uppdatera
    </Button>
  </Card.Content>
</Card>
```

### Error State Card
Error handling display

```jsx
// In ErrorCard.jsx
<Card variant="flat" className="error-card" role="alert">
  <Card.Content>
    <div className="error-icon">
      <Icon name="error_outline" color="danger" />
    </div>
    <h3>Något gick fel</h3>
    <p>{error.message}</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="secondary" onClick={goBack}>
      Gå tillbaka
    </Button>
    <Button variant="primary" onClick={retry}>
      Försök igen
    </Button>
  </Card.Footer>
</Card>
```

---

## Responsive Patterns

### Mobile Card Stack
Full-width cards on mobile

```css
@media (max-width: 768px) {
  .card-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-m);
  }
  
  .card-stack .card {
    width: 100%;
  }
}
```

### Desktop Card Grid
Multi-column layout

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-l);
}
```

### Tablet Responsive Grid
Adaptive columns

```css
@media (min-width: 768px) and (max-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```