# Master GDD: Den Kompletta Specifikationen för "Framtidsbygget"

**Version:** 1.0  
**Status:** Implementation-klar, primär styrdokumentation  
**Syfte:** Att fungera som den enda, definitiva källan för hela spelets ramverk, spelarresa, progressionslogik och gränssnitt. Dokumentet är skrivet för att vara en direkt, otvetydig instruktion till en AI-utvecklare.

---

## Övergripande Spelarresa & Spelflöde
Detta avsnitt beskriver den övergripande upplevelsen från spelarens perspektiv.

### Start & Onboarding
Spelet inleds med en **tvingande, guidad sekvens** (`OnboardingFlow`) som:
- Etablerar spelarens **roll som nationell digital strateg**
- Introducerar **huvudnavet** ("Digitala Sverige"-kartan)  
- Presenterar spelets **kärnverktyg** ("Den Digitala Kompassen")

### Huvudcykeln (Core Loop)
Efter onboardingen befinner sig spelaren i **Huvudnavet**. Resan följer denna cykel:

1. **Välj Uppdrag:** Spelaren väljer ett av de fem tillgängliga uppdragen (minispelen) från kartan
2. **Genomför Uppdrag:** Spelaren startar och slutför det valda minispelet enligt dess specifika GDD
3. **Resultat & Belöning:** När minispelet är klart återförs spelaren till Huvudnavet. `App.jsx` tar emot ett `result`-objekt från minispelet
4. **Progression:** `App.jsx` beräknar och tilldelar **Förändringsledarpoäng (FL-poäng)**, låser upp eventuella **Utmärkelser** och **Synergier**
5. **Visuell Feedback:** Huvudnavets karta uppdateras med en permanent, visuell förbättring som speglar den slutförda uppgiften

### Final
När alla fem uppdrag är slutförda, triggas den avslutande sekvensen (**Finalen: "Årsrapporten till Nationen"**), vilken summerar spelarens resa och ger ett slutbetyg.
---

## Kärnsystem & Datamodeller (Spelets "Motor")
Detta avsnitt innehåller den **exakta, implementerbara logiken** för all metaprogression. Denna logik ska primärt implementeras i `App.jsx` och använda den centrala datastrukturen `gameState`.

### Detaljerad Specifikation av gameState-objektet
Detta objekt är den **kompletta representationen** av en spelares framsteg och måste sparas/laddas från Firebase.

```javascript
{
  "userId": "string",
  "totalFLScore": 0,
  "onboardingStatus": "string", // 'not_started', 'in_progress', 'completed'
  "completedWorlds": [
    {
      "worldId": "string", // e.g., 'pussel-spel-datasystem'
      "status": "string", // 'completed'
      "scoreAwarded": "number",
      "bestOutcome": "string" // e.g., 'Perfekt lösning', 'Konsensus'
    }
  ],
  "unlockedAchievements": ["string"],
  "unlockedSynergies": {
    "synergy_expert_data_model": "boolean",
    "synergy_empathy_training": "boolean",
    "synergy_skilled_workforce": "boolean",
    "synergy_resilient_network": "boolean"
  },
  "compassProgress": {
    // Nyckel är nod-ID från strategy.json
    "digital_kompetens": "string" // 'locked', 'unlocked', 'mastered'
  },
  "gameVersion": "1.0.0"
}
```


### Detaljerad Poängberäkning (FL-poäng)
Denna logik exekveras i `handleGameComplete(result)` i `App.jsx`.

#### GDD: Säker Datasystem
```javascript
result = { success, budgetSpent, movesMade }
TotalFLScoreAwarded = (success ? 1000 : 0) + 
                     ((initialBudget - budgetSpent) * 2) + 
                     (500 - (movesMade * 10))
```

#### GDD: Välfärdens Dilemma
```javascript
result = { success, finalAutonomy, finalSecurity, finalStaffWellbeing, outcome }
TotalFLScoreAwarded = (success ? 500 : 0) + 
                     (((finalAutonomy + finalSecurity + finalStaffWellbeing) / 3) * 10) + 
                     (outcome === 'Konsensus' ? 500 : 200)
```

#### GDD: Kompetensresan
```javascript
result = { success, finalCompetence, finalBudget }
TotalFLScoreAwarded = (success ? 1000 : 0) + 
                     (finalCompetence.base + finalCompetence.broad + (finalCompetence.specialist * 1.5)) + 
                     (finalBudget * 0.5)
```

#### GDD: Konnektivitetsvakten
```javascript
result = { success, finalIndex, buildPhaseScore }
TotalFLScoreAwarded = (success ? 800 : 0) + (finalIndex * 10) + buildPhaseScore
```

#### GDD: Ekosystembyggaren
```javascript
result = { success, finalMetrics }
TotalFLScoreAwarded = (success ? 1200 : 0) + Object.values(finalMetrics).reduce((a, b) => a + b, 0)
```
### Detaljerad Synergilogi
Denna logik körs i `checkAndUnlockSynergies(worldId, result)` i `App.jsx` efter poängberäkning.

```javascript
if (worldId === 'pussel-spel-datasystem' && result.scoreAwarded > 1200) { 
  gameState.unlockedSynergies.synergy_expert_data_model = true; 
}

if (worldId === 'valfards-dilemma' && result.outcome === 'Konsensus') { 
  gameState.unlockedSynergies.synergy_empathy_training = true; 
}

if (worldId === 'kompetensresan' && result.finalCompetence.specialist > 80) { 
  gameState.unlockedSynergies.synergy_skilled_workforce = true; 
}

if (worldId === 'konnektivitetsvakten' && result.finalIndex > 90) { 
  gameState.unlockedSynergies.synergy_resilient_network = true; 
}
```
---

## Detaljerad Specifikation av Ramverkskomponenter
Detta avsnitt är en detaljerad GDD för varje övergripande komponent.

### Komponent-GDD: Onboarding-sekvensen
**Tekniskt Kontrakt:** Hanteras av `App.jsx` via `onboardingStatus` i `gameState`. Kräver ingen egen React-komponent, utan är en serie villkorliga renderingar.

#### Speldesign & Logik:

1. **Steg 1 (Intro):** `if (onboardingStatus === 'not_started')` visa modal med text och knapp "[Jag är redo]". `onClick` -> uppdatera `onboardingStatus` till `'step_2'` och spara `gameState`.

2. **Steg 2 (Kompass-pek):** `if (onboardingStatus === 'step_2')` rendera Huvudnavet med ett "overlay"-element som tonar ner allt utom "Kompass"-knappen, som får en CSS-animation (pulserande sken) och en tooltip. `onClick` -> `onboardingStatus = 'step_3'`.

3. **Steg 3 (Insikt):** I `DigitalaKompassen.jsx`, `if (props.onboardingStep === 'step_3')` visa tooltip som pekar på rätt nod. `onNodeClick` -> `props.advanceOnboarding('step_4')`.

4. **Steg 4 (Uppdragsval):** `if (onboardingStatus === 'step_4')` rendera Huvudnavet med overlay som pekar på första uppdraget. `onClick` -> `onboardingStatus = 'completed'`.

#### Användarupplevelse:
En mjuk, guidad upplevelse som sömlöst lär spelaren gränssnittet. Varje klick bekräftas med en subtil ljudeffekt och visuell förändring.
### Komponent-GDD: Huvudnavet ("Digitala Sverige"-kartan)
**Tekniskt Kontrakt:** Primärt `MainDashboard.jsx`. Får hela `gameState` som prop.

#### Speldesign & Logik:

- **Kartans Bas:** Renderar en SVG-bild av en stiliserad Sverige-karta. Ovanpå denna placeras klickbara div-element för de fem regionerna.

- **Visuell Progression (Detaljerad):** En separat komponent, `MapOverlayAnimations.jsx`, renderar de visuella uppgraderingarna. Den tar `gameState.completedWorlds` som prop.
  - `if (completedWorlds.some(w => w.worldId === 'pussel-spel-datasystem'))` rendera SVG-sökvägar (`<path>`) med en CSS-animation för pulserande dataflöden
  - `if (completedWorlds.some(w => w.worldId === 'valfards-dilemma'))` rendera "plus"-ikoner ovanpå specifika koordinater på kartan

- **Interaktion:** `onClick` på en region-ikon anropar `props.onSelectWorld(worldId)`. Ikonen ska ge visuell feedback vid `:hover` (t.ex. växer något i storlek) och `onClick` (en "klick"-animation).
### Komponent-GDD: "Den Digitala Kompassen"
**Tekniskt Kontrakt:** `DigitalaKompassen.jsx`. Tar `gameState.compassProgress` och en `onNodeClick`-funktion som props.

#### Speldesign & Logik:

- **Datastruktur:** Komponenten ska fetcha en lokal `strategy.json` vid montering
- **Rendering:** Använder ett bibliotek (`react-d3-tree` eller liknande) för att rendera JSON-datan som ett interaktivt träd
- **Progressionsvisualisering:** Komponenten loopar igenom nod-datan och applicerar en CSS-klass baserat på `props.compassProgress[node.id]`

```css
.node-locked { opacity: 0.5; }
.node-unlocked { fill: #A7C7E7; }
.node-mastered { stroke: gold; stroke-width: 3px; animation: pulse 2s infinite; }
```

- **Logik vid upplåsning:** När ett minispel är klart, anropar `App.jsx` `unlockCompassNode(nodeId, masteryLevel)`. Denna funktion uppdaterar `gameState.compassProgress`.
### Komponent-GDD: Finalen ("Årsrapporten till Nationen")
**Tekniskt Kontrakt:** Hanteras av `App.jsx`, som renderar en `FinaleSequence.jsx`-komponent när villkoret `gameState.completedWorlds.length === 5` är uppfyllt.

#### Speldesign & Logik:
Komponenten är en **"state machine"** som går igenom ett antal steg.

1. **finaleStep: 1 (Analys & Val):**
   - En funktion `analyzePerformance(gameState)` anropas för att hitta `topArea` och `topAchievement`
   - Komponenten renderar två knappar med dynamisk text från analysresultatet
   - `onClick` på en knapp sparar valet och sätter `finaleStep: 2`

2. **finaleStep: 2 (Cinematic):**
   - En sekvens av textpaneler och bilder visas, en i taget med "fade in/out"-övergångar
   - Innehållet är dynamiskt genererat
   - Exempel: `const title = \`Rapport: ${playerChoice === 'topArea' ? topArea.title : topAchievement.title}\``
   - En animerad stapelgraf kan visa den slutgiltiga `totalFLScore` som fylls på

3. **finaleStep: 3 (Slutskärm):**
   - Visar slutbetyg, en lista över uppnådda Utmärkelser och knappen "[Spela igen]"
---

## Integration med Minispel
Detta avsnitt definierar det exakta **"handslaget"** mellan ramverket och minispelen.

### Starta ett Minispel:
1. När spelaren klickar på en värld i `MainDashboard.jsx`, anropas `handleSelectWorld(worldId)` i `App.jsx`
2. `App.jsx` sätter sitt state `activeGame = worldId`
3. Villkorlig rendering i `App.jsx`: `if (activeGame) { return <GameWrapper worldId={activeGame} ... /> }`
4. `GameWrapper` är en komponent som renderar rätt minispelsmodul baserat på `worldId` och skickar med alla nödvändiga props, inklusive synergibonusar och callback-funktioner

### Avsluta ett Minispel:
1. Varje minispel måste anropa sin `onGameComplete(result)`-prop när det är slut
2. `result`-objektet måste följa den exakta struktur som definierats för det spelet i Del 2.2
3. Anropet triggar hela kedjan i `App.jsx`: `handleGameComplete` -> poängberäkning -> synergikontroll -> uppdatering av `gameState` -> spara till Firebase -> `setActiveGame(null)`
4. När `activeGame` blir `null`, renderar `App.jsx` automatiskt `MainDashboard.jsx` igen, som nu får det uppdaterade `gameState`-objektet och visar spelarens framsteg

---

> **Detta master-dokument utgör den kompletta, tekniska och spelmässiga grunden för "Framtidsbygget".** Det är designat för att vara den enskilda, auktoritativa källan för utvecklingen av spelets ramverk och säkerställer att alla delar fungerar tillsammans som en sömlös, meningsfull och djupt engagerande helhet.
Detta master-dokument utgör den kompletta, tekniska och spelmässiga grunden för "Framtidsbygget". Det är designat för att vara den enskilda, auktoritativa källan för utvecklingen av spelets ramverk och säkerställer att alla delar fungerar tillsammans som en sömlös, meningsfull och djupt engagerande helhet.
