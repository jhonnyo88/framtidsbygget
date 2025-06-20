# Button Usage Examples

**Component:** Button  
**Purpose:** Real-world usage contexts from Framtidsbygget

---

## Framework Components

### Main Dashboard Header
Navigation to Digital Compass feature

```jsx
// In MainDashboard.jsx
<header className="main-dashboard__header">
  <h1>Framtidsbygget</h1>
  <Button 
    variant="secondary" 
    icon="explore"
    onClick={handleOpenKompassen}
  >
    Min Kompass
  </Button>
</header>
```

### Scoreboard Actions
View detailed statistics or achievements

```jsx
// In Scoreboard.jsx
<Button 
  variant="secondary" 
  size="small"
  icon="insights"
  onClick={showDetailedStats}
>
  Visa Detaljer
</Button>
```

### MapView Location Selection
Start a game from the map

```jsx
// In MapView.jsx location tooltip
<Button 
  variant="primary"
  size="small"
  onClick={() => onLocationSelect(location.id)}
  disabled={!isLocationAccessible(location.id)}
>
  Starta Uppdrag
</Button>
```

---

## Game Modules

### WelfareGame Dialogue Choices
Player response options in dialogue

```jsx
// In DialogueBox.jsx
{currentNode.choices.map((choice, index) => (
  <Button
    key={index}
    variant="secondary"
    fullWidth
    onClick={() => handleChoice(choice)}
    className="dialogue-choice"
  >
    {choice.text}
  </Button>
))}
```

### PuzzleGame Actions
Game control buttons

```jsx
// In PuzzleGameModule.jsx
<div className="game-controls">
  <Button 
    variant="secondary" 
    icon="refresh"
    onClick={resetPuzzle}
  >
    Börja Om
  </Button>
  <Button 
    variant="primary"
    icon="help_outline"
    onClick={showHint}
    disabled={hintsRemaining === 0}
  >
    Ledtråd ({hintsRemaining})
  </Button>
</div>
```

### Crisis Game Phase Control
Transition between game phases

```jsx
// In BuildHUD.jsx
<Button 
  variant="primary" 
  size="large"
  icon="warning"
  onClick={startCrisisPhase}
  className="start-crisis-button"
>
  Starta Krisfasen
</Button>
```

---

## Modals & Overlays

### ResultModal Actions
Post-game options

```jsx
// In ResultModal.jsx
<div className="result-modal__actions">
  <Button 
    variant="secondary"
    onClick={viewDetails}
  >
    Se Detaljer
  </Button>
  <Button 
    variant="primary"
    icon="arrow_forward"
    onClick={continueToNext}
  >
    Fortsätt
  </Button>
</div>
```

### Confirmation Dialogs
Binary choice patterns

```jsx
// In ConfirmationModal.jsx
<div className="modal-actions">
  <Button 
    variant="secondary"
    onClick={onCancel}
  >
    Avbryt
  </Button>
  <Button 
    variant="danger"
    onClick={onConfirm}
  >
    Ta Bort Framsteg
  </Button>
</div>
```

---

## Forms & Input

### Settings Panel
Save/cancel pattern

```jsx
// In SettingsPanel.jsx
<div className="settings-actions">
  <Button 
    variant="secondary"
    onClick={handleCancel}
    disabled={!hasChanges}
  >
    Ångra Ändringar
  </Button>
  <Button 
    variant="primary"
    icon="save"
    onClick={handleSave}
    disabled={!hasChanges || !isValid}
  >
    Spara
  </Button>
</div>
```

### Login/Authentication
Full-width mobile pattern

```jsx
// In AuthFlow.jsx
<Button 
  variant="primary"
  size="large"
  fullWidth
  onClick={signInAnonymously}
  className="auth-button"
>
  Börja Spela
</Button>
```

---

## Special Contexts

### Onboarding Flow
Progressive disclosure

```jsx
// In OnboardingStep.jsx
<div className="onboarding-navigation">
  <Button 
    variant="secondary"
    onClick={skipOnboarding}
  >
    Hoppa Över
  </Button>
  <Button 
    variant="primary"
    icon="arrow_forward"
    onClick={nextStep}
  >
    Nästa
  </Button>
</div>
```

### Error States
Recovery actions

```jsx
// In ErrorBoundary.jsx
<div className="error-actions">
  <Button 
    variant="secondary"
    icon="refresh"
    onClick={window.location.reload}
  >
    Ladda Om Sidan
  </Button>
  <Button 
    variant="primary"
    onClick={returnToHome}
  >
    Tillbaka till Start
  </Button>
</div>
```

### Achievement Unlocked
Celebration actions

```jsx
// In AchievementModal.jsx
<Button 
  variant="primary"
  size="large"
  icon="emoji_events"
  onClick={shareAchievement}
  className="achievement-share"
>
  Dela Prestation
</Button>
```

---

## Accessibility Examples

### Icon-Only Buttons
Proper labeling for screen readers

```jsx
// In Toolbar.jsx
<Button 
  variant="secondary"
  size="small"
  icon="settings"
  onClick={openSettings}
  aria-label="Öppna inställningar"
  className="icon-only"
/>
```

### Loading States
Communicate async operations

```jsx
// In SaveButton.jsx
<Button 
  variant="primary"
  onClick={handleSave}
  disabled={isSaving}
  aria-busy={isSaving}
>
  {isSaving ? 'Sparar...' : 'Spara'}
</Button>
```

### Keyboard Navigation
Focus management in flows

```jsx
// In DialogueFlow.jsx
<Button 
  ref={continueButtonRef}
  variant="primary"
  onClick={handleContinue}
  onKeyDown={handleKeyNavigation}
>
  Fortsätt
</Button>
```

---

## Common Patterns

### Button Groups
Related actions together

```css
.button-group {
  display: flex;
  gap: var(--space-m);
  justify-content: flex-end;
}

.button-group--centered {
  justify-content: center;
}

.button-group--stacked {
  flex-direction: column;
}
```

### Responsive Behavior
Mobile-first considerations

```css
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }
  
  .button-group .button {
    width: 100%;
  }
}
```