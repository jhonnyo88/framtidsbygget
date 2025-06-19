Master UX/UI Specifikation: Framtidsbygget
Version: 1.2 Status: Levande Dokument
DEL 3: Minispelens Komponenter
3.5 Strategispelet: "Ekosystembyggaren" (EcosystemGameModule.jsx)
A. Modulöversikt
Referensdokumentation:
GDD: Strategispelet Ekosystembyggaren
Master GDD: Den kompletta specifikationen för Framtidsbygget
Syfte: Att skapa ett avslutande, strategiskt simuleringsspel där spelaren agerar på nationell nivå för att främja Sveriges digitala näringsliv. Spelaren ska genom att implementera policyer förstå hur staten kan agera som en "möjliggörare" för innovation, konkurrenskraft och hållbarhet.
B. Lokal Datamodell & State Management
Modulen EcosystemGameModule.jsx behöver hantera följande lokala tillstånd (state):
gameData: Object. En datastruktur som innehåller alla möjliga Policy-kort och Marknadshändelse-kort från GDD:n.
metrics: Object. Håller de aktuella värdena (0-100) för de fyra nyckelmätarna.
innovation: Number
competitiveness: Number
cybersecurity: Number
sustainability: Number
budget: Number. Spelarens "Innovationsmiljarder".
currentQuarter: Number. Räknare från 1 till 10, som representerar spelrundan.
policyHand: Array<Object>. En array med de Policy-kort som spelaren kan välja att implementera denna runda.
playedPolicies: Array<Object>. En lista över de policyer som redan har implementerats.
activeMarketEvent: Object | null. Det Marknadshändelse-kort som är aktivt för den innevarande rundan.
companies: Array<Object>. En lista över företagen i ekosystemet. Varje objekt: { id, name, type: 'Startup' | 'Tillväxtbolag' | 'Storindustri' | 'Enhörning' }.
C. Layout & Komponent-sammansättning
Vyn är designad som en sofistikerad nationell "dashboard".
Övre Sektion (<GameStatusHUD>): Placerad högst upp.
Vänster: "Runda: [värde] / 10".
Höger: "Strategisk Budget: [värde] Innovationsmiljarder".
Huvudsektion (<DashboardLayout>): En grid-layout.
Vänster Panel (<MetricsPanel>): En framträdande panel som visar de fyra <MetricDisplay>-komponenterna.
Mitten Panel (<CompanyEcosystem>): En visuell representation av de olika Företagskorten (companies-arrayen), kanske i en flödande, organisk layout.
Höger Panel (<PlayerActionPanel>): Spelarens hand med Policy-kort och en knapp för att avsluta rundan.
D. Specifikation av Sub-komponenter
D.1 Mätar-display (<MetricDisplay>)
Struktur: En elegant komponent inuti en minimalistisk <Card>.
Innehåll:
Ikon & Titel: T.ex. <Ikon ikon="lightbulb"/> Innovationskraft.
Visualisering: Inte en enkel mätare, utan ett snyggt cirkeldiagram eller en "gauge"-mätare (t.ex. med hjälp av ett diagrambibliotek som Recharts).
Värde (<p>): Det numeriska värdet visas stort i mitten av diagrammet. Stil: heading-l.
D.2 Policy-kort (<PolicyCard>)
Struktur: En interaktiv <Card> med en professionell och "officiell" design.
Utseende: Kan ha en sidobård med en färg som indikerar vilken mätare kortet primärt påverkar (t.ex. lila för innovation).
Innehåll (från kortets dataobjekt):
Titel (<h3>): Kortets namn, t.ex. "FoU-avdrag för AI-forskning".
Beskrivning (<p>): En kort text som förklarar policyn.
Effekt & Kostnad (<div>): Tydlig visning med ikoner, t.ex. +10 Innovationskraft, Kostnad: 5 miljarder.
Interaktivitet: Spelaren klickar på kortet för att välja det. En selected-state appliceras. Flera kort kan väljas så länge budgeten räcker.
D.3 Företagskort (<CompanyCard>)
Struktur: En mindre <Card> som representerar ett företag.
Innehåll: Företagets namn och en ikon som representerar dess typ (t.ex. rocket_launch för Startup, domain för Storindustri).
Animation: När ett företag "växer" (dess type ändras i companies-statet), ska kortet ha en "flip"- eller "evolve"-animation för att ge belönande feedback. Bakgrundsfärgen eller ikonen kan ändras för att visa den nya statusen.
E. Interaktions-loop & Spellogik (per runda)
Starta Runda & Händelsefas:
currentQuarter ökar med 1.
Ett Marknadshändelse-kort dras och visas i en modal. Spelaren klickar "Okej", och händelsens effekt appliceras på metrics eller budget.
Policyfas:
policyHand fylls med ett antal nya Policy-kort.
Spelaren väljer ett eller flera kort från sin hand. För varje valt kort uppdateras en "total kostnad"-summa i UI:t.
Genomförandefas:
Spelaren klickar på en knapp: "[Implementera Policy]".
onClick-händelsen triggar handleImplementPolicies():
KONTROLL (Budget): if (total_cost > budget) -> Visa felmeddelande.
Om kontrollen passerar:
Dra av kostnaden från budget.
Loopa igenom de valda korten och applicera deras effects på metrics-objektet.
Flytta de spelade korten till playedPolicies-arrayen.
Resultatfas & Uppväxling:
useEffect-hook som lyssnar på ändringar i metrics:
Kör en funktion checkCompanyGrowth().
Denna funktion kontrollerar om någon mätare har passerat en tröskel som får ett företag att växa (t.ex. if (metrics.innovation > 50 && company.type === 'Startup')).
Om ja, uppdatera det specifika företagets type i companies-statet, vilket triggar en visuell animation på det kortet.
Slutfas & Vinst/Förlust-kontroll:
När spelaren är redo (eller efter att policyer implementerats), klickar hen på "[Nästa Kvartal]" för att starta nästa runda.
KONTROLL (Slut på spelet): if (currentQuarter === 10) -> Kör checkWinCondition().
checkWinCondition(): Jämför de slutgiltiga metrics-värdena mot de fördefinierade målnivåerna. Anropa onGameComplete med success: true eller success: false baserat på utfallet.
F. Feedback & Dialogrutor
Introduktionstext (visas innan första rundan):
Rubrik: "Ekosystembyggaren"
Text: "Du har kallats till den nationella digitaliseringsgruppen. Ditt uppdrag är att använda din strategiska budget för att implementera policyer som lyfter hela Sveriges näringsliv. Dina beslut kommer att forma nationens digitala ekosystem för årtionden framöver."
Knapp: "[Påbörja uppdraget]"
