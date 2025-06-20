# UX/UI Specifikation 3.2: Scenario Game

**Dokument:** Master UX/UI Specifikation: Framtidsbygget  
**Version:** 1.2  
**Status:** Levande Dokument  

---

## Minispelens Komponenter

## Scenariospelet: "Välfärdens Dilemma" (WelfareGameModule.jsx)

### Referensdokumentation:
- **[GDD Scenario Game Welfare Dilemma](../game_design/GDD_Scenario_Game_Welfare_Dilemma.md)**
- **[Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)**

**Syfte:** Att skapa ett dialogbaserat scenariospel där spelaren måste navigera en komplex diskussion mellan tre intressenter med olika behov. Spelaren ska praktiskt uppleva de etiska och mänskliga avvägningar som krävs när välfärdsteknik implementeras, och lära sig värdet av empati, dialog och kompromiss.

### Lokal Datamodell & State Management

Modulen `WelfareGameModule.jsx` behöver hantera följande lokala tillstånd (state) för att styra spelets flöde:

#### `dialogueTree`: Object
En datastruktur som innehåller hela dialogträdet. Denna ska definieras baserat på GDD:n. Varje nod i trädet innehåller:
- **`id`:** Number (t.ex. 1, 2, 3...)
- **`character`:** String (Vem som talar, t.ex. "Karin", "Arne", "Spelaren")
- **`text`:** String (Repliken som visas)
- **`emotion`:** String (t.ex. 'neutral', 'orolig', 'irriterad')
- **`choices`:** Array<Object> (Om det är spelarens tur). Varje val-objekt innehåller:
  - **`text`:** String (Texten på knappen)
  - **`effects`:** Object (Vilka mätare som påverkas, t.ex. `{ autonomy: 15, security: -10, staff: 0, budget: -5000 }`)
  - **`nextNodeId`:** Number (Vilken dialog-nod som följer)

#### Tillståndsvariabler:
- **`currentNodeId`:** Number - ID för den nuvarande noden i `dialogueTree` som visas
- **`meters`:** Object - Ett objekt som håller de aktuella värdena (0-100) för de tre huvudmätarna:
  - **`autonomy`:** Number
  - **`security`:** Number
  - **`staffWellbeing`:** Number
- **`budget`:** Number - Startar med värdet från `initialBudget`-propen och kan minskas av vissa val

### Layout & Komponent-sammansättning

Vyn är uppdelad i tre horisontella sektioner för att skapa en scenliknande känsla.

#### Övre Sektion (`<HUD>`)
Placerad högst upp, ständigt synlig:
- Innehåller fyra `<ValueMeter>`-komponenter sida vid sida för "Arnes Autonomi", "Trygghet & Säkerhet", "Personalens Välmående" och "Projektbudget"

#### Mellersta Sektion (`<Stage>`)
Spelets "scen":
- En flex-container som visar de tre `<CharacterAvatar>`-komponenterna sida vid sida, med gott om mellanrum (`gap: var(--space-xxl)`)

#### Nedre Sektion (`<DialogueArea>`)
Där den aktiva dialogen och spelarens val presenteras:
- Innehåller en `<DialogueBox>`-komponent

### Specifikation av Sub-komponenter

#### Värdemätare (`<ValueMeter>`)

**Struktur:** Använder `<Meter>` från kärnkomponenterna (se 1.5.3).

**Utseende:**
- **Autonomi:** Fyllnadsfärg `var(--color-state-success)`
- **Säkerhet:** Fyllnadsfärg `var(--color-brand-primary)`
- **Personal:** Fyllnadsfärg `var(--color-accent-warm)`
- **Budget:** Visas inte som en mätare, utan som ren text: "Budget: [värde] kr"

**Feedback:** När ett värde ändras ska mätaren animeras mjukt till sitt nya värde (`transition: width 0.5s ease-out`).

#### Karaktärsavatar (`<CharacterAvatar>`)

**Struktur:** En vertikal flex-container.

**Innehåll:**
- En `<span>` med ikonen `account_circle` från Material Symbols. Ikonens storlek ska vara stor, t.ex. `font-size: 96px`
- Under ikonen, en `<p>` med karaktärens namn ("Arne", "Karin", "Lasse"). **Stil:** `heading-m`

**Tillstånd (baserat på `currentNode.emotion`):**
En div som fungerar som bakgrund till ikonen ska ändra färg för att förmedla känslor:
- **`.is-talking`:** När det är karaktärens tur att prata, får avataren en subtil, pulserande `box-shadow` för att visa vem som talar
- **`.emotion-neutral`:** Bakgrundsfärg `var(--color-brand-secondary)`
- **`.emotion-orolig`:** Bakgrundsfärg `rgba(237, 108, 2, 0.2)` (orange ton)
- **`.emotion-irriterad`:** Bakgrundsfärg `rgba(198, 40, 40, 0.2)` (röd ton)

#### Dialogruta (`<DialogueBox>`)

**Struktur:** En stor `<Card>` som upptar hela den nedre sektionen.

**Innehåll (baserat på `currentNode`):**
- **Talare (`<p>`):** Namnet på den som talar, t.ex. "KARIN SÄGER:". **Stil:** `label`
- **Replik (`<p>`):** Texten från `currentNode.text`. **Stil:** `body-l`
- **Svarsalternativ (`<div>`):** Om `currentNode.character === 'Spelaren'`, renderas en vertikal lista av `<Button>`-komponenter, en för varje objekt i `currentNode.choices`. Knapparna ska ha `width: 100%` för att vara tydliga och lätta att klicka på

### Interaktions-loop & Spellogik

#### Start
Spelet initieras med `currentNodeId = 1`. Mätarna sätts till sina startvärden (t.ex. 50/100).

#### Visa Replik
Komponenten renderar innehållet för den aktuella `currentNodeId`. Om det inte är spelarens tur, visas en "Fortsätt"-knapp.

#### Spelaren Gör Ett Val
Spelaren klickar på en av svarsknapparna:
- `onClick`-händelsen triggar funktionen `handleChoice(choice)`:
  - Hämta `effects`-objektet från det valda alternativet
  - Uppdatera `meters`- och `budget`-state:
    - `setMeters(prev => ({ ...prev, autonomy: prev.autonomy + effects.autonomy }))`. Samma för `security` och `staffWellbeing`. Se till att värdena inte går under 0 eller över 100
    - `setBudget(prev => prev + effects.budget)`
  - Uppdatera `currentNodeId` till `choice.nextNodeId`

#### Kontrollera Vinst/Förlust-villkor
Efter varje val, kör en funktion `checkGameState()`:
- **FÖRLUST-KONTROLL 1 (Mätare):** `if (meters.autonomy < 20 || meters.security < 20 || meters.staffWellbeing < 20)` → Anropa `onGameComplete({ success: false, outcome: 'Implementeringsstopp: Balansen mellan intressenternas behov förlorades.' })`
- **FÖRLUST-KONTROLL 2 (Budget):** `if (budget < 0)` → Anropa `onGameComplete({ success: false, outcome: 'Budgeten överskreds. Projektet pausas.' })`
- **VINST-KONTROLL:** `if (currentNodeId === FINAL_NODE_ID)` → Anropa `onGameComplete({ success: true, outcome: 'Konsensus uppnådd!' })`

### Feedback & Dialogrutor

#### Introduktionstext (visas innan första repliken):

- **Rubrik:** "Dilemmat med det smarta trygghetslarmet"
- **Text:** "Du är inkallad som digital strateg för att leda ett möte mellan omsorgstagaren Arne, hans oroliga dotter Karin, och den stressade hemtjänstpersonalen Lasse. Ditt uppdrag: Hitta en konfiguration av det nya trygghetslarmet som alla kan acceptera. Dina val påverkar balansen mellan deras behov."
- **Knapp:** "[Starta mötet]"