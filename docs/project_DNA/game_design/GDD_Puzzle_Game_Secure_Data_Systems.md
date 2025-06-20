# Game Design Document: Pusselspelet "Säker Datasystem"

**Version:** 1.0  
**Status:** Klar för teamgranskning & implementation  
**Spelvärld:** Digitalisering av den offentliga förvaltningen  

---

## 1. Projektöversikt & Vision

Detta dokument beskriver den första spelbara modulen, "Säker Datasystem", i det webbaserade lärandespelet "Framtidsbygget". Modulen fungerar som vårt "vertical slice" – ett komplett exempel från start till mål som testar vår arkitektur, designprocess och förmåga att omsätta Sveriges digitaliseringsstrategi till en interaktiv upplevelse.

**Vision:** Spelaren ska inte bara läsa om utmaningarna med en fragmenterad förvaltning; de ska lösa dem. Genom att lyckas med pusslet ska spelaren få en "aha-upplevelse" om hur principerna i strategin leder till konkret medborgarnytta, ökad säkerhet och effektivitet.

## 2. Spelkoncept & Spelupplevelse

Spelaren axlar rollen som digital strateg på den fiktiva "Myndigheten för Samhällsutveckling" (FMS). Ett uppdrag landar på skrivbordet: medborgare och företag klagar högljutt på att de måste fylla i samma uppgifter i flera olika system. Uppdraget är att designa ett sammanhängande, säkert och effektivt informationsflöde med hjälp av den nationella digitala infrastrukturen Ena.

Spelupplevelsen är ett visuellt pussel som liknar en tunnelbanekarta eller ett flödesschema. Genom att dra anslutningar mellan olika system känner sig spelaren som en arkitekt som bygger framtidens digitala förvaltning – nod för nod.

## 3. Lärandemål (Härledda från Digitaliseringsstrategin)

Efter att ha slutfört modulen ska spelaren ha en praktisk förståelse för:

### Värdet av en gemensam infrastruktur
Förstå varför en central plattform som Ena är avgörande för att skapa en sammanhållen förvaltning och undvika isolerade "stuprörslösningar" (Strategin, s. 23, 27).

### Balansen mellan öppenhet och säkerhet
Aktivt kunna identifiera och skydda känslig information (personuppgifter) för att bygga trygga tjänster och följa lagkrav som GDPR (Strategin, s. 21, 23, 26).

### Nödvändigheten av modernisering
Inse att interoperabilitet och datadelning kräver investeringar för att standardisera och modernisera äldre, befintliga system (Strategin, s. 21, 28).

### Data som grund för AI
Förstå att ett välstrukturerat och tillgängligt dataflöde är en fundamental förutsättning för att kunna effektivisera verksamheten med AI och datadriven utveckling (Strategin, s. 21, 26).

## 4. Pedagogisk Design & Strategikarta

Detta är den centrala kopplingen mellan strategin och spelet. Varje mekanik är en direkt översättning av en strategisk princip.

| **Strategins Kärnprincip** | **Källhänvisning (Sida)** | **Översättning till Spelmekanik (Regel i spelet)** | **Syfte & Lärande** |
|---|---|---|---|
| **Gemensam digital ingång & Ena som plattform** | 22, 23, 27 | Alla anslutningar måste gå via den centrala "Ena-hubben". Direktkopplingar mellan externa och interna system är omöjliga. | Tvingar spelaren att förstå och använda den centrala infrastrukturen, vilket speglar målet om en samlad förvaltning istället för stuprör. |
| **Säkra, trygga & användarvänliga tjänster** | 21, 23, 26 | Vissa datanoder innehåller "Personuppgifter" (markerade med en P-ikon). Anslutningskablar från dessa noder får inte dras genom "Brandväggar" (markerade med en sköld-ikon). | Spelaren måste aktivt identifiera risker och fatta medvetna beslut för att skydda integriteten, vilket konkretiserar den viktiga avvägningen mellan datadelning och säkerhet. |
| **Långsiktigt hållbar systemförsörjning & modernisering** | 21, 24, 28 | Vissa datanoder är "Gamla system" (visuellt föråldrade). För att ansluta dem måste spelaren först betala en kostnad från sin budget för att "Modernisera & Standardisera" noden. | Simulerar den verkliga utmaningen och kostnaden med teknisk skuld. Spelaren lär sig att digitalisering är en investering, inte bara en teknisk koppling. |
| **Effektivare AI- & datadriven utveckling** | 21, 26 | Ett av de interna systemen, "Analysavdelningen", ger en stor bonus (Innovationspoäng) men kräver data från minst tre olika, säkra källor för att aktiveras. | Visar att avancerad funktionalitet som AI är direkt beroende av ett rikt och välfungerande dataflöde. Det motiverar spelaren att bygga en robust grund. |

## 5. Specifikation för "Level 1"

Detta definierar det exakta innehållet för den första spelbara versionen.

### Spelplanens Noder:

#### Externa Källor (vänster):
- **Skatteverket:** Innehåller Personuppgifter. (Modern)
- **Bolagsverket:** Innehåller Organisationsdata. (Modern)
- **Försäkringskassan:** Innehåller Personuppgifter. (Modern)
- **Lantmäteriet:** Innehåller Organisationsdata. (Gammalt system)

#### Interna System (höger):
- **Tillståndsenheten:** Behöver data från 1 Personuppgiftskälla och 1 Organisationsdatakälla
- **Analysavdelningen:** Behöver data från minst 3 unika källor för att aktivera AI-bonus
- **Medborgarservice:** Behöver data från 1 Personuppgiftskälla

### Regler & Kostnader för Level 1:
- En "Brandvägg" finns på den primära anslutningsvägen från Försäkringskassan
- Kostnad för att modernisera Lantmäteriet: 50 budgetenheter
- **Vinstvillkor:** Alla tre interna system har fått den data de behöver enligt reglerna

## 6. Användarresa (Exempel på Spelflöde)

1. **Intro:** Spelaren möts av en kort text: "Vår generaldirektör är orolig. Medborgare klagar på krångliga processer. Använd Ena för att skapa ett sammanhängande dataflöde!"

2. **Första draget:** Spelaren ser spelplanen. Drar en kabel från `Skatteverket` → `Ena-hubb` → `Tillståndsenheten`. Anslutningen lyser grönt. Framsteg!

3. **Möter hinder (Brandvägg):** Spelaren försöker ansluta `Försäkringskassan` till `Medborgarservice` via den genaste vägen. Kabeln blir röd och en varningsikon (sköld) blinkar vid brandväggen. Spelaren måste hitta en annan, säker väg runt hindret.

4. **Möter hinder (Modernisering):** Spelaren försöker ansluta `Lantmäteriet`. Anslutningen är blockerad och ett meddelande visas: "Systemet är föråldrat och måste standardiseras. Kostnad: 50 budget." Spelaren klickar på noden, budgeten dras, och noden får ett modernt utseende. Nu kan den anslutas.

5. **Strategiskt val:** Spelaren inser att `Tillståndsenheten` nu är klar, men för att klara pusslet och få AI-bonusen måste fler system anslutas.

6. **Vinst:** När alla krav är uppfyllda spelas en vinstanimation. Data flödar genom hela systemet, och en resultatskärm visas:

```
Uppdraget slutfört!
Medborgarnöjdhet: +50 poäng
Säkerhet: +100 poäng
Innovation (AI-bonus): +150 poäng
Total poäng: 300

"Genom att bygga en säker och sammanhållen infrastruktur 
har du lagt grunden för en smartare förvaltning. Bra jobbat, strateg!"
```

## 7. Tekniskt Kontrakt & Gränssnitt

Modulen ska implementeras som `PuzzleGameModule.jsx` och följa det tekniska kontrakt som definierats i arkitekturdokumentet.

### Ingående Data (Props):
- `onGameComplete`: Function
- `initialBudget`: Number

### Utgående Händelser (Callback `onGameComplete`):
- **Vid vinst:** `onGameComplete({ success: true, score: Number, budgetChange: Number, ... })`
- **Vid avbrott:** `onGameComplete({ success: false, score: 0, budgetChange: 0 })`

## 8. Visuell Design & Ljud (Brief till Kreatörer)

### Stil
Rent, minimalistiskt, schematiskt. Tänk en modern, interaktiv infografik. Undvik plotter. Professionellt men inte tråkigt.

### Färgpalett
- **Bas:** Blå och vita nyanser
- **Framgång/korrekt:** Grönt
- **Fel/blockering:** Rött
- **Varningar/kostnader:** Gult/Orange

### Ikonografi (Kräver design):
- **Personuppgift:** Enkel stiliserad figur/ID-kort
- **Organisationsdata:** Enkel stiliserad byggnad/dokumentpärm
- **Brandvägg:** En tydlig sköld-ikon
- **Gammalt System:** Gråaktig, pixlig eller "rostig" textur på noden
- **Modernt System:** Ren, ljus färg
- **AI-bonus:** En glödande hjärna/chip-ikon som tänds

### Animationer
Mjuka, följsamma övergångar. En pulserande ljuseffekt ska färdas längs en korrekt dragen kabel. Vinstanimationen ska vara kort men tillfredsställande.

### Ljud
Subtilt och responsivt. Ett mjukt "klick" för lyckad anslutning. Ett diskret, lågfrekvent "fel-buzz" för blockering. En kort, upplyftande fanfar vid vinst.