Master UX/UI Specifikation: Framtidsbygget
Version: 1.2 Status: Levande Dokument
DEL 3: Minispelens Komponenter
3.3 Resursspelet: "Kompetensresan" (CompetenceGameModule.jsx)
A. Modulöversikt
Referensdokumentation:
GDD: Resursspelet Kompetensresan
Master GDD: Den kompletta specifikationen för Framtidsbygget
Syfte: Att skapa ett strategiskt resurshanteringsspel där spelaren under tidspress (12 månader/rundor) och med begränsad budget måste höja en organisations digitala kompetens. Spelaren ska lära sig att balansera investeringar i bas-, bredd- och spetskompetens och förstå att kompetensutveckling är en strategisk, kontinuerlig process.
B. Lokal Datamodell & State Management
Modulen CompetenceGameModule.jsx behöver hantera följande lokala tillstånd (state):
gameData: Object. En datastruktur som innehåller all statisk speldata, inklusive alla möjliga Åtgärdskort och Händelsekort från GDD:n.
competenceLevels: Object. Håller de aktuella värdena (0-100) för de tre kompetensmätarna.
base: Number
broad: Number
specialist: Number
budget: Number. Spelarens nuvarande "Kompetensmiljoner".
currentMonth: Number. Räknare från 1 till 12, som representerar spelrundan.
playerHand: Array<Object>. En array med de 3 Åtgärdskort som spelaren för närvarande kan välja mellan.
activeEvent: Object | null. Det Händelsekort som eventuellt är aktivt för den innevarande månaden.
selectedCardId: String | null. ID för det kort i playerHand som spelaren har valt.
C. Layout & Komponent-sammansättning
Vyn är designad som en central "instrumentpanel" (Dashboard) för att ge spelaren full överblick.
Övre Sektion (<GameStatusHUD>): Placerad högst upp.
Vänster: "Budget: [värde] Kompetensmiljoner".
Höger: Tidslinjen (<Timeline>), som visar den aktuella månaden.
Mellersta Sektion (<CompetenceMetersArea>): Huvudfokus i vyn.
Tre stora <CompetenceMeter>-komponenter visas sida vid sida för "Digital Baskompetens", "Digital Breddkompetens" och "Digital Spetskompetens".
Nedre Sektion (<PlayerActionArea>): Där spelaren interagerar med spelet.
Handen (<PlayerHand>): En horisontell flex-container som visar de tre <ActionCard>-komponenterna från playerHand-arrayen.
Spel-knapp (<PlayButton>): En central knapp under handen, t.ex. "[Genomför åtgärd]".
D. Specifikation av Sub-komponenter
D.1 Kompetensmätare (<CompetenceMeter>)
Struktur: En vertikal komponent inuti en <Card>.
Innehåll:
Etikett (<p>): Namnet på kompetensen (t.ex. "Digital Spetskompetens"). Stil: label.
Mätare: En stor, vertikal implementation av <Meter> från kärnkomponenterna (se 1.5.3). Mätaren ska ha en tydlig linje som markerar målnivån.
Värde (<p>): Det numeriska värdet (t.ex. "85 / 100"). Stil: heading-m.
D.2 Åtgärdskort (<ActionCard>)
Struktur: Renderas som en interaktiv <Card> (se 1.5.2) från kärnkomponenterna. Kortet har en .is-selected-klass när selectedCardId matchar kortets ID.
Innehåll (från kortets dataobjekt):
Titel (<h3>): Kortets namn, t.ex. "Workshop i datavisualisering".
Effekt (<div>): Tydlig visuell representation av effekten.
Ikon som representerar kompetenstyp (t.ex. school för Bas, groups för Bredd, psychology för Spets).
Text: "+15 Breddkompetens". Stil: body-l.
Kostnad (<div>): Visas längst ner på kortet.
Ikon: savings.
Text: "Kostnad: 3 miljoner". Stil: body-m. Färg: var(--color-text-secondary).
D.3 Händelsekorts-modal (<EventCardModal>)
Struktur: En modal som visas i början av en runda om activeEvent inte är null.
Innehåll (från activeEvent-objektet):
Ikon: En stor ikon som representerar händelsen (t.ex. trending_down för budgetnedskärning, security för nytt säkerhetshot).
Rubrik (<h1>): "HÄNDELSE!".
Titel (<h2>): Händelsens namn, t.ex. "Budgetnedskärning".
Beskrivning (<p>): Text som förklarar effekten, t.ex. "Regeringen har beslutat om besparingar. Din budget minskas omedelbart med 5 miljoner."
Knapp: <Button> med texten "[Okej]" som stänger modalen.
E. Interaktions-loop & Spellogik (per runda)
Starta Runda: Spelaren klickar på en "Nästa månad"-knapp. currentMonth ökar med 1.
Händelsefas:
En funktion slumpar fram om ett Händelsekort ska dras denna runda.
Om ja: activeEvent sätts, modalen visas. När spelaren klickar "Okej" appliceras händelsens effekt (t.ex. setBudget(prev => prev - 5)) och activeEvent sätts till null.
Åtgärdsfas:
playerHand fylls med 3 slumpmässiga Åtgärdskort från gameData. selectedCardId nollställs.
Valfas:
Spelaren klickar på ett av de tre korten i playerHand. Kortets ID sparas i selectedCardId.
Den primära spel-knappen (t.ex. "[Genomför åtgärd]") blir nu aktiv (inte disabled).
Genomförandefas:
Spelaren klickar på den aktiva spel-knappen.
onClick-händelsen triggar handlePlayCard():
Hämta det valda kortet från playerHand via selectedCardId.
KONTROLL (Budget): if (budget < card.cost) -> Visa felmeddelande. Avbryt.
Om kontrollen passerar:
setBudget(prev => prev - card.cost).
setCompetenceLevels(prev => ({ ...prev, [card.competenceType]: prev[card.competenceType] + card.effect })).
Slutfas & Vinst/Förlust-kontroll:
KONTROLL (Slut på spelet): if (currentMonth === 12) -> Kör checkWinCondition().
checkWinCondition():
if (competenceLevels.base >= GOAL_LEVEL && competenceLevels.broad >= GOAL_LEVEL && competenceLevels.specialist >= GOAL_LEVEL) -> onGameComplete({ success: true, ... }).
Annars -> onGameComplete({ success: false, outcome: 'Målen uppnåddes inte i tid. AI-plattformen kunde inte lanseras framgångsrikt.' }).
Om currentMonth < 12, väntar spelet på att spelaren ska starta nästa runda.
F. Feedback & Dialogrutor
Introduktionstext (visas innan första rundan):
Rubrik: "Kompetensresan: 12 månader till framtiden"
Text: "En ny AI-plattform ska lanseras, men personalens kompetensnivåer är för låga. Du har 12 månader och en fast budget på dig att höja kompetensen inom organisationen. Välj dina investeringar klokt. Klockan tickar."
Knapp: "[Påbörja uppdraget]"
