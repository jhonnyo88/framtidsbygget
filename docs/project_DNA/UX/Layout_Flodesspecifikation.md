Samlad Layout- & Flödesspecifikation: Framtidsbygget
Version: 1.0 Status: Slutgiltig Blueprint Syfte: Att fungera som den övergripande, visuella ritningen för hela applikationen "Framtidsbygget". Detta dokument specificerar hur alla tidigare definierade komponenter och moduler ska komponeras på skärmen (layout) och i vilken ordning användaren möter dem (flöde). Det är det primära styrdokumentet för att förstå spelets struktur och användarresa.
DEL 1: Applikationens Kärnflöde
Detta flödesschema visualiserar den huvudsakliga användarresan, "the core loop", från start till mål. Det visar hur de olika vyerna och modulerna hänger ihop och anropar varandra.
graph TD
    subgraph App.jsx - Huvudlogik
        A[Start / Ladda Sida] --> B{Har spelaren slutfört onboarding?};
        B -- Nej --> C[Visa OnboardingFlow];
        B -- Ja --> E[Visa MainDashboard];

        C --> D{Onboarding Slutförd};
        D --> E;

        E -- Klick på uppdrag --> F[Visa valt Minispel];
        F -- Spelet slutförs --> G[anropa onGameComplete(result)];
        G --> H{Visa ResultModal med 'result'};
        H -- Klick på "Fortsätt" --> E;

        E -- Alla uppdrag klara --> I[Visa FinaleSequence];
        I -- Klick på "Spela igen" --> A;
    end

    subgraph Referensdokumentation
        R1[DEL 2.4: Onboarding-sekvens]
        R2[DEL 2.1: Huvudnavet]
        R3[DEL 3.1 - 3.5: Minispelen]
        R4[DEL 2.3: Resultat & Progression]
        R5[DEL 2.5: Finalen]
    end

    C --- R1;
    E --- R2;
    F --- R3;
    H --- R4;
    I --- R5;


DEL 2: Layout-ritningar & Komposition
Denna del innehåller textbaserade "wireframes" (layout-schematik) för varje unik vy i applikationen. Varje schema refererar till de detaljerade komponent-specifikationerna för att ge en komplett bild.
2.1 Huvudnavet (MainDashboard.jsx)
Referens: Specifikation DEL 2.1
<MainDashboardContainer (display: flex; flex-direction: column; height: 100vh;)>

  <HeaderContainer (padding: var(--space-xl); border-bottom: 1px solid #EAECEF;)>
    <!-- display: flex; justify-content: space-between; align-items: center; -->
    <Title (<h1>Framtidsbygget</h1>)>
    <CompassButton (<Button variant="secondary">)>
  </HeaderContainer>

  <ContentContainer (flex-grow: 1; display: flex; padding: var(--space-xl); gap: var(--space-xl);)>
    <!-- Denna container använder Flexbox för att skapa två huvudkolumner -->

    <LeftColumn (width: 30%;)>
      <Scoreboard /> <!-- Se Spec DEL 2.1 -->
    </LeftColumn>

    <RightColumn (width: 70%;)>
      <MapView /> <!-- Se Spec DEL 2.1 -->
    </RightColumn>

  </ContentContainer>

</MainDashboardContainer>


2.2 Generisk Minispels-vy (Exempel: PuzzleGameModule.jsx)
Referens: Specifikation DEL 3.1 (Reviderad)
<MinigameModuleContainer (display: flex; flex-direction: column; height: 100vh;)>

    <GameHUD (padding: var(--space-m) var(--space-xl); background: #FFF; border-bottom: 1px solid #EAECEF;)>
        <!-- display: flex; justify-content: space-between; align-items: center; -->
        <Uppdragsnamn>
        <Instruktionstext>
        <BudgetDisplay>
    </GameHUD>

    <GameBoard (flex-grow: 1; display: grid; grid-template-columns: 1fr 1fr 1fr; padding: var(--space-xl); gap: var(--space-xl);)>
        <!-- Detta är huvudytan för spelet. Innehåller spelets unika komponenter. -->
        <SourceColumn>
            <DataNode />
            <DataNode />
        </SourceColumn>
        <InfrastructureColumn>
            <EnaHub />
            <Firewall />
        </InfrastructureColumn>
        <InternalColumn>
            <DataNode />
        </InternalColumn>
    </GameBoard>

</MinigameModuleContainer>


2.3 Resultat-modalen (ResultModal.jsx)
Referens: Specifikation DEL 2.3
<ModalBackdrop (position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;)>

    <Card (width: 500px; max-width: 90%;)>
        <!-- display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-l); -->

        <Icon (storlek: 48px)>
        <Title (<h1>)>
        <ScoreDisplay (<p>)>
        <OutcomeDescription (<p>)>

        <UnlockedProgressSection (om nya synergier/insikter finns)>
            <SectionTitle (<h2>)>
            <List (<ul>)>
        </UnlockedProgressSection>

        <ContinueButton (<Button variant="primary">)>

    </Card>

</ModalBackdrop>


2.4 Onboarding-överlägg
Referens: Specifikation DEL 2.4
<OnboardingOverlay (position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 999;)>

    <Backdrop (bakgrundsfärg som tonar ner, med ett "hål" (via clip-path) som highlightar en specifik UI-komponent)>
    </Backdrop>

    <Tooltip (position: absolute; placeras bredvid det highlightade elementet)>
        <!-- En liten <Card> som innehåller en textbeskrivning -->
        <TooltipText (<p>)>
    </Tooltip>

</OnboardingOverlay>


2.5 Final-sekvensen (FinaleSequence.jsx)
Referens: Specifikation DEL 2.5
<FinaleContainer (display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: var(--space-xxl);)>

    <!-- Vyn ändras baserat på `finaleStep`-state -->

    <!-- Exempel: Steget 'choice' -->
    <Title (<h1>Rapport till Nationen</h1>)>
    <Subtitle (<p>Vilken av dina framgångar vill du lyfta fram?</p>)>
    <ChoicesContainer (display: flex; gap: var(--space-xl); margin-top: var(--space-xl);)>
        <ChoiceCard /> <!-- Se Spec DEL 2.5 -->
        <ChoiceCard /> <!-- Se Spec DEL 2.5 -->
    </ChoicesContainer>

    <!-- Exempel: Steget 'final_score' -->
    <Title (<h1>Ditt Strategiska Avtryck</h1>)>
    <ScoreDisplay (<h2>)>
    <AnimatedBarChart /> <!-- Se Spec DEL 2.5 -->
    <LeadershipProfile (<h3>)>
    <SummaryText (<p>)>
    <ButtonContainer (display: flex; gap: var(--space-m); margin-top: var(--space-xl);)>
        <Button variant="secondary">
        <Button variant="primary">
    </ButtonContainer>

</FinaleContainer>


