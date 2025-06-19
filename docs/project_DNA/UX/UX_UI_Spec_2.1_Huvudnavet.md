Master UX/UI Specifikation: Framtidsbygget
Version: 1.1 Status: Levande Dokument
DEL 2: Ramverkets Komponenter
Denna del beskriver designen för de övergripande komponenterna som utgör spelets "skal". Dessa komponenter hanterar den globala spelarresan, progressionen och navigeringen mellan minispelen.
2.1 Huvudnavet (MainDashboard.jsx)
Referensdokumentation:
Arkitektur som Tekniskt Kontrakt
Master GDD: Den kompletta specifikationen för Framtidsbygget [cite: 236-237]
Samlad Designleverans för UX-bearbetning
Syfte: Att fungera som applikationens centrala hemskärm när inget minispel är aktivt. Den ska ge spelaren en omedelbar överblick över sin progression och vara den självklara startpunkten för att välja uppdrag.
2.1.1 Struktur & Layout
Implementation: MainDashboard.jsx ska använda en fullskärmslayout, förslagsvis med CSS Flexbox eller Grid för att skapa två huvudkolumner.
Globalt Mellanrum: Ett genomgående padding på var(--space-xl) ska appliceras på den yttre containern för att ge gränssnittet luft.
Layout:
Header (Övre Sektion): En 100% bred sektion högst upp.
Huvudinnehåll (Två kolumner): Under headern delas ytan.
Vänster Kolumn (Scoreboard.jsx): Ska uppta ca 30% av bredden.
Höger Kolumn (MapView.jsx): Ska uppta ca 70% av bredden, med ett mellanrum (gap) på var(--space-xl) mellan kolumnerna.
2.1.2 Header
Syfte: Att innehålla spelets titel och den primära navigeringen till "Den Digitala Kompassen".
Struktur: En flex-container med justify-content: space-between och align-items: center.
Komponenter:
Titel: <h1>Framtidsbygget</h1>
Stil: Använder CSS-klassen heading-xl.
Knapp: "Min Kompass"
Komponent: <Button> från kärnkomponenterna (se 1.5.1).
Variant: Sekundär.
Innehåll: En <Ikon>-komponent med ikonen explore från Material Symbols, följt av texten "Min Kompass".
2.1.3 Komponent: Poängtavla (Scoreboard.jsx)
Referens: Arkitektur som Tekniskt Kontrakt (definierad som "dum" presentationskomponent).
Syfte: Att på ett tydligt och överskådligt sätt presentera spelarens nuvarande status och progression.
Props: Tar emot gameState som en prop för att hämta all data.
Struktur: Renderas som en <Card>-komponent (se 1.5.2). Inuti kortet används en vertikal flex-layout med ett gap på var(--space-l).
Innehåll & Specifikationer:
Rubrik: <h2>Lägesrapport</h2>
Stil: Klassen heading-m.
Nyckeltal: Total Poäng
Etikett (<p>): "FL-POÄNG". Stil: label. Färg: var(--color-text-secondary).
Värde (<p>): Värdet från gameState.totalFLScore, formaterat med tusentalsavgränsare. Stil: heading-l. Färg: var(--color-brand-primary).
Nyckeltal: Avklarade Uppdrag
Etikett (<p>): "UPPDRAG AVKLARADE". Stil: label.
Värde (<p>): Dynamisk text, t.ex. "2 av 5". Antalet hämtas från längden på gameState.completedWorlds-arrayen. Stil: body-m.
Lista: Upplåsta Synergier
Etikett (<p>): "UPPLÅSTA SYNERGIER". Stil: label.
Värde: En <ul>-lista som renderar en <li> för varje synergy i gameState.unlockedSynergies som är true. Varje <li> innehåller en <Ikon> (check_small) och namnet på synergin (t.ex. "Empatisk Träning"). Stil: body-m.
2.1.4 Komponent: Världskarta (MapView.jsx)
Referens: Master GDD (beskriver visuella progressionen).
Syfte: Att rendera den interaktiva kartan över Sverige och agera som det primära gränssnittet för att välja uppdrag.
Props: Tar emot gameWorlds (en array av världsobjekt) och onSelectWorld (en callback-funktion).
Struktur: Renderas som en <Card>-komponent som fyller hela den högra kolumnen. Inuti finns en SVG-representation av en schematisk Sverigekarta. Ovanpå denna SVG placeras absolut-positionerade <Button>-komponenter som representerar uppdragsnoderna.
Interaktivitet & Nod-status (per värld i gameWorlds-propen):
Om status === 'locked':
Utseende: Knappen är i disabled-tillstånd. Innehåller endast en <Ikon> med lock.
Interaktivitet: Ej klickbar. En tooltip visar texten "Låst".
Om status === 'unlocked':
Utseende: Knappen är i primär-variant. En pulserande CSS-animation (@keyframes pulse) ska appliceras på knappens box-shadow för att dra till sig uppmärksamhet.
Interaktivitet: Klickbar. Vid klick anropas props.onSelectWorld(world.id). En tooltip visar världens namn (t.ex. "Pusselspelet: Säker Datasystem").
Om status === 'completed':
Utseende: Knappen är i disabled-tillstånd men stylad med en grön bakgrund (var(--color-state-success)). Innehåller en <Ikon> med check_circle.
Interaktivitet: Ej klickbar. En tooltip visar världens namn och texten "(Avklarad)".
Visuell Progression (Animation):
Referens: Master GDD.
Implementation: När gameWorlds-propen uppdateras och en ny värld får status completed, ska en animerad SVG <path> ritas på kartan.
Teknisk specifikation: Sökvägen ska ha stroke-dasharray och stroke-dashoffset satta till sin egen längd. En CSS-animation ska sedan animera stroke-dashoffset till 0 över 1.5 sekunder. Detta skapar en "ritande" effekt som ger belönande feedback.
