Master UX/UI Specifikation: Framtidsbygget
Version: 1.1 Status: Levande Dokument
DEL 2: Ramverkets Komponenter
2.4 Onboarding-sekvens (OnboardingFlow)
Referensdokumentation:
Master GDD: Den kompletta specifikationen för Framtidsbygget [cite: 268-269] (Definierar den stegvisa logiken).
Arkitektur som Tekniskt Kontrakt (Beskriver hur vyer kan bytas ut).
Syfte: Att skapa en tvingande, guidad introduktion för en ny spelare. Sekvensen ska sömlöst introducera spelarens roll, huvudnavet (MainDashboard), det centrala verktyget (DigitalaKompassen) och hur man startar sitt första uppdrag. Målet är att ge spelaren självförtroende och en klar förståelse för spelets "core loop".
Implementation & Logik:
Onboarding-sekvensen är inte en enskild React-komponent, utan en logisk "state machine" som styrs från App.jsx.
Denna logik baseras på värdet av gameState.onboardingStatus, som kan vara: 'not_started', 'step_2_compass', 'step_3_node', 'step_4_mission', 'completed'.
Beroende på status, renderas olika överlägg (overlays), spotlights och verktygstips ovanpå de existerande ramverkskomponenterna.
2.4.1 Steg 1: Välkomstmodal
Villkor: gameState.onboardingStatus === 'not_started'
Layout: En modal (<Card>) visas centrerat på skärmen. Bakgrunden (MainDashboard) är nedtonad med en mörk, halvtransparent backdrop (rgba(0,0,0,0.5)).
Innehåll:
Rubrik (<h1>): "Välkommen, Digital Strateg". Stil: heading-l.
Text (<p>): "Sveriges digitala framtid vilar på dina axlar. I din roll kommer du att omsätta nationella strategier till praktisk verklighet genom en serie avgörande uppdrag. Ditt mål är att stärka landets digitala infrastruktur, kompetens och innovationsförmåga." Stil: body-l.
Text (<p>): "Är du redo att börja bygga framtiden?" Stil: body-l.
Interaktion:
En enda <Button> (primär-variant) med texten "[Jag är redo]".
Vid klick: onboardingStatus uppdateras till 'step_2_compass'.
2.4.2 Steg 2: Peka ut Kompassen
Villkor: gameState.onboardingStatus === 'step_2_compass'
Layout: MainDashboard visas. Ett "spotlight"-överlägg tonar ner hela skärmen förutom knappen "[Min Kompass]" i headern.
Highlighting:
Knappen "[Min Kompass]" är fullt synlig och har en pulserande CSS-animation på sin box-shadow för att dra till sig blicken.
Ett verktygstips (<Tooltip>) pekar mot knappen med texten: "Detta är din Digitala Kompass, ditt viktigaste verktyg för att förstå strategin. Klicka för att öppna."
Interaktion:
Endast knappen "[Min Kompass]" är klickbar.
Vid klick: Vyn byts till DigitalaKompassen.jsx, och onboardingStatus uppdateras till 'step_3_node'.
2.4.3 Steg 3: Första Insikten i Kompassen
Villkor: gameState.onboardingStatus === 'step_3_node'
Layout: DigitalaKompassen-vyn är aktiv. Ett "spotlight"-överlägg tonar ner hela träd-visualiseringen förutom den centrala rot-noden.
Highlighting:
Rot-noden är fullt synlig och har en pulserande animation.
Ett verktygstips pekar mot noden med texten: "Varje nod är en del av strategin. Klicka på den markerade noden för att se detaljer."
Interaktion:
Endast den markerade noden är klickbar.
Vid klick: Informationspanelen till höger fylls med informationen för den valda noden. Kompassen stängs därefter automatiskt och onboardingStatus uppdateras till 'step_4_mission'.
2.4.4 Steg 4: Välj Första Uppdraget
Villkor: gameState.onboardingStatus === 'step_4_mission'
Layout: Spelaren är tillbaka på MainDashboard. Ett "spotlight"-överlägg tonar ner hela kartan förutom den första uppdragsnoden (den som är i 'unlocked'-status).
Highlighting:
Den första uppdragsnoden är fullt synlig och har sin pulserande animation.
Ett verktygstips pekar mot noden med texten: "Bra! Nu är det dags för ditt första uppdrag. Genom att lösa uppdragen omsätter du strategin i praktiken. Klicka för att börja."
Interaktion:
Endast den markerade uppdragsnoden är klickbar.
Vid klick: onboardingStatus uppdateras till 'completed'. Onboarding-sekvensen är över och det valda minispelet startas. Alla överlägg och spotlights tas bort permanent.
