# Samlad Designleverans: "Framtidsbygget"

**Version:** 1.0  
**Till:** UX-Designer & Systemarkitekt (för granskning)  
**Från:** Speldesigner/Ämnesexpert  
**Syfte:** Att utgöra det kompletta, konsoliderade designunderlaget för spelet "Framtidsbygget". Detta dokument sammanfattar och länkar samman alla tidigare GDD:er och utgör den primära källan för den fortsatta UX-designen och arkitekturarbetet.

---

## 1. Projektvision & Övergripande Koncept

"Framtidsbygget" är ett webbaserat, interaktivt lärandespel designat för att på ett engagerande sätt omsätta Sveriges digitaliseringsstrategi till praktisk och meningsfull kunskap för verksamhetsutvecklare inom offentlig sektor. Spelet är en resa i fem delar, plus ett övergripande ramverk, som tillsammans simulerar de komplexa utmaningar och möjligheter som en nationell digital transformation innebär.

## 2. Kärnprinciper för UX-Design & Visuell Gestaltning

Som designer är det avgörande att du i ditt arbete beaktar följande kärnprinciper, vilka utgör själva själen i spelupplevelsen:

### Klarhet före Skönhet
Målgruppen är professionell. Gränssnittet måste vara extremt tydligt, intuitivt och lättläst. Varje ikon, mätare och knapp måste ha ett otvetydigt syfte. Tänk "informativ dashboard" och "pedagogiskt verktyg" snarare än "konstnärligt spel".

### Belönande Feedback
Varje handling spelaren gör måste leda till en omedelbar och tillfredsställande feedback. När en poängmätare fylls på, när en karta uppdateras, eller när ett kort spelas – dessa ögonblick ska kännas meningsfulla genom subtila men tydliga animationer och ljud.

### Känslomässig Resonans
Spelet växlar mellan logiska pussel och mänskliga dilemman. Den visuella stilen måste kunna anpassa sig. "Konnektivitetsvakten" kan ha en sval, teknisk och spänd estetik, medan "Välfärdens Dilemma" måste ha en varm, mjuk och empatisk framtoning.

### Respekt för Målgruppen
Undvik infantiliserande eller överdrivet "gamiga" element. Belöningar ska vara i form av "Utmärkelser" och "Insikter", inte "guldmynt" och "explosioner". Tonaliteten är professionell, uppmuntrande och intelligent.

## 3. Innehåll i Denna Designleverans

Denna leverans består av två huvuddelar: **Ramverket** (hur spelet hänger ihop) och de **fem Minispelen** (de fristående uppdragen).

### DEL A: Ramverket & Spelarresan

Detta beskriver den övergripande strukturen som binder samman hela upplevelsen.

**Referensdokument:** [Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)

#### Komponenter att designa (UX):

- **Onboarding-sekvensen:** En serie guidade vyer och modaler som introducerar spelet
- **Huvudnavet ("Digitala Sverige"-kartan):** Den centrala hemskärmen. Designen måste inkludera en visuell representation av Sverige, de 5 klickbara regionerna, den globala poängtavlan och knappen till "Kompassen"
- **Visuell Progression på Kartan:** En specifikation för hur kartan visuellt förändras efter varje slutfört minispel (t.ex. hur dataflöden eller nya ikoner animeras fram)
- **Den Digitala Kompassen:** En design för det interaktiva "mind map"-verktyget, inklusive hur en vald nod och dess information presenteras
- **Finalen ("Årsrapporten"):** En serie skärmar som på ett elegant och dynamiskt sätt presenterar spelarens slutresultat och utmärkelser

### DEL B: De Fem Minispelen

Varje minispel är ett unikt uppdrag med en egen spelmekanik och ett eget GDD.

#### 1. Pusselspelet "Säker Datasystem"

**Referensdokument:** [GDD Puzzle Game Secure Data Systems](../game_design/GDD_Puzzle_Game_Secure_Data_Systems.md)

**Kärnmekanik:** Logiskt pussel (Dra & Släpp)

**Nyckelobjekt att designa (UX):** Spelplanen, Datanoder (med olika tillstånd: modern/gammal, person/org-data), Ena-hubben, Brandväggs-ikoner, Anslutningskablar (med olika tillstånd: korrekt/fel)

#### 2. Scenariospelet "Välfärdens Dilemma"

**Referensdokument:** [GDD Scenario Game Welfare Dilemma](../game_design/GDD_Scenario_Game_Welfare_Dilemma.md)

**Kärnmekanik:** Dialogbaserat scenariospelet

**Nyckelobjekt att designa (UX):** Dialoggränssnittet, de tre karaktärsporträtten (med olika känslouttryck), de fyra nyckelmätarna (Autonomi, Säkerhet, etc.), svarsalternativ-knappar

#### 3. Resursspelet "Kompetensresan"

**Referensdokument:** [GDD Resource Game Competence Journey](../game_design/GDD_Resource_Game_Competence_Journey.md)

**Kärnmekanik:** Strategisk resurshantering (Kortspel)

**Nyckelobjekt att designa (UX):** Den centrala dashboarden, de tre kompetensmätarna, designmall för Åtgärdskort och Händelsekort, tidslinjen (1-12 månader)

#### 4. Krishanteringsspelet "Konnektivitetsvakten"

**Referensdokument:** [GDD Crisis Game Connectivity Guardian](../game_design/GDD_Crisis_Game_Connectivity_Guardian.md)

**Kärnmekanik:** Nätverksbyggande & Krishantering

**Nyckelobjekt att designa (UX):** Regionkartan (bygg-vyn), infrastruktur-ikoner (master, fiber, etc.), gränssnitt för att uppgradera robusthet, kris-overlay (storm-effekter, cyberattack-visualisering), "Samhälls-index"-mätaren

#### 5. Strategispelet "Ekosystembyggaren"

**Referensdokument:** [GDD Strategy Game Ecosystem Builder](../game_design/GDD_Strategy_Game_Ecosystem_Builder.md)

**Kärnmekanik:** Ekosystem-simulering (Kortspel)

**Nyckelobjekt att designa (UX):** Den nationella dashboarden, de fyra nyckelmätarna (Innovation, etc.), designmall för Policy-kort och Marknadshändelse-kort, den visuella representationen av Företagskorten och deras "evolution"

## 4. Nästa Steg & Min Roll Framåt

Med denna samlade leverans är bollen nu hos dig, UX-designern. Ditt uppdrag är att omvandla dessa detaljerade funktionella och pedagogiska krav till en konkret visuell och interaktiv design – en serie wireframes, mockups och klickbara prototyper som ger liv åt visionen.

Jag ser fram emot att se dina första utkast och finns tillgänglig under hela din process för att svara på frågor, ge feedback och säkerställa att den pedagogiska kärnan och den tänkta spelkänslan bevaras i din visuella tolkning. När du är klar ser jag fram emot att se systemarkitekten ta ditt och mitt underlag för att skapa den slutgiltiga, djupgående arkitekturen.

**Lycka till.**