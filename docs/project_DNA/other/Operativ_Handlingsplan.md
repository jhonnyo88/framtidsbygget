Framtidsbygget: Operativ Handlingsplan för AI-driven Utveckling
Version: 4.0 (Slutgiltig)
Syfte: Att fungera som den enda, definitiva operativa handboken för den tekniska projektledaren. Detta dokument beskriver den dagliga processen, rollfördelningen, utvecklingsordningen och kvalitetssäkringen för att framgångsrikt realisera "Framtidsbygget" med ett team av specialiserade AI-agenter.
1. Etablering: Förutsättningar för Framgång
Innan utvecklingen påbörjas måste den tekniska projektledaren etablera följande grund:
Kod-repository (Git): Skapa ett nytt repository (t.ex. på GitHub). Etablera en huvud-branch (main) och en utvecklings-branch (develop). All ny utveckling sker i feature-branches.
Teknisk Miljö: Sätt upp ett lokalt React-projekt med Vite. Installera grundläggande bibliotek för testning (jest, @testing-library/react), och ett bibliotek för diagram (recharts).
AI-Agenter: Konfigurera tre separata terminaler/miljöer för AI-agenterna, var och en med en tydlig system-prompt som definierar dess roll.
Backend (Firebase): Skapa ett nytt Firebase-projekt. Hämta konfigurationsobjektet och spara det säkert som en miljövariabel i projektet.
Dokumentationsindex: Bekräfta att dokumentation_index.md är skapat och komplett. Detta är den centrala kartan som länkar varje modul i denna handlingsplan till dess detaljerade specifikationer. All referens till "specifikationen" i denna handlingsplan avser de dokument som länkas från detta index.
2. AI-Teamets Roller och Ansvar
Projektet bemannas av en mänsklig projektledare och tre specialiserade AI-agenter.
Roll: Teknisk Projektledare (Människa)
Ansvar: Att orkestrera hela processen. Väljer nästa komponent från backloggen, sammanställer "Utvecklingspaket", delegerar uppgifter till AI-agenterna, granskar och godkänner leveranser, och slår samman färdig kod.
Agent 1: Komponent-Utvecklaren (developer-ai)
Ansvar: Skriver ren, funktionell och välstrukturerad React-kod.
Input: Ett "Utvecklingspaket".
Output: En .jsx-fil med den färdiga komponenten.
Agent 2: Kvalitets-Ingenjören (tester-ai)
Ansvar: Skriver precisa enhetstester som verifierar att en komponent beter sig exakt enligt sitt kontrakt.
Input: Samma "Utvecklingspaket".
Output: En .test.js-fil med tester skrivna i Jest & React Testing Library.
Agent 3: Integrations-Assistenten (integrator-ai)
Ansvar: Hanterar "tråkig" men kritisk kodadministration. Skapar Storybook-filer för visuell testning och hanterar import/export-logik.
Input: En godkänd .jsx-fil.
Output: En .stories.js-fil för komponenten samt uppdaterade index.js-filer i projektet.
3. Utvecklingscykeln: Från Uppgift till Godkänd Komponent
Varje komponent utvecklas genom följande rigorösa, sex-stegs process. Inget steg får hoppas över.
Steg 1: Val & Paket-skapande
Den tekniska projektledaren väljer nästa komponent från Utvecklingsordningen (se sektion 5) och skapar ett komplett "Utvecklingspaket" enligt mallen i vår tidigare diskussion.
Steg 2: Parallell Delegering
Projektledaren öppnar tre terminaler och ger följande, samtidiga uppdrag:
Till developer-ai: "Här är Utvecklingspaketet för [KomponentNamn]. Skriv koden i [KomponentNamn].jsx."
Till tester-ai: "Här är Utvecklingspaketet för [KomponentNamn]. Skriv enhetstester för kontraktet i [KomponentNamn].test.js."
Till integrator-ai: "Här är Utvecklingspaketet för [KomponentNamn]. Förbered en Storybook-fil, [KomponentNamn].stories.js, som renderar komponenten i dess olika tillstånd enligt specifikationen."
Steg 3: Lägesrapportering
När en agent slutfört sitt uppdrag, ska den rapportera tillbaka med en enkel, standardiserad fras:
Statusrapport: Uppdrag [Uppdragsnamn] slutfört. Output: [filnamn]. Inga fel uppstod.
Steg 4: Automatiserad Kvalitetskontroll
Projektledaren tar emot .jsx- och .test.js-filerna. Testsviten körs (npm test).
Om testerna passerar: Gå vidare till Steg 5.
Om testerna misslyckas: Analysera felmeddelandet. Ge felmeddelandet som feedback till den agent som troligtvis orsakat felet (oftast developer-ai) med instruktionen: "Ditt tidigare arbete för [KomponentNamn] misslyckades i den automatiska kvalitetssäkringen. Här är felrapporten. Korrigera din kod." Upprepa tills testerna passerar.
Steg 5: Manuell Validering (Smoke Test)
Projektledaren tar emot .stories.js-filen och startar Storybook (npm run storybook). Här utförs ett manuellt "smoke test":
Visuell Granskning: Ser komponenten ut exakt som i UX-specifikationen? Används rätt färger, typsnitt och marginaler?
Interaktiv Granskning: Går det att interagera med komponenten? Fungerar hover-effekter och klick-händelser som förväntat?
Detta är din chans att manuellt "känna" på komponenten i en isolerad miljö innan den integreras i den större applikationen.
Steg 6: Godkännande och Integration
När alla tester (automatiska och manuella) är godkända, anses komponenten vara "Done". Projektledaren slår samman den nya koden från feature-branchen till develop-branchen och arkiverar Utvecklingspaketet. Processen upprepas för nästa komponent.
4. Är Modulerna Tillräckligt Definierade?
Ja. Varje modul/komponent som listas i Utvecklingsordningen nedan har en direkt motsvarighet i den detaljerade UX/UI-specifikationen. När projektledaren skapar ett Utvecklingspaket kommer referensen till dokumentation_index.md att ge den exakta länken till rätt specifikationsdokument, vilket säkerställer att kontexten alltid är tydlig och avgränsad.
5. Utvecklingsordning (Backlog)
Utvecklingen sker i följande ordning för att bygga applikationen från grunden och utåt, vilket minimerar beroenden och risker.
Fas 1: Grund & Ramverk
Mål: Etablera en körbar app med ett fungerande designsystem och testmiljö.
Projektstruktur & Designsystem: Sätt upp repo, Vite, CSS-fil med alla variabler.
Storybook Setup: Installera och konfigurera Storybook.
Kärnkomponenter: Button.jsx, Card.jsx, Meter.jsx. Bygg och verifiera dessa i Storybook.
FirebaseService.js: Bygg och enhetstesta modulen.
Fas 2: Huvudnavet (The Main Hub)
Mål: Skapa den centrala, statiska vyn av spelet.
5. Scoreboard.jsx
6. MapView.jsx
7. MainDashboard.jsx (Komponerar de två föregående enligt layout-spec.)
8. App.jsx (Grundläggande version som renderar MainDashboard och hanterar state.)
Fas 3: Kritiska Flöden
Mål: Implementera de viktigaste övergripande interaktionerna.
9. DigitalaKompassen.jsx
10. ResultModal.jsx
11. OnboardingFlow (Implementera logiken och överläggen för detta.)
Fas 4: Minispel
Mål: Bygga ut spelets kärninnehåll, ett spel i taget.
12. GameCanvasWrapper.jsx (En kritisk, återanvändbar komponent för PixiJS-spelen.)
13. PuzzleGameModule.jsx (Relativt låg komplexitet, bra startpunkt.)
14. WelfareGameModule.jsx (Dialogbaserat, ingen canvas.)
15. CompetenceGameModule.jsx (Kortbaserat, ingen canvas.)
16. ConnectivityGameModule.jsx (Hög komplexitet, använder GameCanvasWrapper.)
17. EcosystemGameModule.jsx
Fas 5: Finalen
Mål: Skapa den avslutande upplevelsen.
18. FinaleSequence.jsx
Denna handlingsplan utgör den kompletta och slutgiltiga guiden för projektets genomförande.
