# UX/UI Specifikation 2.5: Finale

**Dokument:** Master UX/UI Specifikation: Framtidsbygget  
**Version:** 1.2  
**Status:** Slutgiltig  

---

## Ramverkets Komponenter

## Finalen: "Årsrapporten till Nationen" (FinaleSequence.jsx)

### Referensdokumentation:
- **[Master GDD Complete Specification](../game_design/Master_GDD_Complete_Specification.md)** - [cite: 276-281] (Definierar den stegvisa logiken och den dynamiska analysen)

**Syfte:** Att skapa en elegant, dynamisk och personlig avslutningssekvens som aktiveras när alla fem minispel är slutförda. Sekvensen ska analysera spelarens samlade prestationer, presentera en "årsrapport" som reflekterar spelarens val, och ge ett slutgiltigt betyg på dennes insats som nationell digital strateg.
### Lokal Datamodell & State Management

Modulen `FinaleSequence.jsx` hanterar en intern "state machine" för att styra flödet:

- **`finaleStep`:** `'analyzing' | 'choice' | 'cinematic' | 'final_score'` - Styr vilken del av finalen som visas
- **`analysisResult`:** `Object | null` - Ett objekt som lagrar resultatet av den initiala prestandaanalysen
- **`topArea`:** `{ worldId: 'string', title: 'string', reason: 'string' }` - Det område där spelaren presterade bäst
- **`topAchievement`:** `{ achievementId: 'string', title: 'string', reason: 'string' }` - Den mest signifikanta övergripande bedriften
- **`leadershipStyle`:** `'Innovatör' | 'Humanist' | 'Trygghetsarkitekt' | 'Balanserad Strateg'` - En analys av spelarens fokus
- **`playerChoice`:** `'topArea' | 'topAchievement' | null` - Lagrar spelarens val av vad som ska lyftas fram i rapporten
### Layout & Komponent-sammansättning

Vyn är en fullskärmsupplevelse med en sofistikerad och minimalistisk design, likt en modern, digital årsredovisning. Varje steg i sekvensen har sin egen layout.

#### Steg 1: Analys (`finaleStep === 'analyzing'`)
En enkel skärm med en laddningsanimation och texten "Analyserar dina strategiska insatser...".

#### Steg 2: Val (`finaleStep === 'choice'`)
En centrerad layout som presenterar två val för spelaren.

#### Steg 3: Cinematic (`finaleStep === 'cinematic'`)
En serie helskärmspaneler med text och visualiseringar som tonas in och ut.

#### Steg 4: Slutresultat (`finaleStep === 'final_score'`)
En slutgiltig sammanfattningsskärm.
### Specifikation av Sub-komponenter

#### Val-kort (`<ChoiceCard>`)

**Struktur:** En stor, interaktiv `<Card>` med hover-effekter (se 1.5.2).

**Innehåll (drivs av `analysisResult`):**
- **Ikon:** En stor ikon som representerar valet (t.ex. `military_tech` för `topAchievement`)
- **Rubrik (`<h2>`):** Titeln på prestationen, t.ex. "Exceptionell Dialogledning"
- **Beskrivning (`<p>`):** En motivering, t.ex. "Din förmåga att nå konsensus i 'Välfärdens Dilemma' visar på en djup förståelse för den mänskliga faktorn i digitaliseringen."

#### Animerat Stapeldiagram (`<AnimatedBarChart>`)

**Struktur:** Använder ett diagrambibliotek (t.ex. Recharts) för att rendera en enkel, horisontell stapel.

**Animation:** När komponenten visas ska stapeln animeras från `width: 0%` till den slutgiltiga procentandelen som representerar spelarens poäng, för att skapa en dramatisk effekt.
### Interaktions-loop & Spellogik

#### Start & Analys (`finaleStep: 'analyzing'`)

- Komponenten tar emot hela `gameState` som prop
- En funktion `analyzePerformance(gameState)` anropas

**Logik för `analyzePerformance`:**
- **`topArea`:** Loopa igenom `gameState.completedWorlds`. Den värld med högst `scoreAwarded` väljs
- **`topAchievement`:** Baseras på den mest "värdefulla" upplåsta synergin (t.ex. `synergy_resilient_network` om den är upplåst, annars `synergy_skilled_workforce`, etc.)
- **`leadershipStyle`:** Beräknas baserat på den relativa poängfördelningen mellan minispelen (hög poäng i "Ekosystembyggaren" → `'Innovatör'`, hög i "Välfärdens Dilemma" → `'Humanist'`, etc.)

När analysen är klar, sparas resultatet i `analysisResult`-statet och `finaleStep` sätts till `'choice'`.

#### Valfas (`finaleStep: 'choice'`)

- Två `<ChoiceCard>`-komponenter visas, en för `analysisResult.topArea` och en för `analysisResult.topAchievement`  
- Spelaren klickar på ett av korten. `playerChoice` uppdateras och `finaleStep` sätts till `'cinematic'`

#### Cinematic (`finaleStep: 'cinematic'`)

En serie textpaneler visas, en i taget:

- **Panel 1 (Rubrik):** "Årsrapport: Framtidsbygget [Årtal]"
- **Panel 2 (Dynamisk Inledning):** En text genereras dynamiskt: "Under din tid som nationell digital strateg har Sverige tagit betydande kliv framåt. Ditt ledarskap har präglats av din profil som `[analysisResult.leadershipStyle]`. Särskilt noterbart är `[text baserat på playerChoice]`."
- **Panel 3 (Visualisering):** Visar en elegant visualisering kopplad till valet (t.ex. en stiliserad karta som highlightar en region, eller ikoner för de upplåsta synergierna)

Efter den sista panelen sätts `finaleStep` till `'final_score'`.

#### Slutresultat (`finaleStep: 'final_score'`)

En slutgiltig resultatskärm visas.
### Feedback & Dialogrutor (Exakta Texter)

#### Texter för Valfasen:

- **Övergripande Rubrik:** "Rapport till Nationen"
- **Fråga:** "I din årsrapport till nationen, vilken av dina framgångar vill du lyfta fram som den mest betydelsefulla?"

#### Texter för Slutresultat-skärmen:

- **Rubrik (`<h1>`):** "Ditt Strategiska Avtryck"
- **Slutbetyg (`<h2>`):** "Total FL-Poäng: `[gameState.totalFLScore]`"  
  Detta värde visas i ett `<AnimatedBarChart>`
- **Ledarskapsprofil (`<h3>`):** "Din Ledarskapsprofil: `[analysisResult.leadershipStyle]`"
- **Sammanfattning (`<p>`):** "Ditt arbete har lagt grunden för ett mer digitalt, konkurrenskraftigt och humant Sverige. Utmaningarna fortsätter, men framtiden är ljusare tack vare dina strategiska insatser."

#### Knappar:

- **`<Button variant="secondary">`:** "Se dina utmärkelser" (visar en modal med alla upplåsta achievements)
- **`<Button variant="primary">`:** "[Spela igen]" (återställer spelet)
