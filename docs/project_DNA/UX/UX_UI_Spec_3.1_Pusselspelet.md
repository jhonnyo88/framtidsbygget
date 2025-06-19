Master UX/UI Specifikation: Framtidsbygget
Version: 1.2 Status: Levande Dokument
DEL 3: Minispelens Komponenter
3.1 Pusselspelet: "Säker Datasystem" (PuzzleGameModule.jsx)
A. Modulöversikt
Referensdokumentation:
GDD: Pusselspelet Säker Datasystem v1.0
Master GDD: Den kompletta specifikationen för Framtidsbygget
Arkitektur som Tekniskt Kontrakt
Syfte: Att skapa ett interaktivt pussel där spelaren löser en dataflödesutmaning. Spelaren ska praktiskt uppleva hur man bygger ett sammanhängande och säkert informationsflöde enligt principerna om en gemensam infrastruktur, säkerhet (GDPR) och modernisering.
B. Lokal Datamodell & State Management
För att fungera behöver modulen PuzzleGameModule.jsx hantera följande lokala tillstånd (state):
nodes: Array<Object>. En array som innehåller alla datanoder från GDD:n [cite: "GDD: Pusselspelet Säker Datasystem v1.0"]. Varje objekt innehåller id, name, type ('source' eller 'internal'), dataType ('person' eller 'org'), isLegacy (boolean), och requirements (en beskrivning av vad noden behöver).
connections: Array<Object>. En lista över alla anslutningar spelaren har gjort. Varje objekt: { id: 'string', fromNode: 'string', toNode: 'string', status: 'valid' | 'invalid_firewall' }.
budget: Number. Spelarens nuvarande budget, initierad från initialBudget-propen.
activeModal: null | 'modernize' | 'insufficient_funds'. Styr vilken modal som visas.
dragState: Object | null. Hanterar en pågående dra-operation: { fromNode: 'string', mousePosition: {x, y} }.
C. Layout & Komponent-sammansättning
Spelplanen renderas i en fullskärmsvy och är strukturerad som följer:
Header (<GameHUD>): Placerad högst upp.
Vänster: "Uppdrag: Säker Datasystem".
Höger: "Budget: [värde] kr" (från budget-state).
Mitten: Instruktionstext: "Dra anslutningar från källorna, via Ena-hubben, till de interna systemen."
Spelyta (<GameBoard>): Använder CSS Grid för att skapa tre kolumner.
Kolumn 1 (<SourceColumn>): Innehåller <DataNode>-komponenter där node.type === 'source'.
Kolumn 2 (<InfrastructureColumn>): Innehåller <EnaHub> och <Firewall>-komponenter.
Kolumn 3 (<InternalColumn>): Innehåller <DataNode>-komponenter där node.type === 'internal'.
Anslutningslager (<ConnectionLayer>): Ett SVG-lager som ligger över hela GameBoard för att rendera alla <ConnectionLine>-komponenter från connections-arrayen.
D. Specifikation av Sub-komponenter
D.1 Datanod (<DataNode>)
Struktur: En <Card> (se 1.5.2) med fast storlek.
Innehåll:
Titel, ikoner för datatyp (se 3.1.2 i föregående dokument).
Kravlista: En <ul>-lista som renderar node.requirements. Varje <li> får en check_circle-ikon när just det kravet är uppfyllt.
Tillstånd:
.is-legacy: Appliceras om node.isLegacy === true och !node.isModernized. Ger noden ett "gammalt" utseende.
.is-complete: Appliceras när alla krav är uppfyllda. Ger noden en grön, pulserande kantlinje (border-color: var(--color-state-success)).
D.2 Brandvägg (<Firewall>)
Struktur: En semi-transparent rektangel med en shield-ikon.
Utseende: background-color: rgba(255, 23, 68, 0.1), border: 2px dashed var(--color-state-danger). Den ska placeras så att den täcker den primära anslutningsvägen från "Försäkringskassan" som beskrivs i GDD:n.
E. Interaktions-loop & Spellogik
Detta är den exakta logiken som AI-utvecklaren ska implementera.
Starta anslutning:
onMouseDown på en anslutningspunkt på en <DataNode>:
KONTROLL 1 (Modernisering): if (node.isLegacy && !node.isModernized) -> Anropa setActiveModal('modernize'). Avbryt operationen.
Om kontroll 1 passerar: Sätt dragState med fromNode och startposition.
Dra anslutning:
onMouseMove: Uppdatera dragState.mousePosition. SVG-linjen i <ConnectionLayer> följer efter.
Släpp anslutning:
onMouseUp på en anslutningspunkt på en annan nod (targetNode):
KONTROLL 2 (Ena-hubben): En anslutning är giltig endast om den går från source->hub, eller hub->internal. Direktkoppling source->internal är ogiltig.
KONTROLL 3 (Brandvägg): if (fromNode.dataType === 'person' && path_crosses_firewall) -> Anslutningen är ogiltig. Skapa en anslutning med status: 'invalid_firewall'.
Resultat:
Om giltig: Lägg till anslutningen i connections-arrayen med status: 'valid'.
Om ogiltig: Skapa en anslutning med fel-status, som blir röd. Denna kan tas bort av spelaren.
Rensa dragState till null.
Kontrollera Vinstvillkor:
Efter varje giltig anslutning, kör en funktion checkWinCondition().
Denna funktion loopar igenom alla interna noder (node.type === 'internal').
För varje intern nod, verifierar den att connections-arrayen uppfyller dess requirements.
if (alla_interna_noders_krav_är_uppfyllda) -> Anropa onGameComplete({ success: true, ... }).
F. Feedback & Dialogrutor
Detta är det exakta innehållet för all UI-text för att undvika tvetydighet.
Modal: Modernisering (activeModal === 'modernize')
Ikon: update
Rubrik (<h1>): "Modernisering krävs"
Text (<p>): "Detta system ('Lantmäteriet') är föråldrat och måste standardiseras innan det kan anslutas till Ena-infrastrukturen. Detta är en nödvändig investering för ett hållbart och säkert datautbyte."
Kostnadstext (<p>): "Kostnad: 50 budgetenheter."
Knappar:
<Button variant="secondary">: "Avbryt" (stänger modalen).
<Button variant="primary">: "Godkänn investering" (anropar en funktion som drar av budget, uppdaterar node.isModernized = true och stänger modalen).
Modal: Otillräcklig Budget (activeModal === 'insufficient_funds')
Ikon: account_balance_wallet
Rubrik (<h1>): "Otillräcklig budget"
Text (<p>): "Du har inte tillräckligt med budget för att genomföra denna modernisering."
Knapp:
<Button variant="primary">: "Okej" (stänger modalen).
Tooltip (vid hover över brandväggs-blockerad kabel):
"Anslutningsfel: Känsliga personuppgifter kan inte dras genom en oskyddad zon. Använd en annan anslutningspunkt på Ena-hubben för att kringgå brandväggen."
