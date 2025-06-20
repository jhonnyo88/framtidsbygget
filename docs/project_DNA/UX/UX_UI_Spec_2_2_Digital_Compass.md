# UX/UI Specifikation 2.2: Digital Compass

**Dokument:** Master UX/UI Specifikation: Framtidsbygget  
**Version:** 1.1  
**Status:** Levande Dokument  

---

## Ramverkets Komponenter

## Den Digitala Kompassen (DigitalaKompassen.jsx)

### Referensdokumentation:
- **[Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)** - [cite: 236, 270-275]
- **Arkitektur som Tekniskt Kontrakt**
- **[Design Deliverable Complete](Design_Deliverable_Complete.md)**

**Syfte:** Att fungera som ett interaktivt och visuellt verktyg där spelaren kan utforska den underliggande digitaliseringsstrategin som spelet bygger på. Kompassen visualiserar spelarens framsteg och förståelse för strategins olika delar, vilket gör den till spelets primära lärandeverktyg.

### Struktur & Layout

**Implementation:** Komponenten renderas som en fullskärms-modal eller en dedikerad "sida" som täcker hela vyn. Den ska ha en tydlig "Stäng"-knapp (med en `close`-ikon) i övre högra hörnet för att återgå till `MainDashboard.jsx`.

#### Layout: 
Gränssnittet delas in i två vertikala sektioner:
- **Vänster sektion (ca 70% bredd):** Denna yta är dedikerad till den interaktiva träd-visualiseringen
- **Höger sektion (ca 30% bredd):** En sidopanel som visar detaljerad information om den nod som för närvarande är vald i trädet

### Komponent: Träd-visualisering

#### Teknisk specifikation:

**Datakälla:** Som specificerat i [Master GDD](../game_design/Master_GDD_Complete_Specification.md), ska komponenten läsa in sin datastruktur från en lokal `strategy.json`-fil. Denna fil innehåller den hierarkiska informationen för strategins alla delar.

**Renderingsbibliotek:** För att rendera datan som ett interaktivt träd, rekommenderas ett specialiserat bibliotek som `react-d3-tree` eller liknande. Detta ger funktionalitet för panorering och zoomning "out of the box", vilket är ett krav för användarvänligheten.

#### Nod-design & Status:

Varje nod i trädet ska representeras av en SVG `<circle>` och en `<text>`-etikett. Nodens utseende ska dynamiskt ändras baserat på dess status i `gameState.compassProgress`.

**Om `status === 'locked'`:**
- **Utseende:** Noden är visuellt nedtonad
- **Cirkel:** `fill: #BDBDBD`, `stroke: #9E9E9E`
- **Text:** `fill: var(--color-text-secondary)`, `opacity: 0.7`
- **Interaktivitet:** Ej klickbar

**Om `status === 'unlocked'`:**
- **Utseende:** Noden är tydligt interaktiv
- **Cirkel:** `fill: var(--color-brand-secondary)`, `stroke: var(--color-brand-primary)`, `stroke-width: 2px`
- **Text:** `fill: var(--color-text-primary)`
- **Interaktivitet:** Klickbar. Vid hover ska cirkelns `fill` ändras till en ljusare nyans av den primära färgen

**Om `status === 'mastered'`:**
- **Utseende:** Noden är tydligt markerad som en stor framgång
- **Cirkel:** `fill: var(--color-state-success)`, `stroke: var(--color-accent-innovation)`, `stroke-width: 3px`
- **Animation:** En pulserande `@keyframes pulse-mastered` ska appliceras på nodens `stroke` för att den ska glöda svagt, i enlighet med [Master GDD](../game_design/Master_GDD_Complete_Specification.md)
- **Interaktivitet:** Klickbar

**Anslutningslinjer:** Linjerna (`<path>`) som binder samman noderna ska vara stilrena. `stroke: #BDBDBD`, `stroke-width: 1.5px`.

### Komponent: Informationspanel (Sidebar)

**Syfte:** Att visa kontextuell information om den nod som är vald i träd-visualiseringen.

**Struktur:** Panelen renderas som en `<Card>` (se 1.5.2) som fyller den högra sektionen.

#### Tillstånd:

**Standardvy (ingen nod vald):**
- En centrerad ikon (`touch_app`) och en text (`<p>`) med budskapet: "Välj en nod i kompassen för att läsa mer om strategin."

**Vald nod-vy:** När en nod klickas på, rensas standardvyn och panelen fylls med följande information från nodens dataobjekt:
- **Titel (`<h2>`):** `node.title`. **Stil:** `heading-m`
- **Beskrivning (`<p>`):** `node.description`. **Stil:** `body-m`
- **Koppling till spel (`<div>`):** Om noden är kopplad till ett specifikt minispel (`node.relatedGame`), ska en särskild sektion visas med:
  - **Etikett:** "PRAKTISERAS I UPPDRAGET:". **Stil:** `label`
  - **Värde:** Namnet på minispelet, t.ex. "Krishanteringsspelet: Konnektivitetsvakten". Detta värde ska vara en länk som, vid klick, stänger kompassen och markerar motsvarande uppdrag på MapView om det är upplåst.

### Interaktivitet & Dataflöde

1. Komponenten `DigitalaKompassen.jsx` mountas och hämtar `strategy.json`
2. Den tar emot `gameState.compassProgress` som en prop
3. Trädet renderas, där varje nods visuella stil bestäms genom att mappa dess id mot statusen i `compassProgress`-propen
4. Användaren klickar på en upplåst/bemästrad nod
5. Ett lokalt state inom komponenten, `selectedNode`, uppdateras med data från den klickade noden
6. Informationspanelen renderas om och visar informationen från `selectedNode`
7. En visuell markering (t.ex. en tjockare, mörkare `stroke` på cirkeln) appliceras på den valda noden i trädet för att visa att den är aktiv