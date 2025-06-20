# Framtidsbygget: Teknisk Arkitektur & Masterplan

**Version:** 4.0 (Slutgiltig Blueprint)  
**Syfte:** Att fungera som den enda, definitiva tekniska källan för "Framtidsbygget". Detta dokument definierar arkitekturen, datastrukturer, komponentkontrakt och grundläggande tekniska principer. Det är optimerat för att ge en AI-utvecklare otvetydiga och avgränsade instruktioner.

---

## Grundläggande Principer
All utveckling ska följa dessa fyra **kärnprinciper:**

1. **AI-Först:** Allt är specificerat för att ge en AI otvetydiga instruktioner. Gissningar och antaganden ska elimineras.
2. **Modulär Arkitektur:** Applikationen är uppdelad i fristående moduler (komponenter) med väldefinierade ansvarsområden.
3. **Kontraktsbaserad Utveckling:** Varje komponent utvecklas mot sitt **Tekniska Kontrakt**. Detta kontrakt är bindande.
4. **Designsystemet är Lag:** All visuell implementation måste följa [Master UX/UI Design System](../UX/Master_UX_UI_Design_System.md). Referera till [documentation_index.md](../../../documentation_index.md) för den exakta filen.
---

## Högnivåarkitektur & Dataflöde
Applikationen är byggd kring en central **"Dirigent"** (`App.jsx`) som hanterar det globala tillståndet och styr vilken vy som visas.

### State Management-filosofi:

- **Globalt State (`gameState`):** Hanteras endast i `App.jsx`. Detta inkluderar spelarens totala poäng, framsteg, upplåsta objekt etc. Detta state skickas ner till barnkomponenter via props.
- **Lokalt State:** Varje minispelsmodul (t.ex. `PuzzleGameModule`) ansvarar för sitt eget, interna tillstånd (t.ex. positionen på pusselbitar, aktuell dialog). Detta lokala state existerar bara så länge modulen är aktiv och kommuniceras aldrig utåt, förutom via det slutgiltiga `result`-objektet som skickas till `onGameComplete`.
- **Backend-synkronisering:** All kommunikation med Firebase sker endast från `App.jsx`, via `FirebaseService.js`. En minispelsmodul vet ingenting om Firebase.
### Felhantering (Error Handling):
Varje huvudvy som renderas av `App.jsx` (t.ex. `MainDashboard`, `PuzzleGameModule`) ska omslutas av en **React Error Boundary**. Detta är en återanvändbar komponent som:
- Fångar JavaScript-fel i sina barnkomponenter
- Loggar felet
- Visar ett standardiserat felmeddelande ("Något gick fel, försök att ladda om sidan.") istället för att hela applikationen kraschar
---

## Centrala Datastrukturer
Dessa datastrukturer är konsekventa genom hela applikationen.

- **`gameState` (Globalt):** Se definition i [Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)
- **`result` (Från minispel):** Se definition i [Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)
---

## Den Kritiska Bron: GameCanvasWrapper.jsx
Detta är den **viktigaste enskilda komponenten** i projektet. Den agerar som en säker och återanvändbar bro mellan React-världen och PixiJS-världen. Ett fel här fortplantar sig till alla canvas-baserade minispel. Dess kontrakt är därför extremt detaljerat.

### Kontrakt: `GameCanvasWrapper.jsx`
**Ansvar:** Att på ett säkert sätt hantera livscykeln för en PixiJS-applikation inuti en React-komponent. Den ska instansiera, hantera och (viktigast av allt) städa upp PixiJS-resurser för att förhindra minnesläckor.

#### Ingående Data (Props):

| Prop-namn | Datatyp | Beskrivning |
|-----------|---------|-------------|
| `pixiApplicationClass` | Class | En referens till den JavaScript-klass som definierar minispelets PixiJS-logik. Klassen måste följa ett strikt API (se nedan). |
| `onGameComplete` | Function | Callback-funktion som skickas vidare till PixiJS-applikationen. |
| `initialData` | Object | Ett objekt med startdata för minispelet (t.ex. budget, svårighetsgrad). |
#### Internt Flöde (Implementation i useEffect):

**Vid Montering** (`useEffect` med `[]`):
1. Skapa en ny instans av PixiJS-appen: `const app = new PIXI.Application(...)`
2. Montera canvas-elementet (`app.view`) i DOM:en via en React ref
3. Skapa en ny instans av den inkommande spel-klassen: `const game = new pixiApplicationClass(app, initialData, onGameComplete)`
4. Anropa en `start()`-metod på game-instansen

**Vid Avmontering** (`useEffect` returfunktion):
1. Anropa en `destroy()`-metod på game-instansen för att ta bort alla event-lyssnare
2. Anropa `app.destroy(true)` för att fullständigt förstöra PixiJS-appen och dess canvas, vilket är **kritiskt** för att undvika minnesläckor
#### Krav på `pixiApplicationClass` (API för PixiJS-spel):

Varje minispels-klass som skickas till denna wrapper **MÅSTE** ha följande metoder:

- **`constructor(pixiApp, initialData, onCompleteCallback)`:** Tar emot PixiJS-appen, startdata och callback-funktionen
- **`start()`:** Innehåller logiken för att sätta upp spelets scen, assets och starta spellopen
- **`destroy()`:** Innehåller logik för att ta bort alla egna event-lyssnare och timers för att förbereda för nedstängning
---

## Komponentbibliotek & Tekniska Kontrakt
Alla komponenter som definierats i tidigare dokument (`MainDashboard`, `Scoreboard`, `MapView`, `PuzzleGameModule`, etc.) och deras kontrakt är fortfarande giltiga. De ska utvecklas enligt [Operational Action Plan](../other/Operational_Action_Plan.md). Denna sektion har säkerställt att den mest komplexa komponenten av alla nu är specificerad med samma rigorösa tydlighet.
---

## Slutsats: Redo för Execution
Denna **Masterplan (v4.0)** är nu, i kombination med [Operational Action Plan](../other/Operational_Action_Plan.md) och [documentation_index.md](../../../documentation_index.md), den kompletta grunden för projektet. 

### Vi har:
- ✅ En arkitektur som hanterar komplexitet
- ✅ Ett visuellt språk som säkerställer konsekvens  
- ✅ En operativ process som minimerar risker och utnyttjar AI-teamet maximalt

**Det finns inget mer att tillägga på planeringsstadiet.** All ytterligare kunskap kommer från att nu praktiskt genomföra **Pilot-Sprinten** som beskrivs i docs/project_DNA/other/Operational_Action_Plan.md. 

> **Teorin är komplett. Det är dags att bygga.**
