Master UX/UI Specifikation: Framtidsbygget
Version: 1.1 Status: Levande Dokument
DEL 2: Ramverkets Komponenter
2.3 Resultat & Progression (ResultModal.jsx)
Referensdokumentation:
Master GDD: Den kompletta specifikationen för Framtidsbygget [cite: 236-237] (Definierar poängberäkning och synergier).
Arkitektur som Tekniskt Kontrakt (Beskriver handleGameComplete(result)-flödet).
Samlad Designleverans för UX-bearbetning (Betonar "Belönande Feedback").
Syfte: Att fungera som en modal vy som visas omedelbart efter att ett minispel har avslutats. Dess syfte är att på ett tydligt, engagerande och pedagogiskt sätt presentera resultatet av spelarens insats och visa vilka framsteg som har gjorts i det övergripande spelet.
2.3.1 Struktur & Layout
Implementation: Komponenten ska renderas som en modal som lägger sig över MainDashboard.jsx. En mörk, halvtransparent backdrop (rgba(0,0,0,0.5)) ska täcka bakgrunden för att skapa fokus. Modalen i sig ska vara en <Card>-komponent.
Layout: En centrerad, vertikal layout inuti kortet. Allt innehåll ska vara centrerat.
Animation:
Modalen ska animera in med en kombination av scale och opacity (transform: scale(0.9) opacity: 0 till transform: scale(1) opacity: 1) över 0.3s.
Poängen ska animeras genom att räkna upp från 0 till det slutgiltiga värdet över 1.5s för att skapa en känsla av belöning.
2.3.2 Vyer & Innehåll (Baserat på result.success)
Komponentens innehåll styrs av success-värdet i result-objektet som tas emot från det avslutade minispelet.
Vy 1: Uppdraget Lyckades (result.success === true)
Header:
Ikon: task_alt från Material Symbols. Storlek: 48px. Färg: var(--color-state-success).
Rubrik (<h1>): "UPPDRAG SLUTFÖRT!". Stil: heading-l.
Poängsektion:
Etikett (<p>): "FL-POÄNG". Stil: label.
Värde (<p>): Det slutgiltiga poängvärdet (från result.scoreAwarded). Stil: heading-xl. Färg: var(--color-brand-primary). Ska ha en uppräkningsanimation.
Resultat-sammanfattning (<p>):
En kort, dynamisk text som beskriver utfallet från minispelet (från result.outcome). Exempel: "Du nådde en konsensuslösning som balanserar allas behov." Stil: body-l.
Upplåsta Framsteg (Renderas villkorligt):
Om result.unlockedSynergies innehåller nya objekt, visas en sektion:
Rubrik (<h2>): "SYSTEMUPPDATERING: NY SYNERGI". Stil: heading-m.
Lista (<ul>): Varje ny synergi renderas som en <li> med ikon (add_circle) och namn.
Om result.unlockedCompassNode inte är null, visas en sektion:
Rubrik (<h2>): "NY INSIKT I KOMPASSEN". Stil: heading-m.
Text (<p>): Namnet på den upplåsta kompass-noden.
Knapp:
En <Button> (primär-variant) med texten "Fortsätt". Vid klick stängs modalen.
Vy 2: Uppdraget Misslyckades (result.success === false)
Header:
Ikon: error från Material Symbols. Storlek: 48px. Färg: var(--color-state-danger).
Rubrik (<h1>): "UPPDRAGET KRÄVER MER ARBETE". Stil: heading-l.
Sammanfattning (<p>):
En text som förklarar varför uppdraget misslyckades, baserat på result.outcome. Exempel: "Implementeringsstopp: Intressenterna kunde inte enas. Försök hitta en bättre balans nästa gång." Stil: body-l.
Knapp:
En <Button> (sekundär-variant) med texten "Försök Igen". Vid klick stängs modalen och spelaren kan välja samma uppdrag på nytt från kartan.
2.3.3 Dataflöde & Användarresa
Ett minispel avslutas och anropar props.onGameComplete(result). result-objektet innehåller { success, scoreAwarded, outcome, unlockedSynergies, unlockedCompassNode }.
App.jsx tar emot resultatet, uppdaterar gameState och sätter ett state showResultModal = true.
ResultModal.jsx renderas och tar emot result-objektet som prop.
Modalen visar antingen "Lyckades"- eller "Misslyckades"-vyn baserat på result.success.
Spelaren granskar sina resultat.
Spelaren klickar på "Fortsätt" / "Försök Igen".
App.jsx sätter showResultModal = false.
Spelaren ser nu det uppdaterade MainDashboard.jsx, där poängen i Scoreboard har ökats och den avklarade noden på MapView har uppdaterats med en grön bock och en animerad anslutningslinje.
