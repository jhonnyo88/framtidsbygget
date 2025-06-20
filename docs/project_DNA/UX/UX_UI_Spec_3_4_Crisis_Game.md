# UX/UI Specifikation 3.4: Crisis Game

**Dokument:** Master UX/UI Specifikation: Framtidsbygget  
**Version:** 1.2  
**Status:** Levande Dokument  

---

## Minispelens Komponenter

## Krishanteringsspelet: "Konnektivitetsvakten" (ConnectivityGameModule.jsx)

### Referensdokumentation:
- **[GDD Crisis Game Connectivity Guardian](../game_design/GDD_Crisis_Game_Connectivity_Guardian.md)**
- **[Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)**
- **Arkitektur som Tekniskt Kontrakt** (Definierar `GameCanvasWrapper.jsx` för PixiJS)

**Syfte:** Att skapa ett dynamiskt nätverks- och krishanteringsspel i två faser. Spelaren ska först bygga ut och förstärka en digital infrastruktur (Fas 1) och sedan försvara den i realtid mot en serie kriser (Fas 2). Målet är att ge spelaren en intuitiv förståelse för principerna robusthet, resiliens och redundans.

### Lokal Datamodell & State Management

Modulen `ConnectivityGameModule.jsx` är komplex och kräver ett robust lokalt tillstånd (state):

#### Huvudtillstånd:
- **`gamePhase`:** `'build' | 'crisis' | 'end'` - Styr vilken fas av spelet som är aktiv

#### Infrastrukturtillstånd:
- **`mapInfrastructure`:** Object - Innehåller all information om spelarens nätverk:
  - **`nodes`:** Array<Object> (t.ex. städer, sjukhus). Varje objekt: `{ id, position, type, status: 'offline' | 'online' | 'damaged' | 'infected', isRobust: boolean }`
  - **`connections`:** Array<Object>. Varje objekt: `{ from, to, type: 'fiber' | '5g' }`
- **`budget`:** Number - Spelarens budget under byggfasen
- **`buildTool`:** `'fiber' | '5g_mast' | 'satellite' | 'robustness' | null` - Vilket byggverktyg som för närvarande är valt

#### Kristillstånd:
- **`crisisState`:** Object - Innehåller all data för krisfasen:
  - **`timer`:** Number - Sekunder kvar av krisfasen (startar på 300)
  - **`communityIndex`:** Number - Samhällsindexet (startar på 100)
  - **`activeCrises`:** Array<Object> - Lista över pågående kriser och deras effekter
  - **`securityPatchCooldown`:** Number - Timer för när säkerhetspatchen kan användas igen

### Layout & Komponent-sammansättning

Huvudvyn domineras av kartan, med kontextuella UI-element som ändras beroende på spelfas.

#### Huvudyta (`<GameCanvasWrapper>`)
En fullskärmskomponent som renderar PixiJS-applikationen där den interaktiva regionkartan visas. All rendering av noder, anslutningar och kris-effekter (stormar, cyberattacker) sker här.

#### HUD / Kontrollpanel
Renderas som React-komponenter ovanpå canvas-wrappern. Deras synlighet styrs av `gamePhase`.

**Om `gamePhase === 'build'`:**
- **`<BuildHUD>`:** Visar "Budget: [värde] kr" och en stor knapp "[Starta Krisfasen]"
- **`<BuildToolbar>`:** En panel (t.ex. längst ner) med knappar för att välja de olika byggverktygen (`fiber`, `5g_mast`, `robustness`)

**Om `gamePhase === 'crisis'`:**
- **`<CrisisHUD>`:** Visar "Tid Kvar: [timer]" och "Samhällsindex: [communityIndex]%". Indexet visas som en stor mätare (`<ValueMeter>`)
- **`<CrisisAlertFeed>`:** Ett flöde (t.ex. i ett hörn) som visar de senaste larmen

### Specifikation av Sub-komponenter

#### Byggverktygs-panel (`<BuildToolbar>`)

**Struktur:** En horisontell flex-container inuti en `<Card>`.

**Innehåll:** En serie knappar, en för varje byggverktyg. Varje knapp innehåller en ikon och en text (t.ex. `<Ikon ikon="route"/>` Fiberkabel).

**Interaktivitet:** När en knapp klickas, sätts `buildTool`-statet till motsvarande verktyg. Den aktiva knappen får en tydlig selected-stil (t.ex. primär-varianten av `<Button>`).

#### Krislarm (`<CrisisAlert>`)

**Struktur:** En liten, informativ `<Card>` som animeras in i `<CrisisAlertFeed>`.

**Innehåll:**
- **Ikon:** `warning`, `storm` eller `bug_report` beroende på kristyp
- **Text:** En kort, koncis beskrivning av händelsen, t.ex. "Cyberattack mot Vattenkraftverket!" eller "Kraftiga stormbyar i östra regionen!"

**Utseende:** Bakgrundsfärgen ska reflektera allvarsgraden (`var(--color-state-warning)` eller `var(--color-state-danger)`).

#### PixiJS-grafik (Internt i `<GameCanvasWrapper>`)

**Noder:** Renderas som cirklar i PixiJS. Deras tint (färg) ändras baserat på `node.status`:
- **`online`:** `0x2E7D32` (Grön). Pulserar svagt
- **`offline`:** `0x5A5A5A` (Grå)
- **`damaged`:** `0xC62828` (Röd). Blinkar
- **`infected`:** `0x8E24AA` (Lila). Har en pulserande "infektions"-aura

**Kris-effekter:** Stormar visualiseras som ett halvtransparent, svepande molnlager (`PIXI.Sprite`). En cyberattack visualiseras som pulserande lila ringar som sprider sig från en infekterad nod.

### Interaktions-loop & Spellogik

#### Fas 1: Byggfasen (`gamePhase === 'build'`)

##### Välj Verktyg
Spelaren klickar på en knapp i `<BuildToolbar>`, vilket sätter `buildTool`-state.

##### Bygg på Kartan
Spelaren klickar på kartan (en händelse från PixiJS-canvasen anropar en React-funktion):
- **Logik:** Beroende på `buildTool` (t.ex. "dra fiber", "placera mast", "uppgradera robusthet"), kontrollerar en funktion om åtgärden är giltig och om budget räcker
- **Uppdatering:** Om giltig, uppdateras `mapInfrastructure` och `budget` i React-state. Ett `useEffect` ser till att PixiJS-canvasen ritas om baserat på det nya statet

##### Avsluta Fas
När spelaren är nöjd, klickar hen på "[Starta Krisfasen]". En bekräftelsemodal visas. Vid bekräftelse, sätts `gamePhase` till `'crisis'`.

#### Fas 2: Krisfasen (`gamePhase === 'crisis'`)

##### Start
En `setInterval`-loop startas (t.ex. varje sekund). `timer`-statet börjar räknas ner.

##### setInterval-loopens logik:
A. **Kris-generator:** Slumpa fram om en ny kris ska inträffa. Om ja, lägg till den i `activeCrises`-arrayen och uppdatera status på påverkade noder i `mapInfrastructure`

B. **Index-uppdatering:** Beräkna `communityIndex` baserat på hur många viktiga noder som har status `damaged` eller `infected`

C. **Vinst/Förlust-kontroll:**
- `if (timer <= 0)` → Vinst! Anropa `onGameComplete({ success: true, ... })`
- `if (communityIndex < 50)` → Förlust! Anropa `onGameComplete({ success: false, ... })`. Stoppa loopen

##### Spelarens Interaktion:
- **Reparera:** Klick på en `damaged`-nod skickar ett reparationsteam (visuellt i PixiJS) och startar en reparationstimer för just den noden
- **Säkra:** Klick på en `infected`-nod, om `securityPatchCooldown === 0`, tar omedelbart bort infektionen och startar nedkylningstimern

### Feedback & Dialogrutor

#### Introduktionstext (visas innan byggfasen):

- **Rubrik:** "Konnektivitetsvakten"
- **Text:** "Du har fått ansvaret för den digitala infrastrukturen i region Norra Mälardalen. Använd din budget för att bygga ett nätverk som ansluter regionens samhällsviktiga funktioner. Tänk på robusthet och redundans – en storm är på väg."
- **Knapp:** "[Påbörja byggandet]"

#### Bekräftelsemodal (när man klickar på "Starta Krisfasen"):

- **Rubrik:** "Är du redo?"
- **Text:** "När krisfasen inleds kan du inte längre bygga eller uppgradera ditt nätverk. Ditt enda uppdrag blir att försvara det du har byggt i 5 minuter. Är du säker på att du vill fortsätta?"
- **Knappar:** "[Avbryt]", "[Starta Krisen]"