# Game Design Document: Scenariospelet "Dilemmat med det smarta trygghetslarmet"

**Version:** 1.0  
**Status:** Klar för teamgranskning & implementation  
**Spelvärld:** Digitalisering av välfärden  

---

## 1. Projektöversikt & Vision

Denna spelmodul utmanar spelaren att gå från teknisk systemarkitektur till mänsklig implementering. Den utforskar de komplexa, etiska och mänskliga avvägningar som uppstår när ny teknik introduceras i välfärden, specifikt inom äldreomsorgen.

**Vision:** Spelaren ska uppleva en verksamhetsutvecklares verkliga dilemma: att balansera en individs önskan om frihet och integritet med organisationens ansvar för trygghet och effektivitet. Målet är att spelaren efteråt inte ser "välfärdsteknik" som enbart en teknisk pryl, utan som en lösning som måste designas med empati, dialog och samförstånd för att lyckas.

## 2. Berättelse & Scenario

Spelaren, i sin roll som digital strateg på FMS (som nu arbetar på uppdrag av en kommun), kallas in till ett möte. Kommunen vill implementera en ny generation "smarta trygghetslarm" med AI-drivna funktioner (t.ex. falldetektion och inaktivitetsvarningar) för äldre i hemtjänsten. Ett pilotprojekt ska startas med en specifik omsorgstagare, **Arne, 82 år**.

Mötet havererar nästan direkt. Arne är självständig och skeptisk till övervakning. Hans dotter, **Karin**, är orolig och vill ha maximal säkerhet. Hemtjänstpersonalen, representerad av **Lasse**, är stressad och orolig för mer administration och system som inte fungerar.

**Spelarens uppdrag** är att leda ett dialogmöte med dessa tre intressenter och komma fram till en gemensam konfiguration av det nya trygghetslarmet som alla kan acceptera.

## 3. Lärandemål (Härledda från Digitaliseringsstrategin)

### Personcentrerade och platsoberoende tjänster
Förstå att teknik måste anpassas till individens unika förmågor, behov och förutsättningar, inte tvärtom (Strategin, s. 34).

### Ökad livskvalitet vs. Säkerhet
Praktiskt uppleva och hantera den centrala avvägningen mellan en omsorgstagares integritet/autonomi och behovet av en säker välfärdstjänst (Strategin, s. 32).

### Minskad administration & förbättrad arbetsmiljö
Inse att införandet av ny teknik måste leda till reella förbättringar för personalen, inte bara bli ytterligare en administrativ börda (Strategin, s. 32, 34).

### Integritetssäker användning av teknik
Förstå vikten av att vara transparent och skapa samtycke kring hur data (t.ex. från sensorer i hemmet) samlas in och används (Strategin, s. 35, SOU 2025:39).

## 4. Pedagogisk Design & Strategikarta

Varje val spelaren gör är direkt kopplat till en avvägning som speglas i strategins målsättningar.

| **Strategins Kärnprincip** | **Källhänvisning (Sida)** | **Översättning till Spelmekanik (Dilemma i spelet)** | **Syfte & Lärande** |
|---|---|---|---|
| **Mer tid & förbättrad livskvalitet för mottagare** | 32, 34 | Arne uttrycker en stark önskan om att inte bli "övervakad". Val som respekterar hans integritet (t.ex. avaktivera vissa sensorer) ökar hans Autonomi-poäng. | Spelaren lär sig att "mer teknik" inte automatiskt är "bättre". Användarens upplevelse av frihet och värdighet är en central del av en lyckad implementering. |
| **Säkra välfärdstjänster av hög kvalitet** | 32 | Dottern Karin vill aktivera alla säkerhetsfunktioner, inklusive inaktivitetslarm. Val som ökar säkerheten (även på bekostnad av Arnes integritet) ökar Säkerhet-poängen. | Konkretiserar den svåra etiska balansen mellan riskminimering och individens självbestämmande. Det finns inget "perfekt" svar. |
| **Minskad administration & förbättrad arbetsmiljö för personal** | 32, 34 | Hemtjänstpersonalen Lasse är skeptisk. Val som förenklar hans arbete (t.ex. automatisk journalföring av larm) ökar Personalens välmående-poängen, medan komplexa inställningar sänker den. | Tvingar spelaren att se implementationen ur personalens perspektiv. En tekniskt perfekt lösning som skapar merarbete kommer att misslyckas i praktiken. |
| **Personcentrerad och förebyggande välfärd** | 34 | Spelaren får möjlighet att föreslå en "smart" funktion, t.ex. att larmet påminner Arne om att ta sin medicin. Detta är proaktivt, men kan också ses som förminskande av Arne. | Utforskar gränsen mellan hjälpsam, proaktiv teknik och teknik som tar över och blir påträngande. Lär spelaren att "personcentrerat" betyder att man utgår från personens egna önskemål. |

## 5. Spelmekanik & Dialogsystem

Spelet är ett **dialogträd**. Spelaren presenteras med en situation och karaktärernas uttalanden. Därefter får spelaren 2-3 svarsalternativ att välja mellan.

### Val och Konsekvens
Varje val påverkar fyra nyckelvärden som visas på skärmen i realtid:
- **Arnes Autonomi** (Grön mätare)
- **Trygghet & Säkerhet** (Blå mätare)  
- **Personalens Välmående** (Gul mätare)
- **Projektbudget** (Kvarvarande kronor)

**Mål:** Att slutföra dialogen och komma fram till en lösning där ingen av de tre första mätarna är på rött (kritiskt låg nivå) och budgeten inte är överskriden.

### Visualisering
Spelet utspelar sig som ett möte. Karaktärerna (enkla 2D-porträtt) visas, och deras ansiktsuttryck kan ändras (neutral, glad, orolig, irriterad) beroende på spelarens val.

## 6. Dialogträd & Nyckelbeslut (Exempel)

### Start
Spelaren presenteras för alla. 

**Karin (dottern):** "Jag har läst på. Jag vill att vi aktiverar allt. Falldetektion, GPS-spårning om han går ut, och larm om han inte rört sig i vardagsrummet på en timme. Säkerheten måste gå först." 

**Arne (omsorgstagaren):** "GPS-spårning?! Ska ni ha en elektronisk fotboja på mig? Jag är ingen fånge! Jag vill bara ha en knapp att trycka på om jag ramlar. Inget annat."

### Dilemma 1 - Spelarens val:

1. **"Karin, jag förstår din oro. Låt oss börja med de viktigaste säkerhetsfunktionerna."**  
   *Effekt: (+Säkerhet, --Autonomi)*

2. **"Arne, din självständighet är viktigast. Vi utgår från dina önskemål och ser vad vi kan lägga till."**  
   *Effekt: (++Autonomi, -Säkerhet)*

3. **"Låt oss titta på funktionerna en och en och se om vi kan hitta en kompromiss som känns bra för er båda."**  
   *Effekt: (Neutral start, öppnar för en mer balanserad väg)*

*...dialogen fortsätter med liknande avvägningar kring specifika funktioner, där Lasse (personalen) flikar in med praktiska synpunkter om hur larmen påverkar hans arbetsflöde.*

## 7. Vinst- & Förlustvillkor

### Perfekt Vinst ("Konsensuslösningen")
Alla tre mätare (Autonomi, Säkerhet, Personal) är på grönt. Spelaren får maximal poäng och en särskild utmärkelse: **"Dialogledaren"**.

### Godkänd Vinst ("Kompromissen")
Inga mätare är på rött, men en eller flera är på gult (medel). Spelaren har hittat en fungerande, men inte optimal, lösning.

### Förlust ("Implementeringsstopp")
En eller flera mätare hamnar på rött, eller budgeten tar slut. Mötet avslutas i oenighet. Spelaren får ett meddelande i stil med: *"Intressenterna kunde inte enas. Projektet pausas. Försök hitta en bättre balans mellan allas behov nästa gång."*

## 8. Tekniskt Kontrakt & Gränssnitt

Modulen ska implementeras som `WelfareGameModule.jsx` och är en ren React-komponent (inget PixiJS behövs här).

### Ingående Data (Props):
- `onGameComplete`: Function
- `initialBudget`: Number

### Utgående Händelser (Callback `onGameComplete`):
`onGameComplete({ success: Boolean, score: Number, budgetChange: Number, outcome: "String" })`

Där `outcome` kan vara t.ex. "Konsensus", "Kompromiss" eller "Implementeringsstopp".

## 9. Visuell Design & Ljud (Brief till Kreatörer)

### Stil
Varm, ren och tillgänglig. Tänk modern, mjuk design från en vårdgivare eller kommun. Fokus på människor, inte teknik.

### Karaktärsporträtt
Enkla, stiliserade 2D-porträtt. De ska kunna förmedla grundläggande känslor (neutral, glad, orolig, arg) genom subtila förändringar i ögonbryn och mun.

- **Arne:** Självständig, stolt, lite bister men med glimten i ögat
- **Karin:** Orolig, omtänksam, lite stressad  
- **Lasse:** Praktisk, jordnära, trött men engagerad

### Gränssnitt
Dialogrutorna ska vara stora och lättlästa. Mätarna för de fyra nyckelvärdena ska vara ständigt synliga men diskreta.

### Ljud
En lugn, ambient bakgrundsmusik. Subtila ljud för val och när mätarna ändras. Vid en lyckad lösning spelas en varm, hoppfull melodi. Vid förlust tystnar musiken.